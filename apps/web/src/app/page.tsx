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

const statusCards = [
  { status: "WANT_TO_READ", label: "読みたい", icon: RiStackLine, accent: "text-amber-700", background: "bg-amber-100/70" },
  { status: "READING", label: "読んでいる", icon: RiBookOpenLine, accent: "text-sky-700", background: "bg-sky-100/70" },
  { status: "COMPLETED", label: "読み終わった", icon: RiCheckLine, accent: "text-emerald-700", background: "bg-emerald-100/70" },
  { status: "ON_HOLD", label: "積読", icon: RiPauseCircleLine, accent: "text-stone-600", background: "bg-stone-200/70" },
] as const satisfies ReadonlyArray<{
  status: BookStatus;
  label: string;
  icon: typeof RiStackLine;
  accent: string;
  background: string;
}>;

export default function Home() {
  const { data: books, isLoading, error } = useGetBooks();
  const recentBooks = [...(books ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-[#fffdf9] px-6 py-8 shadow-sm sm:px-10 sm:py-10">
        <p className="text-xs font-bold tracking-[0.16em] text-amber-800">YOUR READING SPACE</p>
        <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">本と過ごす時間を、ここに。</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">気になる本を追加して、あなたの本棚を少しずつ育てましょう。</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/bookshelf/search" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 text-sm font-semibold text-amber-50 transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2">
              <RiAddLine className="text-lg" aria-hidden="true" />本を追加
            </Link>
            <Link href="/bookshelf" className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2">
              本棚を見る<RiArrowRightLine className="text-lg" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="reading-summary-heading">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-800">READING RECORD</p>
            <h2 id="reading-summary-heading" className="mt-1 text-xl font-bold text-stone-900">読書の記録</h2>
          </div>
          <Link href="/bookshelf" className="text-sm font-semibold text-stone-600 transition hover:text-amber-800">本棚へ</Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {statusCards.map(({ status, label, icon: Icon, accent, background }) => {
            const count = books?.filter((book) => book.status === status).length ?? 0;
            return (
              <div key={status} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <span className={`flex size-9 items-center justify-center rounded-xl ${background} ${accent}`}>
                  <Icon className="text-lg" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-medium text-stone-600">{label}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
                  {isLoading ? "–" : count}<span className="ml-1 text-sm font-medium text-stone-500">冊</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="recent-books-heading">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-800">RECENTLY ADDED</p>
            <h2 id="recent-books-heading" className="mt-1 text-xl font-bold text-stone-900">最近追加した本</h2>
          </div>
          {recentBooks.length > 0 && (
            <Link href="/bookshelf" className="inline-flex items-center gap-1 text-sm font-semibold text-stone-600 transition hover:text-amber-800">
              すべて見る<RiArrowRightLine aria-hidden="true" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {[...Array(4)].map((_, index) => <div key={index} className="animate-pulse"><div className="aspect-2/3 rounded-xl bg-stone-200" /><div className="mt-3 h-4 rounded bg-stone-200" /></div>)}
          </div>
        ) : error ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white/50 px-6 py-10 text-center text-sm text-stone-600">本棚を読み込めませんでした。時間をおいて再度お試しください。</div>
        ) : recentBooks.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white/50 px-6 py-10 text-center">
            <RiBookOpenLine className="mx-auto text-3xl text-stone-400" aria-hidden="true" />
            <p className="mt-3 font-semibold text-stone-800">まだ本棚は空です</p>
            <p className="mt-1 text-sm text-stone-600">最初の一冊を追加して、読書の記録を始めましょう。</p>
            <Link href="/bookshelf/search" className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 text-sm font-semibold text-amber-50 transition hover:bg-stone-800"><RiAddLine aria-hidden="true" />本を追加する</Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {recentBooks.map((book) => (
              <Link key={book.id} href={`/bookshelf/${book.isbn}`} className="group rounded-xl p-1.5 transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700">
                <div className="relative mx-auto aspect-2/3 w-full max-w-40 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                  {book.imageUrl ? <Image src={book.imageUrl} alt={book.title} fill sizes="(max-width: 640px) 45vw, 25vw" className="object-contain" /> : <RiBookOpenLine className="absolute inset-0 m-auto text-3xl text-stone-300" aria-hidden="true" />}
                </div>
                <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-stone-800 group-hover:underline">{book.title}</p>
                <p className="mt-1 truncate text-xs text-stone-500">{book.author}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
