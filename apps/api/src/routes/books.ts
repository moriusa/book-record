import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { books } from "../db/schema.js";

const booksRouter = new Hono();

booksRouter.get("/", async (c) => {
  const result = await db.select().from(books);

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

booksRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const result = await db.select().from(books).where(eq(books.id, id));

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

booksRouter.post("/", async (c) => {
  const body = await c.req.json();

  const result = await db
    .insert(books)
    .values({
      userId: body.userId,
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
    .where(eq(books.id, id))
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
  const id = c.req.param("id");

  const result = await db
    .delete(books)
    .where(eq(books.id, id))
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
