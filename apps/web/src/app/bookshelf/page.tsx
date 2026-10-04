"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetBooks } from "./hooks/useGetBooks";

const Page = () => {
  const { data, isLoading, error } = useGetBooks();

  if (isLoading) {
    return <p className="p-6">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-6">本棚を取得できませんでした。</p>;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">本棚</h1>

        <Link
          href="/bookshelf/search"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-80"
        >
          本を追加
        </Link>
      </div>

      {data?.length === 0 ? (
        <div className="mt-12 rounded-2xl border bg-white p-10 text-center">
          <p className="text-gray-500">まだ本が登録されていません。</p>

          <Link
            href="/bookshelf/search"
            className="mt-4 inline-block text-sm font-medium underline"
          >
            本を追加する
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {data?.map((book) => (
            <Link
              key={book.id}
              href={`/bookshelf/${book.isbn}`}
              className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                {book.imageUrl ? (
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="line-clamp-2 font-medium group-hover:underline">
                  {book.title}
                </h2>

                <p className="mt-2 truncate text-sm text-gray-500">
                  {book.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;
