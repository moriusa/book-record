import Image from "next/image";
import Link from "next/link";

type Props = {
  isbn: string;
  title: string;
  author: string;
  imageUrl: string | null;
};

const BookCard = ({ isbn, title, author, imageUrl }: Props) => {
  return (
    <Link
      href={`/bookshelf/${isbn}`}
      className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-3/4 bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium group-hover:underline">
          {title}
        </h3>

        <p className="mt-1 truncate text-xs text-gray-500">{author}</p>
      </div>
    </Link>
  );
};

export default BookCard;
