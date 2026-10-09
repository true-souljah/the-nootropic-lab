import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  VENDOR_TERM_FIELDS, REGION_PROFILES,
} from '@nootropic/data';
import type { Product, RegionalRegionCode } from '@nootropic/data';

// Monthly prices in prose come from the vendor (site-owner decision
// 2026-10-08: prices follow the vendor's own quotes). For every product with
// PASS-verified vendor terms, a per-month price stated about it — in its own
// record copy, in a listicle pick for it, or in a page sentence that names it —
// must be an amount the vendor's quotes state (or, with its source, one listed
// in VENDOR_PAGE_AMOUNTS) or the product's stored price.
// Known gap: stored prices are trusted here, and several stored local prices
// (AU/CA/JP) are currency conversions with no vendor quote in that currency, so
// prose repeating them passes. Their provenance is a separate BACKLOG item.
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
  String.raw`(?:(?:US|CA|AU|A|C|S)?\$|AUD\s?\$?|CAD\s?~?\$?|USD\s?\$?|€|¥|￥)\s?~?${AMOUNT}(?:\s?(?:USD|AUD|CAD|EUR))?\s?(?:\/\s?(?:mo|month|mes|Monat|mois|月)\b|per month|a month|al mes|par mois|pro Monat)` +
    String.raw`|${AMOUNT}\s?(?:€|円)\s?(?:\/\s?(?:mo|month|mes|Monat|mois|月)|al mes|par mois|pro Monat)`,
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

function amountsIn(text: string, re: RegExp): number[] {
  return [...text.matchAll(re)]
    // "below $70/month" states a bound, not a price.
    .filter((m) => !/(?:below|under|less than)\s*$/i.test(text.slice(Math.max(0, (m.index ?? 0) - 12), m.index)))
    .map((m) => num(m[1] ?? m[2]))
    .filter((n) => Number.isFinite(n));
}

/** Amounts the product's vendor quotes state, plus its stored prices. */
function allowedAmounts(p: Product, region: RegionalRegionCode): Set<number> {
  const out = new Set<number>();
  for (const field of VENDOR_TERM_FIELDS) {
    const term = p.vendorTerms?.[field];
    if (!term) continue;
    for (const t of [term.text, ...(term.fragments ?? [])]) for (const n of amountsIn(t, QUOTED)) out.add(n);
  }
  for (const v of [p[REGION_PROFILES[region].priceField], p.priceMonthlyUSD]) if (typeof v === 'number') out.add(v);
  for (const n of VENDOR_PAGE_AMOUNTS[`${region}/${p.slug}`]?.amounts ?? []) out.add(n);
  return out;
}

const RECORD_FIELDS = ['summary', 'whatItIs', 'howItWorks', 'whatToExpect', 'seoTitle', 'seoDescription'] as const;

function pagesOf(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? pagesOf(join(dir, e.name)) : e.name.endsWith('.tsx') ? [join(dir, e.name)] : [],
  );
}

type Statement = { where: string; amount: number; allowed: Set<number>; products: string };

function collect(): Statement[] {
  const out: Statement[] = [];
  for (const [region, products] of Object.entries(REGIONS) as [RegionalRegionCode, Product[]][]) {
    const quoted = products.filter((p) => p.vendorTerms && !p.discontinued);
    const allowed = new Map(quoted.map((p) => [p.slug, allowedAmounts(p, region)]));

    // 1. The product's own record copy.
    for (const p of quoted) {
      const texts = [...RECORD_FIELDS.map((f) => p[f]), ...p.pros, ...p.cons].filter((s): s is string => typeof s === 'string');
      for (const t of texts) for (const amount of amountsIn(t, PER_MONTH)) {
        out.push({ where: `${region} ${p.slug} record`, amount, allowed: allowed.get(p.slug)!, products: p.name });
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
        for (const amount of amountsIn(m[3], PER_MONTH)) out.push({ where: `${rel} pick ${m[1]}`, amount, allowed: set, products: m[1] });
      }
      let rest = src;
      for (const t of inPicks) rest = rest.replace(t, '');
      for (const sentence of rest.split(/(?<=[.!?])\s+|\n/)) {
        const amounts = amountsIn(sentence, PER_MONTH);
        if (!amounts.length) continue;
        const named = quoted.filter((p) => sentence.includes(p.name));
        if (!named.length) continue;
        const union = new Set(named.flatMap((p) => [...allowed.get(p.slug)!]));
        for (const amount of amounts) out.push({ where: `${rel}`, amount, allowed: union, products: named.map((p) => p.name).join(' + ') });
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
    expect(amountsIn('$79.95 for a 90-count bottle', PER_MONTH)).toEqual([]);
    expect(amountsIn('Ultimate Bundle drops effective price below $70/month', PER_MONTH)).toEqual([]);
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

  test('every stated monthly price is a vendor-quoted amount or the stored price', () => {
    const bad = statements
      .filter((s) => !s.allowed.has(s.amount))
      .map((s) => `${s.where}: ${s.amount}/month for ${s.products} (vendor/stored: ${[...s.allowed].sort((a, b) => a - b).join(', ')})`);
    expect(bad, bad.join('\n')).toEqual([]);
  });
});
