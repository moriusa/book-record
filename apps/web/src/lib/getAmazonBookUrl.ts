const AMAZON_BOOKS_SEARCH_URL = "https://www.amazon.co.jp/s";

export const getAmazonBookUrl = (isbn: string) => {
  const params = new URLSearchParams({
    i: "stripbooks",
    k: isbn.replace(/[-\s]/g, ""),
  });
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG?.trim();

  if (associateTag) {
    params.set("tag", associateTag);
  }

  return `${AMAZON_BOOKS_SEARCH_URL}?${params}`;
};

export const isAmazonAffiliateEnabled = () =>
  Boolean(process.env.AMAZON_ASSOCIATE_TAG?.trim());
