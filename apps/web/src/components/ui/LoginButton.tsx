"use client";

import { signInWithRedirect } from "aws-amplify/auth";

export default function LoginButton() {
  const handleLogin = async () => {
    await signInWithRedirect({
      provider: "Google",
    });
  };

  return (
    <button onClick={handleLogin}>
      Googleでログイン
    </button>
  );
}
