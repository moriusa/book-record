import { fetchAuthSession } from "aws-amplify/auth";

async function parseJsonBody<T>(res: Response): Promise<T | null> {
  const body = await res.text();

  if (!body) {
    return null;
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    return null;
  }
}

export const fetcher = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
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

  const body = await parseJsonBody<T>(res);

  if (body === null) {
    throw new Error("サーバーからの応答を読み取れませんでした。");
  }

  return body;
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

  const body = await parseJsonBody<{ message?: unknown }>(res);

  if (!res.ok) {
    const message =
      typeof body?.message === "string"
        ? body.message
        : "リクエストに失敗しました。時間をおいてもう一度お試しください。";
    throw new Error(`${res.status}: ${message}`);
  }

  if (body === null) {
    throw new Error("サーバーからの応答を読み取れませんでした。");
  }

  return body as T;
}
