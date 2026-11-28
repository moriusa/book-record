import type { ReactNode } from "react";

export const BOOK_READING_RECORD_ID = "book-reading-record";

type Props = {
  id: string;
  title: string;
  tone?: "plain" | "paper" | "record";
  headingAside?: ReactNode;
  children: ReactNode;
};

const sectionStyles = {
  plain: "min-w-0",
  paper: "rounded-xl border border-[#344941]/12 bg-[#faf9f5] p-4 sm:p-5",
  record: "rounded-xl border border-[#344941]/12 bg-[#e8ece1] p-4 sm:p-5",
};

export default function BookDetailSection({
  id,
  title,
  tone = "plain",
  headingAside,
  children,
}: Props) {
  return (
    <section aria-labelledby={id} className={sectionStyles[tone]}>
      <div
        className={`flex items-baseline justify-between gap-2 ${tone === "plain" ? "border-b border-[#344941]/15 pb-3" : ""}`}
      >
        <h2
          id={id}
          tabIndex={tone === "record" ? -1 : undefined}
          className="scroll-mt-24 font-serif-jp text-lg font-semibold leading-snug sm:text-xl"
        >
          {title}
        </h2>
        {headingAside}
      </div>
      {children}
    </section>
  );
}

export function BookDetailInformation({
  rows,
}: {
  rows: ReadonlyArray<readonly [label: string, value: string]>;
}) {
  return (
    <BookDetailSection id="book-information" title="書籍情報">
      <dl className="divide-y divide-[#344941]/12 border-b border-[#344941]/15">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 py-3 text-sm leading-6 sm:grid-cols-[7rem_minmax(0,1fr)]"
          >
            <dt className="text-[#526158]">{label}</dt>
            <dd className="wrap-anywhere text-[#293630]">{value}</dd>
          </div>
        ))}
      </dl>
    </BookDetailSection>
  );
}
