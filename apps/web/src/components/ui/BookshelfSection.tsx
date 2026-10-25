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
      <h2 className="flex items-baseline gap-2 border-b border-stone-300 pb-2 text-stone-900">
        {salesDateGroup ? (
          <>
            <span className="text-sm font-bold tracking-wide text-stone-500">
              {salesDateGroup.year}年
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              {salesDateGroup.month}月
            </span>
          </>
        ) : (
          <span className="text-lg font-bold">{title}</span>
        )}
      </h2>

      {viewMode === "GRID" ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((book) => (
            <BookCard
              key={book.id}
              isbn={book.isbn}
              title={book.title}
              author={book.author}
              imageUrl={book.imageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {books.map((book) => (
            <BookListItem key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookshelfSection;
