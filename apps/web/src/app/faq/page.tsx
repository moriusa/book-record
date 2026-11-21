import type { Metadata } from "next";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";

const faqs = [
  {
    question: "つみほんとはどんなサービスですか？",
    answer:
      "つみほんは、読みたい本・読んでいる本・読み終えた本を、自分のための本棚に記録できる無料のWebアプリです。人に見せるためのSNSではなく、自分の読書の時間を整理することを大切にしています。",
  },
  {
    question: "利用料金はかかりますか？",
    answer:
      "つみほんは無料で利用できます。本棚の作成や読書記録の登録に料金はかかりません。",
  },
  {
    question: "登録しなくても本を検索できますか？",
    answer:
      "はい。本の検索や書籍情報の閲覧は、登録なしで試せます。本を自分の本棚に追加したり、読書記録を残したりするには、Googleアカウントでのログインが必要です。",
  },
  {
    question: "本棚や読書記録は公開されますか？",
    answer:
      "いいえ。つみほんにはSNS機能がなく、登録した本・読書ステータス・評価・メモは他の利用者には公開されません。",
  },
  {
    question: "本はどのように登録できますか？",
    answer:
      "タイトル・著者名・ISBNから検索して追加できます。手元に本がある場合は、ISBNバーコードを読み取ってまとめて登録することもできます。",
  },
  {
    question: "検索で見つからない本も登録できますか？",
    answer:
      "はい。同人誌や自費出版など、検索で見つからない本は手動で登録できます。タイトルを入力すれば本棚へ追加でき、著者名や出版社・頒布元も必要に応じて記録できます。",
  },
  {
    question: "どんな読書記録を残せますか？",
    answer:
      "「読みたい」「読んでいる」「読み終わった」「積読」の読書ステータスに加え、評価や自分だけのメモを残せます。あとから本棚内を検索したり、表示順を変えたりして振り返ることもできます。",
  },
  {
    question: "本棚から本を削除できますか？",
    answer:
      "はい。本棚の編集画面または本の詳細画面から削除できます。削除すると、その本に記録した読書ステータス・評価・メモも削除されます。",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

export const metadata: Metadata = {
  title: "よくある質問",
  description:
    "つみほんの料金、登録方法、本棚の公開範囲、バーコード・手動登録など、よくある質問にお答えします。",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-220 px-5 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-24">
        <p className="text-xs tracking-[0.18em] text-[#75817a]">
          FAQ
        </p>
        <h1 className="mt-5 font-serif-jp text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
          よくある質問
        </h1>
        <p className="mt-6 max-w-155 text-sm leading-8 text-[#647069] sm:text-base">
          つみほんの利用方法や、本棚の扱いについてよくいただく質問をまとめました。
        </p>

        <section className="mt-14 border-y border-[#293630]/12" aria-label="よくある質問一覧">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group border-b border-[#293630]/12 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left font-serif-jp text-lg font-medium leading-7 marker:hidden sm:px-2 sm:py-7 sm:text-xl">
                <span>{question}</span>
                <span
                  className="relative size-5 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-5 before:bg-[#60736a] after:absolute after:left-1/2 after:top-0 after:h-5 after:w-px after:bg-[#60736a] after:transition-transform group-open:after:scale-y-0"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-170 pb-7 text-sm leading-8 text-[#647069] sm:px-2 sm:pb-8 sm:text-base">
                {answer}
              </p>
            </details>
          ))}
        </section>

        <section className="mt-14 border border-[#293630]/12 bg-[#eeece5] p-6 sm:mt-18 sm:p-8">
          <p className="font-serif-jp text-xl font-medium">解決しない場合は</p>
          <p className="mt-3 text-sm leading-7 text-[#647069]">
            お問い合わせからご連絡ください。内容を確認のうえ、お返事します。
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#60736a] bg-[#f7f5f0] px-4 text-xs font-medium text-[#40584e] transition hover:bg-white"
          >
            お問い合わせへ
            <RiArrowRightLine className="text-base" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
