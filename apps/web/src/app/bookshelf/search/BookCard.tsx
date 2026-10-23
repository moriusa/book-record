import { RakutenBookItem } from "@/lib/fetchRakutenBooks";
import Image from "next/image";
import Link from "next/link";

interface Props {
  book: RakutenBookItem;
  selectedIsbns: Set<string>;
  toggleBook: (isbn: string) => void;
}

export const BookCard = ({ book, selectedIsbns, toggleBook }: Props) => {
  return (
    <article className="transition hover:bg-amber-50/60">
      <label className="flex cursor-pointer items-center justify-end pr-3 pt-3 transition hover:border-amber-400 sm:left-5 sm:top-5">
        <input
          type="checkbox"
          checked={selectedIsbns.has(book.isbn)}
          onChange={() => toggleBook(book.isbn)}
          className="size-4 accent-amber-700"
          aria-label={`『${book.title}』を選択`}
        />
      </label>
      <Link
        href={`/bookshelf/${book.isbn}`}
        className="flex min-h-36 items-center gap-4 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-700 sm:min-h-40 sm:gap-5 sm:p-5 sm:pl-16"
      >
        <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:w-24">
          <Image
            src={book.largeImageUrl}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-contain"
          />
        </div>

        <div className="min-w-0">
          <p className="line-clamp-2 text-base font-semibold leading-6 text-stone-800 group-hover:underline sm:text-lg">
            {book.title}
          </p>
          <p className="mt-2 truncate text-sm text-stone-600">{book.author}</p>
          {book.publisherName && (
            <p className="mt-1 truncate text-xs text-stone-400">
              {book.publisherName}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};
