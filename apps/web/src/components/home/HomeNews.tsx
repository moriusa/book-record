"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RiArrowRightLine } from "react-icons/ri";
import updatesData from "@/data/updates.json";
import type { BlogPostSummary } from "@/lib/microcms";

type Tab = "all" | "updates" | "articles";

type Update = {
  date: string;
  version: string;
  title: string;
};

type NewsItem = {
  id: string;
  type: Exclude<Tab, "all">;
  label: string;
  title: string;
  timestamp: number;
  href: string;
};

const updates = updatesData as Update[];

const formatArticleDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(date))
    : "";

const getUpdateTimestamp = (date: string) =>
  new Date(date.replaceAll(".", "-")).getTime();

export default function HomeNews({ className = "" }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("all");
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/blog/latest", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { posts: BlogPostSummary[] };
      })
      .then((data) => setPosts(data?.posts ?? []))
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const items = useMemo(() => {
    const updateItems: NewsItem[] = updates.slice(0, 3).map((update) => ({
      id: `update-${update.version}`,
      type: "updates",
      label: `${update.version} · ${update.date}`,
      title: update.title,
      timestamp: getUpdateTimestamp(update.date),
      href: "/updates",
    }));
    const articleItems: NewsItem[] = posts.map((post) => {
      const date = formatArticleDate(post.publishedAt ?? post.createdAt);
      return {
        id: `article-${post.id}`,
        type: "articles",
        label: `BLOG · ${date}`,
        title: post.title,
        timestamp: new Date(post.publishedAt ?? post.createdAt).getTime(),
        href: `/blog/${post.id}`,
      };
    });

    const allItems = [...updateItems, ...articleItems].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    if (tab === "all") {
      return allItems.slice(0, 3);
    }

    return allItems.filter((item) => item.type === tab).slice(0, 3);
  }, [posts, tab]);

  return (
    <section className={className} aria-labelledby="home-news-heading">
      <div className="pt-6">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-[#839089]">
            WHAT&apos;S NEW
          </p>
          <h2
            id="home-news-heading"
            className="mt-2 font-serif-jp text-xl font-medium"
          >
            お知らせ
          </h2>
        </div>
      </div>
      <div
        className="mt-5 flex gap-2"
        role="tablist"
        aria-label="お知らせの種類"
      >
        {(
          [
            ["all", "全て"],
            ["updates", "更新履歴"],
            ["articles", "記事"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${tab === value ? "bg-[#40584e] text-white" : "bg-[#eeece5] text-[#647069] hover:bg-[#e2dfd5]"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 divide-y divide-[#293630]/10 border-y border-[#293630]/10">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex items-center justify-between gap-5 py-4 transition-colors hover:bg-[#eeece5]/60"
          >
            <div className="min-w-0">
              <p className="text-[10px] tracking-widest text-[#7b8781]">
                {item.label}
              </p>
              <p className="mt-1 truncate font-serif-jp text-sm font-medium text-[#40584e] sm:text-base">
                {item.title}
              </p>
            </div>
            <RiArrowRightLine
              className="shrink-0 text-[#718078] transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-x-5 gap-y-3 text-xs text-[#50665c]">
        {tab !== "articles" && (
          <Link
            href="/updates"
            className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#293630]"
          >
            更新履歴一覧へ <RiArrowRightLine aria-hidden="true" />
          </Link>
        )}
        {tab !== "updates" && (
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-[#293630]"
          >
            ブログ一覧へ <RiArrowRightLine aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
