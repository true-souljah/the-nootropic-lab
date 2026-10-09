import { describe, test, expect } from 'vitest';
import { allProductsEU } from '@nootropic/data';

// Brainzyme FOCUS PRO (EU only). The record listed matcha 400mg "~40mg
// caffeine", guarana 200mg "~20mg caffeine", L-theanine 100mg and choline
// bitartrate 250mg, none of which is on the panel. The brand's panel image
// ("Two capsules provide", checked 2026-10-08; brainzyme.de prints the same
// amounts) has 20 rows: a 350mg Camellia sinensis EMT blend (matcha,
// polyphenols, EGCG, L-theanine; no split), guarana seed 330mg, choline 290mg,
// ginkgo 240mg, L-tyrosine 230mg ... vitamin B12 5µg. Guarana, ginkgo, maca
// and the EMT blend are "** = equivalent weight". No caffeine amount is
// printed. Piperine (95%) 21mg gets no row: the site does not audit absorption
// enhancers (see ubernet-catalogue.test.ts).

const p = allProductsEU.find((x) => x.slug === 'brainzyme-focus-pro-review');

const LABEL_ROWS: [string, string][] = [
  ['Camellia Sinensis Extracts (EMT Blend: Pure Matcha, Polyphenols, EGCG, L-Theanine)', '350mg (equivalent weight)'],
  ['L-Theanine (EMT Blend)', 'Not stated (share of 350mg EMT blend)'],
  ['Guarana Seed', '330mg (equivalent weight)'],
  ['Choline', '290mg'],
  ['Ginkgo Biloba', '240mg (equivalent weight)'],
  ['L-Tyrosine', '230mg'],
  ['Magnesium', '56mg'],
  ['Bromelain (1,200 GDU/g)', '20mg'],
  ['Maca Root', '20mg (equivalent weight)'],
  ['Vitamin C', '16mg'],
  ['Vitamin B3 (Niacin)', '8mg NE'],
  ['Vitamin D3 (400IU)', '10mcg'],
  ['Zinc', '3mg'],
  ['Vitamin B5 (Pantothenic Acid)', '3mg'],
  ['Boron', '3mg'],
  ['Vitamin B6 (Pyridoxine)', '2.8mg'],
  ['Vitamin B1 (Thiamine)', '0.56mg'],
  ['Vitamin B9 (Folate)', '100mcg'],
  ['Iodine', '75mcg'],
  ['Vitamin B12', '5mcg'],
];

const row = (name: string) => {
  const r = p!.ingredientDosages.find((d) => d.name === name);
  if (!r) throw new Error(`${name} row missing`);
  return r;
};

describe('eu Brainzyme FOCUS PRO matches its label', () => {
  test('record exists', () => {
    expect(p).toBeDefined();
  });

  test('the label rows with the printed amounts, no piperine row', () => {
    expect(p!.ingredientDosages.map((d) => [d.name, d.doseInProduct])).toEqual(LABEL_ROWS);
    expect(p!.ingredientDosages.map((d) => d.name).filter((n) => /piperine|bioperine|black pepper/i.test(n))).toEqual([]);
  });

  test('blend share and equivalent-weight rows are not judged; L-tyrosine is below its reference dose', () => {
    expect(row('L-Theanine (EMT Blend)')).toMatchObject({ clinicalDose: '100-200mg/day', adequatelyDosed: null });
    expect(row('Ginkgo Biloba')).toMatchObject({ clinicalDose: '240mg/day (24/6 extract)', adequatelyDosed: null });
    expect(row('L-Tyrosine')).toMatchObject({ clinicalDose: '2000mg/day (lowest positive trial)', adequatelyDosed: false });
    for (const name of ['Guarana Seed', 'Choline', 'Maca Root', 'Vitamin B12']) {
      expect(row(name), name).toMatchObject({ clinicalDose: 'No reference dose on file', adequatelyDosed: null });
    }
  });

  test('no caffeine figure, caffeine claim or choline bitartrate anywhere in the record', () => {
    const { caffeineFree: _flag, ...rest } = p!;
    const json = JSON.stringify(rest);
    expect(json).not.toMatch(/~\s?\d+\s?mg/);
    expect(json).not.toMatch(/bitartrate/i);
    // The only caffeine wording allowed is that the label states no amount.
    const mentions = [...json.matchAll(/caffeine/gi)].map((m) => json.slice(Math.max(0, m.index - 3), m.index + 15));
    expect(mentions.length).toBeGreaterThan(0);
    for (const m of mentions) expect(m, m).toMatch(/^no caffeine amount$/i);
  });

  test('label source in notes; every hero ingredient has its dosing row', () => {
    expect([p!.notes ?? []].flat().join(' ')).toMatch(/New_Graphics_PP_Carousel_02_PRO/);
    for (const hero of p!.heroIngredients) {
      expect(p!.ingredientDosages.some((d) => d.name.includes(hero)), hero).toBe(true);
    }
  });
});
