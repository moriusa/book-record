import type { Metadata } from "next";
import Link from "next/link";
import { RiExternalLinkLine, RiQuestionAnswerLine } from "react-icons/ri";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "つみほんへのお問い合わせ窓口です。",
  alternates: { canonical: "/contact" },
};

const googleFormEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_EMBED_URL;

export default function ContactPage() {
  return (
    <LegalPageLayout
      illustration="/legal/contact-letter.png"
      title="お問い合わせ"
      description="ご意見、ご要望、不具合のご報告などをお寄せください。内容を確認のうえ、必要に応じてご返信します。"
    >
      <section aria-labelledby="contact-form-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <h2
            id="contact-form-heading"
            className="font-serif-jp text-xl font-medium sm:text-2xl"
          >
            お問い合わせフォーム
          </h2>
          {googleFormEmbedUrl && (
            <a
              href={googleFormEmbedUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
            >
              フォームを別タブで開く
              <RiExternalLinkLine aria-hidden="true" />
            </a>
          )}
        </div>
        {googleFormEmbedUrl ? (
          <>
            <p className="mb-4 text-sm leading-6 text-[#526158]">
              送信内容は Google フォームで取り扱います。詳しくは
              <Link
                href="/privacy"
                className="text-[#43584e] underline underline-offset-4"
              >
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
            <div className="overflow-hidden rounded-xl border border-[#293630]/12 bg-white">
              <iframe
                src={googleFormEmbedUrl}
                title="つみほん お問い合わせフォーム"
                className="block h-325 w-full border-0 sm:h-262.5"
                loading="lazy"
              >
                読み込んでいます…
              </iframe>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-[#293630]/12 bg-[#eeece5] p-4 sm:p-6">
            <RiQuestionAnswerLine
              className="shrink-0 text-xl text-[#60736a]"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-[#526158]">
              お問い合わせフォームを準備中です。
            </p>
          </div>
        )}
      </section>
      <Link
        href="/faq"
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline underline-offset-4"
      >
        <RiQuestionAnswerLine aria-hidden="true" />
        よくある質問を見る
      </Link>
    </LegalPageLayout>
  );
}
