import { describe, it, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  productsUS, productsEU, productsCA, productsAU,
  ingredients,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// UberNet / Performance Lab additions: Performance Lab Caffeine 2 and Pre Lab
// Pro (2026-10-05), then Performance Lab Energy and Omega-3 (2026-10-06), all
// sold through performancelab.com. They are carried in us/eu/ca/au only — the
// brand's shipping page covers those markets, while shipping to
// jp/latam/gcc/sea was not verified, so those catalogues deliberately omit
// every one of these records.

const PRODUCT_PATH: Record<string, string> = {
  'performance-lab-caffeine-2-review': '/products/caffeine-2',
  'pre-lab-pro-review': '/products/pre-lab-pro',
  'performance-lab-energy-review': '/products/energy',
  'performance-lab-omega-3-review': '/products/omega-3',
};
const SLUGS = Object.keys(PRODUCT_PATH);

// Caffeine 2 and Pre Lab Pro contain caffeine; Energy and Omega-3 do not.
const CAFFEINE_FREE: Record<string, boolean> = {
  'performance-lab-caffeine-2-review': false,
  'pre-lab-pro-review': false,
  'performance-lab-energy-review': true,
  'performance-lab-omega-3-review': true,
};
const CAFFEINE_SLUGS = SLUGS.filter((slug) => !CAFFEINE_FREE[slug]);

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
  it('covers 4 slugs × 4 regions (guards against a silently empty case list)', () => {
    expect(cases).toHaveLength(16);
    expect(Object.keys(CAFFEINE_FREE).sort()).toEqual([...SLUGS].sort());
    expect(CAFFEINE_SLUGS).toHaveLength(2);
  });

  it.each(cases)('%s/%s exists, is live, and is a Performance Lab / UberNet record', (region, slug) => {
    const p = record(region, slug);
    expect(p.discontinued).toBeUndefined();
    expect(RECOMMENDABLE[region].some((r) => r.slug === slug)).toBe(true);
    expect(p.brand).toBe('Performance Lab');
    expect(p.affiliateNetwork).toBe('UberNet');
    expect(p.caffeineFree).toBe(CAFFEINE_FREE[slug]);
  });

  it.each(cases)('%s/%s affiliateUrl is a tracked performancelab.com product page', (region, slug) => {
    const url = new URL(record(region, slug).affiliateUrl);
    expect(url.protocol).toBe('https:');
    expect(url.hostname).toBe('www.performancelab.com');
    expect(url.pathname.startsWith('/products/')).toBe(true);
    expect(url.pathname).toBe(PRODUCT_PATH[slug]);
    expect(url.searchParams.get('a_aid')).toBe('zid0oxj1g4uny');
  });

  it.each(Object.keys(IN_SCOPE))('%s: Pre Lab Pro is a scoop powder, Caffeine 2 and Energy capsules, Omega-3 a softgel', (region) => {
    const plp = record(region, 'pre-lab-pro-review');
    expect(plp.form).toBe('powder');
    expect(plp.capsulesPerServing).toBe(1);
    expect(plp.servingsPerContainer).toBe(20);
    const c2 = record(region, 'performance-lab-caffeine-2-review');
    expect(c2.form).toBeUndefined();
    expect(c2.capsulesPerServing).toBe(1);
    expect(c2.servingsPerContainer).toBe(30);
    const energy = record(region, 'performance-lab-energy-review');
    expect(energy.form).toBeUndefined();
    expect(energy.capsulesPerServing).toBe(2);
    expect(energy.servingsPerContainer).toBe(30);
    const omega3 = record(region, 'performance-lab-omega-3-review');
    expect(omega3.form).toBe('softgel');
    expect(omega3.capsulesPerServing).toBe(3);
    expect(omega3.servingsPerContainer).toBe(30);
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

  it('caffeine, l-theanine and l-tyrosine ingredient pages list both caffeine records', () => {
    const heroSlugs = ['caffeine', 'l-theanine', 'l-tyrosine'];
    for (const ingredientSlug of heroSlugs) {
      const ingredient = ingredients.find((i) => i.slug === ingredientSlug);
      expect(ingredient, `ingredient ${ingredientSlug} missing`).toBeDefined();
      for (const slug of CAFFEINE_SLUGS) {
        expect(ingredient!.productsContaining, `${ingredientSlug} → ${slug}`).toContain(slug);
      }
    }
  });

  it('acetyl-l-carnitine lists Energy and dha-omega-3 lists Omega-3', () => {
    const alcar = ingredients.find((i) => i.slug === 'acetyl-l-carnitine');
    const dha = ingredients.find((i) => i.slug === 'dha-omega-3');
    expect(alcar, 'ingredient acetyl-l-carnitine missing').toBeDefined();
    expect(dha, 'ingredient dha-omega-3 missing').toBeDefined();
    expect(alcar!.productsContaining).toContain('performance-lab-energy-review');
    expect(dha!.productsContaining).toContain('performance-lab-omega-3-review');
  });

  it('Energy has no BioPerine (piperine) row in its dosing audit — an absorption cofactor, not an active', () => {
    for (const region of Object.keys(IN_SCOPE)) {
      const names = record(region, 'performance-lab-energy-review').ingredientDosages.map((d) => d.name);
      expect(names, `${region} dosing rows`).toHaveLength(5);
      expect(names.filter((n) => /bioperine|piperine|black pepper/i.test(n)), region).toEqual([]);
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
  it.each(Object.keys(OUT_OF_SCOPE))('%s omits all four slugs', (region) => {
    const list = OUT_OF_SCOPE[region];
    expect(list.length, `${region} catalogue is empty`).toBeGreaterThan(0);
    for (const slug of SLUGS) {
      expect(list.some((p) => p.slug === slug), `${region}/${slug}`).toBe(false);
    }
  });
});
