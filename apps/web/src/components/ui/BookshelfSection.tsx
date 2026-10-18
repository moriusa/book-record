import { Book, ViewMode } from "@/types/book";
import BookCard from "./BookCard";
import BookListItem from "./BookListItem";

type Props = {
  title: string;
  books: Book[];
  viewMode: ViewMode;
};

const BookshelfSection = ({ title, books, viewMode }: Props) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="border-b pb-2 text-lg font-bold">{title}</h2>

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
