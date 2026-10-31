import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import AmplifyProvider from "@/components/providers/AmplifyProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import GoogleAnalyticsPageView from "@/components/analytics/GoogleAnalyticsPageView";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

const siteTitle = "つみほん｜あなただけの本棚";
const siteDescription =
  "読みたい本、読んでいる本、読み終えた本を記録して、あなただけの本棚を育てる読書記録サービスです。";
const googleAnalyticsMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "つみほん",
  title: {
    default: siteTitle,
    template: "%s｜つみほん",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "つみほん",
    title: siteTitle,
    description: siteDescription,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "つみほん - あなただけの本棚",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-[#f7f5f0] text-stone-900">
        {googleAnalyticsMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = window.gtag || gtag; window.gtag('js', new Date());`}
            </Script>
          </>
        )}
        <AmplifyProvider />
        <AuthProvider>
          <QueryProvider>
            {googleAnalyticsMeasurementId && (
              <GoogleAnalyticsPageView
                measurementId={googleAnalyticsMeasurementId}
              />
            )}
            <Header />
            <main className="flex-1 bg-[#f7f5f0]">
              <div className="p-3">{children}</div>
            </main>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
