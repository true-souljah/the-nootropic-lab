import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

export const metadata: Metadata = {
  title: {
    default: 'NootropicGuide EU — Independent Cognitive Supplement Reviews',
    template: '%s | NootropicGuide EU',
  },
  description:
    'Evidence-graded nootropic reviews for EU buyers. EU-compliant products, EUR pricing, and full EU regulatory guidance.',
  metadataBase: new URL('https://eu.thenootropiclab.com'),
  alternates: {
    languages: {
      'en': '/',
      'de-DE': '/de/beste-nootropika',
      'fr-FR': '/fr/meilleurs-nootropiques',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="eu" />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
