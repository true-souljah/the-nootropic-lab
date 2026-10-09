import { describe, test, expect } from 'vitest';
import { allProductsUS } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// The TruBrain record (a 30ml liquid shot) was built on a formula that is on
// no TruBrain label: Citicoline, L-Tyrosine and Magtein (magnesium
// L-threonate). The current Strong shot's Supplement Facts
// (trubrain.com/products/fb22, checked 2026-10-08) lists vitamin C 300mg plus
// eight actives: Noopept 20mg, acetyl L-carnitine 500mg, N-acetyl tyrosine
// 350mg, centrophenoxine 250mg, magnesium (glycinate) 200mg, L-theanine 160mg,
// uridine monophosphate 500mg and caffeine 100mg. These pins keep the record
// on that label.

const trubrain = (() => {
  const p = allProductsUS.find((x) => x.slug === 'trubrain-review');
  if (!p) throw new Error('TruBrain record missing');
  return p;
})();
const row = (p: Product, name: string) => {
  const r = p.ingredientDosages.find((d) => d.name === name);
  if (!r) throw new Error(`${name} row missing`);
  return r;
};

describe('us TruBrain matches the Strong shot label', () => {
  test('the nine label rows, at the label amounts, and nothing else', () => {
    expect(trubrain.ingredientDosages.map((d) => [d.name, d.doseInProduct])).toEqual([
      ['Vitamin C (as ascorbic acid)', '300mg'],
      ['Noopept', '20mg'],
      ['Acetyl L-Carnitine', '500mg'],
      ['N-Acetyl Tyrosine', '350mg'],
      ['Centrophenoxine', '250mg'],
      ['Magnesium (Glycinate)', '200mg'],
      ['L-Theanine', '160mg'],
      ['Uridine Monophosphate', '500mg'],
      ['Caffeine', '100mg'],
    ]);
    expect(trubrain.form).toBe('shot');
    expect(trubrain.capsulesPerServing).toBe(1);
  });

  test('no ingredient the label does not list, anywhere in the record', () => {
    const all = JSON.stringify(trubrain);
    expect(all).not.toMatch(/citicoline|CDP-?choline|magtein|threonate/i);
    // Only N-acetyl tyrosine is on the label; plain L-Tyrosine is neither a row nor a hero.
    expect(trubrain.ingredientDosages.some((d) => /^L-Tyrosine/i.test(d.name))).toBe(false);
    expect(trubrain.heroIngredients).not.toContain('L-Tyrosine');
    expect(all).not.toMatch(/L-Tyrosine is a precursor/);
  });

  test('reference-dose rows carry the library anchor and the provable verdict', () => {
    expect(row(trubrain, 'Acetyl L-Carnitine')).toMatchObject({ clinicalDose: '1500-3000mg/day', adequatelyDosed: false });
    expect(row(trubrain, 'N-Acetyl Tyrosine')).toMatchObject({ clinicalDose: '2000mg/day (lowest positive trial)', adequatelyDosed: false });
    expect(row(trubrain, 'L-Theanine')).toMatchObject({ clinicalDose: '100-200mg/day', adequatelyDosed: true });
    expect(row(trubrain, 'Caffeine')).toMatchObject({ clinicalDose: '100-200mg', adequatelyDosed: true });
    for (const name of ['Vitamin C (as ascorbic acid)', 'Noopept', 'Centrophenoxine', 'Magnesium (Glycinate)', 'Uridine Monophosphate']) {
      expect(row(trubrain, name), name).toMatchObject({ clinicalDose: 'No reference dose on file', adequatelyDosed: null });
    }
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of trubrain.heroIngredients) {
      expect(trubrain.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });

  test('the label source is cited', () => {
    expect([trubrain.notes ?? []].flat().join(' ')).toMatch(/https:\/\/www\.trubrain\.com\/products\/fb22, checked 2026-10-08/);
  });
});
