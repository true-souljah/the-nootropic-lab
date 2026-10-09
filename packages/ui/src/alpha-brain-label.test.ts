import { describe, test, expect } from 'vitest';
import {
  allProductsUS, allProductsCA, allProductsAU, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Onnit Alpha Brain records were built from a formula that is not the
// product's: they listed Lion's Mane, marked every dose "Undisclosed" and
// claimed a 90-day guarantee. The label (onnit.com/products/alpha-brain-90-ct,
// checked 2026-10-08) states blend totals plus Bacopa 100mg and Huperzine A
// 400mcg; Onnit's guarantee is 30 days. These pins keep all six regional
// records on the label.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['ca', allProductsCA], ['au', allProductsAU],
  ['latam', allProductsLatam], ['gcc', allProductsGCC], ['sea', allProductsSEA],
];

const alphaBrain = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'onnit-alpha-brain-review');
  if (!p) throw new Error('Alpha Brain record missing');
  return p;
};
const row = (p: Product, name: string) => {
  const r = p.ingredientDosages.find((d) => d.name.startsWith(name));
  if (!r) throw new Error(`${name} row missing`);
  return r;
};

describe.each(REGIONS)('%s Alpha Brain matches its label', (_region, products) => {
  const p = alphaBrain(products);

  test('no ingredient the label does not list', () => {
    expect(p.ingredientDosages.map((d) => d.name).join(' ')).not.toMatch(/lion/i);
    expect(p.heroIngredients.join(' ')).not.toMatch(/lion/i);
  });

  test('stated amounts and blend bounds drive the verdicts', () => {
    expect(row(p, 'Bacopa Monnieri')).toMatchObject({ doseInProduct: '100mg', adequatelyDosed: false });
    expect(row(p, 'Alpha-GPC').adequatelyDosed).toBe(false); // ≤140mg in the 240mg blend vs 300mg minimum
    expect(row(p, 'L-Tyrosine').adequatelyDosed).toBe(false); // whole 650mg blend < 7–10g trial dose
    expect(row(p, 'Huperzine A')).toMatchObject({ doseInProduct: '400mcg', adequatelyDosed: true });
    for (const name of ['L-Theanine', 'Phosphatidylserine', 'Oat Straw', "Cat's Claw", 'Vitamin B6', 'L-Leucine']) {
      expect(row(p, name).adequatelyDosed, name).toBeNull(); // not verifiable — never shown as under-dosed
    }
  });

  test('30-day guarantee, sourced — no 90-day claim anywhere in the record', () => {
    expect(p.moneyBackDays).toBe(30);
    // Whole record, every field and language form ("90-day", "90 días", …).
    expect(JSON.stringify(p)).not.toMatch(/90\s*-?\s*(day|días|dias|jours|tage|日)/i);
    expect([p.notes ?? []].flat().join(' ')).toMatch(/help\.onnit\.com\/en-US\/30-day-money-back-guarantee/);
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});

test('the cancel-Onnit page states the 30-day, first-purchase guarantee (no 90-day claim, no RMA)', async () => {
  const { readFileSync } = await import('node:fs');
  const page = readFileSync(new URL('../../../apps/us/src/app/cancel-onnit-subscription/page.tsx', import.meta.url), 'utf8');
  expect(page).not.toMatch(/90-day money-back/);
  expect(page).not.toMatch(/RMA/);
  expect(page).toMatch(/30-day money-back guarantee covers the first purchase of each product/);
});
