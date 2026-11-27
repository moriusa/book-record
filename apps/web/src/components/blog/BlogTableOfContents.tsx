"use client";

import { useEffect, useState } from "react";
import { RiListCheck2 } from "react-icons/ri";

type Heading = { id: string; level: 2 | 3; text: string };

export default function BlogTableOfContents({
  headings,
  variant,
}: {
  headings: Heading[];
  variant: "mobile" | "desktop";
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sections = headings.filter((heading) => heading.level === 2);

  useEffect(() => {
    if (variant !== "desktop") return;

    const elements = headings
      .filter((heading) => heading.level === 2)
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current: string | null = null;
        for (const element of elements) {
          if (element.getBoundingClientRect().top > 96) break;
          current = element.id;
        }
        setActiveId(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings, variant]);

  if (sections.length === 0) return null;

  const items = (desktop: boolean) =>
    sections.map((heading) => {
      const active = activeId === heading.id;
      return (
        <li
          key={heading.id}
          className={
            desktop
              ? "relative before:pointer-events-none before:absolute before:bottom-0 before:left-[15px] before:top-0 before:z-10 before:w-0.5 before:bg-[#a6b6aa] first:before:top-4 last:before:bottom-[calc(100%-16px)]"
              : undefined
          }
        >
          <a
            href={`#${heading.id}`}
            aria-current={desktop && active ? "location" : undefined}
            className={
              desktop
                ? `flex items-start gap-3 rounded-md px-3 py-1.5 text-[13px] leading-5 transition-colors ${active ? "bg-[#e2e8e1] font-medium text-[#293630]" : "text-[#647069] hover:bg-[#e3e4dc] hover:text-[#293630]"}`
                : "flex min-h-11 items-start gap-3 py-2 text-sm leading-6 text-[#40584e] underline decoration-[#9eafa4] underline-offset-4 transition-colors hover:text-[#293630]"
            }
          >
            {desktop ? (
              <span
                aria-hidden="true"
                className={`relative z-20 mt-1.5 size-2 shrink-0 rounded-full ring-4 ${active ? "bg-[#506b5d] ring-[#e2e8e1]" : "bg-[#aab9af] ring-[#eeece5]"}`}
              />
            ) : (
              <span
                aria-hidden="true"
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#758b7f]"
              />
            )}
            <span className="min-w-0 flex-1 wrap-anywhere">{heading.text}</span>
          </a>
        </li>
      );
    });

  return variant === "mobile" ? (
    <nav
      aria-label="目次"
      className="mt-6 rounded-xl border border-[#293630]/10 bg-[#eeece5] px-4 py-4 sm:mt-8 sm:px-6 lg:hidden"
    >
      <p className="flex items-center gap-2 text-sm font-medium text-[#526159]">
        <RiListCheck2 className="text-base" aria-hidden="true" />
        目次
      </p>
      <ol className="mt-2">{items(false)}</ol>
    </nav>
  ) : (
    <div className="col-start-2 row-start-3 hidden pt-10 lg:block">
      <nav
        aria-label="目次"
        className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-xl border border-[#293630]/10 bg-[#eeece5] p-4"
      >
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-[#526159]">
          <RiListCheck2 className="text-base" aria-hidden="true" />
          目次
        </p>
        <ol>{items(true)}</ol>
      </nav>
    </div>
  );
}
