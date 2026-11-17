const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

export type BlogPost = {
  id: string;
  title: string;
  description?: string;
  body: string;
  publishedAt?: string;
  revisedAt?: string;
  createdAt: string;
  updatedAt: string;
};

type MicrocmsListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

type MicrocmsFetchResult<T> = {
  data: T | null;
  error: string | null;
};

const getEndpoint = (path: string) =>
  `https://${serviceDomain}.microcms.io/api/v1/${path}`;

const fetchMicrocms = async <T>(
  path: string,
): Promise<MicrocmsFetchResult<T>> => {
  if (!serviceDomain || !apiKey) {
    return {
      data: null,
      error:
        "MICROCMS_SERVICE_DOMAIN または MICROCMS_API_KEY が設定されていません。",
    };
  }

  try {
    const response = await fetch(getEndpoint(path), {
      headers: { "X-MICROCMS-API-KEY": apiKey },
      next: { revalidate: 3600, tags: ["blog"] },
    });

    if (!response.ok) {
      return {
        data: null,
        error: `microCMS API が ${response.status} を返しました。APIキーの権限と API 名を確認してください。`,
      };
    }

    return { data: await response.json(), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "不明な通信エラー";
    console.error("microCMS の記事取得に失敗しました:", message);
    return { data: null, error: `microCMS へ接続できませんでした: ${message}` };
  }
};

export const isMicrocmsConfigured = () => Boolean(serviceDomain && apiKey);

export const getBlogPostsWithStatus = async () => {
  const response = await fetchMicrocms<MicrocmsListResponse<BlogPost>>(
    "blog?limit=100&orders=-publishedAt",
  );

  return { posts: response.data?.contents ?? [], error: response.error };
};

export const getBlogPosts = async () => (await getBlogPostsWithStatus()).posts;

export const getBlogPost = async (id: string) =>
  (await fetchMicrocms<BlogPost>(`blog/${id}`)).data;
