import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { BookStatus } from "../[isbn]/register/BookForm";

export type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  salesDate: string;
  imageUrl: string;
  status: BookStatus;
  rating: string;
  review: string;
  completedAt: string;
};

export function useGetBookByIsbn(isbn: string) {
  return useQuery({
    queryKey: ["book", "isbn", isbn],
    queryFn: async () => {
      try {
        return await authFetcher<Book>(`/books/${isbn}`);
      } catch (error) {
        if (error instanceof Error && error.message.includes("404")) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
}
