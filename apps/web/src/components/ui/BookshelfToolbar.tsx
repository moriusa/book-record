import { BookStatus } from "@/types/book";

export type FilterStatus = "ALL" | BookStatus;

export type SortOption =
  | "CREATED_DESC"
  | "CREATED_ASC"
  | "TITLE_ASC"
  | "RATING_DESC";

export type GroupOption = "NONE" | "AUTHOR";

type Props = {
  filterStatus: FilterStatus;
  sortOption: SortOption;
  groupOption: GroupOption;
  onFilterChange: (status: FilterStatus) => void;
  onSortChange: (option: SortOption) => void;
  onGroupChange: (option: GroupOption) => void;
};

const filterOptions = [
  { value: "ALL", label: "すべて" },
  { value: "WANT_TO_READ", label: "読みたい" },
  { value: "READING", label: "読んでいる" },
  { value: "COMPLETED", label: "読み終わった" },
  { value: "ON_HOLD", label: "積読" },
] satisfies { value: FilterStatus; label: string }[];

const sortOptions = [
  { value: "CREATED_DESC", label: "登録が新しい順" },
  { value: "CREATED_ASC", label: "登録が古い順" },
  { value: "TITLE_ASC", label: "タイトル順" },
  { value: "RATING_DESC", label: "評価が高い順" },
] satisfies { value: SortOption; label: string }[];

const groupOptions = [
  { value: "NONE", label: "グループなし" },
  { value: "AUTHOR", label: "作者ごと" },
] satisfies { value: GroupOption; label: string }[];

const BookshelfToolbar = ({
  filterStatus,
  sortOption,
  groupOption,
  onFilterChange,
  onSortChange,
  onGroupChange,
}: Props) => {
  return (
    <div className="mt-6 space-y-5">
      {/* フィルター */}
      <div className="border-b">
        <div className="flex flex-wrap gap-x-1">
          {filterOptions.map((option) => {
            const isActive = filterStatus === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(option.value)}
                className={`relative px-3 py-3 text-sm font-medium transition-colors sm:px-4 ${
                  isActive ? "text-black" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {option.label}

                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-black" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ソート */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
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
          className="w-full rounded-lg border bg-white px-3 py-2 text-sm sm:w-auto"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={groupOption}
          onChange={(event) => {
            const option = groupOptions.find(
              (option) => option.value === event.target.value,
            );

            if (option) {
              onGroupChange(option.value);
            }
          }}
          className="w-full rounded-lg border bg-white px-3 py-2 text-sm sm:w-auto"
        >
          {groupOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BookshelfToolbar;
