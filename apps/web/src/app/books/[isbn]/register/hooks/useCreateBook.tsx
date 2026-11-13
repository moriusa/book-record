import { authFetcher } from "@/lib/fetcher";
import { sendGAEvent } from "@next/third-parties/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateBookInput = {
  isbn: string;
  title: string;
  author: string;
  publisherName: string | null;
  seriesName: string | null;
  salesDate: string | null;
  largeImageUrl: string | null;
  status: string;
  rating: number | null;
  review: string | null;
  completedAt: string | null;
};

const createBook = (input: CreateBookInput) =>
  authFetcher("/books", {
    method: "POST",
    body: JSON.stringify(input),
  });

type BulkCreateBookResult = {
  createdIsbns: string[];
  skippedIsbns: string[];
};

const createBooks = (books: CreateBookInput[]) =>
  authFetcher<BulkCreateBookResult>("/books/bulk", {
    method: "POST",
    body: JSON.stringify({ books }),
  });

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      sendGAEvent("event", "add_book");
    },
  });
};

export const useCreateBooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      sendGAEvent("event", "add_book");
    },
  });
};
