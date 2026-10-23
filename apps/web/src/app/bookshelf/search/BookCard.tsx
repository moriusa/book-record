import type { RakutenBookItem } from "@/lib/fetchRakutenBooks";
import Image from "next/image";
import Link from "next/link";
import { RiAddLine, RiCheckLine } from "react-icons/ri";

interface Props {
  book: RakutenBookItem;
  onRegister: (book: RakutenBookItem) => void;
  isRegistered: boolean;
}

export const BookCard = ({
  book,
  onRegister,
  isRegistered,
}: Props) => {
  return (
    <article className="group flex min-h-36 items-center gap-3 p-3 transition hover:bg-amber-50/60 sm:min-h-40 sm:gap-5 sm:p-5">
      <Link
        href={`/bookshelf/${book.isbn}`}
        className="flex min-w-0 flex-1 items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-700 sm:gap-5"
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
      <button
        type="button"
        onClick={() => onRegister(book)}
        disabled={isRegistered}
        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1 rounded-lg border border-amber-700 px-3 text-sm font-bold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-500 sm:px-4"
      >
        {isRegistered ? (
          <>
            <RiCheckLine aria-hidden="true" />
            登録済み
          </>
        ) : (
          <>
            <RiAddLine aria-hidden="true" />
            本棚登録
          </>
        )}
      </button>
    </article>
  );
};
