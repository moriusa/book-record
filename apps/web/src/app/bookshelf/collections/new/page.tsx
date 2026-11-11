import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import BookTenCollectionEditor from "../BookTenCollectionEditor";

export default function NewBookCollectionPage() {
  return (
    <main className="mx-auto max-w-295 px-5 pb-24 pt-10 text-[#293630] sm:px-8 sm:pt-14">
      <Link
        href="/bookshelf/collections"
        className="inline-flex items-center gap-1 text-xs text-[#708078] transition hover:text-[#344941]"
      >
        <RiArrowLeftLine aria-hidden="true" />
        10選の一覧へ戻る
      </Link>
      <p className="mt-9 text-[10px] tracking-[0.18em] text-[#7b8781]">
        BOOK TEN
      </p>
      <h1 className="mt-3 font-serif-jp text-[28px] font-medium tracking-[-0.04em] sm:text-[40px]">
        <span className="block whitespace-nowrap sm:inline">
          名刺代わりの本10選
        </span>
        <span className="block whitespace-nowrap sm:inline">をつくる</span>
      </h1>
      <p className="mt-4 max-w-150 text-sm leading-7 text-[#75817b]">
        いまの自分を表す10冊を、本棚から選びましょう。作成後は画像として保存できます。
      </p>
      <div className="mt-12">
        <BookTenCollectionEditor />
      </div>
    </main>
  );
}
