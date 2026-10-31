"use client";

import { useState } from "react";
import Link from "next/link";
import { RiAddLine, RiBookShelfLine } from "react-icons/ri";
import { useGetBooks } from "./hooks/useGetBooks";
import BookshelfList from "@/components/ui/BookShelfList";
import BookshelfToolbar from "@/components/ui/BookshelfToolbar";
import {
  FilterStatus,
  SortDirection,
  SortOption,
  ViewMode,
  GroupOption,
} from "@/types/book";

const Page = () => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [sortOption, setSortOption] = useState<SortOption>("CREATED");
  const [sortDirection, setSortDirection] = useState<SortDirection>("DESC");
  const [groupOption, setGroupOption] = useState<GroupOption>("NONE");
  const [viewMode, setViewMode] = useState<ViewMode>("GRID");

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
    return <p className="p-6 text-sm text-[#75817b]">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-6 text-sm text-[#75817b]">本棚を取得できませんでした。</p>;
  }

  return (
    <main className="mx-auto max-w-295 px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-[10px] tracking-[0.18em] text-[#7b8781]">
            <RiBookShelfLine className="text-sm" aria-hidden="true" />MY BOOKSHELF
          </p>
          <h1 className="mt-3 font-serif-jp text-3xl font-medium tracking-[-0.04em] text-[#293630] sm:text-[40px]">わたしの本棚</h1>
          <p className="mt-3 text-sm text-[#75817b]">読みたい気持ちも、読んだ思い出も。</p>
        </div>

        <Link
          href="/books/search"
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#344941] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#263a33]"
          aria-label="本を探して本棚に追加"
        >
          <RiAddLine className="text-lg font-light" aria-hidden="true" />
          本を追加
        </Link>
      </div>

      <BookshelfToolbar
        filterStatus={filterStatus}
        statusCounts={statusCounts}
        sortOption={sortOption}
        sortDirection={sortDirection}
        groupOption={groupOption}
        viewMode={viewMode}
        onFilterChange={setFilterStatus}
        onSortChange={handleSortChange}
        onSortDirectionChange={setSortDirection}
        onGroupChange={setGroupOption}
        onViewModeChange={setViewMode}
      />

      <BookshelfList
        books={data ?? []}
        filterStatus={filterStatus}
        sortOption={sortOption}
        sortDirection={sortDirection}
        groupOption={groupOption}
        viewMode={viewMode}
      />
    </main>
  );
};

export default Page;
