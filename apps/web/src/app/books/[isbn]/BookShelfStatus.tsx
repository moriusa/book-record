"use client";

import Link from "next/link";
import { FaStar } from "react-icons/fa";
import LoginButton from "@/components/ui/LoginButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGetBookByIsbn } from "@/app/bookshelf/hooks/useGetBookByIsbn";
import { AddToBookshelfButton } from "./AddToBookshelfButton";

type Props = {
  bookData: { isbn: string };
};

const bookStatus = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
};

const BookShelfStatus = ({ bookData }: Props) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: book } = useGetBookByIsbn(bookData.isbn, {
    enabled: Boolean(user),
  });

  if (isAuthLoading) {
    return null;
  }

  return (
    <aside className="border border-[#293630]/10 bg-[#eeece5] p-6 sm:p-7 lg:sticky lg:top-24">
      <div>
        <h2 className="font-serif-jp text-xl font-medium">自分の記録</h2>
      </div>

      {!user ? (
        <div className="mt-7 border-t border-[#293630]/10 pt-6">
          <p className="text-[11px] leading-5 text-[#7c8781]">
            ログインすると、この本をあなたの本棚へ登録できます。
          </p>
          <div className="mt-4">
            <LoginButton
              label="Googleでログイン"
              className="w-full rounded-md bg-[#344941] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-[#263a33]"
            />
          </div>
        </div>
      ) : book ? (
        <div className="mt-7 border-t border-[#293630]/10 pt-6">
          <p className="text-[11px] font-medium text-[#5f6e66]">
            読書ステータス
          </p>
          <p className="mt-2 font-serif-jp text-lg text-[#344941]">
            {bookStatus[book.status]}
          </p>

          {book.rating !== null && book.rating > 0 && (
            <div className="mt-6">
              <p className="text-[11px] font-medium text-[#5f6e66]">
                この本の評価
              </p>
              <span
                className="mt-3 flex gap-1 text-sm text-[#8c7951]"
                aria-label={`評価 ${book.rating}点`}
              >
                {Array.from({ length: book.rating }, (_, index) => (
                  <FaStar key={index} aria-hidden="true" />
                ))}
              </span>
            </div>
          )}

          <div className="mt-7 border-t border-[#293630]/10 pt-5">
            <Link
              href={`/bookshelf/edit/${book.id}`}
              className="block rounded-md border border-[#293630]/12 bg-[#faf9f5] px-4 py-3 text-center text-xs font-medium text-[#526159] transition hover:border-[#60736a] hover:bg-white"
            >
              本棚の内容を編集
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-7 border-t border-[#293630]/10 pt-6">
          <p className="text-[11px] leading-5 text-[#7c8781]">
            この本はまだ本棚に登録されていません。
          </p>
          <div className="mt-4">
            <AddToBookshelfButton isbn={bookData.isbn} />
          </div>
        </div>
      )}
    </aside>
  );
};

export default BookShelfStatus;
