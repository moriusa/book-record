import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import type { BlogPost } from "@/lib/microcms";

type Post = Pick<
  BlogPost,
  "id" | "title" | "description" | "category" | "publishedAt" | "createdAt"
>;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));

export default function BlogPostList({
  posts,
  titleAs: Title = "h2",
}: {
  posts: Post[];
  titleAs?: "h2" | "h3";
}) {
  return (
    <div className="divide-y divide-[#293630]/12 border-y border-[#293630]/12">
      {posts.map((post) => (
        <article key={post.id}>
          <Link
            href={`/blog/${post.id}`}
            className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 py-5 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-start sm:gap-x-6 sm:py-7"
          >
            <time
              dateTime={post.publishedAt ?? post.createdAt}
              className="col-start-1 row-start-1 text-xs tabular-nums text-[#526158] sm:pt-1"
            >
              {formatDate(post.publishedAt ?? post.createdAt)}
            </time>
            <div className="col-start-1 row-start-2 min-w-0 sm:col-start-2 sm:row-start-1">
              {Array.isArray(post.category) && post.category.length > 0 && (
                <p className="mb-1 text-xs leading-5 text-[#526158]">
                  {post.category.join(" ・ ")}
                </p>
              )}
              <Title className="wrap-anywhere font-serif-jp text-lg font-semibold leading-snug underline-offset-4 group-hover:underline sm:text-xl">
                {post.title}
              </Title>
              {post.description && (
                <p className="mt-2 line-clamp-2 wrap-anywhere text-sm leading-6 text-[#526158]">
                  {post.description}
                </p>
              )}
            </div>
            <RiArrowRightLine
              className="col-start-2 row-start-2 mt-1 text-base text-[#526158] transition-transform group-hover:translate-x-0.5 sm:col-start-3 sm:row-start-1 sm:text-lg"
              aria-hidden="true"
            />
          </Link>
        </article>
      ))}
    </div>
  );
}
