import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RakutenBookItem } from "@/lib/fetchRakutenBooks";
import { authFetcher } from "@/lib/fetcher";

type BulkCreateBooksResult = {
  added: number;
  skipped: number;
};

const createBooks = (books: RakutenBookItem[]) =>
  authFetcher<BulkCreateBooksResult>("/books/bulk", {
    method: "POST",
    body: JSON.stringify({ books }),
  });

export const useBulkCreateBooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
