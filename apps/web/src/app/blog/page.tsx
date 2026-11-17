import type { Metadata } from "next";
import Link from "next/link";
import { RiArrowRightLine, RiArticleLine } from "react-icons/ri";
import { getBlogPostsWithStatus, isMicrocmsConfigured } from "@/lib/microcms";

export const metadata: Metadata = {
  title: "ブログ",
  description:
    "つみほんの読書記録、積読、本棚づくりにまつわる記事をお届けします。",
  alternates: { canonical: "/blog" },
};

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date))
    : null;

export default async function BlogPage() {
  const { posts, error } = await getBlogPostsWithStatus();
  const configured = isMicrocmsConfigured();

  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-265 px-5 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-24">
        <p className="text-xs tracking-[0.18em] text-[#75817a]">
          TSUMIHON BLOG
        </p>
        <h1 className="mt-5 font-serif-jp text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
          読書のそばにあること。
        </h1>
        <p className="mt-6 max-w-155 text-sm leading-8 text-[#647069] sm:text-base">
          本を読む時間や、本棚を育てる日々について。つみほんから、ゆっくりお届けします。
        </p>

        {error && process.env.NODE_ENV === "development" && (
          <p className="mt-8 border border-red-900/20 bg-red-50 px-4 py-3 text-xs leading-6 text-red-900">
            <span className="font-medium">microCMS の取得エラー:</span> {error}
          </p>
        )}

        {posts.length > 0 ? (
          <div className="mt-14 divide-y border-y border-[#293630]/12">
            {posts.map((post) => (
              <article key={post.id} className="py-8 sm:py-10">
                <Link
                  href={`/blog/${post.id}`}
                  className="group grid gap-4 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:items-start sm:gap-8"
                >
                  <time className="pt-1 text-xs tracking-[0.06em] text-[#78847d]">
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </time>
                  <div>
                    <h2 className="font-serif-jp text-xl font-medium leading-relaxed transition-colors group-hover:text-[#50665c] sm:text-2xl">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="mt-3 text-sm leading-7 text-[#647069]">
                        {post.description}
                      </p>
                    )}
                  </div>
                  <RiArrowRightLine
                    className="mt-1 hidden text-lg text-[#718078] transition-transform group-hover:translate-x-1 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 border border-[#293630]/10 bg-[#eeece5] px-7 py-12 text-center sm:px-12 sm:py-16">
            <RiArticleLine
              className="mx-auto text-3xl text-[#718078]"
              aria-hidden="true"
            />
            <h2 className="mt-5 font-serif-jp text-xl font-medium">
              記事を準備しています
            </h2>
            <p className="mx-auto mt-3 max-w-130 text-sm leading-7 text-[#647069]">
              {configured
                ? "最初の記事を公開すると、この場所に表示されます。"
                : "記事の公開準備を進めています。"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
