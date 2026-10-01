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
    return <button onClick={() => signOut()}>ログアウト</button>;
  }

  return <LoginButton />;
}
