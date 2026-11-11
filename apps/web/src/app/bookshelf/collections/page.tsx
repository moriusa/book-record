"use client";

import Image from "next/image";
import Link from "next/link";
import { RiBookOpenLine } from "react-icons/ri";
import BookTenShareActions from "./BookTenShareActions";
import { useGetCollections } from "./hooks/useGetCollections";

export default function BookCollectionsPage() {
  const { data: collections = [], isLoading, error } = useGetCollections();
  const collection = collections[0];

  return (
    <main className="mx-auto max-w-295 px-5 pb-24 pt-10 text-[#293630] sm:px-8 sm:pt-14">
      <div>
        <p className="text-[10px] tracking-[0.18em] text-[#7b8781]">BOOK TEN</p>
        <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[40px]">
          名刺代わりの本10選
        </h1>
        <p className="mt-3 text-sm text-[#75817b]">
          いまの自分を表す、特別な10冊。
        </p>
      </div>

      {isLoading ? (
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3">
          <div className="aspect-3/2 animate-pulse bg-[#e4e2db]" />
        </div>
      ) : error ? (
        <p className="mt-12 text-sm text-[#75817b]">
          10選を取得できませんでした。
        </p>
      ) : collections.length === 0 ? (
        <div className="mt-12 border-y border-[#293630]/10 py-20 text-center">
          <RiBookOpenLine className="mx-auto text-3xl text-[#9ba49f]" />
          <p className="mt-4 font-serif-jp text-xl">まだ10選はありません</p>
          <p className="mt-3 text-sm text-[#75817b]">
            本の詳細画面から、いまの自分を表す本を追加できます。
          </p>
        </div>
      ) : collection ? (
        <section className="mt-12 border border-[#293630]/10 bg-[#eeece5] p-5 sm:p-8">
          <div className="mb-7 flex items-end justify-between border-b border-[#293630]/10 pb-4">
            <div>
              <p className="text-[10px] tracking-[0.14em] text-[#839089]">
                YOUR BOOK TEN
              </p>
              <h2 className="mt-2 font-serif-jp text-xl font-medium">
                選んだ本
              </h2>
            </div>
            <span className="font-serif-jp text-lg text-[#60736a]">
              {collection.items.length}/10
            </span>
          </div>
          <ol className="divide-y divide-[#293630]/10">
            {[...collection.items]
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/books/${item.isbn}`}
                    className="group grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4 py-5 transition sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-6 sm:py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-inset"
                  >
                    <div className="relative aspect-2/3 self-start overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[5px_7px_16px_rgb(38_48_43/15%)] transition-transform group-hover:-translate-y-1">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 72px, 88px"
                          className="object-cover"
                        />
                      ) : (
                        <RiBookOpenLine className="absolute inset-0 m-auto text-xl text-[#75817b]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-serif-jp text-base font-medium leading-6 text-[#344941] transition-colors group-hover:text-[#60736a] sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-2 truncate text-xs text-[#718078]">
                        {item.author}
                      </p>
                    </div>
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
