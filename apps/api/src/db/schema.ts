import {
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const books = pgTable("books", {
  id: uuid("id").primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),

  status: varchar("status", { length: 30 }).notNull(),

  rating: smallint("rating"),
  review: text("review"),
});
