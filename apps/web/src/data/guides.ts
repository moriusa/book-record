export type Guide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  sections: { heading: string; body: string }[];
};

export const guides: Guide[] = [
  {
    slug: "tsundoku-management",
    eyebrow: "READING GUIDE",
    title: "積読を無理なく整理する方法",
    description:
      "読みたい本をため込みすぎず、今の気分に合う一冊を選ぶための、つみほんの使い方を紹介します。",
    lead: "気になる本を見つけたときに、すぐ読み始めなくても大丈夫です。まずは本棚に置き、読みたい気持ちを見失わないことから始めましょう。",
    sections: [
      {
        heading: "気になった本は、まず「読みたい」に置く",
        body: "書店やSNSで見つけた本を、その場で本棚へ登録します。読み終える期限を決めなくても、読みたい理由を残しておくと後から選びやすくなります。",
      },
      {
        heading: "今読む本だけを「読んでいる」にする",
        body: "本棚全体を片づけようとせず、今手に取っている一冊だけに目を向けます。読みかけの本も、気軽に状態を変えられます。",
      },
      {
        heading: "読了後にひとこと残す",
        body: "感想を長く書く必要はありません。心に残った場面や、そのときの気分を一文だけ残すと、後から本棚を見返す時間が豊かになります。",
      },
    ],
  },
  {
    slug: "private-reading-log",
    eyebrow: "READING GUIDE",
    title: "人に見せない読書記録の続け方",
    description:
      "SNSに投稿しなくても続けられる、自分のための読書記録のつくり方を紹介します。",
    lead: "読書の記録は、誰かに評価してもらうためのものではありません。読んだときの自分にあとで会いにいける、小さな手がかりになります。",
    sections: [
      {
        heading: "公開を前提にしない",
        body: "整った感想や、役に立つ言葉である必要はありません。読み終えられなかったことや、うまく言えない気持ちも、そのまま記録できます。",
      },
      {
        heading: "記録の単位を小さくする",
        body: "ページ数、気になった一文、その日のひとこと。続けられるサイズを選ぶと、記録は生活の中に自然になじみます。",
      },
      {
        heading: "本棚をときどき見返す",
        body: "並んだ本を見返すと、読書の量だけでなく、その時期に何に惹かれていたかも見えてきます。",
      },
    ],
  },
  {
    slug: "barcode-book-registration",
    eyebrow: "FEATURE GUIDE",
    title: "バーコードで本をすばやく登録する",
    description:
      "本のISBNバーコードを使って、つみほんに書籍を登録する手順を紹介します。",
    lead: "本棚の前で一冊ずつタイトルを入力する必要はありません。バーコードを読み取れば、気になる本をまとめて本棚に迎えられます。",
    sections: [
      {
        heading: "「本を探す」を開く",
        body: "画面上部の「本を探す」から、バーコード読み取りを選びます。はじめて使う場合は、カメラの利用を許可してください。",
      },
      {
        heading: "本の裏表紙にカメラを向ける",
        body: "ISBNのバーコードが枠に収まるように、明るい場所でゆっくりかざします。読み取り後に書籍情報を確認できます。",
      },
      {
        heading: "本棚に追加して、あとで整える",
        body: "まずは登録だけ済ませて、読書の状態やメモはあとから追加できます。気になる本を見逃さないことを優先しましょう。",
      },
    ],
  },
];

export const getGuide = (slug: string) =>
  guides.find((guide) => guide.slug === slug);
