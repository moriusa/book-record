import type { Metadata } from "next";
import Image from "next/image";
import updatesData from "@/data/updates.json";

export const metadata: Metadata = {
  title: "更新履歴",
  description: "つみほんの新機能、改善、修正のお知らせです。",
  alternates: { canonical: "/updates" },
};

type UpdateKind = "新機能" | "改善" | "修正";

type Update = {
  date: string;
  version: string;
  title: string;
  changes: { kind: UpdateKind; text: string }[];
};

const updates = updatesData as Update[];

const kindClassNames: Record<UpdateKind, string> = {
  新機能: "bg-[#dce8df] text-[#40584e]",
  改善: "bg-[#e8e4d8] text-[#756641]",
  修正: "bg-[#eee3df] text-[#8a5d53]",
};

export default function UpdatesPage() {
  return (
    <main className="min-h-full bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-220 px-5 pb-20 pt-7 sm:px-8 sm:pb-28 sm:pt-12">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#344941]/10 bg-[#ede9dc] px-4 py-5 sm:gap-8 sm:px-8 sm:py-6">
          <div>
            <h1 className="font-serif-jp text-3xl font-semibold tracking-[-0.045em] sm:text-[42px]">
              更新履歴
            </h1>
            <p className="mt-2 max-w-105 text-sm leading-6 text-[#526158] sm:text-base sm:leading-7">
              つみほんに加わった機能や、使いやすさの改善、不具合の修正をお知らせします。
            </p>
          </div>
          <Image
            src="/blog/categories/tsumihon.png"
            alt=""
            width={168}
            height={168}
            sizes="(min-width: 640px) 168px, 26vw"
            className="size-[clamp(80px,26vw,112px)] object-contain sm:size-42"
          />
        </header>

        <ol aria-label="更新履歴一覧" className="mt-7 ml-1.5 sm:mt-10">
          {updates.map((update, index) => (
            <li
              key={update.version}
              className="relative pl-4 before:absolute before:top-6 before:-bottom-6 before:left-0 before:w-px before:bg-[#344941]/18 last:before:hidden sm:pl-6"
            >
              <span
                aria-hidden="true"
                className={`absolute top-6 left-0 size-2.5 -translate-x-1/2 rounded-full border-2 border-[#f7f5f0] ${index === 0 ? "bg-[#344941]" : "bg-[#82988a]"}`}
              />

              <article
                className={`px-3 pt-5 pb-6 sm:px-5 sm:pb-8 ${index === 0 ? "rounded-xl border border-[#344941]/12 bg-[#e8ece1]" : "border-b border-[#344941]/12"}`}
              >
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#526158]">
                  <time
                    dateTime={update.date.replaceAll(".", "-")}
                    className="tabular-nums"
                  >
                    {update.date}
                  </time>
                  <span className="rounded bg-[#faf9f5] px-1.5 py-0.5 font-medium tabular-nums">
                    {update.version}
                  </span>
                  {index === 0 && (
                    <span className="font-medium text-[#344941]">
                      最新の更新
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-serif-jp text-lg font-semibold leading-snug sm:mt-3 sm:text-2xl">
                  {update.title}
                </h2>
                <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                  {update.changes.map((change) => (
                    <li
                      key={change.text}
                      className="flex items-start gap-2.5 text-sm leading-6 text-[#43584e] sm:gap-3 sm:leading-7"
                    >
                      <span
                        className={`mt-0.5 w-12 shrink-0 rounded-full px-1 py-0.5 text-center text-[11px] font-medium leading-4 sm:mt-1 ${kindClassNames[change.kind]}`}
                      >
                        {change.kind}
                      </span>
                      <span className="min-w-0 wrap-anywhere">
                        {change.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
