import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getBlogPost } from "@/lib/microcms";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const font = await readFile(
    join(process.cwd(), "src/app/blog/NotoSansJP.ttf"),
  );
  const title = post?.title ?? "つみほんブログ";
  const displayTitle = title.length > 80 ? `${title.slice(0, 79)}…` : title;
  const category = Array.isArray(post?.category) ? post.category[0] : undefined;
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f7f5f0",
        padding: 34,
        color: "#293630",
        fontFamily: "Noto Sans JP",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          border: "1px solid #d9dcd6",
          padding: "62px 72px",
          background: "#f7f5f0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#718078",
              fontSize: 20,
              letterSpacing: 2,
            }}
          >
            <span
              style={{
                display: "flex",
                width: 36,
                height: 2,
                background: "#8e9b94",
              }}
            />
            TSUMIHON BLOG{category ? `  /  ${category}` : ""}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 50,
              fontSize: displayTitle.length > 48 ? 40 : 48,
              lineHeight: 1.5,
              fontWeight: 500,
              overflowWrap: "anywhere",
            }}
          >
            {displayTitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            borderTop: "1px solid #d9dcd6",
            paddingTop: 28,
            fontSize: 28,
            letterSpacing: 3,
          }}
        >
          つみほん{" "}
          <span
            style={{
              marginLeft: 18,
              fontSize: 14,
              letterSpacing: 3,
              color: "#849089",
            }}
          >
            TSUMIHON
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Noto Sans JP", data: font, weight: 400, style: "normal" },
      ],
    },
  );
}
