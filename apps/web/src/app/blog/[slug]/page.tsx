import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";
import { getBlogPost, getBlogPosts } from "@/lib/microcms";

type Props = { params: Promise<{ slug: string }> };

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date))
    : null;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.id}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost((await params).slug);
  if (!post) notFound();

  return (
    <main className="bg-[#f7f5f0] text-[#293630]">
      <article className="mx-auto max-w-175 px-5 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-[#647069] transition-colors hover:text-[#293630]"
        >
          <RiArrowLeftLine aria-hidden="true" />
          ブログ一覧
        </Link>
        <header className="mt-14 border-b border-[#293630]/12 pb-12 sm:mt-18 sm:pb-16">
          <time className="text-xs tracking-[0.08em] text-[#75817a]">
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          <h1 className="mt-5 font-serif-jp text-4xl font-medium leading-snug tracking-[-0.045em] sm:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-6 text-base leading-8 text-[#526159] sm:text-lg">
              {post.description}
            </p>
          )}
        </header>
        <div
          className="blog-content pt-12 sm:pt-16"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>
    </main>
  );
}
