import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
  allProductsUS, allProductsCA, allProductsAU, allProductsEU, allProductsJP,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// The five Hunter Focus records carried three different row sets, none of
// them the product's: the US set listed N-Acetyl L-Cysteine (not on the
// label), seven wrong amounts and no ALCAR, Ginkgo, Spanish Sage or K2; the EU
// set called it a "9-ingredient" formula. Roar Ambition sells one formula. Its
// Supplement Facts image (roarambition.com gallery; the same 20 rows as
// hunterevolve.com/en-us/hunter-focus, checked 2026-10-08) lists 20 rows per
// 6-capsule daily serving, every amount stated. These pins keep all five
// regional records on that label.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['ca', allProductsCA], ['au', allProductsAU],
  ['eu', allProductsEU], ['jp', allProductsJP],
];

// [row name, amount as the label prints it], in label order.
const LABEL: [string, string][] = [
  ['Vitamin B6 (Pyridoxal-5-phosphate)', '2.5mg'],
  ['Vitamin B9', '100mcg'],
  ['Vitamin B12 (Methylcobalamin)', '7.5mcg'],
  ['Vitamin C (Ascorbic Acid)', '200mg'],
  ['Vitamin D3 (Cholecalciferol)', '75mcg'],
  ['Vitamin K2 (MK7)', '100mcg'],
  ['Acetyl-L-Carnitine', '800mg'],
  ['L-Tyrosine', '500mg'],
  ["Organic Lion's Mane Mushroom (Hericium erinaceus)", '500mg'],
  ['Bacopa', '300mg'],
  ['Ashwagandha Root (Withania somnifera)', '300mg'],
  ['Citicoline', '250mg'],
  ['L-Theanine', '200mg'],
  ['Ginkgo Biloba', '120mg'],
  ['Caffeine Anhydrous', '100mg'],
  ['Phosphatidylserine', '100mg'],
  ['Maritime Pine Bark Extract', '75mg'],
  ['Rhodiola rosea Extract', '50mg'],
  ['Panax Ginseng', '40mg (10:1 extract)'],
  ['Spanish Sage', '25mg (4:1 extract)'],
];

// Rows covered by the site's ingredient library: exact reference string and
// the verdict the label proves. Bacopa and Ashwagandha are null: the label
// states neither an extract basis nor a marker (no bacoside %, no KSM-66), so
// it cannot prove the library's 55%-bacoside / KSM-66 basis.
const ANCHORED: Record<string, [string, boolean | null]> = {
  'Acetyl-L-Carnitine': ['1500-3000mg/day', false],
  'L-Tyrosine': ['2000mg/day (lowest positive trial)', false],
  "Organic Lion's Mane Mushroom (Hericium erinaceus)": ['1000-1800mg/day', false],
  Bacopa: ['300-450mg/day (55% bacosides)', null],
  'Ashwagandha Root (Withania somnifera)': ['300-600mg/day (KSM-66)', null],
  Citicoline: ['250-500mg/day', true],
  'L-Theanine': ['100-200mg/day', true],
  'Ginkgo Biloba': ['240mg/day (24/6 extract)', false],
  'Caffeine Anhydrous': ['100-200mg', true],
  Phosphatidylserine: ['100-300mg/day', true],
  'Maritime Pine Bark Extract': ['100-200mg/day', false],
  'Rhodiola rosea Extract': ['200-600mg/day', false],
};

const hunter = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'hunter-focus-review');
  if (!p) throw new Error('Hunter Focus record missing');
  return p;
};
// Editorial copy + names (the anchored clinicalDose strings legitimately say "KSM-66" / "bacosides").
const copy = (p: Product) => JSON.stringify([
  p.summary, p.whatItIs, p.howItWorks, p.whatToExpect, p.pros, p.cons, p.heroIngredients,
  p.ingredientDosages.map((d) => [d.name, d.doseInProduct]),
]);

describe.each(REGIONS)('%s Hunter Focus matches its label', (_region, products) => {
  const p = hunter(products);

  test('every label row at the label amount, nothing else', () => {
    expect(p.ingredientDosages.map((d) => [d.name, d.doseInProduct])).toEqual(LABEL);
  });

  test('no ingredient, form or count the label does not support', () => {
    const record = JSON.stringify(p);
    expect(record).not.toMatch(/\bNAC\b|acetyl[- ]?l[- ]?cysteine/i);
    expect(record).not.toMatch(/9-ingredient|rosavin|fruiting|full clinical doses|well-dosed/i);
    expect(copy(p)).not.toMatch(/KSM-66|bacoside|2:1 ratio/i);
  });

  test('anchored rows carry the library reference and the label-proven verdict; the rest have none', () => {
    for (const d of p.ingredientDosages) {
      const anchor = ANCHORED[d.name];
      if (anchor) {
        expect([d.clinicalDose, d.adequatelyDosed], d.name).toEqual(anchor);
      } else {
        expect([d.clinicalDose, d.adequatelyDosed], d.name).toEqual(['No reference dose on file', null]);
      }
    }
  });

  test('serving, caffeine and source match the label', () => {
    expect(p.capsulesPerServing).toBe(6);
    expect(p.servingsPerContainer).toBe(30);
    expect(p.caffeineFree).toBe(false);
    expect([p.notes ?? []].flat().join(' ')).toContain('https://www.hunterevolve.com/en-us/hunter-focus');
  });

  test('every hero ingredient has its dosing row', () => {
    expect(p.heroIngredients.length).toBeGreaterThan(0);
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});

// Listicle picks quote the record's formula; keep them on the label too.
const APPS_DIR = resolve(dirname(new URL(import.meta.url).pathname), '../../../apps');
const pages = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
};
const pickBlocks = (slug: string) =>
  readdirSync(APPS_DIR)
    .map((a) => resolve(APPS_DIR, a, 'src'))
    .filter((d) => existsSync(d))
    .flatMap((d) => pages(d))
    .flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      const blocks: [string, string][] = [];
      let i = text.indexOf(`slug === '${slug}')!`);
      while (i >= 0) {
        blocks.push([file, text.slice(i, text.indexOf('\n  }', i))]);
        i = text.indexOf(`slug === '${slug}')!`, i + 1);
      }
      return blocks;
    });

test('listicle picks describe Hunter Focus from its label', () => {
  const blocks = pickBlocks('hunter-focus-review');
  expect(blocks.length).toBeGreaterThan(5);
  const bad = blocks
    .filter(([, b]) => /fruiting|KSM-66|No Bacopa or PS|\bNAC\b|Bacopa \(200mg|full 500mg clinical dose/i.test(b))
    .map(([f]) => f);
  expect(bad).toEqual([]);
});
