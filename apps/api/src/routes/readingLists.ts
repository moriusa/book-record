import { and, asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import {
  books,
  readingListItems,
  readingLists,
  userBooks,
} from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";
import type { AppEnv } from "../types/hono.js";

const readingListsRouter = new Hono<AppEnv>();

const itemSelection = {
  id: userBooks.id,
  isbn: books.isbn,
  source: books.source,
  title: books.title,
  author: books.author,
  publisher: books.publisher,
  imageUrl: books.imageUrl,
  status: userBooks.status,
  rating: userBooks.rating,
  review: userBooks.review,
  isFavorite: userBooks.isFavorite,
  position: readingListItems.position,
};

const getTitle = (body: unknown) => {
  if (typeof body !== "object" || body === null || !("title" in body)) {
    return null;
  }

  const title = (body as { title?: unknown }).title;
  return typeof title === "string" && title.trim().length > 0
    ? title.trim().slice(0, 80)
    : null;
};

const getItems = (listId: string) =>
  db
    .select(itemSelection)
    .from(readingListItems)
    .innerJoin(userBooks, eq(readingListItems.userBookId, userBooks.id))
    .innerJoin(books, eq(userBooks.bookId, books.id))
    .where(eq(readingListItems.listId, listId))
    .orderBy(asc(readingListItems.position));

const getList = async (listId: string, userId: string) => {
  const list = await db
    .select()
    .from(readingLists)
    .where(and(eq(readingLists.id, listId), eq(readingLists.userId, userId)))
    .limit(1);

  return list[0] ? { ...list[0], items: await getItems(listId) } : null;
};

const ownsBook = async (userBookId: string, userId: string) => {
  const book = await db
    .select({ id: userBooks.id })
    .from(userBooks)
    .where(and(eq(userBooks.id, userBookId), eq(userBooks.userId, userId)))
    .limit(1);
  return Boolean(book[0]);
};

readingListsRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const lists = await db
    .select()
    .from(readingLists)
    .where(eq(readingLists.userId, user.id))
    .orderBy(asc(readingLists.createdAt));

  return c.json(
    await Promise.all(
      lists.map(async (list) => ({ ...list, items: await getItems(list.id) })),
    ),
  );
});

readingListsRouter.get("/:id", authMiddleware, async (c) => {
  const list = await getList(c.req.param("id"), c.get("user").id);
  return list
    ? c.json(list)
    : c.json({ message: "リストが見つかりません" }, 404);
});

readingListsRouter.post("/", authMiddleware, async (c) => {
  const title = getTitle(await c.req.json());
  if (!title) return c.json({ message: "リスト名を入力してください" }, 400);

  const created = await db
    .insert(readingLists)
    .values({ userId: c.get("user").id, title })
    .returning();

  return c.json({ ...created[0], items: [] }, 201);
});

readingListsRouter.patch("/:id", authMiddleware, async (c) => {
  const title = getTitle(await c.req.json());
  if (!title) return c.json({ message: "リスト名を入力してください" }, 400);

  const updated = await db
    .update(readingLists)
    .set({ title, updatedAt: new Date() })
    .where(
      and(
        eq(readingLists.id, c.req.param("id")),
        eq(readingLists.userId, c.get("user").id),
      ),
    )
    .returning();

  return updated[0]
    ? c.json({ ...updated[0], items: await getItems(updated[0].id) })
    : c.json({ message: "リストが見つかりません" }, 404);
});

readingListsRouter.delete("/:id", authMiddleware, async (c) => {
  const deleted = await db
    .delete(readingLists)
    .where(
      and(
        eq(readingLists.id, c.req.param("id")),
        eq(readingLists.userId, c.get("user").id),
      ),
    )
    .returning({ id: readingLists.id });
  return deleted[0]
    ? c.json(null)
    : c.json({ message: "リストが見つかりません" }, 404);
});

readingListsRouter.put("/favorites/:userBookId", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!(await ownsBook(c.req.param("userBookId"), user.id))) {
    return c.json({ message: "本棚に登録済みの本を指定してください" }, 400);
  }

  const current = await db
    .select({ isFavorite: userBooks.isFavorite })
    .from(userBooks)
    .where(eq(userBooks.id, c.req.param("userBookId")))
    .limit(1);
  const isFavorite = !current[0]?.isFavorite;
  await db
    .update(userBooks)
    .set({ isFavorite, updatedAt: new Date() })
    .where(eq(userBooks.id, c.req.param("userBookId")));
  return c.json({ isFavorite });
});

readingListsRouter.put("/:id/items/:userBookId", authMiddleware, async (c) => {
  const user = c.get("user");
  const list = await getList(c.req.param("id"), user.id);
  if (!list) return c.json({ message: "リストが見つかりません" }, 404);
  if (!(await ownsBook(c.req.param("userBookId"), user.id))) {
    return c.json({ message: "本棚に登録済みの本を指定してください" }, 400);
  }
  if (list.items.some((item) => item.id === c.req.param("userBookId"))) {
    return c.json(list);
  }

  await db.insert(readingListItems).values({
    listId: list.id,
    userBookId: c.req.param("userBookId"),
    position: Math.max(0, ...list.items.map((item) => item.position)) + 1,
  });
  return c.json(await getList(list.id, user.id));
});

readingListsRouter.delete(
  "/:id/items/:userBookId",
  authMiddleware,
  async (c) => {
    const user = c.get("user");
    const list = await getList(c.req.param("id"), user.id);
    if (!list) return c.json({ message: "リストが見つかりません" }, 404);
    await db
      .delete(readingListItems)
      .where(
        and(
          eq(readingListItems.listId, list.id),
          eq(readingListItems.userBookId, c.req.param("userBookId")),
        ),
      );
    return c.json(await getList(list.id, user.id));
  },
);

export default readingListsRouter;
