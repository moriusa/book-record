"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateBook } from "./hooks/useCreateBook";
import { useRouter } from "next/navigation";
import BookFormFields, { BookFormValues } from "@/components/ui/BookFormFields";

export type BookStatus = "WANT_TO_READ" | "READING" | "COMPLETED" | "ON_HOLD";
type BookInfo = {
  isbn: string;
  title: string;
  author: string;
  publisherName: string | null;
  salesDate: string | null;
  largeImageUrl: string | null;
};
type Props = {
  bookData: BookInfo;
};

const getToday = () => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
};

export const AddBookForm = ({ bookData }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const { control, register, watch, setValue, handleSubmit } =
    useForm<BookFormValues>({
      defaultValues: {
        status: "WANT_TO_READ",
        completedAt: null,
        rating: null,
        review: null,
      },
    });

  // eslint-disable-next-line react-hooks/incompatible-library
  const status = watch("status");

  const createBookMutation = useCreateBook();

  useEffect(() => {
    if (status === "COMPLETED") {
      setValue("completedAt", getToday());
    } else {
      setValue("completedAt", null);
      setValue("rating", null);
    }
  }, [status, setValue]);

  const onSubmit: SubmitHandler<BookFormValues> = (data) => {
    createBookMutation.mutate(
      {
        ...bookData,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BookFormFields control={control} register={register} watch={watch} />

      <button
        type="submit"
        disabled={createBookMutation.isPending}
        className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {createBookMutation.isPending ? "登録中..." : "本棚に追加"}
      </button>
      {errorMessage && (
        <p role="alert" className="text-red-700">
          {errorMessage}
        </p>
      )}
    </form>
  );
};
