import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import { productsJP, ingredients, guides, buildSearchIndex } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab JP — ノートロピクス比較レビュー',
    template: '%s | The Nootropic Lab JP',
  },
  description:
    'Independent cognitive supplement reviews for Japan buyers. MHLW import compliance notes, evidence-graded reviews, and full affiliate disclosure.',
  metadataBase: new URL('https://jp.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    languages: {
      'en': '/',
      'ja': '/ja',
    },
  },
};

const searchItems = buildSearchIndex(productsJP, ingredients, guides);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader market="jp" searchItems={searchItems} />
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
          <strong>Japan Import Note:</strong> Personal import limit is ¥16,000 duty-free.
          Orders above ¥16,000 may attract customs duties. Keep orders under 2 months supply.
        </div>
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_JP"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
