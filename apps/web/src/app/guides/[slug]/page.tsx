import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";
import { getGuide, guides } from "@/data/guides";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => guides.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <article className="mx-auto max-w-175 px-5 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-16">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs text-[#647069] transition-colors hover:text-[#293630]"
        >
          <RiArrowLeftLine aria-hidden="true" />
          読書のガイド一覧
        </Link>
        <header className="mt-14 border-b border-[#293630]/12 pb-12 sm:mt-18 sm:pb-16">
          <p className="text-xs tracking-[0.18em] text-[#75817a]">
            {guide.eyebrow}
          </p>
          <h1 className="mt-5 font-serif-jp text-4xl font-medium leading-snug tracking-[-0.045em] sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-7 text-base leading-8 text-[#526159] sm:text-lg">
            {guide.lead}
          </p>
          <p className="mt-8 text-xs text-[#8a948e]">
            ダミーコンテンツ · 今後、実際の使い方や画面とともに更新予定です。
          </p>
        </header>
        <div className="divide-y divide-[#293630]/12">
          {guide.sections.map((section, index) => (
            <section
              key={section.heading}
              className="grid gap-4 py-10 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-8 sm:py-14"
            >
              <p className="font-serif-jp text-xl text-[#8a978f]">
                0{index + 1}
              </p>
              <div>
                <h2 className="font-serif-jp text-2xl font-medium">
                  {section.heading}
                </h2>
                <p className="mt-5 text-sm leading-8 text-[#5f6d65] sm:text-base">
                  {section.body}
                </p>
              </div>
            </section>
          ))}
        </div>
        <div className="mt-8 border border-[#293630]/10 bg-[#eeece5] p-7 sm:p-9">
          <p className="font-serif-jp text-xl font-medium">
            つみほんで、自分の本棚をつくる
          </p>
          <p className="mt-3 text-sm leading-7 text-[#647069]">
            気になる本を登録して、あなただけの読書の記録を始められます。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex text-sm text-[#40584e] underline underline-offset-4"
          >
            つみほんをはじめる
          </Link>
        </div>
      </article>
    </main>
  );
}
