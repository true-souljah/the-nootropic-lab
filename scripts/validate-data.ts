// Lightweight, dependency-free validation gate for product data.
// Fails (exit 1) on missing required fields, a score that differs from
// computeScore(scoreBreakdown), or duplicate id within a region.
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  validateRegionalNotes, productRuleProblems, DOSING_ANCHORS, dosingAnchorProblems, computeScore,
} from '../packages/data/src/index';
import type { Pillar, Product } from '../packages/data/src/index';

// Full lists: discontinued records still render a review page, so they are validated too.
const regions: Record<string, unknown[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

// Record rules (packages/data/src/product-rules.ts): affiliateUrl must be an
// absolute https product URL — no search pages, no bare homepages unless the
// record is discontinued — and the formula (ingredientDosages) must be non-empty.
// `form`, when set, must be one of PRODUCT_FORMS (capsule | tablet | sachet | shot | powder | softgel);
// an unknown value fails the gate (formProblem, never grandfathered).
//
// Records that violated a rule when it was introduced (2026-09-28) and have no
// verified replacement value yet. Each needs a verified product URL (or
// formula) before it can leave this list. The list can only shrink: a listed
// record that now passes a listed rule fails the gate until that rule is
// removed from its entry, and any violation not listed here (including a
// second rule breaking on a listed record) fails the gate.
type RuleName = 'affiliateUrl' | 'ingredientDosages';
const KNOWN_RULE_VIOLATIONS: Readonly<Record<string, { rules: readonly RuleName[]; reason: string }>> = {
  'us/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'eu/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'ca/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'au/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'jp/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'latam/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'gcc/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'sea/mind-lab-pro-review': { rules: ['affiliateUrl'], reason: 'UberNet-tracked homepage link; deep-link attribution not confirmed' },
  'us/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'eu/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'ca/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'au/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'jp/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'latam/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'gcc/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'sea/noocube-review': { rules: ['affiliateUrl'], reason: 'no verified product URL (vendor verification 2026-09-28 only reached the homepage)' },
  'us/thesis-nootropics-review': { rules: ['affiliateUrl'], reason: 'personalised subscription; no single product URL verified' },
  'latam/thesis-nootropics-review': { rules: ['affiliateUrl'], reason: 'personalised subscription; no single product URL verified' },
  'gcc/thesis-nootropics-review': { rules: ['affiliateUrl'], reason: 'personalised subscription; no single product URL verified' },
  'sea/thesis-nootropics-review': { rules: ['affiliateUrl'], reason: 'personalised subscription; no single product URL verified' },
  'us/nootropics-depot-lions-mane': { rules: ['affiliateUrl'], reason: 'record SKU (1:1 whole fruiting body) product URL not verified' },
  'latam/nootropics-depot-lions-mane': { rules: ['affiliateUrl'], reason: 'record SKU (1:1 whole fruiting body) product URL not verified' },
  'gcc/nootropics-depot-lions-mane': { rules: ['affiliateUrl'], reason: 'record SKU (1:1 whole fruiting body) product URL not verified' },
  'sea/nootropics-depot-lions-mane': { rules: ['affiliateUrl'], reason: 'record SKU (1:1 whole fruiting body) product URL not verified' },
  'us/trubrain-review': { rules: ['affiliateUrl'], reason: 'no product page URL verified (products.json only)' },
  'eu/brainzyme-focus-pro-review': { rules: ['affiliateUrl'], reason: 'affiliate ref carried in the homepage fragment; product-page attribution not confirmed' },
  'jp/suntory-dha-epa-sesamin-review': { rules: ['affiliateUrl'], reason: 'Amazon search link; official product page 403 to verification' },
};

let failed = 0;
let scoreDrift = 0;
let scoreChecked = 0;
const unscored: string[] = [];
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
    // Composite score (2026-10-07): the stored score must equal
    // computeScore(scoreBreakdown) — the PILLAR_WEIGHTS-weighted sum the review
    // and methodology pages publish. `null` only when a pillar is missing.
    // Fix drift with `npm run recompute-scores`, never by hand-editing a score.
    const expectedScore = computeScore(p.scoreBreakdown as Partial<Record<Pillar, number | null>> | undefined);
    scoreChecked++;
    if (p.score !== expectedScore) {
      console.error(
        `FAIL ${region}: product ${String(p.id ?? '?')} score ${JSON.stringify(p.score)} !== computeScore(scoreBreakdown) ${JSON.stringify(expectedScore)} — run npm run recompute-scores`,
      );
      failed++;
      scoreDrift++;
    }
    if (expectedScore === null) unscored.push(`${region}/${String(p.slug)}`);
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
if (scoreChecked === 0) {
  console.error('FAIL scores: no product record was checked against computeScore');
  failed++;
} else if (scoreDrift === 0) {
  console.log(
    `ok scores: ${scoreChecked} records match computeScore(scoreBreakdown)` +
      (unscored.length > 0 ? ` (unscored, incomplete pillars: ${unscored.join(', ')})` : ''),
  );
} else {
  console.error(`FAIL scores: ${scoreDrift} of ${scoreChecked} records drift from computeScore(scoreBreakdown)`);
}

const seenKeys = new Set<string>();
let grandfathered = 0;
for (const [region, products] of Object.entries(regions)) {
  for (const item of products as Product[]) {
    const key = `${region}/${item.slug}`;
    seenKeys.add(key);
    const problems = productRuleProblems(item);
    const allowed = KNOWN_RULE_VIOLATIONS[key]?.rules ?? [];
    // Only the listed rule may fail for a listed record; any other violation is new.
    const unexpected = problems.filter((problem) => !allowed.some((rule) => problem.startsWith(rule)));
    for (const problem of unexpected) console.error(`FAIL ${key}: ${problem}`);
    failed += unexpected.length;
    for (const rule of allowed) {
      if (problems.some((problem) => problem.startsWith(rule))) {
        grandfathered++;
      } else {
        console.error(`FAIL ${key}: passes the ${rule} rule now — remove it from its KNOWN_RULE_VIOLATIONS entry`);
        failed++;
      }
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

// Dosing anchors (packages/data/src/dosing-anchors.ts, 2026-10-06): every
// ingredientDosages row matching a DOSING_ANCHORS entry (ALCAR, DHA) must carry
// the anchor's clinicalDose and an adequatelyDosed verdict derived from its
// minimum. No grandfather list. A scan that matches no row fails too, so a
// broken matcher cannot pass silently.
let anchoredRows = 0;
let anchorProblems = 0;
for (const [region, products] of Object.entries(regions)) {
  for (const item of products as Product[]) {
    const rows = Array.isArray(item.ingredientDosages) ? item.ingredientDosages : [];
    anchoredRows += rows.filter((row) => DOSING_ANCHORS.some((anchor) => anchor.match.test(row.name))).length;
    for (const problem of dosingAnchorProblems(item)) {
      console.error(`FAIL ${region}/${problem}`);
      anchorProblems++;
    }
  }
}
if (anchoredRows === 0) {
  console.error('FAIL dosing-anchors: no ingredientDosages row matched a DOSING_ANCHORS entry');
  anchorProblems++;
}
failed += anchorProblems;
if (anchorProblems === 0) {
  console.log(`ok dosing-anchors: ${anchoredRows} rows match their DOSING_ANCHORS clinicalDose and adequacy verdict`);
}

if (failed > 0) {
  console.error(`\n${failed} validation error(s).`);
  process.exit(1);
}
console.log('\nAll product data valid.');
