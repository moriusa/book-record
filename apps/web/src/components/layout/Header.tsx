"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiBookShelfLine, RiSearchLine } from "react-icons/ri";
import Image from "next/image";
import AuthButton from "../ui/AuthButton";
import { useAuth } from "../providers/AuthProvider";

const Header = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#293630]/8 bg-[#f5f3ed]/95 backdrop-blur-md">
      <div className="mx-auto flex h-17 max-w-295 items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 outline-none transition focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-4"
        >
          <Image src={"/logo.png"} alt={""} width={28} height={20} />
          <span className="flex-col leading-none">
            <span className="text-[17px] font-medium tracking-[0.12em] text-[#293630]">
              つみほん
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav
            aria-label="メインナビゲーション"
            className="flex items-center gap-1"
          >
            <Link
              href="/books/search"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:px-4 ${pathname.startsWith("/books/search") ? "bg-[#e7e5de] font-medium text-[#293630]" : "text-[#526159] hover:bg-[#e7e5de]"}`}
            >
              <RiSearchLine className="text-base" aria-hidden="true" />
              <span className="sm:hidden">探す</span>
              <span className="hidden sm:inline">本を探す</span>
            </Link>
            {user && (
              <Link
                href="/bookshelf"
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:px-4 ${pathname.startsWith("/bookshelf") ? "bg-[#e7e5de] font-medium text-[#293630]" : "text-[#526159] hover:bg-[#e7e5de]"}`}
              >
                <RiBookShelfLine className="text-base" aria-hidden="true" />
                <span>本棚</span>
              </Link>
            )}
          </nav>

          <span
            className="ml-1 mr-3 h-5 w-px bg-[#293630]/10"
            aria-hidden="true"
          />
          <AuthButton compact />
        </div>
      </div>
    </header>
  );
};

export default Header;
