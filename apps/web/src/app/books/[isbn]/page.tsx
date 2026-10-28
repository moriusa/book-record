import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRakutenBookByIsbn } from "@/lib/getRakutenBookByIsbn";
import { BookDetails, getStoredBookByIsbn } from "@/lib/getStoredBookByIsbn";
import BookShelfStatus from "./BookShelfStatus";

type Props = {
  params: Promise<{ isbn: string }>;
};

const getBook = async (isbn: string): Promise<BookDetails | null> => {
  const storedBook = await getStoredBookByIsbn(isbn);
  return storedBook ?? (await getRakutenBookByIsbn(isbn));
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { isbn } = await params;
  const book = await getBook(isbn);

  if (!book) {
    return {
      title: "書籍が見つかりません",
      robots: { index: false, follow: false },
    };
  }

  const description =
    book.itemCaption?.replace(/\s+/g, " ").slice(0, 120) ??
    `${book.author}著${book.publisherName ? `、${book.publisherName}` : ""}。`;

  return {
    title: book.title,
    description,
    alternates: { canonical: `/books/${isbn}` },
    openGraph: {
      type: "book",
      title: book.title,
      description,
      url: `/books/${isbn}`,
      images: book.largeImageUrl
        ? [{ url: book.largeImageUrl, alt: book.title }]
        : undefined,
    },
  };
};

const Page = async ({ params }: Props) => {
  const { isbn } = await params;
  const book = await getBook(isbn);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="relative mx-auto h-72 w-48 shrink-0 sm:mx-0">
            {book.largeImageUrl ? (
              <Image
                src={book.largeImageUrl}
                alt={book.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg bg-stone-100 text-sm text-stone-500">
                表紙画像はありません
              </div>
            )}
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
