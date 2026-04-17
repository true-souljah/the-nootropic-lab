import type { Product } from './products-us';
import type { Ingredient } from './ingredients';
import type { Guide } from './guides';

export interface SearchItem {
  title: string;
  href: string;
  type: 'product' | 'ingredient' | 'guide' | 'page';
  description?: string;
}

export function buildSearchIndex(
  products: Product[],
  ingredients: Ingredient[],
  guides: Guide[]
): SearchItem[] {
  return [
    ...products.map(p => ({
      title: p.name,
      href: `/${p.slug}`,
      type: 'product' as const,
      description: p.summary.slice(0, 100),
    })),
    ...ingredients.map(i => ({
      title: i.name,
      href: `/ingredients/${i.slug}`,
      type: 'ingredient' as const,
      description: `${i.category} — ${i.clinicalDose}`,
    })),
    ...guides.map(g => ({
      title: g.title,
      href: `/guides/${g.slug}`,
      type: 'guide' as const,
      description: g.description,
    })),
    { title: 'Best Nootropics', href: '/best-nootropics', type: 'page', description: 'Full comparison of top brands' },
    { title: 'Compare All', href: '/nootropic-comparison', type: 'page', description: 'Interactive comparison tool' },
    { title: 'Methodology', href: '/methodology', type: 'page', description: 'How we score supplements' },
  ];
}
