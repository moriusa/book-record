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
  const [searchField, setSearchField] = useState<BookSearchField>(
    initialSearchField,
  );
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
      className="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm transition focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100"
    >
      <div className="flex gap-1" role="group" aria-label="検索対象">
        {searchFieldOptions.map((option) => {
          const isActive = searchField === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSearchField(option.value)}
              aria-pressed={isActive}
              className={`min-h-9 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 ${
                isActive
                  ? "bg-stone-900 text-amber-50"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <FaSearch
          className="ml-3 shrink-0 text-stone-400"
          aria-hidden="true"
        />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-stone-900 outline-none placeholder:text-stone-400"
          placeholder={activeSearchField?.placeholder}
          aria-label={`${activeSearchField?.label}を検索`}
        />

        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="min-h-11 rounded-xl bg-stone-900 px-4 text-sm font-semibold text-amber-50 transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "検索中…" : "検索"}
        </button>
      </div>
    </form>
  );
};
