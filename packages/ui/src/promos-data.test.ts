import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { allProductsUS, allProductsEU, allProductsCA, allProductsAU, allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA, isDiscontinued, purchaseUrl } from '@nootropic/data';
import { PROMO_HELD_REGIONS, PROMO_REGIONS, promoVendorDomains, validatePromoFile } from './promos';

const root = join(__dirname, '..', '..', '..');
const catalog = { us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU, jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA };
const directory = join(root, 'packages/data/promos');
describe('shipped promo data', () => {
  it.each(PROMO_REGIONS)('validates %s', (region) => expect(() => validatePromoFile(JSON.parse(readFileSync(join(directory, `${region}.json`), 'utf8')), { region, products: catalog[region] })).not.toThrow());
  it.each(PROMO_HELD_REGIONS)('does not ship held %s', (region) => expect(existsSync(join(directory, `${region}.json`))).toBe(false));
  it('contains exactly active region files', () => expect(readdirSync(directory).sort()).toEqual(PROMO_REGIONS.map((region) => `${region}.json`).sort()));
  it('matches purchase-link eligibility and finds vendor hosts', () => {
    for (const [region, products] of Object.entries(catalog)) {
      const domains = promoVendorDomains(products);
      for (const product of products) {
        const blocked = isDiscontinued(product) || purchaseUrl(product) === null;
        // A product the repo's own helpers treat as unbuyable contributes no host; a buyable one with a parsable link does.
        if (blocked) expect(promoVendorDomains([product]).size, `${region} ${product.slug}`).toBe(0);
      }
      if (region !== 'jp') expect(domains.size).toBeGreaterThan(0);
    }
  });
});
