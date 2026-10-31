import EditBookForm from "./EditBookForm";

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-250 px-5 pb-20 pt-10 sm:px-8 sm:pb-28">
      <div>
        <p className="text-[10px] tracking-[0.18em] text-[#7c8881]">
          READING RECORD
        </p>
        <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[40px]">
          読書の記録を編集
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#748078]">
          記録を見返しながら、今の気持ちに合わせて整えましょう。
        </p>
      </div>

      <div className="mt-10">
        <EditBookForm id={id} />
      </div>
    </main>
  );
};

export default Page;
