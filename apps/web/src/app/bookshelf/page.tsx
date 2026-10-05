"use client";

import Link from "next/link";
import { useGetBooks } from "./hooks/useGetBooks";
import BookshelfSection from "@/components/ui/BookshelfSection";

const statusOrder = [
  "WANT_TO_READ",
  "READING",
  "COMPLETED",
  "ON_HOLD",
] as const;

const statusLabels = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
} satisfies Record<(typeof statusOrder)[number], string>;

const Page = () => {
  const { data, isLoading, error } = useGetBooks();

  if (isLoading) {
    return <p className="p-6">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-6">本棚を取得できませんでした。</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">本棚</h1>

        <Link
          href="/bookshelf/search"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          本を追加
        </Link>
      </div>

      {statusOrder.map((status) => {
        const books = data?.filter((book) => book.status === status) ?? [];

        return (
          <BookshelfSection
            key={status}
            title={statusLabels[status]}
            books={books}
          />
        );
      })}
    </main>
  );
};

export default Page;
