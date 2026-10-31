"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import BookFormFields, { BookFormValues } from "@/components/ui/BookFormFields";
import { useUpdateBook } from "./hooks/useUpdateBook";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";

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
    return <p className="text-sm text-[#75817b]">読み込み中...</p>;
  }

  if (isError || !book) {
    return (
      <p className="text-sm text-[#75817b]">本の情報を取得できませんでした。</p>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr] lg:gap-14">
      <aside className="border border-[#293630]/10 bg-[#eeece5] p-5 sm:p-6 lg:sticky lg:top-24">
        <div className="mt-1 flex items-start gap-5 lg:block">
          <div className="relative aspect-2/3 w-23 shrink-0 self-start overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[6px_8px_18px_rgb(38_48_43/16%)] lg:mx-auto lg:w-37.5">
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={book.title}
                fill
                sizes="(max-width: 1024px) 92px, 150px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#75817b]">
                表紙画像はありません
              </div>
            )}
          </div>
          <div className="min-w-0 lg:mt-6 lg:text-center">
            <h2 className="font-serif-jp text-lg font-medium lg:text-xl">
              {book.title}
            </h2>
            <p className="mt-2 text-xs text-[#718078]">{book.author}</p>
            <p className="mt-1 text-[10px] text-[#909994]">
              {book.publisher || "-"}
              {book.series ? `・${book.series}` : ""}
            </p>
          </div>
        </div>
      </aside>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-[#293630]/10 bg-[#faf9f5] p-6 sm:p-9"
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
