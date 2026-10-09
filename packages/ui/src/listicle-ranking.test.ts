import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import * as data from '@nootropic/data';
import type { Product } from '@nootropic/data';
import {
  LISTICLE_MIN_SCORE,
  belowBarReason,
  formatListicleScore,
  howWeChooseText,
  splitListiclePicks,
} from './templates/listicleRanking';
import { getUseCaseListStrings, type TemplateLocale } from './templateStrings';

// Site-owner decision 2026-10-08: every listicle says a pick must "score ≥ 7.5/10
// in our 5-pillar editorial audit". Ranked picks must meet that bar; picks below
// it stay on the page, unranked and without a buy link, under "Also considered".

const REPO = join(__dirname, '..', '..', '..');
const UI_SRC = __dirname;
const LOCALES: TemplateLocale[] = ['en', 'es'];
const BAR = formatListicleScore(LISTICLE_MIN_SCORE);

function pick(name: string, score: number, rank?: number) {
  return { product: { name, score }, whyItsHere: `${name} blurb`, ...(rank === undefined ? {} : { rank }) };
}
const names = (picks: Array<{ product: { name: string } }>) => picks.map((p) => p.product.name);

describe('LISTICLE_MIN_SCORE', () => {
  it('is the 7.5 bar the site owner set (2026-10-08) — change it deliberately', () => {
    expect(LISTICLE_MIN_SCORE).toBe(7.5);
    expect(BAR).toBe('7.5');
  });
});

describe('splitListiclePicks', () => {
  it('ranks a pick scoring exactly the bar; a 7.4 pick is not ranked', () => {
    const { ranked, alsoConsidered } = splitListiclePicks([pick('At bar', 7.5, 1), pick('Just under', 7.4, 2)]);
    expect(names(ranked)).toEqual(['At bar']);
    expect(names(alsoConsidered)).toEqual(['Just under']);
  });

  it('keeps hand order (not score order) in both groups and renumbers ranks 1..n', () => {
    const { ranked, alsoConsidered } = splitListiclePicks([
      pick('C', 9.4, 3),
      pick('A', 7.6, 1),
      pick('B', 6.6, 2),
      pick('E', 8.3, 5),
      pick('D', 7.0, 4),
    ]);
    expect(ranked.map((p) => [p.product.name, p.rank])).toEqual([['A', 1], ['C', 2], ['E', 3]]);
    expect(names(alsoConsidered)).toEqual(['B', 'D']);
  });

  it('puts every pick in exactly one group — a NaN score is below the bar, never dropped', () => {
    const input = [pick('Ok', 8, 1), pick('Broken', Number.NaN, 2), pick('Low', 3, 3)];
    const { ranked, alsoConsidered } = splitListiclePicks(input);
    expect(names(ranked)).toEqual(['Ok']);
    expect(names(alsoConsidered)).toEqual(['Broken', 'Low']);
  });

  it('places picks without a rank after those with one, in array order', () => {
    const { ranked } = splitListiclePicks([pick('No rank 1', 9), pick('Ranked', 8, 1), pick('No rank 2', 8.5)]);
    expect(ranked.map((p) => [p.product.name, p.rank])).toEqual([['Ranked', 1], ['No rank 1', 2], ['No rank 2', 3]]);
  });

  it('does not mutate the page’s picks', () => {
    const input = [pick('B', 9, 2), pick('A', 8, 1)];
    const before = JSON.stringify(input);
    splitListiclePicks(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});

describe('the rule text and the also-considered copy render LISTICLE_MIN_SCORE', () => {
  it('templateStrings.ts types no score (the bar is a {minScore} placeholder)', () => {
    const src = readFileSync(join(UI_SRC, 'templateStrings.ts'), 'utf8');
    expect(src).not.toMatch(/\b\d[.,]\d\s?\/\s?10\b/);
    expect(src).not.toMatch(/\b7[.,]5\b/);
  });

  it.each(LOCALES)('%s: "How we choose" states the bar from the constant', (locale) => {
    const s = getUseCaseListStrings(locale);
    expect(s.howWeChooseBody).toContain('{minScore}/10');
    const text = howWeChooseText(s);
    expect(text).toContain(`≥ ${BAR}/10`);
    expect(text).not.toContain('{');
  });

  it.each(LOCALES)('%s: section heading, intro and reason line carry the bar (and the score)', (locale) => {
    const s = getUseCaseListStrings(locale);
    expect(s.alsoConsideredHeading).toContain('{minScore}');
    expect(s.alsoConsideredIntro).toContain('{minScore}/10');
    expect(s.belowBarReason).toContain('{score}/10');
    expect(s.belowBarReason).toContain('{minScore}');
    const reason = belowBarReason(s, 6.6);
    expect(reason).toContain('6.6/10');
    expect(reason).toContain(BAR);
    expect(belowBarReason(s, 7)).toContain('7.0/10');
    expect(reason).not.toContain('{');
  });

  it('English reason line reads as specified', () => {
    expect(belowBarReason(getUseCaseListStrings('en'), 6.6)).toBe(`Scores 6.6/10 — below our ${BAR} bar`);
  });

  it('Spanish translates every also-considered string (none falls back to English)', () => {
    const en = getUseCaseListStrings('en');
    const es = getUseCaseListStrings('es');
    for (const key of ['alsoConsideredHeading', 'alsoConsideredIntro', 'belowBarReason', 'alsoConsideredToc'] as const) {
      expect(es[key], key).toBeTruthy();
      expect(es[key], key).not.toBe(en[key]);
    }
  });
});

describe('Listicle template wiring', () => {
  const src = readFileSync(join(UI_SRC, 'templates', 'Listicle.tsx'), 'utf8');

  it('splits the picks once and renders the rule through howWeChooseText', () => {
    expect(src).toContain('splitListiclePicks(picks)');
    expect(src).toContain('howWeChooseText(s)');
    expect(src).not.toContain('s.howWeChooseBody');
    // Nothing else enumerates the raw picks (cards, TOC, ItemList read `ranked`).
    expect(src).not.toMatch(/\bpicks\.(map|length|sort|filter|forEach|slice)\b|\.\.\.picks\b/);
    expect(src).toMatch(/numberOfItems:\s*ranked\.length/);
    expect(src).toMatch(/itemListElement:\s*ranked\.map/);
  });

  it('the also-considered section renders no affiliate link', () => {
    const start = src.indexOf('id="also-considered"');
    expect(start).toBeGreaterThan(-1);
    const block = src.slice(start, src.indexOf('</section>', start));
    expect(block).toContain('ProductThumb');
    expect(block).toContain('belowBarReason(s, pick.product.score)');
    expect(block).toContain('href={`/${pick.product.slug}/`}');
    expect(block).not.toMatch(/TrackedAffiliateLink|affiliateUrl|sponsored/);
  });
});

// ---------------------------------------------------------------------------
// Every Listicle page in every app: the ranked set never holds a pick below the
// bar. Characterization of the data on 2026-10-08 (after the weighted-score
// recompute, #323): 24 of 128 picks on 20 of the 36 listicles score below 7.5.
// 2026-10-09, after the computed dosing pillar (dosing-anchors.ts) and the
// #333/#334 label rows (Thesis, Hunter Focus, Qualia Mind): 73 picks on 35
// listicles; every listicle keeps at least one ranked pick.
// When a score, a pick or a page changes, update the expected counts below on
// purpose, after checking that the page still reads right.
// ---------------------------------------------------------------------------

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name === 'page.tsx') out.push(p);
  }
  return out;
}

const listiclePages = readdirSync(join(REPO, 'apps'))
  .map((app) => join(REPO, 'apps', app, 'src', 'app'))
  .filter(existsSync)
  .flatMap((dir) => walk(dir))
  .filter((file) => /<Listicle\b/.test(readFileSync(file, 'utf8')))
  .sort();

const productSets = data as unknown as Record<string, Product[] | undefined>;

function pagePicks(file: string) {
  const src = readFileSync(file, 'utf8');
  const block = src.match(/: ListiclePick\[\] = \[([\s\S]*?)\n\];/)?.[1];
  if (!block) throw new Error(`${file}: no ListiclePick[] array`);
  const entries = block.split(/\bproduct:/).slice(1);
  return entries.map((entry) => {
    const m = entry.match(/^\s*(products\w+)\.find\(\s*p\s*=>\s*p\.slug === '([^']+)'\s*\)/);
    if (!m) throw new Error(`${file}: unparsed pick "${entry.slice(0, 80)}"`);
    const [, set, slug] = m;
    const product = productSets[set]?.find((p) => p.slug === slug);
    if (!product) throw new Error(`${file}: ${set} has no product "${slug}"`);
    const rank = entry.match(/\brank:\s*(\d+)/)?.[1];
    return { product, whyItsHere: '', ...(rank ? { rank: Number(rank) } : {}) };
  });
}

describe('every Listicle page ranks only picks at or above the bar', () => {
  const pages = listiclePages.map((file) => ({ rel: relative(REPO, file), picks: pagePicks(file) }));

  it('finds all 36 listicle pages and their 128 picks (guards against an empty or partial scan)', () => {
    expect(pages).toHaveLength(36);
    expect(pages.reduce((n, p) => n + p.picks.length, 0)).toBe(128);
  });

  it.each(pages.map((p) => [p.rel, p.picks] as const))('%s', (_rel, picks) => {
    const { ranked, alsoConsidered } = splitListiclePicks(picks);
    expect(ranked.length + alsoConsidered.length).toBe(picks.length);
    expect(ranked.length, 'a listicle needs at least one ranked pick').toBeGreaterThan(0);
    expect(ranked.filter((p) => p.product.score < LISTICLE_MIN_SCORE)).toEqual([]);
    expect(ranked.map((p) => p.rank)).toEqual(ranked.map((_, i) => i + 1));
    expect(alsoConsidered.every((p) => p.product.score < LISTICLE_MIN_SCORE)).toBe(true);
  });

  it('moves the 73 below-bar picks (35 pages) to "Also considered" — 2026-10-09 data', () => {
    const below = pages.flatMap((p) => splitListiclePicks(p.picks).alsoConsidered.map((x) => ({ page: p.rel, slug: x.product.slug })));
    expect(below).toHaveLength(73);
    expect(new Set(below.map((b) => b.page)).size).toBe(35);
    const bySlug = below.reduce<Record<string, number>>((acc, b) => ({ ...acc, [b.slug]: (acc[b.slug] ?? 0) + 1 }), {});
    expect(bySlug).toEqual({
      'qualia-mind-review': 27,
      'onnit-alpha-brain-review': 15,
      'nootropics-depot-lions-mane': 8,
      'thesis-nootropics-review': 7,
      'hunter-focus-review': 7,
      'naturebell-ginkgo-ginseng-review': 4,
      'suntory-dha-epa-sesamin-review': 3,
      'fancl-brains-review': 2,
    });
  });
});
