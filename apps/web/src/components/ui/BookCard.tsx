import Image from "next/image";
import Link from "next/link";
import { RiBook3Line } from "react-icons/ri";

type Props = {
  isbn: string;
  title: string;
  imageUrl: string | null;
};

const BookCard = ({ isbn, title, imageUrl }: Props) => {
  return (
    <Link
      href={`/books/${isbn}`}
      className="group relative block aspect-2/3 min-w-0 rounded-sm bg-stone-700 shadow-[3px_5px_0_rgb(90_52_25/45%)] transition duration-200 hover:z-10 hover:-translate-y-2 hover:shadow-[5px_9px_0_rgb(90_52_25/45%)] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#9a6236]"
    >
      <span className="sr-only">{title}の詳細を見る</span>
      <div className="relative h-full overflow-hidden rounded-sm border border-black/15 bg-stone-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 28vw, (max-width: 768px) 22vw, (max-width: 1024px) 17vw, 14vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-stone-100 to-stone-200 text-stone-400">
            <RiBook3Line className="text-3xl" aria-hidden="true" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
