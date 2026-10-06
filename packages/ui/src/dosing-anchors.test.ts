import { describe, test, expect } from 'vitest';
import {
  DOSING_ANCHORS,
  doseMg,
  dosingAnchorProblems,
  ingredients,
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { IngredientDosage } from '@nootropic/data';

// Dosing anchors (packages/data/src/dosing-anchors.ts, 2026-10-06): product
// rows for ALCAR and DHA must carry the clinicalDose of the site's own
// evidence page and an adequacy verdict derived from its lower bound.
// scripts/validate-data.ts enforces the same rule on the catalogue.

const row = (overrides: Partial<IngredientDosage>): IngredientDosage => ({
  name: 'Acetyl-L-Carnitine',
  doseInProduct: '500mg',
  clinicalDose: '1500-3000mg/day',
  adequatelyDosed: false,
  ...overrides,
});
const problemsFor = (...rows: IngredientDosage[]) =>
  dosingAnchorProblems({ slug: 'fixture-review', ingredientDosages: rows });

describe('doseMg — leading number + unit in milligrams', () => {
  test.each([
    ['500mg', 500],
    ['1.16g', 1160],
    ['80mg', 80],
    ['540mg', 540],
    ['2200mg blend (split undisclosed)', 2200],
    ['n/a', null],
    ['50mcg', null],
    ['50mcg (2000 IU)', null],
  ] as const)('%s → %s', (dose, mg) => {
    expect(doseMg(dose)).toBe(mg);
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
    expect(problems[0]).toMatch(/adequatelyDosed is true but 80mg is below the 900mg/);
  });

  test('a matching row whose dose cannot be parsed → 1 problem', () => {
    const problems = problemsFor(row({ doseInProduct: 'proprietary blend' }));
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/unparseable dose/);
  });

  test.each(['EPA (algal)', 'Ashwagandha (KSM-66)', 'Phosphatidylserine'])(
    'a non-matching row (%s) → 0 problems',
    (name) => {
      expect(problemsFor(row({ name, clinicalDose: 'anything', adequatelyDosed: true }))).toEqual([]);
    },
  );

  // Plain L-carnitine has a different evidence base from ALCAR, so the ALCAR
  // anchor must not govern it.
  test.each(['L-Carnitine', 'L-Carnitine Tartrate'])(
    'plain L-carnitine (%s) is not held to the ALCAR anchor → 0 problems',
    (name) => {
      expect(problemsFor(row({ name, clinicalDose: '500-2000mg', adequatelyDosed: true }))).toEqual([]);
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

  test('every anchored row in all eight regions passes, and the scan is not empty', () => {
    const problems: string[] = [];
    let matched = 0;
    for (const [region, products] of Object.entries(CATALOGUES)) {
      for (const product of products) {
        matched += product.ingredientDosages.filter((d) => DOSING_ANCHORS.some((a) => a.match.test(d.name))).length;
        problems.push(...dosingAnchorProblems(product).map((p) => `${region}/${p}`));
      }
    }
    expect(problems).toEqual([]);
    expect(matched).toBeGreaterThanOrEqual(10);
  });
});

describe('each anchor restates its evidence page', () => {
  // The dose bounds of each evidence page's howToTake.dosage. Adding an anchor
  // without listing its bounds here fails the test.
  const EVIDENCE_BOUNDS: Record<string, readonly [string, string]> = {
    'acetyl-l-carnitine': ['1500', '3000'],
    'dha-omega-3': ['900mg', '1.2g'],
  };

  test.each(DOSING_ANCHORS.map((anchor) => [anchor.ingredientSlug, anchor] as const))(
    '%s: the evidence page exists and carries the anchor numbers',
    (slug, anchor) => {
      const ingredient = ingredients.find((i) => i.slug === slug);
      expect(ingredient, `no ingredients entry for ${slug}`).toBeDefined();
      const bounds = EVIDENCE_BOUNDS[slug];
      expect(bounds, `no EVIDENCE_BOUNDS entry for ${slug}`).toBeDefined();
      for (const bound of bounds) {
        expect(ingredient!.howToTake.dosage).toContain(bound);
        expect(anchor.clinicalDose).toContain(bound);
      }
      expect(bounds[0].startsWith(String(anchor.minMg))).toBe(true);
    },
  );
});
