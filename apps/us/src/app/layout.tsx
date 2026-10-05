import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import './globals.css';
import { CookieBanner, gaInitScript, gtagSrc } from '@nootropic/ui';

// Self-hosted latin-subset Inter (official @fontsource-variable/inter v5.2.8
// build) — next/font/google fetches at build time and fails behind the
// pipeline runner's TLS proxy, blocking Stage 8 deliveries.
const inter = localFont({
  src: './fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
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
        {/* Basic consent mode: every tracker below is type="text/plain" and
            runs only after Klaro consent. gtag.js goes in data-src, never
            src — next/script preloads `src` (<link rel="preload">) before
            any choice. */}
        <Script
          id="ga4-src"
          type="text/plain"
          data-name="google-analytics"
          data-src={gtagSrc('G-98VGHD6G4X')}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" type="text/plain" data-name="google-analytics" strategy="afterInteractive">
          {gaInitScript('G-98VGHD6G4X')}
        </Script>
        <Script id="impact-com-tag" type="text/plain" data-name="impact-com" strategy="afterInteractive">
          {`(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7211241-7e09-48c7-a449-18333f13987f1.js','script','impactStat',document,window);impactStat('trackImpression');`}
        </Script>

      </body>
    </html>
  );
}
