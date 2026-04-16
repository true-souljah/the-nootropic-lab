import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import type { SearchItem } from '@nootropic/ui';
import { productsUS, ingredients, guides } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab',
  },
  description:
    'Evidence-graded nootropic reviews for US buyers. Independent comparisons, clinical dosing audits, and transparent affiliate disclosure.',
  metadataBase: new URL('https://thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    languages: {
      'en-US': '/',
      'es-US': '/es',
    },
  },
};

const searchItems: SearchItem[] = [
  ...productsUS.map(p => ({ title: p.name, href: `/${p.slug}`, type: 'product' as const, description: p.summary.slice(0, 100) })),
  ...ingredients.map(i => ({ title: i.name, href: `/ingredients/${i.slug}`, type: 'ingredient' as const, description: `${i.category} — ${i.clinicalDose}` })),
  ...guides.map(g => ({ title: g.title, href: `/guides/${g.slug}`, type: 'guide' as const, description: g.description })),
  { title: 'Best Nootropics 2026', href: '/best-nootropics', type: 'page', description: 'Full comparison of top US brands' },
  { title: 'Compare All Brands', href: '/nootropic-comparison', type: 'page', description: 'Interactive comparison tool' },
  { title: 'Methodology', href: '/methodology', type: 'page', description: 'How we score supplements' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="us" searchItems={searchItems} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
