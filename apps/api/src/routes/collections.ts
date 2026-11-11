import { and, asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import {
  bookCollectionItems,
  bookCollections,
  books,
  userBooks,
} from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";
import type { AppEnv } from "../types/hono.js";

const COLLECTION_SIZE = 10;

const parseUserBookId = (body: unknown) => {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { userBookId } = body as Record<string, unknown>;
  return typeof userBookId === "string" && userBookId.length > 0
    ? userBookId
    : null;
};

const collectionItemSelection = {
  id: userBooks.id,
  isbn: books.isbn,
  title: books.title,
  author: books.author,
  imageUrl: books.imageUrl,
  position: bookCollectionItems.position,
};

const getCollectionItems = async (collectionId: string) =>
  db
    .select(collectionItemSelection)
    .from(bookCollectionItems)
    .innerJoin(userBooks, eq(bookCollectionItems.userBookId, userBooks.id))
    .innerJoin(books, eq(userBooks.bookId, books.id))
    .where(eq(bookCollectionItems.collectionId, collectionId))
    .orderBy(asc(bookCollectionItems.position));

const getCollectionForUser = async (collectionId: string, userId: string) => {
  const collection = await db
    .select()
    .from(bookCollections)
    .where(
      and(
        eq(bookCollections.id, collectionId),
        eq(bookCollections.userId, userId),
      ),
    )
    .limit(1);

  if (!collection[0]) {
    return null;
  }

  return {
    ...collection[0],
    items: await getCollectionItems(collectionId),
  };
};

const collectionsRouter = new Hono<AppEnv>();

collectionsRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const collection = await db
    .select()
    .from(bookCollections)
    .where(eq(bookCollections.userId, user.id))
    .limit(1);

  if (!collection[0]) {
    return c.json([]);
  }

  return c.json([
    {
      ...collection[0],
      items: await getCollectionItems(collection[0].id),
    },
  ]);
});

collectionsRouter.post("/items", authMiddleware, async (c) => {
  const user = c.get("user");
  const userBookId = parseUserBookId(await c.req.json());

  if (!userBookId) {
    return c.json({ message: "本棚に登録済みの本を指定してください" }, 400);
  }

  const result = await db.transaction(async (tx) => {
    const ownedBook = await tx
      .select({ id: userBooks.id })
      .from(userBooks)
      .where(and(eq(userBooks.id, userBookId), eq(userBooks.userId, user.id)))
      .limit(1);

    if (!ownedBook[0]) {
      return { error: "not-owned" as const };
    }

    const existingCollection = await tx
      .select()
      .from(bookCollections)
      .where(eq(bookCollections.userId, user.id))
      .limit(1);
    const collection =
      existingCollection[0] ??
      (
        await tx.insert(bookCollections).values({ userId: user.id }).returning()
      )[0];

    if (!collection) {
      return { error: "collection" as const };
    }

    const existingItems = await tx
      .select({
        userBookId: bookCollectionItems.userBookId,
        position: bookCollectionItems.position,
      })
      .from(bookCollectionItems)
      .where(eq(bookCollectionItems.collectionId, collection.id));

    if (existingItems.some((item) => item.userBookId === userBookId)) {
      return { error: "already-added" as const };
    }

    if (existingItems.length >= COLLECTION_SIZE) {
      return { error: "full" as const };
    }

    await tx.insert(bookCollectionItems).values({
      collectionId: collection.id,
      userBookId,
      position: Math.max(0, ...existingItems.map((item) => item.position)) + 1,
    });
    await tx
      .update(bookCollections)
      .set({ updatedAt: new Date() })
      .where(eq(bookCollections.id, collection.id));

    return { collection };
  });

  if ("error" in result) {
    const messages = {
      "not-owned": "本棚に登録済みの本だけを追加できます",
      "already-added": "この本はすでに10選に追加されています",
      full: "名刺代わりの本10選は10冊までです",
      collection: "10選を作成できませんでした",
    };
    const error = result.error as keyof typeof messages;
    return c.json(
      { message: messages[error] },
      error === "not-owned" ? 400 : 409,
    );
  }

  return c.json(await getCollectionForUser(result.collection.id, user.id), 201);
});

collectionsRouter.delete("/items/:userBookId", authMiddleware, async (c) => {
  const user = c.get("user");
  const collection = await db
    .select()
    .from(bookCollections)
    .where(eq(bookCollections.userId, user.id))
    .limit(1);

  if (!collection[0]) {
    return c.json({ message: "10選に登録されていません" }, 404);
  }

  const collectionId = collection[0].id;
  const deleted = await db
    .delete(bookCollectionItems)
    .where(
      and(
        eq(bookCollectionItems.collectionId, collectionId),
        eq(bookCollectionItems.userBookId, c.req.param("userBookId")),
      ),
    )
    .returning({ userBookId: bookCollectionItems.userBookId });

  if (!deleted[0]) {
    return c.json({ message: "この本は10選に登録されていません" }, 404);
  }

  const remainingItems = await db
    .select({ userBookId: bookCollectionItems.userBookId })
    .from(bookCollectionItems)
    .where(eq(bookCollectionItems.collectionId, collectionId));

  if (remainingItems.length === 0) {
    await db
      .delete(bookCollections)
      .where(eq(bookCollections.id, collectionId));
    return c.json(null);
  }

  await db
    .update(bookCollections)
    .set({ updatedAt: new Date() })
    .where(eq(bookCollections.id, collectionId));

  return c.json(await getCollectionForUser(collectionId, user.id));
});

export default collectionsRouter;
