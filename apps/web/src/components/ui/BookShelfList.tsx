import {
  Book,
  BookStatus,
  FilterStatus,
  GroupOption,
  SortDirection,
  SortOption,
} from "@/types/book";
import BookshelfSection from "./BookshelfSection";

type Props = {
  books: Book[];
  filterStatus: FilterStatus;
  sortOption: SortOption;
  sortDirection: SortDirection;
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
  sortDirection,
  groupOption,
}: Props) => {
  // ① フィルター
  const filteredBooks =
    filterStatus === "ALL"
      ? books
      : books.filter((book) => book.status === filterStatus);

  // ② ソート
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const comparison = (() => {
      switch (sortOption) {
        case "CREATED":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "TITLE":
          return a.title.localeCompare(b.title, "ja");
        case "RATING":
          return (a.rating ?? 0) - (b.rating ?? 0);
      }
    })();

    return sortDirection === "ASC" ? comparison : -comparison;
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
    switch (groupOption) {
      case "NONE":
        return new Map([["すべて", books]]);
      case "AUTHOR":
        return Map.groupBy(books, (book) => book.author || "作者不明");
      case "PUBLISHER":
        return Map.groupBy(books, (book) => book.publisher || "出版社不明");
      case "SERIES":
        return Map.groupBy(books, (book) => book.series || "シリーズ不明");
    }
  };

  const groupedBooks = groupBooks(sortedBooks, groupOption);

  return (
    <div>
      {[...groupedBooks.entries()].map(([groupName, books]) => (
        <BookshelfSection key={groupName} title={groupName} books={books} />
      ))}
    </div>
  );
};

export default BookshelfList;
