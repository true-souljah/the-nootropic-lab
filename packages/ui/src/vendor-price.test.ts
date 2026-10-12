import { describe, test, expect } from 'vitest';
import { parseAmount, parseQuotedPrices, quoteSupply } from '@nootropic/data';

// Parsers for vendor price and pack wording (packages/data/src/vendor-price.ts),
// shared by the store price (store-price.ts; tests in store-price.test.ts).
// They never guess a price, a pack size or a currency.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const CAPSULES = { servingsPerContainer: 30, capsulesPerServing: 2 } as const;

describe('parseAmount', () => {
  test.each([
    ['31,75', 31.75],
    ['45,00', 45],
    ['69.00', 69],
    ['0.33', 0.33],
    ['129', 129],
    ['1,680', 1680],
    ['5,479', 5479],
    ['10.350', 10350],
    ['1.234,56', 1234.56],
    ['1,234.56', 1234.56],
    ['1,234,567', 1234567],
  ])('"%s" → %s', (raw, value) => {
    expect(parseAmount(raw)).toBe(value);
  });

  test.each(['12,3456', '1,23,456', '1.2.3', '12.34.567', 'abc', ''])('"%s" is ambiguous → null', (raw) => {
    expect(parseAmount(raw)).toBeNull();
  });
});

describe('parseQuotedPrices', () => {
  test.each([
    ['1 MONAT: 2 Packs, 60 Kapseln | 31,75 €', 'EUR', 31.75],
    ['One-time purchase | Price: €45,00', 'EUR', 45],
    ['One-time purchase Price: CA$89.00', 'CAD', 89],
    ['Price: C$59', 'CAD', 59],
    ['Price: A$84.99', 'AUD', 84.99],
    ['One-time purchase Price: $69.00', '$', 69],
    ['Price: US$90', 'USD', 90],
    ['Price: 64.99 USD', 'USD', 64.99],
    ['¥5,479', 'JPY', 5479],
    ['5,479円 カートに入れる 商品番号：5248', 'JPY', 5479],
    ['1 Pouch (1 month supply) ₱1,680', 'PHP', 1680],
    ['Price reduced to S$69.90', 'SGD', 69.9],
  ])('"%s" → %s %s', (text, currency, amount) => {
    const { prices, problems } = parseQuotedPrices(text);
    expect(problems).toEqual([]);
    expect(prices.map((p) => [p.currency, p.amount])).toEqual([[currency, amount]]);
  });

  test('a product number or a capsule count is not a price', () => {
    expect(parseQuotedPrices('商品番号：5248 180 capsules 2 Packs').prices).toEqual([]);
  });

  test('reads every price of a multi-price quote, including spaced "$ 59"', () => {
    const { prices } = parseQuotedPrices('1 Month Supply $129 $ 59 Save 54 % then $ 79 /mo $2.36 /dose');
    expect(prices.map((p) => p.amount)).toEqual([129, 59, 79, 2.36]);
  });

  test('an ambiguous number is reported, not read', () => {
    expect(parseQuotedPrices('€12,3456').problems).toEqual(['ambiguous price "€12,3456"']);
  });
});

describe('quoteSupply — months from the quote\'s own pack statement', () => {
  test('capsule count and stated month must agree (Hunter Focus: 180 capsules at 6/serving = 1 Month)', () => {
    expect(quoteSupply('1 Month – Starter Bottle 180 capsules Improved formula $90.00', { servingsPerContainer: 30, capsulesPerServing: 6 }))
      .toMatchObject({ ok: true, monthsOfSupply: 1 });
  });

  test('German pack statement (Brainzyme: 60 Kapseln at 2/serving = 1 MONAT); "2 Packs" is not read as containers', () => {
    expect(quoteSupply('1 MONAT: 2 Packs, 60 Kapseln | 31,75 €', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 1 });
  });

  test('a unit count alone (90 Count at 2/serving = 45 days)', () => {
    expect(quoteSupply('Capsules–90 Count | $79.95', { servingsPerContainer: 45, capsulesPerServing: 2 }))
      .toMatchObject({ ok: true, monthsOfSupply: 1.5 });
    // One container: the count can only be that container's.
    expect(quoteSupply('1 Bottle 60 capsules $50', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 1 });
  });

  test('a stated delivery cadence that contradicts the daily-serving count is refused (Qualia: 120 count at 6/serving = 20 days, but "delivered every 4 weeks")', () => {
    const r = quoteSupply('1 x Qualia Mind 2.0 - 120 count Boxed | delivered every 4 weeks', { servingsPerContainer: 20, capsulesPerServing: 6 });
    expect(r.ok).toBe(false);
    expect(quoteSupply('delivered every 4 weeks', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 0.9333 });
  });

  test('supplement-facts wording "Servings per container: 30" counts servings, one a day', () => {
    expect(quoteSupply('Servings per container: 30', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 1 });
    expect(quoteSupply('Servings Per Container: 20', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 0.6667 });
  });

  test('a capsule count and "Servings per container" must agree, or no supply is read', () => {
    expect(quoteSupply('60 CAPSULES | Servings per container: 30', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 1 });
    expect(quoteSupply('60 CAPSULES | Servings per container: 20', CAPSULES)).toMatchObject({ ok: false, reason: expect.stringMatching(/several pack sizes/) });
  });

  test('a stated supply alone, in days or Japanese', () => {
    expect(quoteSupply('45-day supply $79.95', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 1.5 });
    expect(quoteSupply('30日分 5,479円', CAPSULES)).toMatchObject({ ok: true, monthsOfSupply: 1 });
    expect(quoteSupply('1 Pouch (1 month supply) ₱1,680', { servingsPerContainer: null as unknown as number, capsulesPerServing: null as unknown as number }))
      .toMatchObject({ ok: true, monthsOfSupply: 1 });
  });

  test('a container count uses servingsPerContainer (BrainMD: 1 Unit × 30 servings)', () => {
    expect(quoteSupply('One-time purchase 1 Unit one-time delivery $64.95', { servingsPerContainer: 30, capsulesPerServing: 4 }))
      .toMatchObject({ ok: true, monthsOfSupply: 1 });
    expect(quoteSupply('2 bottles $120', { servingsPerContainer: 30, capsulesPerServing: 2 })).toMatchObject({ ok: true, monthsOfSupply: 2 });
  });

  test.each([
    ['One-time purchase Price: CA$89.00', CAPSULES, /no pack size or supply/],
    ['$19.99 (60 servings) 60CT. 180CT.', { servingsPerContainer: 90, capsulesPerServing: 1 }, /several pack sizes/],
    ['1-MONTH SUPPLY 60 CAPSULES $64.99', { servingsPerContainer: 30, capsulesPerServing: 4 }, /0\.5 months .* states "1-MONTH/],
    ['1 Month 2 Month $10', CAPSULES, /several supply lengths/],
    ['3g x 30 sachets S$69.90', CAPSULES, /counts sachets but the record's form is capsule/],
    ['1 Unit $64.95', { servingsPerContainer: 0, capsulesPerServing: 4 }, /needs servingsPerContainer/],
    ['90 Count $79.95', { servingsPerContainer: 45, capsulesPerServing: 0 }, /needs capsulesPerServing/],
    ['3 Bottles 60 capsules $150', CAPSULES, /per container or in total/],
  ])('refuses "%s"', (text, record, reason) => {
    const result = quoteSupply(text, record);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.reason).toMatch(reason);
  });
});
