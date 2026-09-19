"use client";
import Link from "next/link";
import { SearchBox } from "./SearchBox";
import { useState } from "react";
import { fetchRakutenBooks, RakutenBookItem } from "@/lib/fetchRakutenBooks";
import Image from "next/image";

const Page = () => {
  const [books, setBooks] = useState<RakutenBookItem[]>([]);
  const handleSearch = async (key: string) => {
    const data = await fetchRakutenBooks(key);
    const filteredData = data.Items.filter((item) => {
      return item.title.includes(key) && item.size !== "";
    });
    console.log(data);
    setBooks(filteredData);
  };
  return (
    <div>
      <h1>追加する本を検索</h1>
      <SearchBox onSearch={handleSearch} />
      <div className="grid grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.isbn}>
            <div className="relative mx-auto w-30 h-45">
              <Image
                src={book.largeImageUrl}
                alt={book.title}
                fill
                className="object-contain"
              />
            </div>

            <p className="mt-2">{book.title}</p>
          </div>
        ))}
      </div>
      <Link href={"/bookshelf/new"}>追加フォーム</Link>
    </div>
  );
};

export default Page;
