import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab GCC — Independent Supplement Reviews',
    template: '%s | The Nootropic Lab GCC',
  },
  description:
    'Independent cognitive supplement reviews for GCC buyers (Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman). Evidence-graded with import compliance notes.',
  metadataBase: new URL('https://gcc.thenootropiclab.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="gcc" />
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
          <strong>GCC Import Note:</strong> Verify supplement import status with your local customs
          authority before ordering. All products listed are caffeine-free unless otherwise noted.
        </div>
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
