"use client";
import Link from "next/link";
import { SearchBox } from "./SearchBox";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useBookSearch } from "./hooks/useBookSearch";

const Page = () => {
  const { books, hasSearched, hasMore, handleSearch, isLoading, loadMore } =
    useBookSearch();
  const loadMoreTargetRef = useRef<HTMLDivElement>(null);

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
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
      </div>

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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {books.map((book) => (
              <Link
                key={book.isbn}
                href={`/bookshelf/${book.isbn}`}
                className="group rounded-xl p-2 transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              >
                <div className="relative mx-auto aspect-2/3 w-full max-w-36 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                  <Image
                    src={book.largeImageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 180px"
                    className="object-contain"
                  />
                </div>

                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-stone-800 group-hover:underline">
                  {book.title}
                </p>
                <p className="mt-1 truncate text-xs text-stone-500">
                  {book.author}
                </p>
              </Link>
            ))}
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

export default Page;
