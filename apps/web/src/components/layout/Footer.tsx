import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#293630]/10 bg-[#eeece5] text-[#59675f]">
      <div className="mx-auto flex max-w-295 flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-4"
          >
            <Image src="/logo.png" alt="" width={28} height={20} />
            <span className="text-[17px] font-medium tracking-[0.12em] text-[#293630]">
              つみほん
            </span>
          </Link>

          <nav aria-label="フッターナビゲーション">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:justify-end">
              <ul className="flex flex-wrap gap-x-5 gap-y-3 text-xs">
                {footerLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-3"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 border-l border-[#293630]/10 pl-5">
                <a
                  href="https://x.com/tsumihon_dev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="つみほんのXを開く"
                  className="rounded-sm p-1 transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-3"
                >
                  <Image src="/x_logo.png" alt="" width={18} height={18} />
                </a>
                <a
                  href="https://github.com/moriusa/book-record"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="つみほんのGitHubリポジトリを開く"
                  className="rounded-sm p-1 transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-3"
                >
                  <Image src="/github_logo.png" alt="" width={18} height={18} />
                </a>
              </div>
            </div>
          </nav>
        </div>
        <div className="h-px bg-[#293630]/10" />
        <p className="text-[11px] tracking-[0.08em] text-[#839087]">
          © {new Date().getFullYear()} つみほん
        </p>
      </div>
    </footer>
  );
}
