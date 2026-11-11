"use client";

import { useState } from "react";
import { RiDownloadLine } from "react-icons/ri";
import type { BookCollection, BookCollectionItem } from "@/types/collection";

type Props = {
  collection: BookCollection;
};

const palette = ["#40584e", "#a77e68", "#60736a", "#8b7657", "#596f84"];
const CARD_TITLE = "名刺代わりの本10選";
const COVER_WIDTH = 128;
const COVER_HEIGHT = 192;
const COVER_GAP = 65;

const loadCoverImage = (imageUrl: string | null) => {
  if (!imageUrl) {
    return Promise.resolve<HTMLImageElement | null>(null);
  }

  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = `/api/book-cover?url=${encodeURIComponent(imageUrl)}`;
  });
};

const drawBookCover = (
  context: CanvasRenderingContext2D,
  item: BookCollectionItem,
  index: number,
  image: HTMLImageElement | null,
  x: number,
  y: number,
) => {
  const color = palette[index % palette.length] ?? "#40584e";

  context.fillStyle = "rgb(38 48 43 / 16%)";
  context.fillRect(x + 8, y + 10, COVER_WIDTH, COVER_HEIGHT);

  if (image) {
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = COVER_WIDTH / COVER_HEIGHT;
    const [sourceX, sourceY, sourceWidth, sourceHeight] =
      sourceRatio > targetRatio
        ? [
            (image.naturalWidth - image.naturalHeight * targetRatio) / 2,
            0,
            image.naturalHeight * targetRatio,
            image.naturalHeight,
          ]
        : [
            0,
            (image.naturalHeight - image.naturalWidth / targetRatio) / 2,
            image.naturalWidth,
            image.naturalWidth / targetRatio,
          ];

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      COVER_WIDTH,
      COVER_HEIGHT,
    );
  } else {
    context.fillStyle = color;
    context.fillRect(x, y, COVER_WIDTH, COVER_HEIGHT);
    context.fillStyle = "rgb(255 255 255 / 80%)";
    context.font = '500 13px "Noto Serif JP", serif';
    context.fillText("表紙なし", x + 27, y + 101);
  }
};

const createShareCard = async (collection: BookCollection) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("画像を作成できませんでした。");
  }

  context.fillStyle = "#f5f3ed";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#344941";
  context.fillRect(0, 0, 18, canvas.height);

  context.fillStyle = "#718078";
  context.font = '500 14px "Noto Sans JP", sans-serif';
  context.fillText("MY BOOK TEN", 72, 74);

  context.fillStyle = "#293630";
  context.font = '500 39px "Noto Serif JP", serif';
  context.fillText(CARD_TITLE, 72, 130);

  context.fillStyle = "#9ca59f";
  context.fillRect(72, 158, 1056, 1);

  const items = [...collection.items].sort((a, b) => a.position - b.position);
  const coverImages = await Promise.all(
    items.map((item) => loadCoverImage(item.imageUrl)),
  );
  items.forEach((item, index) => {
    const column = index % 5;
    const row = Math.floor(index / 5);
    drawBookCover(
      context,
      item,
      index,
      coverImages[index] ?? null,
      150 + column * (COVER_WIDTH + COVER_GAP),
      180 + row * 208,
    );
  });

  context.fillStyle = "#60736a";
  context.font = '500 14px "Noto Sans JP", sans-serif';
  context.fillText("つみほん", 72, 610);
  context.fillStyle = "#87918c";
  context.font = '400 12px "Noto Sans JP", sans-serif';
  context.fillText("あなただけの本棚", 140, 610);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  if (!blob) {
    throw new Error("画像を作成できませんでした。");
  }

  return blob;
};

const downloadCard = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${CARD_TITLE}.png`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function BookTenShareActions({ collection }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const isComplete = collection.items.length === 10;

  const saveCard = async () => {
    setMessage(null);
    setIsCreatingCard(true);

    try {
      const card = await createShareCard(collection);
      downloadCard(card);
      setMessage("画像を保存しました。");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "画像を作成できませんでした。",
      );
    } finally {
      setIsCreatingCard(false);
    }
  };

  return (
    <section className="mt-10 border-t border-[#293630]/10 pt-7 sm:mt-12 sm:pt-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.16em] text-[#839089]">
            SAVE AS IMAGE
          </p>
          <h2 className="mt-2 font-serif-jp text-xl font-medium">
            10選を画像として保存
          </h2>
          <p className="mt-2 text-xs leading-6 text-[#75817b]">
            10冊そろうと、選んだ本の表紙を画像として保存できます。
          </p>
        </div>
        <button
          type="button"
          onClick={saveCard}
          disabled={!isComplete || isCreatingCard}
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-[#344941] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-[#263a33] disabled:opacity-50"
        >
          <RiDownloadLine aria-hidden="true" />
          {isCreatingCard
            ? "画像を作成中…"
            : isComplete
              ? "画像を保存"
              : `あと${10 - collection.items.length}冊選ぶ`}
        </button>
      </div>

      {message && (
        <p role="status" className="mt-4 text-xs text-[#60736a]">
          {message}
        </p>
      )}
    </section>
  );
}
