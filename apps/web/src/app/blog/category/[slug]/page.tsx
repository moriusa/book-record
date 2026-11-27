import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine, RiArrowRightSLine } from "react-icons/ri";
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
      <div className="mx-auto max-w-265 px-5 pb-20 pt-5 sm:px-8 sm:pb-28 sm:pt-8">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-[#43584e] underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
        >
          <RiArrowLeftLine aria-hidden="true" />
          ブログ一覧
        </Link>
        <header className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[#344941]/10 bg-[#ede9dc] px-4 py-5 sm:gap-8 sm:px-9 sm:py-6">
          <div>
            <h1 className="flex items-center gap-2 font-serif-jp text-[clamp(1.25rem,5.4vw,2rem)] font-medium leading-snug tracking-[-0.035em] sm:gap-3 sm:text-[42px]">
              <Icon
                className="shrink-0 text-[0.75em] text-[#526158]"
                aria-hidden="true"
              />
              <span>{category.name}</span>
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#526158] sm:text-base">
              {category.description}
            </p>
          </div>
          <Image
            src={category.illustration}
            alt=""
            width={168}
            height={168}
            sizes="(min-width: 1024px) 168px, (min-width: 640px) 144px, 24vw"
            className="size-[clamp(68px,24vw,112px)] object-contain sm:size-36 lg:size-42"
          />
        </header>
        <section className="mt-8 sm:mt-11" aria-labelledby="category-articles">
          <h2
            id="category-articles"
            className="mb-4 font-serif-jp text-xl font-medium sm:text-2xl"
          >
            記事一覧
          </h2>
          {error ? (
            <p className="rounded-xl bg-[#eeece5] px-5 py-7 text-sm leading-6 text-[#526158]">
              記事を取得できませんでした。時間をおいてお試しください。
            </p>
          ) : filtered.length ? (
            <BlogPostList posts={filtered} titleAs="h3" />
          ) : (
            <p className="rounded-xl bg-[#eeece5] px-5 py-7 text-sm leading-6 text-[#526158]">
              このジャンルの記事は準備中です。
            </p>
          )}
        </section>
        <nav
          className="mt-10 rounded-2xl bg-[#e8ece1] px-4 py-5 sm:mt-14 sm:p-6"
          aria-labelledby="other-blog-categories"
        >
          <h2
            id="other-blog-categories"
            className="font-serif-jp text-lg font-medium sm:text-xl"
          >
            他のジャンルを読む
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {blogCategories
              .filter((item) => item.slug !== category.slug)
              .map((item) => {
                const TopicIcon = categoryIcons[item.icon];
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/category/${item.slug}`}
                      className="group flex h-full min-h-11 items-center gap-1.5 rounded-lg border border-[#344941]/10 bg-[#faf9f5] px-2.5 py-2 text-xs leading-5 hover:border-[#344941]/35 hover:bg-white sm:gap-2 sm:px-3 sm:text-sm"
                    >
                      <TopicIcon
                        className="shrink-0 text-sm text-[#526158]"
                        aria-hidden="true"
                      />
                      <span className="group-hover:underline">{item.name}</span>
                      <RiArrowRightSLine
                        className="ml-auto shrink-0 text-sm text-[#526158]"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
    </main>
  );
}
