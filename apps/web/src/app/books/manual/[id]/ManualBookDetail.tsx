"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import { RiBook3Line, RiEditLine } from "react-icons/ri";
import BookTenToggleButton from "@/app/books/[isbn]/BookTenToggleButton";
import ReadingListControls from "@/components/ui/ReadingListControls";
import { authFetcher } from "@/lib/fetcher";
import {
  getBookAuthorLabel,
  getBookPublisherLabel,
} from "@/lib/getBookAuthorLabel";
import type { Book } from "@/types/book";

type Props = { id: string };

const statusLabels = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
};

export default function ManualBookDetail({ id }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const {
    data: book,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => authFetcher<Book>(`/books/${id}`),
    retry: false,
  });
  const deleteBookMutation = useMutation({
    mutationFn: () => authFetcher(`/books/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      router.push("/bookshelf");
    },
  });

  if (isPending) {
    return <main className="p-8 text-sm text-[#75817b]">読み込み中…</main>;
  }

  if (isError || !book || book.source !== "manual") {
    return (
      <main className="p-8 text-sm text-[#75817b]">
        この本の情報を取得できませんでした。
      </main>
    );
  }

  const author = getBookAuthorLabel(book.author);

  return (
    <main className="text-[#293630]">
      <section className="border-b border-[#293630]/8">
        <div className="mx-auto max-w-270 px-5 pb-16 pt-7 sm:px-8 sm:pb-24 sm:pt-10">
          <div className="grid gap-12 sm:grid-cols-[220px_1fr] sm:gap-14 lg:grid-cols-[260px_1fr] lg:gap-20">
            <div className="mx-auto w-47.5 sm:w-full">
              <div className="flex aspect-2/3 w-full items-center justify-center overflow-hidden rounded-r-sm rounded-l-xs border-l-[5px] border-black/10 bg-[#d9d4c5] shadow-[10px_14px_28px_rgb(38_48_43/18%)]">
                <RiBook3Line
                  className="text-4xl text-[#66756d]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] tracking-[0.16em] text-[#7c8881]">
                MANUAL ENTRY
              </p>
              <h1 className="mt-4 font-serif-jp text-4xl font-medium tracking-[-0.045em] text-[#293630] sm:text-5xl">
                {book.title}
              </h1>
              <p className="mt-4 text-base text-[#65726b]">{author}</p>
              {book.publisher && (
                <p className="mt-2 text-sm text-[#7c8781]">{book.publisher}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-270 gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_360px] lg:gap-20">
        <article>
          <h2 className="font-serif-jp text-2xl font-medium">本の情報</h2>
          <dl className="mt-6 divide-y divide-[#293630]/8 border-y border-[#293630]/8">
            {[
              ["著者・サークル名", author],
              ["出版社・頒布元", getBookPublisherLabel(book.publisher)],
              ["登録方法", "手動登録"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[120px_1fr] py-4 text-xs"
              >
                <dt className="text-[#909994]">{label}</dt>
                <dd className="text-[#4b5b53]">{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <div className="space-y-6 lg:sticky lg:top-24">
          <aside className="border border-[#293630]/10 bg-[#eeece5] p-6 sm:p-7">
            <h2 className="font-serif-jp text-xl font-medium">自分の記録</h2>
            <div className="mt-7 border-t border-[#293630]/10 pt-6">
              <p className="text-[11px] font-medium text-[#5f6e66]">
                読書ステータス
              </p>
              <p className="mt-2 font-serif-jp text-lg text-[#344941]">
                {statusLabels[book.status]}
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
              {book.review && (
                <div className="mt-6">
                  <p className="text-[11px] font-medium text-[#5f6e66]">メモ</p>
                  <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-[#526159]">
                    {book.review}
                  </p>
                </div>
              )}
              <Link
                href={`/bookshelf/edit/${book.id}`}
                className="mt-7 flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#293630]/12 bg-[#faf9f5] px-4 text-xs font-medium text-[#526159] transition hover:border-[#60736a] hover:bg-white"
              >
                <RiEditLine aria-hidden="true" />
                本棚の内容を編集
              </Link>
            </div>
          </aside>

          <ReadingListControls
            userBookId={book.id}
            isFavorite={book.isFavorite}
          />

          <aside className="border border-[#293630]/10 bg-[#eeece5] p-6 sm:p-7">
            <BookTenToggleButton userBookId={book.id} />
          </aside>

          <aside className="border border-[#293630]/10 bg-[#fbf5f2] p-6 sm:p-7">
            {isDeleteConfirmationOpen ? (
              <>
                <p className="text-xs leading-6 text-[#73534d]">
                  本棚から削除しますか？読書ステータス・評価・メモも削除されます。
                </p>
                {deleteBookMutation.error && (
                  <p className="mt-3 text-xs text-[#a04438]" role="alert">
                    削除に失敗しました。時間をおいてもう一度お試しください。
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => deleteBookMutation.mutate()}
                    disabled={deleteBookMutation.isPending}
                    className="rounded-md bg-[#9b554a] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#82473e] disabled:opacity-60"
                  >
                    {deleteBookMutation.isPending ? "削除中…" : "削除する"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmationOpen(false)}
                    disabled={deleteBookMutation.isPending}
                    className="rounded-md border border-[#293630]/12 bg-white px-3 py-2.5 text-xs text-[#526159] transition hover:border-[#60736a] disabled:opacity-60"
                  >
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsDeleteConfirmationOpen(true)}
                className="w-full rounded-md px-4 py-2.5 text-xs text-[#986157] transition hover:bg-[#f7ece8] hover:text-[#82473e]"
              >
                本棚から削除
              </button>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
