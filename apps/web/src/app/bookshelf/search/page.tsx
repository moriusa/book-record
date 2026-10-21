"use client";
import { SearchBox } from "./SearchBox";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { RiAddLine, RiCheckLine } from "react-icons/ri";
import { useBookSearch } from "./hooks/useBookSearch";
import { useBulkCreateBooks } from "./hooks/useBulkCreateBooks";

const SearchPage = () => {
  const {
    books,
    searchTitle,
    hasSearched,
    hasMore,
    handleSearch: executeSearch,
    isLoading,
    loadMore,
  } = useBookSearch();
  const loadMoreTargetRef = useRef<HTMLDivElement>(null);
  const [selectedIsbns, setSelectedIsbns] = useState<Set<string>>(new Set());
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const bulkCreateBooks = useBulkCreateBooks();

  useEffect(() => {
    const target = loadMoreTargetRef.current;

    if (!target || !hasMore || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const toggleBook = (isbn: string) => {
    setSelectedIsbns((current) => {
      const next = new Set(current);

      if (next.has(isbn)) {
        next.delete(isbn);
      } else {
        next.add(isbn);
      }

      return next;
    });
  };

  const handleSearch = (params: Parameters<typeof executeSearch>[0]) => {
    setSelectedIsbns(new Set());
    setBulkMessage(null);
    setBulkError(null);
    executeSearch(params);
  };

  const addSelectedBooks = async () => {
    const selectedBooks = books.filter((book) => selectedIsbns.has(book.isbn));

    if (selectedBooks.length === 0) {
      return;
    }

    try {
      setBulkError(null);
      const result = await bulkCreateBooks.mutateAsync(selectedBooks);
      setBulkMessage(
        result.skipped > 0
          ? `${result.added}冊を「読みたい」に追加しました（${result.skipped}冊はすでに登録済みです）`
          : `${result.added}冊を「読みたい」に追加しました`,
      );
      setSelectedIsbns(new Set());
    } catch (error) {
      setBulkError(
        error instanceof Error
          ? error.message
          : "本の一括登録に失敗しました",
      );
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.16em] text-amber-800">
          ADD A BOOK
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          追加する本を検索
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          タイトルを入力して、登録したい本を探せます。
        </p>
      </div>

      <div className="mt-6 max-w-2xl">
        <SearchBox
          key={searchTitle}
          onSearch={handleSearch}
          isLoading={isLoading}
          initialKeyword={searchTitle}
        />
      </div>

      {bulkMessage && (
        <p className="mt-4 text-sm font-semibold text-emerald-800" role="status">
          {bulkMessage}
        </p>
      )}
      {bulkError && (
        <p className="mt-4 text-sm font-semibold text-rose-700" role="alert">
          {bulkError}
        </p>
      )}

      <div className="mt-10">
        {hasSearched && !isLoading && books.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/50 px-6 py-12 text-center">
            <p className="text-base font-semibold text-stone-800">
              該当する本が見つかりませんでした
            </p>
            <p className="mt-2 text-sm text-stone-600">
              タイトルの一部や、表記を変えてもう一度検索してみてください。
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white/70">
            {books.map((book) => (
              <article
                key={book.isbn}
                className="group relative transition hover:bg-amber-50/60"
              >
                <label className="absolute left-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white/95 shadow-sm transition hover:border-amber-400 sm:left-5 sm:top-5">
                  <input
                    type="checkbox"
                    checked={selectedIsbns.has(book.isbn)}
                    onChange={() => toggleBook(book.isbn)}
                    className="size-4 accent-amber-700"
                    aria-label={`『${book.title}』を選択`}
                  />
                </label>
                <Link
                  href={`/bookshelf/${book.isbn}`}
                  className="flex min-h-36 items-center gap-4 p-3 pl-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-700 sm:min-h-40 sm:gap-5 sm:p-5 sm:pl-16"
                >
                  <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md sm:w-24">
                    <Image
                      src={book.largeImageUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-base font-semibold leading-6 text-stone-800 group-hover:underline sm:text-lg">
                      {book.title}
                    </p>
                    <p className="mt-2 truncate text-sm text-stone-600">
                      {book.author}
                    </p>
                    {book.publisherName && (
                      <p className="mt-1 truncate text-xs text-stone-400">
                        {book.publisherName}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
        {selectedIsbns.size > 0 && (
          <div className="sticky bottom-4 z-20 mt-6 rounded-2xl border border-stone-800 bg-stone-900 p-3 text-amber-50 shadow-xl sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <RiCheckLine className="text-lg text-amber-300" aria-hidden="true" />
              {selectedIsbns.size}冊を選択中
            </p>
            <div className="mt-3 flex gap-2 sm:mt-0">
              <button
                type="button"
                onClick={() => setSelectedIsbns(new Set())}
                disabled={bulkCreateBooks.isPending}
                className="min-h-10 rounded-lg px-3 text-sm font-semibold text-stone-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                選択解除
              </button>
              <button
                type="button"
                onClick={() => void addSelectedBooks()}
                disabled={bulkCreateBooks.isPending}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-300 px-3 text-sm font-bold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RiAddLine aria-hidden="true" />
                {bulkCreateBooks.isPending
                  ? "追加中…"
                  : "「読みたい」に追加"}
              </button>
            </div>
          </div>
        )}
        {books.length > 0 && (
          <div
            ref={loadMoreTargetRef}
            className="flex min-h-16 items-center justify-center"
            aria-live="polite"
          >
            {isLoading && <p className="text-sm text-stone-500">読み込み中…</p>}
            {!hasMore && !isLoading && (
              <p className="text-sm text-stone-500">すべての検索結果を表示しました</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

const Page = () => (
  <Suspense
    fallback={<main className="mx-auto min-h-80 max-w-6xl px-4 py-8" />}
  >
    <SearchPage />
  </Suspense>
);

export default Page;
