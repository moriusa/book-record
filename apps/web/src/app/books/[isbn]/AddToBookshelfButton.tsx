"use client";

import Link from "next/link";

type Props = {
  isbn: string;
};

export const AddToBookshelfButton = ({ isbn }: Props) => (
  <Link
    href={`/books/${isbn}/register`}
    className="block rounded-md bg-[#344941] px-5 py-3 text-center text-xs font-medium text-white transition-colors hover:bg-[#263a33]"
  >
    本棚に追加
  </Link>
);
