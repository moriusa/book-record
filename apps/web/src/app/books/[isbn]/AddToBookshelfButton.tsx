"use client";

import Link from "next/link";

type Props = {
  isbn: string;
};

export const AddToBookshelfButton = ({ isbn }: Props) => (
  <Link
    href={`/books/${isbn}/register`}
    className="flex min-h-11 items-center justify-center rounded-lg bg-[#344941] px-4 text-sm font-medium text-white transition-colors hover:bg-[#263a33]"
  >
    本棚に追加
  </Link>
);
