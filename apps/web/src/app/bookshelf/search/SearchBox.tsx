"use client";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

type SearchBoxProps = {
  onSearch: (keyword: string) => void;
};

export const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [keyword, setKeyword] = useState("");
  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    onSearch(trimmedKeyword);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="border rounded-4xl py-2 px-4 flex justify-between items-center gap-2"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="focus:outline-none w-full"
        placeholder="本を検索"
      />

      <button type="submit">
        <FaSearch size={20} className="cursor-pointer" />
      </button>
    </form>
  );
};
