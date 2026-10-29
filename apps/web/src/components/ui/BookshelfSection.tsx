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
        <div className="mt-4 overflow-hidden rounded-md border-x-8 border-b-8 border-t-6 border-[#75431f] bg-[#a96735] shadow-[inset_0_0_0_2px_rgb(255_229_185/20%),0_6px_12px_rgb(69_39_18/18%)]">
          <div className="grid grid-cols-3 gap-x-3 gap-y-7 bg-[linear-gradient(to_bottom,transparent_calc(100%-1.15rem),rgb(92_49_22)_calc(100%-1.15rem),rgb(136_76_36)_calc(100%-0.55rem),rgb(68_37_18)_calc(100%-0.2rem),transparent_calc(100%-0.2rem))] px-3 pb-5 pt-3 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-5 lg:grid-cols-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                isbn={book.isbn}
                title={book.title}
                imageUrl={book.imageUrl}
              />
            ))}
          </div>
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
