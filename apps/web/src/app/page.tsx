"use client";

import Image from "next/image";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowRightLine,
  RiBookOpenLine,
  RiCheckLine,
  RiPauseCircleLine,
  RiStackLine,
} from "react-icons/ri";
import { useGetBooks } from "./bookshelf/hooks/useGetBooks";
import { BookStatus } from "@/types/book";
import { getBookHref } from "@/lib/getBookHref";
import { getBookAuthorLabel } from "@/lib/getBookAuthorLabel";
import { useAuth } from "@/components/providers/AuthProvider";
import GuestHome from "@/components/home/GuestHome";
import HomeNews from "@/components/home/HomeNews";

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
    // 認証状態の確定前にも、公開用の紹介コンテンツをHTMLとして返す。
    // これによりクローラーと初回訪問者のどちらにもサービス概要が伝わる。
    return <GuestHome />;
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
  const readingBooks = [...(books ?? [])]
    .filter((book) => book.status === "READING")
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  const readingBook = readingBooks[0];

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
            今日も、気になる本を少しずつ。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/guides"
            className="flex items-center gap-2 rounded-md border border-[#293630]/12 bg-[#faf9f5] px-4 py-3 text-xs text-[#58685f] transition-colors hover:border-[#718078]"
          >
            <RiBookOpenLine aria-hidden="true" />
            使い方を見る
          </Link>
          <Link
            href="/books/search"
            className="flex w-fit items-center gap-2 rounded-md bg-[#344941] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-[#263a33]"
          >
            <RiAddLine aria-hidden="true" />
            本を探す
          </Link>
        </div>
      </div>

      <section
        className="mt-11 grid lg:grid-cols-[1.55fr_0.8fr]"
        aria-labelledby="current-reading-heading"
      >
        <div className="py-9 lg:border-r lg:border-[#293630]/10 lg:pr-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#839089]">
                CURRENTLY READING
              </p>
              <h2
                id="current-reading-heading"
                className="mt-2 font-serif-jp text-xl font-medium"
              >
                今、読んでいる本
              </h2>
            </div>
            {readingBooks.length > 1 && (
              <Link
                href="/bookshelf?status=READING"
                className="flex shrink-0 items-center gap-1.5 text-[10px] text-[#69766f]"
              >
                {readingBooks.length}冊すべて見る
                <RiArrowRightLine aria-hidden="true" />
              </Link>
            )}
          </div>
          {readingBook ? (
            <div className="mt-8 grid grid-cols-[105px_1fr] gap-6 sm:grid-cols-[150px_1fr] sm:gap-9">
              <Link
                href={getBookHref(readingBook)}
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
                <Link href={getBookHref(readingBook)}>
                  <h3 className="font-serif-jp text-2xl font-medium sm:text-3xl">
                    {readingBook.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#748078]">
                    {getBookAuthorLabel(readingBook.author)}
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
                    href={getBookHref(readingBook)}
                    className="flex items-center gap-2 rounded-md border border-[#293630]/12 px-4 py-2.5 text-xs text-[#65736c] transition-colors hover:border-[#718078]"
                  >
                    詳細を見る
                    <RiArrowRightLine aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-sm text-[#75817b]">
                読んでいる本はまだありません。
              </p>
              <Link
                href="/bookshelf?status=WANT_TO_READ"
                className="mt-4 inline-flex items-center gap-2 text-xs text-[#50665c] underline underline-offset-4"
              >
                本棚から次に読む本を選ぶ
                <RiArrowRightLine aria-hidden="true" />
              </Link>
            </div>
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
                href={`/bookshelf?status=${status}`}
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
                href={getBookHref(book)}
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
                  {getBookAuthorLabel(book.author)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <HomeNews className="mt-16" />
    </main>
  );
}
