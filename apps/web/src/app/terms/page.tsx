import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "利用規約",
  description: "つみほんの利用規約です。",
};

const sections = [
  {
    title: "1. はじめに",
    body: "この利用規約（以下「本規約」）は、つみほん（以下「本サービス」）の利用条件を定めるものです。利用者は、本規約に同意したうえで本サービスを利用するものとします。",
  },
  {
    title: "2. アカウント",
    body: "本サービスの一部の機能は、Google アカウントによるログインが必要です。利用者は、自己の責任においてアカウントを管理し、第三者に利用させないものとします。",
  },
  {
    title: "3. 登録情報",
    body: "利用者は、自身の読書記録として書籍情報、読書状況、評価およびメモを登録できます。登録内容については、利用者が責任を負うものとします。",
  },
  {
    title: "4. 禁止事項",
    body: "法令または公序良俗に反する行為、本サービスの運営を妨げる行為、不正アクセス、他者の権利または利益を侵害する行為、その他運営者が不適切と判断する行為を禁止します。",
  },
  {
    title: "5. サービスの変更・停止",
    body: "運営者は、必要に応じて本サービスの内容を変更し、または提供を停止することがあります。可能な限り事前にお知らせしますが、緊急の場合はこの限りではありません。",
  },
  {
    title: "6. 知的財産権",
    body: "本サービスに含まれる名称、デザイン、プログラムその他のコンテンツに関する権利は、運営者または正当な権利者に帰属します。書影や書誌情報など、外部サービスから取得する情報は各権利者に帰属します。",
  },
  {
    title: "7. 免責事項",
    body: "運営者は、本サービスの継続性、完全性、正確性または特定目的への適合性を保証しません。本サービスの利用により生じた損害について、運営者の故意または重過失による場合を除き、責任を負いません。",
  },
  {
    title: "8. 規約の変更",
    body: "運営者は、必要に応じて本規約を変更できます。変更後の規約は、本サービス上に掲載した時点から効力を生じます。",
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="TERMS OF SERVICE"
      title="利用規約"
      description="つみほんを心地よく、安心して使っていただくための約束です。ご利用の前にご確認ください。"
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
