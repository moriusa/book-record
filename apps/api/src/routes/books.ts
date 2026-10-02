import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { books } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";
import { AppEnv } from "../types/hono.js";

const booksRouter = new Hono<AppEnv>();

booksRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user");

  const result = await db.select().from(books).where(eq(books.userId, user.id));

  if (result.length === 0) {
    return c.json(
      {
        message: "Book not found",
      },
      404,
    );
  }

  return c.json(result);
});

booksRouter.get("/:isbn", authMiddleware, async (c) => {
  const user = c.get("user");
  const isbn = c.req.param("isbn");

  const result = await db
    .select()
    .from(books)
    .where(and(eq(books.isbn, isbn), eq(books.userId, user.id)));

  if (result.length === 0) {
    return c.json({ message: "Book not found" }, 404);
  }

  return c.json(result[0]);
});

booksRouter.post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  try {
    const result = await db
      .insert(books)
      .values({
        userId: user.id,
        isbn: body.isbn,
        title: body.title,
        author: body.author,
        publisher: body.publisherName,
        salesDate: body.salesDate,
        imageUrl: body.largeImageUrl,
        status: body.status,
        rating: body.rating,
        review: body.review,
        completedAt: body.completedAt,
      })
      .returning();

    return c.json(result[0], 201);
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      error.cause instanceof Error &&
      "code" in error.cause &&
      error.cause.code === "23505"
    ) {
      return c.json(
        {
          message: "この本はすでに本棚に登録されています",
        },
        409,
      );
    }

    return c.json(
      {
        message: "本の登録に失敗しました",
      },
      500,
    );
  }
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
