import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiBookOpenLine,
  RiListCheck2,
} from "react-icons/ri";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
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

  return { html, headings };
};

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

  const { html: articleBody, headings } = createArticleBody(post.body);
  const relatedPosts = (await getBlogPosts())
    .filter((candidate) => candidate.id !== post.id)
    .slice(0, 2);

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
        <header className="mt-14 pb-6 sm:mt-18 sm:pb-10">
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
        {headings.length > 0 && <BlogTableOfContents headings={headings} />}
        <div
          className="blog-content pt-12 sm:pt-16"
          dangerouslySetInnerHTML={{ __html: articleBody }}
        />
        <aside className="mt-16 border-t border-[#293630]/12 pt-10 sm:mt-20 sm:pt-12">
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
          {relatedPosts.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-medium text-[#526159]">
                あわせて読みたい
              </h3>
              <div className="mt-3 divide-y border-y border-[#293630]/12">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group flex items-center justify-between gap-5 py-4 text-sm leading-6 transition-colors hover:text-[#50665c]"
                  >
                    <span>{relatedPost.title}</span>
                    <RiArrowRightLine
                      className="shrink-0 text-lg transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </article>
    </main>
  );
}
