import BookshelfSection from "./BookshelfSection";
import type { BookStatus } from "./BookFormFields";
import type { FilterStatus, SortOption } from "./BookshelfToolbar";

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  imageUrl: string | null;
  status: BookStatus;
  rating: number | null;
  createdAt: string;
};

type Props = {
  books: Book[];
  filterStatus: FilterStatus;
  sortOption: SortOption;
};

const statusLabels = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
} satisfies Record<BookStatus, string>;

const BookshelfList = ({ books, filterStatus, sortOption }: Props) => {
  const filteredBooks =
    filterStatus === "ALL"
      ? books
      : books.filter((book) => book.status === filterStatus);

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortOption) {
      case "CREATED_DESC":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "CREATED_ASC":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "TITLE_ASC":
        return a.title.localeCompare(b.title, "ja");

      case "RATING_DESC":
        return (b.rating ?? 0) - (a.rating ?? 0);
    }
  });

  // 「すべて」の場合はステータスで分けない
  if (filterStatus === "ALL") {
    return <BookshelfSection title="すべて" books={sortedBooks} />;
  }

  // 特定のステータスの場合は、そのステータスだけ表示
  return (
    <BookshelfSection title={statusLabels[filterStatus]} books={sortedBooks} />
  );
};

export default BookshelfList;
