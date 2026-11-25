import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";
import BlogPostList from "@/components/blog/BlogPostList";
import { categoryIcons } from "@/components/blog/categoryIcons";
import { blogCategories } from "@/data/blogCategories";
import { getBlogPostsWithStatus } from "@/lib/microcms";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return blogCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = blogCategories.find((item) => item.slug === slug);
  if (!category) return {};
  const { posts, error } = await getBlogPostsWithStatus();
  const hasPosts = posts.some((post) => post.category?.includes(category.name));
  return {
    title: `${category.name}の記事`,
    description: `${category.description}にまつわる記事を紹介します。`,
    alternates: { canonical: `/blog/category/${category.slug}` },
    robots: { index: !error && hasPosts, follow: true },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = blogCategories.find((item) => item.slug === slug);
  if (!category) notFound();
  const { posts, error } = await getBlogPostsWithStatus();
  const filtered = posts.filter(
    (post) =>
      Array.isArray(post.category) && post.category.includes(category.name),
  );
  const Icon = categoryIcons[category.icon];
  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <div className="mx-auto max-w-265 px-5 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-[#647069] transition-colors hover:text-[#293630]"
        >
          <RiArrowLeftLine aria-hidden="true" />
          ブログ一覧
        </Link>
        <p className="mt-14 text-xs tracking-[0.18em] text-[#75817a]">
          BLOG CATEGORY
        </p>
        <h1 className="mt-5 flex items-center gap-3 font-serif-jp text-4xl font-medium tracking-[-0.045em] sm:gap-4 sm:text-5xl">
          <Icon
            className="shrink-0 text-[0.7em] text-[#718078]"
            aria-hidden="true"
          />
          <span>{category.name}</span>
        </h1>
        <p className="mt-6 text-sm leading-8 text-[#647069] sm:text-base">
          {category.description}にまつわる記事をお届けします。
        </p>
        <div className="mt-14">
          {error ? (
            <p className="border-y border-[#293630]/12 py-10 text-sm text-[#647069]">
              記事を取得できませんでした。時間をおいてお試しください。
            </p>
          ) : filtered.length ? (
            <BlogPostList posts={filtered} />
          ) : (
            <p className="border-y border-[#293630]/12 py-10 text-sm text-[#647069]">
              このジャンルの記事は準備中です。
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
