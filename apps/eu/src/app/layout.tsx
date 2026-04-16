import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter, CookieBanner } from '@nootropic/ui';
import type { SearchItem } from '@nootropic/ui';
import { productsEU, ingredients, guides } from '@nootropic/data';

export const metadata: Metadata = {
  title: {
    default: 'The Nootropic Lab EU — Independent Cognitive Supplement Reviews',
    template: '%s | The Nootropic Lab EU',
  },
  description:
    'Evidence-graded nootropic reviews for EU buyers. EU-compliant products, EUR pricing, and full EU regulatory guidance.',
  metadataBase: new URL('https://eu.thenootropiclab.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Nootropic Lab',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    languages: {
      'en': '/',
      'de-DE': '/de/beste-nootropika',
      'fr-FR': '/fr/meilleurs-nootropiques',
    },
  },
};

const searchItems: SearchItem[] = [
  ...productsEU.map(p => ({ title: p.name, href: `/${p.slug}`, type: 'product' as const, description: p.summary.slice(0, 100) })),
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
        <SiteHeader market="eu" searchItems={searchItems} />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
