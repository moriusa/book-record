"use client";

import {
  Control,
  Controller,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { FaRegStar, FaStar } from "react-icons/fa";

export type BookStatus =
  | "WANT_TO_READ"
  | "READING"
  | "COMPLETED"
  | "ON_HOLD";

export type BookFormValues = {
  status: BookStatus;
  completedAt: string | null;
  rating: number | null;
  review: string | null;
};

type Props = {
  control: Control<BookFormValues>;
  register: UseFormRegister<BookFormValues>;
  watch: UseFormWatch<BookFormValues>;
};

const bookStatus = {
  WANT_TO_READ: "読みたい",
  READING: "読んでいる",
  COMPLETED: "読み終わった",
  ON_HOLD: "積読",
} satisfies Record<BookStatus, string>;

const BookFormFields = ({
  control,
  register,
  watch,
}: Props) => {
  const status = watch("status");

  return (
    <div className="space-y-6">
      {/* ステータス */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium"
        >
          ステータス
        </label>

        <select
          id="status"
          {...register("status")}
          className="mt-2 w-full rounded-lg border px-3 py-2"
        >
          {Object.entries(bookStatus).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 読了日 */}
      {status === "COMPLETED" && (
        <div>
          <label
            htmlFor="completedAt"
            className="block text-sm font-medium"
          >
            読了日
          </label>

          <input
            id="completedAt"
            type="date"
            {...register("completedAt")}
            className="mt-2 w-full rounded-lg border px-3 py-2"
          />
        </div>
      )}

      {/* 評価 */}
      {status === "COMPLETED" && (
        <div>
          <span className="block text-sm font-medium">
            評価
          </span>

          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => field.onChange(rating)}
                    aria-label={`${rating}点`}
                    className="text-3xl leading-none transition hover:scale-110"
                  >
                    {field.value && field.value >= rating ? (
                      <FaStar />
                    ) : (
                      <FaRegStar />
                    )}
                  </button>
                ))}
              </div>
            )}
          />
        </div>
      )}

      {/* 感想 */}
      <div>
        <label
          htmlFor="review"
          className="block text-sm font-medium"
        >
          感想
        </label>

        <textarea
          id="review"
          rows={6}
          {...register("review")}
          className="mt-2 w-full rounded-lg border px-3 py-2"
          placeholder="この本の感想を書いてください"
        />
      </div>
    </div>
  );
};

export default BookFormFields;