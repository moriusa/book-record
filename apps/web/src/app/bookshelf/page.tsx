"use client"
import Link from "next/link";
import { useGetBooks } from "./hooks/useGetBooks";

const Page = () => {
  const { data, isLoading, error } = useGetBooks();
  return (
    <div>
      <Link href={"/bookshelf/search"}>本を追加</Link>
      <p>本一覧</p>
      {data?.map((book) => (
        <div key={book.id}>
          <p>{book.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Page;
