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
import {
  fetchRakutenBooks,
  type RakutenBookItem,
} from "@/lib/fetchRakutenBooks";
import type { BookStatus } from "@/types/book";
import {
  useCreateBook,
  useCreateBooks,
} from "../../books/[isbn]/register/hooks/useCreateBook";
import { useGetBooks } from "@/app/bookshelf/hooks/useGetBooks";
import { useAuth } from "@/components/providers/AuthProvider";
import LoginButton from "@/components/ui/LoginButton";
import { RiBarcodeLine, RiCloseLine } from "react-icons/ri";

const bookStatusOptions: { value: BookStatus; label: string }[] = [
  { value: "WANT_TO_READ", label: "読みたい" },
  { value: "READING", label: "読んでいる" },
  { value: "COMPLETED", label: "読み終わった" },
  { value: "ON_HOLD", label: "積読" },
];

type ScannedBook = {
  isbn: string;
  book: RakutenBookItem | null;
  state: "loading" | "found" | "not-found";
};

const SearchPage = () => {
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
  const createBooksMutation = useCreateBooks();
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
  const [scannedBooks, setScannedBooks] = useState<ScannedBook[]>([]);
  const [isScannedBooksDialogOpen, setIsScannedBooksDialogOpen] =
    useState(false);
  const [bulkStatus, setBulkStatus] = useState<BookStatus>("WANT_TO_READ");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [barcodeMessage, setBarcodeMessage] = useState<string | null>(null);
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

  const handleBarcodeDetected = useCallback((isbn: string) => {
    setScannedBooks((current) => {
      if (current.some((book) => book.isbn === isbn) || current.length >= 30) {
        return current;
      }

      return [...current, { isbn, book: null, state: "loading" }];
    });

    void fetchRakutenBooks({ isbn })
      .then((result) => {
        const book =
          result.Items.find(
            (item) => item.isbn.replaceAll(/[-\s]/g, "") === isbn,
          ) ??
          result.Items[0] ??
          null;

        setScannedBooks((current) =>
          current.map((scannedBook) =>
            scannedBook.isbn === isbn
              ? {
                  ...scannedBook,
                  book,
                  state: book ? "found" : "not-found",
                }
              : scannedBook,
          ),
        );
      })
      .catch(() => {
        setScannedBooks((current) =>
          current.map((scannedBook) =>
            scannedBook.isbn === isbn
              ? { ...scannedBook, state: "not-found" }
              : scannedBook,
          ),
        );
      });
  }, []);

  const startBarcodeScanner = () => {
    setBarcodeMessage(null);
    setScannedBooks([]);
    setIsScannedBooksDialogOpen(false);
    setIsScannerOpen(true);
  };

  const completeBarcodeScan = () => {
    setIsScannerOpen(false);
    setIsScannedBooksDialogOpen(true);
  };

  const registerScannedBooks = async () => {
    const booksToRegister = scannedBooks.flatMap(({ book }) =>
      book
        ? [
            {
              ...book,
              status: bulkStatus,
              rating: null,
              review: null,
              completedAt: null,
            },
          ]
        : [],
    );

    if (booksToRegister.length === 0) {
      return;
    }

    try {
      setBulkError(null);
      const result = await createBooksMutation.mutateAsync(booksToRegister);
      setRegisteredIsbns(
        (current) =>
          new Set([...current, ...result.createdIsbns, ...result.skippedIsbns]),
      );
      setScannedBooks([]);
      setIsScannedBooksDialogOpen(false);
      setBarcodeMessage(
        result.skippedIsbns.length > 0
          ? `${result.createdIsbns.length}冊を登録しました。${result.skippedIsbns.length}冊はすでに登録済みです。`
          : `${result.createdIsbns.length}冊を本棚に登録しました。`,
      );
    } catch (error) {
      setBulkError(
        error instanceof Error ? error.message : "本の一括登録に失敗しました。",
      );
    }
  };

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
            onClick={startBarcodeScanner}
            className="mt-3 inline-flex items-center gap-2 text-[11px] text-[#66756d] transition-colors hover:text-[#344941]"
          >
            <RiBarcodeLine className="text-base" aria-hidden="true" />
            バーコードでまとめて登録
          </button>
          {barcodeMessage && (
            <p className="mt-3 text-xs leading-6 text-[#526159]" role="status">
              {barcodeMessage}
            </p>
          )}
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
          onComplete={completeBarcodeScan}
          scannedCount={scannedBooks.length}
        />
      )}
      {isScannedBooksDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scanned-books-dialog-title"
        >
          <div className="flex max-h-[min(720px,calc(100dvh-2rem))] w-full max-w-lg flex-col bg-[#faf9f5] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#293630]/10 p-6 sm:p-7">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-[#7c8881]">
                  BARCODE SCAN
                </p>
                <h2
                  id="scanned-books-dialog-title"
                  className="mt-2 font-serif-jp text-xl font-medium text-[#293630]"
                >
                  読み取った本を登録
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsScannedBooksDialogOpen(false)}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[#748078] transition hover:bg-[#eeece5] hover:text-[#293630]"
                aria-label="登録画面を閉じる"
              >
                <RiCloseLine className="text-xl" aria-hidden="true" />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto px-6 py-5 sm:px-7">
              <p className="text-xs leading-6 text-[#748078]">
                読み取り結果を確認し、全て同じ読書状況で本棚に登録します。
              </p>
              <ul className="mt-4 divide-y divide-[#293630]/8 border-y border-[#293630]/8">
                {scannedBooks.map((scannedBook) => (
                  <li key={scannedBook.isbn} className="py-3">
                    {scannedBook.state === "loading" ? (
                      <p className="text-xs text-[#748078]">
                        書籍情報を確認中…
                      </p>
                    ) : scannedBook.book ? (
                      <>
                        <p className="line-clamp-1 font-serif-jp text-sm text-[#35463e]">
                          {scannedBook.book.title}
                        </p>
                        <p className="mt-1 text-[10px] text-[#849089]">
                          {scannedBook.book.author} ・ ISBN {scannedBook.isbn}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-rose-700">
                        ISBN {scannedBook.isbn} の書籍情報が見つかりませんでした
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#293630]/10 p-6 sm:p-7">
              {!user ? (
                <div className="text-center">
                  <p className="text-xs leading-6 text-[#748078]">
                    まとめて登録するにはログインが必要です。
                  </p>
                  <div className="mt-4">
                    <LoginButton
                      label="Googleでログイン"
                      className="w-full rounded-md bg-[#344941] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-[#263a33]"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <label className="block text-[11px] font-medium text-[#5f6e66]">
                    読書状況
                    <select
                      value={bulkStatus}
                      onChange={(event) =>
                        setBulkStatus(event.target.value as BookStatus)
                      }
                      className="mt-2 min-h-11 w-full rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#40584e] outline-none focus:border-[#60736a]"
                    >
                      {bookStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {bulkError && (
                    <p
                      role="alert"
                      className="mt-3 text-xs leading-6 text-rose-700"
                    >
                      {bulkError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => void registerScannedBooks()}
                    disabled={
                      createBooksMutation.isPending ||
                      scannedBooks.some((book) => book.state === "loading") ||
                      !scannedBooks.some((book) => book.book)
                    }
                    className="mt-5 min-h-11 w-full rounded-md bg-[#344941] px-5 text-xs font-medium text-white transition hover:bg-[#263a33] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {createBooksMutation.isPending
                      ? "登録中…"
                      : `${scannedBooks.filter((book) => book.book).length}冊を本棚に登録`}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsScannedBooksDialogOpen(false);
                  setIsScannerOpen(true);
                }}
                disabled={createBooksMutation.isPending}
                className="mt-3 min-h-10 w-full rounded-md text-xs text-[#66756d] transition hover:bg-[#eeece5] disabled:opacity-50"
              >
                さらに読み取る
              </button>
            </div>
          </div>
        </div>
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
