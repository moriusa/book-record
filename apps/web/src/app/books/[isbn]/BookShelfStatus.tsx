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
    <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">あなたの本棚</h2>

      {!user ? (
        <div className="mt-5">
          <p className="text-sm text-gray-600">
            ログインすると、この本をあなたの本棚へ登録できます。
          </p>
          <div className="mt-4">
            <LoginButton />
          </div>
        </div>
      ) : book ? (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">ステータス</span>
            <span className="font-medium">{bookStatus[book.status]}</span>
          </div>

          {book.rating && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">評価</span>
              <span className="flex items-center gap-1">
                <FaStar className="pb-0.5" /> {book.rating} / 5
              </span>
            </div>
          )}

          <div className="mt-5 border-t pt-5">
            <Link
              href={`/bookshelf/edit/${book.id}`}
              className="block rounded-lg border px-4 py-2 text-center text-sm font-medium transition hover:bg-gray-50"
            >
              本棚の内容を編集
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-sm text-gray-600">
            この本はまだ本棚に登録されていません。
          </p>
          <div className="mt-4">
            <AddToBookshelfButton isbn={bookData.isbn} />
          </div>
        </div>
      )}
    </section>
  );
};

export default BookShelfStatus;
