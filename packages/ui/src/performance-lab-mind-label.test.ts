import { describe, test, expect } from 'vitest';
import { allProductsUS, allProductsEU, allProductsCA, allProductsAU, allProductsJP } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Performance Lab Mind is discontinued (performancelab.com/products/mind now
// redirects to Mind Lab Pro). Its last label (Wayback snapshot 2024-10-09,
// same amounts as the 2021-2023 snapshots) prints four rows per 1 NutriCap:
// Citicoline 250mg, Phosphatidylserine 100mg, L-Tyrosine 250mg and Maritime
// Pine Bark Extract 75mg. The EU record carried Lion's Mane 500mg and NALT
// 300mg (never on the 2021-2024 label), au/ca/jp said L-Tyrosine 300mg, and
// every record gave 2 capsules a serving.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['eu', allProductsEU], ['ca', allProductsCA], ['au', allProductsAU], ['jp', allProductsJP],
];

const LABEL_ROWS: [string, string, string, boolean][] = [
  ["Citicoline (stabilized cytidine 5'-diphosphocholine)", '250mg', '250-500mg/day', true],
  ['Phosphatidylserine (from sunflower lecithin)', '100mg', '100-300mg/day', true],
  ['L-Tyrosine', '250mg', '2000mg/day (lowest positive trial)', false],
  ['Maritime Pine Bark Extract (Pinus pinaster, 95% proanthocyanidins)', '75mg', '100-200mg/day', false],
];

const record = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'performance-lab-mind-review');
  if (!p) throw new Error('Performance Lab Mind record missing');
  return p;
};

describe.each(REGIONS)('%s Performance Lab Mind matches its last label', (_region, products) => {
  const p = record(products);

  test('the 4 label rows, amounts, library reference doses and verdicts', () => {
    expect(p.ingredientDosages.map((d) => [d.name, d.doseInProduct, d.clinicalDose, d.adequatelyDosed])).toEqual(LABEL_ROWS);
  });

  test('no Lion\'s Mane, NALT, NutriGenesis or 2-capsule serving anywhere in the record', () => {
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/lion.?s mane|hericium/i);
    expect(json).not.toMatch(/NALT|N-Acetyl/);
    expect(json).not.toMatch(/NutriGenesis/);
    expect(json).not.toMatch(/2 capsules/);
  });

  test('1 capsule per serving, still discontinued, archived label cited', () => {
    expect(p.capsulesPerServing).toBe(1);
    expect(p.servingsPerContainer).toBe(30);
    expect(p.discontinued?.successorSlug).toBe('mind-lab-pro-review');
    expect([p.notes ?? []].flat().join(' ')).toMatch(/web\.archive\.org\/web\/20241009212007\/https:\/\/www\.performancelab\.com\/products\/mind/);
  });

  test('every hero ingredient has its dosing row', () => {
    expect(p.heroIngredients).toEqual(['Citicoline', 'Phosphatidylserine', 'L-Tyrosine', 'Maritime Pine Bark']);
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});
