import type { RakutenBookItem } from "@/lib/fetchRakutenBooks";
import Image from "next/image";
import Link from "next/link";
import { RiAddLine, RiCheckLine } from "react-icons/ri";
import LoginButton from "@/components/ui/LoginButton";

interface Props {
  book: RakutenBookItem;
  onRegister: (book: RakutenBookItem) => void;
  isRegistered: boolean;
  isAuthenticated: boolean;
}

export const BookCard = ({
  book,
  onRegister,
  isRegistered,
  isAuthenticated,
}: Props) => {
  return (
    <article className="flex min-w-0 items-start gap-4 border-b border-[#293630]/12 py-4 sm:gap-5 sm:py-5">
      <Link
        href={`/books/${book.isbn}`}
        className="relative aspect-2/3 w-19 shrink-0 overflow-hidden rounded-md bg-[#eeece5] shadow-[0_4px_12px_rgb(38_48_43/12%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:w-21.5"
      >
        <Image
          src={book.largeImageUrl}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 76px, 86px"
          className="object-contain"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <Link
          href={`/books/${book.isbn}`}
          className="group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a]"
        >
          <h3 className="line-clamp-2 wrap-anywhere font-serif-jp text-base font-semibold leading-6 text-[#293630] group-hover:underline">
            {book.title}
          </h3>
          <p className="mt-1 truncate text-xs text-[#526158]">{book.author}</p>
          {book.publisherName && (
            <p className="mt-1 truncate text-xs text-[#64716a]">
              {book.publisherName}
              {book.seriesName ? `・${book.seriesName}` : ""}
            </p>
          )}
        </Link>
        <div className="mt-auto flex justify-end pt-2">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onRegister(book)}
              disabled={isRegistered}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-[#60736a] px-3 text-[11px] text-[#40584e] transition hover:bg-[#e7e9e4] disabled:cursor-not-allowed disabled:border-[#293630]/8 disabled:bg-[#e4e7e2] disabled:text-[#607068] sm:px-4"
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
          ) : (
            <LoginButton
              label="ログインして登録"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#60736a] px-3 text-[11px] text-[#40584e] transition hover:bg-[#e7e9e4] sm:px-4"
            />
          )}
        </div>
      </div>
    </article>
  );
};
