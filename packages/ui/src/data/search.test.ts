import { describe, test, expect } from 'vitest';
import { buildSearchIndex } from '@nootropic/data';
import type { Product, Ingredient, Guide } from '@nootropic/data';

function product(overrides: Partial<Product> = {}): Product {
  return {
    slug: 'test-product',
    name: 'Test Product',
    brand: 'Brand',
    score: 8.0,
    summary: 'A test product summary that is long enough to be truncated when needed for the description.',
    bestFor: [],
    caffeineFree: true,
    priceMonthlyUSD: 50,
    moneyBackDays: 30,
    affiliateNetwork: '',
    affiliateUrl: '',
    ingredientDosages: [],
    market: 'us',
    ...overrides,
  } as Product;
}

function ingredient(overrides: Partial<Ingredient> = {}): Ingredient {
  return {
    slug: 'test-ing',
    name: 'Test Ingredient',
    category: 'amino',
    clinicalDose: '200mg',
    timeToEffect: '60 min',
    studySummary: '',
    productsContaining: [],
    humanEffects: [],
    sideEffects: [],
    howToTake: [],
    stackPairs: [],
    faq: [],
    ...overrides,
  } as Ingredient;
}

function guide(overrides: Partial<Guide> = {}): Guide {
  return {
    slug: 'test-guide',
    title: 'Test Guide',
    description: 'desc',
    sections: [],
    ...overrides,
  } as Guide;
}

describe('buildSearchIndex', () => {
  test('returns the 3 static page entries when given empty inputs', () => {
    const result = buildSearchIndex([], [], []);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.href)).toEqual([
      '/best-nootropics',
      '/nootropic-comparison',
      '/methodology',
    ]);
    for (const item of result) {
      expect(item.type).toBe('page');
    }
  });

  test('product entries include slug-based href and score in meta', () => {
    const result = buildSearchIndex(
      [product({ slug: 'foo', name: 'Foo', score: 9.2 })],
      [],
      []
    );
    const productItem = result.find((r) => r.type === 'product')!;
    expect(productItem.href).toBe('/foo');
    expect(productItem.title).toBe('Foo');
    expect(productItem.meta?.score).toBe(9.2);
  });

  test('product description is truncated to 100 chars', () => {
    const longSummary = 'A'.repeat(150);
    const result = buildSearchIndex([product({ summary: longSummary })], [], []);
    const item = result.find((r) => r.type === 'product')!;
    expect(item.description?.length).toBe(100);
  });

  test('ingredient grade A: at least one strong human effect', () => {
    const ing = ingredient({
      humanEffects: [
        { effect: 'focus', evidenceStrength: 'strong', magnitude: 'moderate', studies: 5, notes: '' },
        { effect: 'memory', evidenceStrength: 'preliminary', magnitude: 'small', studies: 1, notes: '' },
      ],
    } as Partial<Ingredient>);
    const result = buildSearchIndex([], [ing], []);
    const item = result.find((r) => r.type === 'ingredient')!;
    expect(item.meta?.grade).toBe('A');
  });

  test('ingredient grade B: highest is moderate (no strong)', () => {
    const ing = ingredient({
      humanEffects: [
        { effect: 'focus', evidenceStrength: 'moderate', magnitude: 'small', studies: 2, notes: '' },
        { effect: 'memory', evidenceStrength: 'preliminary', magnitude: 'small', studies: 1, notes: '' },
      ],
    } as Partial<Ingredient>);
    const item = buildSearchIndex([], [ing], []).find((r) => r.type === 'ingredient')!;
    expect(item.meta?.grade).toBe('B');
  });

  test('ingredient grade C: only preliminary or mixed', () => {
    const ing = ingredient({
      humanEffects: [
        { effect: 'focus', evidenceStrength: 'preliminary', magnitude: 'small', studies: 1, notes: '' },
      ],
    } as Partial<Ingredient>);
    const item = buildSearchIndex([], [ing], []).find((r) => r.type === 'ingredient')!;
    expect(item.meta?.grade).toBe('C');
  });

  test('ingredient grade C: empty humanEffects array (no evidence)', () => {
    const ing = ingredient({ humanEffects: [] });
    const item = buildSearchIndex([], [ing], []).find((r) => r.type === 'ingredient')!;
    expect(item.meta?.grade).toBe('C');
  });

  test('guide entries use the guide description verbatim', () => {
    const result = buildSearchIndex(
      [],
      [],
      [guide({ slug: 'g1', title: 'G1', description: 'Guide desc' })]
    );
    const item = result.find((r) => r.type === 'guide')!;
    expect(item.href).toBe('/guides/g1');
    expect(item.description).toBe('Guide desc');
  });

  test('total count = products + ingredients + guides + 3 page entries', () => {
    const result = buildSearchIndex(
      [product(), product({ slug: 'a' })],
      [ingredient(), ingredient({ slug: 'b' })],
      [guide()]
    );
    expect(result).toHaveLength(2 + 2 + 1 + 3);
  });
});
