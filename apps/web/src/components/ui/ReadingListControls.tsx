"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiAddLine,
  RiArrowRightLine,
  RiHeartFill,
  RiHeartLine,
  RiListCheck2,
} from "react-icons/ri";
import { authFetcher } from "@/lib/fetcher";
import type { Book } from "@/types/book";
import type { ReadingList } from "@/types/readingList";

type Props = { userBookId: string; isFavorite: boolean };

export default function ReadingListControls({ userBookId, isFavorite }: Props) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { data: lists = [] } = useQuery({
    queryKey: ["reading-lists"],
    queryFn: () => authFetcher<ReadingList[]>("/reading-lists"),
  });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reading-lists"] });
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };
  const favoriteMutation = useMutation({
    mutationFn: () =>
      authFetcher<{ isFavorite: boolean }>(
        `/reading-lists/favorites/${userBookId}`,
        { method: "PUT" },
      ),
    onSuccess: ({ isFavorite: nextIsFavorite }) => {
      queryClient.setQueriesData<Book>({ queryKey: ["book"] }, (book) =>
        book ? { ...book, isFavorite: nextIsFavorite } : book,
      );
      queryClient.setQueryData<Book[]>(["books"], (books) =>
        books?.map((book) =>
          book.id === userBookId
            ? { ...book, isFavorite: nextIsFavorite }
            : book,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["reading-lists"] });
    },
  });
  const itemMutation = useMutation({
    mutationFn: ({
      listId,
      isIncluded,
    }: {
      listId: string;
      isIncluded: boolean;
    }) =>
      authFetcher(`/reading-lists/${listId}/items/${userBookId}`, {
        method: isIncluded ? "DELETE" : "PUT",
      }),
    onSuccess: invalidate,
  });
  const createMutation = useMutation({
    mutationFn: () =>
      authFetcher<ReadingList>("/reading-lists", {
        method: "POST",
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      setTitle("");
      invalidate();
    },
  });

  return (
    <aside className="border border-[#293630]/10 bg-[#eeece5] p-6 sm:p-7">
      <h2 className="font-serif-jp text-xl font-medium">お気に入り・リスト</h2>
      <button
        type="button"
        onClick={() => favoriteMutation.mutate()}
        disabled={favoriteMutation.isPending}
        className={`mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-4 text-xs font-medium transition disabled:opacity-60 ${
          isFavorite
            ? "border-[#a87669]/35 bg-[#fbf1ed] text-[#9a5c50]"
            : "border-[#293630]/12 bg-[#faf9f5] text-[#526159] hover:border-[#a87669]/45"
        }`}
      >
        {isFavorite ? (
          <RiHeartFill aria-hidden="true" />
        ) : (
          <RiHeartLine aria-hidden="true" />
        )}
        {isFavorite ? "お気に入りから外す" : "お気に入りに追加"}
      </button>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#293630]/12 bg-[#faf9f5] px-4 text-xs font-medium text-[#526159] transition hover:border-[#60736a] hover:bg-white"
      >
        <RiListCheck2 aria-hidden="true" />
        {isOpen ? "リストを閉じる" : "リストに追加"}
      </button>
      {isOpen && (
        <div className="mt-5 border-t border-[#293630]/10 pt-5">
          {lists.length > 0 ? (
            <div className="space-y-1">
              {lists.map((list) => {
                const isIncluded = list.items.some(
                  (item) => item.id === userBookId,
                );
                return (
                  <label
                    key={list.id}
                    className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-xs text-[#526159] hover:bg-[#e5e7e1]"
                  >
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={() =>
                        itemMutation.mutate({ listId: list.id, isIncluded })
                      }
                      disabled={itemMutation.isPending}
                      className="size-4 accent-[#40584e]"
                    />
                    {list.title}
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="text-xs leading-6 text-[#75817b]">
              まだリストはありません。
            </p>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (title.trim()) createMutation.mutate();
            }}
            className="mt-4 flex gap-2"
          >
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              placeholder="新しいリスト名"
              className="min-w-0 flex-1 rounded-md border border-[#293630]/12 bg-white px-3 text-xs outline-none focus:border-[#60736a]"
            />
            <button
              type="submit"
              disabled={createMutation.isPending || !title.trim()}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-[#40584e] text-white disabled:opacity-45"
              aria-label="リストを作成"
            >
              <RiAddLine className="text-lg" aria-hidden="true" />
            </button>
          </form>
          <Link
            href="/bookshelf/lists"
            className="mt-5 flex min-h-10 items-center justify-between border-t border-[#293630]/10 pt-4 text-xs text-[#65736c] transition-colors hover:text-[#344941]"
          >
            リストを管理する
            <RiArrowRightLine aria-hidden="true" />
          </Link>
        </div>
      )}
    </aside>
  );
}
