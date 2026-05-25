import type { Product } from './products-us';
import type { Ingredient } from './ingredients';
import type { Guide } from './guides';

export interface SearchItemMeta {
  /** Product score 0..10, surfaced as a ScorePill in result rows. */
  score?: number;
  /** Derived ingredient evidence grade. */
  grade?: 'A' | 'B' | 'C';
  /** Estimated read time for guide entries. */
  readTime?: string;
}

export interface SearchItem {
  title: string;
  href: string;
  type: 'product' | 'ingredient' | 'guide' | 'page';
  description?: string;
  meta?: SearchItemMeta;
}

function deriveIngredientGrade(ing: Ingredient): 'A' | 'B' | 'C' {
  const strengths = ing.humanEffects.map((e) => e.evidenceStrength);
  if (strengths.some((s) => s === 'strong')) return 'A';
  if (strengths.some((s) => s === 'moderate')) return 'B';
  return 'C';
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
      meta: { score: p.score },
    })),
    ...ingredients.map(i => ({
      title: i.name,
      href: `/ingredients/${i.slug}`,
      type: 'ingredient' as const,
      description: `${i.category} — ${i.clinicalDose}`,
      meta: { grade: deriveIngredientGrade(i) },
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
