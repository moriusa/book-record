"use client";

import { BookStatus } from "@/types/book";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { FaRegStar, FaStar } from "react-icons/fa";

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

export function BookFieldBadge({ required = false }: { required?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border px-2 py-0.5 text-xs font-medium leading-4 ${required ? "border-[#344941] bg-[#344941] text-white" : "border-[#344941]/30 text-[#43584e]"}`}
    >
      {required ? "必須" : "任意"}
    </span>
  );
}

const BookFormFields = ({ control, register, watch }: Props) => {
  const status = watch("status");

  return (
    <div>
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id="book-reading-status-heading"
            className="font-serif-jp text-lg font-semibold sm:text-xl"
          >
            読書ステータス
          </h2>
          <BookFieldBadge required />
        </div>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div
              role="group"
              aria-labelledby="book-reading-status-heading"
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {Object.entries(bookStatus).map(([value, label]) => {
                const isSelected = field.value === value;

                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => field.onChange(value)}
                    className={`min-h-11 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${isSelected ? "border-[#344941] bg-[#344941] text-white" : "border-[#344941]/15 bg-white text-[#43584e] hover:border-[#344941]/35 hover:bg-[#e8ece1]"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </section>

      {status === "COMPLETED" && (
        <section className="mt-4 rounded-lg bg-[#eeece5] p-3 sm:p-4">
          <label
            htmlFor="completedAt"
            className="block w-full min-w-0 text-sm font-medium text-[#43584e]"
          >
            読み終わった日
            <input
              id="completedAt"
              type="date"
              {...register("completedAt")}
              className="mt-2 block min-h-11 w-52 max-w-full min-w-0 appearance-none rounded-lg border border-[#344941]/20 bg-white px-3 text-base text-[#293630] focus:border-[#60736a] focus:outline-2 focus:outline-[#60736a] sm:w-55"
            />
          </label>
        </section>
      )}

      <section className="mt-6 border-t border-[#344941]/12 pt-5 sm:mt-7 sm:pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id="book-rating-heading"
            className="font-serif-jp text-lg font-semibold sm:text-xl"
          >
            この本の評価
          </h2>
          <BookFieldBadge />
        </div>
        <div
          role="group"
          aria-labelledby="book-rating-heading"
          className="mt-2 grid max-w-40 grid-cols-5"
        >
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      field.onChange(field.value === rating ? null : rating)
                    }
                    aria-label={`${rating}点`}
                    aria-pressed={field.value === rating}
                    className={`grid min-h-11 min-w-0 place-items-center rounded-md text-2xl transition-colors hover:bg-[#eeece5] ${field.value && field.value >= rating ? "text-[#78623c]" : "text-[#65736c]"}`}
                  >
                    {field.value && field.value >= rating ? (
                      <FaStar />
                    ) : (
                      <FaRegStar />
                    )}
                  </button>
                ))}
              </>
            )}
          />
        </div>
      </section>

      <section className="mt-6 border-t border-[#344941]/12 pt-5 sm:mt-7 sm:pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-serif-jp text-lg font-semibold sm:text-xl">
            <label htmlFor="review">感想・メモ</label>
          </h2>
          <BookFieldBadge />
        </div>
        <textarea
          id="review"
          rows={5}
          {...register("review")}
          className="mt-3 w-full resize-y rounded-lg border border-[#344941]/20 bg-white px-3 py-2.5 text-base leading-7 text-[#293630] placeholder:text-[#64716a] focus:border-[#60736a] focus:outline-2 focus:outline-[#60736a]"
          placeholder="なぜ読みたいと思ったか、読んで感じたことなど"
        />
      </section>
    </div>
  );
};

export default BookFormFields;
