import { describe, test, expect } from 'vitest';
import {
  parseAmount, parseQuotedPrices, quoteSupply, packServings, statedSupplyDays, dailyServings, servingsInPack,
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

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

// ── Per-serving / per-day inputs (2026-10-12) ────────────────────────────
// Every stored wording is listed below with the outcome it must have, and a
// stored wording missing from a table fails the suite: new data cannot reach
// a page unclassified.

const REGIONS: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const PRICED = Object.entries(REGIONS).flatMap(([region, products]) =>
  products.filter((p) => p.storePrice).map((p) => ({ where: `${region}/${p.id}`, p, sp: p.storePrice! })),
);
/** "ok N" or the refusal reason, so one table compares both kinds of outcome. */
const outcome = (r: { ok: true; servings?: number; perDay?: number; days?: number } | { ok: false; reason: string }): number | string =>
  r.ok ? (r.servings ?? r.perDay ?? r.days)! : r.reason;

/** Fails when a stored wording is missing from `table`, or `table` lists a wording no record has. */
function expectEveryWordingClassified(table: Record<string, unknown>, stored: string[]) {
  const missing = [...new Set(stored)].filter((s) => !(s in table));
  expect(missing, `classify these stored wordings: ${JSON.stringify(missing)}`).toEqual([]);
  const stale = Object.keys(table).filter((k) => !stored.includes(k));
  expect(stale, 'table rows no record has any more').toEqual([]);
}

describe('packServings — servings from the pack count only', () => {
  /** Every distinct storePrice.pack on file → servings (with its records' label fields), or the refusal. */
  const PACKS: Record<string, number | string> = {
    'Servings per container: 30': 30,
    'Servings Per Container: 30': 30,
    'Single servings per container: 30': 30,
    'Servings per container: 20': 20,
    '60 CAPSULES': 30, // 2 per serving
    '1 x Qualia Mind 2.0 - 120 count Boxed': 20, // 6 per serving
    '90 Count': 45, // 2 per serving
    '60ct.': 60, // 1 per serving
    '300 Count': 150, // 2 per serving
    '180 capsules': 30, // 6 per serving
    '1 Unit': 30, // × servingsPerContainer 30
    '1 MONAT: 2 Packs, 60 Kapseln': 30, // 2 per serving; "2 Packs" is not a container count
    '240粒入/約60日分': 60, // 4 per serving; "約60日分" is a duration, not read
    '3g x 30 sachets': 30, // 1 per serving
    '90 Capsules': 30, // 3 per serving
    'Tropical Ice x 12 cans': 12, // 1 can per serving (form "can")
    '30日分': 'no pack count stated in the quote (a supply length is not a count)',
    '1 Pouch': '"1 Pouch" needs servingsPerContainer, which the record lacks',
  };

  test('every stored pack wording is in the table, and reads as listed for each record', () => {
    expect(PRICED.length).toBeGreaterThanOrEqual(40);
    expectEveryWordingClassified(PACKS, PRICED.map((r) => r.sp.pack));
    for (const { where, p, sp } of PRICED) {
      expect(outcome(packServings(sp.pack, p)), `${where} "${sp.pack}"`).toBe(PACKS[sp.pack]);
      // The page reads supply + pack together; a supply wording adds no count.
      expect(outcome(servingsInPack(p)), `${where} with its supply`).toBe(PACKS[sp.pack]);
    }
  });

  test.each([
    ['30日分', { servingsPerContainer: 30, capsulesPerServing: 4, form: 'tablet' }, /no pack count stated .*not a count/],
    ['1 Month', CAPSULES, /no pack count stated .*not a count/],
    ['One bottle', CAPSULES, /no pack count stated/],
    ['1 Pouch', { servingsPerContainer: null as unknown as number, capsulesPerServing: null as unknown as number }, /needs servingsPerContainer/],
    ['3 Bottles 60 capsules', CAPSULES, /per container or in total/],
    ['60 CAPSULES | Servings per container: 20', CAPSULES, /several pack sizes/],
    ['1 Unit 2 Bottles', CAPSULES, /several pack counts/],
    ['3g x 30 sachets', CAPSULES, /counts sachets but the record's form is capsule/],
    ['Tropical Ice x 12 cans', CAPSULES, /counts cans but the record's form is capsule/],
    ['90 Count', { servingsPerContainer: 45, capsulesPerServing: 0 }, /needs capsulesPerServing/],
  ] as [string, Parameters<typeof packServings>[1], RegExp][])('refuses "%s"', (text, record, reason) => {
    const r = packServings(text, record);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).toMatch(reason);
  });
});

describe('statedSupplyDays — a supply length in days', () => {
  /** Every distinct storePrice.supply on file → days, or the refusal. */
  const SUPPLIES: Record<string, number | string> = {
    '1-MONTH SUPPLY': 30,
    '1 month supply': 30,
    '1 MONAT: 2 Packs, 60 Kapseln': 30,
    '45-day supply': 45,
    'up to a 5 month supply': 150,
    'delivered every 4 weeks': 28,
    '30日分': 30,
    '約60日分': 60,
    // "one" is a word, not a stated number: no length is read.
    'This will last you one month.': 'no supply length stated',
  };

  test('every stored supply wording is in the table, and reads as listed', () => {
    const stored = PRICED.flatMap((r) => (r.sp.supply ? [r.sp.supply] : []));
    expect(stored.length).toBeGreaterThanOrEqual(20);
    expectEveryWordingClassified(SUPPLIES, stored);
    for (const s of Object.keys(SUPPLIES)) expect(outcome(statedSupplyDays(s)), s).toBe(SUPPLIES[s]);
  });

  test('several different lengths refuse', () => {
    expect(statedSupplyDays('1 Month 2 Month')).toMatchObject({ ok: false, reason: expect.stringMatching(/several supply lengths/) });
  });
});

describe('dailyServings — a daily dose only from plain directions', () => {
  const ABSENT = '(no directions)';
  /**
   * Every distinct storePrice.directions on file (and none) → label servings a
   * day, or the refusal. Time of day ("in the morning", "with your first meal
   * of the day") is not a frequency.
   */
  const DIRECTIONS: Record<string, number | string> = {
    [ABSENT]: 'no directions stated',
    // One dose, a daily frequency.
    'There are 180 capsules per package, and you should take 6 a day.': 1, // 6 per serving
    'you should take 6 a day': 1,
    'Take 4 capsules daily with food for optimal cognitive support.': 1, // 4 per serving
    'Take 1 sachet once daily.': 1,
    'Take 3 capsules on the daily as part of your routine.': 1, // 3 per serving
    '【１日の目安】4粒': 1, // full-width "１" (NFKC), 4 per serving
    'You can get started with Qualia Mind simply by taking your daily serving early in the morning with a large glass of water, with or without food.': 1,
    // No daily frequency stated (time of day, or no frequency at all; German is not read).
    'Take 2 capsules in the morning before eating.': 'no daily frequency stated',
    'For best results take 2 capsules in the morning before eating.': 'no daily frequency stated',
    'Take 3 Omega-3 softgels with your first meal of the day.': 'no daily frequency stated',
    'Simply take 2 easy-to-swallow capsules of Noocube with water.': 'no daily frequency stated',
    'Simply take 2 easy-to-swallow capsules of Noocube with water. It can be taken with or without food.': 'no daily frequency stated',
    'Take 1 capsule for stimulation.': 'no daily frequency stated',
    'Nehmen Sie 2 Kapseln, 60 Minuten nach dem Essen.': 'no daily frequency stated',
    // A daily frequency without a "take N" dose the parser reads.
    'One can per day is our recommended serving.': 'no dose stated',
    // A range is not one dose.
    'Take 2 to 4 capsules per day in the morning or early afternoon on an empty stomach.': 'states a dose range, not one dose',
    'take 1-2 daily with or without food': 'states a dose range, not one dose',
    'Take 1–2 capsules on an empty stomach.': 'states a dose range, not one dose',
    'For best results take 1-2 capsule(s) on an empty stomach.': 'states a dose range, not one dose',
    // Patterns that are not one daily dose.
    'You should take it for 5 days followed by 2 days off each week to maximize benefits and prevent habituation.': 'taken in cycles with days off, not every day',
    'Gradually increase your dose to a full serving (2 capsules) if well-tolerated.': 'the dose is adjusted, not fixed',
    "Don't take more than one serving (2 capsules) within a 24-hour period.": 'states a maximum, not a dose',
    'Mix 1 scoop in 10oz of water and take 30 minutes before exercise.': 'timed to exercise, not to the day',
    'Mix 1 scoop in 300ml of water and take 30 minutes before exercise.': 'timed to exercise, not to the day',
    'Take 1 scoop 30 minutes before exercise.': 'timed to exercise, not to the day',
  };

  test('every stored directions string is in the table, and reads as listed for each record (fail closed)', () => {
    const stored = PRICED.map((r) => r.sp.directions ?? ABSENT);
    expect(new Set(stored).size).toBeGreaterThanOrEqual(20);
    expectEveryWordingClassified(DIRECTIONS, stored);
    for (const { where, p, sp } of PRICED) {
      expect(outcome(dailyServings(sp.directions, p)), `${where} ${JSON.stringify(sp.directions)}`).toBe(DIRECTIONS[sp.directions ?? ABSENT]);
    }
  });

  test.each([
    ['Take 2 capsules daily.', CAPSULES, 1],
    ['Take 4 capsules daily.', CAPSULES, 2],
    ['Take 2 servings every day.', CAPSULES, 2],
    ['1日2粒を目安にお召し上がりください。', CAPSULES, 1],
    ['1日2粒', { ...CAPSULES, capsulesPerServing: 1 }, 2],
    ['【１日の目安】４粒', { ...CAPSULES, capsulesPerServing: 4 }, 1],
  ] as [string, Parameters<typeof dailyServings>[1], number][])('"%s" → %s a day', (directions, record, perDay) => {
    expect(dailyServings(directions, record)).toMatchObject({ ok: true, perDay });
  });

  test.each([
    ['Take 1 capsule twice daily.', CAPSULES, /repeats the dose/],
    ['Take 2 capsules 2 times a day.', CAPSULES, /repeats the dose/],
    ['1日2回、1回2粒', CAPSULES, /repeats the dose/],
    ['Take 2 capsules, 1-2 times daily.', CAPSULES, /range/],
    ['Take 2 capsules daily; do not exceed 4 capsules.', CAPSULES, /maximum/],
    ['Take 2 capsules daily as needed.', CAPSULES, /adjusted/],
    ['Take 2 capsules daily, cycling 5 days on.', CAPSULES, /cycles/],
    ['Take 3 capsules daily.', CAPSULES, /"Take 3 capsules" is 1\.5 label servings at 2 per serving/],
    ['Take 1 capsule daily.', CAPSULES, /0\.5 label servings/],
    ['1 scoop daily', { ...CAPSULES, form: 'powder' }, /no dose stated/],
    ['Take 1 scoop daily.', { ...CAPSULES, capsulesPerServing: 1, form: 'powder' }, /names no capsule, tablet, sachet or serving/],
    ['Take one capsule daily.', CAPSULES, /no dose stated/],
    ['Take 2 capsules daily. Take 2 more capsules daily with food.', CAPSULES, /several doses/],
    ['Take 2 tablets daily.', CAPSULES, /directions count tablets but the record's form is capsule/],
    ['Take 2 capsules daily.', { servingsPerContainer: 30, capsulesPerServing: 0 }, /needs capsulesPerServing/],
    ['Take 2 capsules in the morning.', CAPSULES, /no daily frequency stated/],
    ['Take 2 capsules 30 minutes before your workout, daily.', CAPSULES, /timed to exercise/],
    ['   ', CAPSULES, /no directions stated/],
  ] as [string, Parameters<typeof dailyServings>[1], RegExp][])('refuses "%s"', (directions, record, reason) => {
    const r = dailyServings(directions, record);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).toMatch(reason);
  });
});

describe('quoteSupply — servings a day from the directions', () => {
  test('at two servings a day a pack lasts half as long, and the basis says so', () => {
    expect(quoteSupply('60 capsules', CAPSULES, 2)).toEqual({ ok: true, monthsOfSupply: 0.5, basis: '"60 capsules" at 2 per serving, 2 servings a day' });
    expect(quoteSupply('1 Unit', CAPSULES, 2)).toEqual({ ok: true, monthsOfSupply: 0.5, basis: '"1 Unit" × 30 servings, 2 a day' });
    expect(quoteSupply('1 Month | 60 capsules', CAPSULES, 2)).toEqual({
      ok: false,
      reason: '"60 capsules" at 2 per serving is 0.5 months of 2 servings a day, but the quote states "1 Month"',
    });
  });

  test('one serving a day is the default and keeps the shipped wording', () => {
    expect(quoteSupply('60 capsules', CAPSULES)).toEqual(quoteSupply('60 capsules', CAPSULES, 1));
    expect(quoteSupply('60 capsules', CAPSULES)).toEqual({ ok: true, monthsOfSupply: 1, basis: '"60 capsules" at 2 per serving, one serving a day' });
  });
});
