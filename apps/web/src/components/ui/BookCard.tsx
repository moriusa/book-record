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
      className="group relative mx-auto block aspect-2/3 w-[82%] min-w-0 rounded-r-[3px] rounded-l-[1px] border-l-[3px] border-black/10 bg-[#d9d4c5] shadow-[4px_5px_12px_rgb(38_48_43/15%)] transition duration-300 hover:z-10 hover:-translate-y-1 hover:shadow-[6px_9px_18px_rgb(38_48_43/18%)] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-3 focus-visible:ring-offset-[#f5f3ed]"
    >
      <span className="sr-only">{title}の詳細を見る</span>
      <div className="relative h-full overflow-hidden rounded-r-[3px] rounded-l-[1px] bg-[#d9d4c5]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 28vw, (max-width: 768px) 22vw, (max-width: 1024px) 17vw, 14vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#d9d4c5] text-[#66756d]">
            <RiBook3Line className="text-3xl" aria-hidden="true" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
