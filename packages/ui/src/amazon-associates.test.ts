import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA, productsUS,
  AMAZON_ASSOCIATES_NETWORK, AMAZON_ASSOCIATES_STATEMENT,
  earnsCommission, getLocaleForMarket, getStrings, isAmazonAssociatesLink, linksAmazonAssociates,
  purchaseUrl, reviewDisclosureScope,
} from '@nootropic/data';
import type { Locale, Product } from '@nootropic/data';
import { FPDisclosure } from './public-chrome/FPDisclosure';
import PublicShell from './templates/PublicShell';
import BestOf from './templates/BestOf';
import HeadToHead from './templates/HeadToHead';
import ProductDetail from './templates/ProductDetail';

// Amazon Associates (owner 2026-10-19; account map read 2026-10-20): the site's
// only tagged links go to the US (amazon.com) store, tag souljah03-20; the US
// account also has seven linked stores (CA souljah04-20, UK, DE, FR, IT, PL, BE)
// that no record links to yet. Facts from Amazon's Standard Commission Income
// Statement and Operating Agreement (read 2026-10-19):
// - Grocery and Health & Personal Care pay 1.00%; the attribution window is
//   24 hours, stored as cookieDays 1 and rendered "1 day";
// - the site must state "As an Amazon Associate I earn from qualifying
//   purchases." wherever it uses Associates links;
// - an Amazon price copied by hand may not be shown, so an Associates record
//   carries no amazon.* store price.
// Australia, Singapore and Japan have no account, and the Canada store has no
// NatureBell listing to tag (amazon.ca/dp/B09F4ML3FF returned 404 on
// 2026-10-20): those Amazon links stay untagged and the records carry the
// "0%" no-commission convention.
// Operator decision 2026-10-21: a US record whose brand programme is not joined
// links its amazon.com listing as an interim. US Onnit Alpha Brain (ASIN
// B07WP7Q5BF, 90 Count, sold by ONNIT) is the first, until Onnit's own
// programme (Impact) is approved; its onnit.com store price left the record.
// scripts/check-built-disclosure.ts checks the statement on the built pages.

const TAG = 'souljah03-20';
const NO_AFFILIATE = 'Amazon (retail, no affiliate link)';
const OTHER_REGIONS: Record<string, Product[]> = {
  eu: allProductsEU, ca: allProductsCA, au: allProductsAU, jp: allProductsJP,
  latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const ALL_REGIONS: Record<string, Product[]> = { us: allProductsUS, ...OTHER_REGIONS };
const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const REPO = join(__dirname, '..', '..', '..');

const isAmazonHost = (url: string) => /(^|\.)amazon\.[a-z.]+$/.test(new URL(url).hostname);
const amazonRecords = (products: Product[]) => products.filter((p) => isAmazonHost(p.affiliateUrl));
const record = (products: Product[], id: string) => {
  const p = products.find((r) => r.id === id);
  if (!p) throw new Error(`${id} missing`);
  return p;
};

/** Rendered text: React escapes quotes and ampersands. */
const text = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const count = (haystack: string, needle: string) => haystack.split(needle).length - 1;
/** The top strip's text without tags. */
const strip = (html: string) => /<div role="note" data-disclosure-scope="\w+"[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1].replace(/<[^>]+>/g, '') ?? null;

function review(product: Product, region: string, locale: Locale = getLocaleForMarket(region)): string {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return text(
    renderToStaticMarkup(
      createElement(ProductDetail, { product, alternatives: [], siteUrl: 'https://example.com', uiStrings: getStrings(locale) }),
    ),
  );
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_REGION', 'us');
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('catalogue: Amazon links are tagged in the US only', () => {
  test('finds the Amazon records (non-empty input)', () => {
    expect(amazonRecords(allProductsUS).map((p) => p.id).sort()).toEqual(['alpha-brain', 'naturebell-ginkgo-ginseng', 'neutonic-productivity-drink']);
    const others = Object.entries(OTHER_REGIONS).flatMap(([region, products]) => amazonRecords(products).map((p) => `${region}/${p.id}`));
    expect(others.sort()).toEqual([
      'au/naturebell-ginkgo-ginseng',
      'ca/naturebell-ginkgo-ginseng',
      'jp/suntory-dha-epa-sesamin',
      'sea/naturebell-ginkgo-ginseng',
    ]);
  });

  test.each(amazonRecords(allProductsUS).map((p) => [p.id, p] as const))(
    'us/%s: amazon.com link with the Associates tag, 1%, a 1-day window',
    (_id, p) => {
      const url = new URL(p.affiliateUrl);
      expect(url.hostname).toBe('www.amazon.com');
      expect(url.searchParams.get('tag')).toBe(TAG);
      expect(url.searchParams.getAll('tag')).toHaveLength(1);
      expect(p.affiliateNetwork).toBe(AMAZON_ASSOCIATES_NETWORK);
      expect(p.commissionRate).toBe('1%');
      expect(p.cookieDays).toBe(1);
      expect(earnsCommission(p)).toBe(true);
      expect(isAmazonAssociatesLink(p)).toBe(true);
      expect(reviewDisclosureScope(p)).toBe('page');
    },
  );

  test('only amazon.com links in the US catalogue carry the Associates network', () => {
    for (const [region, products] of Object.entries(ALL_REGIONS)) {
      for (const p of products.filter((r) => r.affiliateNetwork === AMAZON_ASSOCIATES_NETWORK)) {
        expect(region, `${region}/${p.id}`).toBe('us');
        expect(new URL(p.affiliateUrl).hostname, `${region}/${p.id}`).toBe('www.amazon.com');
      }
      for (const p of products) expect(p.affiliateNetwork, `${region}/${p.id}`).not.toMatch(/^Amazon Associates\b(?!$)/);
    }
  });

  test('no Associates record carries an Amazon store price (no hand-copied Amazon prices)', () => {
    const associates = Object.values(ALL_REGIONS).flat().filter((p) => p.affiliateNetwork === AMAZON_ASSOCIATES_NETWORK);
    expect(associates.length).toBe(3);
    for (const p of associates) {
      if (p.storePrice) expect(isAmazonHost(p.storePrice.url), p.id).toBe(false);
    }
  });

  test.each(Object.entries(OTHER_REGIONS).flatMap(([region, products]) => amazonRecords(products).map((p) => [region, p.id, p] as const)))(
    '%s/%s: untagged Amazon link, a no-commission record',
    (_region, _id, p) => {
      expect(p.affiliateUrl).not.toMatch(/[?&]tag=/);
      expect(new URL(p.affiliateUrl).searchParams.has('tag')).toBe(false);
      expect(p.affiliateNetwork).toBe(NO_AFFILIATE);
      expect(p.commissionRate).toBe('0%');
      expect(p.cookieDays).toBe(0);
      expect(earnsCommission(p)).toBe(false);
      expect(isAmazonAssociatesLink(p)).toBe(false);
    },
  );

  test('Suntory (JP) keeps its amazon.co.jp store price: no Associates account there', () => {
    expect(record(allProductsJP, 'suntory-dha-epa-sesamin').storePrice).toMatchObject({
      currency: 'JPY', url: 'https://www.amazon.co.jp/dp/B00A693YIA',
    });
  });

  test('us/alpha-brain (interim): the 90 Count listing, and no store price (a price shown must be the linked store\'s own)', () => {
    const p = record(allProductsUS, 'alpha-brain');
    expect(p.affiliateUrl).toBe(`https://www.amazon.com/dp/B07WP7Q5BF?tag=${TAG}`);
    expect(p.storePrice).toBeUndefined();
  });
});

describe('cookie window: one day is "1 day" in every locale', () => {
  test.each(ALL_LOCALES)('%s cookieTermsOneDay is singular and fills only {rate}', (locale) => {
    const t = getStrings(locale).productDetail.pricing;
    expect(t.cookieTermsOneDay).toContain('{rate}');
    expect(t.cookieTermsOneDay).not.toContain('{days}');
    expect(t.cookieTermsOneDay.replace('{rate}', '1%')).not.toMatch(/\b1 (days|días|jours|dias|Tage)\b/);
    expect(t.cookieTermsOneDay).not.toBe(t.cookieTerms);
  });

  test('the US review pages render "1 day · 1% commission", never "1 days"', () => {
    for (const id of ['alpha-brain', 'naturebell-ginkgo-ginseng', 'neutonic-productivity-drink']) {
      const html = review(record(allProductsUS, id), 'us');
      expect(html, id).toContain('1 day · 1% commission');
      expect(html, id).not.toMatch(/\b1 days\b/);
    }
  });
});

describe('the Associates statement renders only beside an Associates link', () => {
  test('the statement is Amazon\'s exact sentence', () => {
    expect(AMAZON_ASSOCIATES_STATEMENT).toBe('As an Amazon Associate I earn from qualifying purchases.');
  });

  test('FPDisclosure adds it, in English, only with amazonAssociate', () => {
    for (const locale of ALL_LOCALES) {
      const d = getStrings(locale).disclosure;
      const on = renderToStaticMarkup(createElement(FPDisclosure, { strings: d, scope: 'page', amazonAssociate: true }));
      expect(on, locale).toContain(`<span lang="en" data-amazon-associates-statement="">${AMAZON_ASSOCIATES_STATEMENT}</span>`);
      const off = renderToStaticMarkup(createElement(FPDisclosure, { strings: d, scope: 'page' }));
      expect(off, locale).not.toContain(AMAZON_ASSOCIATES_STATEMENT);
    }
  });

  test.each(['alpha-brain', 'naturebell-ginkgo-ginseng', 'neutonic-productivity-drink'])(
    'us/%s review page: the statement on the strip and in the Pricing block, beside the commission sentence',
    (id) => {
      const s = getStrings('en');
      const html = review(record(allProductsUS, id), 'us');
      expect(count(html, AMAZON_ASSOCIATES_STATEMENT)).toBe(2);
      expect(strip(html)).toContain(AMAZON_ASSOCIATES_STATEMENT);
      expect(html).toContain(`${s.disclosure.inline} <span lang="en" data-amazon-associates-statement="">${AMAZON_ASSOCIATES_STATEMENT}</span> ${s.disclosure.ranking}`);
      expect(html).toContain(`href="${record(allProductsUS, id).affiliateUrl}"`);
      expect(html).toContain(`tag=${TAG}`);
      expect(html).not.toContain(s.disclosure.noCommission);
    },
  );

  test.each([
    ['ca', 'naturebell-ginkgo-ginseng'],
    ['au', 'naturebell-ginkgo-ginseng'],
    ['sea', 'naturebell-ginkgo-ginseng'],
    ['jp', 'suntory-dha-epa-sesamin'],
  ] as const)('%s/%s review page: the no-commission line, no tag, no statement', (region, id) => {
    const p = record(ALL_REGIONS[region], id);
    const s = getStrings(getLocaleForMarket(region));
    const html = review(p, region);
    expect(html).not.toContain(AMAZON_ASSOCIATES_STATEMENT);
    expect(html).not.toContain('tag=');
    expect(html).toContain(s.disclosure.noCommission);
    expect(html).not.toContain(s.disclosure.inline);
  });

  test('no other review page in any region carries the statement', () => {
    let rendered = 0;
    for (const [region, products] of Object.entries(ALL_REGIONS)) {
      for (const p of products) {
        if (region === 'us' && isAmazonAssociatesLink(p)) continue;
        expect(review(p, region), `${region}/${p.id}`).not.toContain(AMAZON_ASSOCIATES_STATEMENT);
        rendered++;
      }
    }
    // Every record in the 8 catalogues except the three US Associates records.
    expect(rendered).toBe(Object.values(ALL_REGIONS).flat().length - 3);
    expect(rendered).toBeGreaterThan(80);
  });

  test('PublicShell, BestOf and HeadToHead add it exactly when they link an Associates record', () => {
    const s = getStrings('en');
    const naturebell = record(productsUS, 'naturebell-ginkgo-ginseng');
    const mlp = record(productsUS, 'mind-lab-pro');
    const others = productsUS.filter((p) => !isAmazonAssociatesLink(p));
    expect(linksAmazonAssociates(productsUS)).toBe(true);
    expect(linksAmazonAssociates(others)).toBe(false);

    const shell = (linkedProducts: Product[]) =>
      renderToStaticMarkup(createElement(PublicShell, { uiStrings: s, linkedProducts, children: createElement('p', null, 'x') }));
    expect(strip(shell([mlp, naturebell]))).toContain(AMAZON_ASSOCIATES_STATEMENT);
    expect(shell([mlp])).not.toContain(AMAZON_ASSOCIATES_STATEMENT);

    const bestOf = (products: Product[]) =>
      renderToStaticMarkup(createElement(BestOf, { products, uiStrings: s, updated: new Date('2026-10-01T00:00:00Z') }));
    expect(strip(bestOf(productsUS))).toContain(AMAZON_ASSOCIATES_STATEMENT);
    expect(bestOf(others)).not.toContain(AMAZON_ASSOCIATES_STATEMENT);

    const h2h = (productA: Product, productB: Product) =>
      renderToStaticMarkup(
        createElement(HeadToHead, {
          productA, productB, siteUrl: 'https://example.com', faqItems: [], whoIsForA: [], whoIsForB: [], uiStrings: s,
          updated: new Date('2026-10-01T00:00:00Z'),
        }),
      );
    expect(strip(h2h(mlp, naturebell))).toContain(AMAZON_ASSOCIATES_STATEMENT);
    expect(h2h(mlp, record(productsUS, 'noocube'))).not.toContain(AMAZON_ASSOCIATES_STATEMENT);
    // A discontinued Associates product renders no buy link.
    expect(h2h(mlp, { ...naturebell, discontinued: { note: 'Discontinued.' } } as Product)).not.toContain(AMAZON_ASSOCIATES_STATEMENT);
  });

  test('every FPDisclosure that can be page-scoped passes amazonAssociate (UI templates and app pages)', () => {
    const tsx = (dir: string, out: string[] = []): string[] => {
      for (const name of readdirSync(dir)) {
        if (name === 'node_modules' || name === 'out' || name === '.next') continue;
        const full = join(dir, name);
        if (statSync(full).isDirectory()) tsx(full, out);
        else if (name.endsWith('.tsx') && !name.endsWith('.test.tsx')) out.push(full);
      }
      return out;
    };
    const files = [__dirname, ...readdirSync(join(REPO, 'apps')).map((app) => join(REPO, 'apps', app, 'src'))].flatMap((d) => tsx(d));
    const tags = files.flatMap((f) =>
      [...readFileSync(f, 'utf8').matchAll(/<FPDisclosure\b[\s\S]*?\/>/g)].map((m) => ({ file: relative(REPO, f), tag: m[0] })),
    );
    expect(tags.length).toBeGreaterThanOrEqual(9);
    for (const { file, tag } of tags) {
      if (/\bscope="site"/.test(tag)) continue;
      expect(tag, file).toMatch(/\bamazonAssociate=\{/);
    }
  });
});
