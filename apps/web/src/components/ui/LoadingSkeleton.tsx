const block =
  "animate-pulse rounded-sm bg-[#e4e2db] motion-reduce:animate-none";

export function BookRowsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="本を読み込み中"
      className="border-t border-[#293630]/10"
    >
      <span className="sr-only">読み込み中</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex items-start gap-5 border-b border-[#293630]/10 py-6"
        >
          <div className={`${block} h-28 w-19 shrink-0`} />
          <div className="flex-1 space-y-3 pt-1">
            <div className={`${block} h-5 w-4/5 max-w-80`} />
            <div className={`${block} h-3 w-2/5 max-w-40`} />
            <div className={`${block} h-3 w-3/5 max-w-56`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookshelfSkeleton() {
  return (
    <main
      role="status"
      aria-label="本棚を読み込み中"
      className="mx-auto max-w-295 px-5 pb-24 pt-10 sm:px-8 sm:pt-14"
    >
      <span className="sr-only">読み込み中</span>
      <div aria-hidden="true">
        <div className={`${block} h-3 w-28`} />
        <div className={`${block} mt-4 h-10 w-48`} />
        <div className={`${block} mt-4 h-4 w-60 max-w-full`} />
        <div className="mt-10 flex gap-4 overflow-hidden border-b border-[#293630]/10 pb-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={`${block} h-9 w-24 shrink-0`} />
          ))}
        </div>
        <div className={`${block} mt-6 h-11 w-full`} />
        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`${block} aspect-2/3 w-full`} />
          ))}
        </div>
      </div>
    </main>
  );
}

export function BookDetailSkeleton() {
  return (
    <main
      role="status"
      aria-label="本の情報を読み込み中"
      className="mx-auto max-w-270 px-5 pb-20 pt-7 sm:px-8 sm:pt-10"
    >
      <span className="sr-only">読み込み中</span>
      <div aria-hidden="true">
        <div className={`${block} mb-3 h-11 w-24`} />
        <div className="border-b border-[#344941]/12 pb-2 lg:pb-6">
          <div className="grid items-start gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8 lg:gap-12">
            <div
              className={`${block} mx-auto aspect-2/3 w-24 sm:mx-0 sm:w-28 lg:w-32`}
            />
            <div className="space-y-3">
              <div className={`${block} h-6 w-4/5 sm:h-10`} />
              <div className={`${block} h-4 w-2/5`} />
            </div>
          </div>
          <div className={`${block} mt-1 mb-3 ml-auto h-5 w-24 lg:hidden`} />
        </div>
        <div className="mt-4 grid gap-8 sm:mt-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className={`${block} h-28 w-full`} />
          <div className={`${block} h-44 w-full`} />
        </div>
      </div>
    </main>
  );
}

export function EditBookSkeleton() {
  return (
    <div
      role="status"
      aria-label="読書記録を読み込み中"
      className="grid items-start gap-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-6"
    >
      <span className="sr-only">読み込み中</span>
      <div
        aria-hidden="true"
        className="flex gap-4 rounded-xl border border-[#344941]/12 bg-[#ede9dc] p-4 sm:p-5 lg:block"
      >
        <div
          className={`${block} aspect-2/3 w-20 shrink-0 lg:mx-auto lg:w-34`}
        />
        <div className="flex-1 space-y-3 lg:mt-4">
          <div className={`${block} h-5 w-4/5`} />
          <div className={`${block} h-3 w-1/2`} />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="min-w-0 space-y-8 rounded-xl border border-[#344941]/12 bg-[#faf9f5] p-4 sm:p-7"
      >
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-4">
            <div className={`${block} h-5 w-32`} />
            <div className={`${block} h-14 w-full`} />
          </div>
        ))}
        <div className={`${block} h-12 w-full`} />
      </div>
    </div>
  );
}

export function ReadingListSkeleton() {
  return (
    <main className="mx-auto max-w-225 px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <div
        aria-hidden="true"
        className="animate-pulse motion-reduce:animate-none"
      >
        <div className="h-4 w-24 rounded-sm bg-[#e4e2db]" />
        <div className="mt-8 h-9 w-48 rounded-sm bg-[#e4e2db]" />
      </div>
      <div className="mt-8">
        <BookRowsSkeleton />
      </div>
    </main>
  );
}

export function ReadingListCardsSkeleton() {
  return (
    <div role="status" aria-label="リストを読み込み中" className="contents">
      <span className="sr-only">読み込み中</span>
      {Array.from({ length: 2 }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="flex min-h-24 items-center gap-3 rounded-xl border border-[#344941]/15 bg-[#faf9f5] p-4"
        >
          <div className={`${block} size-10 shrink-0 rounded-full`} />
          <div className="flex-1">
            <div className={`${block} h-5 w-3/4`} />
            <div className={`${block} mt-2 h-3 w-10`} />
          </div>
        </div>
      ))}
    </div>
  );
}
