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
  },
  {
    status: "READING",
    label: "読んでいる",
    icon: RiBookOpenLine,
  },
  {
    status: "COMPLETED",
    label: "読み終わった",
    icon: RiCheckLine,
  },
  {
    status: "ON_HOLD",
    label: "積読",
    icon: RiPauseCircleLine,
  },
] as const satisfies ReadonlyArray<{
  status: BookStatus;
  label: string;
  icon: typeof RiStackLine;
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
  const hasBooks = (books?.length ?? 0) > 0;
  const nextBookStatus = books?.some((book) => book.status === "WANT_TO_READ")
    ? "WANT_TO_READ"
    : books?.some((book) => book.status === "ON_HOLD")
      ? "ON_HOLD"
      : null;

  return (
    <main className="mx-auto max-w-280 px-4 pb-20 pt-4 text-[#293630] sm:px-8 sm:pt-11">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 rounded-2xl bg-[#ede9dc] p-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3 sm:border sm:border-[#344941]/10 sm:px-9 sm:py-0">
        <div className="sm:col-start-1 sm:row-start-1 sm:self-end">
          <p className="mb-1 text-[10px] text-[#526158] sm:hidden">
            YOUR READING SPACE
          </p>
          <h1 className="font-serif-jp text-[clamp(1.25rem,6vw,1.5rem)] font-semibold tracking-[-0.04em] sm:text-[42px]">
            おかえりなさい。
          </h1>
          <p className="mt-1 text-xs leading-5 text-[#526158] sm:mt-2 sm:text-sm sm:leading-6">
            読書の続きを、自分のペースで。
          </p>
        </div>
        <div className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 sm:col-start-1 sm:row-start-2 sm:col-span-1 sm:gap-x-4 sm:self-start">
          <Link
            href="/books/search"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#344941] px-4 text-sm font-medium text-white transition-colors hover:bg-[#263a33]"
          >
            <RiAddLine aria-hidden="true" />
            本を探す
          </Link>
          <Link
            href="/guides"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#43584e] underline decoration-[#43584e]/40 underline-offset-4 hover:decoration-current"
          >
            使い方を見る
            <RiArrowRightLine aria-hidden="true" />
          </Link>
        </div>
        <Image
          src="/loose-kotatsu.png"
          alt=""
          width={192}
          height={192}
          className="col-start-2 row-start-1 size-[clamp(5rem,27vw,7.25rem)] object-contain sm:row-span-2 sm:size-42 sm:justify-self-center lg:size-60"
        />
      </header>

      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="current-reading-heading"
          className="min-w-0 px-1 py-8 sm:rounded-2xl sm:border sm:border-[#344941]/12 sm:bg-[#faf8f1] sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h2
              id="current-reading-heading"
              className="font-serif-jp text-xl font-semibold sm:text-2xl"
            >
              今、読んでいる本
            </h2>
            {readingBooks.length > 1 && (
              <Link
                href="/bookshelf?status=READING"
                className="inline-flex items-center gap-1.5 text-xs text-[#43584e] underline underline-offset-4"
              >
                {readingBooks.length}冊すべて見る
                <RiArrowRightLine aria-hidden="true" />
              </Link>
            )}
          </div>
          {isLoading ? (
            <div
              role="status"
              className="mt-5 flex gap-4 motion-safe:animate-pulse"
            >
              <span className="sr-only">読書記録を読み込み中</span>
              <div className="aspect-2/3 w-20 shrink-0 rounded-md bg-[#e4e2db] sm:w-28" />
              <div className="mt-2 h-5 w-1/2 rounded bg-[#e4e2db]" />
            </div>
          ) : error && !books ? (
            <p role="status" className="mt-5 text-sm text-[#526158]">
              本棚を読み込めませんでした。
            </p>
          ) : readingBook ? (
            <div className="mt-6 grid grid-cols-[80px_minmax(0,1fr)] gap-3 sm:mt-5 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-6">
              <Link
                href={getBookHref(readingBook)}
                className="relative aspect-2/3 w-full self-start overflow-hidden rounded-lg bg-[#d9d4c5] sm:rounded-r-[3px] sm:rounded-l-[1px] sm:border-l-[3px] sm:border-black/10 sm:shadow-[5px_7px_16px_rgb(38_48_43/15%)]"
              >
                {readingBook.imageUrl ? (
                  <Image
                    src={readingBook.imageUrl}
                    alt={readingBook.title}
                    fill
                    sizes="(min-width: 640px) 112px, 80px"
                    className="object-contain"
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
                  <h3 className="wrap-anywhere font-serif-jp text-lg font-semibold sm:text-2xl">
                    {readingBook.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#748078]">
                    {getBookAuthorLabel(readingBook.author)}
                  </p>
                </Link>
                {readingBook.review && (
                  <div className="mt-2 border-l-2 border-[#aab6af] pl-2 sm:mt-6 sm:pl-4">
                    <p className="text-[10px] text-[#929b96]">自分のメモ</p>
                    <p className="line-clamp-3 text-xs leading-5 text-[#607068] sm:mt-2 sm:leading-6">
                      {readingBook.review}
                    </p>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-2 pt-5 sm:pt-7">
                  <Link
                    href={`/bookshelf/edit/${readingBook.id}`}
                    className="rounded-md bg-[#40584e] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#30483e]"
                  >
                    記録を書く
                  </Link>
                  <Link
                    href={getBookHref(readingBook)}
                    className="flex items-center gap-1.5 py-2.5 text-xs text-[#65736c] hover:underline sm:gap-2 sm:rounded-md sm:border sm:border-[#293630]/12 sm:px-4 sm:hover:border-[#718078]"
                  >
                    詳細を見る
                    <RiArrowRightLine aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-4 sm:gap-6">
              <Image
                src="/loose-reading-books.png"
                alt=""
                width={120}
                height={120}
                className="size-18 shrink-0 object-contain sm:size-28"
              />
              <div>
                <p className="text-sm leading-6 text-[#526158]">
                  読んでいる本はまだありません。
                </p>
                <Link
                  href={
                    nextBookStatus
                      ? `/bookshelf?status=${nextBookStatus}`
                      : "/books/search"
                  }
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-[#43584e] underline underline-offset-4"
                >
                  {nextBookStatus
                    ? "本棚から次の一冊を選ぶ"
                    : "次に読む本を探す"}
                  <RiArrowRightLine className="shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </section>
        <section
          aria-labelledby="bookshelf-overview-heading"
          className="min-w-0 rounded-2xl bg-[#e8ece1] p-5 sm:border sm:border-[#344941]/12 sm:p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2
                id="bookshelf-overview-heading"
                className="font-serif-jp text-xl font-semibold sm:text-2xl"
              >
                わたしの本棚
              </h2>
              {books && (
                <p className="mt-1 text-xs text-[#526158]">
                  全 {books.length} 冊
                </p>
              )}
            </div>
            <Link
              href="/bookshelf"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs text-[#43584e] underline underline-offset-4"
            >
              本棚へ
              <RiArrowRightLine aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusCards.map(({ status, label, icon: Icon }) => (
              <Link
                key={status}
                href={`/bookshelf?status=${status}`}
                className="group flex min-w-0 flex-col gap-1.5 rounded-lg bg-[#faf9f3] px-3 py-2.5 transition-colors hover:bg-white sm:border sm:border-[#344941]/10 sm:hover:border-[#344941]/35"
              >
                <span className="flex items-center gap-1.5 text-xs text-[#526158]">
                  <Icon className="shrink-0" aria-hidden="true" />
                  {label}
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="font-serif-jp text-xl tabular-nums">
                    {books ? (
                      <>
                        {books.filter((book) => book.status === status).length}
                        <small className="ml-1 font-sans text-xs text-[#526158]">
                          冊
                        </small>
                      </>
                    ) : (
                      "–"
                    )}
                  </span>
                  <RiArrowRightLine
                    className="shrink-0 text-[#526158] transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {(hasBooks || isLoading) && (
        <section
          className="mt-10 sm:mt-12"
          aria-labelledby="recent-books-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#293630]/15 pb-3">
            <h2
              id="recent-books-heading"
              className="font-serif-jp text-xl font-semibold sm:text-2xl"
            >
              最近追加した本
            </h2>
            <Link
              href="/bookshelf"
              className="inline-flex items-center gap-1.5 text-xs text-[#43584e] underline underline-offset-4"
            >
              すべて見る
              <RiArrowRightLine aria-hidden="true" />
            </Link>
          </div>
          {isLoading ? (
            <div
              role="status"
              className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-5 sm:gap-6"
            >
              <span className="sr-only">最近追加した本を読み込み中</span>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`aspect-2/3 rounded-md bg-[#e4e2db] motion-safe:animate-pulse ${index > 2 ? "hidden sm:block" : ""}`}
                />
              ))}
            </div>
          ) : (
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 pt-5 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-6 sm:px-1">
              {recentBooks.map((book) => (
                <Link
                  key={book.id}
                  href={getBookHref(book)}
                  className="group w-26 min-w-0 shrink-0 snap-center rounded-sm text-left sm:w-auto"
                >
                  <div className="relative aspect-2/3 w-full overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[5px_7px_16px_rgb(38_48_43/15%)] transition-transform group-hover:-translate-y-1">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        sizes="(min-width: 1120px) 200px, (min-width: 640px) 20vw, 104px"
                        className="object-cover"
                      />
                    ) : (
                      <RiBookOpenLine className="absolute inset-0 m-auto text-2xl text-[#75817b]" />
                    )}
                  </div>
                  <h3 className="mt-3 line-clamp-2 wrap-anywhere font-serif-jp text-sm font-semibold">
                    {book.title}
                  </h3>
                  <p className="mt-1 truncate text-xs text-[#526158]">
                    {getBookAuthorLabel(book.author)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      <HomeNews className="mt-12 border-t border-[#293630]/10 pt-8 sm:mt-16" />
    </main>
  );
}
