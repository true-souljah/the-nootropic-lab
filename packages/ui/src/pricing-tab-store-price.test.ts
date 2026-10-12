import { describe, test, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  getStrings, REGION_PROFILES, purchaseUrl,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';
import { PricingTab } from './templates/product-detail/PricingTab';
import { priceText } from './price-text';

// The Pricing tab shows one price: the store price, the vendor's own price on
// the store the region links to, attributed to that page and its check date.
// It used to also quote vendorTerms.oneTimePrice, which can come from another
// storefront or currency: AU Mind Lab Pro showed mindlabpro.com's
// "One-time purchase Price: $69.00" beside the AU store's AU$89.00, and
// LATAM/GCC Nootropics Depot quoted a different product's $29.99
// (site-owner policy 2026-10-09: a price shown is the linked store's own).
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const REGIONS: Record<keyof typeof REGION_PROFILES, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const en = getStrings('en');

function render(p: Product, region: keyof typeof REGION_PROFILES): string {
  const strings = { ...en, priceLocale: REGION_PROFILES[region].priceLocale };
  return renderToStaticMarkup(
    createElement(PricingTab, {
      product: p, disclosure: en.disclosure, strings: en.productDetail, noticeStrings: en.noPurchaseLink, price: priceText(p, strings),
    }),
  );
}

describe('Pricing tab price = the linked store price', () => {
  test('AU Mind Lab Pro: the AU store price with its source; no US-store quote beside it', () => {
    const mlp = allProductsAU.find((p) => p.slug === 'mind-lab-pro-review')!;
    const html = render(mlp, 'au');
    expect(html).not.toContain('data-vendor-term="oneTimePrice"');
    expect(html).not.toContain('One-time purchase Price: $69.00');
    expect(html).toMatch(/data-store-price-source[^>]*>Per <a href="https:\/\/au\.mindlabpro\.com\/products\/mind-lab-pro"/);
  });

  test('every record in every region: no one-time quote, and a priced record names its store and check date', () => {
    let priced = 0;
    for (const [region, products] of Object.entries(REGIONS) as [keyof typeof REGION_PROFILES, Product[]][]) {
      for (const p of products) {
        const html = render(p, region);
        expect(html, `${region}/${p.slug}`).not.toContain('data-vendor-term="oneTimePrice"');
        if (!p.storePrice) continue;
        priced++;
        const host = new URL(p.storePrice.url).hostname.replace(/^www\./, '');
        // The attribution element itself names the store and the check date.
        const source = /<p[^>]*data-store-price-source[^>]*>([\s\S]*?)<\/p>/.exec(html)?.[1] ?? '';
        expect(source, `${region}/${p.slug}`).toContain(host);
        expect(source, `${region}/${p.slug}`).toContain(`dateTime="${p.storePrice.checkedAt}"`);
      }
    }
    expect(priced).toBeGreaterThanOrEqual(40);
  });

  test('a non-English pack text keeps its language mark (EU Brainzyme, German)', () => {
    const bz = allProductsEU.find((p) => p.slug === 'brainzyme-focus-pro-review')!;
    expect(bz.storePrice?.lang).toBe('de');
    const html = render(bz, 'eu');
    expect(html).toContain('<span lang="de">1 MONAT: 2 Packs, 60 Kapseln</span>');
  });

  test('an edition that blocks the product names the store without linking it (JP Hunter Focus)', () => {
    const hunter = allProductsJP.find((p) => p.slug === 'hunter-focus-review')!;
    expect(purchaseUrl(hunter)).toBeNull();
    expect(hunter.storePrice).toBeTruthy();
    const html = render(hunter, 'jp');
    expect(html).toContain('data-store-price-source');
    expect(html).toContain('hunterevolve.com');
    expect(html).not.toContain(`href="${hunter.storePrice!.url}"`);
  });
});
