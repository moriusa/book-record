import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <main className="min-h-full bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-190 px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        <p className="text-xs tracking-[0.18em] text-[#75817a]">{eyebrow}</p>
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
