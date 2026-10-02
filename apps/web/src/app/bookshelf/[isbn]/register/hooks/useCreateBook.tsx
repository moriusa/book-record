import { authFetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateBookInput = {
  title: string;
  author: string;
  isbn: string;
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
