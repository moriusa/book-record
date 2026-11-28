import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

type Props = {
  title: string;
  description: string;
  illustration: string;
  backHref: string;
  backLabel: string;
};

export default function BookRecordHeader({
  title,
  description,
  illustration,
  backHref,
  backLabel,
}: Props) {
  return (
    <header>
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
      >
        <RiArrowLeftLine aria-hidden="true" />
        {backLabel}
      </Link>
      <div className="mt-2 flex items-center gap-3 sm:gap-5">
        <div className="min-w-0">
          <h1 className="font-serif-jp text-[clamp(1.5rem,6vw,1.875rem)] font-semibold leading-snug tracking-[-0.04em] sm:text-[42px]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#526158]">{description}</p>
        </div>
        <Image
          src={illustration}
          alt=""
          width={112}
          height={112}
          sizes="(min-width: 640px) 112px, 80px"
          className="size-20 shrink-0 object-contain sm:size-28"
        />
      </div>
    </header>
  );
}
