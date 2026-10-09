import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
  allProductsUS, allProductsCA, allProductsAU, allProductsGCC, allProductsLatam, allProductsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// The six Qualia Mind records carried the old formula's seven rows: Huperzine
// A, Bacopa, DHA and Uridine are not on the Qualia Mind 2.0 label, PS, Alpha-GPC
// and Rhodiola amounts were wrong, and 28 label rows were missing. All six
// records link to the same page, https://www.qualialife.com/shop/qualia-mind,
// whose Supplement Facts panel (checked 2026-10-08) lists 31 rows per
// 6-capsule daily serving, every amount stated. These pins keep the records,
// and the listicle copy that quotes them, on that label.

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['ca', allProductsCA], ['au', allProductsAU],
  ['gcc', allProductsGCC], ['latam', allProductsLatam], ['sea', allProductsSEA],
];

// [row name, amount as the label prints it], in label order.
const LABEL: [string, string][] = [
  ['Vitamin C (ascorbic acid)', '45mg'],
  ['Vitamin D (cholecalciferol)', '15mcg (600 IU)'],
  ['Thiamine (thiamine HCl)', '2.5mg'],
  ['Riboflavin', '2mg'],
  ['Niacin (niacinamide)', '16mg'],
  ["Vitamin B6 (pyridoxal 5'-phosphate)", '2mg'],
  ['Folate (L-5-methyltetrahydrofolate calcium)', '333mcg DFE'],
  ['Vitamin B12 (methylcobalamin)', '100mcg'],
  ['Biotin', '30mcg'],
  ['Pantothenic Acid (D-calcium pantothenate)', '5mg'],
  ['Magnesium (magnesium aspartate)', '84mg'],
  ['Acetyl-L-Carnitine HCl', '500mg'],
  ['Rhodiola rosea Root Extract (3% rosavins, 1% salidrosides)', '370mg'],
  ['Nutricog (Terminalia chebula fruit and Boswellia serrata gum resin extracts)', '300mg'],
  ['N-Acetyl-L-Tyrosine', '250mg'],
  ['Taurine', '200mg'],
  ['L-Theanine', '200mg'],
  ["Organic Lion's Mane Mushroom Extract (RealLionsMane)", '125mg (8:1 extract)'],
  ['Ginkgo biloba Leaf Extract (24% glycosides)', '120mg'],
  ['Alpha-GPC (L-alpha-glycerylphosphorylcholine)', '115mg'],
  ['Caffeine (from Coffeeberry coffee fruit extract, guarana seed extract and anhydrous caffeine)', '100mg'],
  ['Phosphatidylserine (from sunflower lecithin)', '100mg'],
  ['Polygala tenuifolia Root Extract', '100mg'],
  ['SmartSeed (Celastrus paniculatus seed extract)', '90mg'],
  ['Cognizin (citicoline)', '50mg'],
  ['Sabroxy (Oroxylum indicum bark extract)', '50mg'],
  ['Saffron Stigma Extract', '30mg'],
  ['Lutein (Lutemax Brain marigold flower extract)', '10mg'],
  ['Pyrroloquinoline Quinone Disodium Salt (PQQ)', '10mg'],
  ['Boron (boron glycinate)', '3mg'],
  ['Zeaxanthin (Lutemax Brain marigold flower extract)', '2mg'],
];

// Rows covered by the site's ingredient library: exact reference string and
// the verdict the label proves. Lion's Mane is an 8:1 extract with no amount
// on the library's dry-weight basis, so null. Lutein and zeaxanthin share the
// library's TOTAL lutein + zeaxanthin anchor (12-27mg/day): 10 + 2 = 12mg.
const ANCHORED: Record<string, [string, boolean | null]> = {
  'Acetyl-L-Carnitine HCl': ['1500-3000mg/day', false],
  'Rhodiola rosea Root Extract (3% rosavins, 1% salidrosides)': ['200-600mg/day', true],
  'N-Acetyl-L-Tyrosine': ['2000mg/day (lowest positive trial)', false],
  'L-Theanine': ['100-200mg/day', true],
  "Organic Lion's Mane Mushroom Extract (RealLionsMane)": ['1000-1800mg/day', null],
  'Ginkgo biloba Leaf Extract (24% glycosides)': ['240mg/day (24/6 extract)', false],
  'Alpha-GPC (L-alpha-glycerylphosphorylcholine)': ['300-600mg/day', false],
  'Caffeine (from Coffeeberry coffee fruit extract, guarana seed extract and anhydrous caffeine)': ['100-200mg', true],
  'Phosphatidylserine (from sunflower lecithin)': ['100-300mg/day', true],
  'Cognizin (citicoline)': ['250-500mg/day', false],
  'Lutein (Lutemax Brain marigold flower extract)': ['12-27mg/day', true],
  'Zeaxanthin (Lutemax Brain marigold flower extract)': ['12-27mg/day', true],
};

// Old-formula ingredients and figures that are not on the 2.0 label.
const NOT_ON_LABEL = /huperzi|bacopa|\bDHA\b|uridine|algae|28[- ](active|ingredient)|caffeine \(90mg|7\+ ?(capsules|caps|\/day)/i;

const qualia = (products: readonly Product[]) => {
  const p = products.find((x) => x.slug === 'qualia-mind-review');
  if (!p) throw new Error('Qualia Mind record missing');
  return p;
};

describe.each(REGIONS)('%s Qualia Mind matches its 2.0 label', (_region, products) => {
  const p = qualia(products);

  test('every label row at the label amount, nothing else', () => {
    expect(p.ingredientDosages.map((d) => [d.name, d.doseInProduct])).toEqual(LABEL);
  });

  test('no old-formula ingredient, amount or count anywhere in the record', () => {
    expect(JSON.stringify(p)).not.toMatch(NOT_ON_LABEL);
    expect(p.summary).toMatch(/^31 active ingredients/);
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
    expect(p.servingsPerContainer).toBe(20);
    expect(p.caffeineFree).toBe(false);
    expect([p.notes ?? []].flat().join(' ')).toContain('https://www.qualialife.com/shop/qualia-mind');
  });

  test('every hero ingredient has its dosing row', () => {
    expect(p.heroIngredients.length).toBeGreaterThan(0);
    for (const hero of p.heroIngredients) {
      expect(p.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const APPS_DIR = resolve(REPO_ROOT, 'apps');
const pages = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
};
const APP_PAGES = readdirSync(APPS_DIR)
  .map((a) => resolve(APPS_DIR, a, 'src'))
  .filter((d) => existsSync(d))
  .flatMap((d) => pages(d));

test('listicle picks describe Qualia Mind from its 2.0 label', () => {
  const blocks = APP_PAGES.flatMap((file) => {
    const text = readFileSync(file, 'utf8');
    const out: [string, string][] = [];
    let i = text.indexOf("slug === 'qualia-mind-review')!");
    while (i >= 0) {
      out.push([file.slice(REPO_ROOT.length + 1), text.slice(i, text.indexOf('\n  }', i))]);
      i = text.indexOf("slug === 'qualia-mind-review')!", i + 1);
    }
    return out;
  });
  expect(blocks.length).toBeGreaterThan(20);
  // A pick may say what Qualia lacks ("everything in Mind Lab Pro except
  // Bacopa") or suggest a separate Bacopa product; it must not say Qualia
  // includes Bacopa or give it a Bacopa dose.
  const claims = (b: string) => b.replace(/(except|salvo) Bacopa/gi, '');
  const PICK_BAN = /huperzi|\bDHA\b|uridine|algae|28[- ](active|ingredient)|7\+|90 ?mg|phosphatidylserine \(?200 ?mg|everything in Mind Lab Pro plus|(includes?|incluye)[^.]*bacopa|bacopa[^.]{0,30}(\d+ ?mg|clinical|fully dosed)/i;
  const bad = blocks
    .filter(([, b]) => PICK_BAN.test(claims(b)))
    .map(([f]) => f);
  expect(bad).toEqual([]);
});

test('head-to-head pages give the label count (31) and serving (6 capsules)', () => {
  for (const page of ['mind-lab-pro-vs-qualia-mind', 'alpha-brain-vs-qualia-mind']) {
    const text = readFileSync(resolve(APPS_DIR, 'us/src/app', page, 'page.tsx'), 'utf8');
    expect(text, page).not.toMatch(/\b28\b|7\+/);
    expect(text, page).toMatch(/31-ingredient/);
  }
  const cancel = readFileSync(resolve(APPS_DIR, 'us/src/app/cancel-qualia-subscription/page.tsx'), 'utf8');
  expect(cancel).not.toMatch(/7\+/);
});
