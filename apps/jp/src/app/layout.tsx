import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab JP — ノートロピクス比較レビュー',
    template: '%s | The Nootropic Lab JP',
  },
  description:
    'Independent cognitive supplement reviews for Japan buyers. MHLW import compliance notes, evidence-graded reviews, and full affiliate disclosure.',
  metadataBase: new URL('https://jp.thenootropiclab.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader market="us" />
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
          <strong>Japan Import Note:</strong> Personal import limit is ¥16,000 duty-free.
          Orders above ¥16,000 may attract customs duties. Keep orders under 2 months supply.
        </div>
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
