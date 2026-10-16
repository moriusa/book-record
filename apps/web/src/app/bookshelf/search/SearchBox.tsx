import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { RakutenBookSearchParams } from "@/lib/fetchRakutenBooks";

type SearchBoxProps = {
  onSearch: ({ title }: RakutenBookSearchParams) => void;
  isLoading: boolean;
  initialKeyword: string;
};

export const SearchBox = ({
  onSearch,
  isLoading,
  initialKeyword,
}: SearchBoxProps) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    onSearch({ title: trimmedKeyword });
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm transition focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100"
    >
      <FaSearch className="ml-3 shrink-0 text-stone-400" aria-hidden="true" />
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-stone-900 outline-none placeholder:text-stone-400"
        placeholder="タイトルを入力して検索"
        aria-label="本のタイトルを検索"
      />

      <button
        type="submit"
        disabled={isLoading || !keyword.trim()}
        className="min-h-11 rounded-xl bg-stone-900 px-4 text-sm font-semibold text-amber-50 transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? "検索中…" : "検索"}
      </button>
    </form>
  );
};
