"use client";

import { useState } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import Image from "next/image";

export default function LoginButton() {
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
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        ログイン
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-6 text-center text-xl font-bold">ログイン</h2>
            <div className="flex justify-center gap-2 w-full rounded-md border px-4 py-3">
              <Image
                src="/google_logo.svg"
                alt="Google"
                width={22}
                height={20}
              />
              <button type="button" onClick={handleGoogleLogin} className="">
                Googleでログイン
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full px-4 py-2 text-gray-500"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
