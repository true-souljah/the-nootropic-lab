import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import { productsSEA, ingredients, guides, buildSearchIndex } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab SEA — Independent Supplement Reviews',
    template: '%s | The Nootropic Lab SEA',
  },
  description:
    'Independent cognitive supplement reviews for Southeast Asia buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — evidence-graded with regulatory notes.',
  metadataBase: new URL('https://sea.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const searchItems = buildSearchIndex(productsSEA, ingredients, guides);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="sea" searchItems={searchItems} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_SEA"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
