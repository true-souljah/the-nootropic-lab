import { describe, test, expect, vi, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  earnsCommission, getLocaleForMarket, getStrings, NO_COMMISSION_RATE_VALUES,
} from '@nootropic/data';
import type { Locale, Product } from '@nootropic/data';
import ProductDetail from './templates/ProductDetail';

// Operator decision 2026-10-09: a review page says "we earn a commission"
// only when we do. Records of brands we have no affiliate deal with carry
// `commissionRate: "0%"` (Onnit, Thesis, Nootropics Depot after #351; Hunter,
// FANCL, Blackmores, Eu Yan Sang, Memo Plus Gold, SuperShrooms before it).
// Their pages showed "We earn a commission if you buy through links on this
// page" three times (top strip, trust note, Pricing-tab cookie card) next to
// "Our cut 0%" and "0 days · 0% commission". earnsCommission() in
// @nootropic/data is the one rule; this file renders every review page.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

const CATALOGUES: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const RECORDS = Object.entries(CATALOGUES).flatMap(([region, products]) =>
  products.map((product) => ({ region, product })),
);

// Every non-numeric commissionRate in the catalogues, classified. A new value
// fails the catalogue test below until it is added here (and, if it means "no
// affiliate deal", to NO_COMMISSION_RATE_VALUES).
const NON_NUMERIC_RATES: Record<string, boolean> = {
  // US Hunter Focus, "In-house (Stacked Brands)", 30-day cookie: undisclosed, not absent.
  'Not publicly disclosed': true,
  // AU Blackmores Brain Active (discontinued): retail-only, no affiliate programme, 0-day cookie.
  'Retail (no direct DTC affiliate)': false,
};

/** Rendered text: React escapes quotes and ampersands. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

// The AppShell sidebar reads the build-time region (fails closed when unset).
afterEach(() => {
  vi.unstubAllEnvs();
});

function renderReview(product: Product, locale: Locale, region: string): string {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return text(
    renderToStaticMarkup(
      createElement(ProductDetail, {
        product,
        alternatives: [],
        siteUrl: 'https://example.com',
        uiStrings: getStrings(locale),
      }),
    ),
  );
}

const COMMISSION_SENTENCES = ALL_LOCALES.map((l) => getStrings(l).disclosure.inline);

describe('earnsCommission', () => {
  test.each([
    ['0%', false],
    ['0 %', false],
    ['0.0%', false],
    [' 0% ', false],
    ['Retail (no direct DTC affiliate)', false],
    ['30%', true],
    ['0.5%', true],
    ['10%', true],
    ['0–15%', true],
    ['Not publicly disclosed', true],
    ['', true],
  ])('%j → %s', (commissionRate, expected) => {
    expect(earnsCommission({ commissionRate })).toBe(expected);
  });
});

describe('catalogue commissionRate values', () => {
  test('scans all 8 catalogues (non-empty input)', () => {
    for (const [region, products] of Object.entries(CATALOGUES)) {
      expect(products.length, region).toBeGreaterThan(0);
    }
  });

  test('every non-numeric value is classified', () => {
    const nonNumeric = new Set(
      RECORDS.map(({ product }) => product.commissionRate.trim()).filter((r) => !/^\d+(?:\.\d+)?\s*%$/.test(r)),
    );
    expect([...nonNumeric].sort()).toEqual(Object.keys(NON_NUMERIC_RATES).sort());
    for (const [value, earns] of Object.entries(NON_NUMERIC_RATES)) {
      expect(earnsCommission({ commissionRate: value }), value).toBe(earns);
      expect(NO_COMMISSION_RATE_VALUES.includes(value), value).toBe(!earns);
    }
  });

  test('the records #351 moved to "0%" earn no commission', () => {
    const slugs = ['onnit-alpha-brain-review', 'thesis-nootropics-review', 'nootropics-depot-lions-mane'];
    const hits = RECORDS.filter(({ product }) => slugs.includes(product.slug));
    expect(hits.length).toBe(14);
    for (const { region, product } of hits) expect(earnsCommission(product), `${region} ${product.slug}`).toBe(false);
  });
});

describe('no-commission strings — present and translated in every locale', () => {
  const en = getStrings('en');

  test.each(ALL_LOCALES)('%s has disclosure.noCommission and pricing.noAffiliateCookie', (locale) => {
    const s = getStrings(locale);
    expect(s.disclosure.noCommission.trim().length).toBeGreaterThan(10);
    expect(s.disclosure.noCommission).not.toBe(s.disclosure.inline);
    expect(s.productDetail.pricing.noAffiliateCookie.trim().length).toBeGreaterThan(3);
    if (locale !== 'en') {
      expect(s.disclosure.noCommission, `${locale} noCommission is the English copy`).not.toBe(en.disclosure.noCommission);
      expect(s.productDetail.pricing.noAffiliateCookie).not.toBe(en.productDetail.pricing.noAffiliateCookie);
    }
  });
});

describe('review pages — the commission sentence only where we earn one', () => {
  const noCommission = RECORDS.filter(({ product }) => !earnsCommission(product));
  const withCommission = RECORDS.filter(({ product }) => earnsCommission(product));

  test('both sets are non-empty', () => {
    expect(noCommission.length).toBeGreaterThanOrEqual(25);
    expect(withCommission.length).toBeGreaterThan(40);
  });

  test.each(noCommission.map(({ region, product }) => [region, product.slug, product] as const))(
    '%s %s (no commission): no commission sentence in any locale; the no-commission line instead',
    (region, _slug, product) => {
      const locale = getLocaleForMarket(region);
      const s = getStrings(locale);
      const html = renderReview(product, locale, region);
      for (const sentence of COMMISSION_SENTENCES) expect(html).not.toContain(sentence);
      expect(html).not.toMatch(/we (may )?earn a commission/i);
      // Top strip; trust note and cookie card unless the product is discontinued.
      expect(count(html, s.disclosure.noCommission)).toBe(product.discontinued ? 1 : 3);
      if (!product.discontinued) {
        expect(html).toContain(s.productDetail.pricing.noAffiliateCookie);
        const cookieTerms = s.productDetail.pricing.cookieTerms
          .replace('{days}', String(product.cookieDays))
          .replace('{rate}', product.commissionRate);
        expect(html).not.toContain(cookieTerms);
      }
      // The ranking statement (trust note, cookie card) and the "Our cut" value stay.
      if (!product.discontinued) expect(count(html, s.disclosure.ranking)).toBe(2);
      expect(html).toContain(`>${product.commissionRate}<`);
    },
  );

  test.each(withCommission.map(({ region, product }) => [region, product.slug, product] as const))(
    '%s %s (commission): keeps the commission sentence',
    (region, _slug, product) => {
      const locale = getLocaleForMarket(region);
      const s = getStrings(locale);
      const html = renderReview(product, locale, region);
      expect(count(html, s.disclosure.inline)).toBe(product.discontinued ? 1 : 3);
      expect(html).not.toContain(s.disclosure.noCommission);
      expect(html).not.toContain(s.productDetail.pricing.noAffiliateCookie);
    },
  );

  test.each(ALL_LOCALES)('%s bundle: same split for a no-commission and an affiliated product', (locale) => {
    const s = getStrings(locale);
    const onnit = allProductsUS.find((p) => p.slug === 'onnit-alpha-brain-review')!;
    const mlp = allProductsUS.find((p) => p.slug === 'mind-lab-pro-review')!;
    expect(earnsCommission(onnit)).toBe(false);
    expect(earnsCommission(mlp)).toBe(true);

    const none = renderReview(onnit, locale, 'us');
    for (const sentence of COMMISSION_SENTENCES) expect(none).not.toContain(sentence);
    expect(count(none, s.disclosure.noCommission)).toBe(3);

    const paid = renderReview(mlp, locale, 'us');
    expect(count(paid, s.disclosure.inline)).toBe(3);
    expect(paid).not.toContain(s.disclosure.noCommission);
  });
});
