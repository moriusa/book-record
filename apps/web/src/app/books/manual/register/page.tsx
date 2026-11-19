import ManualBookForm from "./ManualBookForm";

export default function ManualBookRegisterPage() {
  return (
    <main className="mx-auto max-w-250 px-5 pb-20 pt-10 sm:px-8 sm:pb-28">
      <div className="max-w-150">
        <p className="text-[10px] tracking-[0.18em] text-[#7c8881]">
          MANUAL ENTRY
        </p>
        <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] sm:text-[40px]">
          本を手動で登録
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#748078]">
          検索で見つからない本も、あなたの本棚に残せます。
        </p>
      </div>
      <div className="mt-10 max-w-155 border border-[#293630]/10 bg-[#faf9f5] p-6 sm:p-9">
        <ManualBookForm />
      </div>
    </main>
  );
}
