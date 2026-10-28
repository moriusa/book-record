"use client";

import Link from "next/link";

type Props = {
  isbn: string;
};

export const AddToBookshelfButton = ({ isbn }: Props) => (
  <Link
    href={`/books/${isbn}/register`}
    className="rounded-lg bg-black px-6 py-3 text-center font-bold text-white transition hover:opacity-80"
  >
    本棚に追加
  </Link>
);
