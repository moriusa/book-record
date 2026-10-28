import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchRakutenBooks,
} from "@/lib/fetchRakutenBooks";
import { BookSearchField, rankBookSearchResults } from "@/lib/bookSearch";

const SEARCH_CACHE_TIME = 30 * 60 * 1_000;
const searchFields: BookSearchField[] = ["title", "isbn", "author"];

export type BookSearchInput = {
  keyword: string;
  searchField: BookSearchField;
};

export const useBookSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.trim() ?? "";
  const requestedSearchField = searchParams.get("type");
  const searchField = searchFields.includes(
    requestedSearchField as BookSearchField,
  )
    ? (requestedSearchField as BookSearchField)
    : "title";

  const createSearchParams = (page: number) => {
    switch (searchField) {
      case "isbn":
        return { isbn: keyword, page };
      case "author":
        return { author: keyword, page };
      case "title":
        return { title: keyword, page };
    }
  };

  const searchQuery = useInfiniteQuery({
    queryKey: ["book-search", searchField, keyword],
    queryFn: ({ pageParam }) => fetchRakutenBooks(createSearchParams(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pageCount ? lastPage.page + 1 : undefined,
    enabled: Boolean(keyword),
    staleTime: SEARCH_CACHE_TIME,
    gcTime: SEARCH_CACHE_TIME,
  });

  const books = rankBookSearchResults(
    searchQuery.data?.pages.flatMap((page) => page.Items) ?? [],
    keyword,
    searchField,
  );

  const handleSearch = ({ keyword: inputKeyword, searchField }: BookSearchInput) => {
    const nextKeyword = inputKeyword.trim();

    if (!nextKeyword) {
      return;
    }

    router.push(
      `/books/search?q=${encodeURIComponent(nextKeyword)}&type=${searchField}`,
    );
  };

  return {
    books,
    searchKeyword: keyword,
    searchField,
    hasSearched: Boolean(keyword),
    hasMore: searchQuery.hasNextPage,
    isLoading:
      Boolean(keyword) &&
      (searchQuery.isPending || searchQuery.isFetchingNextPage),
    handleSearch,
    loadMore: searchQuery.fetchNextPage,
  };
};
