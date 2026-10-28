import { authFetcher } from "@/lib/fetcher";
import { Book } from "@/types/book";
import { useQuery } from "@tanstack/react-query";

export function useGetBookByIsbn(
  isbn: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["book", "isbn", isbn],
    queryFn: async () => {
      const res = await authFetcher<Book[]>(`/books?isbn=${isbn}`);
      if (res.length === 0) return null;
      return res[0];
    },
    enabled,
    retry: false,
  });
}
