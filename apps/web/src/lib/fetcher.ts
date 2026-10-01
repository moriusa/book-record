import { fetchAuthSession } from "aws-amplify/auth";

export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    next: { revalidate: 86400 }, // 1day
  });

  if (!res.ok) {
    const error = new Error(
      `An error occurred while fetching the data. ${res.status}`,
    );
    throw error;
  }

  return res.json();
};

export async function authFetcher<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const session = await fetchAuthSession();

  const accessToken = session.tokens?.accessToken.toString();

  if (!accessToken) {
    throw new Error("ログインしてください");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}
