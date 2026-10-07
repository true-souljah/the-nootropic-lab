import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';

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
