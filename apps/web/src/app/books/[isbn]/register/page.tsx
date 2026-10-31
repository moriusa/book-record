import Image from "next/image";
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
    <main className="mx-auto max-w-250 px-5 pb-20 pt-10 sm:px-8 sm:pb-28">
      <div>
        <p className="text-[10px] tracking-[0.18em] text-[#7c8881]">
          READING RECORD
        </p>
        <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[40px]">
          本棚に記録する
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#748078]">
          今の気持ちを、未来の自分のために残しておきましょう。
        </p>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[280px_1fr] lg:gap-14">
        <aside className="border border-[#293630]/10 bg-[#eeece5] p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="mt-1 flex items-start gap-5 lg:block">
            <div className="relative aspect-2/3 w-23 shrink-0 self-start overflow-hidden rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[6px_8px_18px_rgb(38_48_43/16%)] lg:mx-auto lg:w-37.5">
              {book.largeImageUrl ? (
                <Image
                  src={book.largeImageUrl}
                  alt={book.title}
                  fill
                  sizes="(max-width: 1024px) 92px, 150px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-xs text-[#75817b]">
                  表紙画像はありません
                </div>
              )}
            </div>
            <div className="min-w-0 lg:mt-6 lg:text-center">
              <h2 className="font-serif-jp text-lg font-medium lg:text-xl">
                {book.title}
              </h2>
              <p className="mt-2 text-xs text-[#718078]">{book.author}</p>
              <p className="mt-1 text-[10px] text-[#909994]">
                {book.publisherName || "-"}
                {book.seriesName ? `・${book.seriesName}` : ""}
              </p>
            </div>
          </div>
        </aside>
        <div className="border border-[#293630]/10 bg-[#faf9f5] p-6 sm:p-9">
          <AddBookForm bookData={book} />
        </div>
      </div>
    </main>
  );
};

export default Page;
