import type { ReactNode } from "react";
import Image from "next/image";

type Props = {
  eyebrow?: string;
  illustration?: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  illustration,
  title,
  description,
  children,
}: Props) {
  if (illustration) {
    return (
      <main className="min-h-full bg-[#f7f5f0] text-[#293630]">
        <div className="mx-auto max-w-220 px-5 pb-20 pt-7 sm:px-8 sm:pb-28 sm:pt-12">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#344941]/10 bg-[#ede9dc] px-4 py-5 sm:gap-8 sm:px-8 sm:py-6">
            <div>
              <h1 className="font-serif-jp text-[clamp(1.25rem,5.7vw,2rem)] font-semibold leading-snug tracking-[-0.035em] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-115 text-sm leading-6 text-[#526158] sm:text-base sm:leading-7">
                {description}
              </p>
            </div>
            <Image
              src={illustration}
              alt=""
              width={152}
              height={152}
              sizes="(min-width: 640px) 152px, 24vw"
              className="size-[clamp(68px,24vw,108px)] object-contain sm:size-38"
            />
          </header>
          <div className="mt-6 sm:mt-8">{children}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-190 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        {eyebrow && (
          <p className="text-xs tracking-[0.18em] text-[#75817a]">{eyebrow}</p>
        )}
        <h1 className="mt-5 font-serif-jp text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-7 max-w-155 text-sm leading-8 text-[#647069] sm:text-base">
          {description}
        </p>
        <div className="mt-14 border-t border-[#293630]/12">{children}</div>
      </div>
    </main>
  );
}
