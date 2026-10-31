"use client";

import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { RiBarcodeLine, RiCloseLine } from "react-icons/ri";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e2b26]/45 p-5 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="barcode-scanner-title"
    >
      <div className="w-full max-w-lg overflow-hidden border border-[#293630]/10 bg-[#faf9f5] shadow-[0_24px_60px_rgb(43_56_50/20%)]">
        <div className="flex items-start justify-between gap-4 p-6 pb-5 sm:p-7 sm:pb-5">
          <div>
            <h2
              id="barcode-scanner-title"
              className="font-serif-jp text-xl font-medium text-[#293630]"
            >
              本のバーコードを読み取る
            </h2>
            <p className="mt-2 text-[11px] text-[#748078]">
              カメラをISBNバーコードに向けてください。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md text-[#748078] transition hover:bg-[#eeece5] hover:text-[#293630]"
            aria-label="スキャナーを閉じる"
          >
            <RiCloseLine className="text-xl" aria-hidden="true" />
          </button>
        </div>

        <div className="relative mx-6 aspect-4/3 overflow-hidden bg-[#293630] sm:mx-7">
          <video
            ref={videoRef}
            className="size-full object-cover"
            muted
            playsInline
          />
          <div className="pointer-events-none absolute inset-x-[12%] top-1/2 h-[38%] -translate-y-1/2 border-2 border-[#d4c56d] shadow-[0_0_0_9999px_rgb(0_0_0/35%)]" />
          {isStarting && !errorMessage && (
            <p className="absolute inset-0 flex items-center justify-center gap-2 bg-[#1e2b26]/65 text-xs text-white">
              <RiBarcodeLine aria-hidden="true" />
              カメラを起動しています…
            </p>
          )}
        </div>

        <div className="p-6 pt-5 sm:p-7 sm:pt-5">
          {errorMessage ? (
            <p role="alert" className="text-xs leading-6 text-rose-700">
              {errorMessage}
            </p>
          ) : (
            <p className="text-xs leading-6 text-[#66736c]">
              本の裏表紙にあるバーコードを枠内に合わせてください。
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-5 min-h-11 w-full rounded-md border border-[#293630]/12 bg-white text-xs text-[#526159] transition hover:border-[#60736a] hover:bg-[#f3f1eb]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
