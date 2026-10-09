import { describe, test, expect } from 'vitest';
import {
  ingredients,
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Ingredient pages list "products containing" each ingredient
// (ingredients.ts productsContaining). Nothing tied those lists to the
// product formulas, so Blackmores Brain Active sat on the Bacopa, Ginkgo,
// phosphatidylserine and DHA pages for months while its real formula was
// Longvida curcumin alone (archived Blackmores AU/SG product pages,
// corrected 2026-10-09).
//
// Rule: every listed product must exist, and at least one regional record of
// it must name the ingredient in its ingredientDosages or heroIngredients.
// The match is the first word (3+ letters) of the ingredient's name, so it is
// a coarse check: it catches a product with none of the ingredient, not a
// wrong dose.

const CATALOGUES: Product[][] = [
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
];

// Pairs that failed the rule when it was introduced (2026-10-09) and have not
// been checked against the product label yet. The list can only shrink: an
// entry that now matches, or whose pair is gone, fails until it is removed.
// (Brainzyme/Bacopa, NooCube/Alpha-GPC and /Huperzine A and Qualia/ALCAR left
// the list when the 2026-10-09 label rebuilds, #334 and #336, landed.)
const KNOWN_MISMATCHES = new Set<string>([
  'lions-mane/onnit-alpha-brain-review',
  'phosphatidylserine/fancl-brains-review',
  'ginkgo-biloba/fancl-brains-review',
  'dha-omega-3/fancl-brains-review',
]);

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, ' ');
const keyOf = (name: string) => norm(name).split(/\s+/).find((w) => w.length > 2) ?? '';

const pairs = ingredients.flatMap((ing) =>
  (ing.productsContaining ?? []).map((slug) => ({ ingredient: ing.slug, key: keyOf(ing.name), slug })),
);

function contains(slug: string, key: string): boolean | null {
  const records = CATALOGUES.flatMap((c) => c.filter((p) => p.slug === slug));
  if (records.length === 0) return null;
  return records.some((p) =>
    [...p.ingredientDosages.map((d) => d.name), ...(p.heroIngredients ?? [])].some((n) => norm(n).includes(key)),
  );
}

describe('ingredient pages list only products that contain the ingredient', () => {
  test('scans a non-empty set of ingredient/product pairs', () => {
    expect(pairs.length).toBeGreaterThan(40);
    expect(pairs.every((p) => p.key.length > 2)).toBe(true);
  });

  test('every listed product exists and names the ingredient (outside KNOWN_MISMATCHES)', () => {
    const problems: string[] = [];
    for (const { ingredient, key, slug } of pairs) {
      const id = `${ingredient}/${slug}`;
      const hit = contains(slug, key);
      if (hit === null) problems.push(`${id}: no product record has this slug`);
      else if (!hit && !KNOWN_MISMATCHES.has(id)) problems.push(`${id}: no regional record names "${key}"`);
      else if (hit && KNOWN_MISMATCHES.has(id)) problems.push(`${id} matches now — remove it from KNOWN_MISMATCHES`);
    }
    const ids = new Set(pairs.map((p) => `${p.ingredient}/${p.slug}`));
    for (const id of KNOWN_MISMATCHES) if (!ids.has(id)) problems.push(`${id} is no longer listed — remove it from KNOWN_MISMATCHES`);
    expect(problems).toEqual([]);
  });

  test('Blackmores Brain Active carries its verified Longvida-only formula in every region', () => {
    const records = CATALOGUES.flatMap((c) => c.filter((p) => p.slug === 'blackmores-brain-active-review'));
    expect(records.length).toBeGreaterThanOrEqual(2);
    for (const p of records) {
      expect(p.ingredientDosages.map((d) => d.name)).toEqual(['Curcumin (Longvida® turmeric extract)']);
      expect(p.ingredientDosages[0].doseInProduct).toBe('400mg (80mg curcumin)');
    }
    expect(ingredients.filter((i) => i.productsContaining?.includes('blackmores-brain-active-review'))).toEqual([]);
  });
});
