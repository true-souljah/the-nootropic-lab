import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import Script from 'next/script';
import './globals.css';
import { CookieBanner } from '@nootropic/ui';
import { getStrings } from '@nootropic/data';

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

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
};

const strings = getStrings('en');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <CookieBanner strings={strings} />
        <Script
          type="text/plain"
          data-name="cloudflare-insights"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_EU"}'
          strategy="afterInteractive"
        />
        <Script
          type="text/plain"
          data-name="google-analytics"
          src="https://www.googletagmanager.com/gtag/js?id=G-WFREESJQYP"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" type="text/plain" data-name="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-WFREESJQYP');`}
        </Script>
      </body>
    </html>
  );
}
