import BookCard from "./BookCard";

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  imageUrl: string | null;
};

type Props = {
  title: string;
  books: Book[];
};

const BookshelfSection = ({ title, books }: Props) => {
  if (books.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <h2 className="border-b pb-2 text-lg font-bold">{title}</h2>

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
    </section>
  );
};

export default BookshelfSection;
