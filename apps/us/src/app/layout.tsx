import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@nootropic/ui';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
};

/**
 * Root layout — minimal shell. Provides <html>/<body>, font, the
 * Klaro CookieBanner (overlay), and analytics scripts. Page chrome
 * (header/footer) is supplied per-page by a template (PublicShell,
 * Listicle, HeadToHead, IngredientDetail, etc.).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <CookieBanner />
        <Script
          type="text/plain"
          data-name="cloudflare-insights"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_US"}'
          strategy="afterInteractive"
        />
        <Script
          type="text/plain"
          data-name="google-analytics"
          src="https://www.googletagmanager.com/gtag/js?id=G-98VGHD6G4X"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" type="text/plain" data-name="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-98VGHD6G4X');`}
        </Script>
      </body>
    </html>
  );
}
