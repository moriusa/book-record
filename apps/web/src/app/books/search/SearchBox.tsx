import { RiSearchLine } from "react-icons/ri";
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
  { value: "title", label: "タイトル", placeholder: "タイトルを入力" },
  { value: "isbn", label: "ISBN", placeholder: "ISBNを入力" },
  { value: "author", label: "著者名", placeholder: "著者名を入力" },
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
      className="w-full min-w-0"
    >
      <div
        className="grid grid-cols-3 gap-1 rounded-lg bg-[#faf9f5] p-1 sm:inline-flex"
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
              className={`min-h-9 rounded-md px-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:px-5 ${
                isActive
                  ? "bg-[#344941] text-white"
                  : "text-[#526158] hover:bg-[#e8ece1]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#344941]/20 bg-[#faf9f5] px-3 focus-within:border-[#60736a] sm:px-4">
          <RiSearchLine
            className="shrink-0 text-[#526158]"
            aria-hidden="true"
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-base text-[#293630] outline-none placeholder:text-[#64716a]"
            placeholder={activeSearchField?.placeholder}
            aria-label={`${activeSearchField?.label}を検索`}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="min-h-12 w-20 shrink-0 rounded-lg bg-[#344941] px-2 text-sm font-medium text-white transition-colors hover:bg-[#263a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#68796f] sm:w-28"
        >
          {isLoading ? "検索中…" : "検索"}
        </button>
      </div>
    </form>
  );
};
