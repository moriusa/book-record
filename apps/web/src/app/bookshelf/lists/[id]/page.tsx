"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiEditLine,
  RiListCheck2,
  RiMore2Fill,
} from "react-icons/ri";
import { authFetcher } from "@/lib/fetcher";
import BookListItem from "@/components/ui/BookListItem";
import { ReadingListSkeleton } from "@/components/ui/LoadingSkeleton";
import type { ReadingList } from "@/types/readingList";

export default function ReadingListDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const {
    data: list,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reading-list", id],
    queryFn: () => authFetcher<ReadingList>(`/reading-lists/${id}`),
  });
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reading-lists"] });
    queryClient.invalidateQueries({ queryKey: ["reading-list", id] });
  };
  const renameMutation = useMutation({
    mutationFn: () =>
      authFetcher(`/reading-lists/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title }),
      }),
    onSuccess: () => {
      setIsRenameDialogOpen(false);
      invalidate();
    },
  });
  const removeMutation = useMutation({
    mutationFn: (userBookId: string) =>
      authFetcher(`/reading-lists/${id}/items/${userBookId}`, {
        method: "DELETE",
      }),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: () => authFetcher(`/reading-lists/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-lists"] });
      router.push("/bookshelf/lists");
    },
  });

  if (isLoading) return <ReadingListSkeleton />;
  if (isError || !list)
    return (
      <main className="p-8 text-sm text-[#75817b]">
        リストを取得できませんでした。
      </main>
    );

  return (
    <main className="mx-auto max-w-225 px-5 pb-24 pt-10 text-[#293630] sm:px-8 sm:pt-14">
      <Link
        href="/bookshelf/lists"
        className="inline-flex min-h-10 items-center gap-2 text-xs text-[#65736c] hover:text-[#344941]"
      >
        <RiArrowLeftLine aria-hidden="true" />
        リストへ戻る
      </Link>
      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <RiListCheck2
              className="shrink-0 text-xl text-[#60736a]"
              aria-hidden="true"
            />
            <h1 className="truncate font-serif-jp text-2xl font-medium sm:text-[40px]">
              {list.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <p className="mr-1 text-sm text-[#75817b]">{list.items.length}冊</p>
            <button
              type="button"
              onClick={() => {
                setTitle(list.title);
                setIsRenameDialogOpen(true);
              }}
              className="flex size-10 items-center justify-center rounded-md border border-[#293630]/12 bg-[#faf9f5] text-[#526159] transition hover:border-[#60736a] hover:bg-white"
              aria-label="リスト名を変更"
              title="リスト名を変更"
            >
              <RiEditLine aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteConfirmationOpen(true)}
              className="flex size-10 items-center justify-center rounded-md text-[#986157] transition hover:bg-[#fbf1ed]"
              aria-label="リストを削除"
              title="リストを削除"
            >
              <RiDeleteBinLine aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {list.items.length > 0 ? (
        <div className="mt-8 border-t border-[#293630]/10">
          {list.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-[#293630]/10 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <BookListItem book={item} className="border-b-0" />
              </div>
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId((current) =>
                      current === item.id ? null : item.id,
                    )
                  }
                  className="flex size-10 items-center justify-center rounded-md text-[#68766f] transition hover:bg-[#eeece5] hover:text-[#344941]"
                  aria-label={`${item.title}のメニューを開く`}
                  aria-expanded={openMenuId === item.id}
                >
                  <RiMore2Fill className="text-lg" aria-hidden="true" />
                </button>
                {openMenuId === item.id && (
                  <div className="absolute right-0 top-11 z-10 w-39 border border-[#293630]/10 bg-[#faf9f5] p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        removeMutation.mutate(item.id);
                        setOpenMenuId(null);
                      }}
                      disabled={removeMutation.isPending}
                      className="flex min-h-10 w-full items-center rounded-sm px-3 text-left text-xs text-[#986157] transition hover:bg-[#fbf1ed] disabled:opacity-50"
                    >
                      リストから外す
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-[#75817b]">
          このリストにはまだ本がありません。書籍詳細から追加できます。
        </div>
      )}
      {isRenameDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rename-list-dialog-title"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (title.trim()) renameMutation.mutate();
            }}
            className="w-full max-w-sm bg-[#faf9f5] p-6 shadow-2xl"
          >
            <h2
              id="rename-list-dialog-title"
              className="font-serif-jp text-xl font-medium"
            >
              リスト名を変更
            </h2>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              autoFocus
              className="mt-5 min-h-12 w-full rounded-md border border-[#293630]/12 bg-white px-4 font-serif-jp text-base outline-none focus:border-[#60736a]"
            />
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="submit"
                disabled={renameMutation.isPending || !title.trim()}
                className="min-h-11 rounded-md bg-[#40584e] px-3 text-xs font-medium text-white disabled:opacity-50"
              >
                {renameMutation.isPending ? "保存中…" : "保存する"}
              </button>
              <button
                type="button"
                onClick={() => setIsRenameDialogOpen(false)}
                disabled={renameMutation.isPending}
                className="min-h-11 rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#526159]"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}
      {isDeleteConfirmationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-list-dialog-title"
        >
          <div className="w-full max-w-sm bg-[#faf9f5] p-6 shadow-2xl">
            <h2
              id="delete-list-dialog-title"
              className="font-serif-jp text-xl font-medium"
            >
              リストを削除しますか？
            </h2>
            <p className="mt-3 text-xs leading-6 text-[#65736c]">
              リスト内の本や読書記録は削除されません。
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="min-h-11 rounded-md bg-[#9b554a] px-3 text-xs font-medium text-white disabled:opacity-60"
              >
                {deleteMutation.isPending ? "削除中…" : "削除する"}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteConfirmationOpen(false)}
                disabled={deleteMutation.isPending}
                className="min-h-11 rounded-md border border-[#293630]/12 bg-white px-3 text-xs text-[#526159]"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
