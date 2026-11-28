import BookRecordHeader from "@/components/ui/BookRecordHeader";
import ManualBookForm from "./ManualBookForm";

export default function ManualBookRegisterPage() {
  return (
    <main className="mx-auto max-w-185 px-5 pb-20 pt-5 text-[#293630] sm:px-8 sm:pb-28 sm:pt-8">
      <BookRecordHeader
        title="本を手動で登録"
        description="検索で見つからない本も、あなたの本棚に残せます。"
        illustration="/loose-open-books.png"
        backHref="/books/search"
        backLabel="本の検索に戻る"
      />
      <div className="mt-5 rounded-xl border border-[#344941]/12 bg-[#faf9f5] p-4 sm:mt-7 sm:p-7">
        <ManualBookForm />
      </div>
    </main>
  );
}
