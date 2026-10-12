import { describe, test, expect } from 'vitest';
import { allProductsUS, allProductsCA } from '@nootropic/data';
import type { Product, StorePrice } from '@nootropic/data';
import { priceSortable, sortRows } from './templates/comparator/utils';

// The comparator never ranks prices in different currencies against each other
// (site-owner policy 2026-10-09: store prices, never converted). Found by the
// 3-lab review of the store-price PR: the Price column still sorted raw amounts
// when the filter had already been limited to one currency.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const BASE = allProductsUS[0];
const priced = (slug: string, amount: number, currency: string, score = 8): Product =>
  ({
    ...BASE, slug, score, servingsPerContainer: 30, capsulesPerServing: 1, form: 'capsule',
    storePrice: { amount, currency, text: `${amount}`, pack: 'Servings per container: 30', url: 'https://example.com/p', checkedAt: '2026-10-09' } satisfies StorePrice,
  }) as Product;

describe('comparator price sort', () => {
  test('sorts by the per-month store price when every price shares one currency', () => {
    const rows = [priced('a', 69, 'USD'), priced('b', 44, 'USD'), priced('c', 90, 'USD')];
    expect(priceSortable(rows)).toBe(true);
    expect(sortRows(rows, 'price', 'asc', true).map((p) => p.slug)).toEqual(['b', 'a', 'c']);
    expect(sortRows(rows, 'price', 'desc', true).map((p) => p.slug)).toEqual(['c', 'a', 'b']);
  });

  test('keeps the given order when prices are in several currencies', () => {
    const rows = [priced('a', 89, 'CAD'), priced('b', 79.95, 'USD'), priced('c', 59, 'CAD')];
    expect(priceSortable(rows)).toBe(false);
    expect(sortRows(rows, 'price', 'asc', false).map((p) => p.slug)).toEqual(['a', 'b', 'c']);
    expect(sortRows(rows, 'price', 'desc', false).map((p) => p.slug)).toEqual(['a', 'b', 'c']);
  });

  test('other sort keys are unaffected', () => {
    const rows = [priced('a', 89, 'CAD', 7), priced('b', 79.95, 'USD', 9)];
    expect(sortRows(rows, 'score', 'desc', false).map((p) => p.slug)).toEqual(['b', 'a']);
  });

  test('real data: Canada mixes CAD and USD store prices, so its table has no price sort', () => {
    expect(priceSortable(allProductsCA)).toBe(false);
  });
});
