import { describe, test, expect } from 'vitest';
import {
  activeProducts,
  isDiscontinued,
  affiliateUrlProblem,
  formulaProblem,
  productRuleProblems,
  productsUS, allProductsUS,
  productsEU, allProductsEU,
  productsCA, allProductsCA,
  productsAU, allProductsAU,
  productsJP, allProductsJP,
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

  test('every successorSlug resolves to a live review page in the same region', () => {
    for (const [all, active] of [
      [allProductsUS, productsUS], [allProductsEU, productsEU], [allProductsCA, productsCA],
      [allProductsAU, productsAU], [allProductsJP, productsJP],
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
    expect(regionsWithProduct('blackmores-brain-active-review')).toContain('au');
  });
});

describe('record rules — affiliateUrl and formula', () => {
  test.each([
    'https://www.amazon.co.jp/s?k=FANCL+BRAINs',
    'https://www.example.com/search?q=focus',
    'https://www.example.com/catalog?q=focus',
    'https://www.example.com/search',
  ])('rejects a search-page URL: %s', (url) => {
    expect(affiliateUrlProblem(url)).toMatch(/search page/);
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
    const bad = productRuleProblems({ affiliateUrl: 'https://shop.example/s?k=x', ingredientDosages: [] });
    expect(bad).toHaveLength(2);
    expect(productRuleProblems({ affiliateUrl: 'https://shop.example/p/x', ingredientDosages: [dosage] })).toEqual([]);
  });
});

describe('search — discontinued products stay findable', () => {
  test('AU search index includes Blackmores Brain Active, labelled discontinued', () => {
    const { searchItems } = buildRegionSearchContext(allProductsAU, 'en');
    const row = searchItems.find((i) => i.href === '/blackmores-brain-active-review');
    expect(row?.title).toBe('Blackmores Brain Active (Discontinued)');
    const live = searchItems.find((i) => i.href === '/mind-lab-pro-review');
    expect(live?.title).toBe('Mind Lab Pro');
  });
});
