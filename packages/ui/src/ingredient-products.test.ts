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
// The match is the ingredient's full name before any parenthesis ("DHA",
// "Acetyl-L-Carnitine", "Bacopa Monnieri"), or an alias in ALIASES where a
// label uses shorter wording. It catches a product with none of the
// ingredient, not a wrong dose.

const CATALOGUES: Product[][] = [
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
];

// Pairs that fail the rule but have not been checked against the product
// label yet. Empty since 2026-10-09: the eight pairs found when the rule was
// introduced were resolved by the label rebuilds (#334, #336) or removed from
// the ingredient pages after a label check (FANCL BRAINs: Bacopa saponins and
// hop bitter acids only; Onnit Alpha Brain: no Lion's Mane). The list can only
// shrink: an entry that now matches, or whose pair is gone, fails until removed.
const KNOWN_MISMATCHES = new Set<string>([]);

// Label wording shorter than the ingredient page's name. Keep each alias
// specific to its ingredient: a generic word ("acetyl", "vitamin") would let an
// unrelated row match.
const ALIASES: Readonly<Record<string, readonly string[]>> = {
  'bacopa-monnieri': ['bacopa'], // Hunter Focus label: "Bacopa"
};

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const pairs = ingredients.flatMap((ing) =>
  (ing.productsContaining ?? []).map((slug) => ({
    ingredient: ing.slug,
    keys: [norm(ing.name.split('(')[0]), ...(ALIASES[ing.slug] ?? [])],
    slug,
  })),
);

function contains(slug: string, keys: string[]): boolean | null {
  const records = CATALOGUES.flatMap((c) => c.filter((p) => p.slug === slug));
  if (records.length === 0) return null;
  return records.some((p) =>
    [...p.ingredientDosages.map((d) => d.name), ...(p.heroIngredients ?? [])].some((n) =>
      keys.some((k) => norm(n).includes(k)),
    ),
  );
}

describe('ingredient pages list only products that contain the ingredient', () => {
  test('scans a non-empty set of ingredient/product pairs', () => {
    expect(pairs.length).toBeGreaterThan(40);
    expect(pairs.every((p) => p.keys.every((k) => k.length > 2))).toBe(true);
  });

  test('a generic first word does not count as a match', () => {
    // N-Acetyl-L-Tyrosine must not satisfy Acetyl-L-Carnitine.
    const alcar = norm('Acetyl-L-Carnitine (ALCAR)'.split('(')[0]);
    expect(norm('N-Acetyl L-Tyrosine (NALT)').includes(alcar)).toBe(false);
  });

  test('every listed product exists and names the ingredient (outside KNOWN_MISMATCHES)', () => {
    const problems: string[] = [];
    for (const { ingredient, keys, slug } of pairs) {
      const id = `${ingredient}/${slug}`;
      const hit = contains(slug, keys);
      if (hit === null) problems.push(`${id}: no product record has this slug`);
      else if (!hit && !KNOWN_MISMATCHES.has(id)) problems.push(`${id}: no regional record names "${keys.join('" or "')}"`);
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
