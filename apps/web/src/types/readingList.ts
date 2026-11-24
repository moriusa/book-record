import type { BookStatus, BookSource } from "./book";

export type ReadingListItem = {
  id: string;
  isbn: string;
  source: BookSource;
  title: string;
  author: string;
  publisher: string | null;
  imageUrl: string | null;
  status: BookStatus;
  rating: number | null;
  review: string | null;
  isFavorite: boolean;
  position: number;
};

export type ReadingList = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  items: ReadingListItem[];
};
