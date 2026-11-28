import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiSubtractLine,
} from "react-icons/ri";

const faqTopics = [
  { id: "getting-started", title: "利用・ログイン" },
  { id: "adding-books", title: "本の登録" },
  { id: "reading-records", title: "本棚・読書記録" },
  { id: "lists-and-sharing", title: "リスト・本10選" },
] as const;

const faqs: {
  topic: (typeof faqTopics)[number]["id"];
  question: string;
  answer: string;
  guide?: { slug: string; label: string };
}[] = [
  {
    topic: "getting-started",
    question: "つみほんとはどんなサービスですか？",
    answer:
      "つみほんは、読みたい本・読んでいる本・読み終えた本を、自分のための本棚に記録できる無料のWebアプリです。人に見せるためのSNSではなく、自分の読書の時間を整理することを大切にしています。",
  },
  {
    topic: "getting-started",
    question: "利用料金はかかりますか？",
    answer:
      "つみほんは無料で利用できます。本棚の作成や読書記録の登録に料金はかかりません。",
  },
  {
    topic: "getting-started",
    question: "登録しなくても本を検索できますか？",
    answer:
      "はい。本の検索や書籍情報の閲覧は、登録なしで試せます。本を自分の本棚に追加したり、読書記録を残したりするには、Googleアカウントでのログインが必要です。",
  },
  {
    topic: "reading-records",
    question: "本棚や読書記録は公開されますか？",
    answer:
      "いいえ。つみほんにはSNS機能がなく、登録した本・読書ステータス・評価・メモは他の利用者には公開されません。",
  },
  {
    topic: "adding-books",
    question: "本はどのように登録できますか？",
    answer:
      "タイトル・著者名・ISBNから検索して追加できます。手元に本がある場合は、ISBNバーコードを読み取ってまとめて登録することもできます。",
  },
  {
    topic: "adding-books",
    question: "検索で見つからない本も登録できますか？",
    answer:
      "はい。同人誌や自費出版など、検索で見つからない本は手動で登録できます。タイトルを入力すれば本棚へ追加でき、著者名や出版社・頒布元も必要に応じて記録できます。",
  },
  {
    topic: "reading-records",
    question: "どんな読書記録を残せますか？",
    answer:
      "「読みたい」「読んでいる」「読み終わった」「積読」の読書ステータスに加え、評価や自分だけのメモを残せます。あとから本棚内を検索したり、表示順を変えたりして振り返ることもできます。",
  },
  {
    topic: "reading-records",
    question: "本棚から本を削除できますか？",
    answer:
      "はい。本棚の編集画面または本の詳細画面から削除できます。削除すると、その本に記録した読書ステータス・評価・メモも削除されます。",
  },
  {
    topic: "getting-started",
    question: "スマホとPCで同じ本棚を使えますか？",
    answer:
      "はい。スマホでもPCでも、同じGoogleアカウントでログインすると同じ本棚と読書記録を確認できます。ログアウトしても、登録した本や記録は残ります。",
  },
  {
    topic: "adding-books",
    question: "バーコードを読み取れないときはどうすればいいですか？",
    answer:
      "カメラが起動しない場合は、ブラウザの設定でカメラの利用を許可してください。読み取りにくい場合は、明るい場所で裏表紙のISBNバーコードを枠内に合わせます。読み取れないときは「本を探す」でISBNを入力して検索できます。",
    guide: {
      slug: "barcode-book-registration",
      label: "バーコード登録の手順を見る",
    },
  },
  {
    topic: "adding-books",
    question: "検索結果に「登録済み」と表示されるのはなぜですか？",
    answer:
      "その本はすでに自分の本棚に入っています。読書ステータスやメモを変更したい場合は、本棚からその本を開いて記録を編集できます。",
  },
  {
    topic: "reading-records",
    question: "登録したあとで読書ステータスやメモを変えられますか？",
    answer:
      "はい。本棚や書籍詳細から編集画面を開くと、読書ステータス・評価・メモを変更できます。読み始めたときや読み終えたときに更新して、読書の進み具合を記録できます。",
    guide: {
      slug: "edit-reading-record",
      label: "読書記録を編集する手順を見る",
    },
  },
  {
    topic: "reading-records",
    question: "本棚の中から特定の本を探したり、並び替えたりできますか？",
    answer:
      "本棚の虫眼鏡から、登録した本をタイトル・著者名・ISBNなどで検索できます。読書ステータスでも絞り込めます。「表示設定」では、登録順・タイトル順・評価順・発売日順に並び替えられます。",
  },
  {
    topic: "reading-records",
    question: "本棚をリスト表示にできますか？",
    answer:
      "はい。本棚の表示切り替えボタンで、表紙が並ぶグリッド表示と、タイトルや著者が見えるリスト表示を選べます。選んだ表示形式は、同じブラウザで本棚を開き直したときも引き継がれます。",
  },
  {
    topic: "lists-and-sharing",
    question: "お気に入りやテーマ別のリストは作れますか？",
    answer:
      "はい。本の詳細からお気に入りに追加できます。テーマ別にまとめたい場合は、本棚の「リスト」で名前を付けて作成できます。同じ本を複数のリストに入れることができ、リストを削除しても本棚の本や読書記録は残ります。",
    guide: {
      slug: "organize-books-with-lists",
      label: "お気に入りやリストの使い方を見る",
    },
  },
  {
    topic: "lists-and-sharing",
    question: "「名刺代わりの本10選」とは何ですか？",
    answer:
      "本棚から印象に残った本を10冊選ぶ機能です。本の詳細の「10選に追加」から選び、10冊そろったら本棚の「本10選」で表紙をまとめた画像を保存できます。保存した画像はSNSなどで共有できます。",
    guide: {
      slug: "create-book-ten",
      label: "本10選をつくる手順を見る",
    },
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
    "つみほんの料金やログイン、本の登録、読書記録、お気に入り・リストや本10選について、よくある質問にお答えします。",
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
      <div className="mx-auto max-w-220 px-5 pb-20 pt-7 sm:px-8 sm:pb-28 sm:pt-12">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 sm:gap-8 sm:py-6">
          <div>
            <h1 className="font-serif-jp text-[clamp(1.5rem,6vw,2rem)] font-medium leading-snug tracking-[-0.045em] sm:text-[42px]">
              よくある質問
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#526158] sm:text-base sm:leading-7">
              料金やログイン、本の登録、読書記録についてお答えします。
            </p>
          </div>
          <Image
            src="/loose-question.png"
            alt=""
            width={168}
            height={168}
            sizes="(min-width: 640px) 168px, 26vw"
            className="size-[clamp(80px,26vw,112px)] object-contain sm:size-42"
          />
        </header>

        <nav
          aria-label="質問のジャンル"
          className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 sm:flex sm:flex-wrap sm:gap-x-6"
        >
          {faqTopics.map(({ id, title }) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex min-h-11 items-center gap-1 justify-self-start text-sm text-[#43584e] underline decoration-[#43584e]/40 underline-offset-4 hover:decoration-current"
            >
              {title}
              <RiArrowDownSLine aria-hidden="true" />
            </a>
          ))}
        </nav>

        {faqTopics.map(({ id, title }) => (
          <section key={id} className="mt-8 sm:mt-10" aria-labelledby={id}>
            <h2
              id={id}
              className="mb-3 scroll-mt-24 font-serif-jp text-xl font-medium sm:text-2xl"
            >
              {title}
            </h2>
            <div className="divide-y divide-[#344941]/15 border-y border-[#344941]/20">
              {faqs
                .filter(({ topic }) => topic === id)
                .map(({ question, answer, guide }) => (
                  <details key={question} className="group">
                    <summary className="relative flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-2 py-4 text-left font-serif-jp text-base font-medium leading-relaxed marker:hidden hover:bg-[#344941]/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#60736a] group-open:text-[#344941] sm:py-5 sm:text-lg [&::-webkit-details-marker]:hidden">
                      <span>{question}</span>
                      <span
                        aria-hidden="true"
                        className="grid size-6 shrink-0 place-items-center text-lg text-[#43584e]"
                      >
                        <RiAddLine className="group-open:hidden" />
                        <RiSubtractLine className="hidden group-open:block" />
                      </span>
                    </summary>
                    <div className="px-2 pb-5 sm:pb-6">
                      <div className="max-w-170 text-sm leading-7 text-[#526158] sm:text-base sm:leading-8">
                        <p>{answer}</p>
                        {guide && (
                          <Link
                            href={`/guides/${guide.slug}`}
                            className="mt-1 inline-flex min-h-11 items-center gap-1.5 font-medium text-[#43584e] underline underline-offset-4 hover:text-[#293630]"
                          >
                            {guide.label}
                            <RiArrowRightLine
                              className="shrink-0"
                              aria-hidden="true"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  </details>
                ))}
            </div>
          </section>
        ))}

        <section
          aria-labelledby="faq-contact"
          className="mt-9 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border border-[#344941]/15 bg-[#eeece5] p-4 sm:mt-12 sm:p-6"
        >
          <div>
            <h2 id="faq-contact" className="font-serif-jp text-lg font-medium">
              解決しない場合は
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#526158]">
              ご不明な点は、お問い合わせからご連絡ください。
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-[#60736a] bg-[#f7f5f0] px-4 text-sm font-medium text-[#43584e] transition-colors hover:bg-white"
          >
            お問い合わせへ
            <RiArrowRightLine className="text-base" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
