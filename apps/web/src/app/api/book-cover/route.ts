const RAKUTEN_THUMBNAIL_HOST = "thumbnail.image.rakuten.co.jp";

export async function GET(request: Request) {
  const imageUrl = new URL(request.url).searchParams.get("url");

  if (!imageUrl) {
    return new Response("Image URL is required", { status: 400 });
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(imageUrl);
  } catch {
    return new Response("Invalid image URL", { status: 400 });
  }

  if (
    sourceUrl.protocol !== "https:" ||
    sourceUrl.hostname !== RAKUTEN_THUMBNAIL_HOST
  ) {
    return new Response("Unsupported image host", { status: 400 });
  }

  try {
    const source = await fetch(sourceUrl, {
      next: { revalidate: 60 * 60 * 24 },
    });
    const contentType = source.headers.get("content-type") ?? "";

    if (!source.ok || !contentType.startsWith("image/")) {
      return new Response("Book cover not found", { status: 404 });
    }

    return new Response(source.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    return new Response("Book cover could not be loaded", { status: 502 });
  }
}
