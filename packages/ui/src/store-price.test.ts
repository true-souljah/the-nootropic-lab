import { describe, test, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  formatMoney, storeSupply, monthlyStorePrice, sharedCurrency, storePriceProblems, getStrings, currencyDigits,
  localPrice, REGION_PROFILES,
  perServingStorePrice, perDayStorePrice, roundMoney, buildRegionSearchContext, DAYS_PER_MONTH,
} from '@nootropic/data';
import type { Product, StorePrice, StoreUnitPrice, Locale, RegionalRegionCode } from '@nootropic/data';
import { priceText, localPriceShort, priceLocaleOf } from './price-text';

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
  test('minor units follow the currency (JPY 0, USD 2, BHD 3), not a two-decimal default', () => {
    expect([currencyDigits('JPY'), currencyDigits('USD'), currencyDigits('BHD')]).toEqual([0, 2, 3]);
    expect(formatMoney({ amount: 12.345, currency: 'BHD' }, 'en-US')).toMatch(/12\.345$/);
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
  test('prices are written in the host locale, else the language date locale', () => {
    expect(priceLocaleOf({ ...en, priceLocale: 'en-CA' })).toBe('en-CA');
    expect(priceLocaleOf({ ...getStrings('de'), priceLocale: undefined })).toBe(getStrings('de').productDetail.dateLocale);
  });
  test('the "Buying in" block and the review header show the same store price', () => {
    const unit = en.productDetail.stats.monthUnit;
    let compared = 0;
    for (const [region, products] of Object.entries(REGIONS) as [keyof typeof REGION_PROFILES, Product[]][]) {
      const header = { ...en, priceLocale: REGION_PROFILES[region].priceLocale };
      for (const p of products.filter((x) => x.storePrice)) {
        expect(localPriceShort(localPrice(p, region)!, unit), `${region}/${p.slug}`).toBe(priceText(p, header)!.short);
        compared++;
      }
    }
    expect(compared).toBeGreaterThanOrEqual(40);
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
    [{ lang: 'German' }, /non-English BCP-47/],
    [{ lang: 'en' }, /non-English BCP-47/],
    [{ lang: 'en-US' }, /non-English BCP-47/],
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

// ── Per serving and per day (2026-10-12) ─────────────────────────────────
// Derived only from the vendor's words: per serving = pack price ÷ the
// servings the pack count states; per day = price ÷ a stated supply length,
// or × the directions' plain daily dose ÷ servings. The baseline below is the
// whole catalogue, so any data or rule change that moves a figure (or turns a
// refusal into a figure) fails here first.

const PRICED = Object.entries(REGIONS).flatMap(([region, products]) =>
  products.filter((p) => p.storePrice).map((p) => ({ key: `${region}/${p.id}`, region, p })),
);
const show = (r: StoreUnitPrice): string => (r.ok ? `${r.currency} ${r.amount}` : `refused: ${r.reason}`);
const money = (r: StoreUnitPrice) => (r.ok ? { amount: r.amount, currency: r.currency } : null);
/** The strings each app builds (apps/<region>/src/lib/search.ts). */
const EDITIONS: Record<string, [Product[], Locale, RegionalRegionCode]> = {
  us: [allProductsUS, 'en', 'us'], eu: [allProductsEU, 'en', 'eu'], ca: [allProductsCA, 'en', 'ca'], au: [allProductsAU, 'en', 'au'],
  // JP builds the en bundle since 2026-10-13 (Japanese copy paused); its prices keep ja-JP yen formatting.
  jp: [allProductsJP, 'en', 'jp'], latam: [allProductsLatam, 'es', 'latam'], gcc: [allProductsGCC, 'en', 'gcc'], sea: [allProductsSEA, 'en', 'sea'],
};
const editionStrings = (region: string) => {
  const [products, locale, code] = EDITIONS[region];
  return buildRegionSearchContext(products, locale, code).uiStrings;
};

describe('perServingStorePrice / perDayStorePrice — exact baseline of every priced record', () => {
  const RANGE = 'refused: supply: no supply length stated; directions: states a dose range, not one dose';
  const NO_FREQUENCY = 'refused: supply: no supply length stated; directions: no daily frequency stated';
  const EXERCISE = 'refused: the vendor says to take it before exercise, so a serving is not a day';
  const QUALIA_CADENCE = 'refused: "120 count" at 6 per serving is 0.6667 months of one serving a day, but the quote states "every 4 weeks"';
  /** region/id → [per serving, per day]. */
  const BASELINE: Record<string, [string, string]> = {
    'us/mind-lab-pro': ['USD 2.3', RANGE],
    'us/noocube': ['USD 2.17', 'USD 2.17'],
    'us/qualia-mind': ['USD 7.95', QUALIA_CADENCE],
    'us/alpha-brain': ['USD 1.78', 'USD 1.78'],
    'us/nootropics-depot-lions-mane': ['USD 0.33', RANGE],
    'us/naturebell-ginkgo-ginseng': ['USD 0.1', 'USD 0.1'],
    'us/hunter-focus': ['USD 3', 'USD 3'],
    'us/brainmd-brain-memory-power-boost': ['USD 2.17', 'USD 2.17'],
    'us/performance-lab-caffeine-2': ['USD 1.47', RANGE],
    'us/pre-lab-pro': ['USD 2.95', EXERCISE],
    'us/performance-lab-energy': ['USD 2.3', NO_FREQUENCY],
    'us/performance-lab-omega-3': ['USD 1.63', NO_FREQUENCY],
    'eu/mind-lab-pro': ['EUR 2.17', RANGE],
    'eu/noocube': ['USD 2.17', 'USD 2.17'],
    'eu/brainzyme-focus-pro': ['EUR 1.06', 'EUR 1.06'],
    'eu/performance-lab-caffeine-2': ['EUR 1.5', NO_FREQUENCY],
    'eu/pre-lab-pro': ['EUR 2.25', EXERCISE],
    'eu/performance-lab-energy': ['EUR 1.97', NO_FREQUENCY],
    'eu/performance-lab-omega-3': ['EUR 1.5', NO_FREQUENCY],
    'ca/mind-lab-pro': ['CAD 2.97', RANGE],
    'ca/noocube': ['CAD 3', 'CAD 3'],
    'ca/alpha-brain': ['USD 1.78', 'USD 1.78'],
    'ca/qualia-mind': ['USD 7.95', QUALIA_CADENCE],
    'ca/performance-lab-caffeine-2': ['CAD 1.97', NO_FREQUENCY],
    'ca/pre-lab-pro': ['CAD 3.95', EXERCISE],
    'ca/performance-lab-energy': ['CAD 2.97', NO_FREQUENCY],
    'ca/performance-lab-omega-3': ['CAD 2.3', NO_FREQUENCY],
    'au/mind-lab-pro': ['AUD 2.97', NO_FREQUENCY],
    'au/noocube': ['AUD 2.83', 'AUD 2.83'],
    'au/alpha-brain': ['USD 1.78', 'USD 1.78'],
    'au/qualia-mind': ['USD 7.95', QUALIA_CADENCE],
    'au/performance-lab-caffeine-2': ['AUD 1.97', RANGE],
    'au/pre-lab-pro': ['AUD 3.95', EXERCISE],
    'au/performance-lab-energy': ['AUD 2.97', NO_FREQUENCY],
    'au/performance-lab-omega-3': ['AUD 2.3', NO_FREQUENCY],
    'jp/mind-lab-pro': ['USD 2.3', NO_FREQUENCY],
    'jp/noocube': ['USD 2.17', 'USD 2.17'],
    'jp/hunter-focus': ['USD 3', 'USD 3'],
    'jp/fancl-brains': ['refused: no pack count stated in the quote (a supply length is not a count)', 'JPY 183'],
    'jp/suntory-dha-epa-sesamin': ['JPY 191', 'JPY 191'],
    'latam/mind-lab-pro': ['USD 2.3', RANGE],
    'latam/noocube': ['USD 2.17', 'USD 2.17'],
    'latam/qualia-mind': ['USD 7.95', QUALIA_CADENCE],
    'latam/alpha-brain': ['USD 1.78', 'USD 1.78'],
    'latam/nootropics-depot-lions-mane': ['USD 0.33', RANGE],
    'gcc/mind-lab-pro': ['USD 2.3', NO_FREQUENCY],
    'gcc/noocube': ['USD 2.17', 'USD 2.17'],
    'gcc/qualia-mind': ['USD 7.95', QUALIA_CADENCE],
    'gcc/alpha-brain': ['USD 1.78', 'USD 1.78'],
    'gcc/nootropics-depot-lions-mane': ['USD 0.33', RANGE],
    'gcc/eu-yan-sang-brainmax': ['SGD 3', 'SGD 3'],
    'sea/mind-lab-pro': ['USD 2.3', NO_FREQUENCY],
    'sea/noocube': ['USD 2.17', 'USD 2.17'],
    'sea/qualia-mind': ['USD 7.95', QUALIA_CADENCE],
    'sea/alpha-brain': ['USD 1.78', 'USD 1.78'],
    'sea/nootropics-depot-lions-mane': ['USD 0.33', RANGE],
    'sea/eu-yan-sang-brainmax': ['SGD 3', 'SGD 3'],
    'sea/supershrooms-focus-nootropic': ['refused: "1 Pouch" needs servingsPerContainer, which the record lacks', 'PHP 56'],
  };

  test('matches the committed baseline exactly (no record missing, none extra)', () => {
    expect(PRICED.length).toBeGreaterThanOrEqual(40);
    const actual = Object.fromEntries(PRICED.map(({ key, p }) => [key, [show(perServingStorePrice(p)), show(perDayStorePrice(p))]]));
    expect(actual).toEqual(BASELINE);
  });

  test('a per-day figure shows only beside a per-month one, and they agree within one minor unit a day', () => {
    let shown = 0;
    for (const { key, p } of PRICED) {
      const day = perDayStorePrice(p);
      if (!day.ok) continue;
      shown++;
      const month = monthlyStorePrice(p);
      expect(month, `${key}: per day without per month`).not.toBeNull();
      expect(month!.currency, key).toBe(day.currency);
      // Both are rounded to the minor unit, so compare them per day: |month/30 − day| ≤ one minor unit.
      expect(Math.abs(month!.amount / DAYS_PER_MONTH - day.amount), key).toBeLessThanOrEqual(10 ** -currencyDigits(day.currency) + 1e-9);
    }
    expect(shown).toBeGreaterThanOrEqual(20);
  });

  test('records quoting the same store page show the same figures', () => {
    const byUrl = new Map<string, { key: string; figures: unknown[] }[]>();
    for (const { key, p } of PRICED) {
      const list = byUrl.get(p.storePrice!.url) ?? [];
      const m = monthlyStorePrice(p);
      list.push({ key, figures: [money(perServingStorePrice(p)), money(perDayStorePrice(p)), m && { amount: m.amount, currency: m.currency }] });
      byUrl.set(p.storePrice!.url, list);
    }
    const shared = [...byUrl.values()].filter((list) => list.length > 1);
    expect(shared.length).toBeGreaterThanOrEqual(5);
    for (const list of shared) {
      for (const other of list.slice(1)) expect(other.figures, `${other.key} vs ${list[0].key}`).toEqual(list[0].figures);
    }
  });

  test("Nootropics Depot's own per-serving price ($0.33 / Serving) equals the derived figure", () => {
    const nd = allProductsUS.find((p) => p.id === 'nootropics-depot-lions-mane')!;
    const quoted = nd.vendorTerms?.oneTimePrice?.text.match(/\$(\d+\.\d{2}) \/ Serving/);
    expect(quoted, 'the vendor quote must still state a per-serving price').not.toBeNull();
    expect(perServingStorePrice(nd)).toMatchObject({ ok: true, amount: Number(quoted![1]), currency: 'USD' });
  });

  test('rounds half-up to the currency minor unit (JPY whole yen, USD cents, BHD fils)', () => {
    expect(roundMoney(64.95 / 30, 'USD')).toBe(2.17);
    // Plain Math.round loses a half cent to float noise (1.005 × 100 = 100.49999999999999).
    expect(Math.round(1.005 * 100) / 100).toBe(1);
    expect(roundMoney(1.005, 'USD')).toBe(1.01);
    expect(roundMoney(11457 / 60, 'JPY')).toBe(191);
    expect(roundMoney(5479 / 30, 'JPY')).toBe(183);
    expect(roundMoney(1.2345, 'BHD')).toBe(1.235);
  });

  test('a figure that rounds to zero is refused, not shown as free', () => {
    const tiny = withPrice({ amount: 0.01, text: '$0.01', pack: '90 Count' });
    expect(perServingStorePrice(tiny)).toMatchObject({ ok: false, reason: /rounds to zero/ });
  });

  test('a stated supply and the directions must agree within one minor unit, else no per-day figure', () => {
    const label = { capsulesPerServing: 2, servingsPerContainer: 30, form: 'capsule' as const };
    // "1 Unit" × 30 servings, "1 Month" = 30 days, one serving a day: both sources say $2.00 a day.
    const agree = { amount: 60, text: '$60', pack: '1 Unit', supply: '1 Month', directions: 'Take 2 capsules daily.' };
    expect(perDayStorePrice(withPrice(agree, label))).toEqual({
      ok: true, amount: 2, currency: 'USD', basis: '"1 Month" = 30 days; "Take 2 capsules" a day at 2 per serving = 1 of 30 servings',
    });
    // Perturb one source at a time: the other no longer backs the figure.
    expect(perDayStorePrice(withPrice({ ...agree, supply: '45-day supply' }, label))).toMatchObject({
      ok: false, reason: 'supply and directions disagree ("45-day supply" = 45 days vs "Take 2 capsules" a day at 2 per serving = 1 of 30 servings)',
    });
    expect(perDayStorePrice(withPrice({ ...agree, directions: 'Take 4 capsules daily.' }, label))).toMatchObject({
      ok: false, reason: /^supply and directions disagree/,
    });
    // Within one minor unit they agree ($1/30 = 0.0333 vs $1/31 = 0.0323 a day); the figure is the stated supply's.
    expect(perDayStorePrice(withPrice({ ...agree, amount: 1, text: '$1', supply: '30-day supply' }, { ...label, servingsPerContainer: 31 }))).toMatchObject({ ok: true, amount: 0.03 });
    // Either source alone suffices.
    expect(perDayStorePrice(withPrice({ ...agree, supply: undefined }, label))).toMatchObject({ ok: true, amount: 2 });
    expect(perDayStorePrice(withPrice({ ...agree, directions: undefined }, label))).toMatchObject({ ok: true, amount: 2 });
  });
});

describe('monthly figures are unchanged by the per-serving / per-day work', () => {
  /** monthlyStorePrice for every priced record, captured on origin/main 80b53e71 before the change. */
  const MONTHLY_BEFORE: Record<string, string | null> = {
    'us/mind-lab-pro': 'USD 69',
    'us/noocube': 'USD 64.99',
    'us/qualia-mind': null,
    'us/alpha-brain': 'USD 53.3',
    'us/nootropics-depot-lions-mane': 'USD 9.99',
    'us/naturebell-ginkgo-ginseng': 'USD 3',
    'us/hunter-focus': 'USD 90',
    'us/brainmd-brain-memory-power-boost': 'USD 64.95',
    'us/performance-lab-caffeine-2': 'USD 44',
    'us/pre-lab-pro': null,
    'us/performance-lab-energy': 'USD 69',
    'us/performance-lab-omega-3': 'USD 49',
    'eu/mind-lab-pro': 'EUR 64.95',
    'eu/noocube': 'USD 64.99',
    'eu/brainzyme-focus-pro': 'EUR 31.75',
    'eu/performance-lab-caffeine-2': 'EUR 45',
    'eu/pre-lab-pro': null,
    'eu/performance-lab-energy': 'EUR 59',
    'eu/performance-lab-omega-3': 'EUR 45',
    'ca/mind-lab-pro': 'CAD 89',
    'ca/noocube': 'CAD 89.99',
    'ca/alpha-brain': 'USD 53.3',
    'ca/qualia-mind': null,
    'ca/performance-lab-caffeine-2': 'CAD 59',
    'ca/pre-lab-pro': null,
    'ca/performance-lab-energy': 'CAD 89',
    'ca/performance-lab-omega-3': 'CAD 69',
    'au/mind-lab-pro': 'AUD 89',
    'au/noocube': 'AUD 84.99',
    'au/alpha-brain': 'USD 53.3',
    'au/qualia-mind': null,
    'au/performance-lab-caffeine-2': 'AUD 59',
    'au/pre-lab-pro': null,
    'au/performance-lab-energy': 'AUD 89',
    'au/performance-lab-omega-3': 'AUD 69',
    'jp/mind-lab-pro': 'USD 69',
    'jp/noocube': 'USD 64.99',
    'jp/hunter-focus': 'USD 90',
    'jp/fancl-brains': 'JPY 5479',
    'jp/suntory-dha-epa-sesamin': 'JPY 5729',
    'latam/mind-lab-pro': 'USD 69',
    'latam/noocube': 'USD 64.99',
    'latam/qualia-mind': null,
    'latam/alpha-brain': 'USD 53.3',
    'latam/nootropics-depot-lions-mane': 'USD 9.99',
    'gcc/mind-lab-pro': 'USD 69',
    'gcc/noocube': 'USD 64.99',
    'gcc/qualia-mind': null,
    'gcc/alpha-brain': 'USD 53.3',
    'gcc/nootropics-depot-lions-mane': 'USD 9.99',
    'gcc/eu-yan-sang-brainmax': 'SGD 89.9',
    'sea/mind-lab-pro': 'USD 69',
    'sea/noocube': 'USD 64.99',
    'sea/qualia-mind': null,
    'sea/alpha-brain': 'USD 53.3',
    'sea/nootropics-depot-lions-mane': 'USD 9.99',
    'sea/eu-yan-sang-brainmax': 'SGD 89.9',
    'sea/supershrooms-focus-nootropic': 'PHP 1680',
  };

  test('every priced record keeps its pre-change per-month figure', () => {
    const actual = Object.fromEntries(PRICED.map(({ key, p }) => {
      const m = monthlyStorePrice(p);
      return [key, m && `${m.currency} ${m.amount}`];
    }));
    expect(actual).toEqual(MONTHLY_BEFORE);
  });
});

describe('priceText — per-unit and source lines as each edition renders them', () => {
  // The e2e Pricing-tab specs (e2e/{us,eu,jp}-pricing-tab-vendor-terms.spec.ts) assert these strings.
  test.each([
    ['us', 'hunter-focus', '≈ $3/serving', '≈ $3/day'],
    ['us', 'brainmd-brain-memory-power-boost', '≈ $2.17/serving', '≈ $2.17/day'],
    ['us', 'noocube', '≈ $2.17/serving', '≈ $2.17/day'],
    ['us', 'mind-lab-pro', '≈ $2.30/serving', null],
    ['us', 'pre-lab-pro', '≈ $2.95/serving', null],
    ['eu', 'brainzyme-focus-pro', '≈ €1.06/serving', '≈ €1.06/day'],
    ['eu', 'pre-lab-pro', '≈ €2.25/serving', null],
    ['ca', 'noocube', '≈ $3/serving', '≈ $3/day'],
    ['jp', 'hunter-focus', '≈ $3/serving', '≈ $3/day'],
    ['jp', 'suntory-dha-epa-sesamin', '≈ ￥191/serving', '≈ ￥191/day'],
    ['jp', 'fancl-brains', null, '≈ ￥183/day'],
  ] as [string, string, string | null, string | null][])('%s %s → %s · %s', (region, id, perServing, perDay) => {
    const p = EDITIONS[region][0].find((x) => x.id === id)!;
    const t = priceText(p, editionStrings(region))!;
    expect([t.perServing, t.perDay]).toEqual([perServing, perDay]);
    expect([t.perServingMoney, t.perDayMoney]).toEqual([money(perServingStorePrice(p)), money(perDayStorePrice(p))]);
  });

  test('every derived figure carries "≈" and its unit after one "/"; the short form is unchanged', () => {
    for (const { key, region, p } of PRICED) {
      const strings = editionStrings(region);
      const t = priceText(p, strings)!;
      const { perServingUnit, perDayUnit } = strings.productDetail.stats;
      if (t.perServing !== null) expect(t.perServing, key).toMatch(new RegExp(`^≈ [^/]+/${perServingUnit}$`, 'u'));
      if (t.perDay !== null) expect(t.perDay, key).toMatch(new RegExp(`^≈ [^/]+/${perDayUnit}$`, 'u'));
      expect(t.short, key).toBe(t.monthly ?? `${t.pack} · ${t.packText}`);
    }
  });
});
