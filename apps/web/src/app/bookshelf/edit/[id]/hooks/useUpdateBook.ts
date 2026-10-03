import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetcher } from "@/lib/fetcher";
import { BookFormValues } from "@/components/ui/BookFormFields";

type UpdateBookInput = BookFormValues & {
  id: string;
};

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateBookInput) => {
      return authFetcher(`/books/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["book", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });
}