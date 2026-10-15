import {
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
  date,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  cognitoSub: text("cognito_sub").notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const books = pgTable(
  "books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    isbn: varchar("isbn", { length: 20 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    publisher: varchar("publisher", { length: 255 }),
    series: varchar("series", { length: 255 }),
    salesDate: varchar("sales_date", { length: 20 }),
    imageUrl: varchar("image_url", { length: 255 }),
  },
  (table) => [unique("books_isbn_unique").on(table.isbn)],
);

export const userBooks = pgTable(
  "user_books",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),

    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id),

    status: varchar("status", { length: 30 }).notNull(),
    rating: smallint("rating"),
    review: text("review"),
    completedAt: date("completed_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("user_books_user_id_book_id_unique").on(table.userId, table.bookId),
  ],
);
