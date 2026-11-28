import Image from "next/image";
import { RiBookOpenLine } from "react-icons/ri";

type Props = {
  label: string;
  title: string;
  author?: string | null;
  publisher?: string | null;
  series?: string | null;
  imageUrl?: string | null;
};

export default function BookRecordSummary({
  label,
  title,
  author,
  publisher,
  series,
  imageUrl,
}: Props) {
  const publishingInfo = [publisher, series].filter(Boolean).join("・");

  return (
    <aside
      aria-label={label}
      className="flex items-start gap-4 rounded-xl border border-[#344941]/12 bg-[#ede9dc] p-4 sm:p-5 lg:sticky lg:top-24 lg:block"
    >
      <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-md bg-[#e1ded2] lg:mx-auto lg:w-34">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 136px, 80px"
            className="object-contain"
          />
        ) : (
          <div
            role="img"
            aria-label="表紙画像なし"
            className="grid h-full place-items-center text-xl text-[#526158]"
          >
            <RiBookOpenLine aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="min-w-0 lg:mt-4">
        <h2 className="wrap-anywhere font-serif-jp text-lg font-semibold leading-snug">
          {title}
        </h2>
        {author && (
          <p className="mt-1.5 wrap-anywhere text-sm leading-6 text-[#526158]">
            {author}
          </p>
        )}
        {publishingInfo && (
          <p className="mt-1 wrap-anywhere text-xs leading-5 text-[#526158]">
            {publishingInfo}
          </p>
        )}
      </div>
    </aside>
  );
}
