import type { Metadata } from "next";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import GuideIcon from "@/components/guides/GuideIcon";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "つみほんの使い方",
  description:
    "本の探し方、登録方法、本棚の整理など、つみほんの機能と使い方を紹介します。",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-265 px-5 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-24">
        <p className="text-xs tracking-[0.18em] text-[#75817a]">
          HOW TO USE TSUMIHON
        </p>
        <h1 className="mt-5 font-serif-jp text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
          つみほんの使い方
        </h1>
        <p className="mt-6 text-sm leading-8 text-[#647069] sm:text-base">
          本を探して登録するところから、本棚の整理、読書記録の振り返りまで。つみほんの主な機能を紹介します。
        </p>

        <section
          className="mt-14 grid gap-px border border-[#293630]/12 bg-[#293630]/12 md:grid-cols-3"
          aria-label="つみほんの使い方一覧"
        >
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex min-h-72 flex-col bg-[#f7f5f0] p-7 transition-colors hover:bg-[#eeece5] sm:p-9"
            >
              <GuideIcon icon={guide.icon} className="text-xl text-[#60736a]" />
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
        <div className="mt-10 flex flex-col items-start gap-3 border-l-2 border-[#758b7f] pl-5 sm:mt-12">
          <p className="text-sm text-[#647069]">
            使い方以外の疑問は、よくある質問で確認できます。
          </p>
          <Link
            href="/faq"
            className="group flex min-h-10 items-center gap-2 text-xs font-medium text-[#40584e] transition-colors hover:text-[#263a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2"
          >
            よくある質問を見る
            <RiArrowRightLine
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
