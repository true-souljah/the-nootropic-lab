import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import Script from 'next/script';
import './globals.css';
import { CookieBanner } from "@nootropic/ui";
import { getStrings } from "@nootropic/data";
import type { Locale } from '@nootropic/data';

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab GCC — Independent Supplement Reviews',
    template: '%s | The Nootropic Lab GCC',
  },
  description:
    'Independent cognitive supplement reviews for GCC buyers (Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman). Evidence-graded with import compliance notes.',
  metadataBase: new URL('https://gcc.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_US',
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
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_GCC"}'
          strategy="afterInteractive"
        />
        <Script
          type="text/plain"
          data-name="google-analytics"
          src="https://www.googletagmanager.com/gtag/js?id=G-E73LNX2Z0P"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" type="text/plain" data-name="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-E73LNX2Z0P');`}
        </Script>
      </body>
    </html>
  );
}
