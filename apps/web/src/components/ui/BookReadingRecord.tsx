import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { RiEditLine } from "react-icons/ri";
import type { Book } from "@/types/book";

const statusLabels = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
};

type Props = {
  book: Pick<Book, "id" | "status" | "rating" | "review">;
};

export default function BookReadingRecord({ book }: Props) {
  return (
    <div className="mt-4 border-t border-[#344941]/15 pt-4">
      <dl className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-sm text-[#526158]">読書ステータス</dt>
          <dd className="rounded-full bg-[#faf9f5] px-3 py-1.5 text-sm font-medium text-[#344941]">
            {statusLabels[book.status]}
          </dd>
        </div>
        {book.rating !== null && book.rating > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="text-sm text-[#526158]">この本の評価</dt>
            <dd className="flex gap-1 text-sm text-[#79643c]">
              <span className="sr-only">{book.rating}点</span>
              {Array.from({ length: book.rating }, (_, index) => (
                <FaStar key={index} aria-hidden="true" />
              ))}
            </dd>
          </div>
        )}
        {book.review && (
          <div>
            <dt className="text-sm text-[#526158]">メモ</dt>
            <dd className="mt-2 rounded-lg bg-[#faf9f5] p-3 text-sm leading-7 whitespace-pre-wrap wrap-anywhere">
              {book.review}
            </dd>
          </div>
        )}
      </dl>
      <Link
        href={`/bookshelf/edit/${book.id}`}
        className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#344941]/20 bg-[#faf9f5] px-4 text-sm font-medium text-[#344941] transition-colors hover:border-[#344941]/40 hover:bg-white"
      >
        <RiEditLine aria-hidden="true" />
        本棚の内容を編集
      </Link>
    </div>
  );
}
