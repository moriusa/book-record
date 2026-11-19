import type { Book } from "@/types/book";

export const getBookHref = (book: Pick<Book, "id" | "isbn" | "source">) =>
  book.source === "manual" ? `/books/manual/${book.id}` : `/books/${book.isbn}`;
