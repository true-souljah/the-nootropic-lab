import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import Script from 'next/script';
import './globals.css';
import { CookieBanner } from "@nootropic/ui";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab Latam — Comparación de Suplementos Cognitivos',
    template: '%s | The Nootropic Lab Latam',
  },
  description:
    'Reseñas independientes de nootrópicos para compradores en Latinoamérica. Comparaciones basadas en evidencia y divulgación de afiliados completa.',
  metadataBase: new URL('https://latam.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'es_419',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        {children}
        <CookieBanner />
        <Script
          type="text/plain"
          data-name="cloudflare-insights"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_LATAM"}'
          strategy="afterInteractive"
        />
        <Script
          type="text/plain"
          data-name="google-analytics"
          src="https://www.googletagmanager.com/gtag/js?id=G-8NFPXTWG99"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" type="text/plain" data-name="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-8NFPXTWG99');`}
        </Script>
      </body>
    </html>
  );
}
