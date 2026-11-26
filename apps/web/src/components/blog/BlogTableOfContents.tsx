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
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const elements = headings
          .filter((heading) => heading.level === 2)
          .map((heading) => document.getElementById(heading.id))
          .filter((element): element is HTMLElement => element !== null);
        let current: string | null = null;
        for (const element of elements) {
          if (element.getBoundingClientRect().top <= 120) current = element.id;
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
  }, [headings]);

  if (sections.length === 0) return null;

  const items = (desktop: boolean) =>
    sections.map((heading) => {
      const active = activeId === heading.id;
      return (
        <li
          key={heading.id}
          className={
            desktop
              ? "relative before:absolute before:bottom-0 before:left-3.5 before:top-0 before:z-10 before:w-[3] before:bg-[#b4c1b7] first:before:top-5.5 last:before:bottom-[calc(100%-22px)]"
              : undefined
          }
        >
          <a
            href={`#${heading.id}`}
            aria-current={desktop && active ? "location" : undefined}
            className={
              desktop
                ? `flex items-start gap-3 rounded-md px-3 py-2.5 text-base leading-6 transition-colors ${active ? "bg-[#e2e8e1] font-medium text-[#293630]" : "text-[#647069] hover:bg-[#e3e4dc] hover:text-[#293630]"}`
                : "flex min-h-11 items-start gap-3 py-2 text-sm leading-6 text-[#40584e] underline decoration-[#9eafa4] underline-offset-4 transition-colors hover:text-[#293630]"
            }
          >
            {desktop ? (
              <span
                aria-hidden="true"
                className={`relative z-20 mt-2.5 size-2 shrink-0 rounded-full ring-4 ${active ? "bg-[#506b5d] ring-[#e2e8e1]" : "bg-[#aab9af] ring-[#eeece5]"}`}
              />
            ) : (
              <span
                aria-hidden="true"
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#758b7f]"
              />
            )}
            <span className="min-w-0 flex-1">{heading.text}</span>
          </a>
        </li>
      );
    });

  return variant === "mobile" ? (
    <nav
      aria-label="目次"
      className="mt-10 rounded-md border border-[#293630]/10 bg-[#eeece5] px-5 py-6 sm:mt-12 sm:px-7 sm:py-7 lg:hidden"
    >
      <p className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-[#526159]">
        <RiListCheck2 className="text-base" aria-hidden="true" />
        CONTENTS
      </p>
      <ol className="mt-4">{items(false)}</ol>
    </nav>
  ) : (
    <div className="absolute -right-90 top-0 bottom-0 hidden w-70 lg:block">
      <nav
        aria-label="目次"
        className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-md border border-[#293630]/10 bg-[#eeece5] p-4"
      >
        <p className="mb-4 flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-[#526159]">
          <RiListCheck2 className="text-base" aria-hidden="true" />
          CONTENTS
        </p>
        <ol>{items(true)}</ol>
      </nav>
    </div>
  );
}
