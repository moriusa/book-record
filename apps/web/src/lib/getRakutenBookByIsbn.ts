import { fetchRakutenBooks, RakutenBookItem } from "./fetchRakutenBooks";

export const getRakutenBookByIsbn = async (
  isbn: string,
): Promise<RakutenBookItem | null> => {
  const data = await fetchRakutenBooks({
    isbn,
  });

  return data.Items[0] ?? null;
};
