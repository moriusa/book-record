import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RiArrowRightLine,
  RiBookOpenLine,
  RiListCheck2,
  RiTimeLine,
} from "react-icons/ri";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import RakutenAffiliateWidget from "@/components/blog/RakutenAffiliateWidget";
import { getBlogPost, getBlogPosts } from "@/lib/microcms";
import { blogCategories } from "@/data/blogCategories";

type Props = { params: Promise<{ slug: string }> };

const formatDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date))
    : null;

type Heading = {
  id: string;
  level: 2 | 3;
  text: string;
};

const decodeHtml = (text: string) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const createArticleBody = (body: string) => {
  const headings: Heading[] = [];
  let index = 0;

  const html = body.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, attributes: string, content: string) => {
      index += 1;
      const id = `section-${index}`;
      const text = decodeHtml(content.replace(/<[^>]+>/g, "").trim());
      headings.push({ id, level: Number(level) as 2 | 3, text });
      const attributesWithoutId = attributes.replace(
        /\s+id=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
        "",
      );
      return `<h${level}${attributesWithoutId} id="${id}">${content}</h${level}>`;
    },
  );

  const htmlWithTables = html.replace(
    /<table\b[^>]*>[\s\S]*?<\/table>/gi,
    (table) =>
      `<div class="table-container"><p class="table-scroll-hint" aria-hidden="true">← 横にスクロールできます →</p><div class="table-scroll" role="region" aria-label="表（横にスクロールできます）" tabindex="0">${table}</div></div>`,
  );

  return { html: htmlWithTables, headings };
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.id}`;
  const image = `${url}/opengraph-image`;
  const description =
    post.description || "読書と本棚について、つみほんからお届けします。";
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ja_JP",
      siteName: "つみほん",
      title: post.title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.revisedAt ?? post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost((await params).slug);
  if (!post) notFound();

  const { html: articleBody, headings } = createArticleBody(post.body);
  const hasTableOfContents = headings.some(({ level }) => level === 2);
  const publishedDate = post.publishedAt ?? post.createdAt;
  const categories = Array.isArray(post.category)
    ? post.category.flatMap((name) => {
        const category = blogCategories.find((item) => item.name === name);
        return category ? [category] : [];
      })
    : [];
  const relatedPosts = (await getBlogPosts())
    .filter(
      (candidate) =>
        candidate.id !== post.id &&
        Array.isArray(post.category) &&
        Array.isArray(candidate.category) &&
        candidate.category.some((category) =>
          post.category?.includes(category),
        ),
    )
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-280 bg-[#f7f5f0] text-[#293630]">
      <article
        className={`mx-auto max-w-200 px-5 pb-20 pt-7 sm:px-8 sm:pb-28 sm:pt-10 ${hasTableOfContents ? "lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-x-8 xl:gap-x-10" : ""}`}
      >
        <nav
          aria-label="ブログのナビゲーション"
          className="col-start-1 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-[#526158]"
        >
          <Link
            href="/blog"
            className="underline decoration-[#9eafa4] underline-offset-4 transition-colors hover:text-[#293630]"
          >
            ブログ一覧
          </Link>
          {categories.length > 0 && (
            <>
              <span aria-hidden="true" className="text-[#a0aaa3]">
                /
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/blog/category/${category.slug}`}
                    className="underline decoration-[#9eafa4] underline-offset-4 transition-colors hover:text-[#293630]"
                  >
                    {category.name}
                  </Link>
                ))}
              </span>
            </>
          )}
        </nav>
        <header className="col-start-1 mt-7 border-b border-[#293630]/12 pb-6 sm:mt-9 sm:pb-8">
          <div className="flex items-center gap-1.5 text-xs text-[#526158]">
            <RiTimeLine className="text-sm" aria-hidden="true" />
            <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          </div>
          <h1 className="mt-3 wrap-anywhere font-serif-jp text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold leading-snug tracking-[-0.035em]">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 text-sm leading-7 text-[#526159] sm:mt-5 sm:text-base sm:leading-8">
              {post.description}
            </p>
          )}
        </header>
        {hasTableOfContents && (
          <BlogTableOfContents headings={headings} variant="mobile" />
        )}
        <div
          className="blog-content col-start-1 min-w-0 pt-8 sm:pt-10"
          dangerouslySetInnerHTML={{ __html: articleBody }}
        />
        {hasTableOfContents && (
          <BlogTableOfContents headings={headings} variant="desktop" />
        )}
        <aside className="col-start-1 mt-12 border-t border-[#293630]/12 pt-7 sm:mt-16 sm:pt-9">
          {relatedPosts.length > 0 && (
            <section
              className="mb-9 sm:mb-12"
              aria-labelledby="related-posts-heading"
            >
              <h2
                id="related-posts-heading"
                className="font-serif-jp text-xl font-medium text-[#293630]"
              >
                あわせて読みたい
              </h2>
              <div className="mt-4 divide-y divide-[#293630]/12 border-y border-[#293630]/12">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group flex items-center justify-between gap-4 py-3.5 text-sm leading-6 text-[#344941] underline-offset-4 hover:underline"
                  >
                    <span className="min-w-0 wrap-anywhere">
                      {relatedPost.title}
                    </span>
                    <RiArrowRightLine
                      className="shrink-0 text-lg transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
          <RakutenAffiliateWidget />
          <nav aria-label="読書と本棚の関連ページ" className="mt-9 sm:mt-12">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/guides"
                className="group flex items-center gap-3 rounded-lg border border-[#293630]/12 bg-[#eeece5] p-4 transition-colors hover:border-[#50665c]/40 hover:bg-[#e8ece1]"
              >
                <RiBookOpenLine
                  className="shrink-0 text-xl text-[#50665c]"
                  aria-hidden="true"
                />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span>
                    <span className="block text-sm font-medium">
                      つみほんの使い方
                    </span>
                    <span className="mt-1 block text-xs text-[#647069]">
                      本棚づくりをはじめる
                    </span>
                  </span>
                  <RiArrowRightLine
                    className="shrink-0 text-lg transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
              <Link
                href="/blog"
                className="group flex items-center gap-3 rounded-lg border border-[#293630]/12 bg-[#eeece5] p-4 transition-colors hover:border-[#50665c]/40 hover:bg-[#e8ece1]"
              >
                <RiListCheck2
                  className="shrink-0 text-xl text-[#50665c]"
                  aria-hidden="true"
                />
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span>
                    <span className="block text-sm font-medium">
                      ほかの記事を読む
                    </span>
                    <span className="mt-1 block text-xs text-[#647069]">
                      読書と本棚のヒント
                    </span>
                  </span>
                  <RiArrowRightLine
                    className="shrink-0 text-lg transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </nav>
        </aside>
      </article>
    </main>
  );
}
