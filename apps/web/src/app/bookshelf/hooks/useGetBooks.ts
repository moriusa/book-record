import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

type Book = {
  id: string;
  title: string;
  author: string;
};

export function useGetBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => authFetcher<Book[]>("/books"),
  });
}