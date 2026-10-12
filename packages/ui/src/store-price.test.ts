import { describe, test, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  formatMoney, storeSupply, monthlyStorePrice, sharedCurrency, storePriceProblems, getStrings,
} from '@nootropic/data';
import type { Product, StorePrice } from '@nootropic/data';
import { priceText } from './price-text';

// Store prices (site-owner policy 2026-10-09): a price shown is the one the
// vendor states on the store a region links to, in that store's own currency,
// never converted. Display = pack price + what it covers, plus "≈ …/mo" only
// where the pack's supply can be read from the vendor's own words.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const REGIONS: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const BASE = allProductsUS[0];
const sp = (over: Partial<StorePrice>): StorePrice => ({
  amount: 79.95, currency: 'USD', text: '$79.95', pack: '90 Count', url: 'https://example.com/p', checkedAt: '2026-10-09', ...over,
});
const withPrice = (over: Partial<StorePrice>, label: Partial<Product> = { capsulesPerServing: 2, servingsPerContainer: 45, form: 'capsule' }) =>
  ({ ...BASE, ...label, storePrice: sp(over) }) as Product;

describe('formatMoney', () => {
  test('keeps the cents a vendor states; whole amounts print without decimals', () => {
    expect(formatMoney({ amount: 31.75, currency: 'EUR' }, 'de-DE')).toMatch(/^31,75\s€$/);
    expect(formatMoney({ amount: 79.95, currency: 'USD' }, 'en-US')).toBe('$79.95');
    expect(formatMoney({ amount: 40, currency: 'EUR' }, 'en-IE')).toBe('€40');
    expect(formatMoney({ amount: 5479, currency: 'JPY' }, 'ja-JP')).toMatch(/^[￥¥]5,479$/);
  });
  test("names a foreign dollar in the reader's locale (no bare $ for another country's dollar)", () => {
    expect(formatMoney({ amount: 79.95, currency: 'USD' }, 'en-CA')).toBe('US$79.95');
    expect(formatMoney({ amount: 89, currency: 'CAD' }, 'en-CA')).toBe('$89');
    expect(formatMoney({ amount: 69.9, currency: 'SGD' }, 'en-SG')).toBe('$69.90');
    expect(formatMoney({ amount: 79.95, currency: 'USD' }, 'en-SG')).toBe('US$79.95');
  });
});

describe('storeSupply / monthlyStorePrice — only from the vendor\'s own pack wording', () => {
  test('a stated supply: "45-day supply" → 1.5 months', () => {
    expect(storeSupply(withPrice({ supply: '90 Count 45-day supply' }))).toMatchObject({ ok: true, monthsOfSupply: 1.5 });
    expect(monthlyStorePrice(withPrice({ supply: '90 Count 45-day supply' }))).toMatchObject({ amount: 53.3, currency: 'USD' });
  });
  test('a pack count with the label serving size (90 Count at 2 a day = 45 days)', () => {
    expect(monthlyStorePrice(withPrice({}))).toMatchObject({ amount: 53.3, currency: 'USD' });
  });
  test('the per-month figure stays in the store currency (never converted)', () => {
    const m = monthlyStorePrice(withPrice({ amount: 31.75, currency: 'EUR', text: '31,75 €', pack: '60 Kapseln', supply: '1 MONAT' }));
    expect(m).toMatchObject({ amount: 31.75, currency: 'EUR' });
  });
  test('a pre-workout taken "before exercise" has no per-month figure (a serving is not a day)', () => {
    const preWorkout = withPrice({ amount: 59, text: '$59.00', pack: 'Servings per container: 20', directions: 'Mix 1 scoop in 10oz of water and take 30 minutes before exercise.' }, { servingsPerContainer: 20, capsulesPerServing: 1, form: 'powder' });
    expect(storeSupply(preWorkout)).toMatchObject({ ok: false, reason: /before exercise/ });
    expect(monthlyStorePrice(preWorkout)).toBeNull();
  });
  test('whole-day supplies divide exactly (CA$79 for 20 servings = CA$118.50, not 118.49)', () => {
    expect(monthlyStorePrice(withPrice({ amount: 79, currency: 'CAD', text: 'CA$79.00', pack: 'Servings per container: 20' }, { servingsPerContainer: 20, capsulesPerServing: 1, form: 'powder' }))).toMatchObject({ amount: 118.5 });
  });
  test('no supply wording → no per-month figure', () => {
    expect(monthlyStorePrice(withPrice({ pack: 'One bottle' }))).toBeNull();
    expect(monthlyStorePrice({ ...BASE, storePrice: undefined })).toBeNull();
  });
});

describe('sharedCurrency', () => {
  test('one currency or null for a mix (an average or sort would need a conversion)', () => {
    expect(sharedCurrency([withPrice({}), withPrice({ amount: 69 , text: '$69.00' })])).toBe('USD');
    expect(sharedCurrency([withPrice({}), withPrice({ amount: 45, currency: 'EUR', text: '€45,00' })])).toBeNull();
  });
});

describe('priceText', () => {
  const en = getStrings('en');
  test('per-month figure when the supply is stated, else pack price with what it covers', () => {
    expect(priceText(withPrice({ supply: '45-day supply' }), { ...en, priceLocale: 'en-US' })).toMatchObject({
      pack: '$79.95', packText: '90 Count', monthly: '≈ $53.30/mo', short: '≈ $53.30/mo',
    });
    expect(priceText(withPrice({ pack: 'One bottle' }), { ...en, priceLocale: 'en-CA' })).toMatchObject({
      pack: 'US$79.95', monthly: null, short: 'US$79.95 · One bottle',
    });
  });
  test('null without a store price', () => {
    expect(priceText({ ...BASE, storePrice: undefined }, en)).toBeNull();
  });
});

describe('storePriceProblems', () => {
  test('a sound store price passes', () => {
    expect(storePriceProblems(withPrice({}))).toEqual([]);
  });
  test.each([
    [{ amount: 80 }, /not the price in its text/],
    [{ currency: 'usd' }, /ISO 4217/],
    [{ text: '$79.95 or $69.95' }, /exactly one price/],
    [{ text: '€79,95', currency: 'USD', amount: 79.95 }, /contradicts its text/],
    [{ pack: '' }, /verbatim text/],
    [{ url: 'http://example.com' }, /https URL/],
    [{ url: 'https://' }, /https URL/],
    [{ checkedAt: '2026-02-31' }, /ISO date/],
    [{ text: 'From $79.95' }, /"from" price/],
    [{ currency: 'EUR' }, /not a dollar currency/],
    [{ url: 'https://example.com/p?affid=1' }, /no query or fragment/],
    [{ checkedAt: '9 Oct' }, /ISO date/],
  ] as [Partial<StorePrice>, RegExp][])('rejects %o', (over, reason) => {
    expect(storePriceProblems(withPrice(over)).join('\n')).toMatch(reason);
  });
  test('an unknown key is rejected', () => {
    expect(storePriceProblems({ ...BASE, storePrice: { ...sp({}), converted: true } as StorePrice }).join('\n')).toMatch(/unknown key/);
  });
});

describe('every record', () => {
  test('carries no legacy per-currency price field, and every store price is sound', () => {
    let priced = 0;
    for (const [region, products] of Object.entries(REGIONS)) {
      for (const p of products) {
        expect(Object.keys(p).filter((k) => /^priceMonthly|^priceBasis$/.test(k)), `${region}/${p.slug}`).toEqual([]);
        expect(storePriceProblems(p), `${region}/${p.slug}`).toEqual([]);
        if (p.storePrice) priced++;
      }
    }
    // Fail closed: a dropped field must not pass as "no problems".
    expect(priced).toBeGreaterThanOrEqual(40);
  });
});
