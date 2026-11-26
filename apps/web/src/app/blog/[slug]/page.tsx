import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiArrowRightLine, RiBookOpenLine, RiListCheck2 } from "react-icons/ri";
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
      `<div class="table-scroll" role="region" aria-label="表（横にスクロールできます）" tabindex="0">${table}</div>`,
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
    <main className="bg-[#f7f5f0] text-[#293630]">
      <article className="mx-auto max-w-225 px-5 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-16">
        <nav
          aria-label="ブログのナビゲーション"
          className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-[#647069]"
        >
          <Link href="/blog" className="transition-colors hover:text-[#293630]">
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
                    className="transition-colors hover:text-[#293630]"
                  >
                    {category.name}
                  </Link>
                ))}
              </span>
            </>
          )}
        </nav>
        <header className="mt-14 pb-6 sm:mt-18 sm:pb-10">
          <time className="text-xs tracking-[0.08em] text-[#75817a]">
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          <h1 className="mt-5 font-serif-jp text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-snug tracking-[-0.035em]">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-6 text-base leading-8 text-[#526159] sm:text-lg">
              {post.description}
            </p>
          )}
        </header>
        {headings.length > 0 && <BlogTableOfContents headings={headings} />}
        <div
          className="blog-content pt-12 sm:pt-16"
          dangerouslySetInnerHTML={{ __html: articleBody }}
        />
        <aside className="mt-16 border-t border-[#293630]/12 pt-10 sm:mt-20 sm:pt-12">
          {relatedPosts.length > 0 && (
            <section
              className="mb-12 sm:mb-16"
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
                    className="group flex items-center justify-between gap-5 py-4 text-sm leading-6 transition-colors hover:text-[#50665c] lg:text-base lg:leading-7"
                  >
                    <span>{relatedPost.title}</span>
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
          <div className="mt-12 sm:mt-16">
            <p className="text-xs tracking-[0.14em] text-[#75817a]">
              EXPLORE MORE
            </p>
            <h2 className="mt-3 font-serif-jp text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
              読書の時間を、もう少し心地よく。
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href="/guides"
                className="group flex min-h-30 flex-col justify-between border border-[#293630]/12 bg-[#eeece5] p-5 transition-colors hover:border-[#50665c]/40 hover:bg-[#e8e8df]"
              >
                <RiBookOpenLine
                  className="text-xl text-[#50665c]"
                  aria-hidden="true"
                />
                <span className="mt-5 flex items-end justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium">
                      つみほんの使い方
                    </span>
                    <span className="mt-1 block text-xs text-[#647069]">
                      本棚づくりをはじめる
                    </span>
                  </span>
                  <RiArrowRightLine
                    className="text-lg transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
              <Link
                href="/blog"
                className="group flex min-h-30 flex-col justify-between border border-[#293630]/12 bg-[#eeece5] p-5 transition-colors hover:border-[#50665c]/40 hover:bg-[#e8e8df]"
              >
                <RiListCheck2
                  className="text-xl text-[#50665c]"
                  aria-hidden="true"
                />
                <span className="mt-5 flex items-end justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium">
                      ほかの記事を読む
                    </span>
                    <span className="mt-1 block text-xs text-[#647069]">
                      読書と本棚のヒント
                    </span>
                  </span>
                  <RiArrowRightLine
                    className="text-lg transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </div>
        </aside>
      </article>
    </main>
  );
}
