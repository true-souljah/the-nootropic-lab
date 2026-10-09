import { describe, test, expect } from 'vitest';
import {
  DOSING_ANCHORS,
  NO_REFERENCE_DOSE,
  amountMg,
  baseName,
  doseInterval,
  dosingAnchorFor,
  dosingAnchorProblems,
  dosingScore,
  dosingTally,
  matchingAnchors,
  rowVerdict,
  ingredients,
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { DosingAnchor, IngredientDosage } from '@nootropic/data';

// The dosing formula (packages/data/src/dosing-anchors.ts, operator decision
// b → b1, 2026-10-09): a row whose ingredient has a reference dose on the
// site's ingredient library carries that anchor's clinicalDose and the verdict
// the label proves; every other row carries "No reference dose on file" and
// null; the dosing pillar is adequate ÷ anchored units. scripts/validate-data.ts
// enforces the same rules on the catalogue. Fixture rows are real catalogue or
// label-correction rows unless marked "synthetic".

const row = (overrides: Partial<IngredientDosage>): IngredientDosage => ({
  name: 'Acetyl-L-Carnitine',
  doseInProduct: '500mg',
  clinicalDose: '1500-3000mg/day',
  adequatelyDosed: false,
  ...overrides,
});
const problemsFor = (...rows: IngredientDosage[]) =>
  dosingAnchorProblems({ slug: 'fixture-review', ingredientDosages: rows });

/** A label row: name and dose only (the formula writes the other two fields). */
const label = (name: string, doseInProduct: string): IngredientDosage => ({
  name, doseInProduct, clinicalDose: '', adequatelyDosed: null,
});
/** rowVerdict of the first row, judged within all `rows` (one record). */
const verdictOf = (rows: IngredientDosage[], capsulesPerServing?: number) => {
  const anchor = dosingAnchorFor(rows[0]);
  if (!anchor) throw new Error(`"${rows[0].name}" has no anchor`);
  return rowVerdict(rows[0], anchor, { capsulesPerServing }, rows);
};

// The old doseMg('50mcg') returned null (mg and g only), so huperzine A in mcg
// could never be judged; amountMg converts mcg/µg/μg/ug (FORMULA-SPEC §2).
describe('amountMg — leading number + unit in milligrams', () => {
  test.each([
    ['500mg', 500],
    ['1.16g', 1160],
    ['80mg', 80],
    ['540mg', 540],
    ['2200mg blend (split undisclosed)', 2200],
    ['100.02mg (16.67 mg per capsule × 6)', 100.02],
    ['400mcg', 0.4],
    ['50mcg', 0.05],
    ['50mcg (2000 IU)', 0.05],
    ['5µg', 0.005],
    ['10μg', 0.01],
    ['75ug', 0.075],
    ['n/a', null],
    ['Undisclosed', null],
    ['400 IU', null],
  ] as const)('%s → %s', (dose, mg) => {
    expect(amountMg(dose)).toBe(mg);
  });
});

describe('doseInterval — what the label proves about the daily amount, in mg', () => {
  test.each([
    ['Not stated (share of 650mg blend)', [0, 650]],
    ['Not stated (share of 350mg EMT blend)', [0, 350]],
    ['Not stated; at most 140mg (240mg blend incl. 100mg Bacopa)', [0, 140]],
    ['Not stated; at most 650mg (blend total)', [0, 650]],
    ['Undisclosed', [0, Infinity]],
    ['500mg', [500, 500]],
    ['1500mg (250 mg per capsule × 6)', [1500, 1500]],
    ['400mcg', [0.4, 0.4]],
    ['proprietary blend', [0, Infinity]],
  ] as const)('%s → %j', (dose, interval) => {
    expect(doseInterval({ doseInProduct: dose }, { capsulesPerServing: 2 })).toEqual(interval);
  });

  test('a dose marked "per capsule or per serving" spans one capsule to one serving (synthetic)', () => {
    expect(doseInterval({ doseInProduct: '100mg per capsule or per serving' }, { capsulesPerServing: 3 })).toEqual([100, 300]);
    expect(doseInterval({ doseInProduct: '100mg per serving or per capsule' }, { capsulesPerServing: 2 })).toEqual([100, 200]);
    expect(doseInterval({ doseInProduct: '100mg per serving or per capsule' }, {})).toEqual([100, Infinity]);
  });
});

describe('anchor matching — on the base name (text before the first " (")', () => {
  test('baseName drops the form, brand and blend notes', () => {
    expect(baseName("Lion's Mane (Hericium erinaceus) (Clarity)")).toBe("Lion's Mane");
    expect(baseName('L-Theanine')).toBe('L-Theanine');
  });

  // FORMULA-SPEC §8 (2026-10-09): base-name matching only. A full-name
  // fallback (§7A) was withdrawn after it anchored the rows below and credited
  // matcha, guarana and a whole EMT blend as caffeine or L-theanine. Rows name
  // their ingredient first instead; the CA AOR rows were renamed to AOR's panel
  // wording for that.
  test.each([
    'Matcha (natural caffeine ~40mg)',
    'Guarana (natural caffeine ~20mg)',
    'Camellia Sinensis Extracts (EMT Blend: Pure Matcha, Polyphenols, EGCG, L-Theanine)',
    '(2R)-2-(Acetyloxy)-3-carboxy-N,N,N-trimethyl-1-propanaminium inner salt (N-Acetyl L-carnitine hydrochloride)',
  ])('a parenthetical never anchors a row: "%s" has no reference dose', (name) => {
    expect(matchingAnchors({ name })).toEqual([]);
    expect(problemsFor(row({ name, doseInProduct: '400mg', clinicalDose: NO_REFERENCE_DOSE, adequatelyDosed: null }))).toEqual([]);
  });

  test('the base name decides: a base that names an anchor wins over its parentheses', () => {
    // "capsules with caffeine only" must not make the Thesis theanine row a caffeine row.
    const theanine = 'L-Theanine (Camellia sinensis, capsules with caffeine only) (Stress Reset)';
    expect(matchingAnchors({ name: theanine }).map((a) => a.ingredientSlug)).toEqual(['l-theanine']);
    expect(matchingAnchors({ name: 'Cognizin (citicoline)' }).map((a) => a.ingredientSlug)).toEqual(['citicoline']);
  });

  test('CA AOR Ortho Mind, renamed to its panel wording (§8), anchors ALCAR and citicoline', () => {
    expect(matchingAnchors({ name: 'ALCAR (Acetyl-L-carnitine)' }).map((a) => a.ingredientSlug)).toEqual(['acetyl-l-carnitine']);
    expect(matchingAnchors({ name: 'Citicoline (Xerenoos®)' }).map((a) => a.ingredientSlug)).toEqual(['citicoline']);
    expect(matchingAnchors({ name: 'Arginine pyroglutamate' })).toEqual([]);
    expect(matchingAnchors({ name: 'R(α)-Lipoic acid (sodium salt)' })).toEqual([]);
    expect(verdictOf([label('ALCAR (Acetyl-L-carnitine)', '1500mg (250 mg per capsule × 6)')])).toBe(true);
    expect(verdictOf([label('Citicoline (Xerenoos®)', '499.98mg (83.33 mg per capsule × 6)')])).toBe(true);
    expect(verdictOf([label('ALCAR (Acetyl-L-carnitine)', '500mg')])).toBe(false); // synthetic: below 1500
  });

  test('matchFull tests the whole name (brand-specific anchors; synthetic anchors)', () => {
    const brand: DosingAnchor = { ingredientSlug: 'longvida', match: /longvida/i, matchFull: true, clinicalDose: 'x', minMg: 400, basis: 'extract' };
    const plain: DosingAnchor = { ...brand, matchFull: false };
    const row = { name: 'Curcumin (Longvida® turmeric extract)' };
    expect(matchingAnchors(row, [brand])).toEqual([brand]);
    expect(matchingAnchors(row, [plain])).toEqual([]);
  });

  test('the Longvida anchor takes Longvida rows only, never plain curcumin or turmeric', () => {
    expect(dosingAnchorFor({ name: 'Curcumin (Longvida® turmeric extract)' })?.ingredientSlug).toBe('longvida-curcumin');
    expect(dosingAnchorFor({ name: 'Curcuma longa (Turmeric) (Neuroprotection)' })).toBeNull();
    expect(dosingAnchorFor({ name: 'Curcumin' })).toBeNull();
  });

  test('a row matching two anchors is an error (synthetic)', () => {
    expect(() => dosingAnchorFor({ name: 'Lutein + DHA complex' })).toThrow(/more than one dosing anchor \(dha-omega-3, lutemax-2020\)|more than one dosing anchor \(lutemax-2020, dha-omega-3\)/);
    const problems = problemsFor(row({ name: 'Lutein + DHA complex', doseInProduct: '20mg' }));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^fixture-review: "Lutein \+ DHA complex" matches more than one dosing anchor/);
  });
});

describe('rowVerdict — "score dosing from what the label proves"', () => {
  test('1. a combined anchor sums its rows (lutein + zeaxanthin count together)', () => {
    const lutein = label('Lutein (Lutemax Brain marigold flower extract)', '10mg (12mg lutein + zeaxanthin together)');
    const zeaxanthin = label('Zeaxanthin (Lutemax Brain marigold flower extract)', '2mg (12mg lutein + zeaxanthin together)');
    expect(verdictOf([lutein, zeaxanthin])).toBe(true); // 10 + 2 = 12 ≥ 12
    expect(verdictOf([zeaxanthin, lutein])).toBe(true); // every row of the anchor shares the verdict
    expect(verdictOf([lutein])).toBe(false); // 10 alone < 12
    expect(verdictOf([label('Lutemax 2020 (Lutein/Zeaxanthin)', '20mg')])).toBe(true);
  });

  test('2. an amount the label proves below the minimum is false, whatever the basis', () => {
    expect(verdictOf([label('DHA (from Algae)', '80mg')])).toBe(false);
    expect(verdictOf([label('Alpha-GPC (Focus Blend)', 'Not stated; at most 140mg (240mg blend incl. 100mg Bacopa)')])).toBe(false);
    expect(verdictOf([label('L-Tyrosine (Flow Blend)', 'Not stated; at most 650mg (blend total)')])).toBe(false);
    expect(verdictOf([label('Huperzine A', '50mcg')])).toBe(false);
    expect(verdictOf([label("Lion's Mane fruiting body extract (1:1)", '500mg')])).toBe(false); // 1:1 is not concentrated
    // …but a blend that could hold the minimum is not proven below.
    expect(verdictOf([label('L-Theanine (Flow Blend)', 'Not stated (share of 650mg blend)')])).toBeNull();
  });

  test('2. except a ratio extract on a raw basis: the amount is concentrated', () => {
    expect(verdictOf([label("Organic Lion's Mane Mushroom Extract (RealLionsMane)", '125mg (8:1 extract)')])).toBeNull();
  });

  test('3. a printed marker amount decides: below its minimum → false', () => {
    expect(verdictOf([label('Bacopa Monnieri (Brahmi extract)', '460mg (92mg bacopasides)')])).toBe(false); // 92 < 165
    expect(verdictOf([label('Bacopa Monnieri (50% bacosides)', '300mg')])).toBe(false); // 300 × 50% = 150 < 165
    expect(verdictOf([label('Bacopa saponins (バコパサポニン)', '15mg')])).toBe(false); // the base name is the marker
  });

  test('3. marker and amount both at their minimum → true; a marker range straddling it → null', () => {
    expect(verdictOf([label('Bacopa Monnieri (55% bacosides)', '300mg')])).toBe(true); // synthetic: 165 ≥ 165, 300 ≥ 300
    expect(verdictOf([label('Ginkgo Biloba Extract (leaf)', '300mg (60mg flavone glycosides)')])).toBe(true); // synthetic
    expect(verdictOf([label('Ginkgo Biloba Extract (leaf)', '300mg (50mg flavone glycosides)')])).toBe(false); // synthetic: 50 < 57.6
    // "50-55% Bacosides" proves 150–165mg: not proven to reach 165, not proven below it.
    expect(verdictOf([label('Bacopa monnieri (50-55% Bacosides, leaf)', '300mg (50 mg per capsule × 6)')])).toBeNull();
  });

  test('4. an equivalent (dried-herb) weight: null on an extract basis, compared as is on a raw basis', () => {
    expect(verdictOf([label('Ginkgo Biloba', '240mg (equivalent weight)')])).toBeNull();
    expect(verdictOf([label("Lion's Mane", '1000mg (dried-herb equivalent weight)')])).toBe(true); // synthetic
    expect(verdictOf([label("Lion's Mane", '500mg (dried-herb equivalent weight)')])).toBe(false); // synthetic
  });

  test('5. a ratio extract: null on a raw basis, ignored on an extract basis', () => {
    expect(verdictOf([label("Lion's Mane Mushroom (10:1 extract)", '500mg')])).toBeNull();
    expect(verdictOf([label('Ginkgo Biloba Extract (leaf)', '500mg (12:1 extract; 120mg ginkgo flavone glycosides)')])).toBe(true);
    expect(verdictOf([label('Ginkgo Biloba Extract (50:1)', '120mg')])).toBe(false);
  });

  test('6. an extract at the minimum without its printed standardisation → null', () => {
    expect(verdictOf([label('Ashwagandha Root (Withania somnifera)', '300mg')])).toBeNull();
    expect(verdictOf([label('Bacopa Monnieri', '300mg')])).toBeNull();
    expect(verdictOf([label('Ashwagandha (KSM-66)', '300mg')])).toBe(true);
    expect(verdictOf([label('Rhodiola rosea Root Extract (3% rosavins, 1% salidrosides)', '370mg')])).toBe(true);
  });

  test('7. a proven amount at or above the minimum → true; an interval straddling it → null', () => {
    expect(verdictOf([label('Huperzine A (Toothed Clubmoss, Focus Blend)', '400mcg')])).toBe(true);
    expect(verdictOf([label('Huperzine A (Huperzia serrata whole-herb extract)', '100mcg')])).toBe(true);
    expect(verdictOf([label('Acetyl-L-Carnitine', '1.5g')])).toBe(true);
    expect(verdictOf([label('Phosphatidylserine (Flow Blend)', 'Not stated (share of 650mg blend)')])).toBeNull();
    expect(verdictOf([label('L-Theanine', 'Undisclosed')])).toBeNull();
    expect(verdictOf([label('L-Theanine', '60mg per capsule or per serving')], 2)).toBeNull(); // synthetic: 60–120mg
    expect(verdictOf([label('L-Theanine', '60mg per capsule or per serving')], 1)).toBe(false); // synthetic: 60mg
  });

  test('7B: up to two words may stand between the marker amount and the marker', () => {
    // NatureBell (label correction #336): the 120mg is read as the marker now, not just the standardisation word.
    expect(verdictOf([label('Ginkgo Biloba Extract (leaf)', '500mg (12:1 extract; 120mg ginkgo flavone glycosides)')])).toBe(true);
    // synthetic: one word between, marker below 57.6 → false (the "glycosid" standardisation word alone would say true)
    expect(verdictOf([label('Ginkgo Biloba Extract (leaf)', '500mg (12:1 extract; 50mg ginkgo flavone glycosides)')])).toBe(false);
    // synthetic: two words between still counts
    expect(verdictOf([label('Ginkgo Biloba Extract (leaf)', '300mg (50mg standardised ginkgo flavone glycosides)')])).toBe(false);
    // synthetic: three words between is not a printed marker amount → decided on the extract weight
    expect(verdictOf([label('Ginkgo Biloba Extract (leaf)', '300mg (50mg from standardised leaf flavone glycosides)')])).toBe(true);
  });

  test('7C: a base name that is the marker is judged on the marker minimum only, not the extract weight', () => {
    expect(verdictOf([label('Bacopa saponins (バコパサポニン)', '15mg')])).toBe(false); // FANCL BRAINs: 15 < 165
    expect(verdictOf([label('Bacopa saponins', '200mg')])).toBe(true); // synthetic: 200 ≥ 165, below the 300mg extract minimum
    expect(verdictOf([label('Bacopa saponins', 'Not stated (share of 400mg blend)')])).toBeNull(); // synthetic: 0–400 straddles 165
  });

  test('7D: "basis not stated" → null, even below the minimum (Thesis fermented-salidroside Rhodiola)', () => {
    expect(verdictOf([label('Rhodiola Rosea (fermented salidrosides; basis not stated) (Motivation)', '60mg')])).toBeNull();
    expect(verdictOf([label('Rhodiola Rosea (Motivation)', '60mg (fermented salidrosides; basis not stated)')])).toBeNull();
    // The same row without the note is proven below the 200mg minimum.
    expect(verdictOf([label('Rhodiola Rosea (fermented salidrosides) (Motivation)', '60mg')])).toBe(false);
  });
});

describe('dosingTally — the review page\'s "X / Y adequate" chip counts dosing units (FORMULA-SPEC §7E)', () => {
  test('rows without a reference dose are not counted; a combined anchor counts once', () => {
    const rows = [
      label('Lutein (Lutemax Brain marigold flower extract)', '10mg (12mg lutein + zeaxanthin together)'),
      label('Zeaxanthin (Lutemax Brain marigold flower extract)', '2mg (12mg lutein + zeaxanthin together)'),
      label('Alpha-GPC (L-alpha-glycerylphosphorylcholine)', '115mg'),
      label('Taurine', '200mg'),
      label('Vitamin B6 (pyridoxal 5\'-phosphate)', '2mg'),
    ];
    expect(dosingTally({ ingredientDosages: rows })).toEqual({ adequate: 1, total: 2 }); // not 5 rows
  });

  test('no anchored row → 0 of 0 (the chip is hidden)', () => {
    expect(dosingTally({ ingredientDosages: [label('Cera-Q (Silk Fibroin Protein)', '600mg')] })).toEqual({ adequate: 0, total: 0 });
  });
});

describe('dosingScore — 10 × adequate ÷ anchored units, one decimal', () => {
  test('rows without a reference dose are listed but not scored; null verdicts count as not adequate', () => {
    // Onnit Alpha Brain: 7 anchored rows, only Huperzine A 400mcg proven adequate → 1.4.
    const alphaBrain = [
      label('Bacopa Monnieri (Focus Blend)', '100mg'),
      label('Alpha-GPC (Focus Blend)', 'Not stated; at most 140mg (240mg blend incl. 100mg Bacopa)'),
      label('Huperzine A (Toothed Clubmoss, Focus Blend)', '400mcg'),
      label('L-Tyrosine (Flow Blend)', 'Not stated; at most 650mg (blend total)'),
      label('L-Theanine (Flow Blend)', 'Not stated (share of 650mg blend)'),
      label('Phosphatidylserine (Flow Blend)', 'Not stated (share of 650mg blend)'),
      label('Oat Straw Extract (Flow Blend)', 'Not stated (share of 650mg blend)'),
      label("Cat's Claw Bark Extract", '350mg'),
      label('Vitamin B6 (Pyridoxine HCl)', '10mg'),
    ];
    expect(dosingScore({ ingredientDosages: alphaBrain })).toBe(1.4);
  });

  test('a combined anchor is one unit, however many rows it has', () => {
    const rows = [
      label('Lutein (Lutemax Brain marigold flower extract)', '10mg (12mg lutein + zeaxanthin together)'),
      label('Zeaxanthin (Lutemax Brain marigold flower extract)', '2mg (12mg lutein + zeaxanthin together)'),
      label('Alpha-GPC (L-alpha-glycerylphosphorylcholine)', '115mg'),
    ];
    expect(dosingScore({ ingredientDosages: rows })).toBe(5); // lutein+zeaxanthin true, Alpha-GPC false → 1 of 2
  });

  test('every dose hidden → 0 (SEA Supershrooms, operator 2026-10-09)', () => {
    const rows = ['L-Theanine', 'Cordyceps', "Lion's Mane", 'Rhodiola Rosea', 'Cacao', 'Gotu Kola', 'Bacopa Monnieri', 'Ginkgo Biloba']
      .map((name) => label(name, 'Undisclosed'));
    expect(dosingScore({ ingredientDosages: rows })).toBe(0);
  });

  test('no anchored row → null (Eu Yan Sang BrainMAX+: no reference dose for any ingredient)', () => {
    const rows = [label('Cera-Q (Silk Fibroin Protein)', '600mg'), label('Goji Berry Extract', '146mg'), label('Chinese Wild Ginseng Extract', '37mg')];
    expect(dosingScore({ ingredientDosages: rows })).toBeNull();
    expect(dosingScore({ ingredientDosages: [] })).toBeNull();
  });

  test('rounds half up to one decimal (weightedScore\'s rounding)', () => {
    const rows = [label('L-Theanine', '200mg'), ...Array.from({ length: 7 }, () => label('L-Theanine', '50mg'))];
    expect(dosingScore({ ingredientDosages: rows })).toBe(1.3); // 1 of 8 = 1.25 → 1.3
    const twoOfThree = [label('L-Theanine', '200mg'), label('Citicoline', '250mg'), label('Caffeine', '50mg')];
    expect(dosingScore({ ingredientDosages: twoOfThree })).toBe(6.7);
  });
});

describe('dosingAnchorProblems', () => {
  test('a row that carries the anchor and the right verdict has no problem', () => {
    expect(problemsFor(row({}))).toEqual([]);
    expect(problemsFor(row({ doseInProduct: '1.5g', adequatelyDosed: true }))).toEqual([]);
    expect(problemsFor(row({ name: 'DHA (algal)', doseInProduct: '540mg', clinicalDose: '900mg-1.2g DHA/day' }))).toEqual([]);
  });

  test('a matching row with the wrong clinicalDose → 1 problem', () => {
    const problems = problemsFor(row({ clinicalDose: '500-2000mg' }));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^fixture-review: .*clinicalDose "500-2000mg"/);
  });

  test('a matching row marked adequately dosed below minMg → 1 problem', () => {
    const problems = problemsFor(
      row({ name: 'DHA (from Algae)', doseInProduct: '80mg', clinicalDose: '900mg-1.2g DHA/day', adequatelyDosed: true }),
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/adequatelyDosed is true but the label \("80mg"\) gives false against the 900mg dha-omega-3 minimum/);
  });

  // Before the formula an unparseable dose was itself an error; now the label
  // proves nothing about it, so its verdict must be null (FORMULA-SPEC §2).
  test('a matching row whose dose cannot be parsed must be null → a false verdict is 1 problem', () => {
    const problems = problemsFor(row({ doseInProduct: 'proprietary blend' }));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/adequatelyDosed is false but the label \("proprietary blend"\) gives null/);
    expect(problemsFor(row({ doseInProduct: 'proprietary blend', adequatelyDosed: null }))).toEqual([]);
  });

  // Rows without a reference dose used to be unchecked; now they must say so
  // and carry no verdict (listed but not scored).
  test('a row without a reference dose carries "No reference dose on file" and null → 0 problems', () => {
    expect(problemsFor(row({ name: 'EPA (algal)', clinicalDose: NO_REFERENCE_DOSE, adequatelyDosed: null }))).toEqual([]);
  });

  test('a row without a reference dose that claims a dose or a verdict → 1 problem naming both', () => {
    const problems = problemsFor(row({ name: 'EPA (algal)', clinicalDose: 'anything', adequatelyDosed: true }));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^fixture-review: "EPA \(algal\)" clinicalDose "anything" is not "No reference dose on file".*adequatelyDosed is true but a row without a reference dose is null/);
  });

  test.each([
    ['Ashwagandha (KSM-66)', '300mg', '300-600mg/day (KSM-66)', true],
    ['Phosphatidylserine', '100mg', '100-300mg/day', true],
    ['L-Theanine', '100mg', '100-200mg/day', true],
    ['Huperzine A', '50mcg', '100-200mcg/day', false],
  ] as const)('%s %s is anchored now and passes with its anchor and verdict', (name, doseInProduct, clinicalDose, adequatelyDosed) => {
    expect(problemsFor(row({ name, doseInProduct, clinicalDose, adequatelyDosed }))).toEqual([]);
  });

  // Plain L-carnitine has a different evidence base from ALCAR, so the ALCAR
  // anchor must not govern it: it is a row without a reference dose.
  test.each(['L-Carnitine', 'L-Carnitine Tartrate'])(
    'plain L-carnitine (%s) is not held to the ALCAR anchor → no anchor, 0 problems as a no-reference row',
    (name) => {
      expect(matchingAnchors({ name })).toEqual([]);
      expect(problemsFor(row({ name, clinicalDose: NO_REFERENCE_DOSE, adequatelyDosed: null }))).toEqual([]);
    },
  );

  test.each([
    'Acetyl L-Carnitine (from ALCAR HCl)',
    'Acetyl-L-Carnitine (from ALCAR HCl)',
    'Acetyl-L-Carnitine (ALCAR)',
    'Acetyl-L-Carnitine',
    'ALCAR',
  ])('an ALCAR row (%s) with the wrong clinicalDose → 1 problem', (name) => {
    const problems = problemsFor(row({ name, clinicalDose: '500-2000mg' }));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('acetyl-l-carnitine anchor');
  });
});

describe('catalogue rows follow DOSING_ANCHORS', () => {
  const CATALOGUES = {
    us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
    jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
  };

  test('every row in all eight regions passes, and the scan finds anchored and unanchored rows', () => {
    const problems: string[] = [];
    let anchored = 0;
    let unanchored = 0;
    for (const [region, products] of Object.entries(CATALOGUES)) {
      for (const product of products) {
        for (const d of product.ingredientDosages) {
          if (matchingAnchors(d).length > 0) anchored++;
          else unanchored++;
        }
        problems.push(...dosingAnchorProblems(product).map((p) => `${region}/${p}`));
      }
    }
    expect(problems).toEqual([]);
    expect(anchored).toBeGreaterThanOrEqual(10);
    expect(unanchored).toBeGreaterThanOrEqual(10);
  });

  test('every record\'s dosing pillar is the formula\'s', () => {
    const drift = Object.entries(CATALOGUES).flatMap(([region, products]) =>
      products
        .filter((p) => p.scoreBreakdown.dosing !== dosingScore(p))
        .map((p) => `${region}/${p.slug}: ${p.scoreBreakdown.dosing} ≠ ${dosingScore(p)}`),
    );
    expect(drift).toEqual([]);
  });
});

/** [lower, upper] bound in mg of the first dose or dose range in a text ("1–1.8g/day" → [1000, 1800]). */
function boundsMg(text: string): [number, number] {
  const m = /(\d+(?:\.\d+)?)\s*(?:(mcg|mg|g)\b(?:\s*[–-]\s*(\d+(?:\.\d+)?)\s*(mcg|mg|g)\b)?|[–-]\s*(\d+(?:\.\d+)?)\s*(mcg|mg|g)\b)/.exec(text);
  if (!m) throw new Error(`no dose in "${text}"`);
  const lo = amountMg(`${m[1]}${m[2] ?? m[6]}`);
  const upper = m[3] ?? m[5];
  const hi = upper === undefined ? lo : amountMg(`${upper}${m[4] ?? m[6]}`);
  if (lo === null || hi === null) throw new Error(`unparseable dose in "${text}"`);
  return [lo, hi];
}

describe('each anchor restates its evidence page', () => {
  // Where each evidence page (ingredients.ts) states the anchor's range. The
  // anchor's clinicalDose must carry the same range and its minMg the lower
  // bound. Adding an anchor without an entry here fails the test.
  // L-Tyrosine is the one exception: its dose fields give weight-based trial
  // doses (100–150mg/kg) and flat consumer doses (500–2000mg), so its 2000mg
  // minimum is the lowest positive trial in the studySummary (Deijen et al.,
  // 1999, 2g/day — operator decision 2026-10-09).
  const EVIDENCE: Record<string, { field: 'clinicalDose' | 'dosage' | 'studySummary'; text: string }> = {
    'lions-mane': { field: 'clinicalDose', text: '1–1.8g/day' },
    'bacopa-monnieri': { field: 'clinicalDose', text: '300–450mg/day (standardised to 55% bacosides)' },
    citicoline: { field: 'clinicalDose', text: '250–500mg/day' },
    'l-theanine': { field: 'clinicalDose', text: '100–200mg/day' },
    'rhodiola-rosea': { field: 'clinicalDose', text: '200–600mg/day' },
    phosphatidylserine: { field: 'clinicalDose', text: '100–300mg/day' },
    'alpha-gpc': { field: 'clinicalDose', text: '300–600mg/day' },
    ashwagandha: { field: 'clinicalDose', text: '300–600mg/day (KSM-66 extract)' },
    'huperzine-a': { field: 'clinicalDose', text: '100–200mcg/day' },
    'l-tyrosine': { field: 'studySummary', text: 'Deijen et al., 1999, 2g/day' },
    caffeine: { field: 'clinicalDose', text: '100–200mg' },
    'ginkgo-biloba': { field: 'dosage', text: '240mg/day of standardised extract (24/6)' },
    'dha-omega-3': { field: 'clinicalDose', text: '900mg–1.2g DHA/day' },
    'maritime-pine-bark': { field: 'clinicalDose', text: '100–200mg/day' },
    'acetyl-l-carnitine': { field: 'clinicalDose', text: '1500–3000mg/day' },
    'lutemax-2020': { field: 'clinicalDose', text: '12–27mg/day total lutein + zeaxanthin' },
    'oat-straw': { field: 'clinicalDose', text: '430–1600mg/day' },
    zynamite: { field: 'clinicalDose', text: '140–300mg/day' },
    dynamine: { field: 'clinicalDose', text: '100–150mg/day' },
    'longvida-curcumin': { field: 'clinicalDose', text: '400mg/day of Longvida' },
  };

  test('there are exactly the 20 approved anchors, one per evidence page', () => {
    expect(DOSING_ANCHORS).toHaveLength(20);
    expect(new Set(DOSING_ANCHORS.map((a) => a.ingredientSlug)).size).toBe(20);
    expect(Object.keys(EVIDENCE).sort()).toEqual(DOSING_ANCHORS.map((a) => a.ingredientSlug).sort());
  });

  test.each(DOSING_ANCHORS.map((anchor) => [anchor.ingredientSlug, anchor] as const))(
    '%s: the evidence page exists and states the anchor\'s range and minimum',
    (slug, anchor) => {
      const ingredient = ingredients.find((i) => i.slug === slug);
      expect(ingredient, `no ingredients entry for ${slug}`).toBeDefined();
      const evidence = EVIDENCE[slug];
      expect(evidence, `no EVIDENCE entry for ${slug}`).toBeDefined();
      const page = evidence.field === 'dosage' ? ingredient!.howToTake.dosage : ingredient![evidence.field];
      expect(page).toContain(evidence.text);
      expect(boundsMg(anchor.clinicalDose)).toEqual(boundsMg(evidence.text));
      expect(anchor.minMg).toBe(boundsMg(evidence.text)[0]);
    },
  );

  test('marker minimums are the anchor minimum × the evidence page\'s standardisation', () => {
    const bacopa = DOSING_ANCHORS.find((a) => a.ingredientSlug === 'bacopa-monnieri')!;
    expect(ingredients.find((i) => i.slug === 'bacopa-monnieri')!.clinicalDose).toContain('55% bacosides');
    expect(bacopa.marker!.minMg).toBe((bacopa.minMg * 55) / 100); // 165
    const ginkgo = DOSING_ANCHORS.find((a) => a.ingredientSlug === 'ginkgo-biloba')!;
    expect(ingredients.find((i) => i.slug === 'ginkgo-biloba')!.howToTake.dosage).toContain('(24/6)');
    expect(ginkgo.marker!.minMg).toBe((ginkgo.minMg * 24) / 100); // 57.6
  });

  test('every extract-basis anchor names the standardisation it needs printed', () => {
    for (const anchor of DOSING_ANCHORS.filter((a) => a.basis === 'extract')) {
      expect(anchor.standardisation, anchor.ingredientSlug).toBeInstanceOf(RegExp);
    }
  });
});
