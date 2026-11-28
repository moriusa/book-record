"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiHeartFill,
  RiListCheck2,
} from "react-icons/ri";
import { useGetBooks } from "../hooks/useGetBooks";
import { authFetcher } from "@/lib/fetcher";
import type { ReadingList } from "@/types/readingList";
import { ReadingListCardsSkeleton } from "@/components/ui/LoadingSkeleton";

export default function ReadingListsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: books = [], isLoading: isBooksLoading } = useGetBooks();
  const { data: lists = [], isLoading } = useQuery({
    queryKey: ["reading-lists"],
    queryFn: () => authFetcher<ReadingList[]>("/reading-lists"),
  });
  const createMutation = useMutation({
    mutationFn: () =>
      authFetcher<ReadingList>("/reading-lists", {
        method: "POST",
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      setTitle("");
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["reading-lists"] });
    },
  });
  const favoriteCount = books.filter((book) => book.isFavorite).length;

  return (
    <main className="mx-auto max-w-265 px-5 pb-24 pt-6 text-[#293630] sm:px-8 sm:pt-10">
      <Link
        href="/bookshelf"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
      >
        <RiArrowLeftLine aria-hidden="true" />
        本棚へ戻る
      </Link>
      <header className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-[#344941]/15 pb-5 sm:mt-5 sm:pb-6">
        <div>
          <h1 className="font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[42px]">
            リスト
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#526158]">
            気になるテーマごとに、本棚の本をまとめておけます。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateDialogOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#344941] px-4 text-sm font-medium text-white transition-colors hover:bg-[#263a33]"
        >
          <RiAddLine className="text-base" aria-hidden="true" />
          新しいリストを作る
        </button>
      </header>

      <section
        className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="リスト一覧"
      >
        <Link
          href="/bookshelf/lists/favorites"
          className="group flex min-h-24 items-center gap-3 rounded-xl border border-[#a87669]/25 bg-[#fbf5f2] px-4 py-4 transition-colors hover:border-[#a87669]/60"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f3e7e1] text-lg text-[#8f5f55]">
            <RiHeartFill aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif-jp text-lg font-medium underline-offset-4 group-hover:underline">
              お気に入り
            </h2>
            <p className="mt-1 text-xs tabular-nums text-[#795b55]">
              {isBooksLoading ? "—" : `${favoriteCount}冊`}
            </p>
          </div>
          <RiArrowRightLine
            className="shrink-0 text-[#8f5f55]"
            aria-hidden="true"
          />
        </Link>
        {isLoading && <ReadingListCardsSkeleton />}
        {lists.map((list) => (
          <Link
            key={list.id}
            href={`/bookshelf/lists/${list.id}`}
            className="group flex min-h-24 items-center gap-3 rounded-xl border border-[#344941]/15 bg-[#faf9f5] px-4 py-4 transition-colors hover:border-[#344941]/35 hover:bg-white"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e8ece1] text-lg text-[#43584e]">
              <RiListCheck2 aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 wrap-anywhere font-serif-jp text-lg font-medium underline-offset-4 group-hover:underline">
                {list.title}
              </h2>
              <p className="mt-1 text-xs tabular-nums text-[#526158]">
                {list.items.length}冊
              </p>
            </div>
            <RiArrowRightLine
              className="shrink-0 text-[#43584e]"
              aria-hidden="true"
            />
          </Link>
        ))}
      </section>
      {!isLoading && lists.length === 0 && (
        <p className="mt-4 text-sm leading-6 text-[#526158]">
          まだ自分で作ったリストはありません。
        </p>
      )}
      {isCreateDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-list-dialog-title"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (title.trim()) createMutation.mutate();
            }}
            className="w-full max-w-sm rounded-2xl border border-[#344941]/15 bg-[#faf9f5] p-5 shadow-xl sm:p-6"
          >
            <h2
              id="create-list-dialog-title"
              className="font-serif-jp text-xl font-medium"
            >
              新しいリストを作る
            </h2>
            <p className="mt-3 text-xs leading-6 text-[#65736c]">
              あとから名前の変更や削除ができます。
            </p>
            <label
              htmlFor="new-list-title"
              className="mt-5 block text-sm font-medium"
            >
              リスト名
            </label>
            <input
              id="new-list-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              autoFocus
              placeholder="例：次に読みたい本"
              className="mt-2 min-h-12 w-full rounded-lg border border-[#344941]/20 bg-white px-4 text-base outline-none focus:border-[#60736a] focus:ring-1 focus:ring-[#60736a]"
            />
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending || !title.trim()}
                className="min-h-11 rounded-md bg-[#344941] px-3 text-xs font-medium text-white disabled:opacity-50"
              >
                {createMutation.isPending ? "作成中…" : "作成する"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setIsCreateDialogOpen(false);
                }}
                disabled={createMutation.isPending}
                className="min-h-11 rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#526159]"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
