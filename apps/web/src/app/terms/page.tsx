import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, {
  type LegalSection,
} from "@/components/legal/LegalDocument";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "利用規約",
  description: "つみほんの利用規約です。",
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "本規約の適用",
    paragraphs: [
      "この利用規約（以下「本規約」）は、つみほん（以下「本サービス」）の利用条件を定めるものです。利用者は、本規約に同意したうえで本サービスを利用するものとします。",
    ],
  },
  {
    id: "accounts",
    title: "アカウント",
    paragraphs: [
      "書籍の検索や書籍情報の閲覧は、ログインせずに利用できます。本棚への登録や読書記録の保存など、一部の機能には Google アカウントでのログインが必要です。",
      "利用者は、自己の責任においてアカウントを管理し、第三者に利用させないものとします。",
    ],
  },
  {
    id: "user-content",
    title: "登録内容と画像の共有",
    paragraphs: [
      "利用者は、自身の読書記録として書籍情報、読書状況、評価、メモなどを登録できます。登録する内容については、利用者が責任を負います。",
      "「本10選」で作成した画像を外部サービスへ共有する場合は、他者の権利に配慮し、共有先の利用条件に従ってください。",
    ],
  },
  {
    id: "prohibited-actions",
    title: "禁止事項",
    paragraphs: [
      "法令または公序良俗に反する行為、不正アクセス、第三者へのなりすまし、他者の権利や利益を侵害する行為、本サービスに過度な負荷をかけるなど運営を妨げる行為を禁止します。",
    ],
  },
  {
    id: "availability",
    title: "サービスの変更・停止",
    paragraphs: [
      "運営者は、保守、障害への対応、外部サービスの変更などにより、本サービスの内容を変更し、または提供を停止することがあります。可能な限り事前にお知らせしますが、緊急の場合はこの限りではありません。",
    ],
  },
  {
    id: "rights",
    title: "知的財産権",
    paragraphs: [
      "本サービスの名称、デザイン、プログラムなどに関する権利は、運営者または正当な権利者に帰属します。書影や書誌情報などの外部コンテンツに関する権利は、それぞれの権利者に帰属します。",
    ],
  },
  {
    id: "external-links",
    title: "外部サイトと広告",
    paragraphs: [
      "本サービスには、外部サイトへのリンクやアフィリエイト広告が含まれます。リンクを経由した購入などにより、運営者が報酬を受け取る場合があります。外部サイトでの購入や利用には、当該サイトの取引条件や利用規約が適用されます。",
    ],
  },
  {
    id: "liability",
    title: "書誌情報と責任の範囲",
    paragraphs: [
      "書誌情報には、取得元の更新時期などにより差異が生じることがあります。購入などの判断に必要な情報は、出版社や販売先でもご確認ください。",
      "本サービスに関して運営者が損害賠償責任を負う場合は、消費者契約法その他の適用される法令に従います。",
    ],
  },
  {
    id: "privacy",
    title: "個人情報の取扱い",
    paragraphs: [
      <>
        個人情報は、<Link href="/privacy">プライバシーポリシー</Link>
        に従って取り扱います。
      </>,
    ],
  },
  {
    id: "changes",
    title: "規約の変更",
    paragraphs: [
      "運営者は、法令で認められる範囲で本規約を変更することがあります。変更する場合は、変更内容と効力発生日を、効力が生じる前に本サービス上でお知らせします。",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      illustration="/legal/terms-contract.png"
      title="利用規約"
      description="つみほんの利用条件と、登録した内容や外部サービスの取扱いについて説明します。"
    >
      <LegalDocument sections={sections} updatedAt="2026-11-27" />
    </LegalPageLayout>
  );
}
