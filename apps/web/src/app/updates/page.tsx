import type { Metadata } from "next";
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
      <div className="mx-auto max-w-190 px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-24">
        <p className="text-xs tracking-[0.18em] text-[#75817a]">
          UPDATE HISTORY
        </p>
        <h1 className="mt-5 font-serif-jp text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
          更新履歴
        </h1>
        <p className="mt-4 max-w-155 text-sm leading-8 text-[#647069] sm:text-base">
          つみほんを、少しずつ育てています。新しい機能や改善のお知らせをお届けします。
        </p>

        <ol className="mt-14 border-t border-[#293630]/12">
          {updates.map((update) => (
            <li
              key={update.version}
              className="grid gap-5 border-b border-[#293630]/12 py-9 sm:grid-cols-[124px_minmax(0,1fr)] sm:gap-10 sm:py-11"
            >
              <div className="flex items-baseline gap-3 sm:block">
                <time className="text-xs tracking-[0.06em] text-[#78847d]">
                  {update.date}
                </time>
                <p className="mt-0 text-[11px] text-[#9aa29d] sm:mt-2">
                  {update.version}
                </p>
              </div>

              <article>
                <h2 className="font-serif-jp text-xl font-medium sm:text-2xl">
                  {update.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {update.changes.map((change) => (
                    <li
                      key={change.text}
                      className="flex gap-3 text-sm leading-7 text-[#506058]"
                    >
                      <span
                        className={`mt-1.5 h-fit shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 ${kindClassNames[change.kind]}`}
                      >
                        {change.kind}
                      </span>
                      <span>{change.text}</span>
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
