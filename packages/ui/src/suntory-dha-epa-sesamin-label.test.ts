import { describe, test, expect } from 'vitest';
import { allProductsJP } from '@nootropic/data';

// Suntory DHA&EPA+セサミンEX (JP only). The record said DHA 400mg, sesamin 20mg
// and 6 capsules a day. Suntory Wellness's product page
// (suntory-kenko.com/supplement/43322, checked 2026-10-08; spec block read by
// two independent extractions, corroborated by Suntory's search excerpt and its
// official Yahoo store) prints per 4 capsules (1.66g): DHA 300mg, EPA 100mg,
// DPA 15mg, sesamin 10mg, tocotrienol 2mg, vitamin E 55.0mg, vitamin D 5.0μg.

const p = allProductsJP.find((x) => x.slug === 'suntory-dha-epa-sesamin-review');

const LABEL_ROWS: [string, string, string, boolean | null][] = [
  ['DHA (docosahexaenoic acid)', '300mg', '900mg-1.2g DHA/day', false],
  ['EPA (eicosapentaenoic acid)', '100mg', 'No reference dose on file', null],
  ['DPA (docosapentaenoic acid)', '15mg', 'No reference dose on file', null],
  ['Sesamin', '10mg', 'No reference dose on file', null],
  ['Tocotrienol', '2mg', 'No reference dose on file', null],
  ['Vitamin E', '55.0mg', 'No reference dose on file', null],
  ['Vitamin D', '5.0mcg', 'No reference dose on file', null],
];

describe('jp Suntory DHA & EPA + Sesamin EX matches its label', () => {
  test('record exists', () => {
    expect(p).toBeDefined();
  });

  test('the 7 label rows, amounts, reference dose and verdicts', () => {
    expect(p!.ingredientDosages.map((d) => [d.name, d.doseInProduct, d.clinicalDose, d.adequatelyDosed])).toEqual(LABEL_ROWS);
  });

  test('no 400mg DHA, 20mg sesamin or 6-capsule claim anywhere in the record', () => {
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/400mg/);
    expect(json).not.toMatch(/\b20mg\b/);
    expect(json).not.toMatch(/6 capsules|6粒/);
  });

  test('4 capsules a day, label source in notes', () => {
    expect(p!.capsulesPerServing).toBe(4);
    expect([p!.notes ?? []].flat().join(' ')).toMatch(/suntory-kenko\.com\/supplement\/43322/);
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of p!.heroIngredients) {
      expect(p!.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});
