import { fetchRakutenBooks, RakutenBookItem } from "./fetchRakutenBooks";

export const getRakutenBookByIsbn = async (
  isbn: string,
): Promise<RakutenBookItem | null> => {
  const data = await fetchRakutenBooks({
    isbn,
  });

  return data.Items.find((book) => book.isbn === isbn) ?? null;
};
