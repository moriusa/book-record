import { useState } from "react";
import {
  fetchRakutenBooks,
  RakutenBookItem,
  RakutenBookSearchParams,
} from "@/lib/fetchRakutenBooks";

export const useBookSearch = () => {
  const [books, setBooks] = useState<RakutenBookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (param: RakutenBookSearchParams) => {
    try {
      setIsLoading(true);

      const data = await fetchRakutenBooks(param);

      const filteredData = data.Items.filter((item) => {
        if (param.title) {
          return item.title.includes(param.title) && item.size !== "";
        }
        if (param.isbn) {
          return item.isbn === param.isbn;
        }
        if (param.author) {
          return item.author.includes(param.author) && item.size !== "";
        }
        if (param.publisherName) {
          return (
            item.publisherName.includes(param.publisherName) && item.size !== ""
          );
        }
        return false
      });

      setBooks(filteredData);
    } catch (err) {
      console.error("取得エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return { books, isLoading, handleSearch };
};
