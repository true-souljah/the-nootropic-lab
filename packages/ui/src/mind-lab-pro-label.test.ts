import { describe, test, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Mind Lab Pro records listed 7 of the label's 11 rows (no Maritime Pine Bark
// 75mg, no NutriGenesis B6/B9/B12) and marked Lion's Mane 500mg adequately
// dosed against a 500mg "clinical dose", while the site's Lion's Mane page puts
// the trial range at 1000-1800mg/day. Every panel checked on 2026-10-08
// (www, eu, uk, ca and au storefronts) prints the same 11 amounts per 2
// NutriCaps; jp/gcc/latam/sea buyers order from www.mindlabpro.com.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['eu', allProductsEU], ['ca', allProductsCA], ['au', allProductsAU],
  ['jp', allProductsJP], ['latam', allProductsLatam], ['gcc', allProductsGCC], ['sea', allProductsSEA],
];

const LABEL_ROWS: [string, string][] = [
  ["Lion's Mane Mushroom", '500mg'],
  ['Citicoline (Cognizin)', '250mg'],
  ['Bacopa Monnieri (full-spectrum extract, 24% bacosides)', '150mg'],
  ['Rhodiola Rosea (3% rosavins, 1% salidrosides)', '50mg'],
  ['L-Theanine', '100mg'],
  ['Phosphatidylserine', '100mg'],
  ['N-Acetyl L-Tyrosine (NALT)', '175mg'],
  ['Maritime Pine Bark Extract (95% proanthocyanidins)', '75mg'],
  ['Vitamin B6 (NutriGenesis)', '2.5mg'],
  ['Vitamin B9 (NutriGenesis)', '100mcg'],
  ['Vitamin B12 (NutriGenesis)', '7.5mcg'],
];

// [row, library clinicalDose, verdict]
const ANCHORED: [string, string, boolean][] = [
  ["Lion's Mane Mushroom", '1000-1800mg/day', false],
  ['Citicoline (Cognizin)', '250-500mg/day', true],
  ['Bacopa Monnieri (full-spectrum extract, 24% bacosides)', '300-450mg/day (55% bacosides)', false],
  ['Rhodiola Rosea (3% rosavins, 1% salidrosides)', '200-600mg/day', false],
  ['L-Theanine', '100-200mg/day', true],
  ['Phosphatidylserine', '100-300mg/day', true],
  ['N-Acetyl L-Tyrosine (NALT)', '2000mg/day (lowest positive trial)', false],
  ['Maritime Pine Bark Extract (95% proanthocyanidins)', '100-200mg/day', false],
];

const record = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'mind-lab-pro-review');
  if (!p) throw new Error('Mind Lab Pro record missing');
  return p;
};
const row = (p: Product, name: string) => {
  const r = p.ingredientDosages.find((d) => d.name === name);
  if (!r) throw new Error(`${name} row missing`);
  return r;
};

describe.each(REGIONS)('%s Mind Lab Pro matches its label', (_region, products) => {
  const p = record(products);

  test('the 11 label rows with the printed amounts', () => {
    expect(p.ingredientDosages.map((d) => [d.name, d.doseInProduct])).toEqual(LABEL_ROWS);
  });

  test('reference-dose rows carry the library string and the label-proven verdict', () => {
    for (const [name, clinicalDose, verdict] of ANCHORED) {
      expect(row(p, name), name).toMatchObject({ clinicalDose, adequatelyDosed: verdict });
    }
    for (const name of ['Vitamin B6 (NutriGenesis)', 'Vitamin B9 (NutriGenesis)', 'Vitamin B12 (NutriGenesis)']) {
      expect(row(p, name), name).toMatchObject({ clinicalDose: 'No reference dose on file', adequatelyDosed: null });
    }
  });

  test('no copy calls the formula clinically dosed across the board', () => {
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/at clinical doses/i);
    expect(json).not.toMatch(/Most ingredients are clinically dosed/i);
  });

  test('2 NutriCaps per serving and the label source in notes', () => {
    expect(p.capsulesPerServing).toBe(2);
    expect([p.notes ?? []].flat().join(' ')).toMatch(/mindlabpro\.com\/products\/mind-lab-pro/);
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});
