import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { BookStatus } from "../[isbn]/register/AddBookForm";

export type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  salesDate: string;
  imageUrl: string;
  status: BookStatus;
  rating: number;
  review: string;
  completedAt: string;
  createdAt: string;
};

export function useGetBookByIsbn(isbn: string) {
  return useQuery({
    queryKey: ["book", "isbn", isbn],
    queryFn: async () => {
      const res = await authFetcher<Book[]>(`/books?isbn=${isbn}`);
      if (res.length === 0) return null;
      return res[0];
    },
    retry: false,
  });
}
