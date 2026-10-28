import Image from "next/image";
import Link from "next/link";
import { RiBookOpenLine, RiStarFill } from "react-icons/ri";
import { Book, BookStatus } from "@/types/book";

const statusLabels = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
} satisfies Record<BookStatus, string>;

const statusStyles = {
  WANT_TO_READ: "bg-amber-100 text-amber-900",
  READING: "bg-sky-100 text-sky-900",
  COMPLETED: "bg-emerald-100 text-emerald-900",
  ON_HOLD: "bg-stone-200 text-stone-700",
} satisfies Record<BookStatus, string>;

type Props = {
  book: Book;
};

const BookListItem = ({ book }: Props) => {
  return (
    <Link
      href={`/books/${book.isbn}`}
      className="group flex min-h-28 items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 sm:gap-4"
    >
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-stone-50">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            sizes="56px"
            className="object-contain"
          />
        ) : (
          <RiBookOpenLine
            className="absolute inset-0 m-auto text-xl text-stone-300"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-semibold leading-5 text-stone-900 group-hover:underline">
          {book.title}
        </p>
        <p className="mt-1 truncate text-sm text-stone-600">{book.author}</p>
        <p className="mt-1 truncate text-xs text-stone-500">
          {book.publisher || "出版社不明"}
        </p>
      </div>

      <div className="hidden shrink-0 items-end gap-2 sm:flex sm:flex-col">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[book.status]}`}
        >
          {statusLabels[book.status]}
        </span>
        {book.rating !== null && (
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-700">
            <RiStarFill aria-hidden="true" />
            {book.rating}
          </span>
        )}
      </div>
    </Link>
  );
};

export default BookListItem;
