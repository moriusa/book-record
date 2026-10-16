import { RakutenBookItem } from "./fetchRakutenBooks";

/**
 * 表記ゆれを吸収して比較するための文字列を作る。
 * 全角・半角、大小文字、空白、よく使われる記号の違いを無視する。
 */
export const normalizeBookSearchText = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("ja-JP")
    .replace(/[\s　・、】【「」『』（）()［］\[\]{}{}!！?？:】【：;；,，.。・ー-]/g, "");

export const getBookSearchScore = (book: RakutenBookItem, keyword: string) => {
  const normalizedKeyword = normalizeBookSearchText(keyword);
  const normalizedTitle = normalizeBookSearchText(book.title);

  if (!normalizedKeyword || !normalizedTitle) {
    return 0;
  }

  // 完全一致も前方一致の一種として最上位にし、部分一致より常に優先する。
  if (normalizedTitle === normalizedKeyword) {
    return 1_000;
  }

  if (normalizedTitle.startsWith(normalizedKeyword)) {
    return 800;
  }

  return normalizedTitle.includes(normalizedKeyword) ? 600 : 0;
};

/** ISBNごとに重複を取り除き、関連度の高い順に並べる。 */
export const rankBookSearchResults = (
  books: RakutenBookItem[],
  keyword: string,
) => {
  const uniqueBooks = new Map<string, RakutenBookItem>();

  for (const book of books) {
    if (!uniqueBooks.has(book.isbn)) {
      uniqueBooks.set(book.isbn, book);
    }
  }

  return [...uniqueBooks.values()]
    .map((book, index) => ({ book, index, score: getBookSearchScore(book, keyword) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ book }) => book);
};
