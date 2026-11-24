import {
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
  date,
  boolean,
  primaryKey,
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
    isbn: varchar("isbn", { length: 64 }).notNull(),
    source: varchar("source", { length: 20 }).notNull().default("catalog"),
    ownerUserId: uuid("owner_user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    publisher: varchar("publisher", { length: 255 }),
    series: varchar("series", { length: 255 }),
    salesDate: varchar("sales_date", { length: 20 }),
    imageUrl: varchar("image_url", { length: 255 }),
    bookFormat: text("bookFormat"),
    description: text("description"),
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
    isFavorite: boolean("is_favorite").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("user_books_user_id_book_id_unique").on(table.userId, table.bookId),
  ],
);

export const readingLists = pgTable("reading_lists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 80 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const readingListItems = pgTable(
  "reading_list_items",
  {
    listId: uuid("list_id")
      .notNull()
      .references(() => readingLists.id, { onDelete: "cascade" }),
    userBookId: uuid("user_book_id")
      .notNull()
      .references(() => userBooks.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.listId, table.userBookId] }),
    unique("reading_list_items_list_position_unique").on(
      table.listId,
      table.position,
    ),
  ],
);

export const bookCollections = pgTable(
  "book_collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique("book_collections_user_id_unique").on(table.userId)],
);

export const bookCollectionItems = pgTable(
  "book_collection_items",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => bookCollections.id, { onDelete: "cascade" }),
    userBookId: uuid("user_book_id")
      .notNull()
      .references(() => userBooks.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.userBookId] }),
    unique("book_collection_items_collection_position_unique").on(
      table.collectionId,
      table.position,
    ),
  ],
);
