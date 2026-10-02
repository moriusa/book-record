"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useCreateBook } from "./hooks/useCreateBook";
import { useRouter } from "next/navigation";

export type BookStatus = "WANT_TO_READ" | "READING" | "COMPLETED" | "ON_HOLD";
type FormValues = {
  status: BookStatus;
  completedAt: string | null;
  rating: number | null;
  review: string | null;
};
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

export const BookForm = ({ bookData }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>();
  // eslint-disable-next-line react-hooks/incompatible-library
  const status = watch("status");
  const rating = watch("rating");
  const createBookMutation = useCreateBook();

  useEffect(() => {
    if (status !== "COMPLETED") {
      setValue("rating", null);
    }
  }, [status, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createBookMutation.mutate(
      {
        ...bookData,
        ...data,
        completedAt: data.completedAt || null,
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-xl space-y-6 rounded-2xl"
    >
      {/* 読書ステータス */}
      <div>
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          読書状況
        </label>

        <select
          id="status"
          {...register("status")}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        >
          <option value="WANT_TO_READ">読みたい</option>
          <option value="READING">読んでいる</option>
          <option value="COMPLETED">読み終わった</option>
          <option value="ON_HOLD">積読</option>
        </select>
      </div>

      {/* 読み終わった日 */}
      {status === "COMPLETED" && (
        <div>
          <label
            htmlFor="completedAt"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            読み終わった日
          </label>

          <input
            id="completedAt"
            type="date"
            {...register("completedAt")}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>
      )}

      {/* 評価 */}
      {status === "COMPLETED" && (
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">評価</p>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("rating", value)}
                aria-label={`${value}点`}
                className="text-3xl leading-none transition hover:scale-110"
              >
                {rating !== null && value <= rating ? (
                  <FaStar />
                ) : (
                  <FaRegStar />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 感想 */}
      <div>
        <label
          htmlFor="review"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          感想
        </label>

        <textarea
          id="review"
          {...register("review")}
          rows={6}
          placeholder="この本を読んだ感想を書いてみよう..."
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {/* 登録ボタン */}
      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-700 active:scale-[0.98]"
      >
        本棚に登録
      </button>
      {errorMessage && (
        <p role="alert" className="text-red-700">
          {errorMessage}
        </p>
      )}
    </form>
  );
};
