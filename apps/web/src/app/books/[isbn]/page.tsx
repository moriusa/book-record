import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiBook3Line } from "react-icons/ri";
import {
  getAmazonBookUrl,
  isAmazonAffiliateEnabled,
} from "@/lib/getAmazonBookUrl";
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

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
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
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description,
      images: book.largeImageUrl ? [book.largeImageUrl] : undefined,
    },
  };
};

const Page = async ({ params }: Props) => {
  const { isbn } = await params;
  const book = await getBook(isbn);

  if (!book) {
    notFound();
  }

  const amazonBookUrl = getAmazonBookUrl(book.isbn);
  const isAmazonAffiliate = isAmazonAffiliateEnabled();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    isbn: book.isbn,
    inLanguage: "ja",
    ...(book.author
      ? { author: { "@type": "Person", name: book.author } }
      : {}),
    ...(book.publisherName
      ? { publisher: { "@type": "Organization", name: book.publisherName } }
      : {}),
    ...(book.largeImageUrl ? { image: [book.largeImageUrl] } : {}),
    ...(book.itemCaption ? { description: book.itemCaption } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <main className="text-[#293630]">
        <section className="border-b border-[#293630]/8">
          <div className="mx-auto max-w-270 px-5 pb-16 pt-7 sm:px-8 sm:pb-24 sm:pt-10">
            <div className="grid gap-12 sm:grid-cols-[220px_1fr] sm:gap-14 lg:grid-cols-[260px_1fr] lg:gap-20">
              <div className="mx-auto w-47.5 sm:w-full">
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-r-sm rounded-l-xs border-l-[5px] border-black/10 bg-[#d9d4c5] shadow-[10px_14px_28px_rgb(38_48_43/18%)]">
                  {book.largeImageUrl ? (
                    <Image
                      src={book.largeImageUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 190px, (max-width: 1024px) 220px, 260px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#66756d]">
                      <RiBook3Line className="text-4xl" aria-hidden="true" />
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="font-serif-jp text-4xl font-medium tracking-[-0.045em] text-[#293630] sm:text-5xl">
                  {book.title}
                </h1>
                <Link
                  href={`/books/search?q=${encodeURIComponent(book.author)}&type=author`}
                  className="mt-4 inline-flex text-base text-[#65726b] underline decoration-[#aeb7b1] underline-offset-4 transition-colors hover:text-[#344941] hover:decoration-[#60736a]"
                >
                  {book.author}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-270 gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_360px] lg:gap-20">
          <article>
            <h2 className="font-serif-jp text-2xl font-medium">作品紹介</h2>
            <p className="mt-6 max-w-162.5 whitespace-pre-wrap text-sm leading-8 text-[#637069]">
              {book.itemCaption || "作品紹介はありません。"}
            </p>

            <div className="mt-14 border-t border-[#293630]/10 pt-10">
              <h2 className="font-serif-jp text-xl font-medium">書籍情報</h2>
              <dl className="mt-6 divide-y divide-[#293630]/8 border-y border-[#293630]/8">
                {[
                  ["出版社", book.publisherName || "-"],
                  ["発売日", book.salesDate || "-"],
                  ["シリーズ", book.seriesName || "-"],
                  ["形式", book.size || "-"],
                  ["ISBN", book.isbn],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[100px_1fr] py-4 text-xs"
                  >
                    <dt className="text-[#909994]">{label}</dt>
                    <dd className="text-[#4b5b53]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>

          <BookShelfStatus
            bookData={book}
            amazonBookUrl={amazonBookUrl}
            isAmazonAffiliate={isAmazonAffiliate}
          />
        </section>
      </main>
    </>
  );
};

export default Page;
