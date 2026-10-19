import { describe, it, expect } from 'vitest';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  productsUS, productsEU, productsCA, productsAU, productsGCC, productsSEA, productsJP,
  ingredients, earnsCommission, reviewDisclosureScope, licenceStatus,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Neutonic (2026-10-15): Productivity Drink on the US and EU hosts, Brain
// Capsules on the US host only (the capsule listings return 404 on the EU
// market). The EU drink and the US capsules link through Neutonic's own
// UpPromote affiliate programme (10% on new customers, 30-day tracking, per
// affiliates.neutonic.com). The US drink is a no-commission retail listing:
// its neutonic.com US page has no cart and sends buyers to Amazon, where
// UpPromote cannot track the sale, so it links the plain product page and
// carries "0%" (BACKLOG coop:neutonic-us-drink-amazon-only-2026-10-15).
//
// Wave 2 (2026-10-19, BACKLOG coop:neutonic-wave2-regions-2026-10-15):
// - CA: Canadian shoppers are served the US store (/en-us/), which with Canada
//   selected prices both US products in CAD and sells them through its own cart
//   (no Amazon button), so both CA records are tracked. Same SKUs as the US
//   records, so same slugs and formulas.
// - AU: the Australian store (/en-au/) sells a different can, the Smarter
//   Energy Drink (106mg caffeine per 330ml, six B vitamins in the ingredient
//   list), and the UK-label Brain Capsules (no bacoside standardisation
//   printed), so each is its own record and slug; both are tracked.
//
// Wave 2b (2026-10-19, same BACKLOG item):
// - GCC: the Middle East store (/en-me/, UAE + Saudi Arabia, AED) lists only
//   the UK-label Brain Capsules (its drink URLs return 404), so GCC carries that
//   one record, tracked. Its store price is the page's printed "Dhs. 320.00",
//   read as AED (vendor-price.ts maps the UAE "Dhs." mark; the page's JSON-LD
//   says AED 320.00, 2026-10-19).
// - SEA: Singapore and Malaysia are served the main GBP store, which sells the
//   330ml can (same formula as the US/EU/CA record) and the UK-label capsules;
//   both are tracked and carry the dated "no halal certificate shown" evidence.
//
// Wave 3 (2026-10-19, same BACKLOG item):
// - JP: Japan is served the main GBP store too (same two products and URLs as
//   SEA), so JP carries the 330ml drink and the UK-label capsules, both tracked,
//   as English records (Japanese copy on the JP host is paused). Both carry
//   ffcStatus notified: false (no CAA database row, full export scanned
//   2026-10-19) and no noPurchaseLink: every plant ingredient is on MHLW's
//   Attachment 2 (non-medicine) list and none is on Attachment 1 (medicine-only),
//   checked 2026-10-19 on the lists updated 2026-08-05.
// LATAM is still out of scope, so that catalogue omits every Neutonic slug.

const DRINK = 'neutonic-productivity-drink-review';
const CAPSULES = 'neutonic-brain-capsules-review';
const AU_DRINK = 'neutonic-smarter-energy-drink-review';
const UK_CAPSULES = 'neutonic-brain-capsules-uk-review';
const DRINKS = [DRINK, AU_DRINK];
const CAPSULE_SLUGS = [CAPSULES, UK_CAPSULES];

// The product page each region's affiliate link lands on.
const PRODUCT_PATH: Record<string, Record<string, string>> = {
  us: { [DRINK]: '/en-us/products/tropical-ice-12pk-us', [CAPSULES]: '/en-us/products/neutonic-capsules-us' },
  eu: { [DRINK]: '/products/tropical-ice-12pk' },
  ca: { [DRINK]: '/en-us/products/tropical-ice-12pk-us', [CAPSULES]: '/en-us/products/neutonic-capsules-us' },
  au: { [AU_DRINK]: '/en-au/products/productivity-drink-aus-trop', [UK_CAPSULES]: '/en-au/products/neutonic-capsules-uk' },
  gcc: { [UK_CAPSULES]: '/en-me/products/brain-capsules-uae' },
  sea: { [DRINK]: '/products/tropical-ice-12pk', [UK_CAPSULES]: '/products/neutonic-capsules-uk' },
  jp: { [DRINK]: '/products/tropical-ice-12pk', [UK_CAPSULES]: '/products/neutonic-capsules-uk' },
};
const SCA_REF = '11880392.89XMRS5MXxp';

const IN_SCOPE: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU, gcc: allProductsGCC, sea: allProductsSEA, jp: allProductsJP,
};
const RECOMMENDABLE: Record<string, Product[]> = {
  us: productsUS, eu: productsEU, ca: productsCA, au: productsAU, gcc: productsGCC, sea: productsSEA, jp: productsJP,
};
const OUT_OF_SCOPE: Record<string, Product[]> = { latam: allProductsLatam };

const cases = Object.entries(PRODUCT_PATH).flatMap(([region, paths]) => Object.keys(paths).map((slug) => [region, slug] as const));
// Records on the UpPromote link; the US drink is the no-commission one.
const tracked = cases.filter(([region, slug]) => !(region === 'us' && slug === DRINK));

function record(region: string, slug: string): Product {
  const p = IN_SCOPE[region].find((r) => r.slug === slug);
  if (!p) throw new Error(`${region}/${slug} missing`);
  return p;
}

describe('Neutonic records on the US, EU, CA, AU, GCC, SEA and JP hosts', () => {
  it('covers the drink in us + eu + ca + sea + jp, the US capsules in us + ca, the AU editions in au, and the UK-edition capsules in gcc + sea + jp (guards against a silently empty case list)', () => {
    expect(cases).toEqual([
      ['us', DRINK],
      ['us', CAPSULES],
      ['eu', DRINK],
      ['ca', DRINK],
      ['ca', CAPSULES],
      ['au', AU_DRINK],
      ['au', UK_CAPSULES],
      ['gcc', UK_CAPSULES],
      ['sea', DRINK],
      ['sea', UK_CAPSULES],
      ['jp', DRINK],
      ['jp', UK_CAPSULES],
    ]);
  });

  it('tracks every record except the US drink, the one untracked record', () => {
    expect(tracked).toEqual([
      ['us', CAPSULES],
      ['eu', DRINK],
      ['ca', DRINK],
      ['ca', CAPSULES],
      ['au', AU_DRINK],
      ['au', UK_CAPSULES],
      ['gcc', UK_CAPSULES],
      ['sea', DRINK],
      ['sea', UK_CAPSULES],
      ['jp', DRINK],
      ['jp', UK_CAPSULES],
    ]);
  });

  it.each(cases)('%s/%s exists, is live, and is a Neutonic record linking its neutonic.com product page', (region, slug) => {
    const p = record(region, slug);
    expect(p.discontinued).toBeUndefined();
    expect(p.noPurchaseLink).toBeUndefined();
    expect(RECOMMENDABLE[region].some((r) => r.slug === slug)).toBe(true);
    expect(p.brand).toBe('Neutonic');
    expect(p.caffeineFree).toBe(CAPSULE_SLUGS.includes(slug));
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

  it.each(cases.filter(([, slug]) => DRINKS.includes(slug)))('%s/%s: the drink is one can per serving, 12 cans a pack', (region, slug) => {
    const drink = record(region, slug);
    expect(drink.form).toBe('can');
    expect(drink.capsulesPerServing).toBe(1);
    expect(drink.servingsPerContainer).toBe(12);
  });

  it.each(cases.filter(([, slug]) => CAPSULE_SLUGS.includes(slug)))('%s/%s: the capsules are 3 capsules per serving, 30 servings a bottle', (region, slug) => {
    const caps = record(region, slug);
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
    // With Canada selected the US store prints a bare "$" and its structured
    // data says CAD (checked 2026-10-19); the AU store prints a bare "$" in AUD.
    expect(record('ca', DRINK).storePrice).toMatchObject({
      amount: 52, currency: 'CAD', text: '$52.00', url: 'https://www.neutonic.com/en-us/products/tropical-ice-12pk-us',
    });
    expect(record('ca', CAPSULES).storePrice).toMatchObject({
      amount: 72, currency: 'CAD', text: '$72.00', url: 'https://www.neutonic.com/en-us/products/neutonic-capsules-us',
    });
    expect(record('au', AU_DRINK).storePrice).toMatchObject({
      amount: 56.99, currency: 'AUD', text: '$56.99', url: 'https://www.neutonic.com/en-au/products/productivity-drink-aus-trop',
    });
    expect(record('au', UK_CAPSULES).storePrice).toMatchObject({
      amount: 92.99, currency: 'AUD', text: '$92.99', url: 'https://www.neutonic.com/en-au/products/neutonic-capsules-uk',
    });
    // Singapore and Malaysia are served the main store in GBP (checked 2026-10-19).
    // The drink page is the EU record's page too, priced in EUR with an EU country selected.
    expect(record('sea', DRINK).storePrice).toMatchObject({
      amount: 29.99, currency: 'GBP', text: '£29.99', url: 'https://www.neutonic.com/products/tropical-ice-12pk',
    });
    expect(record('sea', UK_CAPSULES).storePrice).toMatchObject({
      amount: 44.99, currency: 'GBP', text: '£44.99', url: 'https://www.neutonic.com/products/neutonic-capsules-uk',
    });
    // Japan is served the same main store in GBP (Shopify.country JP, Shopify.currency GBP, checked 2026-10-19).
    expect(record('jp', DRINK).storePrice).toMatchObject({
      amount: 29.99, currency: 'GBP', text: '£29.99', pack: 'Tropical Ice x 12 cans',
      url: 'https://www.neutonic.com/products/tropical-ice-12pk', checkedAt: '2026-10-19',
    });
    expect(record('jp', UK_CAPSULES).storePrice).toMatchObject({
      amount: 44.99, currency: 'GBP', text: '£44.99', pack: '90 Capsules',
      url: 'https://www.neutonic.com/products/neutonic-capsules-uk', checkedAt: '2026-10-19',
    });
    // The Middle East page prints "Dhs. 320.00" one-time (JSON-LD AED 320.00,
    // checked 2026-10-19); its "From Dhs. 272.00" subscription line is a "from"
    // price and is not stored.
    expect(record('gcc', UK_CAPSULES).storePrice).toMatchObject({
      amount: 320, currency: 'AED', text: 'Dhs. 320.00', pack: '90 Capsules',
      url: 'https://www.neutonic.com/en-me/products/brain-capsules-uae', checkedAt: '2026-10-19',
    });
  });

  it('SEA: both records show no halal certificate on the brand pages fetched on 2026-10-19; GCC carries no halal fields', () => {
    for (const slug of [DRINK, UK_CAPSULES]) {
      const p = record('sea', slug);
      expect(p.halalCertified, `sea/${slug}`).toBe(false);
      expect(p.halalCheckedAt, `sea/${slug}`).toBe('2026-10-19');
      expect(p.halalBasis, `sea/${slug}`).toMatch(/^No halal certificate or statement on neutonic\.com's product pages/);
      expect(licenceStatus(p, 'sea'), `sea/${slug}`).toMatchObject({
        key: 'noHalalChecked', label: 'No halal certificate shown by the brand (checked 2026-10-19)',
      });
    }
    const gcc = record('gcc', UK_CAPSULES);
    expect([gcc.halalCertified, gcc.halalCheckedAt, gcc.halalBasis]).toEqual([undefined, undefined, undefined]);
  });

  it('GCC and SEA: shipping evidence cites the store\'s own shipping page with its check date, and no regulator status is claimed', () => {
    expect(record('gcc', UK_CAPSULES).importPathway).toContain('https://www.neutonic.com/en-me/pages/shipping-returns, checked 2026-10-19');
    for (const slug of [DRINK, UK_CAPSULES]) {
      expect(record('sea', slug).importPathway, `sea/${slug}`).toContain('https://www.neutonic.com/pages/shipping-returns, checked 2026-10-19');
    }
    for (const [region, slug] of cases.filter(([r]) => r === 'gcc' || r === 'sea')) {
      const p = record(region, slug);
      const copy = [p.summary, p.whatItIs, p.whatToExpect, p.importPathway, p.regulatoryNote, ...p.pros, ...p.cons, ...[p.notes ?? []].flat()].join(' ');
      expect(copy, `${region}/${slug}`).not.toMatch(/\b(SFDA|MOHAP|BPOM|HSA|NPRA|BPJPH|JAKIM)\b/);
    }
  });

  it('JP: both records carry the 2026-10-19 CAA no-row result, no noPurchaseLink, the MHLW list check with both PDFs, and English copy only', () => {
    const JA = /[　-〿぀-ヿㇰ-ㇿ㐀-䶿一-鿿！-～｡-ﾟ]/;
    const strings = (v: unknown, path: string, out: { path: string; text: string }[] = []) => {
      if (typeof v === 'string') out.push({ path, text: v });
      else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
      return out;
    };
    for (const slug of [DRINK, UK_CAPSULES]) {
      const p = record('jp', slug);
      expect(p.ffcStatus, `jp/${slug}`).toEqual({
        notified: false,
        checkedAt: '2026-10-19',
        basis: 'no row for ニュートニック, Neutonic or Project Nootropic Ltd in the CAA database; full export (11,547 notifications) scanned 2026-10-19',
      });
      expect(licenceStatus(p, 'jp'), `jp/${slug}`).toMatchObject({
        key: 'noFfcChecked', label: 'No FFC notification found (checked 2026-10-19)',
      });
      // Every plant ingredient is on MHLW's Attachment 2 list and none on Attachment 1 (checked 2026-10-19).
      expect(p.noPurchaseLink, `jp/${slug}`).toBeUndefined();
      expect(p.regulatoryNote, `jp/${slug}`).toContain('Ministry of Health, Labour and Welfare (MHLW)');
      expect(p.regulatoryNote, `jp/${slug}`).toContain('https://www.mhlw.go.jp/content/001734637.pdf');
      expect(p.regulatoryNote, `jp/${slug}`).toContain('https://www.mhlw.go.jp/content/001734639.pdf');
      expect(p.regulatoryNote, `jp/${slug}`).toContain('Checked 2026-10-19');
      expect(p.regulatoryNote, `jp/${slug}`).toContain('Foods with Function Claims (FFC)');
      expect(p.regulatoryNote, `jp/${slug}`).toContain('Consumer Affairs Agency (CAA)');
      expect(p.importPathway, `jp/${slug}`).toContain('https://neutonic-support.gorgias.help/en-US/articles/shipping-delivery-434455, checked 2026-10-19');
      const copy = [p.summary, p.whatItIs, p.howItWorks, p.whatToExpect, p.importPathway, p.regulatoryNote, ...p.pros, ...p.cons, ...[p.notes ?? []].flat()].join(' ');
      // Only the ingredient-list check is reported, never a status for the product.
      expect(copy, `jp/${slug}`).not.toMatch(/\b(approved|legal|food-classified|permitted)\b/i);
      // Japanese copy is paused on the JP host: the katakana brand name searched in the CAA database is the only Japanese.
      const japanese = strings(p, `jp/${slug}`).filter((s) => JA.test(s.text)).map((s) => s.path);
      expect(japanese, `jp/${slug}`).toEqual([`jp/${slug}.ffcStatus.basis`]);
    }
    expect(record('jp', DRINK).regulatoryNote).toContain('Rhodiola rosea, Panax ginseng and caffeine each appear on Attachment 2 and none of them on Attachment 1; citicoline and L-theanine are named in neither list.');
    expect(record('jp', UK_CAPSULES).regulatoryNote).toContain('Ginkgo biloba, Bacopa monnieri, Rhodiola rosea and Panax ginseng each appear on Attachment 2 and none of them on Attachment 1; citicoline is named in neither list.');
  });

  it('CA: both records carry the 2026-10-19 LNHPD no-row result; AU: neither carries an AUST L number', () => {
    for (const slug of [DRINK, CAPSULES]) {
      expect(record('ca', slug).npnStatus, `ca/${slug}`).toMatchObject({ status: 'pip', checkedAt: '2026-10-19' });
      expect(record('ca', slug).npnStatus?.npn, `ca/${slug}`).toBeUndefined();
    }
    for (const slug of [AU_DRINK, UK_CAPSULES]) expect(record('au', slug).austl, `au/${slug}`).toBeUndefined();
  });

  it('AU: the drink ships from within AU (no import chip); the UK-edition capsules ship from the UK (personal importation)', () => {
    const drink = record('au', AU_DRINK);
    expect(drink.domesticSupply).toEqual({
      basis: "The Australian product page states 'This product ships from within AU' (https://www.neutonic.com/en-au/products/productivity-drink-aus-trop).",
      checkedAt: '2026-10-19',
    });
    expect(licenceStatus(drink, 'au')).toBeNull();
    const capsules = record('au', UK_CAPSULES);
    expect(capsules.domesticSupply).toBeUndefined();
    expect(licenceStatus(capsules, 'au')?.key).toBe('personalImportation');
  });

  it('AU drink: 106mg caffeine from green coffee bean extract, and only the six B vitamins its ingredient list names', () => {
    const rows = record('au', AU_DRINK).ingredientDosages;
    expect(rows.find((r) => /caffeine/i.test(r.name))).toMatchObject({ name: 'Natural Caffeine (from green coffee bean extract)', doseInProduct: '106mg' });
    const vitamins = rows.find((r) => /vitamin/i.test(r.name))!;
    expect(vitamins.name).toBe('B vitamins (B1, B2, B3, B6, B12, pantothenic acid)');
    // The panel says "8 B Vitamins", but the ingredient list has no folate or biotin.
    expect(vitamins.name).not.toMatch(/\b8\b|eight|folate|biotin/i);
  });

  it('AU UK-edition capsules: the bacopa row prints no standardisation, so its dose is not proven adequate', () => {
    const bacopa = record('au', UK_CAPSULES).ingredientDosages.find((r) => /bacopa/i.test(r.name))!;
    expect(bacopa).toMatchObject({ name: 'Bacopa Monnieri (whole plant extract)', doseInProduct: '300mg', adequatelyDosed: null });
    expect(bacopa.name).not.toMatch(/%|bacosid/i);
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
      citicoline: [DRINK, CAPSULES, AU_DRINK, UK_CAPSULES],
      'rhodiola-rosea': [DRINK, CAPSULES, AU_DRINK, UK_CAPSULES],
      caffeine: [DRINK, AU_DRINK],
      'l-theanine': [DRINK, AU_DRINK],
      'bacopa-monnieri': [CAPSULES, UK_CAPSULES],
      'ginkgo-biloba': [CAPSULES, UK_CAPSULES],
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

describe('Neutonic records are absent outside their hosts', () => {
  it('the EU catalogue omits Brain Capsules (not sold on the EU market, 404 on 2026-10-15)', () => {
    expect(allProductsEU.some((p) => p.slug === CAPSULES)).toBe(false);
  });

  it('the AU catalogue carries only the AU editions (its store sells neither US product)', () => {
    for (const slug of [DRINK, CAPSULES]) expect(allProductsAU.some((p) => p.slug === slug), `au/${slug}`).toBe(false);
  });

  it('the GCC catalogue carries only the UK-edition capsules (the Middle East store sells no drink, 404 on 2026-10-19)', () => {
    for (const slug of [DRINK, CAPSULES, AU_DRINK]) expect(allProductsGCC.some((p) => p.slug === slug), `gcc/${slug}`).toBe(false);
  });

  it('the SEA catalogue carries the 330ml drink and the UK-edition capsules, not the US-label capsules or the AU can', () => {
    for (const slug of [CAPSULES, AU_DRINK]) expect(allProductsSEA.some((p) => p.slug === slug), `sea/${slug}`).toBe(false);
  });

  it('the JP catalogue carries the 330ml drink and the UK-edition capsules, not the US-label capsules or the AU can', () => {
    for (const slug of [CAPSULES, AU_DRINK]) expect(allProductsJP.some((p) => p.slug === slug), `jp/${slug}`).toBe(false);
  });

  it.each(Object.keys(OUT_OF_SCOPE))('%s omits every Neutonic slug', (region) => {
    const list = OUT_OF_SCOPE[region];
    expect(list.length, `${region} catalogue is empty`).toBeGreaterThan(0);
    for (const slug of [DRINK, CAPSULES, AU_DRINK, UK_CAPSULES]) {
      expect(list.some((p) => p.slug === slug), `${region}/${slug}`).toBe(false);
    }
  });
});
