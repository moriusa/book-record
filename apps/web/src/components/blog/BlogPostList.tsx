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

export default function BlogPostList({ posts }: { posts: Post[] }) {
  return (
    <div className="divide-y border-y border-[#293630]/12">
      {posts.map((post) => (
        <article key={post.id} className="py-8 sm:py-10">
          <Link
            href={`/blog/${post.id}`}
            className="group grid gap-4 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:items-start sm:gap-8"
          >
            <time
              dateTime={post.publishedAt ?? post.createdAt}
              className="pt-1 text-xs tracking-[0.06em] text-[#78847d]"
            >
              {formatDate(post.publishedAt ?? post.createdAt)}
            </time>
            <div>
              {Array.isArray(post.category) && post.category.length > 0 && (
                <p className="mb-2 text-xs text-[#75817a]">
                  {post.category.join(" ・ ")}
                </p>
              )}
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
  );
}
