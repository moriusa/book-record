"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import LoginButton from "./LoginButton";
import { useAuth } from "../providers/AuthProvider";

type Props = {
  compact?: boolean;
};

export default function AuthButton({ compact = false }: Props) {
  const { user, isLoading, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const dialogOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLogoutDialogOpen) return;

    const updateDialogViewport = () => {
      const overlay = dialogOverlayRef.current;
      if (!overlay) return;

      const viewport = window.visualViewport;
      if (!viewport) {
        overlay.style.transform = "";
        overlay.style.width = "100vw";
        overlay.style.height = "100dvh";
        return;
      }

      overlay.style.transform = `translate(${viewport.offsetLeft}px, ${viewport.offsetTop}px)`;
      overlay.style.width = `${viewport.width}px`;
      overlay.style.height = `${viewport.height}px`;
    };

    updateDialogViewport();
    window.visualViewport?.addEventListener("resize", updateDialogViewport);
    window.visualViewport?.addEventListener("scroll", updateDialogViewport);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        updateDialogViewport,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        updateDialogViewport,
      );
    };
  }, [isLogoutDialogOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(false);

    try {
      await logout();
      setIsLogoutDialogOpen(false);
    } catch {
      setLogoutError(true);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (user) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setLogoutError(false);
            setIsLogoutDialogOpen(true);
          }}
          className={
            compact
              ? "flex size-9 items-center justify-center rounded-full border border-[#293630]/10 bg-[#eeece5] text-[#526159] transition hover:bg-[#e7e5de] hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:ml-2"
              : "rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          }
          aria-label={compact ? "ログアウト" : undefined}
          title={compact ? "ログアウト" : undefined}
        >
          {compact ? (
            <RiLogoutBoxRLine className="text-xl" aria-hidden="true" />
          ) : (
            "ログアウト"
          )}
        </button>

        {isLogoutDialogOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={dialogOverlayRef}
              className="fixed left-0 top-0 z-50 flex items-center justify-center bg-[#1e2b26]/45 p-5 backdrop-blur-[3px]"
              style={{ width: "100vw", height: "100dvh" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-dialog-title"
              onClick={() => {
                if (!isLoggingOut) setIsLogoutDialogOpen(false);
              }}
            >
              <div
                className="w-full max-w-102.5 border border-[#293630]/10 bg-[#f7f5ef] p-7 shadow-[0_24px_60px_rgb(43_56_50/20%)] sm:p-9"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="text-[10px] tracking-[0.18em] text-[#7c8982]">
                  LOG OUT
                </p>
                <h2
                  id="logout-dialog-title"
                  className="mt-2 font-serif-jp text-2xl font-medium text-[#293630]"
                >
                  ログアウトしますか？
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#6d7872]">
                  本棚に登録した本や記録は消えません。次回は同じGoogleアカウントでログインすると、続きを確認できます。
                </p>
                {logoutError && (
                  <p className="mt-4 text-xs leading-6 text-[#a34f45]">
                    ログアウトできませんでした。通信状態を確認して、もう一度お試しください。
                  </p>
                )}
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsLogoutDialogOpen(false)}
                    disabled={isLoggingOut}
                    className="min-h-11 rounded-md px-5 text-sm text-[#65736c] transition hover:bg-[#eeece5] hover:text-[#293630] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="min-h-11 rounded-md bg-[#344941] px-5 text-sm font-medium text-white transition hover:bg-[#263a33] disabled:cursor-wait disabled:opacity-70"
                  >
                    {isLoggingOut ? "ログアウト中…" : "ログアウトする"}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </>
    );
  }

  return compact ? (
    <LoginButton
      label="ログイン"
      className="min-h-9 rounded-md px-3 text-sm text-[#526159] transition hover:bg-[#e7e5de] hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:ml-2 sm:px-4"
    />
  ) : (
    <LoginButton />
  );
}
