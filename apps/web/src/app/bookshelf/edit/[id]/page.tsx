import BookRecordHeader from "@/components/ui/BookRecordHeader";
import EditBookForm from "./EditBookForm";

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-250 px-5 pb-20 pt-5 text-[#293630] sm:px-8 sm:pb-28 sm:pt-8">
      <BookRecordHeader
        title="読書記録を編集"
        description="読書ステータスや評価、感想・メモを更新できます。"
        illustration="/loose-guide.png"
        backHref="/bookshelf"
        backLabel="本棚に戻る"
      />

      <div className="mt-5 sm:mt-7">
        <EditBookForm id={id} />
      </div>
    </main>
  );
};

export default Page;
