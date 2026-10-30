"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilterStatus,
  GroupOption,
  SortDirection,
  SortOption,
  ViewMode,
} from "@/types/book";
import {
  RiArrowRightSLine,
  RiArrowDownSLine,
  RiFilter3Line,
  RiLayoutGridLine,
  RiListUnordered,
  RiSortDesc,
  RiStackLine,
} from "react-icons/ri";

type Props = {
  filterStatus: FilterStatus;
  statusCounts: Record<FilterStatus, number>;
  sortOption: SortOption;
  sortDirection: SortDirection;
  groupOption: GroupOption;
  viewMode: ViewMode;
  onFilterChange: (status: FilterStatus) => void;
  onSortChange: (option: SortOption) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onGroupChange: (option: GroupOption) => void;
  onViewModeChange: (mode: ViewMode) => void;
};

const filterOptions = [
  { value: "ALL", label: "すべて" },
  { value: "WANT_TO_READ", label: "読みたい" },
  { value: "READING", label: "読んでいる" },
  { value: "COMPLETED", label: "読み終わった" },
  { value: "ON_HOLD", label: "積読" },
] satisfies { value: FilterStatus; label: string }[];

const sortOptions = [
  { value: "CREATED", label: "登録順" },
  { value: "TITLE", label: "タイトル順" },
  { value: "RATING", label: "評価順" },
  { value: "SALES_DATE", label: "発売日順" },
] satisfies { value: SortOption; label: string }[];

const groupOptions = [
  { value: "NONE", label: "グループなし" },
  { value: "AUTHOR", label: "作者ごと" },
  { value: "PUBLISHER", label: "出版社ごと" },
  { value: "SERIES", label: "シリーズごと" },
] satisfies {
  value: GroupOption;
  label: string;
}[];

const BookshelfToolbar = ({
  filterStatus,
  statusCounts,
  sortOption,
  sortDirection,
  groupOption,
  viewMode,
  onFilterChange,
  onSortChange,
  onSortDirectionChange,
  onGroupChange,
  onViewModeChange,
}: Props) => {
  const isSalesDateSort = sortOption === "SALES_DATE";
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false);

  useEffect(() => {
    const scrollArea = filterScrollRef.current;
    if (!scrollArea) return;

    const updateScrollButtons = () => {
      const threshold = 4;
      setCanScrollLeft(scrollArea.scrollLeft > threshold);
      setCanScrollRight(
        scrollArea.scrollLeft + scrollArea.clientWidth <
          scrollArea.scrollWidth - threshold,
      );
    };

    updateScrollButtons();
    scrollArea.addEventListener("scroll", updateScrollButtons, {
      passive: true,
    });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      scrollArea.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scrollFilters = (direction: "left" | "right") => {
    const scrollArea = filterScrollRef.current;
    if (!scrollArea) return;

    scrollArea.scrollBy({
      left:
        (direction === "right" ? 1 : -1) *
        Math.round(scrollArea.clientWidth * 0.7),
      behavior: "smooth",
    });
  };

  return (
    <section
      className="mt-6 border-t border-stone-200 py-5"
      aria-label="本棚の表示設定"
    >
      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-stone-800">
            <RiFilter3Line
              aria-hidden="true"
              className="text-base text-stone-500"
            />
            読書ステータス
          </div>
          <div className="relative">
            <div
              ref={filterScrollRef}
              className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 pr-10 scrollbar-none [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="読書ステータスで絞り込む"
            >
              {filterOptions.map((option) => {
                const isActive = filterStatus === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onFilterChange(option.value)}
                    aria-pressed={isActive}
                    className={`min-h-11 shrink-0 snap-start rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-stone-900 bg-stone-900 text-amber-50 shadow-sm"
                        : "border-transparent bg-transparent text-stone-600 hover:border-stone-200 hover:bg-stone-100 hover:text-stone-950"
                    }`}
                  >
                    <span className="">
                      {option.label} {statusCounts[option.value]}
                    </span>
                  </button>
                );
              })}
            </div>
            {canScrollLeft && (
              <div className="absolute inset-y-0 left-0 flex w-14 items-center bg-linear-to-r from-[#f7f5f0] via-[#f7f5f0]/85 to-transparent sm:hidden">
                <button
                  type="button"
                  onClick={() => scrollFilters("left")}
                  className="flex size-7 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-500 shadow-sm transition hover:border-amber-300 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  aria-label="前のステータスを表示"
                >
                  <RiArrowRightSLine className="rotate-180 text-lg" />
                </button>
              </div>
            )}
            {canScrollRight && (
              <div className="absolute inset-y-0 right-0 flex w-14 items-center justify-end bg-linear-to-l from-[#f7f5f0] via-[#f7f5f0]/85 to-transparent sm:hidden">
                <button
                  type="button"
                  onClick={() => scrollFilters("right")}
                  className="flex size-7 items-center justify-center rounded-full border border-stone-200 bg-white/90 text-stone-500 shadow-sm transition hover:border-amber-300 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  aria-label="次のステータスを表示"
                >
                  <RiArrowRightSLine className="text-lg" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsDisplaySettingsOpen((isOpen) => !isOpen)}
            aria-expanded={isDisplaySettingsOpen}
            aria-controls="bookshelf-display-settings"
            className="flex min-h-10 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
          >
            表示設定
            <RiArrowDownSLine
              aria-hidden="true"
              className={`text-lg transition-transform ${
                isDisplaySettingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div
          id="bookshelf-display-settings"
          hidden={!isDisplaySettingsOpen}
          className="grid gap-3 sm:grid-cols-3 lg:flex"
        >
          <label className="min-w-0">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wide text-stone-500">
              <RiSortDesc aria-hidden="true" className="text-sm" />
              並び順
            </span>
            <div className="flex gap-2">
              <select
                value={sortOption}
                onChange={(event) => {
                  const option = sortOptions.find(
                    (option) => option.value === event.target.value,
                  );

                  if (option) {
                    onSortChange(option.value);
                  }
                }}
                className="min-h-11 w-full cursor-pointer rounded-lg border border-stone-200 bg-transparent px-3 text-sm font-medium text-stone-800 outline-none transition hover:border-amber-300 hover:bg-amber-50/50 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 lg:w-32"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  onSortDirectionChange(
                    sortDirection === "ASC" ? "DESC" : "ASC",
                  )
                }
                className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg border border-stone-200 px-3 text-sm font-semibold text-stone-700 transition hover:border-amber-300 hover:bg-amber-50/50 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                aria-label={`並び順を${sortDirection === "ASC" ? "降順" : "昇順"}に変更`}
              >
                <RiSortDesc
                  aria-hidden="true"
                  className={sortDirection === "ASC" ? "rotate-180" : ""}
                />
                {sortDirection === "ASC" ? "昇順" : "降順"}
              </button>
            </div>
          </label>

          <label className="min-w-0">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold tracking-wide text-stone-500">
              <RiStackLine aria-hidden="true" className="text-sm" />
              まとめ方
            </span>
            <select
              value={groupOption}
              disabled={isSalesDateSort}
              onChange={(event) => {
                const option = groupOptions.find(
                  (option) => option.value === event.target.value,
                );

                if (option) {
                  onGroupChange(option.value);
                }
              }}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-stone-200 bg-transparent px-3 text-sm font-medium text-stone-800 outline-none transition hover:border-amber-300 hover:bg-amber-50/50 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:border-stone-100 disabled:bg-stone-100 disabled:text-stone-400 lg:w-40"
            >
              {groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isSalesDateSort && (
              <span className="mt-1 block text-xs text-stone-500">
                発売年月で自動グループ
              </span>
            )}
          </label>

          <div className="min-w-0">
            <span className="mb-1.5 block text-xs font-bold tracking-wide text-stone-500">
              表示形式
            </span>
            <div className="flex min-h-11 rounded-lg border border-stone-200 p-1">
              <button
                type="button"
                onClick={() => onViewModeChange("GRID")}
                aria-pressed={viewMode === "GRID"}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                  viewMode === "GRID"
                    ? "bg-stone-900 text-amber-50 shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <RiLayoutGridLine aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">カード</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("LIST")}
                aria-pressed={viewMode === "LIST"}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                  viewMode === "LIST"
                    ? "bg-stone-900 text-amber-50 shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <RiListUnordered aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">リスト</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookshelfToolbar;
