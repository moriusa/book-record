"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  RiAddLine,
  RiBookShelfLine,
  RiBookmark3Line,
  RiListCheck2,
} from "react-icons/ri";
import { useGetBooks } from "./hooks/useGetBooks";
import BookshelfList from "@/components/ui/BookShelfList";
import BookshelfToolbar from "@/components/ui/BookshelfToolbar";
import { BookshelfSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  FilterStatus,
  SortDirection,
  SortOption,
  ViewMode,
  GroupOption,
} from "@/types/book";

const BOOKSHELF_VIEW_STORAGE_KEY = "tsumihon:bookshelf-view-mode";
const BOOKSHELF_VIEW_CHANGE_EVENT = "bookshelf-view-mode-change";

const getStoredViewMode = (): ViewMode => {
  try {
    return window.localStorage.getItem(BOOKSHELF_VIEW_STORAGE_KEY) === "LIST"
      ? "LIST"
      : "GRID";
  } catch {
    return "GRID";
  }
};

const subscribeToViewMode = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(BOOKSHELF_VIEW_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(BOOKSHELF_VIEW_CHANGE_EVENT, callback);
  };
};

const BookshelfPage = () => {
  const searchParams = useSearchParams();
  const statusFromQuery = searchParams.get("status");
  const isFilterStatus = (status: string | null): status is FilterStatus =>
    status === "ALL" ||
    status === "WANT_TO_READ" ||
    status === "READING" ||
    status === "COMPLETED" ||
    status === "ON_HOLD";
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(() =>
    isFilterStatus(statusFromQuery) ? statusFromQuery : "ALL",
  );
  const [sortOption, setSortOption] = useState<SortOption>("CREATED");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");
  const [groupOption, setGroupOption] = useState<GroupOption>("NONE");
  const viewMode = useSyncExternalStore<ViewMode>(
    subscribeToViewMode,
    getStoredViewMode,
    () => "GRID",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewModeChange = (mode: ViewMode) => {
    try {
      window.localStorage.setItem(BOOKSHELF_VIEW_STORAGE_KEY, mode);
    } catch {
      // Keep the selected view for this render when local storage is unavailable.
    }
    window.dispatchEvent(new Event(BOOKSHELF_VIEW_CHANGE_EVENT));
  };

  const { data, isLoading, error } = useGetBooks();
  const statusCounts: Record<FilterStatus, number> = {
    ALL: data?.length ?? 0,
    WANT_TO_READ:
      data?.filter((book) => book.status === "WANT_TO_READ").length ?? 0,
    READING: data?.filter((book) => book.status === "READING").length ?? 0,
    COMPLETED: data?.filter((book) => book.status === "COMPLETED").length ?? 0,
    ON_HOLD: data?.filter((book) => book.status === "ON_HOLD").length ?? 0,
  };
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);

    if (option === "SALES_DATE") {
      setGroupOption("NONE");
    }
  };

  if (isLoading) {
    return <BookshelfSkeleton />;
  }

  if (error) {
    return (
      <p className="p-6 text-sm text-[#75817b]">本棚を取得できませんでした。</p>
    );
  }

  return (
    <main className="mx-auto max-w-295 px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:gap-7">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#7b8781]">
              <RiBookShelfLine className="text-sm" aria-hidden="true" />
              MY BOOKSHELF
            </p>
            <h1 className="mt-2 font-serif-jp text-3xl font-medium tracking-[-0.04em] text-[#293630] sm:mt-3 sm:text-[40px]">
              わたしの本棚
            </h1>
            <p className="mt-2 text-xs text-[#75817b] sm:mt-3 sm:text-sm">
              読みたい気持ちも、読んだ思い出も。
            </p>
          </div>
          <Image
            src="/loose-library.png"
            alt=""
            width={128}
            height={128}
            sizes="(min-width: 1024px) 128px, (min-width: 640px) 112px, (min-width: 386px) 104px, (min-width: 320px) 27vw, 84px"
            className="size-[clamp(84px,27vw,104px)] shrink-0 object-contain sm:size-28 lg:size-32"
          />
        </div>

        <div className="flex w-full flex-nowrap gap-2 sm:w-auto sm:flex-wrap sm:gap-3">
          <Link
            href="/bookshelf/lists"
            className="group inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#293630]/15 bg-[#faf9f5] px-2.5 py-2 text-xs font-medium text-[#40584e] transition-colors hover:border-[#718078] sm:min-h-0 sm:w-fit sm:flex-none sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
          >
            <RiListCheck2 className="text-lg" aria-hidden="true" />
            リスト
          </Link>
          <Link
            href="/bookshelf/collections"
            className="group inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#293630]/15 bg-[#faf9f5] px-2.5 py-2 text-xs font-medium text-[#40584e] transition-colors hover:border-[#718078] sm:min-h-0 sm:w-fit sm:flex-none sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
          >
            <RiBookmark3Line className="text-lg" aria-hidden="true" />
            本10選
          </Link>
          <Link
            href="/books/search"
            className="group inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#344941] px-2.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#263a33] sm:min-h-0 sm:w-fit sm:flex-none sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
            aria-label="本を探して本棚に追加"
          >
            <RiAddLine className="text-lg font-light" aria-hidden="true" />
            本を追加
          </Link>
        </div>
      </div>

      <BookshelfToolbar
        filterStatus={filterStatus}
        statusCounts={statusCounts}
        searchQuery={searchQuery}
        sortOption={sortOption}
        sortDirection={sortDirection}
        groupOption={groupOption}
        viewMode={viewMode}
        onFilterChange={setFilterStatus}
        onSearchChange={setSearchQuery}
        onSortChange={handleSortChange}
        onSortDirectionChange={setSortDirection}
        onGroupChange={setGroupOption}
        onViewModeChange={handleViewModeChange}
      />

      <BookshelfList
        books={data ?? []}
        filterStatus={filterStatus}
        searchQuery={searchQuery}
        sortOption={sortOption}
        sortDirection={sortDirection}
        groupOption={groupOption}
        viewMode={viewMode}
      />
    </main>
  );
};

const Page = () => (
  <Suspense fallback={<BookshelfSkeleton />}>
    <BookshelfPage />
  </Suspense>
);

export default Page;
