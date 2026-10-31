"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/ui/LoginButton";
import { useAuth } from "@/components/providers/AuthProvider";
import BookFormFields, { BookFormValues } from "@/components/ui/BookFormFields";
import { useCreateBook } from "./hooks/useCreateBook";

type BookInfo = {
  isbn: string;
  title: string;
  author: string;
  publisherName: string | null;
  seriesName: string | null;
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
  const { user, isLoading: isAuthLoading } = useAuth();
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
      { ...bookData, ...data },
      {
        onSuccess: () => router.push("/bookshelf"),
        onError: (error) => setErrorMessage(error.message),
      },
    );
  };

  if (isAuthLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-sm text-[#748078]">
          本棚へ登録するにはログインが必要です。
        </p>
        <div className="mt-4">
          <LoginButton
            label="Googleでログイン"
            className="rounded-md bg-[#344941] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-[#263a33]"
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BookFormFields control={control} register={register} watch={watch} />
      <button
        type="submit"
        disabled={createBookMutation.isPending}
        className="mt-10 w-full rounded-md bg-[#344941] px-5 py-3.5 text-xs font-medium text-white transition-colors hover:bg-[#263a33] disabled:opacity-50"
      >
        {createBookMutation.isPending ? "登録中..." : "本棚に追加"}
      </button>
      {errorMessage && (
        <p role="alert" className="mt-3 text-xs text-red-700">
          {errorMessage}
        </p>
      )}
    </form>
  );
};
