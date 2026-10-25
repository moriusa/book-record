import {
  Book,
  BookStatus,
  FilterStatus,
  GroupOption,
  SortDirection,
  SortOption,
  ViewMode,
} from "@/types/book";
import BookshelfSection from "./BookshelfSection";

type Props = {
  books: Book[];
  filterStatus: FilterStatus;
  sortOption: SortOption;
  sortDirection: SortDirection;
  groupOption: GroupOption;
  viewMode: ViewMode;
};

const statusLabels = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
} satisfies Record<BookStatus, string>;

const getSalesDateGroup = (salesDate: string | null | undefined) => {
  const match = salesDate?.match(/^(\d{4})[年/-](\d{1,2})(?:[月/-](\d{1,2}))?/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3] ?? 1);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return {
    key: `${year}-${String(month).padStart(2, "0")}`,
    label: `${year}年${month}月`,
    year,
    month,
    timestamp: date.getTime(),
  };
};

const BookshelfList = ({
  books,
  filterStatus,
  sortOption,
  sortDirection,
  groupOption,
  viewMode,
}: Props) => {
  // ① フィルター
  const filteredBooks =
    filterStatus === "ALL"
      ? books
      : books.filter((book) => book.status === filterStatus);

  // ② ソート
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === "SALES_DATE") {
      const aSalesDate = getSalesDateGroup(a.salesDate);
      const bSalesDate = getSalesDateGroup(b.salesDate);

      if (!aSalesDate) {
        return bSalesDate ? 1 : 0;
      }

      if (!bSalesDate) {
        return -1;
      }

      const comparison = aSalesDate.timestamp - bSalesDate.timestamp;
      return sortDirection === "ASC" ? comparison : -comparison;
    }

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

  if (sortOption === "SALES_DATE") {
    const groupedBooks = Map.groupBy(sortedBooks, (book) => {
      const salesDateGroup = getSalesDateGroup(book.salesDate);
      return salesDateGroup?.key ?? "unknown";
    });

    return (
      <div>
        {[...groupedBooks.entries()].map(([groupKey, groupedBooks]) => {
          const salesDateGroup = getSalesDateGroup(
            groupedBooks[0]?.salesDate,
          );

          return (
            <BookshelfSection
              key={groupKey}
              title={salesDateGroup?.label ?? "発売日不明"}
              books={groupedBooks}
              viewMode={viewMode}
              salesDateGroup={salesDateGroup ?? undefined}
            />
          );
        })}
      </div>
    );
  }

  // ③ グループなし
  if (groupOption === "NONE") {
    if (filterStatus === "ALL") {
      return (
        <BookshelfSection
          title="すべて"
          books={sortedBooks}
          viewMode={viewMode}
        />
      );
    }

    return (
      <BookshelfSection
        title={statusLabels[filterStatus]}
        books={sortedBooks}
        viewMode={viewMode}
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
        <BookshelfSection
          key={groupName}
          title={groupName}
          books={books}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default BookshelfList;
