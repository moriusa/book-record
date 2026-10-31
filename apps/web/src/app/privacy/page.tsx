import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "つみほんのプライバシーポリシーです。",
};

const sections = [
  {
    title: "1. 取得する情報",
    body: "本サービスでは、Google アカウントによる認証に伴い、ユーザーを識別するための情報を取得します。また、登録された書籍、読書状況、評価、メモなどの本棚データを保存します。",
  },
  {
    title: "2. 利用目的",
    body: "取得した情報は、アカウントの認証、本棚機能の提供、不具合への対応、本サービスの改善および利用状況の分析のために利用します。",
  },
  {
    title: "3. アクセス解析",
    body: "本サービスでは、利用状況を把握し改善に役立てるため、Google Analytics を利用します。Google Analytics は Cookie 等を用いて情報を収集することがあります。収集される情報の取扱いについては、Google のプライバシーポリシーもご確認ください。",
  },
  {
    title: "4. 第三者提供",
    body: "法令に基づく場合を除き、取得した個人情報を本人の同意なく第三者へ提供しません。ただし、認証、インフラ運用、アクセス解析、お問い合わせフォームの運用など、本サービスの提供に必要な範囲で外部サービスを利用することがあります。お問い合わせフォームには Google フォームを利用し、送信された内容は Google のサービス上でも取り扱われます。",
  },
  {
    title: "5. 安全管理",
    body: "取得した情報の漏えい、滅失または毀損を防ぐため、合理的な安全管理措置を講じます。",
  },
  {
    title: "6. 開示・訂正・削除",
    body: "ご自身の情報の取扱いに関するお問い合わせは、お問い合わせ窓口までご連絡ください。内容を確認のうえ、法令に従って対応します。",
  },
  {
    title: "7. 改定",
    body: "本ポリシーは、法令やサービス内容の変更に応じて改定することがあります。重要な変更は、本サービス上でお知らせします。",
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="PRIVACY POLICY"
      title="プライバシーポリシー"
      description="つみほんは、読書の記録を安心して残せる場所でありたいと考えています。ここでは、お預かりする情報とその取扱いについて説明します。"
    >
      <div className="divide-y divide-[#293630]/12">
        {sections.map(({ title, body }) => (
          <section key={title} className="py-8 sm:py-10">
            <h2 className="font-serif-jp text-xl font-medium sm:text-2xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#647069] sm:text-base">
              {body}
            </p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-xs text-[#7a857f]">最終更新日：2026年11月1日</p>
    </LegalPageLayout>
  );
}
