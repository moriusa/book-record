import { useCallback, useRef, useState } from "react";
import {
  fetchRakutenBooks,
  RakutenBookItem,
  RakutenBookSearchParams,
} from "@/lib/fetchRakutenBooks";
import { rankBookSearchResults } from "@/lib/bookSearch";

export const useBookSearch = () => {
  const [books, setBooks] = useState<RakutenBookItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const nextPageRef = useRef(1);
  const queryRef = useRef("");
  const requestIdRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(async (title: string, page: number, append: boolean) => {
    const requestId = requestIdRef.current;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const data = await fetchRakutenBooks({ title, page });

      // 新しい検索が始まっていた場合、古い検索の結果は反映しない。
      if (requestId !== requestIdRef.current) {
        return;
      }

      nextPageRef.current = page + 1;
      setHasMore(page < data.pageCount);
      setBooks((currentBooks) =>
        rankBookSearchResults(
          append ? [...currentBooks, ...data.Items] : data.Items,
          title,
        ),
      );
    } catch (err) {
      console.error("取得エラー:", err);
      if (requestId === requestIdRef.current) {
        setHasMore(false);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, []);

  const handleSearch = useCallback(
    async (param: RakutenBookSearchParams) => {
      const title = param.title?.trim();

      if (!title) {
        return;
      }

      requestIdRef.current += 1;
      queryRef.current = title;
      nextPageRef.current = 1;
      setBooks([]);
      setHasMore(false);
      setHasSearched(true);

      await fetchPage(title, 1, false);
    },
    [fetchPage],
  );

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || !queryRef.current) {
      return;
    }

    await fetchPage(queryRef.current, nextPageRef.current, true);
  }, [fetchPage, hasMore]);

  return { books, hasSearched, hasMore, isLoading, handleSearch, loadMore };
};
