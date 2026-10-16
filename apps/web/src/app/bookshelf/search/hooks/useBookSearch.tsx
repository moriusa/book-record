import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchRakutenBooks,
  RakutenBookSearchParams,
} from "@/lib/fetchRakutenBooks";
import { rankBookSearchResults } from "@/lib/bookSearch";

const SEARCH_CACHE_TIME = 30 * 60 * 1_000;

export const useBookSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("q")?.trim() ?? "";

  const searchQuery = useInfiniteQuery({
    queryKey: ["book-search", title],
    queryFn: ({ pageParam }) => fetchRakutenBooks({ title, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pageCount ? lastPage.page + 1 : undefined,
    enabled: Boolean(title),
    staleTime: SEARCH_CACHE_TIME,
    gcTime: SEARCH_CACHE_TIME,
  });

  const books = rankBookSearchResults(
    searchQuery.data?.pages.flatMap((page) => page.Items) ?? [],
    title,
  );

  const handleSearch = ({ title: inputTitle }: RakutenBookSearchParams) => {
    const nextTitle = inputTitle?.trim();

    if (!nextTitle) {
      return;
    }

    router.push(`/bookshelf/search?q=${encodeURIComponent(nextTitle)}`);
  };

  return {
    books,
    searchTitle: title,
    hasSearched: Boolean(title),
    hasMore: searchQuery.hasNextPage,
    isLoading:
      Boolean(title) &&
      (searchQuery.isPending || searchQuery.isFetchingNextPage),
    handleSearch,
    loadMore: searchQuery.fetchNextPage,
  };
};
