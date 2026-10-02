import { authFetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { BookStatus } from "../[isbn]/register/BookForm";

type Book = {
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
    queryFn: () => authFetcher<Book[]>(`/books?isbn=${isbn}`),
  });
}
