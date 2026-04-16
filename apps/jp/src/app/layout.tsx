import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import type { SearchItem } from '@nootropic/ui';
import { productsJP, ingredients, guides } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab JP — ノートロピクス比較レビュー',
    template: '%s | The Nootropic Lab JP',
  },
  description:
    'Independent cognitive supplement reviews for Japan buyers. MHLW import compliance notes, evidence-graded reviews, and full affiliate disclosure.',
  metadataBase: new URL('https://jp.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const searchItems: SearchItem[] = [
  ...productsJP.map(p => ({ title: p.name, href: `/${p.slug}`, type: 'product' as const, description: p.summary.slice(0, 100) })),
  ...ingredients.map(i => ({ title: i.name, href: `/ingredients/${i.slug}`, type: 'ingredient' as const, description: `${i.category} — ${i.clinicalDose}` })),
  ...guides.map(g => ({ title: g.title, href: `/guides/${g.slug}`, type: 'guide' as const, description: g.description })),
  { title: 'Best Nootropics', href: '/best-nootropics', type: 'page', description: 'Full comparison' },
  { title: 'Compare All', href: '/nootropic-comparison', type: 'page', description: 'Interactive comparison tool' },
  { title: 'Methodology', href: '/methodology', type: 'page', description: 'How we score supplements' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader market="jp" searchItems={searchItems} />
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
