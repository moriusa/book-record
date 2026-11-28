"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import BookFormFields, { BookFormValues } from "@/components/ui/BookFormFields";
import BookRecordSummary from "@/components/ui/BookRecordSummary";
import { EditBookSkeleton } from "@/components/ui/LoadingSkeleton";
import { useUpdateBook } from "./hooks/useUpdateBook";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import {
  getBookAuthorLabel,
  getBookPublisherLabel,
} from "@/lib/getBookAuthorLabel";

type Props = {
  id: string;
};

const EditBookForm = ({ id }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const {
    data: book,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => authFetcher<Book>(`/books/${id}`),
  });

  const { control, register, watch, reset, handleSubmit } =
    useForm<BookFormValues>({
      defaultValues: {
        status: "WANT_TO_READ",
        completedAt: null,
        rating: null,
        review: null,
      },
    });

  useEffect(() => {
    if (!book) return;

    reset({
      status: book.status,
      completedAt: book.completedAt,
      rating: book.rating,
      review: book.review,
    });
  }, [book, reset]);

  const updateBookMutation = useUpdateBook();

  const onSubmit: SubmitHandler<BookFormValues> = (data) => {
    updateBookMutation.mutate(
      {
        id,
        ...data,
      },
      {
        onSuccess: () => {
          router.push("/bookshelf");
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  };

  if (isPending) {
    return <EditBookSkeleton />;
  }

  if (isError || !book) {
    return (
      <p className="text-sm text-[#75817b]">本の情報を取得できませんでした。</p>
    );
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-6">
      <BookRecordSummary
        label="編集する本"
        title={book.title}
        author={getBookAuthorLabel(book.author)}
        publisher={getBookPublisherLabel(book.publisher)}
        series={book.series}
        imageUrl={book.imageUrl}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-0 rounded-xl border border-[#344941]/12 bg-[#faf9f5] p-4 sm:p-7"
      >
        <BookFormFields control={control} register={register} watch={watch} />

        <button
          type="submit"
          disabled={updateBookMutation.isPending}
          className="mt-10 w-full rounded-md bg-[#344941] px-5 py-3.5 text-xs font-medium text-white transition-colors hover:bg-[#263a33] disabled:opacity-50"
        >
          {updateBookMutation.isPending ? "保存中..." : "変更を保存"}
        </button>
        {errorMessage && (
          <p role="alert" className="mt-3 text-xs text-red-700">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditBookForm;
