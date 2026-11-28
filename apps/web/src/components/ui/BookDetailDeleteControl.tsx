"use client";

import { useState } from "react";

type Props = {
  onDelete: () => void;
  isDeleting: boolean;
  hasError: boolean;
};

export default function BookDetailDeleteControl({
  onDelete,
  isDeleting,
  hasError,
}: Props) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="mt-3">
      {isConfirming ? (
        <div className="rounded-lg border border-[#a56b62]/25 bg-[#fbf5f2] p-4">
          <p className="text-xs leading-6 text-[#73534d]">
            本棚から削除しますか？読書ステータス・評価・メモも削除されます。
          </p>
          {hasError && (
            <p role="alert" className="mt-3 text-xs text-[#a04438]">
              削除に失敗しました。時間をおいてもう一度お試しください。
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="min-h-11 rounded-lg bg-[#9b554a] px-2 text-xs font-medium text-white transition-colors hover:bg-[#82473e] disabled:opacity-60"
            >
              {isDeleting ? "削除中…" : "削除する"}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              disabled={isDeleting}
              className="min-h-11 rounded-lg border border-[#293630]/12 bg-white px-2 text-xs text-[#526158] transition-colors hover:border-[#60736a] disabled:opacity-60"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="min-h-11 w-full rounded-lg px-4 text-sm text-[#8a5148] transition-colors hover:bg-[#f7ece8] hover:text-[#82473e]"
        >
          本棚から削除
        </button>
      )}
    </div>
  );
}
