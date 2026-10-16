import { unstable_cache } from "next/cache";

export type BookDetails = {
  isbn: string;
  title: string;
  author: string;
  publisherName: string | null;
  seriesName: string | null;
  salesDate: string | null;
  largeImageUrl: string | null;
  size: string | null;
  itemCaption: string | null;
};

class BookNotFoundError extends Error {
  constructor() {
    super("Book not found");
  }
}

const fetchStoredBookByIsbn = async (isbn: string): Promise<BookDetails> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL が設定されていません");
  }

  const response = await fetch(
    `${apiUrl}/books/catalog/${encodeURIComponent(isbn)}`,
    {
      // `unstable_cache` is responsible for the persistent cache below.
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    // Errors are not cached. A book registered after a previous miss can be
    // read from the DB immediately.
    throw new BookNotFoundError();
  }

  if (!response.ok) {
    throw new Error(`本の取得に失敗しました: ${response.status}`);
  }

  return response.json();
};

const getCachedStoredBookByIsbn = unstable_cache(
  fetchStoredBookByIsbn,
  ["stored-book-by-isbn"],
  { revalidate: 86400 },
);

export const getStoredBookByIsbn = async (
  isbn: string,
): Promise<BookDetails | null> => {
  try {
    return await getCachedStoredBookByIsbn(isbn);
  } catch (error) {
    if (error instanceof BookNotFoundError) {
      return null;
    }

    throw error;
  }
};
