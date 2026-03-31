import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab AU — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab AU',
  },
  description:
    'Evidence-graded nootropic reviews for Australian buyers. TGA import notes, independent comparisons, and clinical dosing audits.',
  metadataBase: new URL('https://au.thenootropiclab.com'),
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
