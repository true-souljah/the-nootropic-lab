import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PILLAR_WEIGHTS, pillarWeightPercent } from '@nootropic/data';

// Scores and pillar weights are data, never copy (2026-10-07). Every product
// score is the PILLAR_WEIGHTS-weighted mean of its pillars (product-rules.ts,
// enforced by validate-data); copy that types a score or a weight goes stale
// the moment the data changes — the methodology pages said 20% per pillar
// while the score used 25/30/20/15/10, and a three-way verdict quoted scores
// that no record held.

const REPO = join(__dirname, '..', '..', '..');
const APPS = readdirSync(join(REPO, 'apps')).filter((app) => existsSync(join(REPO, 'apps', app, 'src')));

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

describe('pillar weights', () => {
  it('sum to 1 and render as whole percentages summing to 100', () => {
    const weights = Object.values(PILLAR_WEIGHTS);
    expect(weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    const percents = (Object.keys(PILLAR_WEIGHTS) as (keyof typeof PILLAR_WEIGHTS)[]).map(pillarWeightPercent);
    expect(percents).toEqual([25, 30, 20, 15, 10]);
    expect(percents.reduce((a, b) => a + b, 0)).toBe(100);
  });
});

describe('methodology pages render the pillar weights from PILLAR_WEIGHTS', () => {
  const pages = APPS.map((app) => join(REPO, 'apps', app, 'src', 'app', 'methodology', 'page.tsx')).filter(existsSync);

  it('finds all 8 regional methodology pages', () => {
    expect(pages.map((p) => relative(REPO, p))).toHaveLength(8);
  });

  it.each(pages.map((p) => [relative(REPO, p), p]))('%s: no typed weight in a pillar title; every pillar reads pillarWeightPercent', (_rel, page) => {
    const src = readFileSync(page, 'utf8');
    const titles = [...src.matchAll(/title: (['"`])(.*?)\1/g)].map((m) => m[2]);
    expect(titles.filter((t) => /\(\d+\s?%\)/.test(t))).toEqual([]);
    for (const pillar of Object.keys(PILLAR_WEIGHTS)) {
      expect(src).toContain(`pillarWeightPercent('${pillar}')`);
    }
  });
});

describe('app copy never types a product score', () => {
  const sources = APPS.flatMap((app) => walk(join(REPO, 'apps', app, 'src')));

  it('scans a non-empty source set (guards against a silently empty glob)', () => {
    expect(sources.length).toBeGreaterThan(100);
  });

  it('no "X.Y/10" or "X.Y out of 10" literal in any app page', () => {
    const LITERAL_SCORE = /\b\d[.,]\d\s?(\/\s?10\b|out of 10\b|sobre 10\b|sur 10\b|von 10\b|em 10\b|点)/;
    const offenders = sources
      .filter((f) => LITERAL_SCORE.test(readFileSync(f, 'utf8')))
      .map((f) => relative(REPO, f));
    expect(offenders).toEqual([]);
  });
});
