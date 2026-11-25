import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (
    !process.env.REVALIDATE_SECRET ||
    secret !== process.env.REVALIDATE_SECRET
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = url.searchParams.get("id");
  revalidateTag("blog", "max");
  revalidatePath("/blog");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/sitemap.xml");
  if (id) revalidatePath(`/blog/${id}`);

  return NextResponse.json({ revalidated: true, id });
}
