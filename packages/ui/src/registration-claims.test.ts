import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, extname, relative } from 'node:path';

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

  test('a "cheapest in this review" claim in product data names the region\'s lowest priceMonthlyUSD', () => {
    const CHEAPEST_CLAIM = /most affordable|lowest monthly price in this review|lowest-priced product in this review/i;
    type Rec = { slug: string; discontinued?: unknown; priceMonthlyUSD?: number | null } & Record<string, unknown>;
    let claims = 0;
    const wrong: string[] = [];
    for (const file of PRODUCT_FILES) {
      const recs = JSON.parse(readFileSync(file, 'utf8')) as Rec[];
      const live = recs.filter(r => !r.discontinued);
      for (const r of recs) {
        const texts = Object.values(r).filter((v): v is string => typeof v === 'string');
        if (!texts.some(t => CHEAPEST_CLAIM.test(t))) continue;
        claims++;
        // Every live record needs a USD price, or the comparison cannot be proved.
        const unpriced = live.filter(x => typeof x.priceMonthlyUSD !== 'number').map(x => x.slug);
        const min = Math.min(...live.map(x => x.priceMonthlyUSD as number));
        if (unpriced.length > 0 || r.discontinued || r.priceMonthlyUSD !== min) {
          wrong.push(`${relative(REPO_ROOT, file)} ${r.slug}: ${r.priceMonthlyUSD} vs min ${min}; unpriced ${unpriced.join(',')}`);
        }
      }
    }
    expect(claims).toBeGreaterThanOrEqual(5);
    expect(wrong).toEqual([]);
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
});
