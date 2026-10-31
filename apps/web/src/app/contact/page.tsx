import type { Metadata } from "next";
import { RiExternalLinkLine, RiQuestionAnswerLine } from "react-icons/ri";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "つみほんへのお問い合わせ窓口です。",
};

const googleFormEmbedUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_EMBED_URL;

export default function ContactPage() {
  return (
    <LegalPageLayout
      eyebrow="CONTACT"
      title="お問い合わせ"
      description="ご意見、ご要望、不具合のご報告などをお寄せください。内容を確認のうえ、必要に応じてご返信します。"
    >
      <section className="py-10 sm:py-14">
        {googleFormEmbedUrl ? (
          <div className="overflow-hidden border border-[#293630]/10 bg-white shadow-[0_16px_40px_rgba(43,56,50,0.06)]">
            <iframe
              src={googleFormEmbedUrl}
              title="つみほん お問い合わせフォーム"
              className="block h-325 w-full border-0 sm:h-262.5"
              loading="lazy"
            >
              読み込んでいます…
            </iframe>
          </div>
        ) : (
          <div className="border border-[#293630]/10 bg-[#eeece5] p-6 sm:p-9">
            <RiQuestionAnswerLine
              className="text-2xl text-[#60736a]"
              aria-hidden="true"
            />
            <h2 className="mt-6 font-serif-jp text-2xl font-medium">
              お問い合わせフォームを準備中です
            </h2>
            <p className="mt-4 max-w-150 text-sm leading-8 text-[#647069] sm:text-base">
              もうしばらくお待ちください。
            </p>
            <span className="mt-7 inline-flex items-center gap-2 text-sm text-[#75817a]">
              <RiExternalLinkLine aria-hidden="true" />
              フォーム公開後、この場所から送信できます
            </span>
          </div>
        )}
        <p className="mt-7 text-xs leading-6 text-[#7a857f]">
          個人情報の取扱いについては、プライバシーポリシーをご確認ください。Google
          フォームを通じて送信された内容は、Google
          のサービス上でも取り扱われます。
        </p>
      </section>
    </LegalPageLayout>
  );
}
