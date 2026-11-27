import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  RiArrowDownLine,
  RiArrowRightSLine,
  RiArticleLine,
} from "react-icons/ri";
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
      <div className="mx-auto max-w-265 px-5 pb-20 pt-7 sm:px-8 sm:pb-28 sm:pt-12">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-[#344941]/10 bg-[#ede9dc] px-4 py-5 sm:gap-8 sm:px-9 sm:py-6">
          <div>
            <h1 className="font-serif-jp text-[clamp(1.375rem,7vw,2rem)] font-semibold tracking-[-0.045em] sm:text-[42px]">
              つみほんブログ
            </h1>
            <p className="mt-2 max-w-110 text-xs leading-6 text-[#526158] sm:text-base sm:leading-7">
              積読の整理、読書記録、おすすめの本。読書と本棚を楽しむヒントをお届けします。
            </p>
            {posts.length > 0 && (
              <a
                href="#latest-heading"
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#40584e] underline decoration-[#40584e]/45 underline-offset-4 hover:decoration-current sm:mt-3"
              >
                新着記事を見る <RiArrowDownLine aria-hidden="true" />
              </a>
            )}
          </div>
          <Image
            src="/loose-reading-books.png"
            alt=""
            width={192}
            height={192}
            sizes="(min-width: 1024px) 192px, (min-width: 640px) 144px, 26vw"
            className="size-[clamp(76px,26vw,120px)] object-contain sm:size-36 lg:size-48"
          />
        </header>

        {error && process.env.NODE_ENV === "development" && (
          <p className="mt-8 border border-red-900/20 bg-red-50 px-4 py-3 text-xs leading-6 text-red-900">
            <span className="font-medium">microCMS の取得エラー:</span> {error}
          </p>
        )}

        <section className="mt-8 sm:mt-11" aria-labelledby="categories-heading">
          <h2
            id="categories-heading"
            className="font-serif-jp text-xl font-medium sm:text-2xl"
          >
            ジャンルから探す
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#e8ece1] p-2 sm:gap-3 sm:p-4 lg:grid-cols-4">
            {blogCategories.map((category) => {
              const Icon = categoryIcons[category.icon];
              return (
                <li key={category.slug} className="min-w-0">
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="group flex h-full flex-col gap-1.5 rounded-xl border border-[#344941]/10 bg-[#faf9f5] px-3 py-2.5 transition-colors hover:border-[#344941]/35 hover:bg-white sm:p-4"
                  >
                    <span className="flex items-center justify-between gap-2 text-[#526158]">
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#e8ece1]">
                        <Icon className="text-base" aria-hidden="true" />
                      </span>
                      <RiArrowRightSLine
                        className="text-base transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm font-medium leading-snug underline-offset-4 group-hover:underline sm:text-[15px]">
                      {category.name}
                    </span>
                    <span className="text-xs leading-5 text-[#526158]">
                      {category.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        {posts.length > 0 ? (
          <section className="mt-10 sm:mt-14" aria-labelledby="latest-heading">
            <h2
              id="latest-heading"
              className="mb-4 scroll-mt-24 font-serif-jp text-xl font-semibold sm:text-2xl"
            >
              新着記事
            </h2>
            <BlogPostList posts={posts} titleAs="h3" />
          </section>
        ) : (
          <div className="mt-10 rounded-2xl border border-[#293630]/10 bg-[#eeece5] px-6 py-9 text-center sm:px-12 sm:py-12">
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
