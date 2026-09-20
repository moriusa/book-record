"use client";

import { useState } from "react";

type Props = {
  isbn: string;
};

export const AddToBookshelfButton = ({ isbn }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setIsLoading(true);

      // TODO: DB登録処理
      console.log("本棚に登録:", isbn);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isLoading}
      className="rounded-lg bg-black px-6 py-3 font-bold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "登録中..." : "本棚に登録"}
    </button>
  );
};
