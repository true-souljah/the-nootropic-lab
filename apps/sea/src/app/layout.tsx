import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab SEA — Independent Supplement Reviews',
    template: '%s | The Nootropic Lab SEA',
  },
  description:
    'Independent cognitive supplement reviews for Southeast Asia buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — evidence-graded with regulatory notes.',
  metadataBase: new URL('https://sea.thenootropiclab.com'),
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
