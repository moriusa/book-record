"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import LoginButton from "../ui/LoginButton";

const discoverLinks = [
  { href: "/blog", label: "ブログ" },
  { href: "/guides", label: "つみほんの使い方" },
  { href: "/updates", label: "更新履歴" },
];

const supportLinks = [
  { href: "/faq", label: "よくある質問" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
];

export default function Footer() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const showHomeCta = pathname === "/" && !isLoading && !user;

  return (
    <footer className="border-t border-[#293630]/10 bg-[#eeece5] text-[#59675f]">
      <div className="mx-auto max-w-295 px-5 sm:px-8">
        {showHomeCta && (
          <section className="flex flex-col gap-5 border-b border-[#293630]/10 py-8 sm:gap-6 sm:py-12">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-[#7a877f]">
                YOUR READING SPACE
              </p>
              <h2 className="mt-3 font-serif-jp text-2xl font-medium text-[#293630] sm:text-3xl">
                気になる一冊を、あなたの本棚へ。
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#647069]">
                読みたい本も、読んだ本も。自分のペースで残せます。
              </p>
            </div>
            <LoginButton
              label="無料で本棚をつくる"
              className="min-h-12 w-full shrink-0 rounded-md bg-[#344941] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgb(38_58_49/14%)] transition hover:bg-[#263a33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-2 sm:w-auto"
            />
          </section>
        )}

        <div className="grid gap-7 py-8 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] sm:gap-10 sm:py-12">
          <div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-4"
            >
              <Image src="/logo.png" alt="" width={28} height={20} />
              <span className="text-[17px] font-medium tracking-[0.12em] text-[#293630]">
                つみほん
              </span>
            </Link>
            <p className="mt-4 text-xs leading-6 text-[#718078] sm:max-w-62.5">
              誰かに見せるためではなく、自分が読むために。本との時間を、自分だけの本棚へ。
            </p>
          </div>

          <nav
            aria-label="フッターナビゲーション"
            className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-6"
          >
            <FooterLinkGroup label="知る" links={discoverLinks} />
            <FooterLinkGroup label="サポート" links={supportLinks} />
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] tracking-[0.16em] text-[#7a877f]">
                運営・開発
              </p>
              <div className="mt-4 flex items-center gap-2">
                <a
                  href="https://x.com/tsumihon_dev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="つみほんのXを開く"
                  className="flex size-10 items-center justify-center rounded-full border border-[#293630]/10 bg-[#f7f5f0] transition hover:border-[#60736a] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-3"
                >
                  <Image src="/x_logo.png" alt="" width={18} height={18} />
                </a>
                <a
                  href="https://github.com/moriusa/book-record"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="つみほんのGitHubリポジトリを開く"
                  className="flex size-10 items-center justify-center rounded-full border border-[#293630]/10 bg-[#f7f5f0] transition hover:border-[#60736a] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-3"
                >
                  <Image src="/github_logo.png" alt="" width={18} height={18} />
                </a>
              </div>
            </div>
          </nav>
        </div>

        <p className="border-t border-[#293630]/10 py-5 text-center text-[11px] tracking-[0.08em] text-[#839087]">
          © {new Date().getFullYear()} つみほん
        </p>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.16em] text-[#7a877f]">{label}</p>
      <ul className="mt-3 flex flex-col gap-2.5 text-xs">
        {links.map(({ href, label: linkLabel }) => (
          <li key={href}>
            <Link
              href={href}
              className="transition-colors hover:text-[#293630] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60736a] focus-visible:ring-offset-3"
            >
              {linkLabel}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
