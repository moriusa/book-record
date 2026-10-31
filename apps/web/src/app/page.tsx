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
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-[#fffdf9] px-6 py-8 shadow-sm sm:px-10 sm:py-10">
        <p className="text-xs font-bold tracking-[0.16em] text-amber-800">
          YOUR READING SPACE
        </p>
        <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              本と過ごす時間を、ここに。
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              気になる本を追加して、あなたの本棚を少しずつ育てましょう。
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/books/search"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 text-sm font-semibold text-amber-50 transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
            >
              <RiAddLine className="text-lg" aria-hidden="true" />
              本を追加
            </Link>
            <Link
              href="/bookshelf"
              className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
            >
              本棚を見る
              <RiArrowRightLine className="text-lg" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="reading-summary-heading">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-800">
              READING RECORD
            </p>
            <h2
              id="reading-summary-heading"
              className="mt-1 text-xl font-bold text-stone-900"
            >
              読書の記録
            </h2>
          </div>
          <Link
            href="/bookshelf"
            className="text-sm font-semibold text-stone-600 transition hover:text-amber-800"
          >
            本棚へ
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {statusCards.map(
            ({ status, label, icon: Icon, accent, background }) => {
              const count =
                books?.filter((book) => book.status === status).length ?? 0;
              return (
                <div
                  key={status}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-xl ${background} ${accent}`}
                  >
                    <Icon className="text-lg" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-sm font-medium text-stone-600">
                    {label}
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
                    {isLoading ? "–" : count}
                    <span className="ml-1 text-sm font-medium text-stone-500">
                      冊
                    </span>
                  </p>
                </div>
              );
            },
          )}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="recent-books-heading">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-800">
              RECENTLY ADDED
            </p>
            <h2
              id="recent-books-heading"
              className="mt-1 text-xl font-bold text-stone-900"
            >
              最近追加した本
            </h2>
          </div>
          {recentBooks.length > 0 && (
            <Link
              href="/bookshelf"
              className="inline-flex items-center gap-1 text-sm font-semibold text-stone-600 transition hover:text-amber-800"
            >
              すべて見る
              <RiArrowRightLine aria-hidden="true" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-2/3 rounded-xl bg-stone-200" />
                <div className="mt-3 h-4 rounded bg-stone-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white/50 px-6 py-10 text-center text-sm text-stone-600">
            本棚を読み込めませんでした。時間をおいて再度お試しください。
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white/50 px-6 py-10 text-center">
            <RiBookOpenLine
              className="mx-auto text-3xl text-stone-400"
              aria-hidden="true"
            />
            <p className="mt-3 font-semibold text-stone-800">
              まだ本棚は空です
            </p>
            <p className="mt-1 text-sm text-stone-600">
              最初の一冊を追加して、読書の記録を始めましょう。
            </p>
            <Link
              href="/books/search"
              className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 text-sm font-semibold text-amber-50 transition hover:bg-stone-800"
            >
              <RiAddLine aria-hidden="true" />
              本を追加する
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {recentBooks.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.isbn}`}
                className="group rounded-xl p-1.5 transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
              >
                <div className="relative mx-auto aspect-2/3 w-full max-w-40 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                  {book.imageUrl ? (
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 45vw, 25vw"
                      className="object-contain"
                    />
                  ) : (
                    <RiBookOpenLine
                      className="absolute inset-0 m-auto text-3xl text-stone-300"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-stone-800 group-hover:underline">
                  {book.title}
                </p>
                <p className="mt-1 truncate text-xs text-stone-500">
                  {book.author}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
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
