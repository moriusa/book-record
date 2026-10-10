import {
  Book,
  BookStatus,
  FilterStatus,
  GroupOption,
  SortOption,
} from "@/types/book";
import BookshelfSection from "./BookshelfSection";

type Props = {
  books: Book[];
  filterStatus: FilterStatus;
  sortOption: SortOption;
  groupOption: GroupOption;
};

const statusLabels = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
} satisfies Record<BookStatus, string>;

const BookshelfList = ({
  books,
  filterStatus,
  sortOption,
  groupOption,
}: Props) => {
  // ① フィルター
  const filteredBooks =
    filterStatus === "ALL"
      ? books
      : books.filter((book) => book.status === filterStatus);

  // ② ソート
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

  // ③ グループなし
  if (groupOption === "NONE") {
    if (filterStatus === "ALL") {
      return <BookshelfSection title="すべて" books={sortedBooks} />;
    }

    return (
      <BookshelfSection
        title={statusLabels[filterStatus]}
        books={sortedBooks}
      />
    );
  }

  const groupBooks = (books: Book[], groupOption: GroupOption) => {
    if (groupOption === "NONE") {
      return new Map([["すべて", books]]);
    }

    return Map.groupBy(books, (book) => book.author || "作者不明");
  };

  const groupedBooks = groupBooks(sortedBooks, groupOption);

  return (
    <div>
      {[...groupedBooks.entries()].map(([author, books]) => (
        <BookshelfSection key={author} title={author} books={books} />
      ))}
    </div>
  );
};

export default BookshelfList;
