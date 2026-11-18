"use client";

import { RiListCheck2 } from "react-icons/ri";

type Heading = {
  id: string;
  level: 2 | 3;
  text: string;
};

type Props = {
  headings: Heading[];
};

export default function BlogTableOfContents({ headings }: Props) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const id = event.currentTarget.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="目次"
      className="mt-10 border-y border-[#293630]/12 py-6 sm:mt-12 sm:py-7"
    >
      <p className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-[#526159]">
        <RiListCheck2 className="text-base" aria-hidden="true" />
        CONTENTS
      </p>
      <ol className="mt-4 space-y-2.5 text-sm leading-6">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-4" : undefined}
          >
            <a
              href={`#${heading.id}`}
              onClick={handleClick}
              className="text-[#526159] underline decoration-[#aab6af] underline-offset-4 transition-colors hover:text-[#293630]"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
