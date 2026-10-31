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
            ? "flex size-9 items-center justify-center rounded-full border border-[#293630]/10 bg-[#eeece5] text-[#526159] transition hover:bg-[#e7e5de] hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:ml-2 sm:size-auto sm:gap-1.5 sm:rounded-md sm:border-0 sm:bg-transparent sm:px-3"
            : "rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
        }
        aria-label={compact ? "ログアウト" : undefined}
      >
        {compact ? (
          <>
            <RiLogoutBoxRLine
              className="text-xl sm:text-base"
              aria-hidden="true"
            />
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
      className="min-h-9 rounded-md px-3 text-sm text-[#526159] transition hover:bg-[#e7e5de] hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] sm:ml-2 sm:px-4"
    />
  ) : (
    <LoginButton />
  );
}
