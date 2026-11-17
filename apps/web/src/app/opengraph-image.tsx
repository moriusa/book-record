import { ImageResponse } from "next/og";

export const alt = "つみほん - 読みたい本も、読んだ本も、ひとつの本棚に。";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const bookSpines = [
  { color: "#40584e", height: 282, width: 46 },
  { color: "#aeb7a9", height: 246, width: 38 },
  { color: "#82938a", height: 316, width: 55 },
  { color: "#d5cbb6", height: 226, width: 41 },
  { color: "#60766a", height: 270, width: 48 },
  { color: "#b4a58d", height: 248, width: 36 },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f7f5f0",
        color: "#293630",
        display: "flex",
        height: "100%",
        padding: "34px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #d9dcd6",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          padding: "62px 66px 56px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#e9e8df",
            bottom: "0",
            display: "flex",
            height: "142px",
            position: "absolute",
            right: "0",
            width: "100%",
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                alignItems: "center",
                color: "#718078",
                display: "flex",
                fontSize: 16,
                letterSpacing: 2,
              }}
            >
              <span
                style={{
                  background: "#8e9b94",
                  display: "flex",
                  height: "1px",
                  marginRight: "16px",
                  width: "36px",
                }}
              />
              無料の読書記録・積読管理アプリ
            </div>
            <div
              style={{
                fontFamily: "serif",
                fontSize: 50,
                fontWeight: 500,
                letterSpacing: -3,
                lineHeight: 1.25,
                marginTop: "54px",
                whiteSpace: "pre-wrap",
              }}
            >
              {"読みたい本も、読んだ本も、\nひとつの本棚に。"}
            </div>
            <div
              style={{
                color: "#647069",
                fontSize: 20,
                letterSpacing: 1,
                marginTop: "24px",
              }}
            >
              SNS機能なし・本棚は非公開。
            </div>
          </div>

          <div
            style={{
              alignItems: "baseline",
              display: "flex",
              fontFamily: "serif",
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: 4,
            }}
          >
            つみほん
            <span
              style={{
                color: "#849089",
                fontFamily: "sans-serif",
                fontSize: 13,
                letterSpacing: 3,
                marginLeft: "18px",
              }}
            >
              TSUMIHON
            </span>
          </div>
        </div>

        <div
          style={{
            alignItems: "flex-end",
            bottom: "56px",
            display: "flex",
            gap: "7px",
            position: "absolute",
            right: "72px",
          }}
        >
          {bookSpines.map((book, index) => (
            <div
              key={index}
              style={{
                background: book.color,
                borderLeft: "3px solid rgba(38, 52, 46, 0.16)",
                boxShadow: "4px 5px 9px rgba(38, 48, 43, 0.12)",
                display: "flex",
                height: `${book.height}px`,
                width: `${book.width}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}
