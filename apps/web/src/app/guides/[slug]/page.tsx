import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
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
      <article className="mx-auto max-w-205 px-5 pb-20 pt-5 sm:px-8 sm:pb-28 sm:pt-8">
        <Link
          href="/guides"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
        >
          <RiArrowLeftLine aria-hidden="true" />
          つみほんの使い方一覧
        </Link>
        <header className="mt-2 rounded-2xl border border-[#344941]/10 bg-[#ede9dc] p-5 sm:p-8">
          <h1 className="flex items-start gap-3 font-serif-jp text-2xl font-semibold leading-snug tracking-[-0.035em] sm:gap-4 sm:text-4xl">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#faf9f5] text-[#43584e] sm:size-11">
              <GuideIcon icon={guide.icon} className="text-lg sm:text-2xl" />
            </span>
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
          <p className="mt-4 max-w-150 text-sm leading-7 text-[#526158] sm:text-base sm:leading-8">
            {guide.lead}
          </p>
        </header>
        <ol aria-label="操作手順" className="divide-y divide-[#293630]/12">
          {guide.sections.map(({ heading, body, image }, index) => {
            const isPortrait = image && image.height > image.width;

            return (
              <li
                key={heading}
                className={`grid items-start gap-5 py-7 sm:gap-7 sm:py-9 ${isPortrait ? "md:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]" : ""}`}
              >
                <div>
                  <h2 className="flex items-start gap-3 font-serif-jp text-lg font-semibold leading-snug sm:text-2xl">
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8ece1] font-sans text-sm font-medium text-[#43584e]"
                    >
                      {index + 1}
                    </span>
                    <span>{heading}</span>
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#526158] sm:text-base sm:leading-8">
                    {body}
                  </p>
                </div>
                {image && (
                  <figure
                    className={`w-full justify-self-center overflow-hidden rounded-xl border border-[#293630]/12 bg-[#faf9f5] ${isPortrait ? "max-w-80" : "max-w-145"}`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes={
                        isPortrait
                          ? "(min-width: 384px) 320px, calc(100vw - 40px)"
                          : "(min-width: 644px) 580px, calc(100vw - 40px)"
                      }
                      className="h-auto w-full"
                    />
                    <figcaption className="border-t border-[#293630]/10 px-4 py-2.5 text-xs leading-5 text-[#526158]">
                      {image.alt}
                    </figcaption>
                  </figure>
                )}
              </li>
            );
          })}
        </ol>
        <nav
          aria-label="次の操作"
          className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-[#e8ece1] p-4 sm:p-5"
        >
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#344941] px-4 text-sm font-medium text-white hover:bg-[#263a33]"
          >
            つみほんをはじめる
            <RiArrowRightLine aria-hidden="true" />
          </Link>
          <Link
            href="/guides"
            className="inline-flex min-h-11 items-center text-sm text-[#43584e] underline underline-offset-4"
          >
            ほかの使い方を見る
          </Link>
        </nav>
      </article>
    </main>
  );
}
