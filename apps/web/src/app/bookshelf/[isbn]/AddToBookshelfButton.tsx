"use client";

import Link from "next/link";

type Props = {
  isbn: string;
};

export const AddToBookshelfButton = ({ isbn }: Props) => {
  return (
    <Link
      href={`/bookshelf/${isbn}/register`}
      className="rounded-lg bg-black px-6 py-3 font-bold text-white transition hover:opacity-80 text-center"
    >
      本棚に追加
    </Link>
  );
};
