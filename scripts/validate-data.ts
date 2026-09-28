// Lightweight, dependency-free validation gate for product data.
// Fails (exit 1) on missing required fields, non-numeric score, or duplicate id within a region.
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, productsGCC, productsSEA,
  validateRegionalNotes, productRuleProblems,
} from '../packages/data/src/index';
import type { Product } from '../packages/data/src/index';

// Full lists: discontinued records still render a review page, so they are validated too.
const regions: Record<string, unknown[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: productsGCC, sea: productsSEA,
};

// Record rules (packages/data/src/product-rules.ts): affiliateUrl must be an
// absolute https product URL — no search pages, no bare homepages unless the
// record is discontinued — and the formula (ingredientDosages) must be non-empty.
//
// Records that violated a rule when it was introduced (2026-09-28) and have no
// verified replacement value yet. Each needs a verified product URL (or
// formula) before it can leave this list. The list can only shrink: a listed
// record that now passes fails the gate until its entry is deleted, and any
// violation not listed here fails the gate.
const KNOWN_RULE_VIOLATIONS: Readonly<Record<string, string>> = {
  'us/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'eu/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'ca/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'au/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'jp/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'latam/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'gcc/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'sea/mind-lab-pro-review': 'UberNet-tracked homepage link; deep-link attribution not confirmed',
  'us/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'eu/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'ca/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'au/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'jp/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'latam/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'gcc/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'sea/noocube-review': 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)',
  'us/thesis-nootropics-review': 'personalised subscription; no single product URL verified',
  'latam/thesis-nootropics-review': 'personalised subscription; no single product URL verified',
  'gcc/thesis-nootropics-review': 'personalised subscription; no single product URL verified',
  'sea/thesis-nootropics-review': 'personalised subscription; no single product URL verified',
  'us/nootropics-depot-lions-mane': 'record SKU (1:1 whole fruiting body) product URL not verified',
  'latam/nootropics-depot-lions-mane': 'record SKU (1:1 whole fruiting body) product URL not verified',
  'gcc/nootropics-depot-lions-mane': 'record SKU (1:1 whole fruiting body) product URL not verified',
  'sea/nootropics-depot-lions-mane': 'record SKU (1:1 whole fruiting body) product URL not verified',
  'us/trubrain-review': 'no product page URL verified (products.json only)',
  'eu/braineffect-focus-review': 'product page 404s; delisting pending operator confirmation',
  'eu/brainzyme-focus-pro-review': 'affiliate ref carried in the homepage fragment; product-page attribution not confirmed',
  'jp/suntory-dha-epa-sesamin-review': 'Amazon search link; official product page 403 to verification',
  'gcc/qualia-mind-review': 'GCC data owned by an open PR',
  'gcc/onnit-alpha-brain-review': 'GCC data owned by an open PR',
  'gcc/nahdi-brain-boost-review': 'GCC data owned by an open PR (record under removal)',
  'gcc/life-pharmacy-neuro-shield-review': 'GCC data owned by an open PR (record under removal)',
  'sea/qualia-mind-review': 'SEA data owned by an open PR',
  'sea/onnit-alpha-brain-review': 'SEA data owned by an open PR',
  'sea/blackmores-brain-active-review': 'SEA data owned by an open PR',
  'sea/natures-own-brain-fuel-review': 'SEA data owned by an open PR (record under removal)',
  'sea/supershrooms-focus-nootropic-review': 'SEA data owned by an open PR; empty affiliateUrl and formula',
};

let failed = 0;
for (const [region, products] of Object.entries(regions)) {
  if (!Array.isArray(products)) {
    console.error(`FAIL ${region}: export is not an array`);
    failed++;
    continue;
  }
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const item of products) {
    const p = item as Record<string, unknown>;
    for (const f of ['id', 'name', 'slug']) {
      if (typeof p[f] !== 'string' || (p[f] as string).length === 0) {
        console.error(`FAIL ${region}: product ${String(p.id ?? '?')} missing/empty "${f}"`);
        failed++;
      }
    }
    if (typeof p.score !== 'number') {
      console.error(`FAIL ${region}: product ${String(p.id ?? '?')} has non-numeric score`);
      failed++;
    }
    const id = String(p.id);
    if (ids.has(id)) {
      console.error(`FAIL ${region}: duplicate id "${id}"`);
      failed++;
    }
    ids.add(id);
    // Slug uniqueness: [slug]/page.tsx generateStaticParams maps products
    // by slug; a duplicate slug generates a colliding route + duplicate
    // sitemap/ItemList entry (audit OPT-4 — EU shipped braineffect twice).
    const slug = String(p.slug);
    if (slugs.has(slug)) {
      console.error(`FAIL ${region}: duplicate slug "${slug}"`);
      failed++;
    }
    slugs.add(slug);
  }
  console.log(`ok ${region}: ${products.length} products`);
}

const seenKeys = new Set<string>();
let grandfathered = 0;
for (const [region, products] of Object.entries(regions)) {
  for (const item of products as Product[]) {
    const key = `${region}/${item.slug}`;
    seenKeys.add(key);
    const problems = productRuleProblems(item);
    const known = KNOWN_RULE_VIOLATIONS[key];
    if (problems.length > 0 && known === undefined) {
      for (const problem of problems) console.error(`FAIL ${key}: ${problem}`);
      failed += problems.length;
    } else if (problems.length > 0) {
      grandfathered++;
    } else if (known !== undefined) {
      console.error(`FAIL ${key}: passes the record rules now — delete its KNOWN_RULE_VIOLATIONS entry`);
      failed++;
    }
  }
}
for (const key of Object.keys(KNOWN_RULE_VIOLATIONS)) {
  if (!seenKeys.has(key)) console.warn(`warn ${key}: KNOWN_RULE_VIOLATIONS entry has no record (removed?) — delete it`);
}
console.log(`ok record-rules: no new violations (${grandfathered} pre-existing, listed in KNOWN_RULE_VIOLATIONS)`);

// Regional notes (2026-09): every authored note must cite at least one
// primary source with an http(s) URL — a note without a source is treated
// as unverified content and fails the gate.
for (const problem of validateRegionalNotes()) {
  console.error(`FAIL regional-notes: ${problem}`);
  failed++;
}
console.log(`ok regional-notes: ${failed === 0 ? 'all authored notes cite sources' : 'see failures above'}`);

if (failed > 0) {
  console.error(`\n${failed} validation error(s).`);
  process.exit(1);
}
console.log('\nAll product data valid.');
