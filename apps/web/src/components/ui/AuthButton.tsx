"use client";

import { signOut } from "aws-amplify/auth";
import { RiLogoutBoxRLine } from "react-icons/ri";
import LoginButton from "./LoginButton";
import { useAuth } from "../providers/AuthProvider";

type Props = {
  compact?: boolean;
};

export default function AuthButton({ compact = false }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className={
          compact
            ? "flex size-10 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 sm:size-auto sm:gap-1.5 sm:px-3"
            : "rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
        }
        aria-label={compact ? "ログアウト" : undefined}
      >
        {compact ? (
          <>
            <RiLogoutBoxRLine className="text-xl sm:text-base" aria-hidden="true" />
            <span className="hidden sm:inline">ログアウト</span>
          </>
        ) : (
          "ログアウト"
        )}
      </button>
    );
  }

  return compact ? (
    <LoginButton
      label="ログイン"
      className="min-h-10 rounded-lg px-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 sm:bg-stone-900 sm:px-3.5 sm:text-amber-50 sm:shadow-sm sm:hover:bg-stone-800"
    />
  ) : (
    <LoginButton />
  );
}
