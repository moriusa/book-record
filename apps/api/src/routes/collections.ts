import { and, asc, eq, inArray } from "drizzle-orm";
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

type CollectionInput = {
  userBookIds: string[];
};

type CollectionUpdateInput = {
  userBookIds?: string[];
};

const collectionItemSelection = {
  id: userBooks.id,
  isbn: books.isbn,
  title: books.title,
  author: books.author,
  imageUrl: books.imageUrl,
  position: bookCollectionItems.position,
};

const parseUserBookIds = (value: unknown) => {
  if (
    !Array.isArray(value) ||
    value.length !== COLLECTION_SIZE ||
    value.some((id) => typeof id !== "string" || id.length === 0)
  ) {
    return null;
  }

  const ids = value as string[];
  return new Set(ids).size === COLLECTION_SIZE ? ids : null;
};

const parseCollectionInput = (body: unknown): CollectionInput | null => {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { userBookIds } = body as Record<string, unknown>;
  const parsedUserBookIds = parseUserBookIds(userBookIds);

  if (parsedUserBookIds === null) {
    return null;
  }

  return { userBookIds: parsedUserBookIds };
};

const parseCollectionUpdateInput = (
  body: unknown,
): CollectionUpdateInput | null => {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const { userBookIds } = body as Record<string, unknown>;
  const includesUserBookIds = userBookIds !== undefined;

  if (!includesUserBookIds) {
    return null;
  }

  const parsedUserBookIds = parseUserBookIds(userBookIds);

  if (parsedUserBookIds === null) {
    return null;
  }

  return { userBookIds: parsedUserBookIds };
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

const validateUserBooks = async (userId: string, userBookIds: string[]) => {
  const ownedBooks = await db
    .select({ id: userBooks.id })
    .from(userBooks)
    .where(
      and(eq(userBooks.userId, userId), inArray(userBooks.id, userBookIds)),
    );

  return ownedBooks.length === userBookIds.length;
};

const collectionsRouter = new Hono<AppEnv>();

collectionsRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const collections = await db
    .select()
    .from(bookCollections)
    .where(eq(bookCollections.userId, user.id))
    .orderBy(asc(bookCollections.createdAt));

  const result = await Promise.all(
    collections.map(async (collection) => ({
      ...collection,
      items: await getCollectionItems(collection.id),
    })),
  );

  return c.json(result);
});

collectionsRouter.get("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const collection = await getCollectionForUser(c.req.param("id"), user.id);

  if (!collection) {
    return c.json({ message: "Collection not found" }, 404);
  }

  return c.json(collection);
});

collectionsRouter.post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const input = parseCollectionInput(await c.req.json());

  if (!input) {
    return c.json(
      {
        message: "重複のない本棚登録済みの本10冊を指定してください",
      },
      400,
    );
  }

  if (!(await validateUserBooks(user.id, input.userBookIds))) {
    return c.json({ message: "本棚に登録済みの本だけを選択できます" }, 400);
  }

  const collection = await db.transaction(async (tx) => {
    const created = await tx
      .insert(bookCollections)
      .values({
        userId: user.id,
      })
      .onConflictDoNothing({ target: bookCollections.userId })
      .returning();

    const createdCollection = created[0];
    if (!createdCollection) {
      return null;
    }

    await tx.insert(bookCollectionItems).values(
      input.userBookIds.map((userBookId, index) => ({
        collectionId: createdCollection.id,
        userBookId,
        position: index + 1,
      })),
    );

    return createdCollection;
  });

  if (!collection) {
    return c.json(
      { message: "名刺代わりの本10選はすでに作成されています" },
      409,
    );
  }

  return c.json(
    { ...collection, items: await getCollectionItems(collection.id) },
    201,
  );
});

collectionsRouter.patch("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const collectionId = c.req.param("id");
  const input = parseCollectionUpdateInput(await c.req.json());

  if (!input) {
    return c.json(
      {
        message: "重複のない本棚登録済みの本10冊を指定してください",
      },
      400,
    );
  }

  if (
    input.userBookIds &&
    !(await validateUserBooks(user.id, input.userBookIds))
  ) {
    return c.json({ message: "本棚に登録済みの本だけを選択できます" }, 400);
  }

  const existing = await getCollectionForUser(collectionId, user.id);
  if (!existing) {
    return c.json({ message: "Collection not found" }, 404);
  }

  await db.transaction(async (tx) => {
    await tx
      .update(bookCollections)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(bookCollections.id, collectionId));

    if (input.userBookIds) {
      await tx
        .delete(bookCollectionItems)
        .where(eq(bookCollectionItems.collectionId, collectionId));
      await tx.insert(bookCollectionItems).values(
        input.userBookIds.map((userBookId, index) => ({
          collectionId,
          userBookId,
          position: index + 1,
        })),
      );
    }
  });

  const updated = await getCollectionForUser(collectionId, user.id);
  return c.json(updated);
});

collectionsRouter.delete("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const result = await db
    .delete(bookCollections)
    .where(
      and(
        eq(bookCollections.id, c.req.param("id")),
        eq(bookCollections.userId, user.id),
      ),
    )
    .returning({ id: bookCollections.id });

  if (!result[0]) {
    return c.json({ message: "Collection not found" }, 404);
  }

  return c.json(result[0]);
});

export default collectionsRouter;
