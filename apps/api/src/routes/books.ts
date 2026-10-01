import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { books } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";
import { AppEnv } from "../types/hono.js";

const booksRouter = new Hono<AppEnv>();

booksRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const result = await db
    .select()
    .from(books)
    .where(eq(books.userId, user.id));

  if (result.length === 0) {
    return c.json(
      {
        message: "Books not found",
      },
      404,
    );
  }

  return c.json(result);
});

booksRouter.get("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const result = await db
    .select()
    .from(books)
    .where(and(eq(books.id, id), eq(books.userId, user.id)));

  if (result.length === 0) {
    return c.json(
      {
        message: "Book not found",
      },
      404,
    );
  }

  return c.json(result[0]);
});

booksRouter.post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const result = await db
    .insert(books)
    .values({
      userId: user.id,
      title: body.title,
      author: body.author,
      status: body.status,
      rating: body.rating,
      review: body.review,
    })
    .returning();

  return c.json(result[0], 201);
});

booksRouter.patch("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = await db
    .update(books)
    .set({
      status: body.status,
      rating: body.rating,
      review: body.review,
      updatedAt: new Date(),
    })
    .where(and(eq(books.id, id), eq(books.userId, user.id)))
    .returning();

  if (result.length === 0) {
    return c.json(
      {
        message: "Book not found",
      },
      404,
    );
  }

  return c.json(result[0]);
});

booksRouter.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const result = await db
    .delete(books)
    .where(and(eq(books.id, id), eq(books.userId, user.id)))
    .returning();

  if (result.length === 0) {
    return c.json(
      {
        message: "Book not found",
      },
      404,
    );
  }

  return c.json(result[0]);
});

export default booksRouter;
