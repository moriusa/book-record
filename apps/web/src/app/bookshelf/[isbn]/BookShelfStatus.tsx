"use client";

import { RakutenBookItem } from "@/lib/fetchRakutenBooks";
import { useGetBookByIsbn } from "../hooks/useGetBookByIsbn";
import { AddToBookshelfButton } from "./AddToBookshelfButton";
import { FaStar } from "react-icons/fa";

type Props = {
  bookData: RakutenBookItem;
};

const bookStatus = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
};

const BookShelfStatus = ({ bookData }: Props) => {
  const { data: book } = useGetBookByIsbn(bookData.isbn);

  return (
    <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">あなたの本棚</h2>

      {book ? (
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
    </div>
  );
};

export default BookShelfStatus;
