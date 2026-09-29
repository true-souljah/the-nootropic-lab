import { describe, test, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, productsGCC, productsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// One product = one set of global facts. Fields that describe the product
// itself (brand, full formula incl. doses, the vendor's single Trustpilot profile, lifecycle)
// must be identical in every region catalogue that carries the slug.
// Region-specific fields (local prices, affiliate storefront, shipping,
// regulatory status) may differ and are not checked here.

const CATALOGUES: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: productsGCC, sea: productsSEA,
};
const PRIMARY = ['us', 'eu', 'ca', 'au', 'jp', 'latam'];
const FIELDS = ['brand', 'heroIngredients', 'ingredientDosages', 'trustpilotScore', 'trustpilotCount', 'discontinued'] as const;
type Field = (typeof FIELDS)[number];

function value(p: Product, field: Field): string {
  // A global SKU has one formula: compare every entry's name, dose, clinical
  // anchor and adequacy verdict, not just the ingredient names.
  if (field === 'ingredientDosages') {
    return JSON.stringify(
      p.ingredientDosages.map((d) => [d.name, d.doseInProduct, d.clinicalDose, d.adequatelyDosed]),
    );
  }
  return JSON.stringify(p[field] ?? null);
}

// Known mismatches, keyed `slug/field` (primary regions) or `region/slug/field`
// (gcc/sea). Each entry must still be a real mismatch — delete it once fixed.
//
// Primary regions: the formula differs between records and the 2026-09-28
// vendor verification could not read either supplement-facts panel (Hunter
// Focus panel is an image; Performance Lab Mind is discontinued and the two
// source descriptions conflict). Needs a verified panel before unifying.
const PRIMARY_BASELINE = new Set<string>([
  'hunter-focus-review/heroIngredients',
  'hunter-focus-review/ingredientDosages',
  'performance-lab-mind-review/heroIngredients',
  'performance-lab-mind-review/ingredientDosages',
]);
// GCC/SEA catalogues are owned by open data PRs (#266 and the GCC/SEA
// follow-up refresh), which will apply the 2026-09-28 values there.
const GCC_SEA_BASELINE = new Set<string>([
  ...['gcc', 'sea'].flatMap((r) => [
    `${r}/mind-lab-pro-review/ingredientDosages`,
    `${r}/mind-lab-pro-review/trustpilotScore`,
    `${r}/mind-lab-pro-review/trustpilotCount`,
    `${r}/noocube-review/ingredientDosages`,
    `${r}/noocube-review/heroIngredients`,
    `${r}/noocube-review/trustpilotScore`,
    `${r}/noocube-review/trustpilotCount`,
    `${r}/nootropics-depot-lions-mane/trustpilotScore`,
    `${r}/nootropics-depot-lions-mane/trustpilotCount`,
    `${r}/onnit-alpha-brain-review/trustpilotScore`,
    `${r}/onnit-alpha-brain-review/trustpilotCount`,
    `${r}/qualia-mind-review/trustpilotScore`,
    `${r}/qualia-mind-review/trustpilotCount`,
    `${r}/thesis-nootropics-review/trustpilotScore`,
    `${r}/thesis-nootropics-review/trustpilotCount`,
  ]),
  'sea/qualia-mind-review/brand',
  // SEA's record under this slug describes a different Blackmores product.
  ...FIELDS.map((f) => `sea/blackmores-brain-active-review/${f}`),
]);

const sharedSlugs = [...new Set(Object.values(CATALOGUES).flatMap((ps) => ps.map((p) => p.slug)))]
  .filter((slug) => Object.values(CATALOGUES).filter((ps) => ps.some((p) => p.slug === slug)).length > 1)
  .sort();

describe('cross-region consistency of global product facts', () => {
  test('there are shared products to check', () => {
    expect(sharedSlugs.length).toBeGreaterThan(5);
  });

  test.each(sharedSlugs)('%s: brand, formula, Trustpilot and discontinued match across regions', (slug) => {
    const carriers = Object.entries(CATALOGUES)
      .map(([region, ps]) => [region, ps.find((p) => p.slug === slug)] as const)
      .filter((e): e is readonly [string, Product] => e[1] !== undefined);
    const primary = carriers.filter(([r]) => PRIMARY.includes(r));
    const secondary = carriers.filter(([r]) => !PRIMARY.includes(r));
    const problems: string[] = [];
    for (const field of FIELDS) {
      const primaryValues = new Set(primary.map(([, p]) => value(p, field)));
      const primaryKnown = PRIMARY_BASELINE.has(`${slug}/${field}`);
      if (primaryValues.size > 1 && !primaryKnown) problems.push(`${field} differs across ${primary.map(([r]) => r).join('/')}`);
      if (primaryValues.size <= 1 && primaryKnown) problems.push(`${slug}/${field} is consistent now — remove it from PRIMARY_BASELINE`);
      const reference = primary.length > 0 ? value(primary[0][1], field) : secondary.length > 0 ? value(secondary[0][1], field) : null;
      for (const [region, p] of secondary) {
        const key = `${region}/${slug}/${field}`;
        const mismatch = value(p, field) !== reference;
        if (mismatch && !GCC_SEA_BASELINE.has(key)) problems.push(`${key} differs from the primary regions`);
        if (!mismatch && GCC_SEA_BASELINE.has(key)) problems.push(`${key} is consistent now — remove it from GCC_SEA_BASELINE`);
      }
    }
    expect(problems).toEqual([]);
  });
});
