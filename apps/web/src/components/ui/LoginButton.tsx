"use client";

import { useState } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import Image from "next/image";
import { createPortal } from "react-dom";

type Props = {
  label?: string;
  className?: string;
};

export default function LoginButton({ label = "ログイン", className }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleGoogleLogin = async () => {
    await signInWithRedirect({
      provider: "Google",
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ??
          "rounded-md bg-[#344941] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#263a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2"
        }
      >
        {label}
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e2b26]/45 p-5 backdrop-blur-[3px]"
            role="dialog"
            aria-modal="true"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="w-full max-w-102.5 border border-[#293630]/10 bg-[#f7f5ef] p-7 shadow-[0_24px_60px_rgb(43_56_50/20%)] sm:p-9"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[10px] tracking-[0.18em] text-[#7c8982]">
                WELCOME
              </p>
              <h2 className="mt-2 font-serif-jp text-2xl font-medium text-[#293630]">
                本棚をはじめる
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6d7872]">
                Googleアカウントでログインすると、あなたの本棚を作成できます。
              </p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-md border border-[#293630]/15 bg-white px-5 py-3.5 text-sm text-[#405048] transition-colors hover:bg-[#f3f1eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a]"
              >
                <Image
                  src="/google_logo.svg"
                  alt="Google"
                  width={22}
                  height={20}
                />
                Googleでログイン
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-3 w-full rounded-md px-4 py-2.5 text-xs text-[#748078] transition hover:bg-[#eeece5] hover:text-[#293630]"
              >
                閉じる
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
