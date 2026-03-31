import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab CA — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab CA',
  },
  description:
    'Evidence-graded nootropic reviews for Canadian buyers. Independent comparisons, clinical dosing audits, and full affiliate disclosure.',
  metadataBase: new URL('https://ca.thenootropiclab.com'),
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
