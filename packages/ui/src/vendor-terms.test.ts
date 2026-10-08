import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  vendorTermsProblems, VENDOR_TERM_FIELDS,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// Pricing-tab guards (site-owner decision 2026-10-07). The tab used to promise
// the same terms for every product ("Lowest available price", "Cancel
// anytime", "Free shipping", a one-time price invented as monthly × 1.15, a
// "Brand-direct guarantee"). It now quotes only what the vendor states on its
// own site: Product.vendorTerms, written by scripts/import-vendor-terms.ts
// from the PASS-verified quotes in packages/data/evidence/vendor-terms-2026-10/.
//
// Cross-package test placement: see product-schema.test.ts for the rationale.

const UI_SRC = __dirname;
const EVIDENCE_DIR = join(__dirname, '..', '..', 'data', 'evidence', 'vendor-terms-2026-10');

/** Evidence field name → vendorTerms key (the importer's mapping). */
const EVIDENCE_FIELD: Record<(typeof VENDOR_TERM_FIELDS)[number], string> = {
  shipping: 'shipping',
  cancellation: 'cancellation',
  oneTimePrice: 'oneTimePrice',
  guarantee: 'guaranteeDays',
};

const REGIONS: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

interface EvidenceField {
  value: unknown;
  quote?: string;
  url?: string;
  verify?: { status: string };
}
type EvidenceRecord = { id: string; slug: string; checkedAt: string } & Record<string, unknown>;

/** How each evidence file uses " | " (also read by scripts/import-vendor-terms.ts). */
const MANIFEST = JSON.parse(readFileSync(join(EVIDENCE_DIR, 'manifest.json'), 'utf8')) as {
  files: Record<string, { pipe: 'literal' | 'joins-fragments' }>;
};

/** Evidence records by "region/id", and the regions whose file joins page fragments with " | ". */
function loadEvidence(): { records: Map<string, EvidenceRecord>; joiningRegions: Set<string> } {
  const files = readdirSync(EVIDENCE_DIR).filter((f) => f.endsWith('.verified.json'));
  expect(Object.keys(MANIFEST.files).sort(), 'manifest.json lists every evidence file').toEqual([...files].sort());
  const records = new Map<string, EvidenceRecord>();
  const joiningRegions = new Set<string>();
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(EVIDENCE_DIR, file), 'utf8')) as Record<string, EvidenceRecord[]>;
    for (const [region, list] of Object.entries(data)) {
      if (MANIFEST.files[file].pipe === 'joins-fragments') joiningRegions.add(region);
      for (const record of list) records.set(`${region}/${record.id}`, record);
    }
  }
  return { records, joiningRegions };
}

const PASS = (field: unknown): field is EvidenceField & { quote: string; url: string } =>
  (field as EvidenceField | undefined)?.verify?.status === 'PASS';

describe('PricingTab — no fixed promises', () => {
  const src = readFileSync(join(UI_SRC, 'templates', 'product-detail', 'PricingTab.tsx'), 'utf8');

  test.each([
    'Lowest available price',
    'Cancel anytime',
    'Free shipping',
    'In-account, no email',
    '1.15',
    'Brand-direct guarantee',
  ])('PricingTab.tsx does not contain "%s"', (banned) => {
    expect(src).not.toContain(banned);
  });

  test('PricingTab.tsx renders vendorTerms and locale strings, with no English text nodes', () => {
    expect(src).toContain('p.vendorTerms');
    expect(src).toContain('strings.pricing');
    // JSX text between tags must come from uiStrings: a literal word here is
    // English on the ja / es pages.
    const literalText = src.match(/>\s*[A-Za-z][A-Za-z ,.'’&;-]{2,}\s*</g) ?? [];
    expect(literalText).toEqual([]);
  });

  test('ProductDetail passes the locale bundle to PricingTab', () => {
    const pd = readFileSync(join(UI_SRC, 'templates', 'ProductDetail.tsx'), 'utf8');
    expect(pd).toMatch(/<PricingTab[^>]*strings=\{pd\}/);
  });
});

describe('vendorTerms data — every quote is a PASS quote from the evidence files', () => {
  const { records: evidence, joiningRegions } = loadEvidence();
  const withTerms = Object.entries(REGIONS).flatMap(([region, products]) =>
    products.filter((p) => p.vendorTerms).map((p) => ({ region, p })),
  );

  test('the scan is non-empty (evidence and data both loaded)', () => {
    expect(evidence.size).toBeGreaterThanOrEqual(70);
    expect(withTerms.length).toBeGreaterThanOrEqual(60);
  });

  test('every vendorTerms term is the verbatim PASS quote and URL of its region/id evidence record', () => {
    const problems: string[] = [];
    for (const { region, p } of withTerms) {
      const key = `${region}/${p.id}`;
      const record = evidence.get(key);
      if (!record) {
        problems.push(`${key}: no evidence record`);
        continue;
      }
      if (record.slug !== p.slug) problems.push(`${key}: evidence slug ${record.slug} ≠ ${p.slug}`);
      if (record.checkedAt !== p.vendorTerms!.checkedAt) problems.push(`${key}: checkedAt differs from the evidence`);
      for (const field of VENDOR_TERM_FIELDS) {
        const term = p.vendorTerms![field];
        if (!term) continue;
        const source = record[EVIDENCE_FIELD[field]];
        if (!PASS(source)) problems.push(`${key}.${field}: evidence field is not PASS`);
        else if (source.quote !== term.text) problems.push(`${key}.${field}: text is not the verbatim evidence quote`);
        else if (source.url !== term.url) problems.push(`${key}.${field}: url differs from the evidence`);
        else {
          // " | " joins page fragments only in files the manifest marks so; elsewhere it is page text.
          const expected = joiningRegions.has(region) && source.quote.includes(' | ') ? source.quote.split(' | ') : undefined;
          if (JSON.stringify(term.fragments) !== JSON.stringify(expected)) {
            problems.push(`${key}.${field}: fragments ${JSON.stringify(term.fragments)} ≠ ${JSON.stringify(expected)}`);
          }
        }
      }
    }
    expect(problems).toEqual([]);
  });

  test('fragments exist only where the manifest says " | " joins page fragments', () => {
    const withFragments = withTerms.flatMap(({ region, p }) =>
      VENDOR_TERM_FIELDS.filter((f) => p.vendorTerms![f]?.fragments).map((f) => ({ region, f })),
    );
    expect(joiningRegions.size).toBeGreaterThan(0);
    expect(withFragments.length).toBeGreaterThan(0);
    expect(withFragments.filter(({ region }) => !joiningRegions.has(region))).toEqual([]);
    // Literal pipes on the vendor's own page stay inside one quote (US Mind Lab Pro shipping).
    const mlp = allProductsUS.find((p) => p.id === 'mind-lab-pro')!.vendorTerms!.shipping!;
    expect(mlp.text).toContain('($9.95 | FREE');
    expect(mlp.fragments).toBeUndefined();
  });

  test('every PASS evidence field is present in the data (nothing dropped)', () => {
    const missing: string[] = [];
    for (const [key, record] of evidence) {
      const [region, id] = key.split('/');
      const product = REGIONS[region]?.find((p) => p.id === id);
      if (!product) {
        missing.push(`${key}: no product record`);
        continue;
      }
      for (const field of VENDOR_TERM_FIELDS) {
        if (PASS(record[EVIDENCE_FIELD[field]]) && !product.vendorTerms?.[field]) missing.push(`${key}.${field}`);
      }
    }
    expect(missing).toEqual([]);
  });

  test('a quote in Japanese script is marked lang "ja", and only those', () => {
    const wrong: string[] = [];
    for (const { region, p } of withTerms) {
      for (const field of VENDOR_TERM_FIELDS) {
        const term = p.vendorTerms![field];
        if (!term) continue;
        const japanese = /[぀-ヿ一-鿿]/.test(term.text);
        if (japanese !== (term.lang === 'ja')) wrong.push(`${region}/${p.id}.${field}: lang ${term.lang}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  test('every record passes the vendorTerms rule', () => {
    const problems = withTerms.flatMap(({ region, p }) =>
      vendorTermsProblems(p.vendorTerms).map((problem) => `${region}/${p.id}: ${problem}`),
    );
    expect(problems).toEqual([]);
  });
});

describe('vendorTermsProblems (validate-data rule)', () => {
  const term = { text: 'Update or cancel anytime', url: 'https://www.mindlabpro.com/products/mind-lab-pro', lang: 'en' };

  test('absent and well-formed terms pass', () => {
    expect(vendorTermsProblems(undefined)).toEqual([]);
    expect(vendorTermsProblems({ checkedAt: '2026-10-07', cancellation: term })).toEqual([]);
  });

  test('checkedAt must be a real ISO date', () => {
    expect(vendorTermsProblems({ checkedAt: '2026-10-7', cancellation: term })[0]).toMatch(/^vendorTerms\.checkedAt/);
    expect(vendorTermsProblems({ checkedAt: '2026-02-30', cancellation: term })[0]).toMatch(/^vendorTerms\.checkedAt/);
    expect(vendorTermsProblems({ cancellation: term })[0]).toMatch(/^vendorTerms\.checkedAt/);
  });

  test('a term needs non-empty text, an https url and a two-letter lang', () => {
    expect(vendorTermsProblems({ checkedAt: '2026-10-07', shipping: { ...term, text: '  ' } })).toEqual([
      'vendorTerms.shipping.text is empty',
    ]);
    expect(vendorTermsProblems({ checkedAt: '2026-10-07', shipping: { ...term, url: 'http://example.com/x' } })[0]).toMatch(
      /^vendorTerms\.shipping\.url/,
    );
    expect(vendorTermsProblems({ checkedAt: '2026-10-07', shipping: { ...term, url: '/pages/shipping' } })[0]).toMatch(
      /^vendorTerms\.shipping\.url/,
    );
    expect(vendorTermsProblems({ checkedAt: '2026-10-07', shipping: { ...term, lang: 'english' } })[0]).toMatch(
      /^vendorTerms\.shipping\.lang/,
    );
  });

  test('fragments must join with " | " back to text', () => {
    const joined = { ...term, text: 'NO COMMITMENT | CANCEL ANYTIME' };
    expect(vendorTermsProblems({ checkedAt: '2026-10-07', cancellation: { ...joined, fragments: ['NO COMMITMENT', 'CANCEL ANYTIME'] } })).toEqual([]);
    for (const fragments of [['NO COMMITMENT'], ['NO COMMITMENT', 'CANCEL'], ['NO COMMITMENT', ' '], 'NO COMMITMENT']) {
      expect(vendorTermsProblems({ checkedAt: '2026-10-07', cancellation: { ...joined, fragments } })[0]).toMatch(
        /^vendorTerms\.cancellation\.fragments/,
      );
    }
  });

  test('unknown keys and an empty terms object fail', () => {
    expect(vendorTermsProblems({ checkedAt: '2026-10-07', shiping: term })).toContain(
      'vendorTerms has an unknown key "shiping" (allowed: checkedAt, shipping, cancellation, oneTimePrice, guarantee)',
    );
    expect(vendorTermsProblems({ checkedAt: '2026-10-07' })).toEqual(['vendorTerms has no terms (omit the key instead)']);
    expect(vendorTermsProblems(null)).toEqual(['vendorTerms is not an object']);
  });
});
