import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import { productsUS, ingredients, guides, buildSearchIndex, getStrings } from '@nootropic/data';
import type { Locale } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab',
  },
  description:
    'Evidence-graded nootropic reviews for US buyers. Independent comparisons, clinical dosing audits, and transparent affiliate disclosure.',
  metadataBase: new URL('https://thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    languages: {
      'en-US': '/',
      'es-US': '/es',
    },
  },
};

const searchItems = buildSearchIndex(productsUS, ingredients, guides);
const strings = getStrings('en');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="us" searchItems={searchItems} strings={strings} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter strings={strings} />
        <CookieBanner strings={strings} />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_US"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
