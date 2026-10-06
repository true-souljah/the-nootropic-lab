import { describe, it, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  productsUS, productsEU, productsCA, productsAU,
  ingredients,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// UberNet / Performance Lab additions (2026-10-05): Performance Lab Caffeine 2
// and Pre Lab Pro, both sold through performancelab.com. They are carried in
// us/eu/ca/au only — the brand's shipping page covers those markets, while
// shipping to jp/latam/gcc/sea was not verified, so those catalogues
// deliberately omit both records.

const PRODUCT_PATH: Record<string, string> = {
  'performance-lab-caffeine-2-review': '/products/caffeine-2',
  'pre-lab-pro-review': '/products/pre-lab-pro',
};
const SLUGS = Object.keys(PRODUCT_PATH);

const IN_SCOPE: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
};
const RECOMMENDABLE: Record<string, Product[]> = {
  us: productsUS, eu: productsEU, ca: productsCA, au: productsAU,
};
const OUT_OF_SCOPE: Record<string, Product[]> = {
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

const cases = Object.keys(IN_SCOPE).flatMap((region) => SLUGS.map((slug) => [region, slug] as const));

function record(region: string, slug: string): Product {
  const p = IN_SCOPE[region].find((r) => r.slug === slug);
  if (!p) throw new Error(`${region}/${slug} missing`);
  return p;
}

describe('UberNet / Performance Lab records in us, eu, ca, au', () => {
  it('covers 2 slugs × 4 regions (guards against a silently empty case list)', () => {
    expect(cases).toHaveLength(8);
  });

  it.each(cases)('%s/%s exists, is live, and is a Performance Lab / UberNet record', (region, slug) => {
    const p = record(region, slug);
    expect(p.discontinued).toBeUndefined();
    expect(RECOMMENDABLE[region].some((r) => r.slug === slug)).toBe(true);
    expect(p.brand).toBe('Performance Lab');
    expect(p.affiliateNetwork).toBe('UberNet');
    expect(p.caffeineFree).toBe(false);
  });

  it.each(cases)('%s/%s affiliateUrl is a tracked performancelab.com product page', (region, slug) => {
    const url = new URL(record(region, slug).affiliateUrl);
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('www.performancelab.com');
    expect(url.pathname.startsWith('/products/')).toBe(true);
    expect(url.pathname).toBe(PRODUCT_PATH[slug]);
    expect(url.searchParams.get('a_aid')).toBe('zid0oxj1g4uny');
  });

  it.each(Object.keys(IN_SCOPE))('%s: Pre Lab Pro is a scoop powder, Caffeine 2 a capsule', (region) => {
    const plp = record(region, 'pre-lab-pro-review');
    expect(plp.form).toBe('powder');
    expect(plp.capsulesPerServing).toBe(1);
    expect(plp.servingsPerContainer).toBe(20);
    const c2 = record(region, 'performance-lab-caffeine-2-review');
    expect(c2.form).toBeUndefined();
    expect(c2.capsulesPerServing).toBe(1);
    expect(c2.servingsPerContainer).toBe(30);
  });

  it('CA records are Personal Importation Program (no licence found in the LNHPD on 2026-10-05)', () => {
    for (const slug of SLUGS) expect(record('ca', slug).npnStatus).toEqual({ status: 'pip' });
  });

  it('AU records carry no AUST L number (no ARTG entry found on 2026-10-05)', () => {
    for (const slug of SLUGS) expect(record('au', slug).austl).toBeUndefined();
  });

  it('no record claims hands-on testing or a non-USD price we have not verified', () => {
    for (const [region, slug] of cases) {
      const p = record(region, slug);
      expect(p.handsOnTested, `${region}/${slug}`).toBeUndefined();
      expect([p.priceMonthlyEUR, p.priceMonthlyCAD, p.priceMonthlyAUD, p.priceMonthlyJPY], `${region}/${slug}`)
        .toEqual([undefined, undefined, undefined, undefined]);
    }
  });

  it('caffeine, l-theanine and l-tyrosine ingredient pages list both records', () => {
    const heroSlugs = ['caffeine', 'l-theanine', 'l-tyrosine'];
    for (const ingredientSlug of heroSlugs) {
      const ingredient = ingredients.find((i) => i.slug === ingredientSlug);
      expect(ingredient, `ingredient ${ingredientSlug} missing`).toBeDefined();
      for (const slug of SLUGS) {
        expect(ingredient!.productsContaining, `${ingredientSlug} → ${slug}`).toContain(slug);
      }
    }
  });

  it('Pre Lab Pro has no electrolyte (salt) row in its dosing audit — the Dosing tab has no n/a state', () => {
    for (const region of Object.keys(IN_SCOPE)) {
      const names = record(region, 'pre-lab-pro-review').ingredientDosages.map((d) => d.name);
      expect(names.length, `${region} dosing rows`).toBeGreaterThan(0);
      expect(names.filter((n) => n.includes('Salt')), region).toEqual([]);
    }
  });
});

describe('UberNet / Performance Lab records are absent where shipping is unverified', () => {
  it.each(Object.keys(OUT_OF_SCOPE))('%s omits both slugs', (region) => {
    const list = OUT_OF_SCOPE[region];
    expect(list.length, `${region} catalogue is empty`).toBeGreaterThan(0);
    for (const slug of SLUGS) {
      expect(list.some((p) => p.slug === slug), `${region}/${slug}`).toBe(false);
    }
  });
});
