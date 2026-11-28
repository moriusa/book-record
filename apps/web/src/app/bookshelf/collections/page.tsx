"use client";

import Image from "next/image";
import Link from "next/link";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBookOpenLine,
} from "react-icons/ri";
import BookTenShareActions from "./BookTenShareActions";
import { useGetCollections } from "./hooks/useGetCollections";
import { getBookAuthorLabel } from "@/lib/getBookAuthorLabel";
import { BookRowsSkeleton } from "@/components/ui/LoadingSkeleton";

export default function BookCollectionsPage() {
  const { data: collections = [], isLoading, error } = useGetCollections();
  const collection = collections[0];

  return (
    <main className="mx-auto max-w-225 px-5 pb-24 pt-6 text-[#293630] sm:px-8 sm:pt-10">
      <Link
        href="/bookshelf"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
      >
        <RiArrowLeftLine aria-hidden="true" />
        本棚へ戻る
      </Link>
      <header className="mt-3 border-b border-[#344941]/15 pb-5 sm:mt-5 sm:pb-6">
        <h1 className="font-serif-jp text-[clamp(1.5rem,7vw,1.875rem)] font-medium tracking-[-0.04em] sm:text-[42px]">
          名刺代わりの本10選
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#526158]">
          いまの自分を表す、特別な10冊。
        </p>
      </header>

      {isLoading ? (
        <div className="mt-6">
          <BookRowsSkeleton />
        </div>
      ) : error ? (
        <p className="mt-8 text-sm text-[#526158]">
          10選を取得できませんでした。
        </p>
      ) : collections.length === 0 ? (
        <div className="border-b border-[#344941]/15 px-4 py-10 text-center sm:py-14">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#e8ece1] text-2xl text-[#43584e]">
            <RiBookOpenLine aria-hidden="true" />
          </span>
          <p className="mt-4 font-serif-jp text-xl">まだ10選はありません</p>
          <p className="mt-2 text-sm leading-6 text-[#526158]">
            本の詳細画面から、いまの自分を表す本を追加できます。
          </p>
          <Link
            href="/bookshelf"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline underline-offset-4"
          >
            本棚から本を選ぶ
            <RiArrowRightLine aria-hidden="true" />
          </Link>
        </div>
      ) : collection ? (
        <section className="mt-6 sm:mt-8" aria-labelledby="selected-books">
          <div className="flex items-center justify-between gap-4 pb-3">
            <h2
              id="selected-books"
              className="font-serif-jp text-xl font-medium sm:text-2xl"
            >
              選んだ本
            </h2>
            <span className="rounded-full bg-[#e8ece1] px-3 py-1 text-sm font-medium tabular-nums text-[#43584e]">
              {collection.items.length} / 10冊
            </span>
          </div>
          <ol className="divide-y divide-[#344941]/12 border-y border-[#344941]/15">
            {[...collection.items]
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/books/${item.isbn}`}
                    className="group grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 py-4 transition-colors hover:bg-[#344941]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-inset sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:gap-5 sm:px-2 sm:py-5"
                  >
                    <div className="relative aspect-2/3 self-start overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#e4dfd3] shadow-sm">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 64px, 80px"
                          className="object-contain"
                        />
                      ) : (
                        <RiBookOpenLine
                          className="absolute inset-0 m-auto text-xl text-[#526158]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 wrap-anywhere font-serif-jp text-base font-medium leading-6 text-[#344941] underline-offset-4 group-hover:underline sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1 truncate text-xs text-[#526158] sm:text-sm">
                        {getBookAuthorLabel(item.author)}
                      </p>
                    </div>
                    <RiArrowRightLine
                      className="text-[#43584e]"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
          </ol>

          <BookTenShareActions collection={collection} />
        </section>
      ) : null}
    </main>
  );
}
