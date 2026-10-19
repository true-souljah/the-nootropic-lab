import { describe, it, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  productsUS, ingredients, earnsCommission, reviewDisclosureScope,
  baseName, dosingAnchorFor, dosingTally, NO_REFERENCE_DOSE,
  storePriceProblems, perServingStorePrice, perDayStorePrice, monthlyStorePrice, productImage,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Deadline (2026-10-19, BACKLOG coop:deadline-focus-pill-2026-10-19): Focus
// Pill on the US host only. deadline.co states "We currently ship to the United
// States only." (https://deadline.co/policies/shipping-policy) and served the US
// store in USD for every other country tried (CA, GB, DE, AU, AE, SG, JP, MX),
// so no other catalogue carries the record. The link is the vendor's own
// affiliate programme (BixGrow tracking, `bg_ref`), approved at 40% on
// 2026-10-15; no cookie window is stated anywhere, so cookieDays is null (the
// NooCube precedent) and the Pricing tab shows the not-available mark.
// The commission does not change the score: the pillars are set as for any record.

const SLUG = 'deadline-focus-pill-review';
const ID = 'deadline-focus-pill';
const PRODUCT_URL = 'https://deadline.co/products/deadline-focus-pill';
const BG_REF = 'iwGH36v1Uc';

const OUT_OF_SCOPE: Record<string, Product[]> = {
  eu: allProductsEU, ca: allProductsCA, au: allProductsAU, jp: allProductsJP,
  latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

// Copy the record must never carry: the product page's hard-coded "4.7" star
// rating (no review count or review app behind it), the clinician widget and
// the expert quotes (vendor marketing), and testing claims that no published
// report backs.
const BANNED_COPY: RegExp[] = [
  /4\.7/,
  /clinician/i,
  /Clinicians' Choice/i,
  /FrontrowMD/i,
  /certificate of analysis/i,
  /third-party tested/i,
  /\bCOA\b/,
];

function record(): Product {
  const matches = allProductsUS.filter((p) => p.slug === SLUG);
  expect(matches, `us/${SLUG}`).toHaveLength(1);
  return matches[0];
}

describe('Deadline Focus Pill on the US host', () => {
  it('is a live, recommendable US record', () => {
    const p = record();
    expect(p.id).toBe(ID);
    expect(p.name).toBe('Deadline Focus Pill');
    expect(p.brand).toBe('Deadline');
    expect(p.market).toBe('us');
    expect(p.discontinued).toBeUndefined();
    expect(p.noPurchaseLink).toBeUndefined();
    expect(productsUS.some((r) => r.slug === SLUG)).toBe(true);
  });

  it('links the product page with the tracked bg_ref and nothing else', () => {
    const url = new URL(record().affiliateUrl);
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('deadline.co');
    expect(url.pathname).toBe('/products/deadline-focus-pill');
    expect([...url.searchParams.keys()]).toEqual(['bg_ref']);
    expect(url.searchParams.get('bg_ref')).toBe(BG_REF);
  });

  it('earns 40% through the vendor programme, with no cookie window stated', () => {
    const p = record();
    expect(p.affiliateNetwork).toBe('Deadline affiliate programme (BixGrow)');
    expect(p.commissionRate).toBe('40%');
    expect(p.cookieDays).toBeNull();
    expect(earnsCommission(p)).toBe(true);
    expect(reviewDisclosureScope(p)).toBe('page');
  });

  it('is 90 capsules, 3 per serving, 30 servings, caffeinated, with no EU storefront', () => {
    const p = record();
    expect(p.form).toBeUndefined();
    expect(p.capsulesPerServing).toBe(3);
    expect(p.servingsPerContainer).toBe(30);
    expect(p.caffeineFree).toBe(false);
    expect(p.euStorefront).toBe(false);
    expect(p.pricingModel).toBe('both');
  });

  it("stores the printed one-time price, $129 for a 30-day supply of 90 capsules", () => {
    const p = record();
    expect(p.storePrice).toEqual({
      amount: 129,
      currency: 'USD',
      text: '$129',
      pack: '90 capsules',
      supply: '30-day supply',
      directions: 'Three capsules in the morning',
      url: PRODUCT_URL,
      checkedAt: '2026-10-19',
    });
    expect(storePriceProblems(p)).toEqual([]);
    expect(perServingStorePrice(p)).toMatchObject({ ok: true, amount: 4.3, currency: 'USD' });
    expect(perDayStorePrice(p)).toMatchObject({ ok: true, amount: 4.3, currency: 'USD' });
    expect(monthlyStorePrice(p)).toMatchObject({ amount: 129, currency: 'USD' });
  });

  it('counts caffeine once: one 137mg caffeine row for both 70% caffeine materials', () => {
    const rows = record().ingredientDosages;
    const caffeine = rows.filter((r) => dosingAnchorFor(r)?.ingredientSlug === 'caffeine');
    expect(caffeine).toHaveLength(1);
    expect(caffeine[0]).toMatchObject({ doseInProduct: '137mg', clinicalDose: '100-200mg', adequatelyDosed: true });
    expect(caffeine[0].name).toMatch(/zümXR/);
    expect(caffeine[0].name).toMatch(/Coffeeberry/);
    // No second row whose base name says caffeine (the materials would double-count).
    expect(rows.filter((r) => /caffeine/i.test(baseName(r.name)))).toHaveLength(1);
  });

  it('dosing rows follow the label: four reference doses met, Dynamine below, theacrine unanchored', () => {
    const p = record();
    const byBase = Object.fromEntries(p.ingredientDosages.map((r) => [baseName(r.name), r]));
    expect(Object.keys(byBase)).toEqual(['Citicoline', 'Rhodiola Rosea', 'L-Theanine', 'Caffeine', 'Dynamine', 'Theacrine']);
    expect(byBase['Citicoline']).toMatchObject({ doseInProduct: '500mg', adequatelyDosed: true });
    expect(byBase['Rhodiola Rosea'].name).toContain('3% rosavins');
    expect(byBase['Rhodiola Rosea']).toMatchObject({ doseInProduct: '500mg', adequatelyDosed: true });
    expect(byBase['L-Theanine']).toMatchObject({ doseInProduct: '200mg', adequatelyDosed: true });
    expect(byBase['Dynamine']).toMatchObject({ doseInProduct: '75mg', clinicalDose: '100-150mg/day', adequatelyDosed: false });
    expect(byBase['Theacrine']).toMatchObject({ doseInProduct: '50mg', clinicalDose: NO_REFERENCE_DOSE, adequatelyDosed: null });
    expect(dosingTally(p)).toEqual({ adequate: 4, total: 5 });
    expect(p.scoreBreakdown.dosing).toBe(8);
  });

  it('carries the 2026-10-19 Trustpilot read, the 90-day guarantee, and no vendorTerms or hands-on keys', () => {
    const p = record();
    expect(p.trustpilotScore).toBe(3.8);
    expect(p.trustpilotCount).toBe(2);
    expect(p.trustpilotCheckedAt).toBe('2026-10-19');
    expect(p.moneyBackDays).toBe(90);
    // No PASS-verified vendor-terms evidence exists for Deadline.
    expect(p.vendorTerms).toBeUndefined();
    // No product has been tested by the site (site-owner confirmation 2026-10-07).
    expect(Object.keys(p).filter((k) => /hands/i.test(k))).toEqual([]);
    expect(Object.keys(p).filter((k) => /^priceMonthly|^priceBasis$/.test(k))).toEqual([]);
    expect([p.updatedAt, p.verifiedAt]).toEqual(['2026-10-19', '2026-10-19']);
  });

  it('copy cites no on-page star rating, clinician marketing or testing claim', () => {
    const copy = JSON.stringify(record());
    for (const re of BANNED_COPY) expect(copy, re.source).not.toMatch(re);
  });

  it('copy states the stimulant load, the caution, the first-order guarantee terms and the dated shipping policy', () => {
    const p = record();
    const prose = [p.summary, p.whatItIs, p.howItWorks, p.whatToExpect, ...p.pros, ...p.cons].join(' ');
    expect(prose).toContain('about 137mg caffeine plus 75mg methylliberine and 50mg theacrine');
    expect(prose).toMatch(/not for pregnant or nursing women/);
    expect(prose).toContain("'Sensitive to caffeine? Start low.'");
    expect(prose).toContain('first order only (one bottle)');
    expect(prose).toContain('once per customer and household');
    expect(prose).toContain('https://deadline.co/policies/shipping-policy, checked 2026-10-19');
    expect(prose).toContain('current Good Manufacturing Practice (cGMP)');
    expect(prose).toContain('two reviews (3.8/5, checked 2026-10-19)');
  });

  it('ingredient pages list it under exactly the five ingredients it contains that have a page', () => {
    const listing = ingredients.filter((i) => i.productsContaining.includes(SLUG)).map((i) => i.slug).sort();
    expect(listing).toEqual(['caffeine', 'citicoline', 'dynamine', 'l-theanine', 'rhodiola-rosea']);
    // Theacrine has no ingredient page, so nothing to list it on.
    expect(ingredients.some((i) => /theacrine/i.test(i.slug))).toBe(false);
  });

  it("has the vendor's pack-shot, with its source page", () => {
    const image = productImage(ID);
    expect(image).toBeDefined();
    expect(image!.sourcePageUrl).toBe(PRODUCT_URL);
    expect(image!.fetchedAt).toBe('2026-10-19');
  });
});

describe('Deadline is absent outside the US host', () => {
  it.each(Object.keys(OUT_OF_SCOPE))('%s carries no Deadline record', (region) => {
    const list = OUT_OF_SCOPE[region];
    expect(list.length, `${region} catalogue is empty`).toBeGreaterThan(0);
    expect(list.some((p) => p.slug === SLUG || p.id === ID || p.brand === 'Deadline'), region).toBe(false);
  });
});
