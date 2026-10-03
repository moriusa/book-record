import EditBookForm from "./EditBookForm";

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">本棚の内容を編集</h1>

      <div className="mt-6">
        <EditBookForm id={id} />
      </div>
    </div>
  );
};

export default Page;