const MANUAL_AUTHOR_PLACEHOLDER = "著者・サークル名未登録";

export const getBookAuthorLabel = (author: string) =>
  author === MANUAL_AUTHOR_PLACEHOLDER ? "–" : author;

export const getBookPublisherLabel = (publisher: string | null) =>
  publisher || "–";
