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

      <HomeNews className="mt-16" />
    </main>
  );
}

function GuestHome() {
  return (
    <main className="-mx-3 overflow-hidden text-[#293630]">
      <section className="mx-auto max-w-290 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:pt-28">
        <div className="mx-auto min-w-0 max-w-250 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.54fr)] lg:items-center lg:gap-20">
          <div className="text-left sm:text-center lg:text-left">
            <p className="mb-6 flex items-center justify-start gap-3 text-xs tracking-[0.18em] text-[#718078] sm:justify-center lg:justify-start">
              <span className="h-px w-8 bg-[#8e9b94]" />
              無料の読書記録・積読管理アプリ
            </p>
            <h1 className="font-serif-jp text-[clamp(2.6rem,4.5vw,4rem)] font-medium leading-[1.3] tracking-[-0.055em] text-[#26342e] sm:text-[clamp(3rem,3.5vw,3.5rem)]">
              <span className="sm:whitespace-nowrap">
                読みたい本も、
                <br className="sm:hidden" />
                読んだ本も、
              </span>
              <br />
              ひとつの本棚に。
            </h1>
            <p className="mt-8 max-w-145 text-[15px] leading-8 text-[#647069] sm:mx-auto sm:text-base lg:mx-0">
              誰かに見せるためではなく、自分が読むために。積読も読書記録も、自分のペースで管理できるシンプルなWebアプリです。
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-center lg:justify-start">
              <div className="flex w-full flex-col sm:relative sm:block sm:w-auto">
                <p className="order-first mb-2 flex items-center justify-center gap-2 text-xs text-[#718078] sm:absolute sm:left-0 sm:top-full sm:mt-2 sm:mb-0 sm:whitespace-nowrap lg:justify-start">
                  <Image
                    src="/google_logo.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                  />
                  Googleアカウントでかんたんに開始
                </p>
                <LoginButton
                  label="無料で本棚をつくる"
                  className="min-h-14 w-full rounded-md bg-[#344941] px-7 py-4 text-sm font-medium text-white shadow-[0_8px_18px_rgb(38_58_49/16%)] transition-all hover:-translate-y-0.5 hover:bg-[#263a33] hover:shadow-[0_12px_22px_rgb(38_58_49/20%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 sm:w-auto"
                />
              </div>
              <Link
                href="/books/search"
                className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-[#293630]/14 bg-[#faf9f5] px-6 py-4 text-sm font-medium text-[#506058] transition-all hover:-translate-y-0.5 hover:border-[#718078] hover:bg-[#f2f0e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 sm:w-auto"
              >
                <RiSearchLine className="text-lg" aria-hidden="true" />
                本を探してみる
                <RiArrowRightLine
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-start gap-2 sm:mt-12 sm:justify-center lg:justify-start">
              <p className="flex items-center gap-2 rounded-full border border-[#53655c]/18 bg-[#f4f3ed] px-3 py-2 text-xs font-medium text-[#53655c] shadow-[0_2px_6px_rgb(43_56_50/4%)]">
                <RiLockLine className="text-base" aria-hidden="true" />
                SNS機能なし・本棚は非公開
              </p>
              <p className="flex items-center gap-2 rounded-full border border-[#53655c]/18 bg-[#f4f3ed] px-3 py-2 text-xs font-medium text-[#53655c] shadow-[0_2px_6px_rgb(43_56_50/4%)]">
                <RiSearchLine className="text-base" aria-hidden="true" />
                登録不要で本の検索をお試し
              </p>
            </div>
          </div>
          <figure className="mx-auto mt-10 w-[min(78vw,320px)] overflow-hidden rounded-xl border border-[#293630]/10 bg-[#faf9f5] shadow-[0_24px_60px_rgba(43,56,50,0.14)] sm:mt-12 sm:w-75 lg:mt-0 lg:w-full lg:max-w-[320px] lg:justify-self-end">
            <Image
              src="/bookshelf_sp.png"
              alt="つみほんの本棚画面"
              width={361}
              height={674}
              priority
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 300px, 78vw"
              className="h-auto w-full"
            />
          </figure>
        </div>
      </section>

      <section
        className="border-y border-[#293630]/8 bg-[#eeece5] px-5 py-12 sm:px-8 sm:py-28"
        aria-labelledby="feature-heading"
      >
        <div className="mx-auto max-w-265">
          <p className="text-xs tracking-[0.18em] text-[#7a877f]">
            ABOUT TSUMIHON
          </p>
          <h2
            id="feature-heading"
            className="mt-5 font-serif-jp text-3xl font-medium leading-snug tracking-[-0.04em] sm:text-[42px]"
          >
            つみほんとは？
          </h2>
          <p className="mt-6 text-sm leading-8 text-[#647069] sm:text-base">
            気になる本は、検索・ISBN・バーコードからすぐに追加。登録した本やメモは公開されないので、誰かの目を気にせず残せます。
            <br />
            読みたい本から読み終えた本まで、変わっていく読書の時間を、ひとつの本棚で整理できます。
          </p>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-16">
            <div className="divide-y divide-[#293630]/12 border-y border-[#293630]/12">
              {[
                [
                  RiLockLine,
                  "人に見せない本棚",
                  "登録した本、評価、メモはあなたのためだけに残せます。",
                ],
                [
                  RiAddLine,
                  "気になる本をすぐ残せる",
                  "タイトル・著者名・ISBN、バーコードから本を登録できます。",
                ],
                [
                  RiStackLine,
                  "読書の変化が見えてくる",
                  "読みたい、読んでいる、読み終わった本を自分のペースで整理できます。",
                ],
              ].map(([Icon, title, description]) => {
                const FeatureIcon = Icon as typeof RiAddLine;
                return (
                  <div
                    key={title as string}
                    className="flex gap-5 py-6 sm:gap-6"
                  >
                    <FeatureIcon
                      className="mt-1 shrink-0 text-xl text-[#607169]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-serif-jp text-xl font-medium text-[#293630]">
                        {title as string}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#6d7872]">
                        {description as string}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <BookshelfPreview className="max-w-none" />
          </div>
          <div className="mt-12 flex justify-end">
            <Link
              href="/guides"
              className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#293630]/14 bg-[#faf9f5] px-6 py-3.5 text-sm font-medium text-[#40584e] transition-all hover:-translate-y-0.5 hover:border-[#718078] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 sm:inline-flex sm:w-auto"
            >
              つみほんの使い方を見る
              <RiArrowRightLine
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-225 px-5 py-16 sm:px-8 sm:py-24">
        <HomeNews className="text-left" />
      </section>
    </main>
  );
}

function BookshelfPreview({ className = "" }: { className?: string }) {
  return (
    <figure>
      <figcaption className="mb-5 text-left">
        <p className="text-xs tracking-[0.18em] text-[#7a877f]">
          SCREEN WALKTHROUGH
        </p>
        <p className="mt-2 font-serif-jp text-xl font-medium text-[#293630] sm:text-2xl">
          本を登録して、本棚に残すまで
        </p>
      </figcaption>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="本を登録して本棚に残すまでを紹介する動画"
        className={`mx-auto h-auto min-w-0 w-full max-w-90.25 border border-[#293630]/10 shadow-[0_24px_60px_rgba(43,56,50,0.08)] sm:max-w-142.5 ${className}`}
      >
        <source src="/videos/introduction.mp4" type="video/mp4" />
        お使いのブラウザは動画の再生に対応していません。
      </video>
    </figure>
  );
}
