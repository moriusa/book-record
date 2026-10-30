"use client";

import { useState } from "react";
import Link from "next/link";
import { RiAddLine, RiSearchLine } from "react-icons/ri";
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
  const filteredBookCount = (data ?? []).filter(
    (book) => filterStatus === "ALL" || book.status === filterStatus,
  ).length;
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);

    if (option === "SALES_DATE") {
      setGroupOption("NONE");
    }
  };

  if (isLoading) {
    return <p className="p-6">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-6">本棚を取得できませんでした。</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">本棚</h1>
          <p className="mt-1 text-sm text-stone-600">あなたの読書を、ここに並べよう。</p>
        </div>

        <Link
          href="/books/search"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-stone-900 py-1.5 pl-2 pr-3.5 text-sm font-semibold text-amber-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
          aria-label="本を探して本棚に追加"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/12 transition group-hover:bg-white/18">
            <RiSearchLine className="text-base" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">本を探す</span>
          <RiAddLine className="text-base" aria-hidden="true" />
        </Link>
      </div>

      <BookshelfToolbar
        filterStatus={filterStatus}
        filteredBookCount={filteredBookCount}
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
