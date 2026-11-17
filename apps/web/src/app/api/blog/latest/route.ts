import { NextResponse } from "next/server";
import { getRecentBlogPosts } from "@/lib/microcms";

export async function GET() {
  const posts = await getRecentBlogPosts();

  return NextResponse.json({ posts });
}
