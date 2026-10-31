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

const BookFormFields = ({ control, register, watch }: Props) => {
  const status = watch("status");

  return (
    <div>
      <section>
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.14em] text-[#909994]">01</p>
            <h2 className="mt-1.5 font-serif-jp text-lg font-medium">
              読書ステータス
            </h2>
          </div>
          <span className="text-[10px] text-[#929b96]">必須</span>
        </div>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(bookStatus).map(([value, label]) => {
                const isSelected = field.value === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.onChange(value)}
                    className={`min-h-12 rounded-md border px-3 py-3 text-xs transition-colors ${isSelected ? "border-[#40584e] bg-[#40584e] text-white" : "border-[#293630]/12 bg-white text-[#69766f] hover:border-[#728179]"}`}
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
        <section className="mt-7 border-t border-[#293630]/9 pt-7">
          <label
            htmlFor="completedAt"
            className="text-[11px] font-medium text-[#5f6e66]"
          >
            読み終わった日
            <input
              id="completedAt"
              type="date"
              {...register("completedAt")}
              className="mt-2 block w-full rounded-md border border-[#293630]/12 bg-white px-4 py-3 text-xs text-[#526159] outline-none focus:border-[#60736a] sm:max-w-55"
            />
          </label>
        </section>
      )}

      <section className="mt-9 border-t border-[#293630]/9 pt-8">
        <p className="text-[10px] tracking-[0.14em] text-[#909994]">02</p>
        <h2 className="mt-1.5 font-serif-jp text-lg font-medium">
          この本の評価
        </h2>
        <p className="mt-2 text-[11px] text-[#89928d]">
          まだ決めない場合は、空欄のままで構いません。
        </p>
        <div className="mt-4 flex gap-1">
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
                    className={`p-1 text-2xl transition-colors ${field.value && field.value >= rating ? "text-[#8c7951]" : "text-[#c3c4bd]"}`}
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

      <section className="mt-9 border-t border-[#293630]/9 pt-8">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.14em] text-[#909994]">03</p>
            <h2 className="mt-1.5 font-serif-jp text-lg font-medium">
              感想・メモ
            </h2>
          </div>
          <span className="text-[10px] text-[#929b96]">任意</span>
        </div>
        <textarea
          id="review"
          rows={7}
          {...register("review")}
          className="mt-5 w-full resize-y rounded-md border border-[#293630]/12 bg-white px-4 py-3.5 text-sm leading-7 text-[#405048] outline-none placeholder:text-[#a4aaa6] focus:border-[#60736a]"
          placeholder="なぜ読みたいと思ったか、読んで感じたことなど"
        />
      </section>
    </div>
  );
};

export default BookFormFields;
