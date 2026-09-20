import { getRakutenBookByIsbn } from "@/lib/getRakutenBookByIsbn";
import Image from "next/image";
import { AddToBookshelfButton } from "./AddToBookshelfButton";

type Props = {
  params: Promise<{ isbn: string }>;
};

const Page = async ({ params }: Props) => {
  const { isbn } = await params;

  const book = await getRakutenBookByIsbn(isbn);
  console.log(book);
  if (!book) return <div>データを取得できませんでした。</div>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 本の基本情報 */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative mx-auto h-60 w-40 shrink-0 overflow-hidden rounded-lg sm:mx-0">
            <Image
              src={book.largeImageUrl}
              alt={book.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="min-w-0 flex-1 pt-2">
            <h1 className="wrap-break-word text-xl font-bold leading-relaxed">
              {book.title}
            </h1>

            <p className="mt-4 wrap-break-word text-base text-gray-600">
              {book.author}
            </p>
          </div>
          <AddToBookshelfButton isbn={book.isbn} />
        </div>

        {/* 詳細情報 */}
        <div className="mt-6 border-t pt-5">
          <dl className="grid grid-cols-[90px_1fr] gap-y-3 text-sm">
            <dt className="text-gray-500">出版社</dt>
            <dd>{book.publisherName || "-"}</dd>

            <dt className="text-gray-500">シリーズ</dt>
            <dd>{book.seriesName || "-"}</dd>

            <dt className="text-gray-500">発売日</dt>
            <dd>{book.salesDate || "-"}</dd>

            <dt className="text-gray-500">ジャンル</dt>
            <dd>{book.size || "-"}</dd>
          </dl>
        </div>
      </div>

      {/* 作品紹介 */}
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">作品紹介</h2>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700">
          {book.itemCaption || "作品紹介はありません。"}
        </p>
      </div>
    </div>
  );
};

export default Page;
