import type { ReactNode } from "react";
import Image from "next/image";
import { RiArrowDownLine, RiBook3Line } from "react-icons/ri";
import { BOOK_READING_RECORD_ID } from "./BookDetailSection";

type Props = {
  title: string;
  imageUrl?: string | null;
  children?: ReactNode;
  recordLinkLabel: string;
};

export default function BookDetailHeader({
  title,
  imageUrl,
  children,
  recordLinkLabel,
}: Props) {
  return (
    <header className="border-b border-[#344941]/12 pb-2 lg:pb-6">
      <div className="grid items-start gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 lg:gap-12">
        <div
          className={`relative mx-auto grid aspect-2/3 place-items-center overflow-hidden rounded-r-sm rounded-l-xs border-l-[3px] border-black/10 bg-[#e1dccf] shadow-[7px_10px_22px_rgb(38_48_43/16%)] sm:mx-0 ${imageUrl ? "w-36 sm:w-44 lg:w-58" : "w-24 sm:w-28 lg:w-32"}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 232px, (min-width: 640px) 176px, 144px"
              className="object-contain"
            />
          ) : (
            <RiBook3Line
              className="text-3xl text-[#526158] sm:text-4xl"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="wrap-anywhere font-serif-jp text-[clamp(1.375rem,6vw,1.75rem)] font-medium leading-snug tracking-[-0.035em] sm:text-3xl lg:text-[40px]">
            {title}
          </h1>
          {children}
        </div>
      </div>
      <div className="mt-1 flex justify-end lg:hidden">
        <a
          href={`#${BOOK_READING_RECORD_ID}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 transition-colors hover:text-[#293630] hover:decoration-current"
        >
          {recordLinkLabel}
          <RiArrowDownLine className="shrink-0" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
