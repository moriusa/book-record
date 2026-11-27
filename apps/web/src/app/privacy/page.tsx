import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, {
  type LegalSection,
} from "@/components/legal/LegalDocument";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "つみほんのプライバシーポリシーです。",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "information",
    title: "取得する情報",
    paragraphs: [
      "つみほん（以下「本サービス」）は、Google アカウントでのログインに伴い、アカウントの識別子やメールアドレスを取得します。認証には Amazon Cognito を利用します。",
      "本棚に登録した書籍情報、読書状況、評価、メモ、読了日、お気に入り、リスト、本10選などを保存します。",
      "お問い合わせをいただいた場合は、送信された内容と、入力された返信先などの情報を取得します。",
    ],
  },
  {
    id: "purposes",
    title: "利用目的",
    paragraphs: [
      "取得した情報は、本人の認証とアカウントの管理、本棚や読書記録などの機能の提供、お問い合わせへの回答、不具合や不正利用への対応、利用状況の分析とサービスの改善に利用します。",
    ],
  },
  {
    id: "bookshelf-and-camera",
    title: "本棚の公開範囲とカメラの利用",
    paragraphs: [
      "本棚や読書記録は、他の利用者に公開されません。「本10選」で作成した画像は、利用者自身が保存し、端末の機能などを使って共有できます。共有先では、画像が第三者に閲覧されることがあります。",
      "バーコードの読み取りを開始すると、許可を得たうえで端末のカメラを使用します。映像はブラウザ内で読み取りに使い、サーバーには送信しません。読み取った ISBN は書籍の検索に使用します。",
    ],
  },
  {
    id: "analytics",
    title: "アクセス解析とブラウザへの保存",
    paragraphs: [
      "サービスの利用状況を把握するために Google アナリティクスを利用します。ページの閲覧や本棚への追加などの操作が計測され、Cookie などが使われることがあります。本棚の表示形式などの設定は、ご利用のブラウザ内に保存されます。",
      <>
        Google による情報の取扱いは、
        <a href="https://policies.google.com/privacy?hl=ja">
          Google のプライバシーポリシー
        </a>
        をご確認ください。計測を無効にしたい場合は、対応ブラウザで
        <a href="https://tools.google.com/dlpage/gaoptout?hl=ja">
          Google アナリティクス オプトアウト アドオン
        </a>
        を利用できます。
      </>,
    ],
  },
  {
    id: "external-services",
    title: "外部サービスと第三者提供",
    paragraphs: [
      "本サービスの運営に必要な範囲で、認証、サーバー・データベースの運用、アクセス解析などの外部サービスを利用します。書籍検索では、入力されたタイトル・著者名・ISBN などの検索条件を楽天の書籍検索サービスに送信することがあります。お問い合わせフォームに入力して送信した内容は、Google フォーム上でも取り扱われます。",
      "ブログには楽天アフィリエイトの広告が表示される場合があります。また、書籍詳細などから外部サイトに移動すると、移動先のプライバシーポリシーが適用されます。",
      "運営者は、本人の同意がある場合や、法令に基づく場合など法令で認められる場合を除き、個人データを第三者に提供しません。",
    ],
  },
  {
    id: "security",
    title: "安全管理",
    paragraphs: [
      "本棚データの閲覧や変更には認証を求め、利用者ごとにアクセスできる範囲を制限します。取得した情報の漏えい、滅失または毀損を防ぐため、適切な安全管理措置を講じます。",
    ],
  },
  {
    id: "requests",
    title: "開示・訂正などの請求とお問い合わせ",
    paragraphs: [
      <>
        ご自身の情報の開示、訂正、利用停止、消去などの請求や、個人情報の取扱いに関するご相談・苦情は、
        <Link href="/contact">お問い合わせ窓口</Link>
        へご連絡ください。請求の内容に応じてご本人であることを確認したうえで、法令に従って対応します。
      </>,
    ],
  },
  {
    id: "changes",
    title: "ポリシーの改定",
    paragraphs: [
      "本ポリシーは、法令やサービス内容の変更に応じて改定することがあります。重要な変更は、本サービス上でお知らせします。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      illustration="/legal/privacy-lock.png"
      title="プライバシーポリシー"
      description="つみほんが取得する情報と、その利用・管理方法について説明します。"
    >
      <LegalDocument sections={sections} updatedAt="2026-11-27" />
    </LegalPageLayout>
  );
}
