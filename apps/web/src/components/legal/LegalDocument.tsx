import type { ReactNode } from "react";
import Link from "next/link";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: ReactNode[];
};

export default function LegalDocument({
  sections,
  updatedAt,
}: {
  sections: LegalSection[];
  updatedAt: string;
}) {
  const [year, month, day] = updatedAt.split("-");

  return (
    <>
      <nav
        aria-labelledby="legal-contents"
        className="rounded-xl bg-[#e8ece1] p-4 sm:p-5"
      >
        <h2 id="legal-contents" className="font-serif-jp text-lg font-medium">
          目次
        </h2>
        <ol className="mt-2 grid list-decimal gap-x-8 pl-6 text-sm leading-6 text-[#43584e] sm:grid-cols-2">
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="inline-block py-1 underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
              >
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-5 divide-y divide-[#344941]/12">
        {sections.map(({ id, title, paragraphs }, index) => (
          <section key={id} aria-labelledby={id} className="py-6 sm:py-8">
            <h2
              id={id}
              className="scroll-mt-24 font-serif-jp text-lg font-semibold leading-snug sm:text-xl"
            >
              {index + 1}. {title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-[#526158] sm:text-base sm:leading-8 [&_a]:text-[#344941] [&_a]:underline [&_a]:underline-offset-4">
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <footer className="mt-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-[#344941]/12 pt-4 text-sm text-[#526158]">
        <p>
          最終更新日：
          <time dateTime={updatedAt}>
            {year}年{Number(month)}月{Number(day)}日
          </time>
        </p>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center text-[#43584e] underline underline-offset-4"
        >
          お問い合わせ
        </Link>
      </footer>
    </>
  );
}
