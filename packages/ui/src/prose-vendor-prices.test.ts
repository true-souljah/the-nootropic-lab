import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  VENDOR_TERM_FIELDS, monthlyStorePrice,
} from '@nootropic/data';
import type { Product, RegionalRegionCode } from '@nootropic/data';

// Monthly prices in prose come from the vendor (site-owner decision
// 2026-10-08: prices follow the vendor's own quotes). For every product with
// PASS-verified vendor terms, a per-month price stated about it — in its own
// record copy, in a listicle pick for it, or in a page sentence that names it —
// must be an amount the vendor's quotes state (or, with its source, one listed
// in VENDOR_PAGE_AMOUNTS) or the product's store price (site-owner policy
// 2026-10-09: the price the linked store states, in its own currency, never
// converted), or that price per month where the pack's supply is stated.
// Every live product is checked: one with no quote and no store price may not
// carry a per-month price in prose at all.
// It cannot judge meaning (a real first-order price used as the ongoing price
// still passes), but it stops invented figures: "4-week starter kit $119",
// "AUD $215/mo" converted from a US-dollar price, "~$80/month one-time" for a
// bottle the vendor calls a 45-day supply (all found 2026-10-09).
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const REGIONS: Record<RegionalRegionCode, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const APPS = join(__dirname, '..', '..', '..', 'apps');

const AMOUNT = String.raw`(\d[\d,]*(?:\.\d+)?)`;
/** Any currency-marked amount, as quoted on vendor pages. */
const QUOTED = new RegExp(String.raw`(?:US\$|CA\$|C\$|AU\$|A\$|S\$|\$|€|¥|￥|₱)\s?${AMOUNT}|${AMOUNT}\s?(?:€|円)`, 'gu');
/** A currency-marked amount stated per month: "$69/month", "AUD $215/mo", "$139 USD/mes", "31,75 €/Monat". */
const PER_MONTH = new RegExp(
  String.raw`(?:(?:US|CA|AU|NZ|HK|MX|A|C|S)?\$|AUD\s?\$?|CAD\s?~?\$?|USD\s?\$?|€|¥|￥)\s?~?${AMOUNT}(?:\s?(?:USD|AUD|CAD|EUR))?\s?(?:\/\s?(?:mo|month|mes|Monat|mois)\b|\/\s?月|per month|a month|al mes|par mois|pro Monat)` +
    String.raw`|${AMOUNT}\s?(?:€|円)\s?(?:\/\s?(?:mo|month|mes|Monat|mois)\b|\/\s?月|al mes|par mois|pro Monat)`,
  'giu',
);

/**
 * Vendor-page amounts the stored quotes do not carry (they hold the one-time
 * price only), each with its source. Keyed by region/slug.
 */
const VENDOR_PAGE_AMOUNTS: Record<string, { amounts: number[]; source: string }> = {
  'us/noocube-review': {
    amounts: [64.99],
    source: 'noocube.com "Single Purchase" column: RETAIL $79.99, $64.99, SAVINGS $15.00 (PASS, 2026-10-07, same page as the GCC/LATAM/EU quotes)',
  },
  'us/performance-lab-caffeine-2-review': {
    amounts: [39.6, 33],
    source: 'performancelab.com/products/caffeine-2: monthly subscription "$39.60", every-4-months "$33.00 /mo" (checked 2026-10-09)',
  },
  'us/pre-lab-pro-review': {
    amounts: [53.1, 44.25],
    source: 'performancelab.com/products/pre-lab-pro: "$53.10 /mo" monthly, "$44.25 /mo" every 4 months (checked 2026-10-09)',
  },
  'us/performance-lab-energy-review': {
    amounts: [62.1, 51.75],
    source: 'performancelab.com/products/energy: monthly "$62.10", "$207.00 every 4 months" = $51.75 a month (checked 2026-10-09)',
  },
  'us/performance-lab-omega-3-review': {
    amounts: [44.1, 36.75],
    source: 'performancelab.com/products/omega-3: "$44.10 /mo" monthly, "$36.75 /mo" every 4 months (checked 2026-10-09)',
  },
};

const num = (s: string): number => Number(s.replace(/,(?=\d{3}\b)/g, '').replace(',', '.'));

/** An amount with its currency: an ISO code, or "$" when the text names no particular dollar. */
type Money = { amount: number; currency: string };

/** The currency a matched price names ("AUD $215" → AUD, "$139 USD" → USD, "$69" → "$"). */
function currencyOf(matched: string): string {
  const named: [RegExp, string][] = [
    [/US\$|USD/i, 'USD'], [/CA\$|C\$|CAD/i, 'CAD'], [/AU\$|A\$|AUD/i, 'AUD'], [/NZ\$|NZD/i, 'NZD'],
    [/HK\$|HKD/i, 'HKD'], [/MX\$|MXN/i, 'MXN'], [/S\$|SGD/i, 'SGD'],
    [/€|EUR/i, 'EUR'], [/[¥￥円]/u, 'JPY'], [/₱|PHP/i, 'PHP'],
  ];
  return named.find(([re]) => re.test(matched))?.[1] ?? '$';
}

/** Currencies a store may print as a bare "$". */
const DOLLARS = new Set(['USD', 'CAD', 'AUD', 'NZD', 'SGD', 'HKD', 'MXN']);
const sameCurrency = (a: string, b: string): boolean =>
  a === b || (a === '$' && DOLLARS.has(b)) || (b === '$' && DOLLARS.has(a));

/**
 * A bare "$" in a region's copy reads as that region's own dollar: a Canadian
 * reader takes "$79/month" as Canadian dollars. Vendor quotes keep a bare "$"
 * open, since the quote's store may be in another country.
 */
const LOCAL_DOLLAR: Record<RegionalRegionCode, string> = {
  us: 'USD', ca: 'CAD', au: 'AUD', eu: 'USD', jp: 'USD', latam: 'USD', gcc: 'USD', sea: 'USD',
};

function moneyIn(text: string, re: RegExp, localDollar?: string): Money[] {
  return [...text.matchAll(re)]
    // "below $70/month" states a bound, not a price.
    .filter((m) => !/(?:below|under|less than)\s*$/i.test(text.slice(Math.max(0, (m.index ?? 0) - 12), m.index)))
    .map((m) => {
      const currency = currencyOf(m[0]);
      return { amount: num(m[1] ?? m[2]), currency: currency === '$' && localDollar ? localDollar : currency };
    })
    .filter((m) => Number.isFinite(m.amount));
}

const amountsIn = (text: string, re: RegExp): number[] => moneyIn(text, re).map((m) => m.amount);

/** A stated price is allowed when one of the allowed prices has its amount and currency. */
const isAllowed = (stated: Money, allowed: Money[]): boolean =>
  allowed.some((a) => a.amount === stated.amount && sameCurrency(a.currency, stated.currency));

/** Prices the product's vendor quotes state, plus its store price (and that price per month), each in its currency. */
function allowedMoney(p: Product, region: RegionalRegionCode): Money[] {
  const out: Money[] = [];
  for (const field of VENDOR_TERM_FIELDS) {
    const term = p.vendorTerms?.[field];
    if (!term) continue;
    for (const t of [term.text, ...(term.fragments ?? [])]) out.push(...moneyIn(t, QUOTED));
  }
  if (p.storePrice) out.push({ amount: p.storePrice.amount, currency: p.storePrice.currency });
  const monthly = monthlyStorePrice(p);
  if (monthly) out.push({ amount: monthly.amount, currency: monthly.currency });
  // The allow-listed vendor-page amounts are all from US-dollar stores.
  for (const amount of VENDOR_PAGE_AMOUNTS[`${region}/${p.slug}`]?.amounts ?? []) out.push({ amount, currency: 'USD' });
  return out;
}

const RECORD_FIELDS = ['summary', 'whatItIs', 'howItWorks', 'whatToExpect', 'seoTitle', 'seoDescription'] as const;

function pagesOf(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? pagesOf(join(dir, e.name)) : e.name.endsWith('.tsx') ? [join(dir, e.name)] : [],
  );
}

type Statement = { where: string; stated: Money; allowed: Money[]; products: string };

function collect(): Statement[] {
  const out: Statement[] = [];
  for (const [region, products] of Object.entries(REGIONS) as [RegionalRegionCode, Product[]][]) {
    const live = products.filter((p) => !p.discontinued);
    const allowed = new Map(live.map((p) => [p.slug, allowedMoney(p, region)]));

    // 1. The product's own record copy.
    for (const p of live) {
      const texts = [...RECORD_FIELDS.map((f) => p[f]), ...p.pros, ...p.cons].filter((s): s is string => typeof s === 'string');
      for (const t of texts) for (const stated of moneyIn(t, PER_MONTH, LOCAL_DOLLAR[region])) {
        out.push({ where: `${region} ${p.slug} record`, stated, allowed: allowed.get(p.slug)!, products: p.name });
      }
    }

    // 2. Listicle picks (product by slug) and 3. page sentences naming a product.
    for (const file of pagesOf(join(APPS, region, 'src', 'app'))) {
      const src = readFileSync(file, 'utf8');
      const rel = file.slice(APPS.length + 1);
      const pick = /slug === '([a-z0-9-]+)'\)!?,\s*rank:\s*\d+,\s*whyItsHere:\s*(['`"])([\s\S]*?)\2,\s*\n/g;
      const inPicks: string[] = [];
      for (const m of src.matchAll(pick)) {
        const set = allowed.get(m[1]);
        inPicks.push(m[3]);
        if (!set) continue;
        for (const stated of moneyIn(m[3], PER_MONTH, LOCAL_DOLLAR[region])) out.push({ where: `${rel} pick ${m[1]}`, stated, allowed: set, products: m[1] });
      }
      let rest = src;
      for (const t of inPicks) rest = rest.replace(t, '');
      for (const sentence of rest.split(/(?<=[.!?])\s+|\n/)) {
        const stated = moneyIn(sentence, PER_MONTH, LOCAL_DOLLAR[region]);
        if (!stated.length) continue;
        const named = live.filter((p) => sentence.includes(p.name));
        if (!named.length) continue;
        const union = named.flatMap((p) => allowed.get(p.slug)!);
        for (const m of stated) out.push({ where: `${rel}`, stated: m, allowed: union, products: named.map((p) => p.name).join(' + ') });
      }
    }
  }
  return out;
}

describe('prose monthly prices come from the vendor', () => {
  const statements = collect();

  test('the per-month matcher reads the formats used in the copy', () => {
    expect(amountsIn('Mind Lab Pro: $69/month flat.', PER_MONTH)).toEqual([69]);
    expect(amountsIn('price (AUD $215/mo subscription)', PER_MONTH)).toEqual([215]);
    expect(amountsIn('precio ($139 USD/mes en suscripción)', PER_MONTH)).toEqual([139]);
    expect(amountsIn('at €31.75/mo', PER_MONTH)).toEqual([31.75]);
    expect(amountsIn('A$89/month on its storefront', PER_MONTH)).toEqual([89]);
    expect(amountsIn('then $79 a month', PER_MONTH)).toEqual([79]);
    expect(amountsIn('¥8,850/月', PER_MONTH)).toEqual([8850]);
    expect(amountsIn('5,479円/月', PER_MONTH)).toEqual([5479]);
    expect(amountsIn('$79.95 for a 90-count bottle', PER_MONTH)).toEqual([]);
    expect(amountsIn('Ultimate Bundle drops effective price below $70/month', PER_MONTH)).toEqual([]);
  });

  test('a stated price keeps its currency, and must match an allowed price in that currency', () => {
    expect(moneyIn('price (AUD $215/mo)', PER_MONTH)).toEqual([{ amount: 215, currency: 'AUD' }]);
    expect(moneyIn('precio ($139 USD/mes)', PER_MONTH)).toEqual([{ amount: 139, currency: 'USD' }]);
    expect(moneyIn('A$89/month and CA$89/month', PER_MONTH)).toEqual([{ amount: 89, currency: 'AUD' }, { amount: 89, currency: 'CAD' }]);
    expect(moneyIn('¥8,850/月 or $69/month', PER_MONTH)).toEqual([{ amount: 8850, currency: 'JPY' }, { amount: 69, currency: '$' }]);
    expect(isAllowed({ amount: 79, currency: 'EUR' }, [{ amount: 79, currency: 'USD' }])).toBe(false);
    expect(isAllowed({ amount: 79, currency: '$' }, [{ amount: 79, currency: 'USD' }])).toBe(true);
    expect(isAllowed({ amount: 79, currency: '$' }, [{ amount: 79, currency: 'EUR' }])).toBe(false);
    expect(isAllowed({ amount: 89, currency: 'AUD' }, [{ amount: 89, currency: 'CAD' }])).toBe(false);
    // In Canadian copy a bare "$79/month" is Canadian dollars, so a US$79 store price does not back it.
    expect(moneyIn('then $79 a month', PER_MONTH, 'CAD')).toEqual([{ amount: 79, currency: 'CAD' }]);
    // A named dollar stays named, whatever the region's own dollar is.
    expect(moneyIn('NZ$79/month, HK$79/month, MX$79/month', PER_MONTH, 'AUD')).toEqual([
      { amount: 79, currency: 'NZD' }, { amount: 79, currency: 'HKD' }, { amount: 79, currency: 'MXN' },
    ]);
    expect(isAllowed(moneyIn('then $79 a month', PER_MONTH, 'CAD')[0], [{ amount: 79, currency: 'USD' }])).toBe(false);
  });

  test('statements were found across regions (fail closed)', () => {
    expect(statements.length).toBeGreaterThanOrEqual(15);
    expect(new Set(statements.map((s) => s.where.split(/[ /]/)[0])).size).toBeGreaterThanOrEqual(3);
  });

  test('every allow-listed vendor-page amount belongs to a live record', () => {
    for (const key of Object.keys(VENDOR_PAGE_AMOUNTS)) {
      const [region, slug] = key.split('/') as [RegionalRegionCode, string];
      expect(REGIONS[region]?.some((p) => p.slug === slug && p.vendorTerms), key).toBe(true);
    }
  });

  test('every stated monthly price is a vendor-quoted price or the store price, in the same currency', () => {
    const fmt = (m: Money) => `${m.currency} ${m.amount}`;
    const bad = statements
      .filter((s) => !isAllowed(s.stated, s.allowed))
      .map((s) => `${s.where}: ${fmt(s.stated)}/month for ${s.products} (vendor/store: ${s.allowed.map(fmt).join(', ')})`);
    expect(bad, bad.join('\n')).toEqual([]);
  });
});
