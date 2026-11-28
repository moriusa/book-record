import BookRecordHeader from "@/components/ui/BookRecordHeader";
import BookRecordSummary from "@/components/ui/BookRecordSummary";
import { getRakutenBookByIsbn } from "@/lib/getRakutenBookByIsbn";
import { BookDetails, getStoredBookByIsbn } from "@/lib/getStoredBookByIsbn";
import { AddBookForm } from "./AddBookForm";

type Props = {
  params: Promise<{ isbn: string }>;
};

const Page = async ({ params }: Props) => {
  const { isbn } = await params;
  const storedBook = await getStoredBookByIsbn(isbn);
  const book: BookDetails | null =
    storedBook ?? (await getRakutenBookByIsbn(isbn));

  if (!book) {
    return (
      <div className="p-6 text-sm text-[#75817b]">
        本が見つかりませんでした。
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-250 px-5 pb-20 pt-5 text-[#293630] sm:px-8 sm:pb-28 sm:pt-8">
      <BookRecordHeader
        title="本棚に追加する"
        description="読書ステータスを選び、必要に応じて評価やメモを残せます。"
        illustration="/loose-open-books.png"
        backHref={`/books/${isbn}`}
        backLabel="書籍詳細に戻る"
      />

      <div className="mt-5 grid items-start gap-4 sm:mt-7 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-6">
        <BookRecordSummary
          label="登録する本"
          title={book.title}
          author={book.author}
          publisher={book.publisherName}
          series={book.seriesName}
          imageUrl={book.largeImageUrl}
        />
        <div className="min-w-0 rounded-xl border border-[#344941]/12 bg-[#faf9f5] p-4 sm:p-7">
          <AddBookForm bookData={book} />
        </div>
      </div>
    </main>
  );
};

export default Page;
