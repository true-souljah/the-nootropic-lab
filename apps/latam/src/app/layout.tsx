import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="latam" />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
