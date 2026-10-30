import Link from "next/link";
import { RiBookOpenLine, RiBookShelfLine } from "react-icons/ri";
import AuthButton from "../ui/AuthButton";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#fffdf9]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg outline-none transition focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-4"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-stone-900 text-lg text-amber-100 shadow-sm transition-transform group-hover:-rotate-6">
            <RiBookOpenLine aria-hidden="true" />
          </span>
          <span className="flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-[0.08em] text-stone-900">
              つみほん
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-5">
          <nav
            aria-label="メインナビゲーション"
            className="flex items-center gap-0.5 sm:gap-1"
          >
            <Link
              href="/books/search"
              className="group flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-stone-700 transition hover:bg-amber-100/70 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 sm:gap-1.5 sm:px-3"
            >
              <FaSearch size={15} />
              <span className="sm:hidden">探す</span>
              <span className="hidden sm:inline">本を探す</span>
            </Link>
            <Link
              href="/bookshelf"
              className="group flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-stone-700 transition hover:bg-amber-100/70 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 sm:px-3"
            >
              <RiBookShelfLine size={20} />
              <span>本棚</span>
            </Link>
          </nav>

          <span className="h-5 w-px bg-stone-200" aria-hidden="true" />
          <AuthButton compact />
        </div>
      </div>
    </header>
  );
};

export default Header;
