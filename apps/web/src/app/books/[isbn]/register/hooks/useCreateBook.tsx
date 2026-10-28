import { authFetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateBookInput = {
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

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
