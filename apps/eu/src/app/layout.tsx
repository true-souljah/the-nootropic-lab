import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import { productsEU, ingredients, guides, buildSearchIndex, getStrings } from '@nootropic/data';
import type { Locale } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab EU — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab EU',
  },
  description:
    'Evidence-graded nootropic reviews for EU buyers. EU-compliant products, EUR pricing, and full EU regulatory guidance.',
  metadataBase: new URL('https://eu.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    languages: {
      'en': '/',
      'de-DE': '/de/beste-nootropika',
      'fr-FR': '/fr/meilleurs-nootropiques',
      'pt-PT': '/pt/melhores-nootropicos',
    },
  },
};

const searchItems = buildSearchIndex(productsEU, ingredients, guides);
const strings = getStrings('en');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="eu" searchItems={searchItems} strings={strings} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter strings={strings} />
        <CookieBanner strings={strings} />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_EU"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
