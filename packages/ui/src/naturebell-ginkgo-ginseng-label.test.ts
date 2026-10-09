import { describe, test, expect } from 'vitest';
import { allProductsUS, allProductsCA, allProductsAU, allProductsSEA } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// NatureBell Ginkgo + Ginseng records said "Ginkgo 50:1, 120mg" and ginseng
// 10mg. The Supplement Facts image on naturebellusa.com (checked 2026-10-08)
// prints per 2 capsules: Ginkgo Biloba Extract (leaf) 500mg, a 12:1 extract
// standardised to 120mg ginkgo flavone glycosides, and Korean Red Ginseng
// Extract (Panax ginseng root) 50mg. Both the extract weight (500 >= 240mg)
// and the marker (120 >= 57.6mg flavone glycosides) meet the library minimum.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['ca', allProductsCA], ['au', allProductsAU], ['sea', allProductsSEA],
];

const LABEL_ROWS: [string, string, string, boolean | null][] = [
  ['Ginkgo Biloba Extract (leaf)', '500mg (12:1 extract; 120mg ginkgo flavone glycosides)', '240mg/day (24/6 extract)', true],
  ['Korean Red Ginseng Extract (Panax ginseng root)', '50mg', 'No reference dose on file', null],
];

const record = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'naturebell-ginkgo-ginseng-review');
  if (!p) throw new Error('NatureBell record missing');
  return p;
};

describe.each(REGIONS)('%s NatureBell Ginkgo + Ginseng matches its label', (_region, products) => {
  const p = record(products);

  test('the 2 label rows, amounts, reference dose and verdicts', () => {
    expect(p.ingredientDosages.map((d) => [d.name, d.doseInProduct, d.clinicalDose, d.adequatelyDosed])).toEqual(LABEL_ROWS);
  });

  test('no 50:1 ratio, 120mg-extract or 10mg-ginseng claim anywhere in the record', () => {
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/50:1/);
    expect(json).not.toMatch(/\b10mg\b/);
    expect(json).not.toMatch(/120mg(?! (ginkgo )?flavone glycosides)/);
  });

  test('2 capsules per serving, 150 servings, label source in notes', () => {
    expect(p.capsulesPerServing).toBe(2);
    expect(p.servingsPerContainer).toBe(150);
    expect([p.notes ?? []].flat().join(' ')).toMatch(/newbottleamazonpic2-03/);
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});
