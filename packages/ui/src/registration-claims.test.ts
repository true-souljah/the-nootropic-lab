import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, extname, relative } from 'node:path';
import { euCountries, ingredients, monthlyStorePrice } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// No national product register (Health Canada NPN, SFDA/MOHAP, COFEPRIS,
// ANVISA, NPRA, BPOM, VFA, ...) was ever checked for the products we review;
// vendor research only looked for public alerts. Copy may therefore state
// only that we have not verified a local registration, never that a product
// "is not registered with" a regulator.

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.ts', '.tsx', '.json', '.md', '.mdx'].includes(extname(p))) out.push(p);
  }
  return out;
}

const DATA_DIR = resolve(REPO_ROOT, 'packages/data/src');
const NOTES_DIR = resolve(DATA_DIR, 'regional-notes');
const APPS_DIR = resolve(REPO_ROOT, 'apps');

const SOURCES = [
  ...readdirSync(DATA_DIR)
    .filter(n => /^products-.*\.json$/.test(n))
    .map(n => resolve(DATA_DIR, n)),
  ...readdirSync(NOTES_DIR)
    .filter(n => n.endsWith('.ts'))
    .map(n => resolve(NOTES_DIR, n)),
  // Source of the regional licence-status badge labels.
  resolve(DATA_DIR, 'regional.ts'),
  ...readdirSync(APPS_DIR)
    .map(n => resolve(APPS_DIR, n, 'src'))
    .filter(p => existsSync(p))
    .flatMap(p => walk(p)),
];

const UNSOURCED_NEGATIVE: RegExp[] = [
  /not (currently )?registered with/i,
  /not registered with any/i,
  // Hyphenated / abbreviated forms, e.g. "Not SFDA/MOHAP-registered",
  // "Not Health Canada NPN-registered", "Not HSA/NPRA registered".
  /\bnot\b[^.]{0,40}\b(SFDA|MOHAP|HSA|NPRA|BPOM|VFA|COFEPRIS|ANVISA|ANMAT|INVIMA|DIGEMID|NPN|Health Canada)\b[^.]{0,30}\b(registered|licensed)\b/i,
  /not formally registered/i,
  /not been (formally )?registered/i,
  // AU (ARTG) and JP (CAA FFC database) were queried directly on 2026-10-06,
  // but a register search that returns no row proves only that those queries
  // returned nothing on that date. Copy must say so ("no ARTG entry returned
  // for ... (searched 2026-10-06)", "no FFC notification found ... (export
  // scanned 2026-10-06)"), never assert absence from the register.
  /not TGA-listed/i,
  /not (TGA|Therapeutic Goods Administration( \(TGA\))?)[- ]registered/i,
  /Not on the Australian Register/i,
  /not FFC-notified/i,
  /Not currently a notified/i,
  /not notified (as|under)/i,
  // CA: Health Canada's LNHPD and canada.ca were checked on 2026-10-07.
  // Health Canada defines natural health products by substance and requires
  // a product licence; we found no source for it "classifying" a given
  // product, GUI-0116 says "personal importation" and never "PIP", and no
  // retailer stocking claim (Health Canada-authorised retailers, GNC Canada,
  // Amazon.ca) for Alpha Brain was confirmed: Onnit's site says it "is
  // directed only to U.S. consumers" and amazon.ca's first results page
  // showed no Onnit listing.
  /Health Canada classifies/i,
  /Health Canada-authori[sz]ed retailers/i,
  /Personal import \(PIP\)/,
  /reliably on Amazon\.ca/i,
  /sometimes available at GNC/i,
  /occasionally stocked at GNC/i,
  // A no-row LNHPD result covers only the names searched: it cannot show that
  // a product reaches Canada only by personal importation (NatureBell, for
  // one, is listed on amazon.ca). Copy says "look for an eight-digit NPN on
  // the label; without one, a consumer's only route is personal importation".
  /reaches Canadian buyers (only )?by personal importation/i,
  /import(s)? it for personal use/i,
];

describe('no copy asserts a product is not registered with a regulator', () => {
  test('scanned a non-empty file set', () => {
    expect(SOURCES.length).toBeGreaterThan(100);
    expect(SOURCES.some(f => /products-sea\.json$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /regional-notes\/sea\.ts$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /products-au\.json$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /products-jp\.json$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /products-ca\.json$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /apps\/ca\/src\/app\/alpha-brain-canada\/page\.tsx$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /apps\/ca\/src\/app\/best-nootropics-for-studying\/page\.tsx$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /apps\/au\/src\/app\/tga-listed-cognitive-supplements\/page\.tsx$/.test(f))).toBe(true);
    expect(SOURCES.some(f => /apps\/jp\/src\/app\/japanese-brain-supplements\/page\.tsx$/.test(f))).toBe(true);
    expect(SOURCES.every(f => existsSync(f))).toBe(true);
  });

  test('no product data, regional note or app source uses the unsourced negative', () => {
    const hits = SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        UNSOURCED_NEGATIVE.some(re => re.test(line)) ? [`${file.slice(REPO_ROOT.length + 1)}:${i + 1}`] : [],
      );
    });
    expect(hits).toEqual([]);
  });
});

// Halal (2026-10-07). `halalCertified: false` was hand-set on the SEA records
// in the 2026-06 import with no per-product evidence, and nothing in the code
// ranks, sorts or filters by halal status. Copy may say only what the brand's
// own pages showed on the check date ("no halal certificate shown by the
// brand"), never that a product is not BPJPH/JAKIM-certified, and must not
// claim halal-weighted rankings.
const HALAL_SOURCES = [
  ...walk(DATA_DIR),
  ...walk(resolve(APPS_DIR, 'sea', 'src')),
  ...walk(resolve(APPS_DIR, 'gcc', 'src')),
];

const HALAL_UNSOURCED: RegExp[] = [
  // The old SEA licence-status chip label. Case-sensitive: sourced findings
  // such as "no halal certification are shown on the page (…, checked …)"
  // stay allowed.
  /No halal certification\b/,
  /not BPJPH\/JAKIM-certified/i,
  // Variants: "Not BPJPH/JAKIM halal-certified", "Not halal-certified by
  // JAKIM/BPJPH", "do not carry BPJPH or JAKIM halal certification".
  /\bnot\b[^.]{0,20}\b(BPJPH|JAKIM)\b[^.]{0,20}\bcertified\b/i,
  /not halal-certified by (JAKIM|BPJPH)/i,
  /\b(do(es)? not|none of [^.]{0,100}) carry (BPJPH|JAKIM)\b/i,
  /weight(s|ed)? Halal-certified products higher/i,
  // Round 2 (2026-10-07 brand-page check): absolute negatives and capsule
  // claims no brand page supports, and a host that does not exist (NXDOMAIN).
  /not (currently |formally )?halal[- ]certified/i,
  /carry formal halal certification/i,
  /typically gelatin/i,
  /verify\.halal\.gov\.my/i,
  // Round 3 (2026-10-07, p5/halal-evidence.json): no religious-compliance
  // verdict on an ingredient, capsule or product ("halal-compliant", "always
  // halal"); copy states the sourcing fact and whether a certificate is shown.
  // Rankings are hand-set and never adjusted for halal or porcine status.
  /halal-compliant/i,
  /always halal/i,
  /porcine-free (formulations|options)/i,
  // "Halal-friendly" / "halal-neutral" labels assert the same judgement, and
  // caffeine status is shown per product (caffeineFree chip) but never feeds
  // the hand-set scores or ranks.
  /Halal-friendly/i,
  /halal-neutral/i,
  /(caffeine|stimulant)-free (options |formulations )?prioritised/i,
  /prioriti[sz]e caffeine-free/i,
];

describe('no copy asserts a product is not halal-certified or that rankings weight halal status', () => {
  test('scanned a non-empty file set', () => {
    expect(HALAL_SOURCES.length).toBeGreaterThan(100);
    expect(HALAL_SOURCES.some(f => /packages\/data\/src\/regional\.ts$/.test(f))).toBe(true);
    expect(HALAL_SOURCES.some(f => /packages\/data\/src\/products-sea\.json$/.test(f))).toBe(true);
    expect(HALAL_SOURCES.some(f => /apps\/sea\/src\/app\/halal-nootropics-indonesia-bpjph\/page\.tsx$/.test(f))).toBe(true);
    expect(HALAL_SOURCES.some(f => /apps\/sea\/src\/app\/best-nootropics-for-focus\/page\.tsx$/.test(f))).toBe(true);
    expect(HALAL_SOURCES.some(f => /apps\/gcc\/src\/app\/halal-certified-nootropics\/page\.tsx$/.test(f))).toBe(true);
    expect(HALAL_SOURCES.some(f => /apps\/gcc\/src\/app\/best-nootropics-for-aging\/page\.tsx$/.test(f))).toBe(true);
    expect(HALAL_SOURCES.some(f => /apps\/gcc\/src\/app\/page\.tsx$/.test(f))).toBe(true);
  });

  test('no data or SEA/GCC app source uses the unsourced halal negative or the ranking claim', () => {
    const hits = HALAL_SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        HALAL_UNSOURCED.some(re => re.test(line)) ? [`${file.slice(REPO_ROOT.length + 1)}:${i + 1}`] : [],
      );
    });
    expect(hits).toEqual([]);
  });
});

// AU legal statements (2026-10-08, research p5/au-permissible-ingredients.json).
// The Therapeutic Goods (Permissible Ingredients) Determination (No. 2) 2026
// (F2026L00707, as compiled 17 September 2026) lists phosphatidylserine as
// soy phosphatidylserine-enriched soy lecithin (Schedule 1 items 4689/4690),
// so copy calling an ingredient "not a permitted ingredient" must name the
// Schedule 1 item it rests on. Huperzine A copy states the name-level search
// results (not found in Schedule 1; no huperz* entry in the Poisons Standard)
// instead of guessing that it "may attract TGA scrutiny". The June 2026
// Poisons Standard (F2026L00633) was repealed by the October 2026 instrument
// (F2026L01327), so the old instrument must not be cited as current.
const AU_LEGAL_SOURCES = [
  ...walk(resolve(APPS_DIR, 'au', 'src')),
  ...walk(DATA_DIR),
];

const NOT_PERMITTED = /not a permitted ingredient/i;
// A concrete Schedule 1 item reference ("item 4689", "items 4689 and 4690");
// the bare word "item(s)" ("see other items") does not count.
const SCHEDULE_ITEM_REF = /\bitems? \d{2,5}\b/i;
const unsourcedNotPermitted = (line: string): boolean =>
  NOT_PERMITTED.test(line) && !SCHEDULE_ITEM_REF.test(line);

const AU_LEGAL_UNSOURCED: RegExp[] = [
  /may (attract|require) (Therapeutic Goods Administration \()?TGA\)? (scrutiny|oversight)/i,
  /F2026L00633/,
];

describe('AU legal statements follow the Permissible Ingredients Determination and the current Poisons Standard', () => {
  test('scanned a non-empty file set', () => {
    expect(AU_LEGAL_SOURCES.length).toBeGreaterThan(50);
    expect(AU_LEGAL_SOURCES.some(f => /packages\/data\/src\/products-au\.json$/.test(f))).toBe(true);
    expect(AU_LEGAL_SOURCES.some(f => /packages\/data\/src\/regional-notes\/au\.ts$/.test(f))).toBe(true);
    expect(AU_LEGAL_SOURCES.some(f => /apps\/au\/src\/app\/tga-listed-cognitive-supplements\/page\.tsx$/.test(f))).toBe(true);
    expect(AU_LEGAL_SOURCES.some(f => /apps\/au\/src\/app\/best-nootropics-for-memory\/page\.tsx$/.test(f))).toBe(true);
    expect(AU_LEGAL_SOURCES.some(f => /apps\/au\/src\/app\/best-nootropics-for-aging\/page\.tsx$/.test(f))).toBe(true);
    expect(AU_LEGAL_SOURCES.some(f => /apps\/au\/src\/app\/best-nootropics-for-focus\/page\.tsx$/.test(f))).toBe(true);
    expect(AU_LEGAL_SOURCES.every(f => existsSync(f))).toBe(true);
  });

  test('the Schedule 1 item exception needs a numbered item, not the bare word', () => {
    expect(unsourcedNotPermitted('X is not a permitted ingredient; see other items.')).toBe(true);
    expect(unsourcedNotPermitted('X is not a permitted ingredient in listed medicines.')).toBe(true);
    expect(unsourcedNotPermitted('X is not a permitted ingredient except as Schedule 1 item 4689.')).toBe(false);
    expect(unsourcedNotPermitted('X is not a permitted ingredient except as items 4689 and 4690.')).toBe(false);
  });

  test('"not a permitted ingredient" appears only on a line that names its Schedule 1 item', () => {
    const hits = AU_LEGAL_SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        unsourcedNotPermitted(line) ? [`${file.slice(REPO_ROOT.length + 1)}:${i + 1}`] : [],
      );
    });
    expect(hits).toEqual([]);
  });

  test('no "may attract TGA scrutiny" speculation and no citation of the repealed June 2026 Poisons Standard', () => {
    const hits = AU_LEGAL_SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        AU_LEGAL_UNSOURCED.some(re => re.test(line)) ? [`${file.slice(REPO_ROOT.length + 1)}:${i + 1}`] : [],
      );
    });
    expect(hits).toEqual([]);
  });
});

// Round ten (2026-10-08, research p5/ca-monographs-and-leftovers.json).
// - Health Canada's NHPID monographs: the Phosphatidylserine monograph's only
//   use is "Helps support cognitive/brain health/function" (no memory or
//   older-adult claim); the Ginkgo monograph sets "80 - 240 milligrams of
//   extract, per day" (no 120 mg dose). Copy quotes the monograph instead of
//   saying an "NPN monograph recognises" an ingredient.
// - HSA does not subject health supplements to approvals or licensing for
//   import; its 3-months' supply rule is on the personal-medications page,
//   and no supplement quantity rule was found on HSA or SFA pages.
// - mindlabpro.com's terms name Performance Lab Group Ltd; Opti-Nutra appears
//   only in the brand's 2018 blog posts. The `brand` field is a label, not a
//   maker claim, so `"brand":` lines are not scanned. (Round twelve changed
//   Mind Lab Pro's `brand` from "Opti-Nutra" to "Performance Lab"; see below.)
// - Performance Lab's EU prices are on eu.performancelab.com.
const ROUND_TEN_SOURCES = [
  ...walk(DATA_DIR),
  ...walk(resolve(APPS_DIR, 'ca', 'src')),
  ...walk(resolve(APPS_DIR, 'sea', 'src')),
];

const ROUND_TEN_UNSOURCED: RegExp[] = [
  /made by Opti-Nutra/i,
  /up to 3 months supply/i,
  /HSA allows personal import/i,
  /NPN monograph (also )?recognises/i,
  // The other phrasings of the same monograph claim (plural, "approval",
  // "has an NPN monograph for <dose>").
  /NPN[- ]monographs recognise|NPN[- ]monograph approval|has an NPN monograph for/i,
  /Euro price not confirmed/i,
];

const BRAND_FIELD_LINE = /^\s*"brand"\s*:/;

describe('round ten: monograph, Singapore import, Mind Lab Pro maker and EU price wording follow the sources', () => {
  test('scanned a non-empty file set', () => {
    expect(ROUND_TEN_SOURCES.length).toBeGreaterThan(100);
    expect(ROUND_TEN_SOURCES.some(f => /packages\/data\/src\/products-eu\.json$/.test(f))).toBe(true);
    expect(ROUND_TEN_SOURCES.some(f => /packages\/data\/src\/products-us\.json$/.test(f))).toBe(true);
    expect(ROUND_TEN_SOURCES.some(f => /packages\/data\/src\/sea-countries\.ts$/.test(f))).toBe(true);
    expect(ROUND_TEN_SOURCES.some(f => /apps\/ca\/src\/app\/best-nootropics-for-aging\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TEN_SOURCES.some(f => /apps\/ca\/src\/app\/best-nootropics-for-memory\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TEN_SOURCES.some(f => /apps\/sea\/src\/app\/best-nootropics\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TEN_SOURCES.every(f => existsSync(f))).toBe(true);
  });

  test('the brand-field exemption covers only `"brand":` lines', () => {
    // Sample line updated in round twelve: no record carries "Opti-Nutra" as
    // its brand any more (Mind Lab Pro's brand is "Performance Lab").
    expect(BRAND_FIELD_LINE.test('    "brand": "Performance Lab",')).toBe(true);
    expect(BRAND_FIELD_LINE.test('    "whatItIs": "Mind Lab Pro is made by Opti-Nutra."')).toBe(false);
  });

  test('no data, CA or SEA source uses the unsourced wording', () => {
    const hits = ROUND_TEN_SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        !BRAND_FIELD_LINE.test(line) && ROUND_TEN_UNSOURCED.some(re => re.test(line))
          ? [`${relative(REPO_ROOT, file)}:${i + 1}`]
          : [],
      );
    });
    expect(hits).toEqual([]);
  });
});

// Round eleven (2026-10-09, research p5/ca-lnhpd.json Task C and
// p5/ca-monographs-and-leftovers.json; CBSA page fetched 2026-10-09).
// - Only amazon.ca's first results page was checked for Alpha Brain;
//   walmart.ca and gnc.ca never were.
// - Health Canada publishes NHPID monographs for phosphatidylserine and
//   Ginkgo; "recognised" is not its wording.
// - No source supports "all products we recommend use Health Canada-
//   permissible / Santé Canada-authorised ingredients".
// - The CBSA courier thresholds are $40 (duty and tax) and $150 (duty) for
//   US/Mexico shipments; "under CAD $150 … typically enter duty-free" left
//   out taxes and the mail channel. Copy quotes the CBSA page instead.
const ROUND_ELEVEN_SOURCES = walk(resolve(APPS_DIR, 'ca', 'src'));

const ROUND_ELEVEN_UNSOURCED: RegExp[] = [
  /Health Canada[- ]recogni[sz]ed/i,
  /Health Canada-permissible ingredients/i,
  /ingrédients autorisés par Santé Canada/i,
  /typically enter duty-free/i,
  /We searched .{0,60}walmart/i,
];

describe('round eleven: Canada retailer, recognition, ingredient and duty wording follow the sources', () => {
  test('scanned a non-empty file set', () => {
    expect(ROUND_ELEVEN_SOURCES.length).toBeGreaterThan(20);
    expect(ROUND_ELEVEN_SOURCES.some(f => /apps\/ca\/src\/app\/alpha-brain-canada\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_ELEVEN_SOURCES.some(f => /apps\/ca\/src\/app\/fr\/meilleurs-nootropiques\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_ELEVEN_SOURCES.some(f => /apps\/ca\/src\/app\/provinces\/\[province\]\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_ELEVEN_SOURCES.every(f => existsSync(f))).toBe(true);
  });

  test('the patterns catch the removed wording', () => {
    const removed = [
      'PS + Ginkgo Health Canada-recognised',
      'All products we recommend use Health Canada-permissible ingredients.',
      'Tous les produits que nous recommandons utilisent des ingrédients autorisés par Santé Canada.',
      'Orders under CAD $150 from the US typically enter duty-free under CUSMA/USMCA.',
      'We searched amazon.ca, walmart.ca and gnc.ca and could not confirm any Canadian retailer stocking Alpha',
    ];
    for (const s of removed) expect(ROUND_ELEVEN_UNSOURCED.some(re => re.test(s))).toBe(true);
  });

  test('no CA source uses the unsourced wording', () => {
    const hits = ROUND_ELEVEN_SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        ROUND_ELEVEN_UNSOURCED.some(re => re.test(line)) ? [`${relative(REPO_ROOT, file)}:${i + 1}`] : [],
      );
    });
    expect(hits).toEqual([]);
  });
});

// Round twelve (2026-10-09, research p5/round12-evidence.json).
// - canada.ca never says the NPN review "confirms three things". The
//   product-licensing page says the licence number "assures consumers that the
//   product has been reviewed and approved by Health Canada for safety and
//   efficacy"; quality appears in the regulations' stated goal and on the
//   site-licensing (good manufacturing practice) page. Copy quotes those pages.
// - "Most structured ... frameworks" (HSA / NPRA) was a judgement with no source.
// - Mind Lab Pro's shipping page gives rest-of-world times from its UK depot
//   ("Airmail expected delivery time: 5 - 20 working days", "DHL expected
//   delivery time: 2 - 7 working days") and no Singapore time, so the
//   "Opti-Nutra website ... approximately 7 business days" line had no source.
// - Nobody checked other sellers of Mind Lab Pro, so copy says where it is
//   sold (mindlabpro.com), never "only via".
// - Companies House: OPTI-NUTRA LTD (13 Feb 2015 - 09 Dec 2022) is a former
//   name of PERFORMANCE LAB LTD (09439153), so no record keeps "Opti-Nutra" as
//   its brand; Mind Lab Pro's brand is "Performance Lab" in every region.
const ROUND_TWELVE_SOURCES = [
  ...walk(DATA_DIR),
  ...readdirSync(APPS_DIR)
    .map(n => resolve(APPS_DIR, n, 'src'))
    .filter(p => existsSync(p))
    .flatMap(p => walk(p)),
];

const ROUND_TWELVE_UNSOURCED: RegExp[] = [
  /most structured (supplement |personal-import )?(import )?frameworks/i,
  /Opti-Nutra website/i,
  /approximately 7 business days/i,
  /NPN review confirms/i,
  /only via mindlabpro/i,
  // U6 (same round): no sales, popularity or delivery-reliability data and no
  // source ranking SEA regulators exist, so these claims are dropped.
  /top-selling premium nootropic/i,
  /Popular in Singapore/i,
  /most restrictive/i,
  /Ships UK→Canada reliably/i,
];

const PRODUCT_FILES = readdirSync(DATA_DIR)
  .filter(n => /^products-.*\.json$/.test(n))
  .map(n => resolve(DATA_DIR, n));

describe('round twelve: NPN review, SEA framework, Mind Lab Pro delivery, seller and brand follow the sources', () => {
  test('scanned a non-empty file set', () => {
    expect(ROUND_TWELVE_SOURCES.length).toBeGreaterThan(100);
    expect(ROUND_TWELVE_SOURCES.some(f => /apps\/ca\/src\/app\/npn-licensed-nootropics-canada\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TWELVE_SOURCES.some(f => /apps\/ca\/src\/app\/aor-ortho-mind-vs-mind-lab-pro\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TWELVE_SOURCES.some(f => /apps\/sea\/src\/app\/best-nootropics\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TWELVE_SOURCES.some(f => /packages\/data\/src\/products-sea\.json$/.test(f))).toBe(true);
    expect(ROUND_TWELVE_SOURCES.some(f => /apps\/sea\/src\/app\/about\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TWELVE_SOURCES.some(f => /apps\/ca\/src\/app\/best-nootropics-for-aging\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_TWELVE_SOURCES.every(f => existsSync(f))).toBe(true);
  });

  test('the patterns catch the removed wording', () => {
    const removed = [
      "Singapore's Health Sciences Authority (HSA) and Malaysia's NPRA have the most structured supplement import frameworks.",
      'Singapore (HSA) and Malaysia (NPRA) have the most structured personal-import frameworks.',
      'It is frequently ordered directly from the Opti-Nutra website',
      'with delivery to Singapore addresses in approximately 7 business days.',
      'Health Canada&apos;s NPN review confirms three things:',
      'Mind Lab Pro: only via mindlabpro.com (shipping to Canada',
      'The most comprehensively researched nootropic stack on the market and the top-selling premium nootropic among Singapore buyers.',
      'Popular in Singapore',
      'Popular in Singapore for lab transparency',
      "{ q: 'Is Mind Lab Pro popular in Singapore?'",
      'Indonesia (BPOM) is the most restrictive.',
      'Most restrictive market for',
      'Ships UK→Canada reliably.',
    ];
    for (const s of removed) expect(ROUND_TWELVE_UNSOURCED.some(re => re.test(s)), s).toBe(true);
  });

  test('no data or app source uses the unsourced wording', () => {
    const hits = ROUND_TWELVE_SOURCES.flatMap(file => {
      const lines = readFileSync(file, 'utf8').split('\n');
      return lines.flatMap((line, i) =>
        ROUND_TWELVE_UNSOURCED.some(re => re.test(line)) ? [`${relative(REPO_ROOT, file)}:${i + 1}`] : [],
      );
    });
    expect(hits).toEqual([]);
  });

  test('no product record has "Opti-Nutra" as its brand', () => {
    expect(PRODUCT_FILES).toHaveLength(8);
    let records = 0;
    let mindLabPro = 0;
    const hits: string[] = [];
    for (const file of PRODUCT_FILES) {
      const recs = JSON.parse(readFileSync(file, 'utf8')) as Array<{ slug: string; brand: string }>;
      for (const r of recs) {
        records++;
        if (/opti-?nutra/i.test(r.brand)) hits.push(`${relative(REPO_ROOT, file)} ${r.slug}: ${r.brand}`);
        if (r.slug === 'mind-lab-pro-review') {
          mindLabPro++;
          expect(r.brand, `${relative(REPO_ROOT, file)} ${r.slug}`).toBe('Performance Lab');
        }
      }
    }
    expect(records).toBeGreaterThan(50);
    expect(mindLabPro).toBe(8);
    expect(hits).toEqual([]);
  });
});

// Round thirteen (2026-10-09): unsourced superlatives. No sales, popularity,
// trust or research-volume data exists for any brand, and no regulator source
// ranks one market's rules as "stricter" or "most permissive", so those claims
// are dropped or rewritten to the fact underneath ("an 11-ingredient stack",
// "the most of any single formula in this review"). Claims attributed to a
// quoted source stay: Suntory's own product page ("DHAサプリメント市場18年連続
// 売上No.1"; it does not give the "30 million bottles" we had) and MIDA's
// description of JAKIM as "widely regarded as the gold standard in halal
// certification" (raw pages saved 2026-10-09). Eu Yan Sang's store count is
// its about page's "over 187 Eu Yan Sang retail outlets in China, Hong Kong,
// Macau, Malaysia, and Singapore" (not "200+", not Australia). "Most
// affordable" and "the most of any single formula" stay only where the
// region's own data proves them (checked below).
const ROUND_THIRTEEN_SOURCES = [
  ...walk(DATA_DIR),
  ...readdirSync(APPS_DIR)
    .map(n => resolve(APPS_DIR, n, 'src'))
    .filter(p => existsSync(p))
    .flatMap(p => walk(p)),
];

const ROUND_THIRTEEN_UNSOURCED: RegExp[] = [
  /most comprehensively researched/i,
  /most comprehensive (formula|trials)/i,
  /(stack|cobertura) más complet[ao]/i,
  /most commercially (successful|recognised)/i,
  /most recogni[sz](ed|able)\b/i,
  /most trusted/i,
  /most popular/i,
  /most permissive/i,
  /widely regarded as the most/i,
  /best-known memory supplement|most widely recognised memory supplements/i,
  /only sold via/i,
  /only available via/i,
  /30 million bottles/i,
  /stricter (supplement|route|ADAS)|processing is stricter/i,
  /reliable international delivery/i,
  /200\+ (retail|stores)|over 200 retail/i,
  /unmatched trust|carries deep trust/i,
  // Last pass: "most complete" (Qualia Mind now states its 31 ingredients,
  // Hunter Focus in the EU its tie at 20), Alpha Brain's recognition claims,
  // "unmatched", JAKIM's "consumer-trust weight", and Eu Yan Sang's derived
  // "145-year" age (founded 1879; its page says "146 Years").
  /most complete/i,
  /best[- ]recogni[sz]ed|name recognition|widely recognised through mainstream/i,
  /\bunmatched\b/i,
  /consumer-trust weight/i,
  /145-year/i,
];

// Collapse every whitespace run (newlines included) to one space before
// matching, so a phrase that JSX or a template literal wraps across lines is
// still caught; each match is reported at the line where it starts.
function normalisedMatchLines(text: string, patterns: RegExp[]): number[] {
  const flat: string[] = [];
  const lineOf: number[] = [];
  let line = 1;
  let inSpace = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      if (!inSpace) {
        flat.push(' ');
        lineOf.push(line);
        inSpace = true;
      }
      if (ch === '\n') line++;
    } else {
      flat.push(ch);
      lineOf.push(line);
      inSpace = false;
    }
  }
  const joined = flat.join('');
  const lines = new Set<number>();
  for (const re of patterns) {
    const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
    for (const m of joined.matchAll(global)) lines.add(lineOf[m.index ?? 0]);
  }
  return [...lines].sort((a, b) => a - b);
}

// "The most of any single formula in this review" is proved per region from
// the ingredientDosages rows. Thesis is four separate blends whose rows end
// with the blend name, so it counts as its largest blend; any other record
// counts all its rows. A Thesis row that names no known blend fails closed.
const MULTI_FORMULA_BLENDS: Record<string, string[]> = {
  'thesis-nootropics-review': ['Clarity', 'Motivation', 'Stress Reset', 'Neuroprotection'],
};
const SINGLE_FORMULA_CLAIM = /most of any single formula/i;
type FormulaRec = { slug: string; discontinued?: unknown; ingredientDosages?: Array<{ name: string }> } & Record<string, unknown>;

function largestFormulaRows(r: FormulaRec): number {
  const rows = r.ingredientDosages ?? [];
  const blends = MULTI_FORMULA_BLENDS[r.slug];
  if (!blends) return rows.length;
  const counts = new Map<string, number>();
  for (const row of rows) {
    const blend = blends.find(b => row.name.endsWith(`(${b})`));
    if (!blend) throw new Error(`${r.slug}: ingredient row "${row.name}" names no known blend`);
    counts.set(blend, (counts.get(blend) ?? 0) + 1);
  }
  return Math.max(...counts.values());
}

function recordTexts(r: Record<string, unknown>): string[] {
  return Object.values(r).flatMap(v =>
    typeof v === 'string' ? [v] : Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [],
  );
}

// Ties are allowed; a claimant beaten by any live record in its region fails.
function singleFormulaViolations(recs: FormulaRec[]): string[] {
  const live = recs.filter(r => !r.discontinued);
  return recs.flatMap(r => {
    if (!recordTexts(r).some(t => SINGLE_FORMULA_CLAIM.test(t))) return [];
    const mine = largestFormulaRows(r);
    const bigger = live
      .filter(x => x.slug !== r.slug && largestFormulaRows(x) > mine)
      .map(x => `${x.slug} (${largestFormulaRows(x)})`);
    return r.discontinued || bigger.length > 0 ? [`${r.slug} (${mine}) beaten by ${bigger.join(', ')}`] : [];
  });
}

describe('round thirteen: no unsourced superlatives in data or app copy', () => {
  test('scanned a non-empty file set', () => {
    expect(ROUND_THIRTEEN_SOURCES.length).toBeGreaterThan(100);
    expect(ROUND_THIRTEEN_SOURCES.some(f => /packages\/data\/src\/products-jp\.json$/.test(f))).toBe(true);
    expect(ROUND_THIRTEEN_SOURCES.some(f => /packages\/data\/src\/eu-countries\.ts$/.test(f))).toBe(true);
    expect(ROUND_THIRTEEN_SOURCES.some(f => /packages\/data\/src\/guides-es\.ts$/.test(f))).toBe(true);
    expect(ROUND_THIRTEEN_SOURCES.some(f => /apps\/sea\/src\/app\/about\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_THIRTEEN_SOURCES.some(f => /apps\/jp\/src\/app\/japanese-brain-supplements\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_THIRTEEN_SOURCES.some(f => /apps\/latam\/src\/app\/best-nootropics-for-memory\/page\.tsx$/.test(f))).toBe(true);
    expect(ROUND_THIRTEEN_SOURCES.every(f => existsSync(f))).toBe(true);
  });

  test('the patterns catch the removed wording', () => {
    const removed = [
      'The most comprehensively researched nootropic stack on the market.',
      '31 active ingredients -- the most comprehensive formula in this review',
      'Split dosing (300mg AM + 300mg PM) is used in the most comprehensive trials.',
      'La cobertura más completa, pero el protocolo diario',
      'el stack más completo para memoria en un solo producto.',
      'The most commercially recognised nootropic brand in North America',
      'Most commercially successful US nootropic.',
      'It is the most recognised nootropic brand in the English-speaking world',
      'easily the most recognisable brand among SEA buyers',
      "from one of Japan's most trusted health brands.",
      "from Southeast Asia's most trusted Traditional Chinese Medicine (TCM) brand",
      "Mind Lab Pro and NooCube are the most popular stacks among Toronto's professional community.",
      'Most permissive personal-import regime in the region.',
      'Nootropics Depot is widely regarded as the most rigorous quality-focused retailer',
      "Memo Plus Gold is the Philippines' best-known memory supplement",
      'It is one of the most widely recognised memory supplements in the Philippines',
      'It is manufactured in the USA in an FDA-registered cGMP facility and only sold via the official website.',
      'a product is TGA-listed, available via Australian retailers, or only available via',
      'but is only available via imports.',
      "Japan's best-selling omega-3 brain supplement (over 30 million bottles sold)",
      'Belgium has one of the stricter supplement regulatory frameworks in the EU.',
      'FOSHU (特定保健用食品, often shortened to トクホ) is the stricter route.',
      'improved MMSE but not the stricter ADAS-Cog scale.',
      'where personal-import customs processing is stricter.',
      'Ships from the UK directly to Canada with reliable international delivery.',
      'with 200+ retail stores across Singapore, Malaysia, Hong Kong, and Australia.',
      'headquartered in Singapore with 200+ retail locations across Asia-Pacific.',
      'with over 200 retail locations across Singapore, Malaysia, Hong Kong, Macau, and Australia.',
      '200+ stores across SEA',
      'For SEA buyers, Eu Yan Sang offers unmatched trust and accessibility:',
      'but the Eu Yan Sang brand carries deep trust across Chinese-heritage communities',
      'Most complete study stack: includes everything in Mind Lab Pro except Bacopa and Pine Bark',
      'the most complete memory-ingredient stack in one product available to Australian buyers.',
      'It is the best-recognised nootropic brand in the North American market',
      "For SEA buyers, Alpha Brain's mainstream name recognition means it is easier to research",
      'first released in 2011 and widely recognised through mainstream US media.',
      'for serious test prep over a full semester, the breadth of mechanism coverage is unmatched.',
      'For Malaysian readers, JAKIM certification carries strong consumer-trust weight',
      'Eu Yan Sang is a 145-year-old Traditional Chinese Medicine company founded in 1879',
      '145-year TCM heritage brand',
    ];
    for (const s of removed) expect(ROUND_THIRTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(true);
  });

  test('a phrase wrapped across lines is still caught, at the line where it starts', () => {
    const jsx = [
      '<li>',
      '  <strong>Singapore — HSA (Health Sciences Authority).</strong> Most',
      '  permissive personal-import',
      '  regime in the region.',
      '</li>',
    ].join('\n');
    expect(normalisedMatchLines(jsx, ROUND_THIRTEEN_UNSOURCED)).toEqual([2]);
    expect(normalisedMatchLines('a\nThe most comprehensively\n\t researched stack', ROUND_THIRTEEN_UNSOURCED)).toEqual([2]);
    // A line-by-line scan misses both.
    for (const l of jsx.split('\n')) expect(ROUND_THIRTEEN_UNSOURCED.some(re => re.test(l))).toBe(false);
    expect(normalisedMatchLines('An 11-ingredient nootropic stack.', ROUND_THIRTEEN_UNSOURCED)).toEqual([]);
  });

  test('no data or app source uses the unsourced wording (whitespace-normalised)', () => {
    const hits = ROUND_THIRTEEN_SOURCES.flatMap(file =>
      normalisedMatchLines(readFileSync(file, 'utf8'), ROUND_THIRTEEN_UNSOURCED).map(
        line => `${relative(REPO_ROOT, file)}:${line}`,
      ),
    );
    expect(hits).toEqual([]);
  });

  test('"the most of any single formula in this review" holds in every region (ingredientDosages rows; Thesis per blend)', () => {
    let claims = 0;
    const wrong: string[] = [];
    for (const file of PRODUCT_FILES) {
      const recs = JSON.parse(readFileSync(file, 'utf8')) as FormulaRec[];
      claims += recs.filter(r => recordTexts(r).some(t => SINGLE_FORMULA_CLAIM.test(t))).length;
      for (const v of singleFormulaViolations(recs)) wrong.push(`${relative(REPO_ROOT, file)} ${v}`);
    }
    expect(claims).toBe(6);
    expect(wrong).toEqual([]);
  });

  test('the single-formula check fails when another record outgrows the claimant, and allows a tie', () => {
    const us = JSON.parse(readFileSync(resolve(DATA_DIR, 'products-us.json'), 'utf8')) as FormulaRec[];
    const qualia = us.find(r => r.slug === 'qualia-mind-review')!;
    const hunter = us.find(r => r.slug === 'hunter-focus-review')!;
    expect(largestFormulaRows(qualia)).toBe(31);
    expect(largestFormulaRows(us.find(r => r.slug === 'thesis-nootropics-review')!)).toBe(12);
    const bump = (n: number): FormulaRec[] =>
      us.map(r =>
        r === hunter
          ? { ...r, ingredientDosages: Array.from({ length: n }, (_, i) => ({ name: `Row ${i}` })) }
          : r,
      );
    expect(singleFormulaViolations(bump(31))).toEqual([]);
    expect(singleFormulaViolations(bump(32))).toEqual(['qualia-mind-review (31) beaten by hunter-focus-review (32)']);
    // A Thesis row outside the four known blends fails closed.
    const thesis = us.find(r => r.slug === 'thesis-nootropics-review')!;
    const strayRow = { ...thesis, ingredientDosages: [...(thesis.ingredientDosages ?? []), { name: 'Caffeine (Energy)' }] };
    expect(() => largestFormulaRows(strayRow)).toThrow(/names no known blend/);
  });

  // Prices are the vendor's own, in the store's currency, never converted
  // (site-owner policy 2026-10-09). A "cheapest" claim is therefore provable
  // only when every live record in the region has a per-month store price and
  // all of them share one currency. No region met that on 2026-10-09 (records
  // without a store price, stores in several currencies), so the claims that
  // were in the data then were removed; the fixtures below keep the check live.
  const CHEAPEST_CLAIM = /most affordable|cheapest|lowest monthly price in this review|lowest-priced product in this review/i;
  type Rec = Product & { discontinued?: unknown };

  function cheapestClaimProblems(where: string, recs: Rec[]): { claims: number; wrong: string[] } {
    const live = recs.filter(r => !r.discontinued);
    const monthly = new Map(live.map(r => [r.slug, monthlyStorePrice(r)] as const));
    const unpriced = live.filter(r => !monthly.get(r.slug)).map(r => r.slug);
    const currencies = new Set([...monthly.values()].flatMap(m => (m ? [m.currency] : [])));
    const min = Math.min(...[...monthly.values()].flatMap(m => (m ? [m.amount] : [])));
    let claims = 0;
    const wrong: string[] = [];
    for (const r of recs) {
      const texts = Object.values(r).flatMap(v =>
        typeof v === 'string' ? [v] : Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [],
      );
      if (!texts.some(t => CHEAPEST_CLAIM.test(t))) continue;
      claims++;
      const own = monthly.get(r.slug);
      if (r.discontinued || unpriced.length > 0 || currencies.size !== 1 || own?.amount !== min) {
        wrong.push(
          `${where} ${r.slug}: ${own ? `${own.currency} ${own.amount}` : 'no monthly store price'} vs min ${min}; ` +
            `currencies ${[...currencies].join(',')}; unpriced ${unpriced.join(',')}`,
        );
      }
    }
    return { claims, wrong };
  }

  test('a "cheapest in this review" claim in product data is provable from the region\'s store prices', () => {
    let records = 0;
    const wrong: string[] = [];
    for (const file of PRODUCT_FILES) {
      const recs = JSON.parse(readFileSync(file, 'utf8')) as Rec[];
      records += recs.length;
      wrong.push(...cheapestClaimProblems(relative(REPO_ROOT, file), recs).wrong);
    }
    expect(records).toBeGreaterThanOrEqual(70);
    expect(wrong).toEqual([]);
  });

  test('the cheapest-claim check accepts only the lowest same-currency monthly store price, with every record priced', () => {
    const rec = (slug: string, amount: number, currency: string, summary = '') =>
      ({
        slug, summary, servingsPerContainer: 30, capsulesPerServing: 1, form: 'capsule',
        storePrice: { amount, currency, text: `${amount}`, pack: 'Servings per container: 30', url: 'https://example.com/p', checkedAt: '2026-10-09' },
      }) as unknown as Rec;
    const claim = 'The most affordable nootropic in this review.';
    expect(cheapestClaimProblems('t', [rec('a', 20, 'USD', claim), rec('b', 40, 'USD')])).toEqual({ claims: 1, wrong: [] });
    expect(cheapestClaimProblems('t', [rec('a', 50, 'USD', claim), rec('b', 40, 'USD')]).wrong).toHaveLength(1);
    // Mixed currencies would need a conversion to compare.
    expect(cheapestClaimProblems('t', [rec('a', 20, 'USD', claim), rec('b', 40, 'EUR')]).wrong).toHaveLength(1);
    // A record without a store price leaves the comparison unproved.
    expect(cheapestClaimProblems('t', [rec('a', 20, 'USD', claim), { ...rec('b', 40, 'USD'), storePrice: undefined }]).wrong).toHaveLength(1);
    // Claims in pros/cons lists count too.
    expect(cheapestClaimProblems('t', [{ ...rec('a', 50, 'USD'), pros: ['Cheapest nootropic in this review'] } as Rec, rec('b', 40, 'USD')]).wrong).toHaveLength(1);
  });
});

// Round fourteen (2026-10-12, research p5/eu-authorities.json): each EU
// country regulatory note names the body that receives food-supplement
// notifications, from the national authority's own page or, where none could
// be read (Malta), the EC "List of competent authorities of the Member States
// within the meaning of Article 4(6) of Directive 2002/46 on food supplements"
// (last revision October 2025). The removed wording named the wrong body
// (FASFC positive list, NÉBIH, ANPC, EFET, MCCAA, ASAE, SZPI, the Ministry of
// Health for Luxembourg), said "registration" where the page says
// notification, made claims no source confirms (Denmark "may not be sold",
// Sweden "conservative maximum dose", France "plant extracts at high doses",
// a German herb-dose medicinal assessment), or was market colour with no
// source at all. Italy, Lithuania and Poland had no national page checked, so
// their notes quote only the EC list entry; the Italian register/registration
// claims, Lithuania's State Food and Veterinary Service and Poland's "GIS
// oversees" went with the colour, as did Italy's market-size shipping line.
const EU_COUNTRIES_FILE = resolve(DATA_DIR, 'eu-countries.ts');

const ROUND_FOURTEEN_UNSOURCED: RegExp[] = [
  // Contradicted or unconfirmed rules.
  /FASFC[^.]{0,80}positive list/i,
  /Some herbal nootropic ingredients require pre-notification/i,
  /maintains a positive list/i,
  /higher-dose nootropic products may not be sold/i,
  /conservative maximum dose/i,
  /Verify dose compliance/i,
  /plant extracts at high doses require/i,
  /very high herb doses may be assessed as medicinal/i,
  /Some high-dose products may require assessment/i,
  // Wrong or unconfirmed bodies, and "registration" where the page says notification.
  /National Food Chain Safety Office \(NÉBIH\) oversees/i,
  /National Authority for Consumer Protection \(ANPC\) oversees/i,
  /National Food Authority \(EFET\) oversees/i,
  /Malta Competition and Consumer Affairs Authority oversees/i,
  /ASAE \(Food and Economic Safety Authority\) oversight/i,
  /\(SZPI\) oversees supplement compliance/i,
  /with oversight by the Ministry of Health/i,
  /Administration of the Republic of Slovenia for Food Safety oversees/i,
  /oversees (food )?supplement registration/i,
  /Ministry of Health registers food supplements/i,
  /maintains a supplementi alimentari register/i,
  /Some ingredients require official registration before sale/i,
  /Verify any Italy-specific restrictions/i,
  /State Food and Veterinary Service oversees supplements/i,
  /Chief Sanitary Inspectorate \(GIS\) oversees/i,
  // Unsourced market colour.
  /Europe's most detailed supplement regulatory/i,
  /mainstream supplement market well-established/i,
  /largest Eastern European market/i,
  /fast-growing supplement category/i,
  /one of the largest European supplement markets/i,
  /particularly in Athens/i,
  /High purchasing power/i,
  /fourth-largest EU economy/i,
  /strong online purchasing culture/i,
  /Small but growing market/i,
  /Market closely aligned with Czech/i,
  /Island geography means/i,
  /English-language market well-served/i,
  /Post-Brexit, UK-based brands ship/i,
  /well-developed supplement market/i,
  /Growing online supplement market/i,
  /EU membership ensures product availability/i,
  /robust supplement regulation/i,
  /strict supplement regulation/i,
];

describe('round fourteen: EU country regulatory notes follow the EC list and national authorities', () => {
  test('scanned the EU country data file (27 notes)', () => {
    expect(existsSync(EU_COUNTRIES_FILE)).toBe(true);
    const notes = readFileSync(EU_COUNTRIES_FILE, 'utf8').match(/^\s+regulatoryNote: ['"]/gm) ?? [];
    expect(notes).toHaveLength(27);
  });

  test('the patterns catch the removed wording, and every pattern catches some of it', () => {
    const removed = [
      'The FASFC (Federal Agency for the Safety of the Food Chain) maintains a positive list of permitted substances.',
      'Some herbal nootropic ingredients require pre-notification before marketing.',
      'The Danish Veterinary and Food Administration (Fødevarestyrelsen) maintains a positive list.',
      'Some higher-dose nootropic products may not be sold in Denmark -- verify compliance of specific products before ordering.',
      'Sweden follows EU Directive 2002/46/EC but maintains conservative maximum dose recommendations for several ingredients.',
      'Verify dose compliance for individual products.',
      'Some plant extracts at high doses require regulatory assessment.',
      'Products with very high herb doses may be assessed as medicinal products -- check compliance for any product above the recommended daily dose.',
      'Some high-dose products may require assessment.',
      'The National Food Chain Safety Office (NÉBIH) oversees supplement registration.',
      'The National Authority for Consumer Protection (ANPC) oversees supplement compliance.',
      'The National Food Authority (EFET) oversees compliance.',
      'The Malta Competition and Consumer Affairs Authority oversees supplement compliance.',
      'Portugal follows EU supplement regulations with ASAE (Food and Economic Safety Authority) oversight.',
      'The State Agricultural and Food Inspection Authority (SZPI) oversees supplement compliance.',
      'Luxembourg follows EU supplement regulations with oversight by the Ministry of Health.',
      'The Administration of the Republic of Slovenia for Food Safety oversees compliance.',
      'The Ministry of Health oversees supplement registration.',
      'The Agriculture and Food Board oversees food supplement registration.',
      'The Ministry of Health registers food supplements.',
      'Growing nootropics market, particularly in Athens.',
      'High purchasing power market.',
      'Spain is the fourth-largest EU economy with a growing supplement market.',
      'Estonia has a growing supplement market with strong online purchasing culture.',
      'Small but growing market.',
      'Market closely aligned with Czech Republic.',
      'Island geography means slightly longer shipping from mainland EU distribution centres.',
      'English-language market well-served by UK and EU supplement brands.',
      'Post-Brexit, UK-based brands ship from EU distribution centres to avoid VAT complications.',
      'The Netherlands has a well-developed supplement market.',
      'Growing online supplement market.',
      'EU membership ensures product availability.',
      'Germany has robust supplement regulation under the NemV (Nahrungsergänzungsmittelverordnung), aligned with EU Directive 2002/46/EC.',
      'Sweden has strict supplement regulation through the Swedish Food Agency (Livsmedelsverket).',
      "Italy has one of Europe's most detailed supplement regulatory frameworks.",
      'The Ministry of Health maintains a supplementi alimentari register.',
      'Some ingredients require official registration before sale.',
      'Verify any Italy-specific restrictions for novel ingredients.',
      'Italy is one of the largest European supplement markets.',
      'The State Food and Veterinary Service oversees supplements.',
      'EU member since 2004 -- mainstream supplement market well-established.',
      "Poland is the EU's largest Eastern European market and has a fast-growing supplement category.",
      'The Chief Sanitary Inspectorate (GIS) oversees food supplements.',
    ];
    for (const s of removed) expect(ROUND_FOURTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(true);
    for (const re of ROUND_FOURTEEN_UNSOURCED) expect(removed.some(s => re.test(s)), String(re)).toBe(true);
  });

  test('no EU country note uses the removed wording (whitespace-normalised)', () => {
    const hits = normalisedMatchLines(readFileSync(EU_COUNTRIES_FILE, 'utf8'), ROUND_FOURTEEN_UNSOURCED).map(
      line => `${relative(REPO_ROOT, EU_COUNTRIES_FILE)}:${line}`,
    );
    expect(hits).toEqual([]);
  });

  // Citation shapes in use: "(domain, checked YYYY-MM-DD)", "(domain and
  // domain, checked YYYY-MM-DD)", Bulgaria's "(per domain, checked
  // YYYY-MM-DD)" and "(EC list of competent authorities, rev. October 2025)".
  const SOURCE_CITATION =
    /\((?:per )?(?:[a-z0-9-]+(?:\.[a-z0-9-]+)+(?: and [a-z0-9-]+(?:\.[a-z0-9-]+)+)?|EC list of competent authorities), (?:checked \d{4}-\d{2}-\d{2}|rev\. [A-Z][a-z]+ \d{4})\)/;

  test('the citation pattern accepts each shape in use and rejects a bare note', () => {
    for (const s of [
      '(ages.at, checked 2026-10-12)',
      '(agriculture.gouv.fr and entreprises.gouv.fr, checked 2026-10-12)',
      '(per ecb.europa.eu, checked 2026-10-05)',
      '(EC list of competent authorities, rev. October 2025)',
    ]) expect(SOURCE_CITATION.test(s), s).toBe(true);
    for (const s of ['(ages.at)', '(checked 2026-10-12)', 'Italy follows EU Directive 2002/46/EC.']) {
      expect(SOURCE_CITATION.test(s), s).toBe(false);
    }
  });

  test('every EU country regulatory note (all 27) is non-empty and cites its source', () => {
    expect(euCountries).toHaveLength(27);
    const uncited = euCountries
      .filter(c => c.regulatoryNote.trim() === '' || !SOURCE_CITATION.test(c.regulatoryNote))
      .map(c => c.slug);
    expect(uncited).toEqual([]);
  });
});

// Round fifteen (2026-10-12). The Consumer Affairs Agency (CAA) Foods with
// Function Claims (FFC) full export of 2026-10-06 (research
// p5/p5k_ffc_ingredient_counts.json) does not make DHA the "most-notified" FFC
// ingredient: GABA leads overall (845 active notifications to DHA's 176), and
// DHA's lead among memory/cognition claims depends on how the ginkgo-leaf
// components are grouped. The JP pages now give the count instead: DHA is
// listed in 105 of the 563 active notifications whose claim mentions 記憶 or
// 認知機能. Suntory "trusted across the 60+ demographic", Nootropics Depot
// Lion's Mane as "one of the lowest-risk imports" whose size "minimise[s]
// customs exposure", and every "most studied" ranking (no source of ours
// counts studies) had no source and were dropped, as were "best-studied",
// EGb 761 / Pycnogenol as "the gold-standard ... used in most clinical
// trials/research" (each now names only the extract in the record's own
// citations) and "found in virtually every quality pre-work stack". The JP
// memory page called Suntory and FANCL "the dominant Japanese DHA brands"
// (FANCL BRAINs is a bacopa-saponin and hop product, G425) and the aging
// page called DHA "the cultural and regulatory anchor" for aging-brain
// supplements; neither had a source. "most-notified" without "FFC" and
// "dominates the Japanese FFC" cover the other removed FFC phrasings. The
// scan covers every file: the open-PR exclusions were dropped once #369 and
// #370 landed (2026-10-12).
//
// Theanine and jitter: our L-theanine record cites Rogers et al. (PMID
// 17891480), where theanine "did not significantly affect jitteriness,
// alertness or other aspects of mood". Copy saying theanine reduces, softens
// or prevents jitter, or gives "jitter-free" energy, was rewritten to that
// finding plus the attention result of Owen 2008 (PMID 18681988); the
// unsourced "post-coffee crash" claims went with it. The jitter pattern skips
// "not reduce" / "not significantly reduce", so the Rogers sentence itself
// passes. The narrower patterns after it cover the other removed phrasings,
// Spanish included.
const THEANINE_JITTER_CLAIM = /(?<!\bnot )(?<!\bnot significantly )\b(reduces?|softens?|prevents?)[^.]{0,40}jitter/i;

const ROUND_FIFTEEN_UNSOURCED: RegExp[] = [
  /most-notified FFC/i,
  /\bmost[- ]notified\b/i,
  /dominates the Japanese FFC/i,
  /trusted across the 60\+/i,
  /lowest-risk imports?/i,
  /minimi[sz]e customs exposure/i,
  /\bmost[- ]studied\b/i,
  /best-studied/i,
  /dominant Japanese DHA brands/i,
  /cultural and regulatory anchor/i,
  /gold[- ]standard[^.]{0,60}(most clinical|most research)/i,
  /virtually every quality/i,
  THEANINE_JITTER_CLAIM,
  /post-coffee crash/i,
  /used in most (of the )?(dementia |standalone )?trials/i,
  /most reliable choice/i,
  /familiar to every Japanese consumer/i,
  /jitter-free/i,
  /focus-and-jitter/i,
  /without the jitter/i,
  /smooths out any overstimulation/i,
  /sustained attention without the crash/i,
  /jitteriness reduction specifically is mixed/i,
  /re(duce|duzca) el nerviosismo|caída posterior|bajón posterior|el nerviosismo en concreto es mixta/i,
];

describe('round fifteen: JP FFC ranking, SEA customs and "most studied" claims follow the sources', () => {
  test('scanned every file under apps/*/src and packages/data/src, with no exclusions', () => {
    expect(ROUND_THIRTEEN_SOURCES.length).toBeGreaterThan(300);
    for (const f of [
      'apps/jp/src/app/best-nootropics-for-aging/page.tsx',
      'apps/jp/src/app/best-nootropics-for-memory/page.tsx',
      'apps/jp/src/app/best-nootropics-for-studying/page.tsx',
      'apps/us/src/app/natural-adderall-alternatives/page.tsx',
      'apps/us/src/app/guides/nootropics-vs-adderall/page.tsx',
      'packages/data/src/guides.ts',
      'packages/data/src/ingredients.ts',
      'packages/data/src/products-sea.json',
      'packages/data/src/products-us.json',
    ]) expect(ROUND_THIRTEEN_SOURCES.some(p => relative(REPO_ROOT, p) === f), f).toBe(true);
  });

  test('the patterns catch the removed wording, and every pattern catches some of it', () => {
    const removed = [
      "DHA — Japan's most-notified FFC ingredient for older adults",
      "DHA is the most-notified functional ingredient under Japan's FFC system, with claims around memory support",
      "DHA is Japan's most-notified FFC ingredient for cognitive function.",
      'For Japan-domestic options, DHA is the most-notified FFC ingredient with strong evidence in middle-aged and older adults;',
      'DHA dominates the Japanese FFC supplement market for adults 50+',
      'Foundational structural support for aging brains; widely advertised on Japanese television and trusted across the 60+ demographic.',
      'For SEA buyers, this product represents one of the lowest-risk imports in the category',
      'Low price and small package size minimise customs exposure across all SEA markets.',
      'The two most-studied commercial extracts (Bacognize and Synapsa) are both standardised.',
      'Cognizin (most studied, used in Mind Lab Pro)',
      'Suntheanine is the most studied branded L-Theanine',
      'The most studied nootropic stack.',
      'KSM-66 is the most studied full-spectrum root extract.',
      'Pycnogenol is the most studied branded form.',
      'Caffeine is the most-studied legal cognitive enhancer',
      'L-Theanine with caffeine is the most studied nootropic pairing',
      'precursors to neurotransmitters; the most studied and safest category.',
      'Caffeine — most studied legal mechanism',
      'The best-studied pairing is caffeine with [L-theanine](/ingredients/l-theanine/)',
      'Suntory and FANCL are the dominant Japanese DHA brands.',
      'The cultural and regulatory anchor for aging-brain supplementation in Japan.',
      'EGb 761 is the gold-standard pharmaceutical-grade extract used in most clinical trials.',
      'Pycnogenol is the gold-standard branded extract used in most clinical research.',
      'This pairing is found in virtually every quality pre-work stack.',
      'Reduces caffeine jitter and post-coffee crash, smooths attention switching.',
      'Reduce el nerviosismo de la cafeína y la caída posterior, y suaviza el cambio de atención.',
      'Theanine smooths the focus curve, reduces jitter, and prevents the post-coffee crash.',
      'Smooths the focus-and-jitter profile of caffeine.',
      'The L-theanine softens any caffeine jitter.',
      'Caffeine (100mg) and L-Theanine (200mg) work synergistically for alert, jitter-free energy.',
      'Together they produce alert, focused calm without the jitteriness some people experience from citicoline alone.',
      "L-Theanine smooths out any overstimulation from Zynamite's catecholamine-preserving effects.",
      'For L-Theanine + caffeine combinations: sustained attention without the crash, mild mood uplift.',
      'Evidence that L-Theanine reduces caffeine jitteriness is mixed',
      'though evidence for anxiety or jitteriness reduction specifically is mixed.',
      'Con combinaciones de L-Theanine + cafeína: atención sostenida sin el bajón posterior',
      'La evidencia de que L-Theanine reduzca el nerviosismo causado por la cafeína es mixta',
      'aunque la evidencia sobre la reducción de la ansiedad o el nerviosismo en concreto es mixta.',
      'It is the extract used in most of the dementia trials.',
      'below the 100-200mg clinical dose used in most standalone trials.',
      'If you want to match the clinical evidence, Pycnogenol is the most reliable choice.',
      'backed by a household-name conglomerate familiar to every Japanese consumer.',
    ];
    for (const s of removed) expect(ROUND_FIFTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(true);
    for (const re of ROUND_FIFTEEN_UNSOURCED) expect(removed.some(s => re.test(s)), String(re)).toBe(true);
    // The replacement wording passes.
    for (const s of [
      'DHA — an FFC-notified ingredient for memory and cognition',
      'DHA is listed as a functional ingredient in 105 of the 563 active Foods with Function Claims (FFC) notifications',
      'Two standardised commercial extracts are Bacognize and Synapsa.',
      'Caffeine is a legal stimulant that works via adenosine antagonism',
      'One such pairing is caffeine with [L-theanine](/ingredients/l-theanine/)',
      'Suntory DHA & EPA + Sesamin EX is the DHA product; FANCL BRAINs is not',
      'EGb 761 is a pharmaceutical-grade extract; it is the extract used in the trials pooled by the meta-analysis we cite (Tan 2015).',
      'Pycnogenol is a branded extract; it is the extract used in the studies we cite (Belcaro 2014; Luzzi 2011).',
      'In the trial linked below (Owen 2008), the pairing improved speed and accuracy on an attention-switching task; in a controlled trial (Rogers 2008, PubMed 17891480), theanine did not significantly reduce caffeine-induced jitteriness.',
      'en un ensayo controlado (Rogers 2008, PubMed 17891480), la L-teanina no redujo significativamente el nerviosismo causado por la cafeína.',
      'It is the extract used in the trials pooled by the meta-analysis we cite (Tan 2015).',
      'below the 100-200mg clinical dose on this page (the Belcaro 2014 study we cite used 150mg/day).',
    ]) expect(ROUND_FIFTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(false);
  });

  test('the jitter pattern catches the claim but not the Rogers null result', () => {
    for (const s of [
      'Reduces caffeine jitter and post-coffee crash',
      'theanine reduces jitter',
      'The L-theanine softens any caffeine jitter.',
      'it may reduce caffeine jitteriness',
      'prevents the jitters',
    ]) expect(THEANINE_JITTER_CLAIM.test(s), s).toBe(true);
    for (const s of [
      'in a controlled trial (Rogers 2008, PubMed 17891480), theanine did not significantly reduce caffeine-induced jitteriness.',
      'in a controlled trial (Rogers 2008) theanine did not significantly reduce caffeine jitteriness.',
      'in a controlled caffeine trial it did not significantly reduce jitteriness',
      'theanine did not reduce caffeine jitteriness',
      'theanine did not significantly affect caffeine-induced jitteriness',
    ]) expect(THEANINE_JITTER_CLAIM.test(s), s).toBe(false);
  });

  test('no data or app source uses the removed wording (whitespace-normalised)', () => {
    const hits = ROUND_THIRTEEN_SOURCES.flatMap(file =>
      normalisedMatchLines(readFileSync(file, 'utf8'), ROUND_FIFTEEN_UNSOURCED).map(
        line => `${relative(REPO_ROOT, file)}:${line}`,
      ),
    );
    expect(hits).toEqual([]);
  });
});

// Round fifteen, U7 (2026-10-12). Caffeine + L-theanine was called "the
// most-evidence-backed" or "most-replicated" combination, "1:2 to 2:1" was
// given as its evidence-backed ratio, an espresso plus 200mg theanine was said
// to "replicate the studied dose", and the page supplements were said to
// "compound" its benefit. None of that had a source. Owen 2008 (PMID
// 18681988) is the trial the evidence cards link: 50mg caffeine with 100mg
// L-theanine (1:2) improved speed and accuracy on an attention-switching task.
// Rogers 2008 (PMID 17891480; 250mg caffeine, 200mg theanine) found theanine
// "did not significantly affect jitteriness"; the cards link only Owen, so
// copy now names Rogers' PubMed ID. ingredients.ts and guides.ts keep their
// own study lists, so the bare-citation check covers app pages and product
// records only.
//
// The superlative and ratio patterns are anchored to the removed caffeine +
// L-theanine phrasings. The spaced "most evidence-backed" in the focus and
// memory FAQ questions, the JP focus Mind Lab Pro blurb, and the "(1:2 to 2:1
// ratio)" focus-page names and answers are a separate claim set, not reviewed
// in this round.
const ROUND_FIFTEEN_CAFFEINE_THEANINE: RegExp[] = [
  /(caffeine|theanine)[^.]{0,80}\bmost[- ]evidence[- ]backed/i,
  /\bmost[- ]evidence[- ]backed (legal|combination)/i,
  /\bin a 1:2 to 2:1 ratio/i,
  /replicates the studied dose/i,
  /which compounds? (the benefit|for actual retention)/i,
  /most-replicated cognitive-energy/i,
];
const BARE_ROGERS_CITATION = /\(Rogers 2008\)/;
const ROGERS_CITATION_SOURCES = ROUND_THIRTEEN_SOURCES.filter(p => {
  const rel = relative(REPO_ROOT, p);
  return (rel.startsWith('apps/') && rel.endsWith('.tsx')) || /^packages\/data\/src\/products-[^/]+\.json$/.test(rel);
});

describe('round fifteen (U7): caffeine + L-theanine copy follows Owen 2008 and names the Rogers PubMed ID', () => {
  test('scanned app pages and product records, and only those for the citation check', () => {
    const rels = ROGERS_CITATION_SOURCES.map(p => relative(REPO_ROOT, p));
    expect(rels.length).toBeGreaterThan(200);
    for (const f of [
      'apps/us/src/app/best-nootropics-for-energy/page.tsx',
      'apps/latam/src/app/best-nootropics-for-studying/page.tsx',
      'apps/us/src/app/guides/nootropics-vs-adderall/page.tsx',
      'packages/data/src/products-au.json',
      'packages/data/src/products-us.json',
    ]) expect(rels, f).toContain(f);
    expect(rels).not.toContain('packages/data/src/ingredients.ts');
    expect(rels).not.toContain('packages/data/src/guides.ts');
  });

  test('the patterns catch the removed wording, and every pattern catches some of it', () => {
    const removed = [
      'For most students, caffeine + L-theanine (1:2 ratio) is the most cost-effective focus stack — and the most-evidence-backed.',
      'For sustained cognitive energy, caffeine + L-theanine in a 1:2 to 2:1 ratio is the most-evidence-backed combination.',
      'Caffeine + L-theanine in a 1:2 ratio (100mg caffeine + 200mg L-theanine) is the most-evidence-backed legal cognitive-enhancement combination, available cheaply at any pharmacy.',
      'Start with caffeine + L-theanine. It is the most-evidence-backed legal cognitive enhancement combination,',
      'Espresso (~75mg) plus a 200mg L-theanine capsule replicates the studied dose.',
      'The supplements on this page add memory-consolidation ingredients (Bacopa, citicoline) on top, which compounds for actual retention of studied material over the term.',
      'The supplements on this page add Rhodiola, citicoline, and B-vitamins on top, which compound the benefit.',
      '100mg of caffeine (one cup of coffee) + 200mg of L-theanine (capsule) is the most-replicated cognitive-energy combination.',
    ];
    for (const s of removed) expect(ROUND_FIFTEEN_CAFFEINE_THEANINE.some(re => re.test(s)), s).toBe(true);
    for (const re of ROUND_FIFTEEN_CAFFEINE_THEANINE) expect(removed.some(s => re.test(s)), String(re)).toBe(true);
    // The replacement wording passes.
    for (const s of [
      'For most students, caffeine + L-theanine is a simple starting point: in Owen 2008 (PubMed 18681988), 50mg caffeine with 100mg L-theanine (a 1:2 ratio) improved speed and accuracy on an attention-switching task.',
      'The supplements on this page add memory-consolidation ingredients (Bacopa, citicoline) on top; we cite no trial of them combined with caffeine + L-theanine.',
      'In the trial linked below (Owen 2008), 50mg caffeine with 100mg L-theanine improved speed and accuracy on an attention-switching task; in a controlled trial (Rogers 2008, PubMed 17891480), theanine did not significantly reduce caffeine-induced jitteriness.',
      'Yes. In Owen 2008 (PubMed 18681988), 50mg caffeine with 100mg L-theanine improved speed and accuracy on an attention-switching task; 100mg caffeine with 200mg L-theanine keeps the same 1:2 ratio.',
      'Caffeine + L-theanine is a legal combination with trial evidence: in Owen 2008 (PubMed 18681988), 50mg caffeine with 100mg L-theanine improved speed and accuracy on an attention-switching task; 100mg caffeine + 200mg L-theanine keeps the same 1:2 ratio.',
      'Start with caffeine + L-theanine. In a controlled trial (Owen 2008), the pairing improved speed and accuracy on an attention-switching task.',
    ]) expect(ROUND_FIFTEEN_CAFFEINE_THEANINE.some(re => re.test(s)), s).toBe(false);
  });

  test('the citation pattern catches a bare Rogers 2008 citation but not one with its PubMed ID', () => {
    expect(BARE_ROGERS_CITATION.test('in a controlled trial (Rogers 2008), theanine did not')).toBe(true);
    expect(BARE_ROGERS_CITATION.test('in a controlled trial (Rogers 2008, PubMed 17891480), theanine did not')).toBe(false);
  });

  test('no data or app source uses the removed wording (whitespace-normalised)', () => {
    const hits = ROUND_THIRTEEN_SOURCES.flatMap(file =>
      normalisedMatchLines(readFileSync(file, 'utf8'), ROUND_FIFTEEN_CAFFEINE_THEANINE).map(
        line => `${relative(REPO_ROOT, file)}:${line}`,
      ),
    );
    expect(hits).toEqual([]);
  });

  test('no app page or product record cites Rogers 2008 without its PubMed ID (whitespace-normalised)', () => {
    const hits = ROGERS_CITATION_SOURCES.flatMap(file =>
      normalisedMatchLines(readFileSync(file, 'utf8'), [BARE_ROGERS_CITATION]).map(
        line => `${relative(REPO_ROOT, file)}:${line}`,
      ),
    );
    expect(hits).toEqual([]);
  });
});

// Round sixteen, U1 (2026-10-12). Leftover energy and caffeine + L-theanine
// claims. The US energy page promised energy "without the crash" (title,
// description) and "without the spike-and-crash pattern of energy drinks"
// (hero, FAQ), said energy drinks are "often followed by a crash" and that
// L-theanine is there "to smooth the curve"; the quiz's Energy goal read
// "Sustained drive without the crash". We cite no trial that measured a crash
// or compared nootropic stacks with energy drinks, so the FAQ now says so and
// the rest was dropped. Owen 2008 (PMID 18681988) tested 50mg caffeine with
// 100mg L-theanine (1:2), so Mind Lab Pro's "1:1 L-theanine + caffeine
// effect" and Qualia Mind's "closest match to the evidence-backed ratio" (its
// caffeinated label: 100mg caffeine, 200mg L-theanine) now name that trial
// and ratio. guides.ts and guides-es.ts called the pairing "the best-evidenced
// nootropic combination" / "la combinación nootrópica con mayor respaldo
// científico"; the GCC studying page promised the "same synergy" from
// L-theanine with coffee; the JP focus page called Mind Lab Pro "the most
// evidence-backed focus stack available to Japanese buyers"; and Performance
// Lab Mind's US record said "Most users report this stack feels cleaner",
// with no user data behind it. None had a source.
//
// The scan is the round-thirteen file set plus packages/ui/src/templates,
// where QuizFlow.tsx lives. "Most users report" was first matched
// case-sensitively, as the sentence opening that was removed; U4 removed the
// lower-case "most [Canadian] users report ..." lines from the Mind Lab Pro
// and Alpha Brain whatToExpect fields, so the pattern is now
// case-insensitive.
//
// Round sixteen, U2 (2026-10-12). Evidence rankings on the focus and memory
// pages and three leftovers elsewhere. The FAQs asked for "the most
// evidence-backed nootropic" for focus or memory; L-theanine + caffeine
// "(1:2 to 2:1 ratio)" had "the strongest replication evidence" and was
// "Among the best-replicated cognitive findings"; Bacopa was "The
// most-replicated memory ingredient", "the best-evidenced ingredient" /
// "botanical" for memory, and memory "the use case where nootropics have the
// most replicated evidence"; phosphatidylserine had "the FDA qualified health
// claim for cognitive function in elderly" (CA: "the strongest age-related
// memory claim"); JP DHA "has strong evidence in middle-aged and older
// adults"; "Citicoline at 250-500mg also has multiple RCTs"; Rhodiola's
// 3%/1% standardisation and a 300mg Bacopa dose were "used in most clinical
// trials"; and Japan had "the world's oldest population". No source ranked
// any of these. The copy now gives the trials: Owen 2008 (PMID 18681988),
// Giesbrecht 2010 (21040626), Haskell 2008 (18006208) and Foxe 2012
// (22326943, no added benefit over either compound alone); Pase 2012
// (22747190), a systematic review of six 12-week Bacopa trials at 300-450mg
// extract a day, 9 of 17 free-recall tests improved, research "in its
// infancy"; the FDA's 13 May 2003 qualified claim with "FDA concludes that
// there is little scientific evidence supporting this claim"; the citicoline
// and DHA grades of our ingredient pages; SHR-5 as the only extract the
// Rhodiola trials name; and Japan's UN WPP 2024 median age (49.4, highest of
// any country or area with at least a million people). The patterns join
// the round-sixteen list and use the same scan; the Spanish guide twin is
// matched by its own phrase.
//
// Round sixteen, U3 (2026-10-12). The aging and memory pages said the FDA
// "permits a qualified health claim" for phosphatidylserine and misquoted it
// ("suggests that PS may reduce the risk of dementia or cognitive
// dysfunction"); the FDA's 13 May 2003 letter allows only qualified claims
// that phosphatidylserine "may reduce the risk of dementia" or "cognitive
// dysfunction in the elderly", each followed by "FDA concludes that there is
// little scientific evidence supporting this claim". "Multiple RCTs in
// 50-80-year-olds ... show improvements in memory, processing speed, and
// cognitive complaints", "Most RCT evidence is in 50-80-year-olds" and "The
// strongest age-related cognitive evidence in this category" now follow our
// phosphatidylserine page (memory benefits "often only in subgroups").
// Citicoline's "Multiple RCTs show attention and cognitive-effort benefits"
// now gives the page's mixed attention grade (Cochrane: no attention benefit),
// and "verbal memory and processing speed at 250-500mg/day for 12+ weeks"
// the one trial cited, Spiers 1996 (PMID 8624220: 1,000mg a day, delayed
// recall only in those with relatively inefficient memories; 2,000mg in a
// crossover). Memo Plus Gold's SEA record called Bacopa "the most extensively
// studied botanical for memory". The LATAM focus, memory and aging pages
// carried the Spanish versions of these and of the U2 claims ("proporción 1:2
// a 2:1", "mejor replicados", "más replicada", "más de 30 años", "el
// nootrópico ... con más evidencia"); each Spanish phrase has its own pattern.
//
// Round sixteen, U4 (2026-10-12). Synergy, user-report, crash and leftover
// claims. Camfield 2014 (PMID 24946991, 11 placebo-controlled studies) found
// moderate effect sizes for L-theanine + caffeine versus placebo, with
// caffeine dose driving more of the change; Kahathuduwa 2016 (26869148)
// found additive effects and no interaction; Haskell 2008 (18006208) one
// interaction; Foxe 2012 (22326943) no added benefit over either compound
// alone. So "for the synergistic effect" (Mind Lab Pro focus picks; "efecto
// sinérgico" in LATAM, "efectos sinérgicos" in the Spanish stacking guide),
// the GCC "L-theanine + caffeine synergy" and "many students prefer", the
// L-theanine record's 'Caffeine Synergy' row (strong/large) and "more than
// either compound alone", the pine-bark and Oat Straw synergy clauses and the
// guide's "for synergistic effects" / "attention synergy" are gone; the row is
// now 'With Caffeine' (moderate). The Mind Lab Pro and Alpha Brain
// whatToExpect fields said "most users report" and "no energy spike --
// effects are gentle", with no user data; L-Tyrosine's "caffeine crash" /
// "depletes dopamine precursors" stack notes had no trial (our tyrosine
// record mentions neither caffeine nor a crash). Phosphatidylserine "carries
// an FDA-qualified health claim for cognitive decline" now gives the FDA's 13
// May 2003 wording. The Bacopa aging cards' "Multiple RCTs across age groups
// ... (Stough et al., Calabrese et al.)" now give Pase 2012 (22747190) and
// Calabrese 2008 (18611150). Rhodiola's "standardised to 3% rosavins, 1%
// salidroside)" dose and "Soviet-era research as the optimal therapeutic
// ratio" now follow Ishaque 2012 (PMC3541197; natural ratio about 3:1) and
// the SHR-5 trials; caffeine "one of the most extensively studied", the JP
// FFC "one of the largest functional supplement categories" (now 563 of the
// 6,451 active notifications, CAA export 2026-10-06), "la categoría más
// estudiada", Huperzine A's "sharpest acute improvement" ("mejora aguda más
// marcada"; its trials ran 4-16 weeks) and phosphatidylserine's "signal
// transduction" / "transmission speed" claims, and the LATAM studying FAQ's
// "combinación de concentración más rentable" had no source. The attributed
// lines stay: Qualia's "The theory is synergistic optimisation", AOR's quoted
// "work synergistically" and "The argument for: synergistic effects".
// Separately, a JSX attribute in double quotes does not process escapes, so
// a \' inside heroParagraph="..." rendered as a literal backslash (GCC memory
// and aging heroes); no heroParagraph="..." may contain \'.
//
// Round sixteen, U5 (2026-10-12). Leftover L-theanine + caffeine superiority
// claims: the L-theanine studySummary said RCTs and Camfield 2014 "show the
// combination beats either compound alone", its benefits list "Better
// attention with caffeine than caffeine alone", and the L-theanine/caffeine
// stack notes and TruBrain's US record "more than either alone" / "than
// caffeine alone". Camfield 2014 (PMID 24946991, 11 placebo-controlled
// studies) compared the combination with placebo; Kahathuduwa 2016 (26869148)
// found "No significant theanine × caffeine interaction" and "additive
// effects"; Foxe 2012 (22326943) found "The combined treatment did not confer
// any additional benefits over either compound alone". The trials we checked
// used 50-250mg L-theanine with 40-250mg caffeine, so the stack notes no longer
// give a 1:1 to 1.7:1 range. The US natural-Adderall-alternatives citicoline
// card said "RCTs show attention benefits in healthy adults at
// 250-500mg/day" and cited Spiers 1996 (8624220, "Citicoline improves verbal
// memory in aging"); the Cochrane review (15846601) found "no evidence of a beneficial
// effect of CDP-choline on attention", which is the card's citation now.
// Performance Lab Mind's US record said Sharp-PS Green "targets the
// FDA-qualified claim for cognitive decline"; it now gives the FDA's 13 May
// 2003 wording. Rhodiola's FAQ asked "What does 3% rosavins / 1% salidroside
// mean?" while its answer says the trials state no marker percentages.
//
// Round sixteen, U6 (2026-10-13). The L-theanine clinicalDose and its
// ideal-ratio FAQ still said the caffeine trials used "roughly 1:1 to 1.7:1"
// theanine to caffeine. The positive trials (PubMed, checked 2026-10-12) used
// 97-250mg theanine with 40-160mg caffeine: Owen 2008 and Kelly 2008 100mg
// with 50mg, Giesbrecht 2010 and Einöther 2010 97mg with 40mg, Haskell
// (18006208) 250mg with 150mg, Kahathuduwa 2016 and 2017 200mg with 160mg.
// With the null trials (Dodd 2015 50mg/75mg, Foxe 2012 100mg/50mg, Rogers
// 2008 200mg/250mg) the range is 50-250mg theanine with 40-250mg caffeine, so
// both now give mg doses. The With Caffeine note's "Haskell 2008" now reads
// "Haskell 2007", as the record's source list and FAQ do.
//
// Round sixteen, U7 (2026-10-13). Review leftovers. Spiers 1996 (PMID
// 8624220): the crossover was 32 of the 95 participants, 2,000mg a day for 2
// months, and improved immediate and delayed recall, not "verbal memory"
// ("memoria verbal"). The Cochrane review (15846601) covers older adults with
// chronic cerebral disorders ("found no attention benefit"), and we did not
// check whether other acute citicoline attention trials exist ("the only acute
// attention trial" / "the only acute healthy-adult attention RCT"); the focus
// pages dated Haskell (18006208) 2008, where citations.ts and the L-theanine
// record say 2007. The guides said L-theanine can "blunt some of the
// anxiogenic" effects of caffeine, "a pairing with reasonable support from
// multiple RCTs" (Rogers 2007, 17891480: theanine "did not significantly
// affect jitteriness"), that it is "the strongest nootropic intervention for
// alpha wave induction" (our L-theanine page cites one MEG trial, positive at
// 2 hours and only in higher trait anxiety) and that Bacopa "needs about 12
// weeks" (Pase 2012's six trials all lasted 12 weeks; that is trial length,
// not time to effect). The AU memory FAQ said phosphatidylserine "has good
// evidence for memory"; the EU pages said the FDA "permits a qualified "may
// reduce risk of dementia" claim" and LATAM that it "solo permite una
// declaración calificada" (the 13 May 2003 letter allows two qualified claims,
// each with "FDA concludes that there is little scientific evidence supporting
// this claim"); the US Adderall guide called caffeine + L-theanine
// "well-replicated"; Performance Lab Mind's whatToExpect promised "improved
// working memory from citicoline and tyrosine" within 30-60 minutes; and the
// Bacopa aging cards left out that Calabrese 2008 (18611150) found the
// delayed-recall benefit after controlling for baseline cognitive deficit.
// Each Spanish twin has its own pattern.
const ROUND_SIXTEEN_SOURCES = [
  ...ROUND_THIRTEEN_SOURCES,
  ...walk(resolve(REPO_ROOT, 'packages/ui/src/templates')),
];

const ROUND_SIXTEEN_UNSOURCED: RegExp[] = [
  /without the (spike-and-)?crash/i,
  /best-evidenced nootropic combination/i,
  /combinación nootrópica con mayor respaldo/i,
  /\bmost (\w+ )?users report\b/i,
  /1:1 L-theanine \+ caffeine effect/i,
  /closest match to the evidence-backed ratio/i,
  /to smooth the curve/i,
  /\bsame synergy\b/i,
  /most evidence-backed focus stack/i,
  // U2: focus and memory evidence rankings and the leftovers listed above.
  /most[- ]evidence[- ]backed/i,
  /\b1:2 to 2:1\b/,
  /strongest replication evidence/i,
  /best-replicated/i,
  /most[- ]replicated/i,
  /best-evidenced (ingredient|botanical)/i,
  /used in most clinical trials/i,
  /world's oldest population/i,
  /FDA qualified health claim for cognitive function/i,
  /strongest age-related memory claim/i,
  /\bhas strong evidence in middle-aged/i,
  /Citicoline at 250[–-]500mg also has multiple RCTs/i,
  /ingrediente con mayor respaldo de evidencia/i,
  // U3: FDA phosphatidylserine wording, PS and citicoline trial claims, the
  // SEA Bacopa superlative, and the LATAM Spanish twins.
  /FDA permits a qualified health claim/i,
  /suggests that PS may reduce the risk/i,
  /Multiple RCTs show attention and cognitive-effort/i,
  /verbal memory and processing speed at 250/i,
  /Multiple RCTs in 50[–-]80-year-olds/i,
  /Most RCT evidence is in 50[–-]80/i,
  /strongest age-related cognitive evidence/i,
  /most extensively studied botanical/i,
  /proporción 1:2 a 2:1/i,
  /mejor replicad/i,
  /más replicad/i,
  /más de 30 años/i,
  /nootrópico para (concentración|memoria) con más evidencia/i,
  /beneficios en atención y esfuerzo cognitivo/i,
  /memoria verbal y velocidad de procesamiento a 250/i,
  /ensayos clínicos en personas de 50[–-]80 años/i,
  /evidencia más fuerte sobre apoyo cognitivo/i,
  /La FDA permite una declaración (de salud calificada|calificada de salud)/i,
  /sugiere que la PS puede reducir/i,
  // U4: synergy, user reports, crash, PS FDA, Bacopa aging, Rhodiola and the
  // guide, JP and LATAM leftovers listed above.
  /for the synergistic effect/i,
  /efectos? sinérgicos?/i,
  /L-theanine \+ caffeine synergy/i,
  /students prefer/i,
  /'Caffeine Synergy'/,
  /more than either compound alone/i,
  /synergistic effects may partially compensate/i,
  /Synergistic under stress/i,
  /for synergistic effects/i,
  /attention synergy/i,
  /no energy spike/i,
  /effects are gentle/i,
  /caffeine crash/i,
  /reducing the crash/i,
  /depletes dopamine precursors/i,
  /FDA-qualified health claim for cognitive decline/i,
  /Multiple RCTs across age groups/i,
  /Múltiples ensayos clínicos en distintos grupos de edad/i,
  /standardised to 3% rosavins, 1% salidroside\)/i,
  /Soviet-era research as the optimal/i,
  /one of the most extensively studied/i,
  /one of the largest functional supplement categories/i,
  /la categoría más estudiada/i,
  /mejora aguda más marcada/i,
  /sharpest acute improvement/i,
  /signal transduction speed/i,
  /velocidad de transducción de señales/i,
  /Phosphatidylserine supports transmission speed/i,
  /favorece la velocidad de transmisión/i,
  /combinación de concentración más rentable/i,
  // U5: L-theanine + caffeine superiority, citicoline attention, PS FDA and
  // the Rhodiola FAQ question listed below.
  /beats either compound alone/i,
  /more than either alone/i,
  /than caffeine alone/i,
  /RCTs show attention benefits in healthy adults/i,
  /targets the FDA-qualified claim/i,
  /What does 3% rosavins/i,
  // U6: the L-theanine clinicalDose and ideal-ratio FAQ ratio range.
  /roughly 1:1 to 1\.[67]:1/i,
  // U7: the review leftovers listed above, with their Spanish twins.
  /improved verbal memory in a follow-up crossover/i,
  /mejoraron la memoria verbal en un ensayo cruzado posterior/i,
  /found no attention benefit/i,
  /no encontró beneficio en la atención/i,
  /the only acute (attention trial|healthy-adult attention RCT)/i,
  /el único ensayo agudo sobre atención/i,
  /Haskell 2008, PubMed 18006208/,
  /well[- ]replicated/i,
  /blunt some of the anxiogenic/i,
  /reasonable support from multiple RCTs/i,
  /atenuar parte de los efectos ansiogénicos/i,
  /respaldo razonable de varios ECA/i,
  /strongest nootropic intervention/i,
  /intervención nootrópica más potente/i,
  /needs about 12 weeks/i,
  /necesita unas 12 semanas/i,
  /Phosphatidylserine has good evidence for memory/i,
  /permits a qualified "may reduce risk of dementia"/i,
  /US-style "may reduce risk of dementia"/i,
  /solo permite una declaración calificada/i,
  /improved working memory from citicoline and tyrosine/i,
  /12 weeks improved delayed word recall\./i,
  /12 semanas mejoraron el recuerdo diferido de palabras\./i,
];

// A double-quoted JSX attribute does not process escapes, so \' in one
// renders as a backslash and an apostrophe.
const HERO_ATTR_ESCAPED_QUOTE = /heroParagraph="[^"]*\\'/;

describe('round sixteen: energy, stack, focus- and memory-page claims follow the cited trials', () => {
  test('scanned every file under apps/*/src, packages/data/src and packages/ui/src/templates', () => {
    expect(ROUND_SIXTEEN_SOURCES.length).toBeGreaterThan(ROUND_THIRTEEN_SOURCES.length);
    for (const f of [
      'apps/us/src/app/best-nootropics-for-energy/page.tsx',
      'apps/gcc/src/app/best-nootropics-for-studying/page.tsx',
      'apps/jp/src/app/best-nootropics-for-focus/page.tsx',
      'packages/data/src/guides.ts',
      'packages/data/src/guides-es.ts',
      'packages/data/src/products-us.json',
      'packages/ui/src/templates/QuizFlow.tsx',
      'apps/us/src/app/best-nootropics-for-focus/page.tsx',
      'apps/gcc/src/app/best-nootropics-for-memory/page.tsx',
      'apps/jp/src/app/best-nootropics-for-aging/page.tsx',
      'packages/data/src/ingredients.ts',
      'packages/data/src/products-sea.json',
      'apps/us/src/app/best-nootropics-for-aging/page.tsx',
      'apps/au/src/app/best-nootropics-for-memory/page.tsx',
      'apps/latam/src/app/best-nootropics-for-focus/page.tsx',
      'apps/latam/src/app/best-nootropics-for-memory/page.tsx',
      'apps/latam/src/app/best-nootropics-for-aging/page.tsx',
      // U4
      'apps/latam/src/app/best-nootropics-for-studying/page.tsx',
      'apps/gcc/src/app/best-nootropics-for-aging/page.tsx',
      'apps/au/src/app/best-nootropics-for-focus/page.tsx',
      'packages/data/src/products-au.json',
      'packages/data/src/products-ca.json',
      'packages/data/src/products-eu.json',
      // U5
      'apps/us/src/app/natural-adderall-alternatives/page.tsx',
      // U7
      'apps/us/src/app/guides/nootropics-vs-adderall/page.tsx',
      'apps/eu/src/app/best-nootropics-for-aging/page.tsx',
      'apps/eu/src/app/best-nootropics-for-memory/page.tsx',
      'apps/ca/src/app/best-nootropics-for-memory/page.tsx',
    ]) expect(ROUND_SIXTEEN_SOURCES.some(p => relative(REPO_ROOT, p) === f), f).toBe(true);
  });

  test('the patterns catch the removed wording, and every pattern catches some of it', () => {
    const removed = [
      'Best Nootropics for Energy 2026: Sustained Cognitive Energy Without the Crash',
      'Caffeine + L-theanine, Rhodiola, B-vitamins, citicoline — what actually works without the crash.',
      'Nootropic stacks layer caffeine (where present) with L-theanine to smooth the curve, plus longer-acting ingredients (Rhodiola, citicoline) that support sustained cognitive output without the spike-and-crash pattern.',
      'If you want sustained cognitive energy without the spike-and-crash pattern of energy drinks, the answer is layered',
      'Sustained drive without the crash',
      'Caffeine-free design — pair with your own coffee or matcha for the 1:1 L-theanine + caffeine effect.',
      'The caffeinated SKU includes 100mg caffeine + 200mg L-theanine — the closest match to the evidence-backed ratio.',
      'The best-evidenced nootropic combination is L-Theanine + Caffeine: a meta-analysis of 11 RCTs found',
      'La combinación nootrópica con mayor respaldo científico es L-Theanine + Caffeine: un metaanálisis de 11 ECA encontró',
      'paired with Arabic coffee or matcha — same synergy without committing to a caffeine-loaded supplement.',
      'The most evidence-backed focus stack available to Japanese buyers.',
      'Most users report this stack feels cleaner than multi-ingredient formulas — fewer ingredients also means fewer GI or jitter complaints.',
      // U2
      'What is the most evidence-backed nootropic for focus available in Canada?',
      'What is the most evidence-backed focus nootropic available in SEA?',
      'L-Theanine + Caffeine (1:2 to 2:1 ratio)',
      'L-theanine paired with caffeine (1:2 to 2:1 ratio) has the strongest replication evidence in healthy adults — Owen et al. 2008 and multiple follow-ups.',
      'Among the best-replicated cognitive findings: L-theanine paired with caffeine improves attention switching and reduces mental fatigue',
      'Citicoline at 250–500mg also has multiple RCTs and Novel Food authorisation.',
      'The most-replicated memory ingredient in nootropics. Multiple double-blind RCTs in adults show improved memory consolidation and recall after 8–12 weeks',
      'Bacopa Monnieri at 300mg standardized to 50% bacosides has the most replicated RCT evidence for memory consolidation in healthy adults.',
      'Memory is the use case where nootropics have the most replicated evidence — primarily from Bacopa Monnieri RCTs over 30+ years.',
      'Phosphatidylserine has the FDA qualified health claim for cognitive function in elderly.',
      'Phosphatidylserine has the strongest age-related memory claim and Mind Lab Pro delivers 100mg at clinical dose.',
      'DHA is listed as a functional ingredient in 105 of the 563 active Foods with Function Claims (FFC) notifications whose claim mentions memory or cognitive function; it has strong evidence in middle-aged and older adults.',
      'Bacopa Monnieri (300mg, standardised to at least 50% bacosides) is the best-evidenced ingredient for improving the speed and durability of memory encoding — but requires 8–12 weeks.',
      'Bacopa Monnieri (300mg, estandarizada al menos al 50% de bacósidos) es el ingrediente con mayor respaldo de evidencia para mejorar la velocidad y durabilidad de la codificación de memoria',
      'Built on Bacopa Monnieri — the best-evidenced botanical for memory',
      'Always verify standardisation: 3% rosavins and 1% salidroside is the established ratio used in most clinical trials.',
      'The label dose of two 125mg capsules daily (250mg/day) sits just below the 300mg/day used in most clinical trials.',
      "Japan has the world's oldest population by median age, and age-related cognitive support is one of the largest functional supplement categories",
      // U3
      'The FDA permits a qualified health claim that PS may reduce risk of dementia and cognitive dysfunction in elderly.',
      'The US FDA permits a qualified health claim for PS supporting cognitive function in elderly adults;',
      'The FDA allows phosphatidylserine to carry a qualified claim that "very limited and preliminary scientific research suggests that PS may reduce the risk of dementia or cognitive dysfunction in the elderly."',
      'Multiple RCTs show attention and cognitive-effort benefits in healthy adults at 250–500mg/day.',
      'RCTs in older adults with subjective cognitive complaints show improvements in verbal memory and processing speed at 250–500mg/day for 12+ weeks.',
      'Multiple RCTs in 50–80-year-olds at 100–300mg/day show improvements in memory, processing speed, and cognitive complaints.',
      'Most RCT evidence is in 50–80-year-olds at 100–300mg/day.',
      'The strongest age-related cognitive evidence in this category.',
      'Bacopa Monnieri is the most extensively studied botanical for memory.',
      'L-Teanina + Cafeína (proporción 1:2 a 2:1)',
      'Uno de los hallazgos cognitivos mejor replicados: la L-teanina combinada con cafeína mejora la atención y reduce la fatiga mental',
      'El ingrediente para memoria más replicado en nootrópicos.',
      'La memoria es el caso de uso donde los nootrópicos tienen la evidencia más replicada — principalmente de ensayos clínicos con Bacopa Monnieri durante más de 30 años.',
      '¿Cuál es el nootrópico para concentración con más evidencia?',
      '¿Cuál es el nootrópico para memoria con más evidencia?',
      'Múltiples ensayos clínicos muestran beneficios en atención y esfuerzo cognitivo en adultos sanos a 250–500mg/día.',
      'Ensayos clínicos en adultos mayores con quejas cognitivas subjetivas muestran mejoras en memoria verbal y velocidad de procesamiento a 250–500mg/día durante 12+ semanas.',
      'Múltiples ensayos clínicos en personas de 50–80 años a 100–300mg/día muestran mejoras en memoria, velocidad de procesamiento y quejas cognitivas.',
      'La evidencia más fuerte sobre apoyo cognitivo asociado a la edad en esta categoría.',
      'La FDA permite una declaración calificada de salud que indica que la PS puede reducir el riesgo de demencia y disfunción cognitiva en personas mayores.',
      'La FDA permite una declaración de salud calificada para PS en función cognitiva en adultos mayores.',
      'investigación científica muy limitada y preliminar sugiere que la PS puede reducir el riesgo de demencia o disfunción cognitiva en adultos mayores',
      // U4
      'Caffeine-free design lets you pair it with your own coffee or matcha for the synergistic effect.',
      'El diseño sin cafeína permite combinarlo con tu café o mate local para lograr el efecto sinérgico.',
      'Una guía práctica para combinar suplementos nootrópicos con efectos sinérgicos — incluyendo reglas de combinación segura',
      'It pairs well with Arabic coffee or matcha for the L-theanine + caffeine synergy without committing to a stimulant-loaded supplement.',
      'GCC note: many students prefer L-theanine alone, paired with Arabic coffee or matcha',
      "{ effect: 'Caffeine Synergy', evidenceStrength: 'strong', magnitude: 'large', studies: 3 }",
      'Combined with caffeine, it improves attention measures more than either compound alone.',
      'However, in a multi-ingredient formula with Citicoline and Tyrosine, the synergistic effects may partially compensate.',
      'Both support dopamine availability — Oat Straw by slowing breakdown (MAO-B), Tyrosine by providing precursor. Synergistic under stress.',
      'A practical guide to combining nootropic supplements for synergistic effects — including safe pairing rules',
      'L-theanine+caffeine attention synergy, with an honest jitteriness/anxiety caveat',
      'Mind Lab Pro is a long-game supplement -- most users report subtle but sustained improvement rather than dramatic day-one effects.',
      'Caffeine-free means no energy spike -- effects are gentle. At 4-6 weeks: most Canadian users report consistent mild improvements in word retrieval and task focus.',
      "Caffeine depletes dopamine precursors over time. Taking L-Tyrosine with caffeine may reduce the 'caffeine crash' by maintaining dopamine substrate levels.",
      'Caffeine depletes dopamine precursors over time. L-Tyrosine replenishes substrate, reducing the crash and maintaining sustained focus.',
      'Sustained cognitive energy without the caffeine crash. What evidence actually shows.',
      'Phosphatidylserine supports neuronal membrane fluidity and carries an FDA-qualified health claim for cognitive decline.',
      'Multiple RCTs across age groups show memory consolidation benefits. Studies specifically in older adults (Stough et al., Calabrese et al.) show retention and recall improvements after 8–12 weeks',
      'Múltiples ensayos clínicos en distintos grupos de edad muestran beneficios en consolidación de memoria.',
      '200–600mg/day (standardised to 3% rosavins, 1% salidroside)',
      'The 3:1 ratio mirrors what is found in wild-harvested Rhodiola rosea and was established in Soviet-era research as the optimal therapeutic ratio.',
      'Caffeine is one of the most extensively studied psychoactive compounds.',
      'age-related cognitive support is one of the largest functional supplement categories under the FFC (機能性表示食品) framework',
      '(5) Aminoácidos (L-Theanine, L-Tyrosine): precursores de neurotransmisores; la categoría más estudiada y más segura.',
      'Huperzine A (100mcg, en ciclos) produce la mejora aguda más marcada en la recuperación al preservar la Acetylcholine. Phosphatidylserine favorece la velocidad de transmisión.',
      'Huperzine A (100mcg, cycled) produces the sharpest acute improvement in recall by preserving acetylcholine. Phosphatidylserine supports transmission speed.',
      'Phosphatidylserine improves signal transduction speed across synapses.',
      'Phosphatidylserine mejora la velocidad de transducción de señales entre las sinapsis.',
      'café (o mate) + L-teanina (proporción 1:2) es la combinación de concentración más rentable y respaldada por evidencia.',
      // U5
      'With caffeine, RCTs (Haskell et al., 2007; Kahathuduwa 2016) and an 11-RCT meta-analysis (Camfield 2014) show the combination beats either compound alone on attention and reaction time.',
      'Better attention with caffeine than caffeine alone',
      'Trials used 200–250mg theanine with 150–160mg caffeine (roughly 1:1 to 1.7:1). The combination improved attention and reaction time more than either alone;',
      'Trials used roughly 1:1 to 1.7:1 theanine:caffeine and found better attention than caffeine alone;',
      'In trials, L-Theanine combined with caffeine improved attention and reaction time more than either alone,',
      'No mechanistic overlap with Adderall, but RCTs show attention benefits in healthy adults at 250–500mg/day, and good tolerability profile alongside other ingredients.',
      'Sharp-PS Green phosphatidylserine targets the FDA-qualified claim for cognitive decline and supports neuronal membrane fluidity.',
      'What does 3% rosavins / 1% salidroside mean?',
      // U6
      '100–200mg/day (trials pairing it with caffeine used roughly 1:1 to 1.7:1 theanine:caffeine)',
      'No trial has established an ideal ratio. The positive combination trials used roughly 1:1 to 1.7:1 theanine to caffeine — for example 250mg theanine with 150mg caffeine (Haskell 2007) and 200mg with 160mg (Kahathuduwa 2016).',
      // U7
      'In one trial in adults aged 50–85 (Spiers 1996, PubMed 8624220), 1,000mg a day for 3 months improved delayed recall only in those with relatively inefficient memories, and 2,000mg a day improved verbal memory in a follow-up crossover.',
      'En un ensayo con adultos de 50 a 85 años (Spiers 1996, PubMed 8624220), 1000mg al día durante 3 meses mejoraron el recuerdo diferido solo en quienes tenían una memoria relativamente ineficiente, y 2000mg al día mejoraron la memoria verbal en un ensayo cruzado posterior.',
      'Our citicoline page rates its attention evidence as mixed: the Cochrane review found no attention benefit, and the only acute attention trial in healthy adults gave it together with caffeine.',
      'Nuestra página sobre la citicolina califica como mixta su evidencia sobre la atención: la revisión Cochrane no encontró beneficio en la atención, y el único ensayo agudo sobre atención en adultos sanos la administró junto con cafeína.',
      'The Cochrane review found no evidence of benefit on attention; the only acute healthy-adult attention RCT gave citicoline together with caffeine, so citicoline’s own effect cannot be isolated.',
      'and ratings of mental fatigue (Haskell 2008, PubMed 18006208: 250mg with 150mg).',
      'Caffeine + L-theanine — well-replicated',
      'When combined with caffeine, L-theanine can blunt some of the anxiogenic (anxiety-inducing) effects of caffeine while preserving its attention-sharpening and reaction-time benefits, a pairing with reasonable support from multiple RCTs.',
      'Cuando se combina con cafeína, L-Theanine puede atenuar parte de los efectos ansiogénicos (inductores de ansiedad) de la cafeína, al tiempo que preserva sus beneficios para agudizar la atención y el tiempo de reacción; una combinación con un respaldo razonable de varios ECA.',
      'L-Theanine is the strongest nootropic intervention for alpha wave induction.',
      'L-Theanine es la intervención nootrópica más potente para la inducción de ondas alfa.',
      'Bacopa Monnieri improved 9 of 17 memory free-recall tests in a systematic review of six 12-week trials at 300–450mg extract a day (Pase 2012), and needs about 12 weeks;',
      'Bacopa Monnieri mejoró 9 de 17 pruebas de recuerdo libre de memoria en una revisión sistemática de seis ensayos de 12 semanas con 300–450mg de extracto al día (Pase 2012), y necesita unas 12 semanas;',
      'Phosphatidylserine has good evidence for memory in older adults.',
      'Important: unlike the US (where the FDA permits a qualified "may reduce risk of dementia" claim), EFSA has rejected several PS health claims',
      'The EU does not authorise the US-style "may reduce risk of dementia" qualified claim — EFSA has rejected several PS health claims',
      'Para la fosfatidilserina, la FDA solo permite una declaración calificada de que "may reduce the risk of cognitive dysfunction in the elderly"',
      'Within 30-60 minutes: subtle calm focus and improved working memory from citicoline and tyrosine.',
      'in adults aged 65 and over (Calabrese 2008, PubMed 18611150), 300mg a day for 12 weeks improved delayed word recall.',
      'en adultos de 65 años o más (Calabrese 2008, PubMed 18611150), 300mg al día durante 12 semanas mejoraron el recuerdo diferido de palabras.',
    ];
    for (const s of removed) expect(ROUND_SIXTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(true);
    for (const re of ROUND_SIXTEEN_UNSOURCED) expect(removed.some(s => re.test(s)), String(re)).toBe(true);
    // The replacement wording passes.
    for (const s of [
      'Best Nootropics for Energy 2026: Sustained Cognitive Energy',
      'Caffeine + L-theanine, Rhodiola, B-vitamins, citicoline — and what the trials we cite found.',
      'Energy drinks rely on caffeine + sugar (and sometimes B-vitamins) for an acute lift. Nootropic stacks pair caffeine (where present) with L-theanine and add longer-acting ingredients such as Rhodiola and citicoline. We cite no trial comparing these stacks with energy drinks.',
      'For sustained cognitive energy, this page looks at layered stacks: caffeine + L-theanine for the acute effect',
      'Sustained drive through long days',
      'Caffeine-free design — its 100mg L-theanine can be paired with your own coffee or matcha (Owen 2008 tested 100mg L-theanine with 50mg caffeine).',
      'The caffeinated SKU includes 100mg caffeine + 200mg L-theanine — the same 1:2 ratio Owen 2008 tested (50mg caffeine with 100mg L-theanine).',
      'Versus placebo, for L-Theanine + Caffeine, a meta-analysis of 11 RCTs found moderate improvements in alertness and attention-switching accuracy in the first 2 hours after dosing. Foxe 2012 found no added benefit over either compound alone.',
      'Frente a placebo, para L-Theanine + Caffeine, un metaanálisis de 11 ECA encontró mejoras moderadas en el estado de alerta y en la precisión al alternar la atención durante las 2 primeras horas tras la dosis. Foxe 2012 no encontró ningún beneficio adicional frente a cada compuesto por separado.',
      'paired with Arabic coffee or matcha — the same pairing without a caffeine-containing supplement.',
      'priced in US dollars.',
      'At 8-12 weeks: cumulative neuroprotective benefits from PS and pine bark. Best for users who already supplement separately',
      // U2
      'Which nootropic ingredients have trial evidence for focus available in Canada?',
      'Which nootropic ingredients have trial evidence for focus in SEA?',
      'L-Theanine + Caffeine',
      'L-theanine with caffeine: in trials in healthy adults the pair improved attention-switching accuracy (Owen 2008, 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626, 97mg with 40mg), though Foxe 2012 (PubMed 22326943) found no added benefit over either compound alone.',
      'In controlled trials in healthy adults, the pair improved attention-switching accuracy (Owen 2008: 100mg L-theanine with 50mg caffeine; Giesbrecht 2010, PubMed 21040626: 97mg with 40mg) and ratings of mental fatigue (Haskell 2007, PubMed 18006208: 250mg with 150mg).',
      'Our citicoline page rates its attention evidence as mixed: the acute attention trial in healthy adults that we cite gave it together with caffeine.',
      'In a systematic review of six randomised trials (Pase 2012, PubMed 22747190), all lasting 12 weeks at 300–450mg extract a day, Bacopa improved 9 of 17 tests of memory free recall.',
      'Bacopa Monnieri: in a systematic review of six 12-week randomized trials at 300–450mg extract a day (Pase 2012, PubMed 22747190), it improved 9 of 17 tests of memory free recall, and the authors call the research \'in its infancy\'.',
      'For memory, the Bacopa Monnieri evidence we cite is a systematic review of six 12-week randomized trials (Pase 2012).',
      'For phosphatidylserine, the FDA allows only a qualified claim that it \'may reduce the risk of cognitive dysfunction in the elderly\', followed by \'FDA concludes that there is little scientific evidence supporting this claim\' (FDA letter, 13 May 2003).',
      'Phosphatidylserine is in Mind Lab Pro at 100mg per serving; the single-ingredient phosphatidylserine trials on our ingredient page used 100–300mg a day.',
      'our DHA page rates the evidence for age-related memory decline as moderate (Yurko-Mauro 2010: 900mg a day for 24 weeks in adults 55 and over).',
      'Bacopa Monnieri improved 9 of 17 memory free-recall tests in a systematic review of six 12-week trials at 300–450mg extract a day (Pase 2012), and its trials measured memory after 12 weeks; our reference dose is 300mg standardised to at least 50% bacosides.',
      'Bacopa Monnieri mejoró 9 de 17 pruebas de recuerdo libre de memoria en una revisión sistemática de seis ensayos de 12 semanas con 300–450mg de extracto al día (Pase 2012), y sus ensayos midieron la memoria a las 12 semanas; nuestra dosis de referencia es de 300mg, estandarizada al menos al 50% de bacósidos.',
      'Built on Bacopa Monnieri, which improved memory free recall in a systematic review of six 12-week trials (Pase 2012)',
      'Look for a stated rosavin and salidroside standardisation on the label. The trials in our record that name an extract used SHR-5, and their abstracts do not state its rosavin or salidroside percentages.',
      'The label dose of two 125mg capsules daily (250mg/day) is below the 300–450mg/day range of the trials in the systematic review we cite (Pase 2012).',
      "Japan's median age, 49.4 years in 2024, is the highest of any country or area with at least a million people (UN World Population Prospects 2024)",
      // U3
      "The FDA allows phosphatidylserine only qualified claims that it 'may reduce the risk of dementia' or 'cognitive dysfunction in the elderly', each followed by 'FDA concludes that there is little scientific evidence supporting this claim' (FDA letter, 13 May 2003).",
      'The FDA allows phosphatidylserine to carry a qualified claim that "Very limited and preliminary scientific research suggests that phosphatidylserine may reduce the risk of dementia in the elderly", which must be followed by "FDA concludes that there is little scientific evidence supporting this claim."',
      'Our citicoline page rates its attention evidence as mixed: the Cochrane review found no evidence of an attention benefit in older adults with chronic cerebral disorders, and the acute attention trial in healthy adults that we cite gave it together with caffeine.',
      'In one trial in adults aged 50–85 (Spiers 1996, PubMed 8624220), 1,000mg a day for 3 months improved delayed recall only in those with relatively inefficient memories, and in a follow-up crossover of 32 of those participants, 2,000mg a day for 2 months improved immediate and delayed recall.',
      'RCTs in older adults at 100–300mg a day report memory benefits, though often only in subgroups (see our phosphatidylserine page).',
      'Bacopa Monnieri is a botanical with trial evidence for memory free recall (Pase 2012).',
      'L-Teanina + Cafeína',
      'En ensayos controlados en adultos sanos, la combinación mejoró la precisión al alternar la atención entre tareas (Owen 2008: 100mg de L-teanina con 50mg de cafeína; Giesbrecht 2010, PubMed 21040626: 97mg con 40mg) y las puntuaciones de fatiga mental (Haskell 2007, PubMed 18006208: 250mg con 150mg).',
      'En una revisión sistemática de seis ensayos aleatorizados (Pase 2012, PubMed 22747190), todos de 12 semanas con 300–450mg de extracto al día, la Bacopa mejoró 9 de 17 pruebas de recuerdo libre de memoria.',
      'Para la memoria, la evidencia sobre Bacopa Monnieri que citamos es una revisión sistemática de seis ensayos aleatorizados de 12 semanas (Pase 2012).',
      '¿Qué ingredientes nootrópicos tienen evidencia de ensayos para la concentración?',
      'Nuestra página sobre la citicolina califica como mixta su evidencia sobre la atención: la revisión Cochrane no encontró evidencia de un beneficio en la atención en adultos mayores con trastornos cerebrales crónicos, y el ensayo agudo sobre atención en adultos sanos que citamos la administró junto con cafeína.',
      'En un ensayo con adultos de 50 a 85 años (Spiers 1996, PubMed 8624220), 1000mg al día durante 3 meses mejoraron el recuerdo diferido solo en quienes tenían una memoria relativamente ineficiente, y en un ensayo cruzado posterior con 32 de esos participantes, 2000mg al día durante 2 meses mejoraron el recuerdo inmediato y diferido.',
      'Los ensayos clínicos en adultos mayores a 100–300mg al día reportan beneficios en la memoria, aunque a menudo solo en subgrupos (ver nuestra página sobre la fosfatidilserina).',
      'La FDA solo permite para la fosfatidilserina declaraciones calificadas de que "may reduce the risk of dementia" o "cognitive dysfunction in the elderly", cada una seguida de "FDA concludes that there is little scientific evidence supporting this claim" (carta de la FDA, 13 de mayo de 2003)',
      // U4
      'Caffeine-free design lets you pair it with your own coffee or matcha if you want caffeine alongside its L-theanine.',
      'El diseño sin cafeína permite combinarlo con tu café o mate local si quieres cafeína junto a su L-teanina.',
      'Una guía práctica para combinar suplementos nootrópicos — incluyendo reglas de combinación segura',
      'It pairs well with Arabic coffee or matcha if you want L-theanine with caffeine, without a stimulant-containing supplement.',
      'GCC note: L-theanine alone can be paired with Arabic coffee or matcha',
      "{ effect: 'With Caffeine', evidenceStrength: 'moderate', magnitude: 'moderate', studies: 4 }",
      'Combined with caffeine, it improved attention measures versus placebo in several trials, though Foxe 2012 found no added benefit over either compound alone.',
      'It sits in a multi-ingredient formula with Citicoline and Tyrosine, but it is still underdosed relative to the standalone evidence.',
      'A practical guide to combining nootropic supplements — including safe pairing rules',
      'L-theanine+caffeine attention effects versus placebo, with an honest jitteriness/anxiety caveat',
      'Mind Lab Pro is a long-game supplement: the Bacopa trials we cite measured memory after 12 weeks.',
      'Day one: subtle focus improvement, particularly for users new to cholinergic supplements. It contains no caffeine.',
      'Often paired with caffeine; we cite no trial of L-Tyrosine with caffeine.',
      'Sometimes paired with caffeine; we cite no trial of the pairing.',
      'Sustained cognitive energy: what the trials we cite found.',
      "Phosphatidylserine supports neuronal membrane fluidity; the FDA allows only a qualified claim that it may reduce the risk of dementia or cognitive dysfunction in the elderly, with the disclaimer that 'FDA concludes that there is little scientific evidence supporting this claim'.",
      'In a systematic review of six 12-week trials (Pase 2012, PubMed 22747190), Bacopa improved 9 of 17 memory free-recall tests; in adults aged 65 and over (Calabrese 2008, PubMed 18611150), 300mg a day for 12 weeks improved delayed word recall after controlling for baseline cognitive deficit.',
      'En una revisión sistemática de seis ensayos de 12 semanas (Pase 2012, PubMed 22747190), la Bacopa mejoró 9 de 17 pruebas de recuerdo libre de memoria; en adultos de 65 años o más (Calabrese 2008, PubMed 18611150), 300mg al día durante 12 semanas mejoraron el recuerdo diferido de palabras tras controlar el déficit cognitivo inicial.',
      '200–600mg/day (a standardised extract; the trials we cite used SHR-5)',
      'Rhodiola rosea naturally contains rosavins and salidrosides in about a 3:1 ratio, and preparations are made to reflect it (Ishaque 2012).',
      'A 2016 review (McLellan, Caldwell & Lieberman — a narrative review, not a meta-analysis) found low-to-moderate doses (~40–300mg) consistently improve alertness',
      '563 of the 6,451 active Foods with Function Claims (FFC, 機能性表示食品) notifications make a claim about memory or cognitive function (Consumer Affairs Agency database export, 2026-10-06)',
      '(5) Aminoácidos (L-Theanine, L-Tyrosine): precursores de neurotransmisores.',
      'Huperzine A (100mcg) bloquea la enzima que degrada la Acetylcholine; sus ensayos midieron efectos tras 4–16 semanas de dosis diaria, y no se encontró ningún ensayo de efecto agudo.',
      'Huperzine A (100mcg) blocks the enzyme that breaks down acetylcholine; its trials measured effects after 4–16 weeks of daily dosing, and no acute-onset trial was found.',
      'Phosphatidylserine is a phospholipid in neuronal cell membranes.',
      'Phosphatidylserine es un fosfolípido de las membranas de las neuronas.',
      'café (o mate) + L-teanina es un punto de partida sencillo: en Owen 2008 (PubMed 18681988), 50mg de cafeína con 100mg de L-teanina (una proporción 1:2) mejoraron la velocidad y la precisión',
      // U5
      'With caffeine, an 11-study meta-analysis (Camfield 2014) found moderate effects versus placebo on alertness and attention-switching accuracy; Kahathuduwa 2016 found additive effects with no interaction, and Foxe 2012 found no added benefit over either compound alone.',
      'Better attention with caffeine than with placebo in several trials',
      'The trials we cite used 50–250mg theanine with 40–250mg caffeine. Versus placebo, the combination improved attention measures in several trials, though Foxe 2012 found no added benefit over either compound alone;',
      'In several trials, L-Theanine combined with caffeine improved attention measures versus placebo, though Foxe 2012 found no added benefit over either compound alone,',
      'No mechanistic overlap with Adderall. Our citicoline page rates its attention evidence as mixed: the Cochrane review found no evidence of an attention benefit in older adults with chronic cerebral disorders, and the acute attention trial in healthy adults that we cite gave it together with caffeine.',
      "Sharp-PS Green phosphatidylserine supports neuronal membrane fluidity; the FDA allows only a qualified claim that phosphatidylserine may reduce the risk of dementia or cognitive dysfunction in the elderly, with the disclaimer that 'FDA concludes that there is little scientific evidence supporting this claim'.",
      'What do rosavins and salidroside mean on a Rhodiola label?',
      // U6
      '100–200mg/day (trials pairing it with caffeine used 50–250mg theanine with 40–250mg caffeine)',
      'No trial has established an ideal ratio. The positive combination trials used 97–250mg theanine with 40–160mg caffeine — for example 100mg theanine with 50mg caffeine (Owen 2008), 250mg with 150mg (Haskell 2007) and 200mg with 160mg (Kahathuduwa 2016).',
      // U7
      'Our citicoline page rates its attention evidence as mixed: the acute attention trial in healthy adults that we cite gave it together with caffeine.',
      'Nuestra página sobre la citicolina califica como mixta su evidencia sobre la atención: el ensayo agudo sobre atención en adultos sanos que citamos la administró junto con cafeína.',
      'The Cochrane review found no evidence of an attention benefit in older adults with chronic cerebral disorders; the acute attention trial in healthy adults that we cite gave citicoline together with caffeine, so citicoline’s own effect cannot be isolated.',
      'Caffeine + L-theanine — several placebo-controlled trials (Owen 2008)',
      'When combined with caffeine, the pair improved attention measures versus placebo in several trials, but in a controlled trial (Rogers 2007) theanine did not significantly reduce caffeine-induced jitteriness.',
      'Con cafeína, la combinación mejoró las medidas de atención frente a placebo en varios ensayos, pero en un ensayo controlado (Rogers 2007) L-Theanine no redujo significativamente el nerviosismo causado por la cafeína.',
      'The alpha-wave (MEG) trial on our L-Theanine page found higher alpha activity at 2 hours, and only in people with higher trait anxiety.',
      'El ensayo sobre ondas alfa (MEG) de nuestra página de L-Theanine encontró mayor actividad alfa a las 2 horas, y solo en personas con mayor ansiedad rasgo.',
      "Important: unlike the US (where the FDA allows only qualified claims that phosphatidylserine 'may reduce the risk of dementia' or 'cognitive dysfunction in the elderly', with the disclaimer 'FDA concludes that there is little scientific evidence supporting this claim'), EFSA has rejected several PS health claims",
      "The EU does not authorise US-style qualified claims (the FDA allows only qualified claims that phosphatidylserine 'may reduce the risk of dementia' or 'cognitive dysfunction in the elderly', with the disclaimer 'FDA concludes that there is little scientific evidence supporting this claim') — EFSA has rejected several PS health claims",
      'Para la fosfatidilserina, la FDA solo permite declaraciones calificadas, como que "may reduce the risk of cognitive dysfunction in the elderly"',
      'Within 30-60 minutes: subtle calm focus. Within 2-4 weeks: noticeable mental endurance under cognitive load and stress.',
      // Attributed rationale that stays (not our claim).
      'The theory is synergistic optimisation across all cognitive systems simultaneously.',
      'work synergistically to support the function of mitochondria',
      'The argument for: synergistic effects across multiple cognitive pathways.',
    ]) expect(ROUND_SIXTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(false);
  });

  test('no data, app or template source uses the removed wording (whitespace-normalised)', () => {
    const hits = ROUND_SIXTEEN_SOURCES.flatMap(file =>
      normalisedMatchLines(readFileSync(file, 'utf8'), ROUND_SIXTEEN_UNSOURCED).map(
        line => `${relative(REPO_ROOT, file)}:${line}`,
      ),
    );
    expect(hits).toEqual([]);
  });

  test('no heroParagraph="..." attribute contains \\\' (it renders as a backslash)', () => {
    expect(HERO_ATTR_ESCAPED_QUOTE.test(`heroParagraph="not just \\'does it work?\\'"`)).toBe(true);
    expect(HERO_ATTR_ESCAPED_QUOTE.test(`heroParagraph="not just 'does it work?'"`)).toBe(false);
    const pages = ROUND_SIXTEEN_SOURCES.filter(p => p.endsWith('.tsx'));
    const heroPages = pages.filter(p => readFileSync(p, 'utf8').includes('heroParagraph="'));
    expect(heroPages.length).toBeGreaterThan(0);
    const offenders = heroPages
      .filter(p => HERO_ATTR_ESCAPED_QUOTE.test(readFileSync(p, 'utf8')))
      .map(p => relative(REPO_ROOT, p));
    expect(offenders).toEqual([]);
  });
});

// Round seventeen (2026-10-13). Mechanism, user-report and market claims with
// no source. The studying pages (all eight regions; LATAM "agota la colina")
// and the US energy page said "Heavy cognitive demand depletes choline" and
// that citicoline is there for "the 'running on empty' feeling"; they now give
// our citicoline page's grades (attention mixed, working memory moderate from
// one trial in older adults with inefficient memory, Spiers 1996, PMID
// 8624220). The natural-vs-synthetic guide's "Racetams deplete choline stores
// (requiring supplemental choline ...)" ("agotan las reservas de colina")
// cited nothing and was dropped. "Some users report ..." (the what-to-expect
// guide and its Spanish twin, Bacopa's processing-speed note, four Lion's Mane
// records) and Alpha Brain's "Day one: subtle focus improvement" opener (six
// records) had no user data. Huperzine A was "one of the most powerful natural cholinergic
// compounds"; phosphatidylserine "supports signal transduction across
// synapses" / "improving synaptic signal transduction" ("transducción de
// señales sinápticas"), and EU Mind Lab Pro's Sharp-PS "enhances synaptic
// signal transduction and reduces cortisol" — our phosphatidylserine page
// says only that it is "a phospholipid that forms a critical component of
// neuronal cell membranes". Rhodiola "improves recall ... (when catecholamine
// depletion would otherwise slow retrieval)" now gives the page's mixed
// mental-fatigue grade. The Rhodiola/L-tyrosine and L-theanine/Bacopa stack
// notes (both directions) called the pairs a "Strong combination", "A gentle,
// non-sedating anxiety-reduction combination" and pairs that "target the same
// problem"; we cite no trial of either pairing. The Canada province notes
// called BC "one of Canada's strongest nootropic markets" with "a high
// concentration of biohackers" and Alberta "a strong market"; no market data
// exists. The US Adderall guide gave Bacopa "multiple RCTs" (now Pase 2012,
// PMID 22747190: six trials, all 12 weeks), and the stacking guide defined a
// stack as producing "effects greater than either would alone" ("efectos
// mayores que los que cada uno lograría por separado"), which Foxe 2012 (PMID
// 22326943: "did not confer any additional benefits over either compound
// alone") contradicts for its own example. The patterns are narrow enough to
// pass the out-of-scope lines checked below (the tyrosine source annotation
// "Stress-induced catecholamine depletion ...", "signal transmission between
// neurons", product "biohackers" copy).
// The scan is the round-sixteen file set.
//
// U2 (same round): onset timelines and the leftovers of the same class. The
// memory FAQ ("Phosphatidylserine and citicoline: 4–12 weeks", JP "DHA,
// Phosphatidylserine, citicoline: 4–12 weeks", CA "Ginkgo: 4–8 weeks"), the
// aging FAQ ("Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks", AU/CA
// "Ginkgo: 4–8 weeks"; LATAM "Fosfatidilserina y citicolina" and
// "Fosfatidilserina: 4–12 semanas") and the studying FAQ (Bacopa and
// citicoline "need 4–8 weeks"; "necesitan 4–8 semanas") now give the onset
// in our ingredient records: Bacopa's trials ran 12 weeks, the Lion's Mane MCI
// benefit built over 8–16 weeks, phosphatidylserine's memory trials ran 15
// weeks to 12 months, citicoline's memory effects were measured after 2–3
// months, ginkgo's positive dementia trials ran 22–26 weeks and DHA's two
// positive trials ran 6 months. The Lion's Mane what-to-expect line ("At 8-12
// weeks: measurable improvements in memory and neuroprotective markers") now
// gives Mori 2009 (PMID 18844328: 16 weeks of 3g a day, scores fell within
// 4 weeks of stopping). The EU phosphatidylserine lines said EFSA "reviewed
// the same evidence", that "the underlying clinical evidence is the same" and
// that EU labels "describe PS only in mechanism terms"; EFSA Journal
// 2010;8(10):1749 found phosphatidyl serine "not sufficiently characterised"
// and concluded that "a cause and effect relationship cannot be established",
// while the FDA's 2003 review looked at trials in people already diagnosed
// with dementia or cognitive dysfunction. Mind Lab Pro's "multiple
// peer-reviewed RCTs (University of Leeds)" were two studies: a 30-day study
// its authors call pseudo-randomised (PMID 37194920) and a 60-day study that
// found no improvement in choice accuracy or reaction time (PMID 40149748).
// Sensoril's "8% withanolides ... good evidence specifically for stress and
// sleep" cites no trial on our ashwagandha page. Citicoline "supports
// sustained attention by maintaining acetylcholine" (our page grades
// attention mixed), "Citicoline works similarly", the stacking guide's "many
// drugs are more effective or better-tolerated in combination", Bacopa's
// "reflects the herb's mechanism working", the stack notes ("definitive" /
// "classic" long-term memory stack, "perfect day/night pair", "additive
// cortisol reduction", "A powerful memory stack", "prevents the cortisol
// spike"), "most users feel", "most people experience", "Anecdotal reports are
// common", the Quebec "bilingual support" note, the ADHD page's "Multiple RCTs
// in adults (and a smaller body ..." (now Pase 2012), the citicoline card
// title "choline for cognitive demand" and Cognizin as the form "most
// products / premium imports use" had no source. "multiple peer-reviewed
// RCTs" is checked separately below because another open PR owns
// apps/us/src/app/mind-lab-pro-vs-* (mind-lab-pro-vs-noocube still says it).
const ROUND_SEVENTEEN_UNSOURCED: RegExp[] = [
  /depletes? choline/i,
  /agota la colina/i,
  /agotan las reservas de colina/i,
  /running on empty/i,
  /\bsome users report\b/i,
  /algunos usuarios reportan/i,
  /Day one: subtle focus/i,
  /most powerful natural cholinergic/i,
  /signal transduction/i,
  /transducción de señales sinápticas/i,
  /catecholamine depletion would/i,
  /agotamiento de catecolaminas de otro modo/i,
  /Strong combination for high-demand/i,
  /gentle, non-sedating anxiety-reduction/i,
  /Both have anxiolytic properties/i,
  /they target the same problem/i,
  /strongest nootropic markets/i,
  /high concentration of biohackers/i,
  /is a strong market for/i,
  /Bacopa Monnieri — multiple RCTs/i,
  /effects greater than either would alone/i,
  /efectos mayores que los que cada uno lograría/i,
  // U2: onset timelines and same-class leftovers (see above).
  /(Phosphatidylserine and citicoline|DHA, Phosphatidylserine, citicoline): 4[–-]12 weeks/i,
  /\b(Phosphatidylserine|Citicoline): 4[–-]12 weeks/i,
  /(Fosfatidilserina|Citicolina)( y citicolina)?: 4[–-]12 semanas/i,
  /Ginkgo: 4[–-]8 weeks/i,
  /need 4[–-]8 weeks of daily use/i,
  /necesitan 4[–-]8 semanas/i,
  /measurable improvements in memory and neuroprotective markers/i,
  /underlying clinical evidence is the same/i,
  /reviewed the same evidence/i,
  /describe PS (only )?in mechanism/i,
  /only the on-label language differs/i,
  /EFSA has rejected several PS health claims/i,
  /Open formula, peer-reviewed RCTs/i,
  /good evidence specifically for stress and sleep/i,
  /8% withanolides/i,
  /supports sustained attention by maintaining acetylcholine/i,
  /favorece la atención sostenida al mantener/i,
  /Citicoline works similarly/i,
  /Citicoline actúa de manera similar/i,
  /many drugs are more effective or better-tolerated in combination/i,
  /muchos medicamentos son más eficaces o mejor tolerados/i,
  /A minority of users experience/i,
  /reflects the herb\\?'s mechanism working/i,
  /(definitive|classic) long-term memory stack/i,
  /perfect day\/night pair/i,
  /additive cortisol reduction/i,
  /A powerful memory stack/i,
  /prevents the cortisol spike/i,
  /most users feel/i,
  /most people experience/i,
  /Anecdotal reports are common/i,
  /bilingual support/i,
  /Multiple RCTs in adults \(and a smaller body/i,
  /most premium (SEA )?imports use/i,
  /Cognizin is the standardi[sz]ed form most/i,
  /forma estandarizada que usan la mayoría/i,
  /choline for cognitive demand/i,
  /colina para alta demanda cognitiva/i,
];

// "multiple peer-reviewed RCTs" (U2): scanned everywhere except
// apps/us/src/app/mind-lab-pro-vs-*, which another open PR owns. Drop the
// exclusion once mind-lab-pro-vs-noocube no longer says it.
const ROUND_SEVENTEEN_LEEDS_RCTS = /multiple peer-reviewed RCTs/i;
const ROUND_SEVENTEEN_LEEDS_EXCLUDED = /^apps\/us\/src\/app\/mind-lab-pro-vs-[^/]+\//;

describe('round seventeen: mechanism, user-report and market claims follow our ingredient pages', () => {
  test('scanned every file under apps/*/src, packages/data/src and packages/ui/src/templates', () => {
    for (const f of [
      'apps/us/src/app/best-nootropics-for-studying/page.tsx',
      'apps/latam/src/app/best-nootropics-for-studying/page.tsx',
      'apps/us/src/app/best-nootropics-for-energy/page.tsx',
      'apps/us/src/app/guides/nootropics-vs-adderall/page.tsx',
      'packages/data/src/guides.ts',
      'packages/data/src/guides-es.ts',
      'packages/data/src/ingredients.ts',
      'packages/data/src/ca-provinces.ts',
      'packages/data/src/products-us.json',
      'packages/data/src/products-eu.json',
      'packages/data/src/products-au.json',
      'packages/data/src/products-ca.json',
      'packages/data/src/products-gcc.json',
      'packages/data/src/products-latam.json',
      'packages/data/src/products-sea.json',
      // U2
      'apps/us/src/app/best-nootropics-for-memory/page.tsx',
      'apps/latam/src/app/best-nootropics-for-memory/page.tsx',
      'apps/au/src/app/best-nootropics-for-aging/page.tsx',
      'apps/eu/src/app/best-nootropics-for-aging/page.tsx',
      'apps/eu/src/app/best-nootropics-for-memory/page.tsx',
      'apps/sea/src/app/best-nootropics-for-focus/page.tsx',
      'apps/us/src/app/best-nootropics-for-adhd/page.tsx',
      'apps/us/src/app/natural-adderall-alternatives/page.tsx',
    ]) expect(ROUND_SIXTEEN_SOURCES.some(p => relative(REPO_ROOT, p) === f), f).toBe(true);
  });

  test('the patterns catch the removed wording, and every pattern catches some of it', () => {
    const removed = [
      'Heavy cognitive demand depletes choline. Citicoline at 250–500mg/day supports phospholipid synthesis and acetylcholine availability',
      'Heavy cognitive workload depletes choline. Citicoline (250–500mg/day) supports phospholipid synthesis and acetylcholine availability.',
      'Not a stimulant — but addresses the "running on empty" feeling that comes with extended cognitive work.',
      'La demanda cognitiva intensa agota la colina.',
      'Racetams deplete choline stores (requiring supplemental choline to avoid headaches).',
      'Los racetams agotan las reservas de colina (lo que requiere suplementación adicional de colina para evitar dolores de cabeza).',
      "After 8 weeks of Lion's Mane, some users report clearer thinking and better mental endurance.",
      "Tras 8 semanas de Lion's Mane, algunos usuarios reportan un pensamiento más claro y mayor resistencia mental.",
      'Some users report temporary initial slowing.',
      'At 4 weeks: some users report slightly clearer thinking and improved mental endurance.',
      "Day one: subtle focus improvement, particularly noticeable for users who haven't taken cholinergic supplements before.",
      'Day one: subtle focus improvement, particularly for users new to cholinergic supplements.',
      'This makes it one of the most powerful natural cholinergic compounds.',
      'It supports signal transduction across synapses, facilitates acetylcholine and dopamine release, and modulates cortisol secretion.',
      'Supplementing with PS replenishes membrane composition, improving synaptic signal transduction and facilitating neurotransmitter release.',
      'La suplementación con PS repone la composición de las membranas, mejorando la transducción de señales sinápticas y facilitando la liberación de neurotransmisores.',
      'Phosphatidylserine (100mg Sharp-PS) enhances synaptic signal transduction and reduces cortisol.',
      'Rhodiola improves recall under conditions of stress or fatigue (when catecholamine depletion would otherwise slow retrieval).',
      'Rhodiola mejora la recuperación bajo condiciones de estrés o fatiga (cuando el agotamiento de catecolaminas de otro modo retrasaría la recuperación).',
      'Rhodiola modulates cortisol/monoamine levels; Tyrosine replenishes catecholamine substrate. Strong combination for high-demand cognitive days or night shifts.',
      'Both have anxiolytic properties working via different mechanisms. L-Theanine provides immediate calm; Bacopa builds sustained stress tolerance over weeks.',
      'A gentle, non-sedating anxiety-reduction combination.',
      'Both have anxiolytic properties. L-Theanine provides immediate calm focus; Bacopa builds long-term stress resilience. The combination is gentle and well-tolerated.',
      'Both work best under stress conditions — they target the same problem (cognitive decline under stress) via complementary mechanisms.',
      "BC's wellness culture makes it one of Canada's strongest nootropic markets.",
      'Vancouver has a high concentration of biohackers.',
      'Alberta is a strong market for performance-focused nootropics.',
      'Bacopa Monnieri — multiple RCTs',
      'A nootropic stack is a combination of two or more cognitive-enhancing compounds taken together to produce effects greater than either would alone.',
      'Un stack nootrópico es una combinación de dos o más compuestos potenciadores de la cognición que se toman juntos para producir efectos mayores que los que cada uno lograría por separado.',
      // U2
      "Bacopa: 8–12 weeks of daily use. Lion's Mane: 8–16 weeks. Phosphatidylserine and citicoline: 4–12 weeks. Ginkgo: 4–8 weeks.",
      "Bacopa: 8–12 weeks of daily use. Lion's Mane: 8–16 weeks. DHA, Phosphatidylserine, citicoline: 4–12 weeks.",
      'Phosphatidylserine: 4–12 weeks. Citicoline: 4–12 weeks. Bacopa: 8–12 weeks.',
      'Fosfatidilserina y citicolina: 4–12 semanas.',
      'Fosfatidilserina: 4–12 semanas. Citicolina: 4–12 semanas.',
      'For Bacopa and citicoline (memory consolidation), start at the beginning of the term — they need 4–8 weeks of daily use to show effect.',
      'Para Bacopa y citicolina (consolidación de memoria), empieza al inicio del cuatrimestre — necesitan 4–8 semanas de uso diario para mostrar efecto.',
      'At 8-12 weeks: measurable improvements in memory and neuroprotective markers in studies.',
      'EFSA has rejected several PS health claims, so EU labels describe PS only in mechanism terms. The underlying clinical evidence is the same — only the on-label language differs.',
      'EFSA has rejected several PS health claims, so EU labels describe PS in mechanism rather than outcome terms.',
      'EFSA reviewed the same evidence and rejected the claim in the EU.',
      'EU brands describe PS in mechanism terms (e.g., "supports cell membrane phospholipid composition") rather than outcomes.',
      'The underlying ingredient evidence is the same — only the on-label language differs.',
      'EU labels describe these ingredients in mechanism terms — the underlying clinical evidence is the same as in the US.',
      'Open formula, peer-reviewed RCTs, 30-day money-back.',
      'Sensoril (leaf + root, 8% withanolides, lower dose needed)',
      'Sensoril (8% withanolides from root + leaf, lower dose needed at 125–250mg) has good evidence specifically for stress and sleep.',
      'Citicoline (250mg) supports sustained attention by maintaining acetylcholine availability during long cognitive sessions.',
      'Citicoline (250mg) favorece la atención sostenida al mantener la disponibilidad de Acetylcholine durante sesiones cognitivas prolongadas.',
      'Citicoline works similarly — as a precursor to phosphatidylcholine, it supports membrane repair while simultaneously boosting acetylcholine synthesis.',
      'Citicoline actúa de manera similar: como precursor de la fosfatidilcolina, apoya la reparación de membranas.',
      'The concept comes from pharmacology — many drugs are more effective or better-tolerated in combination.',
      'El concepto proviene de la farmacología — muchos medicamentos son más eficaces o mejor tolerados en combinación.',
      'A minority of users experience a temporary initial slowing of mental processing — sometimes called the "Bacopa fog."',
      "It reflects the herb's mechanism working, not a problem.",
      "Classic long-term memory stack. Bacopa consolidates memory via synaptic density; Lion's Mane supports NGF.",
      "The definitive long-term memory stack. Bacopa improves synaptic density and memory consolidation; Lion's Mane drives NGF synthesis and neuroprotection.",
      'Both target HPA axis dysregulation but through different mechanisms and at different times of day — a perfect day/night pair.',
      'The combination may provide additive cortisol reduction under high-stress conditions.',
      'No mechanism overlap. A powerful memory stack where both sides work independently.',
      'L-Theanine keeps you calm and prevents the cortisol spike from stress or caffeine.',
      'Onset is fast because of the liquid format — most users feel focus and energy within 15-30 minutes (faster than capsule competitors).',
      'No — at morning doses, most people experience calm focus, not sedation.',
      'Anecdotal reports are common but controlled evidence specifically for "brain fog" in healthy adults is limited.',
      'Most major brands (Mind Lab Pro, NooCube) offer bilingual support.',
      'Multiple RCTs in adults (and a smaller body of evidence in children with ADHD) show modest improvements in attention, memory consolidation, and impulse control after 12+ weeks',
      'Cognizin is the standardized form most premium SEA imports use.',
      'Cognizin is the standardized form most premium imports use.',
      'Cognizin is the standardised form most products use.',
      'Cognizin is the standardised form most EU products use.',
      'Cognizin is the standardized form most international products use.',
      'Cognizin es la forma estandarizada que usan la mayoría de los productos importados.',
      'Citicoline — choline for cognitive demand',
      'Citicolina — colina para alta demanda cognitiva',
    ];
    for (const s of removed) expect(ROUND_SEVENTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(true);
    for (const re of ROUND_SEVENTEEN_UNSOURCED) expect(removed.some(s => re.test(s)), String(re)).toBe(true);
    // The replacement wording and the out-of-scope lines named above pass.
    for (const s of [
      'Citicoline is a choline donor. Our citicoline page rates its attention evidence as mixed and its working-memory evidence as moderate (one trial in older adults with inefficient memory, Spiers 1996). Cognizin is the standardized form.',
      'La citicolina es un donante de colina. Nuestra página sobre la citicolina califica como mixta su evidencia sobre la atención y como moderada su evidencia sobre la memoria de trabajo (un ensayo en adultos mayores con memoria ineficiente, Spiers 1996).',
      "It contains no caffeine. Onnit's 30-day money-back guarantee covers the first purchase of each product made directly on Onnit.com.",
      'An acute 320mg dose improved sustained task performance (2012), but the 2026 network meta-analysis found no processing-speed difference.',
      'It is a potent, reversible acetylcholinesterase inhibitor — meaning it blocks the enzyme that breaks down acetylcholine, effectively increasing acetylcholine levels throughout the brain.',
      'Phosphatidylserine (PS) is a phospholipid that forms a critical component of neuronal cell membranes. Supplementation replenishes PS levels that decline naturally with age.',
      'Phosphatidylserine (100mg Sharp-PS) is a phospholipid in neuronal cell membranes.',
      'Healthy membranes are essential for efficient signal transmission between neurons.',
      'Our Rhodiola page rates its mental-fatigue evidence as mixed.',
      'Nuestra página de Rhodiola califica como mixta su evidencia sobre la fatiga mental.',
      'Stress-induced catecholamine depletion and tyrosine repletion mechanism',
      'Both are studied for performance under stress; we cite no trial of the pairing.',
      'Both are studied for stress and anxiety; we cite no trial of the pairing.',
      'Delivery estimates vary by brand and carrier, so check the estimate at checkout.',
      '31 active ingredients -- the most of any single formula in this review. Best for experienced biohackers.',
      'Bacopa Monnieri — 12-week trials (Pase 2012 review)',
      'A nootropic stack is a combination of two or more cognitive-enhancing compounds taken together.',
      'Un stack nootrópico es una combinación de dos o más compuestos potenciadores de la cognición que se toman juntos.',
      'Foxe 2012 found no added benefit over either compound alone.',
      // U2 replacement wording.
      "Bacopa: 8–12 weeks of daily use; most positive trials ran 12 weeks. Lion's Mane: in adults with mild cognitive impairment the benefit built over 8–16 weeks. Phosphatidylserine: its memory trials ran 15 weeks to 12 months. Citicoline: memory effects were measured after 2–3 months. Ginkgo: positive dementia trials ran 22–26 weeks. DHA: about 24 weeks; both positive cognitive trials ran 6 months.",
      'Fosfatidilserina: sus ensayos sobre la memoria duraron de 15 semanas a 12 meses. Citicolina: sus efectos sobre la memoria se midieron después de 2–3 meses.',
      "For Bacopa and citicoline, start at the beginning of the term — most positive Bacopa trials ran 12 weeks, and citicoline's memory effects were measured after 2–3 months.",
      "Lion's Mane is a long-game supplement. Expect no acute effects on day one. In a trial in adults with mild cognitive impairment, scores improved after 16 weeks of 3g a day and fell again within 4 weeks of stopping (Mori 2009).",
      "EFSA's 2010 opinion on five phosphatidylserine claims found the substance 'not sufficiently characterised in relation to the claimed effects' and concluded that 'a cause and effect relationship cannot be established'; the FDA's 2003 review, by contrast, looked at trials in people already diagnosed with dementia or cognitive dysfunction.",
      'Open formula, two University of Leeds studies (Hum Psychopharmacol 2023, PubMed 37194920; Brain Sci 2025, PubMed 40149748), 30-day money-back.',
      'Sensoril (leaf + root extract)',
      'Sensoril is a leaf-and-root extract; our ashwagandha page cites no Sensoril trial.',
      'Our citicoline page rates its attention evidence as mixed.',
      'Citicoline is a precursor to phosphatidylcholine.',
      'Slowed information processing at the start is a listed side effect of Bacopa.',
      'Both are studied for memory and cognitive function; we cite no trial of the pairing.',
      'Both are adaptogens; we cite no trial of the pairing.',
      'Both are studied for effects on cortisol; we cite no trial of the pairing.',
      'L-Tyrosine is an amino acid precursor to dopamine and norepinephrine; L-Theanine is an amino acid found in green tea. We cite no trial of the pairing.',
      'Quebec buyers may prefer French-language customer support. Products ship in USD',
      'In a systematic review of six 12-week trials (Pase 2012), Bacopa improved 9 of 17 memory free-recall tests.',
      'Cognizin is a standardized form.',
      'Cognizin is the standardized form used in Mind Lab Pro.',
      'Cognizin es una forma estandarizada.',
      'Citicoline — a choline donor',
      'Citicolina — un donante de colina',
    ]) expect(ROUND_SEVENTEEN_UNSOURCED.some(re => re.test(s)), s).toBe(false);
  });

  test('"multiple peer-reviewed RCTs" is gone outside the mind-lab-pro-vs-* pages another PR owns', () => {
    expect(ROUND_SEVENTEEN_LEEDS_RCTS.test('The only nootropic in our coverage with multiple peer-reviewed RCTs (University of Leeds).')).toBe(true);
    expect(ROUND_SEVENTEEN_LEEDS_RCTS.test('It has been tested in two University of Leeds studies')).toBe(false);
    expect(ROUND_SEVENTEEN_LEEDS_EXCLUDED.test('apps/us/src/app/mind-lab-pro-vs-noocube/page.tsx')).toBe(true);
    expect(ROUND_SEVENTEEN_LEEDS_EXCLUDED.test('apps/us/src/app/best-nootropics-for-focus/page.tsx')).toBe(false);
    expect(ROUND_SEVENTEEN_LEEDS_EXCLUDED.test('apps/ca/src/app/aor-ortho-mind-vs-mind-lab-pro/page.tsx')).toBe(false);
    const scanned = ROUND_SIXTEEN_SOURCES.map(file => relative(REPO_ROOT, file)).filter(
      rel => !ROUND_SEVENTEEN_LEEDS_EXCLUDED.test(rel),
    );
    for (const f of [
      'apps/us/src/app/best-nootropics-for-focus/page.tsx',
      'apps/ca/src/app/best-nootropics-for-focus/page.tsx',
      'apps/ca/src/app/aor-ortho-mind-vs-mind-lab-pro/page.tsx',
      'packages/data/src/products-us.json',
    ]) expect(scanned, f).toContain(f);
    const hits = scanned.flatMap(rel =>
      normalisedMatchLines(readFileSync(resolve(REPO_ROOT, rel), 'utf8'), [ROUND_SEVENTEEN_LEEDS_RCTS]).map(
        line => `${rel}:${line}`,
      ),
    );
    expect(hits).toEqual([]);
  });

  test('no data, app or template source uses the removed wording (whitespace-normalised)', () => {
    const hits = ROUND_SIXTEEN_SOURCES.flatMap(file =>
      normalisedMatchLines(readFileSync(file, 'utf8'), ROUND_SEVENTEEN_UNSOURCED).map(
        line => `${relative(REPO_ROOT, file)}:${line}`,
      ),
    );
    expect(hits).toEqual([]);
  });

  test("Bacopa's memory row is graded moderate and cites Pase 2012", () => {
    const bacopa = ingredients.find(i => i.slug === 'bacopa-monnieri');
    expect(bacopa).toBeDefined();
    const row = bacopa!.humanEffects.find(e => e.effect === 'Memory Consolidation');
    expect(row?.evidenceStrength).toBe('moderate');
    expect(row?.studies).toBe(5);
    expect(row?.notes).toMatch(/Pase 2012/);
    expect(row?.notes).toMatch(/Kongkeaw 2014 pooled speed-of-attention outcomes, not memory/);
    expect(bacopa!.sources.map(s => s.pmid)).toContain('22747190');
  });
});
