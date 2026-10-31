import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import type { BookSearchField } from "@/lib/bookSearch";
import type { BookSearchInput } from "./hooks/useBookSearch";

type SearchBoxProps = {
  onSearch: (input: BookSearchInput) => void;
  isLoading: boolean;
  initialKeyword: string;
  initialSearchField: BookSearchField;
};

const searchFieldOptions: {
  value: BookSearchField;
  label: string;
  placeholder: string;
}[] = [
  { value: "title", label: "タイトル", placeholder: "タイトルを入力して検索" },
  { value: "isbn", label: "ISBN", placeholder: "ISBNを入力して検索" },
  { value: "author", label: "著者名", placeholder: "著者名を入力して検索" },
];

export const SearchBox = ({
  onSearch,
  isLoading,
  initialKeyword,
  initialSearchField,
}: SearchBoxProps) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchField, setSearchField] =
    useState<BookSearchField>(initialSearchField);
  const activeSearchField = searchFieldOptions.find(
    (option) => option.value === searchField,
  );
  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    onSearch({ keyword: trimmedKeyword, searchField });
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="transition"
    >
      <div
        className="flex gap-1 overflow-x-auto"
        role="group"
        aria-label="検索対象"
      >
        {searchFieldOptions.map((option) => {
          const isActive = searchField === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSearchField(option.value)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-md px-4 py-2 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] ${
                isActive
                  ? "bg-[#40584e] text-white"
                  : "text-[#6f7b74] hover:bg-[#e2e1da]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="flex min-h-14 flex-1 items-center gap-3 rounded-md border border-[#293630]/12 bg-[#faf9f5] px-4 focus-within:border-[#60736a]">
          <FaSearch className="shrink-0 text-[#7f8a84]" aria-hidden="true" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#35463e] outline-none placeholder:text-[#9ca49f]"
            placeholder={activeSearchField?.placeholder}
            aria-label={`${activeSearchField?.label}を検索`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="min-h-14 rounded-md bg-[#344941] px-7 text-sm font-medium text-white transition-colors hover:bg-[#263a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "検索中…" : "検索"}
        </button>
      </div>
    </form>
  );
};
