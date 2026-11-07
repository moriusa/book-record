import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetcher } from "@/lib/fetcher";

type DeleteBookInput = {
  id: string;
  isbn: string;
};

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteBookInput) =>
      authFetcher(`/books/${id}`, { method: "DELETE" }),

    onSuccess: async (_, { isbn }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["books"] }),
        queryClient.invalidateQueries({
          queryKey: ["book", "isbn", isbn],
        }),
      ]);
    },
  });
}
