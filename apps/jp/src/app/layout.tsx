import type { Metadata } from 'next';
import localFont from "next/font/local";
import Script from 'next/script';
import './globals.css';
import { CookieBanner } from "@nootropic/ui";

// Self-hosted latin-subset Inter (@fontsource-variable/inter v5.2.8) — next/font/google fetches at build time and fails behind the pipeline runner TLS proxy.
const inter = localFont({ src: "./fonts/inter-latin-wght-normal.woff2", weight: "100 900", display: "swap", variable: "--font-inter" });

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={inter.variable}>
      <body>
        {children}
        <CookieBanner />
        <Script
          type="text/plain"
          data-name="cloudflare-insights"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_JP"}'
          strategy="afterInteractive"
        />
        <Script
          type="text/plain"
          data-name="google-analytics"
          src="https://www.googletagmanager.com/gtag/js?id=G-SXCS17QN1T"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" type="text/plain" data-name="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SXCS17QN1T');`}
        </Script>
        <Script id="impact-com-tag" type="text/plain" data-name="impact-com" strategy="afterInteractive">
          {`(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7211241-7e09-48c7-a449-18333f13987f1.js','script','impactStat',document,window);impactStat('trackImpression');`}
        </Script>

      </body>
    </html>
  );
}
