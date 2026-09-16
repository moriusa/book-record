"use client";
import { useForm, SubmitHandler } from "react-hook-form";

type BookStatus = "WANT_TO_READ" | "READING" | "COMPLETED" | "ON_HOLD";
type FormValues = {
  status: BookStatus;
  completedAt: Date | null;
  rating: number | null;
  review: string | null;
};
type BookInfo = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string | null;
  publishedAt: Date | null;
  coverImageUrl: string | null;
};

type SubmitValues = {
  form: FormValues;
  book: BookInfo;
};

export const BookForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // API叩く
    console.log(data);
  };

  const status = watch("status");
  const rating = watch("rating");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register("status")}>
        <option value="WANT_TO_READ">読みたい</option>
        <option value="READING">読んでいる</option>
        <option value="COMPLETED">読み終わった</option>
        <option value="ON_HOLD">積読</option>
      </select>
      {status === "COMPLETED" && (
        <div>
          <p>評価</p>
          <div>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("rating", value)}
                aria-label={`${value}点`}
              >
                {rating !== null && value <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <label htmlFor="review">感想</label>
        <textarea id="review" {...register("review")} />
      </div>
      <button type="submit">登録</button>
    </form>
  );
};
