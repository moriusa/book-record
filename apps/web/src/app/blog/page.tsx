import type { Metadata } from "next";
import { RiArrowDownLine, RiArticleLine } from "react-icons/ri";
import Link from "next/link";
import { categoryIcons } from "@/components/blog/categoryIcons";
import { blogCategories } from "@/data/blogCategories";
import BlogPostList from "@/components/blog/BlogPostList";
import { getBlogPostsWithStatus, isMicrocmsConfigured } from "@/lib/microcms";

export const metadata: Metadata = {
  title: "ブログ",
  description:
    "つみほんの読書記録、積読、本棚づくりにまつわる記事をお届けします。",
  alternates: { canonical: "/blog" },
};

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
          つみほんブログ
        </h1>
        <p className="mt-6 text-sm leading-8 text-[#647069] sm:text-base">
          本を読む時間や、本棚を育てる日々について。つみほんから、ゆっくりお届けします。
        </p>
        {posts.length > 0 && (
          <a
            href="#latest-heading"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-[#40584e] underline decoration-[#9eafa4] underline-offset-4 transition-colors hover:text-[#293630] sm:hidden"
          >
            新着記事を見る <RiArrowDownLine aria-hidden="true" />
          </a>
        )}

        {error && process.env.NODE_ENV === "development" && (
          <p className="mt-8 border border-red-900/20 bg-red-50 px-4 py-3 text-xs leading-6 text-red-900">
            <span className="font-medium">microCMS の取得エラー:</span> {error}
          </p>
        )}

        <section className="mt-14" aria-labelledby="categories-heading">
          <p className="text-xs tracking-[0.16em] text-[#75817a]">
            EXPLORE BY TOPIC
          </p>
          <h2
            id="categories-heading"
            className="mt-3 font-serif-jp text-2xl font-medium"
          >
            ジャンルから探す
          </h2>
          <div className="mt-6 grid grid-cols-1 border-t border-[#293630]/12 sm:grid-cols-2 sm:gap-x-12">
            {blogCategories.map((category) => {
              const Icon = categoryIcons[category.icon];
              return (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="group flex items-start gap-4 border-b border-[#293630]/12 py-5 transition-colors hover:text-[#50665c]"
                >
                  <Icon
                    className="mt-0.5 shrink-0 text-lg text-[#718078]"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block font-serif-jp text-base font-medium">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-xs text-[#75817a]">
                      {category.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
        {posts.length > 0 ? (
          <section className="mt-16" aria-labelledby="latest-heading">
            <p className="text-xs tracking-[0.16em] text-[#75817a]">
              LATEST ARTICLES
            </p>
            <h2
              id="latest-heading"
              className="mb-6 mt-3 scroll-mt-24 font-serif-jp text-2xl font-medium"
            >
              新着記事
            </h2>
            <BlogPostList posts={posts} />
          </section>
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
