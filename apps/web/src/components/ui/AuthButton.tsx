"use client";

import { signOut } from "aws-amplify/auth";
import LoginButton from "./LoginButton";
import { useAuth } from "../providers/AuthProvider";

export default function AuthButton() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return (
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
      >
        ログアウト
      </button>
    );
  }

  return <LoginButton />;
}
