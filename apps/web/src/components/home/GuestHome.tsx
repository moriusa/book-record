import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine, RiLockLine, RiSearchLine } from "react-icons/ri";
import LoginButton from "@/components/ui/LoginButton";
import HomeNews from "./HomeNews";

const features = [
  {
    image: "/loose-research.png",
    title: "気になる本を、すぐに残す",
    description:
      "タイトル・著者名・ISBNで検索。手元の本はバーコードから、検索で見つからない本は手入力で追加できます。",
  },
  {
    image: "/loose-library.png",
    title: "積読の中から、次の一冊を",
    description:
      "「読みたい」「読んでいる」「読み終わった」「積読」で整理。次に読みたい本を、自分の本棚から選べます。",
  },
  {
    image: "/loose-open-books.png",
    title: "読んだ日の気持ちを残す",
    description:
      "評価や感想を記録して、あとから振り返れます。本棚もメモも非公開なので、自分の言葉で気軽に残せます。",
  },
];

export default function GuestHome() {
  return (
    <main className="-mx-3 text-[#293630]">
      <section className="border-b border-[#293630]/10 bg-[#f7f3e8]">
        <div className="mx-auto grid max-w-290 items-center gap-9 px-5 pb-9 pt-11 sm:px-8 sm:py-15 lg:grid-cols-[1fr_0.95fr] lg:gap-12 lg:py-20">
          <div>
            <p className="text-sm font-medium text-[#52665a]">
              無料の読書記録・積読管理アプリ
            </p>
            <h1 className="mt-5 font-serif-jp text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.32] tracking-[-0.055em] text-[#263b31]">
              <span className="inline-block">読みたい本も、</span>
              <span className="inline-block">読んだ本も、</span>
              <br />
              <span className="inline-block">自分だけの本棚に。</span>
            </h1>
            <p className="mt-5 max-w-108 text-sm leading-7 text-[#526158] sm:text-base sm:leading-8">
              気になる本を見つけたら、本棚へ。積読を整理して、読んだ本には感想を。つみほんは、本とのつきあいを自分のペースで楽しむためのアプリです。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <LoginButton
                label="無料で本棚をつくる"
                className="min-h-12 rounded-lg bg-[#344941] px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#263a33]"
              />
              <Link
                href="/books/search"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-[#344941]/25 bg-[#fffcf5] px-4 py-3 text-sm font-medium text-[#344941] transition-colors hover:bg-[#ebece2]"
              >
                <RiSearchLine aria-hidden="true" />
                本を探す
              </Link>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5 text-[#526158]">
              <span className="inline-flex items-center gap-1.5">
                <Image src="/google_logo.svg" alt="" width={14} height={14} />
                Googleアカウントで開始
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RiLockLine aria-hidden="true" />
                本棚は非公開
              </span>
            </p>
          </div>

          <figure className="mx-auto w-full max-w-62 sm:max-w-66">
            <Image
              src="/bookshelf_sp.png"
              alt="つみほんの本棚画面。読書状況ごとに本を切り替えられ、表紙を一覧で見られます。"
              width={361}
              height={674}
              priority
              sizes="(min-width: 640px) 264px, 248px"
              className="h-auto w-full rounded-2xl border border-[#344941]/15 shadow-[0_8px_24px_rgb(38_58_49/12%)]"
            />
            <figcaption className="mt-4 text-center text-xs text-[#526158]">
              つみほんの本棚画面
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="mx-auto max-w-290 px-5 py-14 sm:px-8 sm:py-20"
        aria-labelledby="guest-features"
      >
        <h2
          id="guest-features"
          className="font-serif-jp text-3xl font-semibold leading-snug tracking-tight sm:text-4xl"
        >
          つみほんでできること
        </h2>
        <ul className="mt-6 grid border-y border-[#293630]/15 sm:mt-8 sm:grid-cols-3 sm:divide-x sm:divide-[#293630]/15">
          {features.map(({ image, title, description }) => (
            <li
              key={title}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 border-b border-[#293630]/15 py-5 last:border-b-0 sm:block sm:border-b-0 sm:p-5 lg:p-7"
            >
              <Image
                src={image}
                alt=""
                width={112}
                height={112}
                className="size-18 object-contain sm:mb-4 sm:size-26"
              />
              <div>
                <h3 className="font-serif-jp text-lg font-semibold sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#526158]">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="bg-[#e8ece1] px-5 py-12 sm:px-8 sm:py-16"
        aria-labelledby="guest-guide"
      >
        <div className="mx-auto grid max-w-265 items-center gap-7 md:grid-cols-[0.8fr_1fr] md:gap-12">
          <div>
            <div className="flex items-center justify-between gap-3 sm:gap-5">
              <h2
                id="guest-guide"
                className="font-serif-jp text-2xl font-bold leading-snug sm:text-3xl"
              >
                本を見つけて、
                <br />
                本棚に入れるまで
              </h2>
              <Image
                src="/loose-kotatsu.png"
                alt=""
                width={112}
                height={112}
                className="size-32 shrink-0 object-contain sm:size-42"
              />
            </div>
            <p className="text-sm leading-7 text-[#526158]">
              検索結果から読みたい本を選んで、読書状況を設定するだけ。実際の操作を動画で見られます。
            </p>
            <Link
              href="/guides"
              className="mt-5 ml-auto flex w-fit min-h-11 items-center gap-2 text-sm font-medium text-[#344941] underline underline-offset-4 hover:text-[#263a33]"
            >
              使い方を読む <RiArrowRightLine aria-hidden="true" />
            </Link>
          </div>
          <video
            controls
            playsInline
            preload="metadata"
            aria-label="本を検索して本棚に登録する操作の動画"
            className="mx-auto max-h-112 w-full rounded-xl border border-[#293630]/15 bg-[#293630] shadow-sm"
          >
            <source src="/videos/introduction.mp4" type="video/mp4" />
            お使いのブラウザは動画の再生に対応していません。
          </video>
        </div>
      </section>

      <section className="mx-auto max-w-225 px-5 py-12 sm:px-8 sm:py-16">
        <HomeNews className="text-left" />
      </section>

      <section
        className="bg-[#344941] px-5 py-11 text-center text-[#fffbef] sm:px-8 sm:py-14"
        aria-labelledby="guest-start"
      >
        <h2
          id="guest-start"
          className="font-serif-jp text-2xl font-semibold sm:text-3xl"
        >
          まずは、気になる一冊から。
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <LoginButton
            label="無料で本棚をつくる"
            className="min-h-12 rounded-lg bg-[#fffbef] px-5 py-3 text-sm font-medium text-[#344941] transition-colors hover:bg-[#e7ebdc]"
          />
          <Link
            href="/faq"
            className="inline-flex min-h-12 items-center gap-2 px-2 text-sm underline underline-offset-4 hover:text-[#e7ebdc]"
          >
            よくある質問 <RiArrowRightLine aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
