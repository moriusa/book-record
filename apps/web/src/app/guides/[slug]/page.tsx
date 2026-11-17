import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";
import GuideIcon from "@/components/guides/GuideIcon";
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
      <article className="mx-auto max-w-175 px-5 pb-20 pt-8 sm:px-8 sm:pb-32 sm:pt-16">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-xs text-[#647069] transition-colors hover:text-[#293630]"
        >
          <RiArrowLeftLine aria-hidden="true" />
          つみほんの使い方一覧
        </Link>
        <header className="mt-10 border-b border-[#293630]/12 pb-10 sm:mt-18 sm:pb-16">
          <p className="text-xs tracking-[0.18em] text-[#75817a]">
            {guide.eyebrow}
          </p>
          <h1 className="mt-5 flex max-w-150 items-start gap-3 font-serif-jp text-3xl font-medium leading-[1.45] tracking-[-0.035em] sm:text-4xl sm:leading-snug sm:tracking-[-0.045em]">
            <GuideIcon
              icon={guide.icon}
              className="mt-[0.325em] shrink-0 text-[0.8em] text-[#60736a]"
            />
            <span>
              <span className="sm:hidden">
                {guide.mobileTitleLines.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < guide.mobileTitleLines.length - 1 && <br />}
                  </span>
                ))}
              </span>
              <span className="hidden sm:inline">{guide.title}</span>
            </span>
          </h1>
          <p className="mt-5 max-w-150 text-[15px] leading-7 text-[#526159] sm:mt-7 sm:text-md sm:leading-8">
            {guide.lead}
          </p>
        </header>
        <div className="divide-y divide-[#293630]/12">
          {guide.sections.map((section, index) => (
            <section
              key={section.heading}
              className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 py-8 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-8 sm:py-14"
            >
              <p className="pt-0.5 font-serif-jp text-base text-[#8a978f] sm:text-xl">
                0{index + 1}
              </p>
              <div>
                <h2 className="text-pretty font-serif-jp text-xl font-medium leading-8 sm:text-2xl sm:leading-normal">
                  {section.heading}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#5f6d65] sm:mt-5 sm:text-base sm:leading-8">
                  {section.body}
                </p>
                <figure className="mt-6 overflow-hidden border border-[#293630]/10 bg-[#eeece5] sm:mt-7">
                  {section.image ? (
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      width={1440}
                      height={900}
                      className="h-auto w-full"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center px-6 text-center">
                      <p className="text-xs leading-6 text-[#75817a]">
                        「{section.heading}」のスクリーンショットを準備中です
                      </p>
                    </div>
                  )}
                  <figcaption className="border-t border-[#293630]/10 px-4 py-3 text-[11px] text-[#75817a]">
                    {section.image?.alt ?? section.heading}
                  </figcaption>
                </figure>
              </div>
            </section>
          ))}
        </div>
        <div className="mt-8 border border-[#293630]/10 bg-[#eeece5] p-7 sm:p-9">
          <p className="font-serif-jp text-xl font-medium">
            つみほんをはじめる
          </p>
          <p className="mt-3 text-sm leading-7 text-[#647069]">
            気になる本を登録して、自分だけの本棚をつくりましょう。
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
