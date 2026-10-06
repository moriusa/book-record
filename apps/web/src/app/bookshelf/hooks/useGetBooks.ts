import { authFetcher } from "@/lib/fetcher";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";

export function useGetBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => authFetcher<Book[]>("/books"),
  });
}