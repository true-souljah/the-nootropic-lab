import { describe, it, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  productsUS, productsEU,
  ingredients, earnsCommission, reviewDisclosureScope,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Neutonic (2026-10-15): Productivity Drink on the US and EU hosts, Brain
// Capsules on the US host only (the capsule listings return 404 on the EU
// market). The EU drink and the US capsules link through Neutonic's own
// UpPromote affiliate programme (10% on new customers, 30-day tracking, per
// affiliates.neutonic.com). The US drink is a no-commission retail listing:
// its neutonic.com US page has no cart and sends buyers to Amazon, where
// UpPromote cannot track the sale, so it links the plain product page and
// carries "0%" (BACKLOG coop:neutonic-us-drink-amazon-only-2026-10-15). CA,
// AU, GCC, SEA, LATAM and JP are a later wave (BACKLOG
// coop:neutonic-wave2-regions-2026-10-15), so those catalogues omit both.

const DRINK = 'neutonic-productivity-drink-review';
const CAPSULES = 'neutonic-brain-capsules-review';

// The product page each region's affiliate link lands on.
const PRODUCT_PATH: Record<string, Record<string, string>> = {
  us: { [DRINK]: '/en-us/products/tropical-ice-12pk-us', [CAPSULES]: '/en-us/products/neutonic-capsules-us' },
  eu: { [DRINK]: '/products/tropical-ice-12pk' },
};
const SCA_REF = '11880392.89XMRS5MXxp';

const IN_SCOPE: Record<string, Product[]> = { us: allProductsUS, eu: allProductsEU };
const RECOMMENDABLE: Record<string, Product[]> = { us: productsUS, eu: productsEU };
const OUT_OF_SCOPE: Record<string, Product[]> = {
  ca: allProductsCA, au: allProductsAU, jp: allProductsJP,
  latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

const cases = Object.entries(PRODUCT_PATH).flatMap(([region, paths]) => Object.keys(paths).map((slug) => [region, slug] as const));
// Records on the UpPromote link; the US drink is the no-commission one.
const tracked = cases.filter(([region, slug]) => !(region === 'us' && slug === DRINK));

function record(region: string, slug: string): Product {
  const p = IN_SCOPE[region].find((r) => r.slug === slug);
  if (!p) throw new Error(`${region}/${slug} missing`);
  return p;
}

describe('Neutonic records on the US and EU hosts', () => {
  it('covers the drink in us + eu and the capsules in us only (guards against a silently empty case list)', () => {
    expect(cases).toEqual([
      ['us', DRINK],
      ['us', CAPSULES],
      ['eu', DRINK],
    ]);
  });

  it('tracks the EU drink and the US capsules; the US drink is the one untracked record', () => {
    expect(tracked).toEqual([
      ['us', CAPSULES],
      ['eu', DRINK],
    ]);
  });

  it.each(cases)('%s/%s exists, is live, and is a Neutonic record linking its neutonic.com product page', (region, slug) => {
    const p = record(region, slug);
    expect(p.discontinued).toBeUndefined();
    expect(p.noPurchaseLink).toBeUndefined();
    expect(RECOMMENDABLE[region].some((r) => r.slug === slug)).toBe(true);
    expect(p.brand).toBe('Neutonic');
    expect(p.caffeineFree).toBe(slug === CAPSULES);
    const url = new URL(p.affiliateUrl);
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('www.neutonic.com');
    expect(url.pathname).toBe(PRODUCT_PATH[region][slug]);
  });

  it.each(tracked)('%s/%s earns a commission through the tracked UpPromote link', (region, slug) => {
    const p = record(region, slug);
    expect(p.affiliateNetwork).toBe('UpPromote');
    expect(p.commissionRate).toBe('10%');
    expect(p.cookieDays).toBe(30);
    expect(earnsCommission(p)).toBe(true);
    const url = new URL(p.affiliateUrl);
    expect(url.searchParams.get('sca_ref')).toBe(SCA_REF);
    expect(url.searchParams.get('utm_source')).toBe('uppromote');
    expect(url.searchParams.get('utm_medium')).toBe('affiliate');
  });

  it('US drink: a no-commission retail listing on the plain product page (its US page sells only via Amazon)', () => {
    const p = record('us', DRINK);
    expect(p.affiliateNetwork).toBe('Amazon (retail, no affiliate link)');
    expect(p.commissionRate).toBe('0%');
    expect(p.cookieDays).toBe(0);
    expect(earnsCommission(p)).toBe(false);
    expect(reviewDisclosureScope(p)).toBe('product');
    expect(p.affiliateUrl).toBe('https://www.neutonic.com/en-us/products/tropical-ice-12pk-us');
    expect(new URL(p.affiliateUrl).search).toBe('');
    expect(p.affiliateUrl).not.toMatch(/sca_ref|utm_/);
  });

  it.each(Object.keys(PRODUCT_PATH))('%s: the drink is one can per serving, 12 cans a pack', (region) => {
    const drink = record(region, DRINK);
    expect(drink.form).toBe('can');
    expect(drink.capsulesPerServing).toBe(1);
    expect(drink.servingsPerContainer).toBe(12);
  });

  it('US: the capsules are 3 capsules per serving, 30 servings a bottle', () => {
    const caps = record('us', CAPSULES);
    expect(caps.form).toBeUndefined();
    expect(caps.capsulesPerServing).toBe(3);
    expect(caps.servingsPerContainer).toBe(30);
  });

  it('store prices are the linked store\'s own, in its currency; the US drink page states none', () => {
    expect(record('eu', DRINK).storePrice).toMatchObject({
      amount: 35.99, currency: 'EUR', text: '€35,99', url: 'https://www.neutonic.com/products/tropical-ice-12pk',
    });
    expect(record('us', CAPSULES).storePrice).toMatchObject({
      amount: 49.99, currency: 'USD', text: '$49.99', url: 'https://www.neutonic.com/en-us/products/neutonic-capsules-us',
    });
    // The US drink page's only buy button links to Amazon and prints no price
    // (checked 2026-10-15), so the record carries no store price.
    expect(record('us', DRINK).storePrice).toBeUndefined();
  });

  it('no hands-on, legacy price or vendor-terms keys; returns-only policy is not a money-back guarantee', () => {
    for (const [region, slug] of cases) {
      const p = record(region, slug);
      // No product has been tested hands-on (site-owner confirmation 2026-10-07).
      expect(Object.keys(p).filter((k) => /hands/i.test(k)), `${region}/${slug}`).toEqual([]);
      expect(Object.keys(p).filter((k) => /^priceMonthly|^priceBasis$/.test(k)), `${region}/${slug}`).toEqual([]);
      // No PASS-verified vendor-terms evidence exists for Neutonic.
      expect(p.vendorTerms, `${region}/${slug}`).toBeUndefined();
      // neutonic.com accepts returns of unused items only.
      expect(p.moneyBackDays, `${region}/${slug}`).toBeNull();
      // Orders ship from the UK and EU buyers pay import VAT, so no "EU storefront" badge.
      expect(p.euStorefront, `${region}/${slug}`).toBe(false);
      expect(p.trustpilotScore).toBe(4.8);
      expect(p.trustpilotCount).toBe(1209);
    }
  });

  it('ingredient pages list the records that contain each ingredient', () => {
    const expected: Record<string, string[]> = {
      citicoline: [DRINK, CAPSULES],
      'rhodiola-rosea': [DRINK, CAPSULES],
      caffeine: [DRINK],
      'l-theanine': [DRINK],
      'bacopa-monnieri': [CAPSULES],
      'ginkgo-biloba': [CAPSULES],
    };
    for (const [ingredientSlug, slugs] of Object.entries(expected)) {
      const ingredient = ingredients.find((i) => i.slug === ingredientSlug);
      expect(ingredient, `ingredient ${ingredientSlug} missing`).toBeDefined();
      for (const slug of slugs) expect(ingredient!.productsContaining, `${ingredientSlug} → ${slug}`).toContain(slug);
    }
    const listing = ingredients.filter((i) => i.productsContaining.some((s) => s.startsWith('neutonic-'))).map((i) => i.slug).sort();
    expect(listing).toEqual(Object.keys(expected).sort());
  });
});

describe('Neutonic records are absent outside their wave-1 hosts', () => {
  it('the EU catalogue omits Brain Capsules (not sold on the EU market, 404 on 2026-10-15)', () => {
    expect(allProductsEU.some((p) => p.slug === CAPSULES)).toBe(false);
  });

  it.each(Object.keys(OUT_OF_SCOPE))('%s omits both slugs', (region) => {
    const list = OUT_OF_SCOPE[region];
    expect(list.length, `${region} catalogue is empty`).toBeGreaterThan(0);
    for (const slug of [DRINK, CAPSULES]) {
      expect(list.some((p) => p.slug === slug), `${region}/${slug}`).toBe(false);
    }
  });
});
