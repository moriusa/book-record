"use client";
import { SearchBox } from "./SearchBox";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBookSearch } from "./hooks/useBookSearch";
import { BookCard } from "./BookCard";
import { BarcodeScannerDialog } from "./BarcodeScannerDialog";
import type { RakutenBookItem } from "@/lib/fetchRakutenBooks";
import type { BookStatus } from "@/types/book";
import { useCreateBook } from "../[isbn]/register/hooks/useCreateBook";
import { useGetBooks } from "../hooks/useGetBooks";
import { useRouter } from "next/navigation";
import { RiBarcodeLine } from "react-icons/ri";

const bookStatusOptions: { value: BookStatus; label: string }[] = [
  { value: "WANT_TO_READ", label: "読みたい" },
  { value: "READING", label: "読んでいる" },
  { value: "COMPLETED", label: "読み終わった" },
  { value: "ON_HOLD", label: "積読" },
];

const SearchPage = () => {
  const router = useRouter();
  const {
    books,
    searchTitle,
    hasSearched,
    hasMore,
    handleSearch: executeSearch,
    isLoading,
    loadMore,
  } = useBookSearch();
  const createBookMutation = useCreateBook();
  const { data: bookshelfBooks = [] } = useGetBooks({ enabled: hasSearched });
  const loadMoreTargetRef = useRef<HTMLDivElement>(null);
  const [registeringIsbn, setRegisteringIsbn] = useState<string | null>(null);
  const [registeredIsbns, setRegisteredIsbns] = useState<Set<string>>(
    new Set(),
  );
  const [bookToRegister, setBookToRegister] = useState<RakutenBookItem | null>(
    null,
  );
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const bookshelfIsbns = useMemo(
    () => new Set(bookshelfBooks.map((book) => book.isbn)),
    [bookshelfBooks],
  );

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

  const handleSearch = (params: Parameters<typeof executeSearch>[0]) => {
    executeSearch(params);
  };

  const registerBook = async (book: RakutenBookItem, status: BookStatus) => {
    try {
      setRegisteringIsbn(book.isbn);
      await createBookMutation.mutateAsync({
        ...book,
        status: status,
        rating: null,
        review: null,
        completedAt: null,
      });
      setRegisteredIsbns((current) => new Set(current).add(book.isbn));
      setBookToRegister(null);
    } catch (error) {
      console.error(error);
    } finally {
      setRegisteringIsbn(null);
    }
  };

  const handleBarcodeDetected = useCallback(
    (isbn: string) => {
      setIsScannerOpen(false);
      router.push(`/bookshelf/${isbn}`);
    },
    [router],
  );

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

      <div className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <SearchBox
            key={searchTitle}
            onSearch={handleSearch}
            isLoading={isLoading}
            initialKeyword={searchTitle}
          />
        </div>
        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 text-sm font-bold text-stone-700 transition hover:border-amber-500 hover:bg-amber-50"
        >
          <RiBarcodeLine className="text-lg" aria-hidden="true" />
          バーコードを読み取る
        </button>
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
          <div className="divide-y divide-stone-200 overflow-hidden rounded-md border border-stone-200 bg-white/70">
            {books.map((book) => (
              <BookCard
                key={book.isbn}
                book={book}
                onRegister={setBookToRegister}
                isRegistered={
                  registeredIsbns.has(book.isbn) ||
                  bookshelfIsbns.has(book.isbn)
                }
              />
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
              <p className="text-sm text-stone-500">
                すべての検索結果を表示しました
              </p>
            )}
          </div>
        )}
      </div>
      {bookToRegister && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-status-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold tracking-[0.14em] text-amber-800">
              BOOKSHELF REGISTRATION
            </p>
            <h2
              id="book-status-dialog-title"
              className="mt-2 text-lg font-bold text-stone-900"
            >
              読書状況を選択
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-stone-600">
              『{bookToRegister.title}』をどの状態で本棚に登録しますか？
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {bookStatusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    void registerBook(bookToRegister, option.value)
                  }
                  disabled={registeringIsbn === bookToRegister.isbn}
                  className="min-h-12 rounded-lg border border-stone-200 px-3 text-sm font-bold text-stone-700 transition hover:border-amber-500 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setBookToRegister(null)}
              disabled={registeringIsbn === bookToRegister.isbn}
              className="mt-4 w-full min-h-10 rounded-lg text-sm font-semibold text-stone-500 transition hover:bg-stone-100 disabled:opacity-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
      {isScannerOpen && (
        <BarcodeScannerDialog
          onClose={() => setIsScannerOpen(false)}
          onDetected={handleBarcodeDetected}
        />
      )}
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
