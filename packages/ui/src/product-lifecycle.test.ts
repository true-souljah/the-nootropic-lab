import { describe, test, expect } from 'vitest';
import {
  activeProducts,
  isDiscontinued,
  affiliateUrlProblem,
  formulaProblem,
  productRuleProblems,
  scoreProblem,
  outOfTen,
  pillarText,
  guaranteeDays,
  productsUS, allProductsUS,
  productsEU, allProductsEU,
  productsCA, allProductsCA,
  productsAU, allProductsAU,
  productsJP, allProductsJP,
  allProductsLatam,
  productsGCC, allProductsGCC,
  productsSEA, allProductsSEA,
  regionsWithProduct,
  buildRegionSearchContext,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Discontinued products (2026-09-28 vendor verification) keep their review
// page but must be excluded from every recommendation surface. The shared
// list builder is `activeProducts`; each region's `products<R>` export is
// `activeProducts(allProducts<R>)`, so every list built from `products<R>`
// (best-of picks, comparison tables, home rails, alternatives, regional
// availability) excludes them. Record rules live in product-rules.ts and are
// enforced by scripts/validate-data.ts.

const dosage = { name: 'Bacopa', doseInProduct: '300mg', clinicalDose: '300mg', adequatelyDosed: true };

function fixture(overrides: Partial<Product>): Product {
  return {
    ...allProductsUS[0],
    ...overrides,
  };
}

describe('activeProducts — discontinued products are never recommendable', () => {
  test('drops a record with `discontinued` and keeps the rest in order', () => {
    const live1 = fixture({ slug: 'live-1' });
    const gone = fixture({
      slug: 'gone',
      discontinued: { since: '2026-09-28', successorSlug: 'live-1', note: 'Merged into live-1.' },
    });
    const live2 = fixture({ slug: 'live-2' });
    expect(activeProducts([live1, gone, live2]).map((p) => p.slug)).toEqual(['live-1', 'live-2']);
    expect(isDiscontinued(gone)).toBe(true);
    expect(isDiscontinued(live1)).toBe(false);
  });

  test('a stray null `discontinued` does not mark a product discontinued', () => {
    const strayNull = { discontinued: null } as unknown as Pick<Product, 'discontinued'>;
    expect(isDiscontinued(strayNull)).toBe(false);
    expect(activeProducts([strayNull])).toHaveLength(1);
  });

  test.each([
    ['us', productsUS, allProductsUS],
    ['eu', productsEU, allProductsEU],
    ['ca', productsCA, allProductsCA],
    ['au', productsAU, allProductsAU],
    ['jp', productsJP, allProductsJP],
  ] as const)('%s: Performance Lab Mind is on the full list but not the recommendable one', (_r, active, all) => {
    expect(all.some((p) => p.slug === 'performance-lab-mind-review')).toBe(true);
    expect(active.some((p) => p.slug === 'performance-lab-mind-review')).toBe(false);
    expect(active.every((p) => p.discontinued === undefined)).toBe(true);
  });

  test('au: Blackmores Brain Active is discontinued without a successor', () => {
    const blackmores = allProductsAU.find((p) => p.slug === 'blackmores-brain-active-review');
    expect(blackmores?.discontinued?.successorSlug).toBeUndefined();
    expect(productsAU.some((p) => p.slug === 'blackmores-brain-active-review')).toBe(false);
  });

  test('sea: Blackmores Brain Active is discontinued without a successor', () => {
    const blackmores = allProductsSEA.find((p) => p.slug === 'blackmores-brain-active-review');
    expect(blackmores?.discontinued).toBeDefined();
    expect(blackmores?.discontinued?.successorSlug).toBeUndefined();
    expect(productsSEA.some((p) => p.slug === 'blackmores-brain-active-review')).toBe(false);
    expect(productsSEA.every((p) => p.discontinued === undefined)).toBe(true);
    expect(productsGCC.every((p) => p.discontinued === undefined)).toBe(true);
  });

  test('eu: BRAINEFFECT FOCUS is discontinued without a successor', () => {
    const focus = allProductsEU.find((p) => p.slug === 'braineffect-focus-review');
    expect(focus).toBeDefined();
    expect(focus!.discontinued).toBeDefined();
    expect(focus!.discontinued!.successorSlug).toBeUndefined();
    expect(productsEU.some((p) => p.slug === 'braineffect-focus-review')).toBe(false);
  });

  test('every successorSlug resolves to a live review page in the same region', () => {
    for (const [all, active] of [
      [allProductsUS, productsUS], [allProductsEU, productsEU], [allProductsCA, productsCA],
      [allProductsAU, productsAU], [allProductsJP, productsJP],
      [allProductsGCC, productsGCC], [allProductsSEA, productsSEA],
    ] as const) {
      for (const p of all) {
        const successor = p.discontinued?.successorSlug;
        if (successor) expect(active.some((a) => a.slug === successor)).toBe(true);
      }
    }
  });

  test('discontinued review pages keep their hreflang regions (full lists)', () => {
    expect(regionsWithProduct('performance-lab-mind-review')).toEqual(
      expect.arrayContaining(['us', 'eu', 'ca', 'au', 'jp']),
    );
    expect(regionsWithProduct('blackmores-brain-active-review')).toEqual(
      expect.arrayContaining(['au', 'sea']),
    );
    expect(regionsWithProduct('braineffect-focus-review')).toEqual(['eu']);
  });
});

describe('record rules — affiliateUrl and formula', () => {
  test.each([
    'https://www.amazon.co.jp/s?k=FANCL+BRAINs',
    'https://www.amazon.com.br/s?k=X',
    'https://example.com/search?q=x',
    'https://example.com/?q=x',
    'https://www.example.com/search?q=focus',
    'https://www.example.com/catalog?q=focus',
    'https://www.example.com/search',
  ])('rejects a search-page URL: %s', (url) => {
    expect(affiliateUrlProblem(url)).toMatch(/search page/);
  });

  test('returns a problem (does not throw) for a non-string affiliateUrl', () => {
    expect(affiliateUrlProblem(undefined)).toMatch(/not a string/);
    expect(affiliateUrlProblem(null)).toMatch(/not a string/);
    expect(affiliateUrlProblem(42)).toMatch(/not a string/);
  });

  test('rejects non-https and relative URLs', () => {
    expect(affiliateUrlProblem('http://www.example.com/products/x')).toMatch(/not https/);
    expect(affiliateUrlProblem('/products/x')).toMatch(/not an absolute URL/);
    expect(affiliateUrlProblem('')).toMatch(/not an absolute URL/);
  });

  test('rejects a bare homepage unless the product is discontinued', () => {
    expect(affiliateUrlProblem('https://www.example.com/')).toMatch(/bare homepage/);
    expect(affiliateUrlProblem('https://www.example.com')).toMatch(/bare homepage/);
    expect(affiliateUrlProblem('https://www.example.com/', true)).toBeNull();
  });

  test('accepts an https product URL', () => {
    expect(affiliateUrlProblem('https://www.fancl.co.jp/healthy/item/5248a/')).toBeNull();
    expect(affiliateUrlProblem('https://www.performancelab.com/products/mind?a_aid=x&a_cid=y')).toBeNull();
  });

  test('rejects an empty formula and accepts a non-empty one', () => {
    expect(formulaProblem({ ingredientDosages: [] })).toMatch(/empty/);
    expect(formulaProblem({ ingredientDosages: [dosage] })).toBeNull();
  });

  test('productRuleProblems collects both violations', () => {
    const bad = productRuleProblems({ affiliateUrl: 'https://shop.example/s?k=x', ingredientDosages: [], ...scored });
    expect(bad).toHaveLength(2);
    expect(productRuleProblems({ affiliateUrl: 'https://shop.example/p/x', ingredientDosages: [dosage], ...scored })).toEqual([]);
  });
});

const scored = { score: 7.4, scoreBreakdown: { ingredients: 8, dosing: 7, transparency: 8, value: 7, trust: 7 } };

describe('scoreProblem — unscorable pillars (2026-10, SEA Supershrooms)', () => {
  const partial = { ingredients: 6, dosing: null, transparency: 4, value: null, trust: 4 };
  const reason = 'Doses are not disclosed, so dosing and value cannot be scored.';

  test('a fully scored record passes, whatever its editorial adjustment', () => {
    expect(scoreProblem(scored)).toBeNull();
    expect(scoreProblem({ ...scored, score: 8.1 })).toBeNull();
  });

  test('a null pillar needs unscoredReason', () => {
    expect(scoreProblem({ score: 4.7, scoreBreakdown: partial })).toMatch(/without unscoredReason/);
    expect(scoreProblem({ score: 4.7, scoreBreakdown: partial, unscoredReason: '  ' })).toMatch(/without unscoredReason/);
  });

  test('the overall score must be the weighted mean of the scored pillars', () => {
    // (0.25×6 + 0.20×4 + 0.10×4) / 0.55 = 4.909 — PILLAR_WEIGHTS renormalised over the scored pillars.
    expect(scoreProblem({ score: 4.9, scoreBreakdown: partial, unscoredReason: reason })).toBeNull();
    // An equal-weight mean (4.7) is not the published method.
    expect(scoreProblem({ score: 4.7, scoreBreakdown: partial, unscoredReason: reason })).toMatch(/weighted mean.*4\.9/);
    // The pre-fix live value: 5.5 cannot be derived from 6, 4, 4.
    expect(scoreProblem({ score: 5.5, scoreBreakdown: partial, unscoredReason: reason })).toMatch(/not the weighted mean.*4\.9/);
  });

  test('only dosing and value may be unscored', () => {
    const badPillar = { ...partial, trust: null } as unknown as typeof partial;
    expect(scoreProblem({ score: 5, scoreBreakdown: badPillar, unscoredReason: reason })).toMatch(/only dosing\/value may be null, got trust/);
  });

  test('every real record passes (the gate runs on these in validate-data)', () => {
    for (const p of [...allProductsUS, ...allProductsEU, ...allProductsCA, ...allProductsAU, ...allProductsJP, ...allProductsLatam, ...allProductsGCC, ...allProductsSEA]) {
      expect(scoreProblem(p), p.slug).toBeNull();
    }
    const supershrooms = allProductsSEA.find((p) => p.slug === 'supershrooms-focus-nootropic-review');
    expect(supershrooms?.score).toBe(4.9);
    expect(supershrooms?.unscoredReason).toMatch(/discloses no ingredient doses/);
  });
});

describe('display-values — nullable fields never render "null"', () => {
  test('pillars', () => {
    expect(outOfTen(7)).toBe('7/10');
    expect(outOfTen(null)).toBe('—');
    expect(pillarText(0)).toBe('0');
    expect(pillarText(null)).toBe('—');
  });

  test('guarantee length', () => {
    expect(guaranteeDays(30, (d) => `${d} days`)).toBe('30 days');
    expect(guaranteeDays(null, (d) => `${d} days`)).toBe('—');
  });
});

describe('search — discontinued products stay findable', () => {
  test('AU search index includes Blackmores Brain Active, labelled discontinued', () => {
    const { searchItems } = buildRegionSearchContext(allProductsAU, 'en');
    const row = searchItems.find((i) => i.href === '/blackmores-brain-active-review/');
    expect(row?.title).toBe('Blackmores Brain Active (Discontinued)');
    const live = searchItems.find((i) => i.href === '/mind-lab-pro-review/');
    expect(live?.title).toBe('Mind Lab Pro');
  });
});

describe('Trustpilot figures carry their check date', () => {
  test.each([
    ['us', allProductsUS], ['eu', allProductsEU], ['ca', allProductsCA],
    ['au', allProductsAU], ['jp', allProductsJP], ['latam', allProductsLatam],
    ['gcc', allProductsGCC], ['sea', allProductsSEA],
  ] as const)('%s: every non-null trustpilotScore has trustpilotCheckedAt', (_r, products) => {
    const unchecked = products
      .filter((p) => p.trustpilotScore != null && !p.trustpilotCheckedAt)
      .map((p) => p.slug);
    expect(unchecked).toEqual([]);
  });
});

describe('product copy follows the 2026-09 ingredient evidence review', () => {
  // The review found no trial of a "5 days on / 2 off" Huperzine A cycle
  // (ingredients-evidence.test.ts bans it in ingredient copy); product
  // records must not prescribe it either. Only sentences that mention
  // huperzine are checked, so a brand's own on/off regimen for a whole
  // product (Qualia Mind) is not flagged. A sentence that says no trial
  // tested a cycling schedule is the corrected copy, not a cycling rule.
  const ON_OFF_OR_CYCLE =
    /\bcycl|\b(\d+|one|two|three|four|five|six|seven)\s*(days?\s*)?[- ]?on\b.{0,40}\boff\b/i;
  const NEGATED_CYCLING = /\bno (trial|study|evidence)\b[^.]*\bcycl/i;
  const huperzineCyclingSentences = (text: string): string[] =>
    text
      .split(/\.\s|","/)
      .filter((s) => /huperzine/i.test(s))
      .filter((s) => ON_OFF_OR_CYCLE.test(s) && !NEGATED_CYCLING.test(s));

  test('matcher self-test: catches cycling rules, ignores non-huperzine regimens and neutral copy', () => {
    for (const bad of [
      'Cycle Huperzine A (5 days on, 2 off).',
      'Take huperzine A five days on, two days off.',
      'Huperzine A: 5-on-2-off cycling recommended.',
    ]) {
      expect(huperzineCyclingSentences(bad), bad).toHaveLength(1);
    }
    for (const ok of [
      'Qualia Mind is taken 5 days on, 2 days off.',
      'Huperzine A has a long half-life; follow the label.',
      'Huperzine A has a long half-life; no trial has tested a cycling schedule, so follow the label and stop if you notice cholinergic side effects (nausea, cramps, vivid dreams).',
    ]) {
      expect(huperzineCyclingSentences(ok), ok).toEqual([]);
    }
  });

  test.each([
    ['us', allProductsUS], ['eu', allProductsEU], ['ca', allProductsCA],
    ['au', allProductsAU], ['jp', allProductsJP], ['latam', allProductsLatam],
    ['gcc', allProductsGCC], ['sea', allProductsSEA],
  ] as const)('%s: no product prescribes an untested huperzine cycling rule', (_r, products) => {
    expect(products.length).toBeGreaterThan(0);
    const offenders = products.flatMap((p) =>
      huperzineCyclingSentences(JSON.stringify(p)).map((s) => `${p.slug}: ${s}`),
    );
    expect(offenders).toEqual([]);
  });
});
