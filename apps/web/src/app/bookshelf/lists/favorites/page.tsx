"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiArrowLeftLine, RiHeartFill, RiMore2Fill } from "react-icons/ri";
import { useGetBooks } from "../../hooks/useGetBooks";
import BookListItem from "@/components/ui/BookListItem";
import { authFetcher } from "@/lib/fetcher";

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { data: books = [], isLoading } = useGetBooks();
  const favorites = books.filter((book) => book.isFavorite);
  const favoriteMutation = useMutation({
    mutationFn: (userBookId: string) =>
      authFetcher(`/reading-lists/favorites/${userBookId}`, { method: "PUT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["reading-lists"] });
    },
  });
  return (
    <main className="mx-auto max-w-225 px-5 pb-24 pt-10 text-[#293630] sm:px-8 sm:pt-14">
      <Link
        href="/bookshelf/lists"
        className="inline-flex min-h-10 items-center gap-2 text-xs text-[#65736c] hover:text-[#344941]"
      >
        <RiArrowLeftLine aria-hidden="true" />
        リストへ戻る
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <RiHeartFill className="text-xl text-[#a36a5e]" aria-hidden="true" />
        <h1 className="font-serif-jp text-3xl font-medium">お気に入り</h1>
      </div>
      {isLoading ? (
        <p className="mt-10 text-sm text-[#75817b]">読み込み中…</p>
      ) : favorites.length > 0 ? (
        <div className="mt-8 border-t border-[#293630]/10">
          {favorites.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-3 border-b border-[#293630]/10 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <BookListItem book={book} className="border-b-0" />
              </div>
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId((current) =>
                      current === book.id ? null : book.id,
                    )
                  }
                  className="flex size-10 items-center justify-center rounded-md text-[#68766f] transition hover:bg-[#eeece5] hover:text-[#344941]"
                  aria-label={`${book.title}のメニューを開く`}
                  aria-expanded={openMenuId === book.id}
                >
                  <RiMore2Fill className="text-lg" aria-hidden="true" />
                </button>
                {openMenuId === book.id && (
                  <div className="absolute right-0 top-11 z-10 w-42 border border-[#293630]/10 bg-[#faf9f5] p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        favoriteMutation.mutate(book.id);
                        setOpenMenuId(null);
                      }}
                      disabled={favoriteMutation.isPending}
                      className="flex min-h-10 w-full items-center rounded-sm px-3 text-left text-xs text-[#986157] transition hover:bg-[#fbf1ed] disabled:opacity-50"
                    >
                      お気に入りから外す
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 border-y border-[#293630]/10 py-16 text-center text-sm text-[#75817b]">
          お気に入りの本はまだありません。
        </p>
      )}
    </main>
  );
}
