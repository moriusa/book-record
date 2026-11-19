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
  type BookFormValues,
} from "@/components/ui/BookFormFields";
import { authFetcher } from "@/lib/fetcher";

type ManualBookFormValues = BookFormValues & {
  title: string;
  author: string;
  publisherName: string;
};

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
  const { control, register, watch, setValue, handleSubmit } =
    useForm<ManualBookFormValues>({
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
      <section>
        <p className="text-[10px] tracking-[0.14em] text-[#909994]">
          BOOK INFO
        </p>
        <h2 className="mt-1.5 font-serif-jp text-lg font-medium">本の情報</h2>
        <p className="mt-2 text-[11px] leading-6 text-[#89928d]">
          分かる範囲で入力してください。表紙画像や外部リンクは登録されません。
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-[11px] font-medium text-[#5f6e66]">
              タイトル
            </span>
            <span className="ml-2 text-[10px] text-[#929b96]">必須</span>
            <input
              {...register("title", { required: "タイトルを入力してください" })}
              className="mt-2 min-h-11 w-full rounded-md border border-[#293630]/12 bg-white px-4 text-sm text-[#405048] outline-none focus:border-[#60736a]"
              placeholder="本のタイトル"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-medium text-[#5f6e66]">
              著者・サークル名
            </span>
            <span className="ml-2 text-[10px] text-[#929b96]">任意</span>
            <input
              {...register("author")}
              className="mt-2 min-h-11 w-full rounded-md border border-[#293630]/12 bg-white px-4 text-sm text-[#405048] outline-none focus:border-[#60736a]"
              placeholder="例：つみほん文庫"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-medium text-[#5f6e66]">
              出版社・頒布元
            </span>
            <span className="ml-2 text-[10px] text-[#929b96]">任意</span>
            <input
              {...register("publisherName")}
              className="mt-2 min-h-11 w-full rounded-md border border-[#293630]/12 bg-white px-4 text-sm text-[#405048] outline-none focus:border-[#60736a]"
              placeholder="例：文学フリマ"
            />
          </label>
        </div>
      </section>
      <div className="mt-9 border-t border-[#293630]/9 pt-8">
        <BookFormFields
          control={control as unknown as Control<BookFormValues>}
          register={register as unknown as UseFormRegister<BookFormValues>}
          watch={watch as unknown as UseFormWatch<BookFormValues>}
        />
      </div>
      <button
        type="submit"
        disabled={createManualBookMutation.isPending}
        className="mt-10 w-full rounded-md bg-[#344941] px-5 py-3.5 text-xs font-medium text-white transition-colors hover:bg-[#263a33] disabled:opacity-50"
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
