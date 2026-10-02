import { getRakutenBookByIsbn } from "@/lib/getRakutenBookByIsbn";
import Image from "next/image";
import BookShelfStatus from "./BookShelfStatus";

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
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="relative mx-auto h-72 w-48 shrink-0 sm:mx-0">
            <Image
              src={book.largeImageUrl}
              alt={book.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-relaxed">{book.title}</h1>

            <p className="mt-3 text-base text-gray-600">{book.author}</p>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex">
                <dt className="w-20 shrink-0 text-gray-500">出版社</dt>
                <dd>{book.publisherName || "-"}</dd>
              </div>

              <div className="flex">
                <dt className="w-20 shrink-0 text-gray-500">シリーズ</dt>
                <dd>{book.seriesName || "-"}</dd>
              </div>

              <div className="flex">
                <dt className="w-20 shrink-0 text-gray-500">発売日</dt>
                <dd>{book.salesDate || "-"}</dd>
              </div>

              <div className="flex">
                <dt className="w-20 shrink-0 text-gray-500">ジャンル</dt>
                <dd>{book.size || "-"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <BookShelfStatus bookData={book} />

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
