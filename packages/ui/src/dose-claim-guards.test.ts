import { describe, it, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  NO_REFERENCE_DOSE,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// The dosing pillar and every row verdict are computed from the label
// (dosing-anchors.ts, written by scripts/recompute-scores.ts). The prose in a
// product record is hand-written and drifted from them: after the recompute,
// Pre Lab Pro still said "Caffeine, L-theanine and L-tyrosine all within our
// dosing-audit ranges" (two of the three rows are false) and Performance Lab
// Caffeine 2 said two capsules "bring all three actives into the ranges used
// in our dosing audit" (copy sweep, 2026-10-09).
//
// Rule: a record may claim that ALL its ingredients are at their clinical /
// reference dose only when its rows prove it — at least one row has a
// reference dose, every such row is `true`, and no row lacks a reference dose
// (an ingredient with no reference cannot be shown adequate). Claims about one
// named ingredient ("Ginkgo at full clinical dose") are not covered here.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const REGIONS: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

/** Fields that are data, not prose. Every other string in the record is scanned. */
const NOT_PROSE = new Set([
  'ingredientDosages', 'scoreBreakdown', 'slug', 'id', 'affiliateUrl', 'affiliateNetwork', 'commissionRate',
  'affiliate_program', 'url', 'source_url',
]);

/** Claims that every ingredient (or "all" the actives) meets its clinical / reference dose. */
const ALL_DOSED_CLAIMS: RegExp[] = [
  // "every ingredient at its clinical dose", "all three actives into the ranges used in our dosing audit"
  /\b(?:every|each|all)\b(?:(?!\b(?:only|but|though|except|not|none|no)\b)[^.;:]){0,60}?\b(?:ingredients?|actives?|components?)\b[^.;:]{0,40}?\b(?:at|meets?|meeting|reach(?:es|ing)?|within|in line with|match(?:es|ing)?|into)\b[^.;:]{0,40}?\b(?:clinical(?:ly)?|effective|reference|research|trial|studied|therapeutic|dosing[- ]audit)\b/i,
  // "Caffeine, L-theanine and L-tyrosine all within our dosing-audit ranges"
  /\ball (?:within|at|in) (?:our|the) (?:dosing[- ]audit|clinical|reference|effective|research|trial)\b/i,
  /\ball within the ranges (?:in|used in) our dosing audit\b/i,
  // "all ingredients clinically dosed", "every ingredient fully dosed"
  /\b(?:every|each|all)\b[^.;:]{0,50}?\b(?:fully|properly|adequately|correctly|clinically)[- ]dosed\b/i,
  // "fully dosed formula", "a clinically dosed stack"
  /(?<!\bnot\s)(?<!\bnever\s)\bfully[- ]dosed\b/i,
  /(?<!\bnot\s)\b(?:properly|adequately|clinically)[- ]dosed (?:formula|stack|product|blend)\b/i,
];

function proseStrings(value: unknown, path: string, out: Array<[string, string]>): Array<[string, string]> {
  if (typeof value === 'string') out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => proseStrings(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (!NOT_PROSE.has(k)) proseStrings(v, path ? `${path}.${k}` : k, out);
    }
  }
  return out;
}

const claimsAllDosed = (text: string) => ALL_DOSED_CLAIMS.some((rx) => rx.test(text));

/** Whether the rows prove every ingredient is at its reference dose. */
function rowsProveAllDosed(product: Product): boolean {
  const anchored = product.ingredientDosages.filter((r) => r.clinicalDose !== NO_REFERENCE_DOSE);
  const unreferenced = product.ingredientDosages.length - anchored.length;
  return anchored.length > 0 && unreferenced === 0 && anchored.every((r) => r.adequatelyDosed === true);
}

function violations(product: Product): string[] {
  if (rowsProveAllDosed(product)) return [];
  return proseStrings(product, '', [])
    .filter(([, text]) => claimsAllDosed(text))
    .map(([path, text]) => `${product.slug}.${path}: ${text}`);
}

describe('the all-ingredients-dosed claim patterns', () => {
  it.each([
    'Every ingredient at its clinical dose',
    'every ingredient is dosed at the clinical-trial dose',
    'Each active meets its reference dose',
    'All ingredients clinically dosed',
    'A fully dosed formula',
    'a clinically-dosed stack',
    'Caffeine, L-theanine and L-tyrosine all within our dosing-audit ranges',
    'One 13g scoop gives 80mg natural caffeine, 160mg L-theanine and 400mg L-tyrosine, all within the ranges in our dosing audit, plus a 2,200mg blend',
    'two capsules (100mg caffeine, 200mg L-theanine, 500mg L-tyrosine) bring all three actives into the ranges used in our dosing audit.',
  ])('flags "%s"', (text) => {
    expect(claimsAllDosed(text)).toBe(true);
  });

  it.each([
    'Every dose disclosed on the label, no proprietary blend',
    'Every ingredient amount disclosed',
    'Every dose is disclosed, though only citicoline, phosphatidylserine and L-theanine meet our reference doses.',
    'No active meets a reference dose in our dosing audit: acetyl-L-carnitine is below ours, and the other four have none on our ingredient pages',
    'Ginkgo at full clinical dose (500mg extract, 120mg flavone glycosides)',
    'two capsules bring caffeine and L-theanine to our reference doses, while L-tyrosine stays below our 2,000mg reference dose.',
    'Not fully dosed: two of four ingredients are below our reference doses',
  ])('does not flag "%s"', (text) => {
    expect(claimsAllDosed(text)).toBe(false);
  });
});

describe('product prose claims all ingredients are dosed only when the rows prove it', () => {
  const records = Object.entries(REGIONS).flatMap(([region, products]) => products.map((p) => ({ region, p })));

  it('scans every region and a non-empty set of records and prose strings (fail-closed)', () => {
    for (const [region, products] of Object.entries(REGIONS)) expect(products.length, region).toBeGreaterThan(0);
    // 78 records since #349 dropped BRAINEFFECT FOCUS (EU) on 2026-10-09; 79 before.
    expect(records.length).toBeGreaterThanOrEqual(78);
    const strings = records.reduce((n, { p }) => n + proseStrings(p, '', []).length, 0);
    expect(strings).toBeGreaterThan(1000);
  });

  it.each(records.map(({ region, p }) => [`${region}/${p.slug}`, p] as const))('%s', (_id, product) => {
    expect(violations(product)).toEqual([]);
  });

  it('would have caught the pre-sweep Pre Lab Pro and Caffeine 2 copy', () => {
    const preLabPro = allProductsUS.find((p) => p.slug === 'pre-lab-pro-review')!;
    const caffeine2 = allProductsUS.find((p) => p.slug === 'performance-lab-caffeine-2-review')!;
    expect(preLabPro && caffeine2).toBeTruthy();
    expect(violations({ ...preLabPro, pros: ['Caffeine, L-theanine and L-tyrosine all within our dosing-audit ranges'] })).toHaveLength(1);
    expect(
      violations({ ...caffeine2, whatToExpect: 'two capsules (100mg caffeine, 200mg L-theanine, 500mg L-tyrosine) bring all three actives into the ranges used in our dosing audit.' }),
    ).toHaveLength(1);
  });
});
