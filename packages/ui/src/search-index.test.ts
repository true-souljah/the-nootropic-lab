import { describe, test, expect } from 'vitest';
import {
  buildSearchIndex,
  productsUS,
  productsEU,
  productsCA,
  productsAU,
  productsJP,
  productsLatam,
  productsGCC,
  productsSEA,
  ingredients,
  guides,
} from '@nootropic/data';
import type {
  Product,
  Ingredient,
  Guide,
  SearchItem,
} from '@nootropic/data';

// Tests for packages/data/src/search.ts (buildSearchIndex).
// The helper feeds the SearchModal index across all 8 region apps via
// the buildRegionSearchContext wrapper. A regression in its output
// shape (missing required field, wrong type tag, broken URL pattern,
// truncated description) would propagate to the in-app search on
// every region.
//
// Cross-package test placement: see product-schema.test.ts.

const NUM_HARDCODED_PAGES = 3; // 'Best Nootropics', 'Compare All', 'Methodology'

function stubProduct(over: Partial<Product> = {}): Product {
  return {
    id: 'p',
    name: 'Test Product',
    brand: 'Test Brand',
    slug: 'test-product',
    bestFor: [],
    score: 8.0,
    scoreBreakdown: { ingredients: 8, dosing: 8, transparency: 8, value: 8, trust: 8 },
    pricingModel: 'one-time',
    moneyBackDays: 30,
    caffeineFree: true,
    euStorefront: false,
    euCompliance: 'verify',
    trustpilotScore: null,
    trustpilotCount: null,
    affiliateUrl: 'https://example.com',
    affiliateNetwork: 'Test',
    commissionRate: '10%',
    cookieDays: 30,
    heroIngredients: [],
    ingredientDosages: [],
    servingsPerContainer: 30,
    capsulesPerServing: 1,
    summary: 'Test summary.',
    whatItIs: 'Test',
    howItWorks: 'Test',
    whatToExpect: 'Test',
    pros: [],
    cons: [],
    editorChoice: false,
    market: 'us',
    ...over,
  };
}

function stubIngredient(over: Partial<Ingredient> = {}): Ingredient {
  return {
    slug: 'test-ingredient',
    name: 'Test Ingredient',
    category: 'amino',
    clinicalDose: '100-200mg',
    onsetMin: 30,
    halfLifeMin: 60,
    mechanism: 'Test',
    humanEffects: [],
    benefits: [],
    sideEffects: [],
    howToTake: { dose: '100mg', timing: 'morning', cycling: 'none', form: 'capsule' },
    stacking: [],
    faqs: [],
    relatedSlugs: [],
    ...over,
  } as Ingredient;
}

function stubGuide(over: Partial<Guide> = {}): Guide {
  return {
    slug: 'test-guide',
    title: 'Test Guide',
    description: 'Test guide description.',
    category: 'beginner',
    readingTimeMin: 5,
    sections: [],
    ...over,
  };
}

describe('buildSearchIndex — output shape', () => {
  test('returns an array of length (products + ingredients + guides + 3 hardcoded pages)', () => {
    const items = buildSearchIndex(
      [stubProduct(), stubProduct({ slug: 'p2', id: 'p2' })],
      [stubIngredient(), stubIngredient({ slug: 'i2' })],
      [stubGuide()],
    );
    expect(items).toHaveLength(2 + 2 + 1 + NUM_HARDCODED_PAGES);
  });

  test('every item has required fields (title, href, type)', () => {
    const items = buildSearchIndex([stubProduct()], [stubIngredient()], [stubGuide()]);
    for (const item of items) {
      expect(item.title, `item: ${JSON.stringify(item)}`).toBeTruthy();
      expect(item.href, `item: ${JSON.stringify(item)}`).toBeTruthy();
      expect(['product', 'ingredient', 'guide', 'page']).toContain(item.type);
    }
  });

  test('emits 3 hardcoded page items even with empty inputs', () => {
    const items = buildSearchIndex([], [], []);
    expect(items).toHaveLength(NUM_HARDCODED_PAGES);
    const pageItems = items.filter((i) => i.type === 'page');
    expect(pageItems.map((p) => p.title).sort()).toEqual([
      'Best Nootropics',
      'Compare All',
      'Methodology',
    ]);
  });

  test('hardcoded page items point at expected routes', () => {
    const items = buildSearchIndex([], [], []);
    const hrefs = items.filter((i) => i.type === 'page').map((i) => i.href);
    expect(hrefs).toContain('/best-nootropics');
    expect(hrefs).toContain('/nootropic-comparison');
    expect(hrefs).toContain('/methodology');
  });
});

describe('buildSearchIndex — product items', () => {
  test('product href is /<slug> (no /products prefix, no trailing slash)', () => {
    const items = buildSearchIndex([stubProduct({ slug: 'mind-lab-pro-review' })], [], []);
    const productItem = items.find((i) => i.type === 'product');
    expect(productItem?.href).toBe('/mind-lab-pro-review');
  });

  test('product meta.score is propagated', () => {
    const items = buildSearchIndex([stubProduct({ score: 9.2 })], [], []);
    const productItem = items.find((i) => i.type === 'product') as SearchItem;
    expect(productItem.meta?.score).toBe(9.2);
  });

  test('product description is truncated to first 100 chars of summary', () => {
    const longSummary = 'A'.repeat(150);
    const items = buildSearchIndex(
      [stubProduct({ summary: longSummary })],
      [],
      [],
    );
    const productItem = items.find((i) => i.type === 'product');
    expect(productItem?.description).toHaveLength(100);
    expect(productItem?.description).toBe('A'.repeat(100));
  });
});

describe('buildSearchIndex — ingredient items', () => {
  test('ingredient href is /ingredients/<slug>', () => {
    const items = buildSearchIndex([], [stubIngredient({ slug: 'l-theanine' })], []);
    const ingredientItem = items.find((i) => i.type === 'ingredient');
    expect(ingredientItem?.href).toBe('/ingredients/l-theanine');
  });

  test('ingredient grade is C when all evidence is weak/null', () => {
    const ingredient = stubIngredient({ humanEffects: [] });
    const items = buildSearchIndex([], [ingredient], []);
    const ingredientItem = items.find((i) => i.type === 'ingredient') as SearchItem;
    expect(ingredientItem.meta?.grade).toBe('C');
  });

  test('ingredient grade is B when at least one evidence is moderate', () => {
    const ingredient = stubIngredient({
      humanEffects: [
        { effect: 'Memory', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 3, notes: '' },
        { effect: 'Focus', evidenceStrength: 'preliminary', magnitude: 'small', studies: 1, notes: '' },
      ],
    });
    const items = buildSearchIndex([], [ingredient], []);
    const ingredientItem = items.find((i) => i.type === 'ingredient') as SearchItem;
    expect(ingredientItem.meta?.grade).toBe('B');
  });

  test('ingredient grade is A when at least one evidence is strong (highest grade wins)', () => {
    const ingredient = stubIngredient({
      humanEffects: [
        { effect: 'Memory', evidenceStrength: 'strong', magnitude: 'moderate', studies: 12, notes: '' },
        { effect: 'Focus', evidenceStrength: 'moderate', magnitude: 'small', studies: 3, notes: '' },
      ],
    });
    const items = buildSearchIndex([], [ingredient], []);
    const ingredientItem = items.find((i) => i.type === 'ingredient') as SearchItem;
    expect(ingredientItem.meta?.grade).toBe('A');
  });
});

describe('buildSearchIndex — guide items', () => {
  test('guide href is /guides/<slug>', () => {
    const items = buildSearchIndex([], [], [stubGuide({ slug: 'what-are-nootropics' })]);
    const guideItem = items.find((i) => i.type === 'guide');
    expect(guideItem?.href).toBe('/guides/what-are-nootropics');
  });

  test('guide description is the full description (not truncated)', () => {
    const longDesc = 'B'.repeat(200);
    const items = buildSearchIndex([], [], [stubGuide({ description: longDesc })]);
    const guideItem = items.find((i) => i.type === 'guide');
    expect(guideItem?.description).toBe(longDesc);
  });
});

describe('buildSearchIndex — works on every real region catalog', () => {
  test.each([
    ['us', productsUS],
    ['eu', productsEU],
    ['ca', productsCA],
    ['au', productsAU],
    ['jp', productsJP],
    ['latam', productsLatam],
    ['gcc', productsGCC],
    ['sea', productsSEA],
  ] as const)('%s catalog produces a valid index with expected counts', (region, catalog) => {
    const items = buildSearchIndex(catalog, ingredients, guides);
    expect(items.length).toBe(catalog.length + ingredients.length + guides.length + NUM_HARDCODED_PAGES);

    const productItems = items.filter((i) => i.type === 'product');
    expect(productItems, `${region} product count`).toHaveLength(catalog.length);

    for (const item of productItems) {
      expect(item.href, `${region} ${item.title} href`).toMatch(/^\/[a-z0-9-]+$/);
      expect(item.meta?.score, `${region} ${item.title} score`).toBeGreaterThan(0);
      expect(item.meta?.score, `${region} ${item.title} score range`).toBeLessThanOrEqual(10);
    }
  });
});
