"use server";

export type RakutenBookItem = {
  affiliateUrl: string;
  artistName: string;
  author: string;
  availability: string;
  booksGenreId: string;
  chirayomiUrl: string;
  discountPrice: number;
  discountRate: number;
  hardware: string;
  isbn: string;
  itemCaption: string;
  itemPrice: number;
  itemUrl: string;
  jan: string;
  label: string;
  largeImageUrl: string;
  limitedFlag: number;
  listPrice: number;
  mediumImageUrl: string;
  os: string;
  postageFlag: number;
  publisherName: string;
  reviewAverage: string;
  reviewCount: number;
  salesDate: string;
  smallImageUrl: string;
  title: string;
  size: string;
}

export type RakutenBooksResponse = {
  Items: RakutenBookItem[];
}

export type RakutenBookSearchParams = {
  title?: string;
  isbn?: string;
  author?: string;
  publisherName?: string;
};

export const fetchRakutenBooks = async ({
  title,
  isbn,
  author,
  publisherName,
}: RakutenBookSearchParams): Promise<RakutenBooksResponse> => {
  const RAKUTEN_APP_ID = process.env.RAKUTEN_APPLICATION_ID;
  const RAKUTEN_ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
  const itemLen = 30;
  const REGISTERED_SITE_URL = "https://www.animeguri.app";
  if (!RAKUTEN_APP_ID || !RAKUTEN_ACCESS_KEY) {
    throw new Error("楽天APIの環境変数が設定されていません");
  }
  const params = new URLSearchParams({
    applicationId: RAKUTEN_APP_ID,
    accessKey: RAKUTEN_ACCESS_KEY,
    hits: String(itemLen),
    formatVersion: "2",
    sort: "sales",
  });

  if (title) {
    params.set("title", title);
  }

  if (isbn) {
    params.set("isbn", isbn);
  }

  if (author) {
    params.set("author", author);
  }

  if (publisherName) {
    params.set("publisherName", publisherName);
  }
  const res = await fetch(
    `https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404?${params}`,
    {
      headers: {
        Origin: REGISTERED_SITE_URL,
        Referer: REGISTERED_SITE_URL,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      // next: { revalidate: 86400, tags: ["rakuten-books"] }, // 1日
    },
  );

  if (!res.ok) {
    throw new Error(`楽天APIエラー: ${res.status}`);
  }
  return res.json();
};
