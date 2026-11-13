import { Hono } from "hono";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { books, userBooks } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.js";
import { AppEnv } from "../types/hono.js";

const booksRouter = new Hono<AppEnv>();

const bookSelection = {
  id: userBooks.id,
  isbn: books.isbn,
  title: books.title,
  author: books.author,
  publisher: books.publisher,
  series: books.series,
  salesDate: books.salesDate,
  imageUrl: books.imageUrl,
  bookFormat: books.bookFormat,
  description: books.description,
  status: userBooks.status,
  rating: userBooks.rating,
  review: userBooks.review,
  completedAt: userBooks.completedAt,
  createdAt: userBooks.createdAt,
  updatedAt: userBooks.updatedAt,
};

const catalogBookSelection = {
  isbn: books.isbn,
  title: books.title,
  author: books.author,
  publisherName: books.publisher,
  seriesName: books.series,
  salesDate: books.salesDate,
  largeImageUrl: books.imageUrl,
  size: books.bookFormat,
  itemCaption: books.description,
};

type BulkBookPayload = Record<string, unknown> & {
  isbn: string;
  title: string;
  author: string;
};

type BulkBooksRequest = {
  books: unknown[];
};

const isBulkBooksRequest = (body: unknown): body is BulkBooksRequest =>
  typeof body === "object" &&
  body !== null &&
  "books" in body &&
  Array.isArray(body.books);

const isBulkBookPayload = (book: unknown): book is BulkBookPayload =>
  typeof book === "object" &&
  book !== null &&
  "isbn" in book &&
  typeof book.isbn === "string" &&
  "title" in book &&
  typeof book.title === "string" &&
  "author" in book &&
  typeof book.author === "string";

const getOptionalString = (value: unknown) =>
  typeof value === "string" ? value : null;

const findUserBookById = async (id: string, userId: string) => {
  const result = await db
    .select(bookSelection)
    .from(userBooks)
    .innerJoin(books, eq(userBooks.bookId, books.id))
    .where(and(eq(userBooks.id, id), eq(userBooks.userId, userId)))
    .limit(1);

  return result[0];
};

const isUniqueViolation = (error: unknown) => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if ("code" in error && error.code === "23505") {
    return true;
  }

  return (
    "cause" in error &&
    typeof error.cause === "object" &&
    error.cause !== null &&
    "code" in error.cause &&
    error.cause.code === "23505"
  );
};

booksRouter.get("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const isbn = c.req.query("isbn");

  const result = await db
    .select(bookSelection)
    .from(userBooks)
    .innerJoin(books, eq(userBooks.bookId, books.id))
    .where(
      isbn
        ? and(eq(userBooks.userId, user.id), eq(books.isbn, isbn))
        : eq(userBooks.userId, user.id),
    );

  return c.json(result);
});

booksRouter.get("/catalog", async (c) => {
  const result = await db.select({ isbn: books.isbn }).from(books);

  return c.json(result);
});

booksRouter.get("/catalog/:isbn", async (c) => {
  const result = await db
    .select(catalogBookSelection)
    .from(books)
    .where(eq(books.isbn, c.req.param("isbn")))
    .limit(1);

  const book = result[0];
  if (!book) {
    return c.json({ message: "Book not found" }, 404);
  }

  return c.json(book);
});

booksRouter.post("/bulk", authMiddleware, async (c) => {
  const user = c.get("user");
  const body: unknown = await c.req.json();

  if (!isBulkBooksRequest(body) || body.books.length === 0) {
    return c.json({ message: "登録する本を選択してください" }, 400);
  }

  if (body.books.length > 30) {
    return c.json({ message: "一度に登録できるのは30冊までです" }, 400);
  }

  const uniqueBooks = Array.from(
    new Map(
      body.books.filter(isBulkBookPayload).map((book) => [book.isbn, book]),
    ).values(),
  );

  if (uniqueBooks.length === 0) {
    return c.json({ message: "有効な書籍情報がありません" }, 400);
  }

  try {
    const result = await db.transaction(async (tx) => {
      const createdIsbns: string[] = [];
      const skippedIsbns: string[] = [];

      for (const book of uniqueBooks) {
        const insertedBooks = await tx
          .insert(books)
          .values({
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            publisher: getOptionalString(book.publisherName),
            series: getOptionalString(book.seriesName),
            salesDate: getOptionalString(book.salesDate),
            imageUrl: getOptionalString(book.largeImageUrl),
            bookFormat: getOptionalString(book.size),
            description: getOptionalString(book.itemCaption),
          })
          .onConflictDoNothing({ target: books.isbn })
          .returning({ id: books.id });

        const bookId =
          insertedBooks[0]?.id ??
          (
            await tx
              .select({ id: books.id })
              .from(books)
              .where(eq(books.isbn, book.isbn))
              .limit(1)
          )[0]?.id;

        if (!bookId) {
          throw new Error("Book could not be created or found");
        }

        const createdUserBook = await tx
          .insert(userBooks)
          .values({
            userId: user.id,
            bookId,
            status: getOptionalString(book.status) ?? "WANT_TO_READ",
            rating: null,
            review: null,
            completedAt: null,
          })
          .onConflictDoNothing({
            target: [userBooks.userId, userBooks.bookId],
          })
          .returning({ id: userBooks.id });

        if (createdUserBook.length > 0) {
          createdIsbns.push(book.isbn);
        } else {
          skippedIsbns.push(book.isbn);
        }
      }

      return { createdIsbns, skippedIsbns };
    });

    return c.json(result, 201);
  } catch (error) {
    console.error(error);
    return c.json({ message: "本の一括登録に失敗しました" }, 500);
  }
});

booksRouter.get("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const book = await findUserBookById(c.req.param("id"), user.id);

  if (!book) {
    return c.json({ message: "Book not found" }, 404);
  }

  return c.json(book);
});

booksRouter.post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  try {
    const result = await db.transaction(async (tx) => {
      const insertedBooks = await tx
        .insert(books)
        .values({
          isbn: body.isbn,
          title: body.title,
          author: body.author,
          publisher: body.publisherName,
          series: body.seriesName,
          salesDate: body.salesDate,
          imageUrl: body.largeImageUrl,
          bookFormat: body.size,
          description: body.itemCaption,
        })
        .onConflictDoNothing({ target: books.isbn })
        .returning({ id: books.id });

      const bookId =
        insertedBooks[0]?.id ??
        (
          await tx
            .select({ id: books.id })
            .from(books)
            .where(eq(books.isbn, body.isbn))
            .limit(1)
        )[0]?.id;

      if (!bookId) {
        throw new Error("Book could not be created or found");
      }

      const createdUserBooks = await tx
        .insert(userBooks)
        .values({
          userId: user.id,
          bookId,
          status: body.status,
          rating: body.rating,
          review: body.review,
          completedAt: body.completedAt || null,
        })
        .returning({ id: userBooks.id });

      const createdUserBook = createdUserBooks[0];
      if (!createdUserBook) {
        throw new Error("User book could not be created");
      }

      const created = await tx
        .select(bookSelection)
        .from(userBooks)
        .innerJoin(books, eq(userBooks.bookId, books.id))
        .where(eq(userBooks.id, createdUserBook.id))
        .limit(1);

      return created[0];
    });

    return c.json(result, 201);
  } catch (error) {
    console.error(error);

    if (isUniqueViolation(error)) {
      return c.json({ message: "この本はすでに本棚に登録されています" }, 409);
    }

    return c.json({ message: "本の登録に失敗しました" }, 500);
  }
});
booksRouter.patch("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();

  const result = await db
    .update(userBooks)
    .set({
      status: body.status,
      rating: body.rating,
      review: body.review,
      completedAt: body.completedAt || null,
      updatedAt: new Date(),
    })
    .where(and(eq(userBooks.id, id), eq(userBooks.userId, user.id)))
    .returning({ id: userBooks.id });

  if (result.length === 0) {
    return c.json({ message: "Book not found" }, 404);
  }

  const book = await findUserBookById(result[0].id, user.id);

  return c.json(book);
});

booksRouter.delete("/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const result = await db
    .delete(userBooks)
    .where(and(eq(userBooks.id, id), eq(userBooks.userId, user.id)))
    .returning();

  if (result.length === 0) {
    return c.json({ message: "Book not found" }, 404);
  }

  return c.json(result[0]);
});

export default booksRouter;
