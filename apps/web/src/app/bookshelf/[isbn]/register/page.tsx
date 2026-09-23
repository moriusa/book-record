import { getRakutenBookByIsbn } from "@/lib/getRakutenBookByIsbn";
import { BookForm } from "./BookForm";
import Image from "next/image";

type Props = {
  params: Promise<{
    isbn: string;
  }>;
};

const Page = async ({ params }: Props) => {
  const { isbn } = await params;
  const book = await getRakutenBookByIsbn(isbn);

  if (!book) {
    return <div>本が見つかりませんでした。</div>;
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">本を登録</h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* 本の情報 */}
        <div className="flex flex-col items-center gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-start">
          <div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={book.largeImageUrl}
              alt={book.title}
              fill
              className="object-contain"
            />
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <h2 className="wrap-break-word text-lg font-bold leading-relaxed">
              {book.title}
            </h2>

            <p className="mt-2 text-sm text-gray-600">{book.author}</p>

            <p className="mt-1 text-sm text-gray-500">{book.publisherName}</p>
          </div>
        </div>

        {/* 登録フォーム */}
        <div className="mt-6">
          <BookForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
