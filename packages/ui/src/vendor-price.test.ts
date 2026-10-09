import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  parseAmount, parseQuotedPrices, quoteSupply, monthlyPriceFromQuote,
  deriveRegionalMonthlyPrice, priceBasisProblems, REGION_PROFILES,
} from '@nootropic/data';
import type { Product, RegionalRegionCode } from '@nootropic/data';

// Prices derived from the vendor's one-time price quote (site-owner decision
// 2026-10-08): packages/data/src/vendor-price.ts is the one derivation that
// scripts/derive-prices-from-vendor-quotes.ts writes with and validate-data
// checks every priceBasis against. These tests pin the parser, the refusals
// (never guess a price, a pack size or a currency) and the prose that quotes a
// derived price.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const REGIONS: Record<RegionalRegionCode, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
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
  ])('refuses "%s"', (text, record, reason) => {
    const result = quoteSupply(text, record);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.reason).toMatch(reason);
  });
});

describe('monthlyPriceFromQuote', () => {
  test('one price ÷ months of supply, rounded to the currency minor unit', () => {
    expect(monthlyPriceFromQuote('Capsules–90 Count | $79.95', { servingsPerContainer: 45, capsulesPerServing: 2 }))
      .toMatchObject({ ok: true, monthly: 53.3, monthsOfSupply: 1.5, price: { currency: '$', amount: 79.95 } });
    expect(monthlyPriceFromQuote('1 MONAT: 2 Packs, 60 Kapseln | 31,75 €', CAPSULES))
      .toMatchObject({ ok: true, monthly: 31.75, price: { currency: 'EUR' } });
    expect(monthlyPriceFromQuote('60日分 10,000円', CAPSULES)).toMatchObject({ ok: true, monthly: 5000, price: { currency: 'JPY' } });
    expect(monthlyPriceFromQuote('90 Count ¥10,000', { servingsPerContainer: 45, capsulesPerServing: 2 })).toMatchObject({ ok: true, monthly: 6667 });
  });

  test.each([
    ['$159.00 $39.00 first shipment, $139.00 thereafter Subscribe & Save 75% Purchase this time only', /several prices/],
    ['RETAIL: $99.99 $99.99 $84.99 $72.24', /several prices/],
    ['$19.99 $0.33 / Serving Size (60 servings) 60CT. 180CT.', /several prices/],
    ['Price reduced from S$89.90 to S$69.90', /several prices/],
    ['5,940円(税込)～ 30日分', /"from"/],
    ['1 Month supply from $29.99', /"from"/],
    ['Now: 29.99 (60 capsules)', /no currency-marked price/],
    ['One-time purchase Price: $69.00', /no pack size or supply/],
  ])('refuses "%s"', (text, reason) => {
    const result = monthlyPriceFromQuote(text, CAPSULES);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.reason).toMatch(reason);
  });

  test('the same price repeated is one price', () => {
    expect(monthlyPriceFromQuote('1 Month $90.00 — $90.00 today, 180 capsules', { servingsPerContainer: 30, capsulesPerServing: 6 }))
      .toMatchObject({ ok: true, monthly: 90 });
  });
});

describe('deriveRegionalMonthlyPrice — region field and currency', () => {
  const record = (text: string, url: string, extra: Partial<Product> = {}) =>
    ({
      ...allProductsUS[0],
      servingsPerContainer: 30,
      capsulesPerServing: 6,
      form: undefined,
      vendorTerms: { checkedAt: '2026-10-07', oneTimePrice: { text, url, lang: 'en' } },
      ...extra,
    }) as Product;
  const HUNTER = '1 Month – Starter Bottle 180 capsules Improved formula $90.00';

  test('no quote → null', () => {
    expect(deriveRegionalMonthlyPrice({ ...allProductsUS[0], vendorTerms: undefined }, 'us')).toBeNull();
  });

  test('a bare "$" is USD on a US record from a US storefront', () => {
    expect(deriveRegionalMonthlyPrice(record(HUNTER, 'https://www.hunterevolve.com/en-us/hunter-focus'), 'us'))
      .toMatchObject({ status: 'derived', field: 'priceMonthlyUSD', currency: 'USD', monthly: 90, checkedAt: '2026-10-07' });
  });

  test('a bare "$" on a non-US dollar storefront is not assumed to be USD', () => {
    expect(deriveRegionalMonthlyPrice(record(HUNTER, 'https://aor.ca/product/ortho-mind/'), 'us')).toMatchObject({ status: 'unresolved' });
  });

  test('a bare "$" in a CAD/AUD region does not say which dollar', () => {
    for (const region of ['ca', 'au'] as const) {
      const d = deriveRegionalMonthlyPrice(record(HUNTER, 'https://www.roarambition.com/en-ca/products/hunter-focus'), region);
      expect(d).toMatchObject({ status: 'unresolved', field: REGION_PROFILES[region].priceField });
      expect(d?.status === 'unresolved' && d.reason).toMatch(/does not say which dollar/);
    }
  });

  test('a price in another currency is never converted into the region field', () => {
    expect(deriveRegionalMonthlyPrice(record(HUNTER, 'https://www.hunterevolve.com/en-us/hunter-focus'), 'jp'))
      .toMatchObject({ status: 'not-region-currency', field: 'priceMonthlyJPY', currency: '$', monthly: 90 });
    expect(deriveRegionalMonthlyPrice(record('1 Pouch (1 month supply) ₱1,680', 'https://supershrooms.ph/products/focus-nootropic'), 'sea'))
      .toMatchObject({ status: 'not-region-currency', field: 'priceMonthlyEUR', currency: 'PHP' });
  });

  test('a stated currency matching the region field is derived (CA$ → priceMonthlyCAD)', () => {
    expect(deriveRegionalMonthlyPrice(record('1 Month – 180 capsules CA$123.00', 'https://ca.example.com/p'), 'ca'))
      .toMatchObject({ status: 'derived', field: 'priceMonthlyCAD', currency: 'CAD', monthly: 123 });
  });
});

describe('priceBasisProblems', () => {
  const brainzyme = allProductsEU.find((p) => p.slug === 'brainzyme-focus-pro-review')!;

  test('the EU Brainzyme record stores the price its quote derives', () => {
    expect(brainzyme.priceMonthlyEUR).toBe(31.75);
    expect(brainzyme.priceBasis).toEqual({ source: 'vendor-one-time', quoteField: 'vendorTerms.oneTimePrice', monthsOfSupply: 1, checkedAt: '2026-10-07' });
    expect(priceBasisProblems(brainzyme, 'eu')).toEqual([]);
  });

  test('fails on a stored price that drifted from the quote (the pre-2026-10-09 €40)', () => {
    expect(priceBasisProblems({ ...brainzyme, priceMonthlyEUR: 40 }, 'eu').join('\n')).toMatch(/priceMonthlyEUR is 40 but the quote .* derives 31\.75/);
  });

  test('fails when a deriving quote has no priceBasis', () => {
    expect(priceBasisProblems({ ...brainzyme, priceBasis: undefined }, 'eu').join('\n')).toMatch(/has no priceBasis/);
  });

  test('fails on a wrong months/date/source or an unknown key', () => {
    const basis = brainzyme.priceBasis!;
    expect(priceBasisProblems({ ...brainzyme, priceBasis: { ...basis, monthsOfSupply: 2 } }, 'eu').join('\n')).toMatch(/monthsOfSupply is 2/);
    expect(priceBasisProblems({ ...brainzyme, priceBasis: { ...basis, checkedAt: '2026-10-01' } }, 'eu').join('\n')).toMatch(/checkedAt/);
    expect(priceBasisProblems({ ...brainzyme, priceBasis: { ...basis, source: 'editor' as 'vendor-one-time' } }, 'eu').join('\n')).toMatch(/source/);
    expect(priceBasisProblems({ ...brainzyme, priceBasis: { ...basis, note: 'x' } as typeof basis }, 'eu').join('\n')).toMatch(/unknown key "note"/);
  });

  test('fails when the quote no longer derives a price, or is gone', () => {
    const terms = brainzyme.vendorTerms!;
    const noPack = { ...brainzyme, vendorTerms: { ...terms, oneTimePrice: { ...terms.oneTimePrice!, text: '31,75 €', fragments: undefined } } };
    expect(priceBasisProblems(noPack, 'eu').join('\n')).toMatch(/derives no priceMonthlyEUR: no pack size/);
    expect(priceBasisProblems({ ...brainzyme, vendorTerms: undefined }, 'eu').join('\n')).toMatch(/no vendorTerms\.oneTimePrice quote/);
  });

  test('every record in every region passes, and at least one carries priceBasis', () => {
    let bases = 0;
    for (const [region, products] of Object.entries(REGIONS) as [RegionalRegionCode, Product[]][]) {
      for (const p of products) {
        if (p.priceBasis) bases++;
        expect(priceBasisProblems(p, region), `${region}/${p.slug}`).toEqual([]);
      }
    }
    expect(bases).toBeGreaterThan(0);
  });
});

// Prose that quotes a vendor-derived price must say the stored figure: the
// record's own copy and the region's listicle picks for that product. A
// figure is matched only in the priceBasis field's own currency marker, and a
// sentence about another offer (a bundle, a subscription, a "below $X" bound)
// is not a statement of the one-time monthly price.
const OTHER_OFFER =
  /bundle|subscri|\babo\b|abonnement|suscripci|first (?:order|shipment|month)|thereafter|effective (?:monthly )?(?:price|cost)|(?:below|under|less than|from)\s*(?:US\$|CA\$|C\$|A\$|\$|€|¥)/i;
describe('prose states the vendor-derived price', () => {
  const APPS = join(__dirname, '..', '..', '..', 'apps');
  const MARKERS: Record<string, string> = {
    priceMonthlyUSD: String.raw`(?:US\$|\$)\s?(\d[\d.,]*)`,
    priceMonthlyEUR: String.raw`€\s?(\d[\d.,]*)|(\d[\d.,]*)\s?€`,
    priceMonthlyCAD: String.raw`(?:CA\$|C\$)\s?(\d[\d.,]*)`,
    priceMonthlyAUD: String.raw`(?:AU\$|A\$)\s?(\d[\d.,]*)`,
    priceMonthlyJPY: String.raw`[¥￥]\s?(\d[\d.,]*)|(\d[\d.,]*)\s?円`,
  };
  const PER_MONTH = String.raw`\s?(?:\/\s?(?:mo|month|mes|Monat|mois|月)\b|\/月|per month|a month)`;
  const pagesOf = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? pagesOf(join(dir, e.name)) : e.name === 'page.tsx' ? [join(dir, e.name)] : [],
    );

  function statedPrices(text: string, field: string): number[] {
    const re = new RegExp(`(?:${MARKERS[field]})${PER_MONTH}`, 'gu');
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => !OTHER_OFFER.test(sentence))
      .flatMap((sentence) => [...sentence.matchAll(re)].map((m) => parseAmount((m[1] ?? m[2]).replace(/[.,]$/, '')) ?? NaN));
  }

  const cases = (Object.entries(REGIONS) as [RegionalRegionCode, Product[]][]).flatMap(([region, products]) =>
    products.filter((p) => p.priceBasis).map((p) => [region, p] as const),
  );

  test('there are vendor-derived prices to check', () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  test('the per-month matcher reads the formats used in the copy', () => {
    expect(statedPrices('a focus stack at €40/mo. Best value', 'priceMonthlyEUR')).toEqual([40]);
    expect(statedPrices('ab 31,75 €/Monat', 'priceMonthlyEUR')).toEqual([31.75]);
    expect(statedPrices('$64.95/month list price', 'priceMonthlyUSD')).toEqual([64.95]);
    expect(statedPrices('¥5,479/月', 'priceMonthlyJPY')).toEqual([5479]);
    expect(statedPrices(`stack at €\${brainzyme.priceMonthlyEUR}/mo`, 'priceMonthlyEUR')).toEqual([]);
    expect(statedPrices('Ultimate Bundle drops effective price below $70/month. $90/month at single-bottle price.', 'priceMonthlyUSD')).toEqual([90]);
  });

  test.each(cases)('%s: record copy and listicle picks state the stored price', (region, product) => {
    const field = REGION_PROFILES[region].priceField;
    const stored = product[field];
    const record = [
      product.summary, product.whatItIs, product.howItWorks, product.whatToExpect,
      ...product.pros, ...product.cons, product.seoTitle, product.seoDescription,
    ].filter((s): s is string => typeof s === 'string');
    const stated: Array<[string, number]> = record.flatMap((text) => statedPrices(text, field).map((n) => [`${product.slug} record`, n] as [string, number]));

    const pick = new RegExp(
      String.raw`slug === '${product.slug}'\)!?,\s*rank:\s*\d+,\s*whyItsHere:\s*(['\x60"])([\s\S]*?)\1,\s*\n`,
      'g',
    );
    let picksScanned = 0;
    for (const file of pagesOf(join(APPS, region, 'src', 'app'))) {
      for (const m of readFileSync(file, 'utf8').matchAll(pick)) {
        picksScanned++;
        for (const n of statedPrices(m[2], field)) stated.push([file.slice(APPS.length + 1), n]);
      }
    }
    for (const [where, n] of stated) expect(n, `${where} states ${n}, ${region} ${field} is ${stored}`).toBe(stored);
    if (product.slug === 'brainzyme-focus-pro-review') expect(picksScanned, 'EU focus + studying picks scanned').toBe(2);
  });
});
