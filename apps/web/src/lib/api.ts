import { fetchAuthSession } from "aws-amplify/auth";

export async function apiFetch(
  path: string,
  options?: RequestInit,
) {
  const session = await fetchAuthSession();

  const accessToken = session.tokens?.accessToken.toString();

  if (!accessToken) {
    throw new Error("ログインしてください");
  }

  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${path}`,
    {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
}