import { describe, test, expect } from 'vitest';
import { allProductsEU } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// The BRAINEFFECT FOCUS record listed caffeine 80mg, vitamin B6 and Ginkgo, 3
// capsules a day and caffeineFree: false. The latest label (brain-effect.com
// Focus Kapseln, Wayback 2025-08-24) is per 2 capsules (Tagesdosis): Citicolin
// 450mg, Acetyl-L-Carnitin 212mg, Brahmi-Extrakt 460mg (92mg Bacopaside),
// Ginseng-Extrakt 50mg (40mg Ginsenoide), Pantothensäure 12mg, Zink 2.5mg,
// Schwarzer-Pfeffer-Extrakt 2.1mg (piperine 2.0mg) and Vitamin B12 4.0µg — and
// the page says "in den Kapseln kein Koffein". Black pepper/piperine gets no
// row (site convention for absorption enhancers, ubernet-catalogue.test.ts).

const focus = (() => {
  const p = allProductsEU.find((x) => x.slug === 'braineffect-focus-review');
  if (!p) throw new Error('BRAINEFFECT FOCUS record missing');
  return p;
})();
const row = (p: Product, name: string) => {
  const r = p.ingredientDosages.find((d) => d.name === name);
  if (!r) throw new Error(`${name} row missing`);
  return r;
};

describe('eu BRAINEFFECT FOCUS matches its latest label', () => {
  test('the label rows, at the label amounts, per 2-capsule daily dose', () => {
    expect(focus.ingredientDosages.map((d) => [d.name, d.doseInProduct])).toEqual([
      ['Citicoline (CDP-Choline)', '450mg'],
      ['Acetyl-L-Carnitine', '212mg'],
      ['Bacopa Monnieri (Brahmi extract)', '460mg (92mg bacopasides)'],
      ['Panax Ginseng (extract, stem and root)', '50mg (40mg ginsenosides)'],
      ['Pantothenic Acid (Vitamin B5)', '12mg'],
      ['Zinc', '2.5mg'],
      ['Vitamin B12', '4.0mcg'],
    ]);
    expect(focus.capsulesPerServing).toBe(2);
    expect(focus.servingsPerContainer).toBe(30); // 60 capsules per pack
  });

  test('caffeine-free, and no ingredient the label does not list, anywhere in the record', () => {
    expect(focus.caffeineFree).toBe(true);
    expect(focus.ingredientDosages.map((d) => d.name).join(' ')).not.toMatch(/caffeine|B6|ginkgo|pepper|piperin/i);
    expect(focus.heroIngredients.join(' ')).not.toMatch(/caffeine|ginkgo|B6|B complex/i);
    const all = JSON.stringify(focus);
    expect(all).not.toMatch(/ginkgo|\bB6\b|80mg/i);
    expect(all).not.toMatch(/caffeine-based|contains caffeine|from caffeine|caffeine \(80/i);
  });

  test('reference-dose rows carry the library anchor and the provable verdict', () => {
    expect(row(focus, 'Citicoline (CDP-Choline)')).toMatchObject({ clinicalDose: '250-500mg/day', adequatelyDosed: true });
    expect(row(focus, 'Acetyl-L-Carnitine')).toMatchObject({ clinicalDose: '1500-3000mg/day', adequatelyDosed: false });
    // Extract weight meets 300mg, but the printed marker (92mg) is below 165mg bacosides.
    expect(row(focus, 'Bacopa Monnieri (Brahmi extract)')).toMatchObject({ clinicalDose: '300-450mg/day (55% bacosides)', adequatelyDosed: false });
    for (const name of ['Panax Ginseng (extract, stem and root)', 'Pantothenic Acid (Vitamin B5)', 'Zinc', 'Vitamin B12']) {
      expect(row(focus, name), name).toMatchObject({ clinicalDose: 'No reference dose on file', adequatelyDosed: null });
    }
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of focus.heroIngredients) {
      expect(focus.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });

  test('the label source is cited (Wayback, product discontinued)', () => {
    expect([focus.notes ?? []].flat().join(' ')).toContain(
      'https://web.archive.org/web/20250824202832id_/https://www.brain-effect.com/focus-kapseln-pantothensaeure',
    );
  });
});

test('the BRAINEFFECT vs Mind Lab Pro page no longer says FOCUS contained caffeine', async () => {
  const { readFileSync } = await import('node:fs');
  const page = readFileSync(new URL('../../../apps/eu/src/app/braineffect-vs-mind-lab-pro/page.tsx', import.meta.url), 'utf8');
  expect(page).not.toMatch(/80mg of caffeine|for caffeine, Panax Ginseng, Ginkgo/);
});
