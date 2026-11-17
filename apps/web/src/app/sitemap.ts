import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";

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
      url: new URL("/guides", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...guides.map(({ slug }) => ({
      url: new URL(`/guides/${slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  if (!apiUrl) {
    return baseEntries;
  }

  try {
    const response = await fetch(`${apiUrl}/books/catalog`, {
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return baseEntries;
    }

    const books: CatalogBook[] = await response.json();

    return [
      ...baseEntries,
      ...books.map(({ isbn }) => ({
        url: new URL(`/books/${encodeURIComponent(isbn)}`, siteUrl).toString(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return baseEntries;
  }
}
