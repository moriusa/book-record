"use client";

import { RiExternalLinkLine } from "react-icons/ri";
import BookDetailDeleteControl from "@/components/ui/BookDetailDeleteControl";
import BookDetailSection, {
  BOOK_READING_RECORD_ID,
} from "@/components/ui/BookDetailSection";
import BookReadingRecord from "@/components/ui/BookReadingRecord";
import LoginButton from "@/components/ui/LoginButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { useGetBookByIsbn } from "@/app/bookshelf/hooks/useGetBookByIsbn";
import { useDeleteBook } from "@/app/bookshelf/hooks/useDeleteBook";
import { AddToBookshelfButton } from "./AddToBookshelfButton";
import BookTenToggleButton from "./BookTenToggleButton";
import ReadingListControls from "@/components/ui/ReadingListControls";

type Props = {
  bookData: { isbn: string };
  amazonBookUrl: string;
  isAmazonAffiliate: boolean;
};

const BookShelfStatus = ({
  bookData,
  amazonBookUrl,
  isAmazonAffiliate,
}: Props) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    data: book,
    isLoading: isBookLoading,
    isError: isBookError,
  } = useGetBookByIsbn(bookData.isbn, {
    enabled: Boolean(user),
  });
  const deleteBookMutation = useDeleteBook();

  return (
    <div className="min-w-0 space-y-4">
      <BookDetailSection
        id={BOOK_READING_RECORD_ID}
        title="自分の記録"
        tone="record"
      >
        {isAuthLoading || (user && isBookLoading) ? (
          <div
            role="status"
            aria-label="読書記録を読み込み中"
            className="mt-4 space-y-4 border-t border-[#344941]/15 pt-4"
          >
            <span className="sr-only">読み込み中</span>
            <div
              aria-hidden="true"
              className="h-3 w-24 animate-pulse rounded-sm bg-[#d9dcd6] motion-reduce:animate-none"
            />
            <div
              aria-hidden="true"
              className="h-6 w-32 animate-pulse rounded-sm bg-[#d9dcd6] motion-reduce:animate-none"
            />
            <div
              aria-hidden="true"
              className="h-10 w-full animate-pulse rounded-sm bg-[#d9dcd6] motion-reduce:animate-none"
            />
          </div>
        ) : user && isBookError ? (
          <p className="mt-4 border-t border-[#344941]/15 pt-4 text-sm text-[#526158]">
            読書記録を取得できませんでした。
          </p>
        ) : !user ? (
          <div className="mt-4 border-t border-[#344941]/15 pt-4">
            <p className="text-sm leading-6 text-[#526158]">
              ログインすると、この本をあなたの本棚へ登録できます。
            </p>
            <div className="mt-4">
              <LoginButton
                label="Googleでログイン"
                className="min-h-11 w-full rounded-lg bg-[#344941] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#263a33]"
              />
            </div>
          </div>
        ) : book ? (
          <>
            <BookReadingRecord book={book} />
            <BookDetailDeleteControl
              onDelete={() =>
                deleteBookMutation.mutate({ id: book.id, isbn: book.isbn })
              }
              isDeleting={deleteBookMutation.isPending}
              hasError={Boolean(deleteBookMutation.error)}
            />
          </>
        ) : (
          <div className="mt-4 border-t border-[#344941]/15 pt-4">
            <p className="text-sm leading-6 text-[#526158]">
              この本はまだ本棚に登録されていません。
            </p>
            <div className="mt-4">
              <AddToBookshelfButton isbn={bookData.isbn} />
            </div>
          </div>
        )}
      </BookDetailSection>

      {user && book && (
        <ReadingListControls
          userBookId={book.id}
          isFavorite={book.isFavorite}
        />
      )}

      {user && book && <BookTenToggleButton userBookId={book.id} />}

      <BookDetailSection
        id="book-amazon"
        title="Amazonでこの本を探す"
        tone="paper"
      >
        <a
          href={amazonBookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#e88a00] bg-[#ff9900] px-4 text-sm font-semibold text-[#232f3e] transition-colors hover:bg-[#f28c00]"
        >
          Amazonで探す
          <RiExternalLinkLine className="text-sm" aria-hidden="true" />
        </a>
        {isAmazonAffiliate && (
          <p className="mt-3 text-xs leading-5 text-[#526158]">
            Amazonのアソシエイトとして、つみほんは適格販売により収入を得ています。
          </p>
        )}
      </BookDetailSection>
    </div>
  );
};

export default BookShelfStatus;
