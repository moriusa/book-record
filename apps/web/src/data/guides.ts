export type Guide = {
  slug: string;
  icon: "search" | "edit" | "barcode" | "bookTen" | "manual" | "list";
  eyebrow: string;
  title: string;
  mobileTitleLines: string[];
  description: string;
  lead: string;
  sections: {
    heading: string;
    body: string;
    image?: { src: string; alt: string; width: number; height: number };
  }[];
};

export const guides: Guide[] = [
  {
    slug: "add-books-manually",
    icon: "manual",
    eyebrow: "MANUAL ENTRY",
    title: "本を手動で登録する",
    mobileTitleLines: ["本を手動で", "登録する"],
    description:
      "同人誌や自費出版など、検索で見つからない本を手動で本棚に追加する方法を紹介します。",
    lead: "検索で見つからない本も、自分の本棚に残せます。ISBNのない同人誌や自費出版の本も登録できます。",
    sections: [
      {
        heading: "「本を探す」から手動登録を開く",
        body: "「本を探す」画面の「手動で追加」を選びます。検索結果が見つからなかった場合も、表示される手動登録のボタンから進めます。本棚への登録にはログインが必要です。",
      },
      {
        heading: "本の情報と読書状態を入力する",
        body: "タイトルを入力し、必要に応じて著者・サークル名、出版社・頒布元などを記入します。読書の状態を選び、評価やメモも残せます。",
      },
      {
        heading: "本棚に追加して確認する",
        body: "「本棚に追加」を押すと、自分の本棚に登録されます。本棚から詳細を開き、読書記録を確認・編集できます。表紙画像や外部リンクは登録されません。",
      },
    ],
  },
  {
    slug: "organize-books-with-lists",
    icon: "list",
    eyebrow: "MY LISTS",
    title: "お気に入りやリストで本をまとめる",
    mobileTitleLines: ["お気に入りやリストで", "本をまとめる"],
    description:
      "お気に入りへの追加や、名前を付けたリストで本棚の本を整理する方法を紹介します。",
    lead: "お気に入りの本や、同じテーマの本を自分だけのリストにまとめられます。ひとつの本を複数のリストに追加することもできます。",
    sections: [
      {
        heading: "リストを作成する",
        body: "本棚の「リスト」を開き、「新しいリストを作る」を選びます。リスト名を入力して「作成する」を押すと、一覧に追加されます。",
      },
      {
        heading: "本をお気に入りやリストに追加する",
        body: "本棚に登録した本の詳細で「お気に入りに追加」を選ぶと、お気に入りに追加できます。「リストに追加」からは、追加したいリストを選べます。",
      },
      {
        heading: "リストを確認・整理する",
        body: "本棚の「リスト」から、お気に入りや作成したリストを開けます。各本の三点メニューから取り外せます。リストの名前変更や削除もできますが、リストを削除しても本棚の本や読書記録は残ります。",
      },
    ],
  },
  {
    slug: "find-and-add-books",
    icon: "search",
    eyebrow: "GETTING STARTED",
    title: "本を探して本棚に追加する",
    mobileTitleLines: ["本を探して", "本棚に追加する"],
    description:
      "タイトル・著者名・ISBNから本を探し、自分の本棚に登録する手順を紹介します。",
    lead: "気になる本を見つけたら、まずは本棚に追加しましょう。登録時に読書の状態も選べるため、読みたい本と読んでいる本を最初から整理できます。",
    sections: [
      {
        heading: "「本を探す」を開く",
        body: "画面上部の「本を探す」を選びます。タイトル、著者名、ISBNのいずれかを入力して、読みたい本を検索できます。",
        image: {
          src: "/guides/getting_started/step-1.JPG",
          width: 1141,
          height: 1501,
          alt: "本を探す画面",
        },
      },
      {
        heading: "書籍情報を確認する",
        body: "検索結果から本を選ぶと、作品紹介や出版社、発売日、ISBNを確認できます。内容を確かめてから本棚に追加できます。",
        image: {
          src: "/guides/getting_started/step-2.JPG",
          width: 1170,
          height: 2110,
          alt: "書籍情報を確認する画面",
        },
      },
      {
        heading: "読書の状態を選んで追加する",
        body: "「読みたい」「読んでいる」「読み終わった」「積読」から今の状態を選んで登録します。あとから本棚で変更することもできます。",
        image: {
          src: "/guides/getting_started/step-3.JPG",
          width: 1170,
          height: 1904,
          alt: "読書の状態を選んで追加する画面",
        },
      },
    ],
  },
  {
    slug: "edit-reading-record",
    icon: "edit",
    eyebrow: "EDIT READING RECORD",
    title: "読書記録を編集する",
    mobileTitleLines: ["読書記録を編集する"],
    description:
      "読書の状態、評価、メモを編集して、読んだときの気持ちを記録する方法を紹介します。",
    lead: "本を読んでいる途中の気づきや、読み終えたときの感想を残しておくと、あとから自分の読書の時間を振り返りやすくなります。",
    sections: [
      {
        heading: "本棚を開く",
        body: "ログイン後、画面上部の「本棚」から登録済みの本を確認できます。読みたい本、読んでいる本、読み終わった本、積読の冊数もひと目で分かります。",
        image: {
          src: "/guides/edit_reading_record/step-1.JPG",
          width: 1170,
          height: 2153,
          alt: "つみほんの本棚画面",
        },
      },
      {
        heading: "本の記録を編集する",
        body: "本棚や書籍詳細から記録を開くと、読書の状態、評価、メモを編集できます。読み終えたときの感想や、あとで読み返したいことを残せます。",
        image: {
          src: "/guides/edit_reading_record/step-2.JPG",
          width: 1142,
          height: 1148,
          alt: "読書記録を編集する画面",
        },
      },
      {
        heading: "読んだ記録を残す",
        body: "読み始めたら「読んでいる」、読了したら「読み終わった」へ変更できます。評価やメモも添えて、そのときの読書体験を残しましょう。",
        image: {
          src: "/guides/edit_reading_record/step-3.JPG",
          width: 1170,
          height: 2113,
          alt: "読書の状態を編集する画面",
        },
      },
    ],
  },
  {
    slug: "barcode-book-registration",
    icon: "barcode",
    eyebrow: "BARCODE SCANNER",
    title: "バーコードで本をまとめて登録する",
    mobileTitleLines: ["バーコードで本を", "まとめて登録する"],
    description:
      "本のISBNバーコードを使って、つみほんに書籍を登録する手順を紹介します。",
    lead: "本棚の前で一冊ずつタイトルを入力する必要はありません。ISBNバーコードを読み取れば、複数の本をまとめて本棚に追加できます。",
    sections: [
      {
        heading: "「本を探す」を開く",
        body: "画面上部の「本を探す」から、バーコード読み取りを選びます。はじめて使う場合は、カメラの利用を許可してください。",
        image: {
          src: "/guides/barcode_scanner/step-1.jpg",
          width: 1143,
          height: 1501,
          alt: "本を探す画面",
        },
      },
      {
        heading: "本の裏表紙にカメラを向ける",
        body: "ISBNバーコードが枠に収まるように、明るい場所でかざします。続けて複数冊を読み取ることもできます。",
        image: {
          src: "/guides/barcode_scanner/step-2.JPG",
          width: 1170,
          height: 1889,
          alt: "バーコード読み取り画面",
        },
      },
      {
        heading: "追加する本と状態を確認する",
        body: "読み取った本の情報を確認し、登録する本を選びます。まとめて追加する際の読書状態も選べます。",
        image: {
          src: "/guides/barcode_scanner/step-3.JPG",
          width: 1170,
          height: 2391,
          alt: "バーコード読み取り後登録画面",
        },
      },
    ],
  },
  {
    slug: "create-book-ten",
    icon: "bookTen",
    eyebrow: "BOOK TEN",
    title: "「名刺代わりの本10選」をつくる",
    mobileTitleLines: ["「名刺代わりの」", "本10選をつくる"],
    description:
      "本棚にある本から10冊を選び、振り返りや共有に使える画像をつくる方法を紹介します。",
    lead: "印象に残った本を10冊選ぶと、自分の読書を気軽に振り返れます。つみほんでは、選んだ本を一枚の画像として保存・共有できます。",
    sections: [
      {
        heading: "書籍詳細から「10選に追加」を選ぶ",
        body: "本棚に登録している本の詳細ページを開き、「10選に追加」を選びます。追加した本は、あとから入れ替えられます。",
        image: {
          src: "/guides/book_ten/step-1.JPG",
          width: 1170,
          height: 849,
          alt: "書籍詳細画面",
        },
      },
      {
        heading: "本棚の「本10選」を開く",
        body: "本棚にある「本10選」から、選んだ本の一覧を確認できます。10冊に満たない場合も、追加した本を確認できます。",
        image: {
          src: "/guides/book_ten/step-2.JPG",
          width: 1170,
          height: 2121,
          alt: "名刺代わりの本10選画面",
        },
      },
      {
        heading: "画像として保存・共有する",
        body: "10冊がそろったら、一覧ページから画像として保存できます。自分の読書の振り返りや、SNSでの共有に使えます。",
        image: {
          src: "/guides/book_ten/step-3.png",
          width: 1200,
          height: 630,
          alt: "出力した本10選の画像",
        },
      },
    ],
  },
];

export const getGuide = (slug: string) =>
  guides.find((guide) => guide.slug === slug);
