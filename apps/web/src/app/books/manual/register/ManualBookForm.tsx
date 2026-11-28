"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  type Control,
  type SubmitHandler,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoginButton from "@/components/ui/LoginButton";
import { useAuth } from "@/components/providers/AuthProvider";
import BookFormFields, {
  BookFieldBadge,
  type BookFormValues,
} from "@/components/ui/BookFormFields";
import { authFetcher } from "@/lib/fetcher";

type ManualBookFormValues = BookFormValues & {
  title: string;
  author: string;
  publisherName: string;
};

const inputClassName =
  "mt-2 min-h-11 w-full rounded-lg border border-[#344941]/20 bg-white px-3 text-base text-[#293630] placeholder:text-[#64716a] focus:border-[#60736a] focus:outline-2 focus:outline-[#60736a]";

const getToday = () => {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
};

export default function ManualBookForm() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualBookFormValues>({
    defaultValues: {
      title: "",
      author: "",
      publisherName: "",
      status: "WANT_TO_READ",
      completedAt: null,
      rating: null,
      review: null,
    },
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const status = watch("status");

  useEffect(() => {
    if (status === "COMPLETED") {
      setValue("completedAt", getToday());
    } else {
      setValue("completedAt", null);
      setValue("rating", null);
    }
  }, [status, setValue]);

  const createManualBookMutation = useMutation({
    mutationFn: (input: ManualBookFormValues) =>
      authFetcher("/books/manual", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      router.push("/bookshelf");
    },
  });

  const onSubmit: SubmitHandler<ManualBookFormValues> = (data) => {
    setErrorMessage(null);
    createManualBookMutation.mutate(data, {
      onError: (error) => setErrorMessage(error.message),
    });
  };

  if (isAuthLoading) return null;

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-sm leading-6 text-[#526158]">
          本棚へ登録するにはログインが必要です。
        </p>
        <div className="mt-4">
          <LoginButton
            label="Googleでログイン"
            className="min-h-11 rounded-lg bg-[#344941] px-5 text-sm font-medium text-white transition-colors hover:bg-[#263a33]"
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section>
        <h2 className="font-serif-jp text-lg font-semibold sm:text-xl">
          本の情報
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#526158]">
          タイトルは必須です。著者や出版社は分かる範囲で入力してください。
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="manual-book-title"
              className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#43584e]"
            >
              タイトル
              <BookFieldBadge required />
            </label>
            <input
              id="manual-book-title"
              {...register("title", { required: "タイトルを入力してください" })}
              aria-required="true"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={
                errors.title ? "manual-book-title-error" : undefined
              }
              className={inputClassName}
              placeholder="本のタイトル"
            />
            {errors.title?.message && (
              <p
                id="manual-book-title-error"
                role="alert"
                className="mt-1.5 text-sm text-red-700"
              >
                {errors.title.message}
              </p>
            )}
          </div>
          <label className="block">
            <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#43584e]">
              著者・サークル名
              <BookFieldBadge />
            </span>
            <input
              {...register("author")}
              className={inputClassName}
              placeholder="例：山田 花子"
            />
          </label>
          <label className="block">
            <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#43584e]">
              出版社・頒布元
              <BookFieldBadge />
            </span>
            <input
              {...register("publisherName")}
              className={inputClassName}
              placeholder="例：青空出版"
            />
          </label>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#526158]">
          手動登録では、表紙画像や外部リンクは登録されません。
        </p>
      </section>
      <div className="mt-6 border-t border-[#344941]/12 pt-5 sm:mt-7 sm:pt-6">
        <BookFormFields
          control={control as unknown as Control<BookFormValues>}
          register={register as unknown as UseFormRegister<BookFormValues>}
          watch={watch as unknown as UseFormWatch<BookFormValues>}
        />
      </div>
      <button
        type="submit"
        disabled={createManualBookMutation.isPending}
        className="mt-6 min-h-12 w-full rounded-lg bg-[#344941] px-5 text-sm font-medium text-white transition-colors hover:bg-[#263a33] disabled:cursor-wait disabled:opacity-60 sm:mt-7"
      >
        {createManualBookMutation.isPending ? "登録中…" : "本棚に追加"}
      </button>
      {errorMessage && (
        <p role="alert" className="mt-3 text-xs text-red-700">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
