import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookDetailHeader from "@/components/ui/BookDetailHeader";
import BookDetailSection, {
  BookDetailInformation,
} from "@/components/ui/BookDetailSection";
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
      <main className="mx-auto max-w-270 px-5 pb-16 pt-7 text-[#293630] sm:px-8 sm:pb-24 sm:pt-10">
        <BookDetailHeader
          title={book.title}
          imageUrl={book.largeImageUrl}
          recordLinkLabel="本棚・記録へ"
        >
          {book.author && (
            <Link
              href={`/books/search?q=${encodeURIComponent(book.author)}&type=author`}
              className="mt-2 inline-block wrap-anywhere text-sm leading-6 text-[#526158] underline decoration-[#526158]/50 underline-offset-4 hover:text-[#344941] hover:decoration-current sm:mt-4 sm:text-base"
            >
              {book.author}
            </Link>
          )}
        </BookDetailHeader>

        <div className="mt-4 grid items-start gap-8 sm:mt-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="min-w-0 space-y-8 sm:space-y-10">
            <BookDetailSection id="book-description" title="作品紹介">
              <p className="mt-4 whitespace-pre-wrap wrap-anywhere text-sm leading-7 text-[#526158] sm:text-base sm:leading-8">
                {book.itemCaption || "作品紹介はありません。"}
              </p>
            </BookDetailSection>
            <BookDetailInformation
              rows={[
                ["出版社", book.publisherName || "–"],
                ["発売日", book.salesDate || "–"],
                ["シリーズ", book.seriesName || "–"],
                ["形式", book.size || "–"],
                ["ISBN", book.isbn],
              ]}
            />
          </div>

          <BookShelfStatus
            bookData={book}
            amazonBookUrl={amazonBookUrl}
            isAmazonAffiliate={isAmazonAffiliate}
          />
        </div>
      </main>
    </>
  );
};

export default Page;
