import { authFetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateBookInput = {
  isbn: string;
  title: string;
  author: string;
  publisherName: string | null;
  salesDate: string | null;
  largeImageUrl: string | null;
  status: string;
  rating: number | null;
  review: string | null;
  completedAt: string | null;
};

async function createBook(input: CreateBookInput) {
  return authFetcher("/books", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });
}
