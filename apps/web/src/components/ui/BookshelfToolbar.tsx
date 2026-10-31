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
      className="relative mt-11 border-y border-[#293630]/10 py-2"
      aria-label="本棚の表示設定"
    >
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <div className="relative">
            <div
              ref={filterScrollRef}
              className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-1 overflow-x-auto px-1 pr-10"
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
                    className={`min-h-11 shrink-0 snap-start border-b-2 px-4 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 sm:px-5 ${
                      isActive
                        ? "border-[#40584e] font-medium text-[#293630]"
                        : "border-transparent bg-transparent text-[#7b8680] hover:text-[#46564f]"
                    }`}
                  >
                    {option.label}
                    <span
                      className={`ml-1.5 text-[10px] ${isActive ? "text-[#65756d]" : "text-[#9ba39f]"}`}
                    >
                      {statusCounts[option.value]}
                    </span>
                  </button>
                );
              })}
            </div>
            {canScrollLeft && (
              <div className="absolute inset-y-0 left-0 flex w-14 items-center bg-linear-to-r from-[#f5f3ed] via-[#f5f3ed]/85 to-transparent sm:hidden">
                <button
                  type="button"
                  onClick={() => scrollFilters("left")}
                  className="flex size-7 items-center justify-center rounded-full border border-[#293630]/10 bg-[#faf9f5]/90 text-[#66756d] shadow-sm transition hover:border-[#60736a] hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a]"
                  aria-label="前のステータスを表示"
                >
                  <RiArrowRightSLine className="rotate-180 text-lg" />
                </button>
              </div>
            )}
            {canScrollRight && (
              <div className="absolute inset-y-0 right-0 flex w-14 items-center justify-end bg-linear-to-l from-[#f5f3ed] via-[#f5f3ed]/85 to-transparent sm:hidden">
                <button
                  type="button"
                  onClick={() => scrollFilters("right")}
                  className="flex size-7 items-center justify-center rounded-full border border-[#293630]/10 bg-[#faf9f5]/90 text-[#66756d] shadow-sm transition hover:border-[#60736a] hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a]"
                  aria-label="次のステータスを表示"
                >
                  <RiArrowRightSLine className="text-lg" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => setIsDisplaySettingsOpen((isOpen) => !isOpen)}
            aria-expanded={isDisplaySettingsOpen}
            aria-controls="bookshelf-display-settings"
            className={`flex min-h-10 items-center gap-2 rounded-md border px-4 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 ${isDisplaySettingsOpen ? "border-[#6c7c74] bg-[#e9e9e2] text-[#344941]" : "border-[#293630]/10 bg-[#f9f8f4] text-[#5f6d66] hover:border-[#293630]/20"}`}
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
          className="absolute right-0 top-full z-20 mt-2 grid w-full max-w-155 gap-5 border border-[#293630]/10 bg-[#faf9f5] p-5 shadow-[0_18px_50px_rgb(43_56_50/13%)] sm:grid-cols-3"
        >
          <label className="min-w-0">
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-[#65736c]">
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
                className="min-h-11 w-full cursor-pointer rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#34443d] outline-none transition hover:border-[#60736a] focus:border-[#60736a] focus:ring-2 focus:ring-[#dfe5e0]"
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
                className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#526159] transition hover:border-[#60736a] hover:bg-[#f3f1eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a]"
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
            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-[#65736c]">
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
              className="min-h-11 w-full cursor-pointer rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#34443d] outline-none transition hover:border-[#60736a] focus:border-[#60736a] focus:ring-2 focus:ring-[#dfe5e0] disabled:cursor-not-allowed disabled:border-[#293630]/8 disabled:bg-[#eeece5] disabled:text-[#9ba39f]"
            >
              {groupOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isSalesDateSort && (
              <span className="mt-1 block text-[10px] text-[#7d8982]">
                発売年月で自動グループ
              </span>
            )}
          </label>

          <div className="min-w-0">
            <span className="mb-2 block text-[11px] font-medium text-[#65736c]">
              表示形式
            </span>
            <div className="flex min-h-11 rounded-md border border-[#293630]/12 bg-white p-1">
              <button
                type="button"
                onClick={() => onViewModeChange("GRID")}
                aria-pressed={viewMode === "GRID"}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] ${
                  viewMode === "GRID"
                    ? "bg-[#e4e7e2] text-[#344941]"
                    : "text-[#919a95] hover:bg-[#f3f1eb] hover:text-[#526159]"
                }`}
              >
                <RiLayoutGridLine aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">カード</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("LIST")}
                aria-pressed={viewMode === "LIST"}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] ${
                  viewMode === "LIST"
                    ? "bg-[#e4e7e2] text-[#344941]"
                    : "text-[#919a95] hover:bg-[#f3f1eb] hover:text-[#526159]"
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
