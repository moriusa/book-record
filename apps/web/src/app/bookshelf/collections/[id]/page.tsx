"use client";

import Link from "next/link";
import { use } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import BookTenCollectionEditor from "../BookTenCollectionEditor";
import { useGetCollection } from "../hooks/useGetCollections";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditBookCollectionPage({ params }: Props) {
  const idPromise = params;
  // Next.js resolves route params before rendering client components.
  const id = use(idPromise).id;
  const { data: collection, isLoading, error } = useGetCollection(id);

  return (
    <main className="mx-auto max-w-295 px-5 pb-24 pt-10 text-[#293630] sm:px-8 sm:pt-14">
      <Link
        href="/bookshelf/collections"
        className="inline-flex items-center gap-1 text-xs text-[#708078] transition hover:text-[#344941]"
      >
        <RiArrowLeftLine aria-hidden="true" />
        10選の一覧へ戻る
      </Link>
      <p className="mt-9 text-[10px] tracking-[0.18em] text-[#7b8781]">
        BOOK TEN
      </p>
      <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[40px]">
        名刺代わりの本10選を編集
      </h1>
      <div className="mt-12">
        {isLoading && (
          <p className="text-sm text-[#75817b]">10選を読み込んでいます…</p>
        )}
        {error && (
          <p className="text-sm text-[#75817b]">10選を取得できませんでした。</p>
        )}
        {collection && <BookTenCollectionEditor collection={collection} />}
      </div>
    </main>
  );
}
