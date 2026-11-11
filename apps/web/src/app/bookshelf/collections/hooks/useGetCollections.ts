import { authFetcher } from "@/lib/fetcher";
import type { BookCollection } from "@/types/collection";
import { useQuery } from "@tanstack/react-query";

export function useGetCollections() {
  return useQuery({
    queryKey: ["book-collections"],
    queryFn: () => authFetcher<BookCollection[]>("/collections"),
  });
}

export function useGetCollection(id: string) {
  return useQuery({
    queryKey: ["book-collections", id],
    queryFn: () => authFetcher<BookCollection>(`/collections/${id}`),
    enabled: Boolean(id),
  });
}
