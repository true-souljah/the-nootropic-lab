import { describe, test, expect } from 'vitest';
import { allProductsAU, allProductsSEA } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Both Blackmores Brain Active records described another product (AU: Bacopa,
// Ginkgo, B5, B12, iodine; SEA: Keenmind Bacopa, Ginkgo, DHA,
// phosphatidylserine). Blackmores' own pages — AU Wayback 2015-01-13 and
// 2019-05-31, SG Wayback 2021-05-06, and the live Blackmores Vietnam page —
// list ONE active per capsule: Curcuma longa (turmeric) extract (Longvida®)
// 400mg, equivalent to curcumin 80mg, one capsule a day. These pins keep both
// records on that label.

const REGIONS: [string, readonly Product[]][] = [['au', allProductsAU], ['sea', allProductsSEA]];

const brainActive = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'blackmores-brain-active-review');
  if (!p) throw new Error('Blackmores Brain Active record missing');
  return p;
};

describe.each(REGIONS)('%s Blackmores Brain Active matches its label', (_region, products) => {
  const p = brainActive(products);

  test('one row: Longvida curcumin, no reference dose on file', () => {
    expect(p.ingredientDosages).toEqual([
      {
        name: 'Curcuma longa extract (turmeric, Longvida®)',
        doseInProduct: '400mg (80mg curcumin)',
        clinicalDose: 'No reference dose on file',
        adequatelyDosed: null,
      },
    ]);
    expect(p.capsulesPerServing).toBe(1);
    expect(p.servingsPerContainer).toBe(30); // AU and SG pages: 30-capsule pack, one a day
  });

  test('no ingredient the label does not list, anywhere in the record', () => {
    expect(JSON.stringify(p)).not.toMatch(/bacopa|brahmi|keenmind|ginkgo|iodine|phosphatidylserine|\bDHA\b|pantothenic|B12|\bB5\b/i);
  });

  test('every hero ingredient has its dosing row', () => {
    expect(p.heroIngredients.length).toBeGreaterThan(0);
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });

  test('the label source is cited (Wayback, product discontinued)', () => {
    expect([p.notes ?? []].flat().join(' ')).toMatch(/https:\/\/web\.archive\.org\/web\/\d{14}id_\/https:\/\/www\.blackmores\.com\.(au|sg)\/products\/brain-active/i);
  });
});

describe('discontinued notes state each market\'s own facts', () => {
  const au = brainActive(allProductsAU);
  const sea = brainActive(allProductsSEA);

  test('same discontinuation date in both markets', () => {
    expect(sea.discontinued?.since).toBe(au.discontinued?.since);
  });

  test('the SEA note cites SEA facts only', () => {
    const note = sea.discontinued?.note ?? '';
    expect(note).toMatch(/Blackmores Singapore no longer has a Brain Active product page \(checked 8 October 2026\)/);
    expect(note).toContain('https://www.blackmores.com.vn/en/products/brain-active');
    expect(note).not.toMatch(/blackmores\.com\.au|Chemist Warehouse|Cognition Ultra|Omega Brain/);
  });

  test('the AU note is unchanged', () => {
    expect(au.discontinued?.note).toBe('No longer listed on blackmores.com.au or at Chemist Warehouse; Blackmores now sells Cognition Ultra / Omega Brain.');
  });
});

test('the AU comparison page and Bacopa note no longer call Brain Active a Bacopa product', async () => {
  const { readFileSync } = await import('node:fs');
  const page = readFileSync(new URL('../../../apps/au/src/app/blackmores-brain-active-vs-mind-lab-pro/page.tsx', import.meta.url), 'utf8');
  expect(page).not.toMatch(/Both contain Bacopa|Bacopa \+ Ginkgo \+ B-vitamins|higher Ginkgo dose/);
  expect(page).toMatch(/Blackmores Brain Active contained no Bacopa/);
  const note = readFileSync(new URL('../../data/src/regional-notes/au.ts', import.meta.url), 'utf8');
  expect(note).not.toMatch(/Blackmores Brain Active, lists Bacopa/);
});
