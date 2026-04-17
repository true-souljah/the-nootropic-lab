import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import { productsAU, ingredients, guides, buildSearchIndex, getStrings } from '@nootropic/data';
import type { Locale } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab AU — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab AU',
  },
  description:
    'Evidence-graded nootropic reviews for Australian buyers. TGA import notes, independent comparisons, and clinical dosing audits.',
  metadataBase: new URL('https://au.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const searchItems = buildSearchIndex(productsAU, ingredients, guides);
const strings = getStrings('en');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="au" searchItems={searchItems} strings={strings} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter strings={strings} />
        <CookieBanner strings={strings} />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_AU"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
