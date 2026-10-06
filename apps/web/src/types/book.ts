export type BookStatus = "WANT_TO_READ" | "READING" | "COMPLETED" | "ON_HOLD";

export type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  salesDate: string;
  imageUrl: string | null;
  status: BookStatus;
  completedAt: string | null;
  rating: number | null;
  review: string | null;
  createdAt: string;
  updatedAt: string;
};
