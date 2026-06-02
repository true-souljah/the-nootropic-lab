import type { Product } from './products-us';
import type { Ingredient } from './ingredients';
import type { Guide } from './guides';
import type { UIStrings } from './i18n';

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

// Hardcoded English fallback. Used only when no `strings` bundle is passed
// (e.g. tests that don't care about i18n, or pre-PR-Q10 call sites still
// upgrading). Production call sites go through buildRegionSearchContext
// which always passes the locale bundle through.
const EN_PAGES = {
  bestNootropics: 'Best Nootropics',
  compareAll: 'Compare All',
  methodology: 'Methodology',
} as const;
const EN_DESCRIPTIONS = {
  bestNootropics: 'Full comparison of top brands',
  compareAll: 'Interactive comparison tool',
  methodology: 'How we score supplements',
} as const;

export function buildSearchIndex(
  products: Product[],
  ingredients: Ingredient[],
  guides: Guide[],
  strings?: UIStrings
): SearchItem[] {
  const pages = strings?.search.pages ?? EN_PAGES;
  const descriptions = strings?.search.descriptions ?? EN_DESCRIPTIONS;

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
    {
      title: pages.bestNootropics,
      href: '/best-nootropics',
      type: 'page',
      description: descriptions.bestNootropics,
    },
    {
      title: pages.compareAll,
      href: '/nootropic-comparison',
      type: 'page',
      description: descriptions.compareAll,
    },
    {
      title: pages.methodology,
      href: '/methodology',
      type: 'page',
      description: descriptions.methodology,
    },
  ];
}
