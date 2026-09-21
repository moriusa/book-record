"use client";
import Link from "next/link";
import { SearchBox } from "./SearchBox";
import Image from "next/image";
import { useBookSearch } from "./hooks/useBookSearch";

const Page = () => {
  const { books, handleSearch, isLoading } = useBookSearch();

  return (
    <div>
      <h1>追加する本を検索</h1>
      <SearchBox onSearch={handleSearch} />
      <div className="grid grid-cols-3 gap-6">
        {books.map((book) => (
          <Link key={book.isbn} href={`/bookshelf/${book.isbn}`}>
            <div className="relative mx-auto w-30 h-45">
              <Image
                src={book.largeImageUrl}
                alt={book.title}
                fill
                className="object-contain"
              />
            </div>

            <p className="mt-2">{book.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
