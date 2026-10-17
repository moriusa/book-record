import { ImageResponse } from "next/og";

export const alt = "つみほん - あなただけの本棚";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f7f5f0",
          color: "#1c1917",
          display: "flex",
          height: "100%",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#fef3c7",
            borderRadius: "9999px",
            height: "420px",
            position: "absolute",
            right: "-80px",
            top: "-120px",
            width: "420px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ color: "#92400e", fontSize: 24, letterSpacing: 5 }}>
            YOUR READING SPACE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: 8 }}>
              つみほん
            </div>
            <div style={{ color: "#57534e", fontSize: 32 }}>
              本と出会い、本棚を育てる。
            </div>
          </div>
          <div style={{ color: "#78716c", fontSize: 24 }}>TSUMIHON</div>
        </div>
      </div>
    ),
    size,
  );
}
