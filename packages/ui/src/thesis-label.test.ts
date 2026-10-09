import { describe, test, expect } from 'vitest';
import { allProductsUS, allProductsLatam, allProductsGCC, allProductsSEA } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// The Thesis records listed one row set (KSM-66 Ashwagandha 300mg, Alpha-GPC,
// Zynamite, Dynamine, L-Theanine) that matches none of Thesis's formulas:
// Alpha-GPC and Zynamite are on no current label, and the only ashwagandha is
// 120mg in Stress Reset. Operator decision 2026-10-09: list the rows of the
// four formulas whose ingredient lists Thesis publishes (takethesis.com
// Clarity, Motivation, Stress Reset, Neuroprotection, checked 2026-10-08),
// each row suffixed with its formula. The Energy, Logic, Creativity and
// Confidence pages returned 404. Thesis directs two capsules daily.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['latam', allProductsLatam], ['gcc', allProductsGCC], ['sea', allProductsSEA],
];
const FORMULAS = ['Clarity', 'Motivation', 'Stress Reset', 'Neuroprotection'] as const;

const thesis = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'thesis-nootropics-review');
  if (!p) throw new Error('Thesis record missing');
  return p;
};
const row = (p: Product, name: string) => {
  const r = p.ingredientDosages.find((d) => d.name === name);
  if (!r) throw new Error(`${name} row missing`);
  return r;
};
const prose = (p: Product) =>
  [p.summary, p.whatItIs, p.howItWorks, p.whatToExpect, ...p.pros, ...p.cons, ...[p.notes ?? []].flat()].join(' ');

describe.each(REGIONS)('%s Thesis matches its four published formulas', (_region, products) => {
  const p = thesis(products);

  test('every row names its formula, with the label count per formula', () => {
    const count = (f: string) => p.ingredientDosages.filter((d) => d.name.endsWith(`(${f})`)).length;
    expect(FORMULAS.map(count)).toEqual([6, 8, 8, 12]);
    expect(p.ingredientDosages).toHaveLength(34);
    expect(p.capsulesPerServing).toBe(2);
  });

  test('key label amounts', () => {
    expect(row(p, 'CDP Choline (Clarity)').doseInProduct).toBe('250mg');
    // FORMULA-SPEC §8 (§7F): the label does not say whether these amounts are per capsule
    // or per serving (2 capsules), and whether the Rhodiola amount is extract or salidroside.
    expect(row(p, "Lion's Mane (Hericium erinaceus) (Clarity)").doseInProduct).toBe('500mg per capsule or per serving (not stated)');
    expect(row(p, 'Rhodiola Rosea (fermented salidrosides) (Motivation)').doseInProduct).toBe('60mg (basis not stated)');
    expect(row(p, 'Rhodiola Rosea (fermented salidrosides) (Stress Reset)').doseInProduct).toBe('30mg (basis not stated)');
    expect(row(p, 'Dynamine (methylliberine) (Motivation)').doseInProduct).toBe('100mg');
    expect(row(p, 'N-Acetyl-L-Tyrosine (NALT) (Motivation)').doseInProduct).toBe('400mg');
    expect(row(p, 'Caffeine Anhydrous (Motivation)').doseInProduct).toBe('150mg');
    expect(row(p, 'Ashwagandha (Withania somnifera) (Stress Reset)').doseInProduct).toBe('120mg');
    expect(row(p, 'Saffron (Crocus sativus) (Stress Reset)').doseInProduct).toBe('28mg');
    expect(row(p, 'Bacopa Monnieri (Neuroprotection)').doseInProduct).toBe('300mg');
    expect(row(p, 'Ginkgo Biloba (Neuroprotection)').doseInProduct).toBe('120mg per capsule or per serving (not stated)');
    expect(row(p, 'Selenium (amino acid chelate) (Neuroprotection)').doseInProduct).toBe('200mcg');
    // Caffeinated-capsule rows keep the label's "capsules with caffeine" wording.
    for (const f of ['Clarity', 'Stress Reset', 'Neuroprotection']) {
      expect(row(p, `Caffeine Anhydrous (capsules with caffeine only) (${f})`).doseInProduct).toBe('100mg');
    }
  });

  test('no ingredient the labels do not list, anywhere in the record', () => {
    expect(JSON.stringify(p)).not.toMatch(/alpha-?gpc|zynamite|mango leaf/i);
    expect(p.ingredientDosages.map((d) => d.name).join(' ')).not.toMatch(/KSM/i);
    expect(prose(p)).not.toMatch(/KSM-66|Energy blend|Logic blend|Energy, Clarity, Logic/);
  });

  test('anchored rows carry the library dose and the verdict the label proves', () => {
    expect(row(p, 'CDP Choline (Clarity)')).toMatchObject({ clinicalDose: '250-500mg/day', adequatelyDosed: true });
    expect(row(p, 'Dynamine (methylliberine) (Motivation)')).toMatchObject({ clinicalDose: '100-150mg/day', adequatelyDosed: true });
    expect(row(p, 'L-Theanine (Camellia sinensis) (Motivation)')).toMatchObject({ clinicalDose: '100-200mg/day', adequatelyDosed: true });
    expect(row(p, 'Caffeine Anhydrous (Motivation)')).toMatchObject({ clinicalDose: '100-200mg', adequatelyDosed: true });
    // Below the minimum even if the amounts were per capsule (x2): 800 < 2000, 240 < 300.
    expect(row(p, 'N-Acetyl-L-Tyrosine (NALT) (Motivation)')).toMatchObject({ clinicalDose: '2000mg/day (lowest positive trial)', adequatelyDosed: false });
    expect(row(p, 'Ashwagandha (Withania somnifera) (Stress Reset)')).toMatchObject({ clinicalDose: '300-600mg/day (KSM-66)', adequatelyDosed: false });
    // Not provable: per-serving basis unprinted for Clarity/Neuroprotection (a per-capsule
    // reading would meet the minimum), Rhodiola is a fermented-salidroside basis, and
    // the Bacopa amount names no extract or bacoside content.
    expect(row(p, "Lion's Mane (Hericium erinaceus) (Clarity)")).toMatchObject({ clinicalDose: '1000-1800mg/day', adequatelyDosed: null });
    expect(row(p, 'Ginkgo Biloba (Neuroprotection)')).toMatchObject({ clinicalDose: '240mg/day (24/6 extract)', adequatelyDosed: null });
    expect(row(p, 'Bacopa Monnieri (Neuroprotection)')).toMatchObject({ clinicalDose: '300-450mg/day (55% bacosides)', adequatelyDosed: null });
    for (const f of ['Motivation', 'Stress Reset']) {
      expect(row(p, `Rhodiola Rosea (fermented salidrosides) (${f})`)).toMatchObject({ clinicalDose: '200-600mg/day', adequatelyDosed: null });
    }
    for (const r of p.ingredientDosages.filter((d) => d.clinicalDose === 'No reference dose on file')) {
      expect(r.adequatelyDosed, r.name).toBeNull();
    }
  });

  test('copy says which formulas the rows cover and which pages were gone', () => {
    expect(p.whatItIs).toMatch(/cover the four formulas whose labels Thesis publishes/);
    expect(p.whatItIs).toMatch(/Energy, Logic, Creativity and Confidence product pages returned 404 when we checked on 8 October 2026/);
    const notes = [p.notes ?? []].flat().join(' ');
    for (const f of ['clarity', 'motivation', 'stress-reset', 'neuroprotection']) {
      expect(notes).toContain(`https://takethesis.com/products/${f}`);
    }
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});

test('listicles and the comparison page describe the published formulas only', async () => {
  const { readFileSync } = await import('node:fs');
  const pages = [
    'us/src/app/best-nootropics-for-studying', 'us/src/app/best-nootropics-for-focus', 'us/src/app/best-nootropics-for-mood',
    'us/src/app/best-nootropics-for-energy', 'us/src/app/natural-adderall-alternatives', 'us/src/app/mind-lab-pro-vs-thesis',
    'latam/src/app/best-nootropics-for-studying', 'gcc/src/app/best-nootropics-for-studying',
  ];
  for (const path of pages) {
    const page = readFileSync(new URL(`../../../apps/${path}/page.tsx`, import.meta.url), 'utf8');
    expect(page, path).not.toMatch(/"Logic"|"Energy" formula|Their Energy formula|Energy, Clarity, Logic|Clarity \/ Logic|L-tyrosine \+ saffron|Each blend has a caffeine-free variant/);
    // The Thesis entry itself (other products on the page do list Alpha-GPC).
    const start = page.indexOf("'thesis-nootropics-review'");
    if (start >= 0) {
      const entry = page.slice(start, page.indexOf('},', start));
      expect(entry, path).not.toMatch(/Alpha-GPC|Zynamite|KSM-66/);
    }
  }
});
