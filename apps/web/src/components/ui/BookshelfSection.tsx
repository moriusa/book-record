import { Book, ViewMode } from "@/types/book";
import BookCard from "./BookCard";
import BookListItem from "./BookListItem";

type Props = {
  title: string;
  books: Book[];
  viewMode: ViewMode;
  salesDateGroup?: { year: number; month: number };
};

const BookshelfSection = ({
  title,
  books,
  viewMode,
  salesDateGroup,
}: Props) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="flex items-baseline justify-between gap-2 border-b border-[#293630]/10 pb-4 text-[#293630]">
        {salesDateGroup ? (
          <>
            <span className="text-sm font-medium tracking-wide text-[#75817b]">
              {salesDateGroup.year}年
            </span>
            <span className="font-serif-jp text-2xl font-medium tracking-tight">
              {salesDateGroup.month}月
            </span>
          </>
        ) : (
          <span className="font-serif-jp text-xl font-medium">{title}</span>
        )}
      </h2>

      {viewMode === "GRID" ? (
        <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard
              key={book.id}
              isbn={book.isbn}
              title={book.title}
              imageUrl={book.imageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="mt-1">
          {books.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookshelfSection;
