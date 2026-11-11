import { authFetcher } from "@/lib/fetcher";
import type { BookCollection } from "@/types/collection";
import { useQuery } from "@tanstack/react-query";

export function useGetCollections({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["book-collections"],
    queryFn: () => authFetcher<BookCollection[]>("/collections"),
    enabled,
  });
}
