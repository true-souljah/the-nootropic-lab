import { describe, test, expect } from 'vitest';
import { allProductsUS } from '@nootropic/data';

// BrainMD Brain & Memory Power Boost (US only). The record listed Vinpocetine
// 5mg, which is not on the label, and four wrong amounts. The Supplement Facts
// image on brainmd.com (gallery image 7, checked 2026-10-08) prints six rows
// per 4 capsules (the daily serving per brainmd.com): Acetyl-L-Carnitine 665mg
// (as HCl), NAC 400mg, Alpha Lipoic Acid 200mg, Ginkgo 120mg (24% ginkgo
// flavonols, 6% terpene lactones), Phosphatidylserine 100mg, Huperzine A 100mcg.

const p = allProductsUS.find((x) => x.slug === 'brainmd-brain-memory-power-boost-review');

const LABEL_ROWS: [string, string, string, boolean | null][] = [
  ['Acetyl-L-Carnitine (as acetyl-L-carnitine HCl)', '665mg', '1500-3000mg/day', false],
  ['N-Acetyl-L-Cysteine (NAC)', '400mg', 'No reference dose on file', null],
  ['Alpha Lipoic Acid', '200mg', 'No reference dose on file', null],
  ['Ginkgo Biloba Extract (leaf; 24% ginkgo flavonols, 6% terpene lactones)', '120mg', '240mg/day (24/6 extract)', false],
  ['Phosphatidylserine (SharpPS Green, from sunflower)', '100mg', '100-300mg/day', true],
  ['Huperzine A (Huperzia serrata whole-herb extract)', '100mcg', '100-200mcg/day', true],
];

describe('us BrainMD Brain & Memory Power Boost matches its label', () => {
  test('record exists', () => {
    expect(p).toBeDefined();
  });

  test('the 6 label rows, amounts, library reference doses and verdicts', () => {
    expect(p!.ingredientDosages.map((d) => [d.name, d.doseInProduct, d.clinicalDose, d.adequatelyDosed])).toEqual(LABEL_ROWS);
  });

  test('no vinpocetine and no 7-ingredient count anywhere in the record', () => {
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/vinpocetine/i);
    expect(json).not.toMatch(/7-ingredient/);
    expect(p!.whatItIs).toMatch(/6-ingredient/);
  });

  test('4 capsules per serving, 30 servings, label source in notes', () => {
    expect(p!.capsulesPerServing).toBe(4);
    expect(p!.servingsPerContainer).toBe(30);
    expect([p!.notes ?? []].flat().join(' ')).toMatch(/Brain-And-Memory-Power-Boost-Supplement-BrainMD-6\.png/);
  });

  test('every hero ingredient has its dosing row', () => {
    for (const hero of p!.heroIngredients) {
      expect(p!.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});
