import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import { productsCA, ingredients, guides, buildSearchIndex } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab CA — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab CA',
  },
  description:
    'Evidence-graded nootropic reviews for Canadian buyers. Independent comparisons, clinical dosing audits, and full affiliate disclosure.',
  metadataBase: new URL('https://ca.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    languages: {
      'en-CA': '/',
      'fr-CA': '/fr',
    },
  },
};

const searchItems = buildSearchIndex(productsCA, ingredients, guides);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="ca" searchItems={searchItems} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_CA"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
