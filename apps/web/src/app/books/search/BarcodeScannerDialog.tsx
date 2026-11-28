"use client";

import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { RiArrowRightLine, RiBarcodeLine, RiCloseLine } from "react-icons/ri";

type Props = {
  onClose: () => void;
  onDetected: (isbn: string) => void;
  onComplete: () => void;
  scannedCount: number;
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

export const BarcodeScannerDialog = ({
  onClose,
  onDetected,
  onComplete,
  scannedCount,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const scannedIsbnsRef = useRef(new Set<string>());
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

            if (
              isbn.length !== 13 ||
              (!isbn.startsWith("978") && !isbn.startsWith("979")) ||
              scannedIsbnsRef.current.has(isbn)
            ) {
              return;
            }

            scannedIsbnsRef.current.add(isbn);
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
      className="fixed inset-0 z-50 grid place-items-center bg-[#1e2b26]/45 p-3 backdrop-blur-[3px] sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="barcode-scanner-title"
    >
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#344941]/12 bg-[#faf9f5] shadow-[0_24px_60px_rgb(43_56_50/20%)] sm:max-h-[calc(100dvh-2.5rem)]">
        <div className="flex items-start gap-3 border-b border-[#344941]/12 bg-[#ede9dc] p-4 sm:p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#faf9f5] text-xl text-[#43584e]">
            <RiBarcodeLine aria-hidden="true" />
          </span>
          <div>
            <h2
              id="barcode-scanner-title"
              className="font-serif-jp text-lg font-semibold leading-snug text-[#293630] sm:text-xl"
            >
              本のバーコードを読み取る
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#526158]">
              本の裏表紙のISBNバーコードを枠に合わせてください。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-[#43584e] hover:bg-[#faf9f5]"
            aria-label="スキャナーを閉じる"
          >
            <RiCloseLine className="text-xl" aria-hidden="true" />
          </button>
        </div>

        <div
          className={`relative mx-4 mt-4 aspect-4/3 max-h-[45dvh] overflow-hidden rounded-xl bg-[#293630] sm:mx-5 ${errorMessage ? "hidden" : ""}`}
        >
          <video
            ref={videoRef}
            className="size-full object-cover"
            muted
            playsInline
          />
          {!isStarting && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[12%] top-1/2 h-[38%] -translate-y-1/2 rounded-lg border-2 border-[#f4df86] shadow-[0_0_0_9999px_rgb(0_0_0/35%)]"
            />
          )}
          {isStarting && !errorMessage && (
            <p
              role="status"
              className="absolute inset-0 flex items-center justify-center gap-2 bg-[#1e2b26]/65 px-3 text-center text-sm text-white"
            >
              <RiBarcodeLine aria-hidden="true" />
              カメラを起動しています…
            </p>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {errorMessage ? (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-800"
            >
              {errorMessage}
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#e8ece1] px-3 py-2">
              <p className="text-xs text-[#526158]">
                続けて複数冊を読み取れます
              </p>
              <p
                className="text-sm font-medium tabular-nums text-[#344941]"
                aria-live="polite"
              >
                読み取り済み {scannedCount}冊
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onComplete}
            disabled={scannedCount === 0}
            className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#344941] px-3 text-sm font-medium text-white transition-colors hover:bg-[#263a33] disabled:cursor-not-allowed disabled:bg-[#e2e5de] disabled:text-[#526158]"
          >
            {scannedCount > 0
              ? `${scannedCount}冊の登録へ進む`
              : "本を読み取ってください"}
            {scannedCount > 0 && <RiArrowRightLine aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
};
