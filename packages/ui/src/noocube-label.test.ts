import { describe, test, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// NooCube records said Panax Ginseng "200:1", choline 250mg and Cat's Claw
// "Undisclosed", missed four label rows and gave 4 capsules a serving. The
// Supplement Facts image on noocube.com (noocube-label-usa-v3.jpg, checked
// 2026-10-08) prints 12 rows per 2-capsule serving: B1 1.1mg, B12 2.5mcg,
// Biotin 50mcg, Choline 100mg (from 250mg choline bitartrate), Bacopa 250mg
// (20% bacosides), L-Tyrosine 250mg, Cat's Claw 175mg (4:1), L-Theanine 100mg,
// Panax Ginseng 20mg (8:1), Lutemax 2020 20mg, Trans-Resveratrol 14.3mg,
// Pterostilbene 140mcg. One formula is sold worldwide from noocube.com; the UK
// and AU storefronts list the same amounts.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['eu', allProductsEU], ['ca', allProductsCA], ['au', allProductsAU],
  ['jp', allProductsJP], ['latam', allProductsLatam], ['gcc', allProductsGCC], ['sea', allProductsSEA],
];

const LABEL_ROWS: [string, string][] = [
  ['Vitamin B1 (Thiamine HCl)', '1.1mg'],
  ['Vitamin B12 (Cyanocobalamin)', '2.5mcg'],
  ['Biotin (D-Biotin)', '50mcg'],
  ['Choline (VitaCholine)', '100mg (from 250mg Choline Bitartrate)'],
  ['Bacopa Monnieri Extract (herb, 20% bacosides)', '250mg'],
  ['L-Tyrosine', '250mg'],
  ["Cat's Claw Concentrated Extract (Uncaria tomentosa bark)", '175mg (4:1 extract)'],
  ['L-Theanine', '100mg'],
  ['Panax Ginseng Concentrated Extract', '20mg (8:1 extract, equivalent to 160mg Panax Ginseng powder)'],
  ['Lutemax 2020 (Marigold Flower Extract, Tagetes erecta)', '20mg'],
  ['Trans-Resveratrol (Polygonum cuspidatum root)', '14.3mg'],
  ['Pterostilbene', '140mcg'],
];

const record = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'noocube-review');
  if (!p) throw new Error('NooCube record missing');
  return p;
};
const row = (p: Product, name: string) => {
  const r = p.ingredientDosages.find((d) => d.name === name);
  if (!r) throw new Error(`${name} row missing`);
  return r;
};

describe.each(REGIONS)('%s NooCube matches its label', (_region, products) => {
  const p = record(products);

  test('the 12 label rows with the printed amounts, nothing else', () => {
    expect(p.ingredientDosages.map((d) => [d.name, d.doseInProduct])).toEqual(LABEL_ROWS);
  });

  test('no wrong ratio, undisclosed dose or 250mg choline claim anywhere in the record', () => {
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/200:1/);
    expect(json).not.toMatch(/Undisclosed/i);
    expect(json).not.toMatch(/VitaCholine \(250mg\)/);
  });

  test('reference-dose rows carry the library string and the label-proven verdict', () => {
    expect(row(p, 'Bacopa Monnieri Extract (herb, 20% bacosides)')).toMatchObject({ clinicalDose: '300-450mg/day (55% bacosides)', adequatelyDosed: false });
    expect(row(p, 'L-Tyrosine')).toMatchObject({ clinicalDose: '2000mg/day (lowest positive trial)', adequatelyDosed: false });
    expect(row(p, 'L-Theanine')).toMatchObject({ clinicalDose: '100-200mg/day', adequatelyDosed: true });
    expect(row(p, 'Lutemax 2020 (Marigold Flower Extract, Tagetes erecta)')).toMatchObject({ clinicalDose: '12-27mg/day', adequatelyDosed: true });
    for (const name of ['Vitamin B1 (Thiamine HCl)', 'Choline (VitaCholine)', "Cat's Claw Concentrated Extract (Uncaria tomentosa bark)", 'Panax Ginseng Concentrated Extract', 'Pterostilbene']) {
      expect(row(p, name), name).toMatchObject({ clinicalDose: 'No reference dose on file', adequatelyDosed: null });
    }
  });

  test('2 capsules per serving, 30 servings, label source in notes', () => {
    expect(p.capsulesPerServing).toBe(2);
    expect(p.servingsPerContainer).toBe(30);
    expect([p.notes ?? []].flat().join(' ')).toMatch(/noocube-label-usa-v3\.jpg/);
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});
