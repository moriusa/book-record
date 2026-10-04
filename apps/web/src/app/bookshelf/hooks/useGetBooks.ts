import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { Book } from "./useGetBookByIsbn";

export function useGetBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => authFetcher<Book[]>("/books"),
  });
}