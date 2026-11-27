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
  date: string;
  dateTime: string;
  version?: string;
  title: string;
  timestamp: number;
  href: string;
};

const updates = updatesData as Update[];

const newsTabs = [
  ["all", "すべて"],
  ["updates", "更新履歴"],
  ["articles", "ブログ記事"],
] as const;

const formatArticleDate = (date?: string) =>
  date
    ? new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Tokyo",
      }).format(new Date(date))
    : "";

const getUpdateTimestamp = (date: string) =>
  new Date(date.replaceAll(".", "-")).getTime();

export default function HomeNews({ className = "" }: { className?: string }) {
  const [tab, setTab] = useState<Tab>("all");
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [articleStatus, setArticleStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/blog/latest", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load blog posts");
        }
        return (await response.json()) as { posts: BlogPostSummary[] };
      })
      .then(({ posts }) => {
        setPosts(posts);
        setArticleStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setArticleStatus("error");
      });

    return () => controller.abort();
  }, []);

  const items = useMemo(() => {
    const updateItems: NewsItem[] = updates.slice(0, 3).map((update) => ({
      id: `update-${update.version}`,
      type: "updates",
      date: update.date.replaceAll(".", "/"),
      dateTime: update.date.replaceAll(".", "-"),
      version: update.version,
      title: update.title,
      timestamp: getUpdateTimestamp(update.date),
      href: "/updates",
    }));
    const articleItems: NewsItem[] = posts.map((post) => {
      const dateTime = post.publishedAt ?? post.createdAt;
      return {
        id: `article-${post.id}`,
        type: "articles",
        date: formatArticleDate(dateTime),
        dateTime,
        title: post.title,
        timestamp: new Date(dateTime).getTime(),
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
      <header className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
        <h2
          id="home-news-heading"
          className="font-serif-jp text-2xl font-semibold sm:text-3xl"
        >
          お知らせ
        </h2>
        <div
          className="flex w-full gap-1 rounded-lg bg-[#eeece5] p-1 sm:w-auto sm:shrink-0"
          role="group"
          aria-label="お知らせの種類"
        >
          {newsTabs.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={tab === value}
              onClick={() => setTab(value)}
              className={`min-h-10 flex-1 whitespace-nowrap rounded-md px-2 text-xs font-medium transition-colors sm:flex-none sm:px-4 sm:text-sm ${tab === value ? "bg-[#344941] text-white" : "text-[#526158] hover:bg-[#faf9f5]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      {items.length > 0 ? (
        <ul className="mt-3 divide-y divide-[#344941]/12 rounded-xl border border-[#344941]/12 bg-[#faf9f5]">
          {items.map((item) => (
            <li
              key={item.id}
              className="first:[&>a]:rounded-t-xl last:[&>a]:rounded-b-xl"
            >
              <Link
                href={item.href}
                className="group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-[#eeece5]/70 sm:px-5 sm:py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#526158]">
                    <span
                      className={`rounded px-2 py-0.5 font-medium ${item.type === "updates" ? "bg-[#e8ece1] text-[#43584e]" : "bg-[#f1e9d8] text-[#695b3d]"}`}
                    >
                      {item.type === "updates" ? "更新履歴" : "ブログ"}
                    </span>
                    <time dateTime={item.dateTime} className="tabular-nums">
                      {item.date}
                    </time>
                    {item.version && <span>{item.version}</span>}
                  </div>
                  <p className="mt-1.5 line-clamp-2 wrap-anywhere font-serif-jp text-sm font-semibold leading-snug underline-offset-4 group-hover:underline sm:text-base">
                    {item.title}
                  </p>
                </div>
                <RiArrowRightLine
                  className="shrink-0 text-[#718078] transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p
          role="status"
          className="mt-3 rounded-xl border border-[#344941]/12 bg-[#faf9f5] px-4 py-5 text-sm text-[#526158] sm:px-5"
        >
          {articleStatus === "loading"
            ? "ブログ記事を読み込み中…"
            : articleStatus === "error"
              ? "ブログ記事を取得できませんでした。"
              : "新着のブログ記事はありません。"}
        </p>
      )}
      <div className="mt-1 flex flex-wrap justify-end gap-x-5 text-sm text-[#43584e]">
        {tab !== "articles" && (
          <Link
            href="/updates"
            className="inline-flex min-h-11 items-center gap-1.5 underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
          >
            更新履歴一覧へ <RiArrowRightLine aria-hidden="true" />
          </Link>
        )}
        {tab !== "updates" && (
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-1.5 underline decoration-[#43584e]/45 underline-offset-4 hover:decoration-current"
          >
            ブログ一覧へ <RiArrowRightLine aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
