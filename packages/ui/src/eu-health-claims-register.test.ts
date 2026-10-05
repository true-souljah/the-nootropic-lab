import { describe, test, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';

// EU health-claims compliance guard.
//
// The European Commission's EU Register of nutrition and health claims lists
// no authorised caffeine claim: EFSA's favourable 2011 opinion on caffeine and
// alertness (EFSA Journal 2011;9(4):2054) was never turned into an
// authorisation, and the 40–75 mg alertness claim was refused by Commission
// Regulation (EU) 2016/1411 (register entry POL-HC-8450). The EU claims page
// had marked two caffeine claims "authorised" and other EU copy repeated it.
//
// EFSA assesses claims; the Commission authorises them. "EFSA-authorised" /
// "EFSA-approved" wording is therefore imprecise and is written as
// "EU-authorised (assessed by EFSA)".

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
const CLAIMS_PAGE = resolve(REPO_ROOT, 'apps/eu/src/app/efsa-approved-cognitive-supplements/page.tsx');

function walk(dir: string, exts: Set<string>, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.has(extname(p))) out.push(p);
  }
  return out;
}

const EU_SOURCES = [
  ...walk(resolve(REPO_ROOT, 'apps/eu/src'), new Set(['.ts', '.tsx', '.json', '.md', '.mdx'])),
  resolve(REPO_ROOT, 'packages/data/src/products-eu.json'),
  resolve(REPO_ROOT, 'packages/data/src/eu-countries.ts'),
  resolve(REPO_ROOT, 'packages/data/src/regional-notes/eu.ts'),
];

// The URL slug /efsa-approved-cognitive-supplements/ is kept for link
// stability, so "approved" is matched case-insensitively except in the slug.
const BANNED_WORDING: RegExp[] = [
  /EFSA[- ]authori[sz]ed/i,
  /EFSA[- ]approved(?!-cognitive-supplements)/i,
  /EFSA[- ]recogni[sz]ed/i,
  /EFSA (has |had )?authori[sz]e[sd]?/i,
  /authori[sz]e[sd]? the (alertness|attention|concentration)(\/attention)? claim/i,
];

interface Row {
  ingredient: string;
  status: string;
  source: string;
}

function parseClaimRows(source: string): Row[] {
  const block = source.match(/const efsaCognitiveClaims: EfsaClaim\[\] = \[([\s\S]*?)\n\];/);
  if (!block) throw new Error('efsaCognitiveClaims array not found in the EU claims page');
  const rows: Row[] = [];
  for (const line of block[1].split('\n')) {
    const ingredient = line.match(/ingredient: '([^']+)'/);
    const status = line.match(/status: '([^']+)'/);
    const src = line.match(/source: '([^']+)'/);
    if (ingredient && status && src) rows.push({ ingredient: ingredient[1], status: status[1], source: src[1] });
  }
  return rows;
}

describe('EU health claims match the Commission register', () => {
  const rows = parseClaimRows(readFileSync(CLAIMS_PAGE, 'utf8'));

  test('the claims table was parsed', () => {
    expect(rows.length).toBeGreaterThanOrEqual(10);
  });

  test('no caffeine claim is marked authorised', () => {
    const caffeine = rows.filter(r => /caffeine/i.test(r.ingredient));
    expect(caffeine.length).toBeGreaterThanOrEqual(2);
    for (const r of caffeine) expect(r.status, `${r.ingredient}: ${r.source}`).not.toBe('authorised');
  });

  test('the refused 40–75 mg caffeine claim cites Regulation (EU) 2016/1411 and POL-HC-8450', () => {
    const refused = rows.find(r => /caffeine/i.test(r.ingredient) && r.status === 'rejected');
    expect(refused?.source).toMatch(/2016\/1411/);
    expect(refused?.source).toMatch(/POL-HC-8450/);
  });

  test('every authorised row names its EU register entry', () => {
    const authorised = rows.filter(r => r.status === 'authorised');
    expect(authorised.length).toBeGreaterThanOrEqual(6);
    for (const r of authorised) expect(r.source, r.ingredient).toMatch(/EU register POL-HC-\d+/);
  });

  test('pantothenic acid and vitamin B12 references match the register', () => {
    const b5 = rows.find(r => /pantothenic/i.test(r.ingredient));
    const b12 = rows.find(r => /B12/.test(r.ingredient));
    expect(b5?.source).toMatch(/2009;7\(9\):1218/);
    expect(b5?.source).toMatch(/2010;8\(10\):1758/);
    expect(b12?.source).toMatch(/2010;8\(10\):4114/);
  });
});

describe('EU copy does not call claims "EFSA-authorised" or present caffeine cognition claims as authorised', () => {
  test('scanned a non-empty file set', () => {
    expect(EU_SOURCES.length).toBeGreaterThan(20);
  });

  for (const file of EU_SOURCES) {
    const rel = file.slice(REPO_ROOT.length + 1);
    test(rel, () => {
      const text = readFileSync(file, 'utf8');
      for (const re of BANNED_WORDING) {
        const m = text.match(re);
        expect(m?.[0], `${rel} contains "${m?.[0]}"`).toBeUndefined();
      }
    });
  }
});

// EFSA assesses claims and certifies nothing, so no product, label or
// framing can be "EFSA-compliant" or "EFSA-aware". Checked in every region.
const EFSA_CERTIFICATION_WORDING = /EFSA[- ](compliant|aware|certified)/i;

const ALL_REGION_SOURCES = [
  ...readdirSync(resolve(REPO_ROOT, 'apps'))
    .map(app => resolve(REPO_ROOT, 'apps', app, 'src'))
    .filter(dir => existsSync(dir))
    .flatMap(dir => walk(dir, new Set(['.ts', '.tsx', '.json', '.md', '.mdx']))),
  ...walk(resolve(REPO_ROOT, 'packages/data/src'), new Set(['.ts', '.tsx', '.json', '.md', '.mdx'])),
];

describe('no region calls anything "EFSA-compliant" or "EFSA-aware"', () => {
  test('scanned a non-empty file set', () => {
    expect(ALL_REGION_SOURCES.length).toBeGreaterThan(100);
  });

  test('no source file uses EFSA certification wording', () => {
    const hits = ALL_REGION_SOURCES.flatMap(file => {
      const m = readFileSync(file, 'utf8').match(EFSA_CERTIFICATION_WORDING);
      return m ? [`${file.slice(REPO_ROOT.length + 1)}: "${m[0]}"`] : [];
    });
    expect(hits).toEqual([]);
  });
});
