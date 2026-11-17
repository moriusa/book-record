import type { Metadata } from "next";
import Link from "next/link";
import { RiArrowRightLine, RiBookOpenLine } from "react-icons/ri";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "読書のガイド",
  description: "積読管理や読書記録を、無理なく続けるためのヒントを紹介します。",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-265 px-5 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-24">
        <p className="text-xs tracking-[0.18em] text-[#75817a]">
          READING GUIDES
        </p>
        <h1 className="mt-5 font-serif-jp text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
          読書を、ゆっくり続けるために。
        </h1>
        <p className="mt-6 max-w-155 text-sm leading-8 text-[#647069] sm:text-base">
          積読との付き合い方や、人に見せない記録の残し方。つみほんを使う時間が少し心地よくなるヒントを集めます。
        </p>

        <section
          className="mt-14 grid gap-px border border-[#293630]/12 bg-[#293630]/12 md:grid-cols-3"
          aria-label="読書ガイド一覧"
        >
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex min-h-72 flex-col bg-[#f7f5f0] p-7 transition-colors hover:bg-[#eeece5] sm:p-9"
            >
              <RiBookOpenLine
                className="text-xl text-[#60736a]"
                aria-hidden="true"
              />
              <p className="mt-10 text-[10px] tracking-[0.16em] text-[#7b8781]">
                {guide.eyebrow}
              </p>
              <h2 className="mt-3 font-serif-jp text-xl font-medium leading-relaxed">
                {guide.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#647069]">
                {guide.description}
              </p>
              <span className="mt-auto flex items-center gap-2 pt-8 text-xs text-[#50665c]">
                読む
                <RiArrowRightLine
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
