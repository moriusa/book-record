export type BookStatus = "WANT_TO_READ" | "READING" | "COMPLETED" | "ON_HOLD";

export type FilterStatus = "ALL" | BookStatus;
export type GroupOption = "NONE" | "AUTHOR" | "PUBLISHER" | "SERIES";
export type SortOption = "CREATED" | "TITLE" | "RATING" | "SALES_DATE";
export type SortDirection = "ASC" | "DESC";
export type ViewMode = "GRID" | "LIST";

export type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  series: string | null;
  salesDate: string;
  imageUrl: string | null;
  bookFormat: string | null;
  description: string | null;
  status: BookStatus;
  completedAt: string | null;
  rating: number | null;
  review: string | null;
  createdAt: string;
  updatedAt: string;
};
