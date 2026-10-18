"use client";

import { useState } from "react";
import Link from "next/link";
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

  if (isLoading) {
    return <p className="p-6">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-6">本棚を取得できませんでした。</p>;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">本棚</h1>

        <Link
          href="/bookshelf/search"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          本を追加
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
        onSortChange={setSortOption}
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
