import Image from "next/image";
import Link from "next/link";

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

const socialLinkClass =
  "inline-flex size-10 items-center justify-center rounded-lg border border-[#344941]/15 bg-[#faf9f5] transition-colors hover:border-[#344941]/35 hover:bg-white";

export default function Footer() {
  return (
    <footer className="border-t border-[#344941]/12 bg-[#eeece5] text-[#526158]">
      <div className="mx-auto max-w-295 px-5 sm:px-8">
        <div className="grid gap-7 py-8 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] sm:gap-10 sm:py-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md text-[#293630] transition-colors hover:text-[#50665c] sm:gap-2"
            >
              <Image
                src="/logo.png"
                alt=""
                width={28}
                height={20}
                className="h-auto w-6 sm:w-7"
              />
              <span className="text-sm font-semibold tracking-[0.07em] sm:text-lg">
                つみほん
              </span>
            </Link>
            <p className="mt-4 text-xs leading-6 sm:max-w-62.5">
              誰かに見せるためではなく、自分が読むために。本との時間を、自分だけの本棚へ。
            </p>
          </div>

          <nav
            aria-label="フッターナビゲーション"
            className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-6"
          >
            <FooterLinkGroup label="ガイド・お知らせ" links={discoverLinks} />
            <FooterLinkGroup label="サポート" links={supportLinks} />
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-[#293630]">運営・開発</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href="https://x.com/tsumihon_dev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="つみほんのXを開く"
                  className={socialLinkClass}
                >
                  <Image src="/x_logo.png" alt="" width={18} height={18} />
                </a>
                <a
                  href="https://github.com/moriusa/book-record"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="つみほんのGitHubリポジトリを開く"
                  className={socialLinkClass}
                >
                  <Image src="/github_logo.png" alt="" width={18} height={18} />
                </a>
              </div>
            </div>
          </nav>
        </div>

        <p className="border-t border-[#344941]/12 py-5 text-center text-[11px] tabular-nums">
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
      <p className="text-xs font-semibold text-[#293630]">{label}</p>
      <ul className="mt-3 flex flex-col gap-2.5 text-xs">
        {links.map(({ href, label: linkLabel }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex items-center rounded-sm underline-offset-4 transition-colors hover:text-[#293630] hover:underline"
            >
              {linkLabel}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
