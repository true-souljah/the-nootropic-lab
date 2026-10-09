import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { LISTICLE_MIN_SCORE, SCORE_TIERS, scoreTier } from './templates/listicleRanking';

// Site-owner decision 2026-10-09: the colour and label tiers of a product score
// follow the listicle bar — green "good" / "Recommended" from 7.5, amber "warn" /
// "Worth a look" from the bar (7.0), red below. They were 8.5 / 7.5, which left
// every ranked listicle pick amber or red and BestOf's "Recommended" count at 0
// once the dosing pillar became computed from label doses. The thresholds live
// once, in SCORE_TIERS; this file fails if a component types one again.

const REPO = join(__dirname, '..', '..', '..');
const UI_SRC = __dirname;

describe('SCORE_TIERS', () => {
  it('is 7.5 good / 7.0 warn — change it deliberately', () => {
    expect(SCORE_TIERS).toEqual({ good: 7.5, warn: 7.0 });
  });

  it('warn IS the listicle bar (derived, not a second copy of the number)', () => {
    expect(SCORE_TIERS.warn).toBe(LISTICLE_MIN_SCORE);
    const src = readFileSync(join(UI_SRC, 'templates', 'listicleRanking.ts'), 'utf8');
    expect(src).toMatch(/SCORE_TIERS = \{ good: 7\.5, warn: LISTICLE_MIN_SCORE \}/);
  });

  it.each([
    [10, 'good'],
    [7.5, 'good'],
    [7.49, 'warn'],
    [7.0, 'warn'],
    [6.99, 'bad'],
    [0, 'bad'],
    [Number.NaN, 'bad'],
  ] as const)('scoreTier(%s) is %s', (score, tier) => {
    expect(scoreTier(score)).toBe(tier);
  });
});

// ---------------------------------------------------------------------------
// Guard: no product-score tier number outside listicleRanking.ts.
// ---------------------------------------------------------------------------

// The surfaces that colour or grade a product score (spec 2026-10-09).
const TIER_COMPONENTS = [
  'primitives/ScorePill.tsx',
  'templates/BestOf.tsx',
  'templates/Comparator.tsx',
  'templates/HeadToHead.tsx',
  'templates/ThreeWay.tsx',
  'templates/ProductDetail.tsx',
  'templates/product-detail/OverviewTab.tsx',
];

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

const scanned = [
  join(UI_SRC),
  ...readdirSync(join(REPO, 'apps')).map((app) => join(REPO, 'apps', app, 'src')),
  join(REPO, 'packages', 'data', 'src'),
]
  .filter(existsSync)
  .flatMap((dir) => sourceFiles(dir))
  .filter((file) => !file.endsWith(join('templates', 'listicleRanking.ts')))
  .sort();

// `score` as a word, so trustpilotScore and DoseCalculator's stackScore (a
// different measure: the share of a user's stack in clinical range) are out.
const SCORE_VS_NUMBER = /\bscore\s*(?:>=|<=|>|<)\s*\d|\d\s*(?:>=|<=|>|<)\s*[\w.]*\bscore\b/;
// A tier label printed with its number: "Recommended (8.5+)", "Worth a look: 7.5–8.4".
const TIER_LABEL_WITH_NUMBER = /(?:recommended|worth a look|recomendad\w*|vale la pena|recommandé\w*|おすすめ)\s*[(:：]?\s*[≥>]?\s*\d[.,]\d/i;

describe('no product-score tier literal outside SCORE_TIERS', () => {
  it('scans packages/ui, packages/data and every app, including the tier components (guards against an empty scan)', () => {
    expect(scanned.length).toBeGreaterThan(300);
    const rel = scanned.map((f) => relative(UI_SRC, f));
    for (const c of TIER_COMPONENTS) expect(rel).toContain(c);
  });

  it.each(TIER_COMPONENTS)('%s reads the tiers from listicleRanking and types no 7.5 / 8.5', (component) => {
    const src = readFileSync(join(UI_SRC, component), 'utf8');
    expect(src).toMatch(/\b(scoreTier|SCORE_TIERS)\b/);
    expect(src).toMatch(/from '\.{1,2}(\/\.\.)?\/(templates\/)?listicleRanking'/);
    expect(src).not.toMatch(/(?<![\d.])[78][.,]5(?!\d)/);
  });

  it('no source file compares a product `score` with a typed number', () => {
    const hits = scanned.flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => [relative(REPO, file), i + 1, line.trim()] as const)
        .filter(([, , line]) => SCORE_VS_NUMBER.test(line)),
    );
    expect(hits).toEqual([]);
  });

  it('no source file prints a tier label with a score range', () => {
    const hits = scanned.flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => [relative(REPO, file), i + 1, line.trim()] as const)
        .filter(([, , line]) => TIER_LABEL_WITH_NUMBER.test(line)),
    );
    expect(hits).toEqual([]);
  });

  // The guard's own regexes, proven against the literals they exist to catch.
  it.each([
    ['score >= 8.5', SCORE_VS_NUMBER, true],
    ['p.score < 7.5', SCORE_VS_NUMBER, true],
    ['7.5 <= product.score', SCORE_VS_NUMBER, true],
    ['p.trustpilotScore >= 4', SCORE_VS_NUMBER, false],
    ['stackScore >= 8.5', SCORE_VS_NUMBER, false],
    ['scoreTier(p.score)', SCORE_VS_NUMBER, false],
    ["'Recommended (8.5+)'", TIER_LABEL_WITH_NUMBER, true],
    ["'Worth a look (7.5–8.4)'", TIER_LABEL_WITH_NUMBER, true],
    ["'Recomendado: ≥ 7,5'", TIER_LABEL_WITH_NUMBER, true],
    ["'recommended daily dose of 2.5mg'", TIER_LABEL_WITH_NUMBER, false],
    ["{ id: 'Recommended', tone: 'good' }", TIER_LABEL_WITH_NUMBER, false],
  ] as const)('guard regex on %s → %s', (line, re, hit) => {
    expect(re.test(line)).toBe(hit);
  });
});
