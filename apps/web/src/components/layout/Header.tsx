"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiBookShelfLine, RiSearchLine } from "react-icons/ri";
import Image from "next/image";
import AuthButton from "../ui/AuthButton";
import LoginButton from "../ui/LoginButton";
import { useAuth } from "../providers/AuthProvider";

const navigationLinkClass =
  "inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 text-xs font-medium transition-colors sm:gap-2 sm:px-3.5 sm:text-sm";
const activeNavigationClass = "bg-[#e8ece1] text-[#344941]";
const inactiveNavigationClass =
  "text-[#526158] hover:bg-[#eeece5] hover:text-[#293630]";

const Header = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isBookshelf =
    pathname === "/bookshelf" || pathname.startsWith("/bookshelf/");
  const isSearch = pathname === "/books/search";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#344941]/12 bg-[#f5f3ed]/95 backdrop-blur-md">
      <div className="mx-auto flex h-17 max-w-295 items-center justify-between gap-2 px-3 sm:gap-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md text-[#293630] transition-colors hover:text-[#50665c] sm:gap-2"
        >
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={20}
            className="h-auto w-6 sm:w-7"
          />
          <span className="whitespace-nowrap text-sm font-semibold tracking-[0.07em] sm:text-lg">
            つみほん
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <nav
            aria-label="メインナビゲーション"
            className="flex items-center gap-0.5 sm:gap-1"
          >
            {user && (
              <Link
                href="/bookshelf"
                aria-current={
                  pathname === "/bookshelf"
                    ? "page"
                    : isBookshelf
                      ? "location"
                      : undefined
                }
                className={`${navigationLinkClass} ${isBookshelf ? activeNavigationClass : inactiveNavigationClass}`}
              >
                <RiBookShelfLine
                  className="shrink-0 text-base"
                  aria-hidden="true"
                />
                本棚
              </Link>
            )}
            <Link
              href="/books/search"
              aria-label="本を探す"
              aria-current={isSearch ? "page" : undefined}
              className={`${navigationLinkClass} ${isSearch ? activeNavigationClass : inactiveNavigationClass}`}
            >
              <RiSearchLine className="shrink-0 text-base" aria-hidden="true" />
              <span className="sm:hidden">探す</span>
              <span className="hidden sm:inline">本を探す</span>
            </Link>
          </nav>

          {user ? (
            <>
              <span
                className="hidden h-5 w-px bg-[#344941]/15 sm:block"
                aria-hidden="true"
              />
              <AuthButton compact />
            </>
          ) : (
            <LoginButton
              label="本棚をつくる"
              className="min-h-11 whitespace-nowrap rounded-lg bg-[#344941] px-3 text-xs font-medium text-white transition-colors hover:bg-[#263a33] sm:px-4 sm:text-sm"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
