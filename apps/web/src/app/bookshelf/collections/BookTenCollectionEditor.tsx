"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiBookOpenLine,
  RiCheckLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetBooks } from "@/app/bookshelf/hooks/useGetBooks";
import { authFetcher } from "@/lib/fetcher";
import type { Book } from "@/types/book";
import type { BookCollection } from "@/types/collection";

type Props = {
  collection?: BookCollection;
};

const COLLECTION_SIZE = 10;

const reorder = (ids: string[], from: number, to: number) => {
  const next = [...ids];
  const [item] = next.splice(from, 1);
  if (!item) return ids;
  next.splice(to, 0, item);
  return next;
};

export default function BookTenCollectionEditor({ collection }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: books = [], isLoading, error } = useGetBooks();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    [...(collection?.items ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((item) => item.id),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const booksById = useMemo(
    () => new Map(books.map((book) => [book.id, book])),
    [books],
  );
  const selectedBooks = selectedIds
    .map((id) => booksById.get(id))
    .filter((book): book is Book => Boolean(book));

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        userBookIds: selectedIds,
      };

      return collection
        ? authFetcher<BookCollection>(`/collections/${collection.id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
          })
        : authFetcher<BookCollection>("/collections", {
            method: "POST",
            body: JSON.stringify(body),
          });
    },
    onSuccess: (savedCollection) => {
      queryClient.invalidateQueries({ queryKey: ["book-collections"] });
      queryClient.setQueryData(
        ["book-collections", savedCollection.id],
        savedCollection,
      );

      if (!collection) {
        router.replace(`/bookshelf/collections/${savedCollection.id}`);
        return;
      }

      setSuccessMessage("変更を保存しました。");
    },
    onError: (mutationError) => {
      setErrorMessage(mutationError.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      authFetcher<{ id: string }>(`/collections/${collection?.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-collections"] });
      router.push("/bookshelf/collections");
    },
    onError: (mutationError) => {
      setErrorMessage(mutationError.message);
    },
  });

  const toggleBook = (id: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id);
      }

      if (current.length >= COLLECTION_SIZE) {
        setErrorMessage("選べる本は10冊までです。");
        return current;
      }

      return [...current, id];
    });
  };

  const saveCollection = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (selectedIds.length !== COLLECTION_SIZE) {
      setErrorMessage("本を10冊選んでください。");
      return;
    }

    saveMutation.mutate();
  };

  if (isLoading) {
    return <p className="text-sm text-[#75817b]">本棚を読み込んでいます…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-[#75817b]">本棚を取得できませんでした。</p>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
      <div>
        <div className="mt-10 flex items-end justify-between border-b border-[#293630]/10 pb-4">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-[#839089]">
              SELECT FROM YOUR BOOKSHELF
            </p>
            <h2 className="mt-2 font-serif-jp text-xl font-medium">
              本棚から10冊を選ぶ
            </h2>
          </div>
          <span
            className="font-serif-jp text-xl text-[#40584e]"
            aria-live="polite"
          >
            {selectedIds.length}
            <small className="ml-1 font-sans text-xs text-[#7b8781]">
              / 10冊
            </small>
          </span>
        </div>

        {books.length === 0 ? (
          <div className="py-16 text-center">
            <RiBookOpenLine className="mx-auto text-3xl text-[#9ba49f]" />
            <p className="mt-4 font-serif-jp text-lg">
              まずは本を本棚に追加しましょう
            </p>
            <Link
              href="/books/search"
              className="mt-5 inline-flex text-xs text-[#50665c] underline underline-offset-4"
            >
              本を探しにいく
            </Link>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5">
            {books.map((book) => {
              const selectionIndex = selectedIds.indexOf(book.id);
              const isSelected = selectionIndex !== -1;

              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => toggleBook(book.id)}
                  aria-pressed={isSelected}
                  className="group relative min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-4"
                >
                  <div
                    className={`relative aspect-2/3 overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] bg-[#d9d4c5] shadow-[5px_7px_16px_rgb(38_48_43/15%)] transition ${isSelected ? "ring-2 ring-[#40584e] ring-offset-3" : "group-hover:-translate-y-1"}`}
                  >
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 28vw, (max-width: 1024px) 22vw, 180px"
                        className="object-cover"
                      />
                    ) : (
                      <RiBookOpenLine className="absolute inset-0 m-auto text-2xl text-[#75817b]" />
                    )}
                    {isSelected && (
                      <span className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#344941] text-xs font-medium text-white shadow-sm">
                        {selectionIndex + 1}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 min-h-8 line-clamp-2 font-serif-jp text-xs font-medium leading-4 text-[#344941]">
                    {book.title}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-[#7b8781]">
                    {book.author}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <aside className="border border-[#293630]/10 bg-[#eeece5] p-5 sm:p-6 lg:sticky lg:top-24">
        <p className="text-[10px] tracking-[0.16em] text-[#839089]">YOUR TEN</p>
        <h2 className="mt-2 font-serif-jp text-xl font-medium">選んだ10冊</h2>
        <p className="mt-3 text-xs leading-6 text-[#748078]">
          選んだ順番が表示順になります。矢印で順番を入れ替えられます。
        </p>

        <ol className="mt-6 divide-y divide-[#293630]/10 border-y border-[#293630]/10">
          {selectedBooks.map((book, index) => (
            <li
              key={book.id}
              className="grid grid-cols-[24px_38px_minmax(0,1fr)_auto] items-center gap-3 py-3"
            >
              <span className="font-serif-jp text-sm text-[#60736a]">
                {index + 1}
              </span>
              <div className="relative aspect-2/3 overflow-hidden bg-[#d9d4c5]">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt=""
                    fill
                    sizes="38px"
                    className="object-cover"
                  />
                ) : (
                  <RiBookOpenLine className="absolute inset-0 m-auto text-sm text-[#75817b]" />
                )}
              </div>
              <p className="line-clamp-2 font-serif-jp text-xs font-medium">
                {book.title}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIds((ids) => reorder(ids, index, index - 1))
                  }
                  disabled={index === 0}
                  aria-label={`${book.title}を上へ移動`}
                  className="p-1 text-[#66746c] disabled:opacity-25"
                >
                  <RiArrowUpLine aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIds((ids) => reorder(ids, index, index + 1))
                  }
                  disabled={index === selectedBooks.length - 1}
                  aria-label={`${book.title}を下へ移動`}
                  className="p-1 text-[#66746c] disabled:opacity-25"
                >
                  <RiArrowDownLine aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
          {Array.from({ length: COLLECTION_SIZE - selectedBooks.length }).map(
            (_, index) => (
              <li
                key={`empty-${index}`}
                className="flex h-16 items-center gap-3 py-3 text-xs text-[#99a19d]"
              >
                <span className="w-6 font-serif-jp">
                  {selectedBooks.length + index + 1}
                </span>
                <span>本を選択してください</span>
              </li>
            ),
          )}
        </ol>

        {errorMessage && (
          <p role="alert" className="mt-4 text-xs text-red-700">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p
            role="status"
            className="mt-4 flex items-center gap-1.5 text-xs text-[#40584e]"
          >
            <RiCheckLine aria-hidden="true" />
            {successMessage}
          </p>
        )}

        <button
          type="button"
          onClick={saveCollection}
          disabled={
            saveMutation.isPending || selectedIds.length !== COLLECTION_SIZE
          }
          className="mt-6 w-full rounded-md bg-[#344941] px-4 py-3.5 text-xs font-medium text-white transition-colors hover:bg-[#263a33] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveMutation.isPending
            ? "保存中…"
            : collection
              ? "変更を保存"
              : "10選を作成"}
        </button>

        {collection && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("この10選を削除しますか？"))
                deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
            className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-xs text-[#8a5a51] transition hover:text-[#6e4038] disabled:opacity-50"
          >
            <RiDeleteBinLine aria-hidden="true" />
            {deleteMutation.isPending ? "削除中…" : "この10選を削除"}
          </button>
        )}
      </aside>
    </div>
  );
}
