import Image from "next/image";
import Link from "next/link";
import { RiBookOpenLine, RiStarFill } from "react-icons/ri";
import { Book } from "@/types/book";

type Props = {
  book: Book;
};

const BookListItem = ({ book }: Props) => {
  return (
    <Link
      href={`/books/${book.isbn}`}
      className="group flex gap-5 border-b border-[#293630]/10 py-6 transition hover:bg-[#eeece5]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 sm:items-center sm:gap-7"
    >
      <div className="relative h-24 w-17 shrink-0 overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[4px_5px_12px_rgb(38_48_43/15%)]">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            sizes="68px"
            className="object-cover"
          />
        ) : (
          <RiBookOpenLine
            className="absolute inset-0 m-auto text-xl text-[#66756d]"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-serif-jp text-base font-medium text-[#293630] group-hover:underline sm:text-lg">
          {book.title}
        </p>
        <p className="mt-1 text-[11px] text-[#7c8781]">
          {book.author} ・ {book.publisher || "出版社不明"}
        </p>
        {book.review && (
          <p className="mt-4 line-clamp-2 text-xs text-[#65736c]">
            {book.review}
          </p>
        )}
        {book.rating !== null && book.rating > 0 && (
          <span
            className="mt-3 flex gap-0.5 text-[10px] text-[#8c8062]"
            aria-label={`評価 ${book.rating}点`}
          >
            {Array.from({ length: book.rating }, (_, index) => (
              <RiStarFill key={index} aria-hidden="true" />
            ))}
          </span>
        )}
      </div>
    </Link>
  );
};

export default BookListItem;
