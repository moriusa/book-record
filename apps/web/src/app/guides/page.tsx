import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import GuideIcon from "@/components/guides/GuideIcon";
import { guides, type Guide } from "@/data/guides";

export const metadata: Metadata = {
  title: "つみほんの使い方",
  description:
    "本の探し方、登録方法、本棚の整理など、つみほんの機能と使い方を紹介します。",
  alternates: { canonical: "/guides" },
};

const guideGroups: { id: string; title: string; icons: Guide["icon"][] }[] = [
  {
    id: "add-books",
    title: "本を探す・登録する",
    icons: ["search", "barcode", "manual"],
  },
  {
    id: "manage-books",
    title: "本棚を整理する・記録する",
    icons: ["edit", "list", "bookTen"],
  },
];

export default function GuidesPage() {
  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-265 px-5 pb-20 pt-7 sm:px-8 sm:pb-28 sm:pt-12">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#344941]/10 bg-[#ede9dc] px-4 py-5 sm:gap-8 sm:px-9 sm:py-6">
          <div>
            <h1 className="font-serif-jp text-[clamp(1.375rem,5.8vw,2rem)] font-semibold leading-snug tracking-[-0.045em] sm:text-[42px]">
              つみほんの使い方
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#526158] sm:text-base sm:leading-7">
              はじめての本棚登録から、読書メモの編集や本の整理まで。
            </p>
          </div>
          <Image
            src="/loose-guide.png"
            alt=""
            width={168}
            height={168}
            sizes="(min-width: 1024px) 168px, (min-width: 640px) 144px, 24vw"
            className="size-[clamp(72px,24vw,112px)] object-contain sm:size-36 lg:size-42"
          />
        </header>

        {guideGroups.map(({ id, title, icons }) => (
          <section key={id} className="mt-8 sm:mt-10" aria-labelledby={id}>
            <h2
              id={id}
              className="font-serif-jp text-xl font-medium sm:text-2xl"
            >
              {title}
            </h2>
            <ul className="mt-4 grid gap-2.5 md:grid-cols-3 md:gap-3">
              {icons
                .flatMap((icon) =>
                  guides.filter((guide) => guide.icon === icon),
                )
                .map((guide) => (
                  <li key={guide.slug} className="min-w-0">
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="group grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-[#344941]/12 bg-[#faf9f5] px-3.5 py-6 transition-colors hover:border-[#344941]/35 hover:bg-white md:grid-cols-[minmax(0,1fr)_auto] md:p-5"
                    >
                      <span className="grid size-9 place-items-center rounded-lg bg-[#e8ece1] text-[#43584e] md:col-start-1">
                        <GuideIcon icon={guide.icon} className="text-lg" />
                      </span>
                      <div className="md:col-span-2 md:row-start-2">
                        <h3 className="font-serif-jp text-lg font-bold leading-snug underline-offset-4 group-hover:underline sm:text-xl">
                          {guide.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-6 text-[#526158] sm:text-sm">
                          {guide.description}
                        </p>
                      </div>
                      <RiArrowRightLine
                        className="mt-2.5 text-[#526158] transition-transform group-hover:translate-x-0.5 md:col-start-2 md:row-start-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
        <div className="mt-8 rounded-xl bg-[#e8ece1] px-4 py-2 sm:mt-10 sm:px-5">
          <Link
            href="/faq"
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
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
