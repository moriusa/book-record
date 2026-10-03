"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import BookFormFields, { BookFormValues } from "@/components/ui/BookFormFields";
import { useUpdateBook } from "./hooks/useUpdateBook";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  salesDate: string | null;
  imageUrl: string | null;
  status: BookFormValues["status"];
  completedAt: string | null;
  rating: number | null;
  review: string | null;
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
    return <p>読み込み中...</p>;
  }

  if (isError || !book) {
    return <p>本の情報を取得できませんでした。</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BookFormFields control={control} register={register} watch={watch} />

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white"
      >
        保存する
      </button>
      {errorMessage && (
        <p role="alert" className="text-red-700">
          {errorMessage}
        </p>
      )}
    </form>
  );
};

export default EditBookForm;
