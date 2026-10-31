"use client";
import { SearchBox } from "./SearchBox";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useBookSearch } from "./hooks/useBookSearch";
import { BookCard } from "./BookCard";
import { BarcodeScannerDialog } from "./BarcodeScannerDialog";
import type { RakutenBookItem } from "@/lib/fetchRakutenBooks";
import type { BookStatus } from "@/types/book";
import { useCreateBook } from "../../books/[isbn]/register/hooks/useCreateBook";
import { useGetBooks } from "@/app/bookshelf/hooks/useGetBooks";
import { useAuth } from "@/components/providers/AuthProvider";
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
  const { user } = useAuth();
  const {
    books,
    searchKeyword,
    searchField,
    hasSearched,
    hasMore,
    handleSearch: executeSearch,
    isLoading,
    loadMore,
  } = useBookSearch();
  const createBookMutation = useCreateBook();
  const { data: bookshelfBooks = [] } = useGetBooks({
    enabled: hasSearched && Boolean(user),
  });
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
      router.push(`/books/${isbn}`);
    },
    [router],
  );

  return (
    <main className="mx-auto max-w-265 px-5 pb-24 pt-12 text-[#293630] sm:px-8 sm:pt-16">
      <div className="max-w-162.5">
        <p className="text-[10px] tracking-[0.18em] text-[#7b8781]">
          FIND YOUR NEXT BOOK
        </p>
        <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[42px]">
          本を探す
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#748078]">
          気になっていた一冊を、あなたの本棚へ。
          <br className="hidden sm:block" />
          タイトルや著者名から静かに探せます。
        </p>
      </div>

      <section className="mt-10 border border-[#293630]/10 bg-[#eeece5] p-4 sm:p-6">
        <div className="max-w-190">
          <SearchBox
            key={`${searchField}-${searchKeyword}`}
            onSearch={handleSearch}
            isLoading={isLoading}
            initialKeyword={searchKeyword}
            initialSearchField={searchField}
          />
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="mt-3 inline-flex items-center gap-2 text-[11px] text-[#66756d] transition-colors hover:text-[#344941]"
          >
            <RiBarcodeLine className="text-base" aria-hidden="true" />
            バーコードから探す
          </button>
        </div>
      </section>

      <section className="mt-14">
        {hasSearched && !isLoading && books.length === 0 ? (
          <div className="border-b border-[#293630]/10 py-20 text-center">
            <p className="font-serif-jp text-lg font-medium text-[#293630]">
              該当する本が見つかりませんでした
            </p>
            <p className="mt-3 text-xs leading-6 text-[#849089]">
              タイトルの一部や、表記を変えてもう一度検索してみてください。
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 md:gap-x-10">
            {books.map((book) => (
              <BookCard
                key={book.isbn}
                book={book}
                onRegister={setBookToRegister}
                isRegistered={
                  registeredIsbns.has(book.isbn) ||
                  bookshelfIsbns.has(book.isbn)
                }
                isAuthenticated={Boolean(user)}
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
            {isLoading && <p className="text-sm text-[#75817b]">読み込み中…</p>}
            {!hasMore && !isLoading && (
              <p className="text-sm text-[#75817b]">
                すべての検索結果を表示しました
              </p>
            )}
          </div>
        )}
      </section>
      {bookToRegister && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-status-dialog-title"
        >
          <div className="w-full max-w-md bg-[#faf9f5] p-6 shadow-2xl">
            <h2
              id="book-status-dialog-title"
              className="font-serif-jp text-xl font-medium text-[#293630]"
            >
              読書状況を選択
            </h2>
            <p className="mt-3 line-clamp-2 text-sm text-[#748078]">
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
                  className="min-h-12 rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#69766f] transition hover:border-[#60736a] hover:bg-[#e7e9e4] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setBookToRegister(null)}
              disabled={registeringIsbn === bookToRegister.isbn}
              className="mt-4 min-h-10 w-full rounded-md text-xs text-[#748078] transition hover:bg-[#eeece5] disabled:opacity-50"
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
