"use client";

import Image from "next/image";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowRightLine,
  RiBookOpenLine,
  RiCheckLine,
  RiLockLine,
  RiPauseCircleLine,
  RiSearchLine,
  RiStackLine,
} from "react-icons/ri";
import { useGetBooks } from "./bookshelf/hooks/useGetBooks";
import { BookStatus } from "@/types/book";
import { useAuth } from "@/components/providers/AuthProvider";
import LoginButton from "@/components/ui/LoginButton";

const statusCards = [
  {
    status: "WANT_TO_READ",
    label: "読みたい",
    icon: RiStackLine,
    accent: "text-amber-700",
    background: "bg-amber-100/70",
  },
  {
    status: "READING",
    label: "読んでいる",
    icon: RiBookOpenLine,
    accent: "text-sky-700",
    background: "bg-sky-100/70",
  },
  {
    status: "COMPLETED",
    label: "読み終わった",
    icon: RiCheckLine,
    accent: "text-emerald-700",
    background: "bg-emerald-100/70",
  },
  {
    status: "ON_HOLD",
    label: "積読",
    icon: RiPauseCircleLine,
    accent: "text-stone-600",
    background: "bg-stone-200/70",
  },
] as const satisfies ReadonlyArray<{
  status: BookStatus;
  label: string;
  icon: typeof RiStackLine;
  accent: string;
  background: string;
}>;

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <main className="mx-auto min-h-96 max-w-6xl px-4 py-8 sm:py-12" />;
  }

  return user ? <AuthenticatedHome /> : <GuestHome />;
}

function AuthenticatedHome() {
  const { data: books, isLoading, error } = useGetBooks();
  const recentBooks = [...(books ?? [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);
  const readingBook = books?.find((book) => book.status === "READING");
  const wantToReadBooks = (books ?? []).filter(
    (book) => book.status === "WANT_TO_READ" || book.status === "ON_HOLD",
  );

  return (
    <main className="mx-auto max-w-270 px-5 pb-24 pt-12 text-[#293630] sm:px-8 sm:pt-16">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-[#7d8982]">
            YOUR READING SPACE
          </p>
          <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[42px]">
            おかえりなさい。
          </h1>
          <p className="mt-3 text-sm text-[#748078]">
            今日も、読みたい本がここにあります。
          </p>
        </div>
        <Link
          href="/books/search"
          className="flex w-fit items-center gap-2 rounded-md bg-[#344941] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-[#263a33]"
        >
          <RiAddLine aria-hidden="true" />
          本を探す
        </Link>
      </div>

      <section
        className="mt-11 grid border-y border-[#293630]/10 lg:grid-cols-[1.55fr_0.8fr]"
        aria-labelledby="current-reading-heading"
      >
        <div className="py-9 lg:border-r lg:border-[#293630]/10 lg:pr-12">
          <p className="text-[10px] tracking-[0.16em] text-[#839089]">
            CURRENTLY READING
          </p>
          <h2
            id="current-reading-heading"
            className="mt-2 font-serif-jp text-xl font-medium"
          >
            今、読んでいる本
          </h2>
          {readingBook ? (
            <div className="mt-8 grid grid-cols-[105px_1fr] gap-6 sm:grid-cols-[150px_1fr] sm:gap-9">
              <Link
                href={`/books/${readingBook.isbn}`}
                className="relative aspect-2/3 w-full self-start overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[5px_7px_16px_rgb(38_48_43/15%)]"
              >
                {readingBook.imageUrl ? (
                  <Image
                    src={readingBook.imageUrl}
                    alt={readingBook.title}
                    fill
                    sizes="(max-width: 640px) 105px, 150px"
                    className="object-cover"
                  />
                ) : (
                  <RiBookOpenLine
                    className="absolute inset-0 m-auto text-3xl text-[#75817b]"
                    aria-hidden="true"
                  />
                )}
              </Link>
              <div className="flex min-w-0 flex-col py-1">
                <Link href={`/books/${readingBook.isbn}`}>
                  <h3 className="font-serif-jp text-2xl font-medium sm:text-3xl">
                    {readingBook.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#748078]">
                    {readingBook.author}
                  </p>
                </Link>
                {readingBook.review && (
                  <div className="mt-6 border-l-2 border-[#aab6af] pl-4">
                    <p className="text-[10px] text-[#929b96]">自分のメモ</p>
                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#607068]">
                      {readingBook.review}
                    </p>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-2 pt-7">
                  <Link
                    href={`/bookshelf/edit/${readingBook.id}`}
                    className="rounded-md bg-[#40584e] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#30483e]"
                  >
                    記録を書く
                  </Link>
                  <Link
                    href={`/books/${readingBook.isbn}`}
                    className="flex items-center gap-2 rounded-md border border-[#293630]/12 px-4 py-2.5 text-xs text-[#65736c] transition-colors hover:border-[#718078]"
                  >
                    詳細を見る
                    <RiArrowRightLine aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm text-[#75817b]">
              読んでいる本はまだありません。
            </p>
          )}
        </div>
        <aside className="py-9 lg:pl-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#839089]">
                MY BOOKSHELF
              </p>
              <h2 className="mt-2 font-serif-jp text-xl font-medium">
                本棚の様子
              </h2>
            </div>
            <Link
              href="/bookshelf"
              className="flex items-center gap-1.5 text-[10px] text-[#69766f]"
            >
              本棚へ
              <RiArrowRightLine aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-7 divide-y divide-[#293630]/8 border-y border-[#293630]/8">
            {statusCards.map(({ status, label }) => (
              <Link
                key={status}
                href="/bookshelf"
                className="flex items-center justify-between py-4"
              >
                <span className="flex items-center gap-2.5 text-xs text-[#647169]">
                  <span
                    className={`size-1.5 rounded-full ${status === "READING" ? "bg-[#5d7c6e]" : "bg-[#b4b9b3]"}`}
                  />
                  {label}
                </span>
                <span className="font-serif-jp text-lg text-[#3d4d45]">
                  {isLoading
                    ? "–"
                    : (books?.filter((book) => book.status === status).length ??
                      0)}
                  <small className="ml-1 font-sans text-[9px] text-[#89938e]">
                    冊
                  </small>
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-16" aria-labelledby="recent-books-heading">
        <div className="flex items-end justify-between border-b border-[#293630]/10 pb-4">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-[#839089]">
              RECENTLY ADDED
            </p>
            <h2
              id="recent-books-heading"
              className="mt-2 font-serif-jp text-xl font-medium"
            >
              最近、本棚に加えた本
            </h2>
          </div>
          <Link
            href="/bookshelf"
            className="flex items-center gap-1.5 text-[10px] text-[#69766f]"
          >
            すべて見る
            <RiArrowRightLine aria-hidden="true" />
          </Link>
        </div>
        {isLoading ? (
          <div className="mt-7 grid grid-cols-3 gap-5 sm:grid-cols-5 sm:gap-7">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="aspect-2/3 animate-pulse bg-[#e4e2db]"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-12 text-sm text-[#75817b]">
            本棚を読み込めませんでした。
          </p>
        ) : recentBooks.length === 0 ? (
          <div className="py-16 text-center">
            <RiBookOpenLine className="mx-auto text-3xl text-[#9ba49f]" />
            <p className="mt-4 font-serif-jp text-lg">まだ本棚は空です</p>
            <Link
              href="/books/search"
              className="mt-5 inline-flex text-xs text-[#50665c] underline underline-offset-4"
            >
              本を探しにいく
            </Link>
          </div>
        ) : (
          <div className="scrollbar-none -mx-5 flex gap-5 overflow-x-auto px-5 pb-4 pt-7 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-7 sm:px-0">
            {recentBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.isbn}`}
                className="group w-28 shrink-0 text-left sm:w-auto"
              >
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[5px_7px_16px_rgb(38_48_43/15%)] transition-transform group-hover:-translate-y-1">
                  {book.imageUrl ? (
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 112px, 20vw"
                      className="object-cover"
                    />
                  ) : (
                    <RiBookOpenLine className="absolute inset-0 m-auto text-2xl text-[#75817b]" />
                  )}
                </div>
                <h3 className="mt-4 truncate font-serif-jp text-xs font-medium">
                  {book.title}
                </h3>
                <p className="mt-1 truncate text-[9px] text-[#87918c]">
                  {book.author}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {wantToReadBooks.length > 0 && (
        <section className="mt-16 border border-[#293630]/10 bg-[#eeece5] px-6 py-8 sm:px-9">
          <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#839089]">
                READ NEXT
              </p>
              <h2 className="mt-2 font-serif-jp text-xl font-medium">
                次は、どの本を読みましょう。
              </h2>
              <p className="mt-3 text-xs leading-6 text-[#75817b]">
                読みたい本と積読の中から、今の気分に合う一冊を選べます。
              </p>
            </div>
            <Link
              href="/bookshelf"
              className="w-fit rounded-md border border-[#293630]/12 bg-[#faf9f5] px-4 py-3 text-xs text-[#58685f] transition-colors hover:border-[#718078]"
            >
              本棚から選ぶ
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function GuestHome() {
  return (
    <main className="overflow-hidden text-[#293630]">
      <section className="mx-auto grid max-w-290 items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:pt-28">
        <div className="contents">
          <div className="max-w-132.5">
            <p className="mb-6 flex items-center gap-3 text-xs tracking-[0.18em] text-[#718078]">
              <span className="h-px w-8 bg-[#8e9b94]" />
              あなたのためだけの、本棚
            </p>
            <h1 className="font-serif-jp text-[clamp(2.7rem,5.8vw,4.8rem)] font-medium leading-tight tracking-[-0.055em] text-[#26342e]">
              読みたい本を、
              <br />
              静かに積んでおく。
            </h1>
            <p className="mt-8 max-w-117.5 text-[15px] leading-8 text-[#647069] sm:text-base">
              誰かに見せるためではなく、自分が読むために。
              <br className="hidden sm:block" />
              気になる本をそっと置いておける、シンプルな読書管理アプリです。
            </p>
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <LoginButton
                label="自分の本棚をつくる"
                className="min-h-13 rounded-md bg-[#344941] px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-[#263a33]"
              />
              <Link
                href="/books/search"
                className="group flex items-center gap-2 text-xs text-[#66756d] transition hover:text-[#293630]"
              >
                <RiSearchLine className="text-base" aria-hidden="true" />
                まずは本を探す
                <RiArrowRightLine
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-[#7a857f]">
              <RiLockLine className="text-sm" aria-hidden="true" />
              本棚はあなたにしか見えません
            </p>
          </div>

          <BookshelfPreview />
        </div>
      </section>

      <section
        className="border-y border-[#293630]/8 bg-[#eeece5] px-5 py-20 sm:px-8 sm:py-28"
        aria-labelledby="feature-heading"
      >
        <div className="mx-auto max-w-265">
          <p className="text-xs tracking-[0.18em] text-[#7a877f]">
            大切にしていること
          </p>
          <h2
            id="feature-heading"
            className="mt-5 font-serif-jp text-3xl font-medium leading-snug tracking-[-0.04em] sm:text-[42px]"
          >
            本と自分だけの時間を、
            <br />
            邪魔しないこと。
          </h2>
          <div className="mt-14 grid border-t border-[#293630]/12 md:grid-cols-3">
            {[
              [
                RiAddLine,
                "本を探して登録",
                "タイトル・著者名・ISBNからすぐに検索。",
              ],
              [
                RiStackLine,
                "読書の状態を記録",
                "読みたい、読んでいる、読み終わったを整理。",
              ],
              [
                RiBookOpenLine,
                "本棚を育てる",
                "読書の積み重ねを、いつでも振り返れます。",
              ],
            ].map(([Icon, title, description]) => {
              const FeatureIcon = Icon as typeof RiAddLine;
              return (
                <div
                  key={title as string}
                  className="border-b border-[#293630]/12 py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:not-first:border-l md:border-[#293630]/12 md:py-10"
                >
                  <FeatureIcon
                    className="text-xl text-[#607169]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-8 font-serif-jp text-xl font-medium text-[#293630]">
                    {title as string}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#6d7872]">
                    {description as string}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function BookshelfPreview() {
  const books = [
    ["暇と退屈の倫理学", "bg-[#687b70] text-white", "h-46 w-[17%]"],
    ["夜と霧", "bg-[#d9d4c5] text-[#35423c]", "h-52 w-[14%]"],
    ["思考の整理学", "bg-[#a77e68] text-white", "h-48 w-[16%]"],
    ["羊と鋼の森", "bg-[#465c55] text-white", "h-56 w-[18%]"],
    ["日日是好日", "bg-[#c4b69b] text-[#35423c]", "h-50 w-[15%]"],
  ];

  return (
    <div className="relative mx-auto w-full max-w-142.5">
      <div
        className="border border-[#293630]/10 bg-[#ebe8df] p-5 shadow-[0_24px_60px_rgba(43,56,50,0.08)] sm:p-8"
        aria-label="本棚画面のプレビュー"
      >
        <div className="flex items-center justify-between border-b border-[#293630]/10 pb-5">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#869089]">
              MY BOOKSHELF
            </p>
            <p className="mt-1.5 font-serif-jp text-xl font-medium">
              読みたい本{" "}
              <span className="ml-1 text-sm text-[#768179]">12冊</span>
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#dfe5e0] px-3 py-1.5 text-[10px] text-[#50645b]">
            <RiLockLine aria-hidden="true" />
            非公開
          </span>
        </div>
        <div className="mt-9 overflow-hidden">
          <div className="flex h-58.75 items-end justify-center gap-2 px-2 sm:gap-3">
            {books.map(([title, color, size]) => (
              <div
                key={title}
                className={`book-title-vertical relative flex shrink-0 items-center justify-center rounded-t-sm border-l border-white/10 shadow-[4px_3px_8px_rgba(42,51,46,0.12)] transition-transform hover:-translate-y-2 ${color} ${size}`}
              >
                <p className="text-[10px] font-medium tracking-[0.08em]">
                  {title}
                </p>
              </div>
            ))}
          </div>
          <div className="h-3 border-t border-[#6e6758]/25 bg-[#d4cdbd] shadow-[0_5px_10px_rgba(54,51,44,0.08)]" />
        </div>
        <div className="mt-7 flex items-center gap-3 border border-[#293630]/10 bg-[#f7f5ef] px-4 py-3.5 text-[#7c8781]">
          <RiSearchLine className="shrink-0 text-base" aria-hidden="true" />
          <span className="flex-1 text-xs">タイトル・著者名で本を探す</span>
          <span className="text-lg font-light text-[#4f675d]">＋</span>
        </div>
      </div>
      <div className="absolute -bottom-5 -right-3 hidden border border-[#293630]/10 bg-[#f8f7f2] px-4 py-3 shadow-[0_10px_30px_rgba(43,56,50,0.08)] sm:block">
        <p className="flex items-center gap-2 text-[11px] text-[#53655d]">
          <RiCheckLine aria-hidden="true" />
          1冊、本棚に追加しました
        </p>
      </div>
    </div>
  );
}
