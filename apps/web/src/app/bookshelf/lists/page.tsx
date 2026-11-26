"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
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
    <main className="mx-auto max-w-265 px-5 pb-24 pt-7 text-[#293630] sm:px-8 sm:pt-14">
      <p className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#7b8781]">
        <RiListCheck2 className="text-sm" aria-hidden="true" />
        MY LISTS
      </p>
      <h1 className="mt-2 font-serif-jp text-2xl font-medium tracking-[-0.04em] sm:mt-3 sm:text-[40px]">
        リスト
      </h1>
      <p className="mt-2 text-sm text-[#75817b] sm:mt-3">
        気になるテーマごとに、本棚の本をまとめておけます。
      </p>

      <button
        type="button"
        onClick={() => setIsCreateDialogOpen(true)}
        className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-md bg-[#344941] px-4 text-xs font-medium text-white transition hover:bg-[#263a33] sm:mt-10"
      >
        <RiAddLine className="text-base" aria-hidden="true" />
        新しいリストを作る
      </button>

      <section
        className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="リスト一覧"
      >
        <Link
          href="/bookshelf/lists/favorites"
          className="group min-h-42 border border-[#a87669]/25 bg-[#fbf5f2] p-6 transition hover:border-[#a87669]/50"
        >
          <RiHeartFill className="text-xl text-[#a36a5e]" aria-hidden="true" />
          <h2 className="mt-6 font-serif-jp text-xl font-medium">お気に入り</h2>
          <p className="mt-2 text-xs text-[#8b716a]">
            {isBooksLoading ? "—" : `${favoriteCount}冊`}
          </p>
          <span className="mt-6 flex items-center gap-2 text-xs text-[#8f5f55]">
            見る
            <RiArrowRightLine
              className="transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
        {isLoading && <ReadingListCardsSkeleton />}
        {lists.map((list) => (
          <Link
            key={list.id}
            href={`/bookshelf/lists/${list.id}`}
            className="group min-h-42 border border-[#293630]/10 bg-[#faf9f5] p-6 transition hover:border-[#718078]"
          >
            <RiListCheck2
              className="text-xl text-[#60736a]"
              aria-hidden="true"
            />
            <h2 className="mt-6 line-clamp-2 font-serif-jp text-xl font-medium">
              {list.title}
            </h2>
            <p className="mt-2 text-xs text-[#75817b]">{list.items.length}冊</p>
            <span className="mt-6 flex items-center gap-2 text-xs text-[#50665c]">
              開く
              <RiArrowRightLine
                className="transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </section>
      {!isLoading && lists.length === 0 && (
        <p className="mt-6 text-xs text-[#75817b]">
          リストを作ると、同じテーマの本をひとまとめにできます。
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
            className="w-full max-w-sm bg-[#faf9f5] p-6 shadow-2xl"
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
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              autoFocus
              placeholder="例：次に読みたい本"
              className="mt-5 min-h-12 w-full rounded-md border border-[#293630]/12 bg-white px-4 text-sm outline-none focus:border-[#60736a]"
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
