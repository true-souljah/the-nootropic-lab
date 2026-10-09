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
