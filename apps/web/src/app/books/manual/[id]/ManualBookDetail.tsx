"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiArrowLeftLine } from "react-icons/ri";
import BookTenToggleButton from "@/app/books/[isbn]/BookTenToggleButton";
import BookDetailHeader from "@/components/ui/BookDetailHeader";
import BookDetailDeleteControl from "@/components/ui/BookDetailDeleteControl";
import BookDetailSection, {
  BOOK_READING_RECORD_ID,
  BookDetailInformation,
} from "@/components/ui/BookDetailSection";
import BookReadingRecord from "@/components/ui/BookReadingRecord";
import ReadingListControls from "@/components/ui/ReadingListControls";
import { BookDetailSkeleton } from "@/components/ui/LoadingSkeleton";
import { authFetcher } from "@/lib/fetcher";
import {
  getBookAuthorLabel,
  getBookPublisherLabel,
} from "@/lib/getBookAuthorLabel";
import type { Book } from "@/types/book";

type Props = { id: string };

export default function ManualBookDetail({ id }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: book,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => authFetcher<Book>(`/books/${id}`),
    retry: false,
  });
  const deleteBookMutation = useMutation({
    mutationFn: () => authFetcher(`/books/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      router.push("/bookshelf");
    },
  });

  if (isPending) {
    return <BookDetailSkeleton />;
  }

  if (isError || !book || book.source !== "manual") {
    return (
      <main className="p-8 text-sm text-[#75817b]">
        この本の情報を取得できませんでした。
      </main>
    );
  }

  const author = getBookAuthorLabel(book.author);

  return (
    <main className="mx-auto max-w-270 px-5 pb-16 pt-7 text-[#293630] sm:px-8 sm:pb-24 sm:pt-10">
      <Link
        href="/bookshelf"
        className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
      >
        <RiArrowLeftLine aria-hidden="true" />
        本棚へ戻る
      </Link>
      <BookDetailHeader title={book.title} recordLinkLabel="自分の記録へ">
        <p className="mt-2 wrap-anywhere text-sm leading-6 text-[#526158] sm:mt-4 sm:text-base">
          {author}
        </p>
      </BookDetailHeader>

      <div className="mt-4 grid items-start gap-8 sm:mt-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
        <BookDetailInformation
          rows={[
            ["出版社・頒布元", getBookPublisherLabel(book.publisher)],
            ["登録方法", "手動登録"],
          ]}
        />

        <div className="min-w-0 space-y-4">
          <BookDetailSection
            id={BOOK_READING_RECORD_ID}
            title="自分の記録"
            tone="record"
          >
            <BookReadingRecord book={book} />
            <BookDetailDeleteControl
              onDelete={() => deleteBookMutation.mutate()}
              isDeleting={deleteBookMutation.isPending}
              hasError={Boolean(deleteBookMutation.error)}
            />
          </BookDetailSection>

          <ReadingListControls
            userBookId={book.id}
            isFavorite={book.isFavorite}
          />

          <BookTenToggleButton userBookId={book.id} />
        </div>
      </div>
    </main>
  );
}
