import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

export const metadata: Metadata = {
  title: {
    default: 'NootropicGuide US — Independent Cognitive Supplement Reviews',
    template: '%s | NootropicGuide',
  },
  description:
    'Evidence-graded nootropic reviews for US buyers. Independent comparisons, clinical dosing audits, and transparent affiliate disclosure.',
  metadataBase: new URL('https://thenootropiclab.com'),
  alternates: {
    languages: {
      'en-US': '/',
      'es-US': '/es',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="us" />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
