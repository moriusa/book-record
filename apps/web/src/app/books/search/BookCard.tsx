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
    <article className="group flex min-w-0 items-start gap-4 border-b border-[#293630]/9 py-6 sm:gap-5">
      <Link
        href={`/books/${book.isbn}`}
        className="relative aspect-2/3 w-19 shrink-0 self-start overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[4px_5px_12px_rgb(38_48_43/13%)] transition duration-200 group-hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:w-21.5"
      >
        <Image
          src={book.largeImageUrl}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 76px, 86px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <Link
          href={`/books/${book.isbn}`}
          className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a]"
        >
          <p className="line-clamp-2 wrap-break-word font-serif-jp text-base font-medium leading-6 text-[#293630] group-hover:underline">
            {book.title}
          </p>
          <p className="mt-2 truncate text-[11px] text-[#68766f]">
            {book.author}
          </p>
          {book.publisherName && (
            <p className="mt-1 truncate text-[10px] text-[#939c97]">
              {book.publisherName}
              {book.seriesName ? `・${book.seriesName}` : ""}
            </p>
          )}
        </Link>
        <div className="mt-auto flex justify-end pt-4">
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
