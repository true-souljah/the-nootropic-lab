import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import type { SearchItem } from '@nootropic/ui';
import { productsSEA, ingredients, guides } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab SEA — Independent Supplement Reviews',
    template: '%s | The Nootropic Lab SEA',
  },
  description:
    'Independent cognitive supplement reviews for Southeast Asia buyers. Singapore, Malaysia, Thailand, Philippines, Indonesia, Vietnam — evidence-graded with regulatory notes.',
  metadataBase: new URL('https://sea.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const searchItems: SearchItem[] = [
  ...productsSEA.map(p => ({ title: p.name, href: `/${p.slug}`, type: 'product' as const, description: p.summary.slice(0, 100) })),
  ...ingredients.map(i => ({ title: i.name, href: `/ingredients/${i.slug}`, type: 'ingredient' as const, description: `${i.category} — ${i.clinicalDose}` })),
  ...guides.map(g => ({ title: g.title, href: `/guides/${g.slug}`, type: 'guide' as const, description: g.description })),
  { title: 'Best Nootropics', href: '/best-nootropics', type: 'page', description: 'Full comparison' },
  { title: 'Compare All', href: '/nootropic-comparison', type: 'page', description: 'Interactive comparison tool' },
  { title: 'Methodology', href: '/methodology', type: 'page', description: 'How we score supplements' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader market="sea" searchItems={searchItems} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
