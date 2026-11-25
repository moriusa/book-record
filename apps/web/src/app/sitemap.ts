import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { getBlogPosts } from "@/lib/microcms";
import { blogCategories } from "@/data/blogCategories";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type CatalogBook = { isbn: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/privacy", siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: new URL("/terms", siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: new URL("/contact", siteUrl).toString(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: new URL("/faq", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: new URL("/guides", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...guides.map(({ slug }) => ({
      url: new URL(`/guides/${slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: new URL("/blog", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogPosts = await getBlogPosts();
  const categoryEntries: MetadataRoute.Sitemap = blogCategories
    .filter((category) =>
      blogPosts.some((post) => post.category?.includes(category.name)),
    )
    .map((category) => ({
      url: new URL(`/blog/category/${category.slug}`, siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: new URL(`/blog/${post.id}`, siteUrl).toString(),
    lastModified: post.revisedAt ?? post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  if (!apiUrl) {
    return [...baseEntries, ...categoryEntries, ...blogEntries];
  }

  try {
    const response = await fetch(`${apiUrl}/books/catalog`, {
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return [...baseEntries, ...categoryEntries, ...blogEntries];
    }

    const books: CatalogBook[] = await response.json();

    return [
      ...baseEntries,
      ...categoryEntries,
      ...books.map(({ isbn }) => ({
        url: new URL(`/books/${encodeURIComponent(isbn)}`, siteUrl).toString(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...blogEntries,
    ];
  } catch {
    return [...baseEntries, ...categoryEntries, ...blogEntries];
  }
}
