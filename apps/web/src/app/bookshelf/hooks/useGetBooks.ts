import { authFetcher } from "@/lib/fetcher";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";

export function useGetBooks({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => authFetcher<Book[]>("/books"),
    enabled,
  });
}
