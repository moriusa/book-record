import Link from "next/link";
import {
  RiArrowRightUpLine,
  RiBookOpenLine,
  RiSearchLine,
} from "react-icons/ri";
import AuthButton from "../ui/AuthButton";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#fffdf9]/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg outline-none transition focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-4"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-stone-900 text-lg text-amber-100 shadow-sm transition-transform group-hover:-rotate-6">
            <RiBookOpenLine aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-[0.08em] text-stone-900">
              つみほん
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.16em] text-stone-500">
              YOUR BOOK SHELF
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label="メインナビゲーション" className="flex items-center gap-1">
            <Link
              href="/books/search"
              className="group flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-amber-100/70 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 sm:px-3"
            >
              <RiSearchLine aria-hidden="true" className="text-base text-stone-500 transition group-hover:text-amber-800" />
              <span>本を探す</span>
            </Link>
            <Link
              href="/bookshelf"
              className="group hidden items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-amber-100/70 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 sm:flex sm:px-3"
            >
              <span>本棚</span>
              <RiArrowRightUpLine
                aria-hidden="true"
                className="text-base text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </nav>

          <span
            className="hidden h-5 w-px bg-stone-200 sm:block"
            aria-hidden="true"
          />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
