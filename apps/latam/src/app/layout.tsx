import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import { productsLatam, ingredients, guides, buildSearchIndex, getStrings } from '@nootropic/data';
import type { Locale } from '@nootropic/data';

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
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const searchItems = buildSearchIndex(productsLatam, ingredients, guides);
const strings = getStrings('es');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SiteHeader market="latam" searchItems={searchItems} strings={strings} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter strings={strings} />
        <CookieBanner strings={strings} />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REPLACE_WITH_CF_ANALYTICS_TOKEN_LATAM"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
