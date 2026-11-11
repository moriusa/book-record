export type BookCollectionItem = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  imageUrl: string | null;
  position: number;
};

export type BookCollection = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: BookCollectionItem[];
};
