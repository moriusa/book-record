"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RiBookmark3Line } from "react-icons/ri";
import { useGetCollections } from "@/app/bookshelf/collections/hooks/useGetCollections";
import { authFetcher } from "@/lib/fetcher";
import type { BookCollection } from "@/types/collection";

type Props = {
  userBookId: string;
};

export default function BookTenToggleButton({ userBookId }: Props) {
  const queryClient = useQueryClient();
  const { data: collections = [], isLoading, error } = useGetCollections();
  const collection = collections[0];
  const isSelected =
    collection?.items.some((item) => item.id === userBookId) ?? false;
  const selectedCount = collection?.items.length ?? 0;

  const toggleMutation = useMutation({
    mutationFn: () =>
      isSelected
        ? authFetcher<BookCollection | null>(
            `/collections/items/${userBookId}`,
            {
              method: "DELETE",
            },
          )
        : authFetcher<BookCollection>("/collections/items", {
            method: "POST",
            body: JSON.stringify({ userBookId }),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-collections"] });
    },
  });

  const isFull = selectedCount >= 10;
  const message = isSelected
    ? "この本を10選に追加しています。"
    : isFull
      ? "10冊選択済みです。外したい本の詳細画面から解除できます。"
      : `いまの自分を表す本を選べます。あと${10 - selectedCount}冊追加できます。`;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.14em] text-[#839089]">
            BOOK TEN
          </p>
          <h3 className="mt-1 font-serif-jp text-base font-medium">
            名刺代わりの本10選
          </h3>
        </div>
        <span className="font-serif-jp text-sm text-[#60736a]">
          {selectedCount}/10
        </span>
      </div>
      <p className="mt-3 text-[11px] leading-5 text-[#75817b]">{message}</p>

      {error ? (
        <p role="alert" className="mt-3 text-xs text-[#a04438]">
          10選の状態を取得できませんでした。
        </p>
      ) : (
        <button
          type="button"
          onClick={() => toggleMutation.mutate()}
          disabled={
            isLoading || toggleMutation.isPending || (!isSelected && isFull)
          }
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isSelected ? "border border-[#293630]/12 bg-[#faf9f5] text-[#526159] hover:border-[#9b554a] hover:text-[#8a5148]" : "bg-[#344941] text-white hover:bg-[#263a33]"}`}
        >
          <RiBookmark3Line aria-hidden="true" />
          {toggleMutation.isPending
            ? "更新中…"
            : isSelected
              ? "10選から外す"
              : isFull
                ? "10冊選択済み"
                : "10選に追加"}
        </button>
      )}

      {toggleMutation.error && (
        <p role="alert" className="mt-3 text-xs text-[#a04438]">
          {toggleMutation.error.message}
        </p>
      )}

      <Link
        href="/bookshelf/collections"
        className="mt-4 flex w-fit ml-auto text-[11px] text-[#60736a] underline underline-offset-4 transition hover:text-[#344941]"
      >
        10選を見る
      </Link>
    </div>
  );
}
