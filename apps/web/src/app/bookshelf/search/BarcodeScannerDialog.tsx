"use client";

import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { RiCloseLine } from "react-icons/ri";

type Props = {
  onClose: () => void;
  onDetected: (isbn: string) => void;
};

const getScannerErrorMessage = (error: unknown) => {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "カメラの利用が許可されていません。ブラウザの設定から許可してください。";
  }

  if (error instanceof DOMException && error.name === "NotFoundError") {
    return "利用できるカメラが見つかりません。";
  }

  return "カメラを開始できませんでした。ISBNを入力して検索してください。";
};

export const BarcodeScannerDialog = ({ onClose, onDetected }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isDisposed = false;

    const startScanner = async () => {
      try {
        const { BrowserMultiFormatOneDReader } = await import("@zxing/browser");
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
        ]);

        const reader = new BrowserMultiFormatOneDReader(hints, {
          delayBetweenScanAttempts: 150,
        });
        const video = videoRef.current;

        if (!video || isDisposed) {
          return;
        }

        const controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: "environment" },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          video,
          (result) => {
            if (!result) {
              return;
            }

            const isbn = result.getText().replaceAll(/\D/g, "");

            if (isbn.length !== 13 && isbn.length !== 8) {
              return;
            }

            controlsRef.current?.stop();
            onDetected(isbn);
          },
        );

        if (isDisposed) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
      } catch (error) {
        if (!isDisposed) {
          setErrorMessage(getScannerErrorMessage(error));
        }
      } finally {
        if (!isDisposed) {
          setIsStarting(false);
        }
      }
    };

    void startScanner();

    return () => {
      isDisposed = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [onDetected]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="barcode-scanner-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-5 pb-4">
          <div>
            <p className="text-xs font-bold tracking-[0.14em] text-amber-800">
              BARCODE SCANNER
            </p>
            <h2
              id="barcode-scanner-title"
              className="mt-1 text-lg font-bold text-stone-900"
            >
              本のバーコードを読み取る
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            aria-label="スキャナーを閉じる"
          >
            <RiCloseLine className="text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="relative mx-5 aspect-4/3 overflow-hidden rounded-xl bg-stone-950">
          <video
            ref={videoRef}
            className="size-full object-cover"
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-x-[12%] top-1/2 h-[38%] -translate-y-1/2 rounded-lg border-2 border-amber-300 shadow-[0_0_0_9999px_rgb(0_0_0/0.25)]" />
          {isStarting && !errorMessage && (
            <p className="absolute inset-0 flex items-center justify-center bg-stone-950/60 text-sm font-semibold text-white">
              カメラを起動しています…
            </p>
          )}
        </div>

        <div className="p-5 pt-4">
          {errorMessage ? (
            <p role="alert" className="text-sm leading-6 text-rose-700">
              {errorMessage}
            </p>
          ) : (
            <p className="text-sm leading-6 text-stone-600">
              本の裏表紙にあるバーコードを枠内に合わせてください。
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 min-h-10 w-full rounded-lg border border-stone-200 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
