// Promo firewall: no ranking, score or sort code may read a promo field.
// Static checks (import graph, token scan, sort-site scan, product-record keys) are the live guard;
// the behavioural perturbation at the bottom starts to bite once a promo reader exists (build plan PR 17).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { dosingScore, productsEU, productsUS, weightedScore } from '@nootropic/data';
import type { Product } from '@nootropic/data';
import { scoreTier, splitListiclePicks } from './templates/listicleRanking';
import { scoreQuiz, type QuizAnswers } from './templates/quizScoring';
import { priceSortable, sortRows } from './templates/comparator/utils';
import type { SortDir, SortKey } from './templates/comparator/constants';
import { PROMO_REGIONS } from './promos';

const ROOT = join(__dirname, '..', '..', '..');

/** Every module that ranks, scores or orders products (repo-relative). */
const RANKING_MODULES = [
  'packages/data/src/product-rules.ts',
  'packages/ui/src/templates/listicleRanking.ts',
  'packages/ui/src/templates/quizScoring.ts',
  'packages/ui/src/templates/comparator/utils.ts',
  'packages/ui/src/ComparisonTable.tsx',
  'packages/ui/src/RegionalAvailability.tsx',
  'packages/ui/src/templates/BestOf.tsx',
  'packages/ui/src/templates/Listicle.tsx',
  'packages/ui/src/templates/Comparator.tsx',
  'packages/ui/src/templates/QuizResults.tsx',
  'packages/ui/src/templates/Discover.tsx',
];

/** Files allowed to read promo data (PR 17 adds the deals page here). A ranking module may never be listed. */
const ALLOWED_PROMO_READERS: string[] = [];

/** Files that sort something unrelated to product ranking: path -> reason. Empty today. */
const NON_RANKING_SORT_FILES: Record<string, string> = {};

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const HUBS: Record<(typeof REGIONS)[number], string> = {
  us: '', // the US site has no geo hub; its extra sort page is best-nootropics
  eu: 'countries/[country]',
  ca: 'provinces/[province]',
  au: 'states/[state]',
  jp: 'prefectures/[prefecture]',
  latam: 'countries/[country]',
  gcc: 'countries/[country]',
  sea: 'countries/[country]',
};

/** Page files that sort products (design.md section 1): 8 x [slug], 8 x guides/[guide], US best-nootropics, 7 geo hubs. */
const PAGE_SORT_FILES = [
  ...REGIONS.map((r) => `apps/${r}/src/app/[slug]/page.tsx`),
  ...REGIONS.map((r) => `apps/${r}/src/app/guides/[guide]/page.tsx`),
  'apps/us/src/app/[slug]/best-nootropics/page.tsx',
  ...REGIONS.filter((r) => HUBS[r]).map((r) => `apps/${r}/src/app/${HUBS[r]}/page.tsx`),
].sort();

// ---- pure scanners -------------------------------------------------------------------------

/** Strips block and line comments (a `//` right after `:` is kept, so URLs in strings survive). */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const TOKEN_PATTERNS: readonly RegExp[] = [
  /promo/i,
  /\bdeals?\b/i,
  /coupon/i,
  /discountCode/,
  /confirmed_on/,
  /terms_quote/,
  /vendor_domain/,
];

/** The promo tokens found in the source outside comments (empty = clean). */
function promoTokens(source: string): string[] {
  const code = stripComments(source);
  return TOKEN_PATTERNS.filter((re) => re.test(code)).map(String);
}

/** Value import specifiers: `import ... from`, side-effect imports, `export ... from`, dynamic `import()`. */
function importSpecifiers(source: string): string[] {
  const code = stripComments(source);
  const out: string[] = [];
  const patterns = [
    /(?:^|[^\w.$])import\s+(?!type\s)(?:[\w*{}\s,$]+?\s+from\s+)?['"]([^'"]+)['"]/g,
    /(?:^|[^\w.$])export\s+(?!type\s)[\w*{}\s,$]*?\s*from\s+['"]([^'"]+)['"]/g,
    /(?:^|[^\w.$])import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patterns) for (const m of code.matchAll(re)) out.push(m[1]);
  return out;
}

function isFile(path: string): boolean {
  return existsSync(path) && statSync(path).isFile();
}

/** Resolves a specifier from a repo-relative file to a repo-relative file, or null (package import). */
function resolveSpecifier(from: string, spec: string): string | null {
  if (spec === '@nootropic/data') return 'packages/data/src/index.ts';
  if (!spec.startsWith('.')) return null;
  const stem = join(ROOT, dirname(from), spec);
  for (const suffix of ['', '.ts', '.tsx', '/index.ts', '.json']) {
    if (isFile(stem + suffix)) return relative(ROOT, stem + suffix);
  }
  // An unresolvable relative import still names its target: keep it so a promo path is caught.
  return relative(ROOT, stem);
}

/** Every repo file statically reachable from `start` through value imports. */
function reachableFrom(start: string, read: (file: string) => string = (f) => readFileSync(join(ROOT, f), 'utf8')): Set<string> {
  const seen = new Set<string>();
  const walk = (file: string): void => {
    if (seen.has(file)) return;
    seen.add(file);
    if (!/\.(ts|tsx)$/.test(file) || !isFile(join(ROOT, file))) return;
    for (const spec of importSpecifiers(read(file))) {
      const next = resolveSpecifier(file, spec);
      if (next) walk(next);
    }
  };
  walk(start);
  return seen;
}

/** Reachable files that are promo modules, scripts or promo data (minus the allowed readers). */
function forbiddenReach(files: Iterable<string>): string[] {
  return [...files].filter(
    (f) =>
      !ALLOWED_PROMO_READERS.includes(f) &&
      (/(^|\/)promo[^/]*\.(ts|tsx)$/.test(f) || f.startsWith('scripts/') || /^packages\/data\/promos\/[^/]*\.json$/.test(f)),
  );
}

/** Forbidden imports of an in-memory source pretending to live at `as` (one level deep). */
function forbiddenImportsOf(source: string, as: string): string[] {
  return forbiddenReach(importSpecifiers(source).map((spec) => resolveSpecifier(as, spec)).filter((x): x is string => x !== null));
}

const SORT_CALL = /\.(sort|toSorted)\s*\(|\bsortBy\b/g;

/**
 * Each sort statement in the source: the receiver expression (walked back to the statement start,
 * balancing brackets) plus the sort call (closed by paren matching).
 */
function sortStatements(source: string): string[] {
  const code = stripComments(source);
  const out: string[] = [];
  for (const m of code.matchAll(SORT_CALL)) {
    const at = m.index ?? 0;
    let start = at;
    let depth = 0;
    for (let i = at - 1; i >= 0; i--) {
      const c = code[i];
      if (c === ')' || c === ']') depth++;
      else if (c === '(' || c === '[') {
        if (depth === 0) break;
        depth--;
      } else if (c === '}') {
        if (depth === 0) break;
        depth++;
      } else if (c === '{') {
        if (depth === 0) break;
        depth--;
      } else if (c === ';' && depth === 0) break;
      start = i;
    }
    let end = at + m[0].length;
    const open = code.indexOf('(', at);
    if (open !== -1 && open < at + m[0].length + 1) {
      let d = 0;
      for (let i = open; i < code.length; i++) {
        if (code[i] === '(') d++;
        else if (code[i] === ')' && --d === 0) {
          end = i + 1;
          break;
        }
      }
    }
    out.push(code.slice(start, end));
  }
  return out;
}

function sourceFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    if (name === 'node_modules' || name === '.next' || name === 'out') return [];
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(name) && !/\.(test|spec)\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts') ? [full] : [];
  });
}

const read = (file: string): string => readFileSync(join(ROOT, file), 'utf8');

const SCANNED = [
  ...readdirSync(join(ROOT, 'apps')).map((app) => `apps/${app}/src`),
  'packages/ui/src',
  'packages/data/src',
].flatMap((dir) => sourceFiles(join(ROOT, dir)).map((f) => relative(ROOT, f)));

const SORT_FILES = SCANNED.filter((f) => /\.(sort|toSorted)\(|sortBy/.test(read(f))).sort();

// ---- scanner self-tests --------------------------------------------------------------------

describe('promo firewall scanners (in-memory sources)', () => {
  const at = 'packages/ui/src/templates/Example.tsx';

  it('flags a ranking source importing a promo module', () => {
    expect(forbiddenImportsOf("import { validatePromoFile } from '../promos';\n", at)).toEqual(['packages/ui/src/promos.ts']);
    expect(forbiddenImportsOf("import './promos';\n", 'packages/ui/src/X.ts')).toEqual(['packages/ui/src/promos.ts']);
  });

  it('flags a ranking source importing promo data', () => {
    expect(forbiddenImportsOf("import us from '../../../data/promos/us.json';\n", at)).toEqual(['packages/data/promos/us.json']);
    expect(forbiddenImportsOf("const m = await import('../../data/promos/us.json');\n", 'packages/ui/src/X.ts')).toEqual(['packages/data/promos/us.json']);
  });

  it('passes a clean source', () => {
    const clean = "import { weightedScore } from '@nootropic/data';\nimport { scoreTier } from './listicleRanking';\nexport const top = (xs: number[]) => xs.sort((a, b) => b - a);\n";
    expect(forbiddenImportsOf(clean, at)).toEqual([]);
    expect(promoTokens(clean)).toEqual([]);
    // A type-only import carries no runtime value, so the import graph skips it.
    expect(importSpecifiers("import type { PromoRecord } from '../promos';\n")).toEqual([]);
  });

  it('flags a promo field read in code', () => {
    expect(promoTokens('const boost = vendor.promo ? 1 : 0;')).not.toEqual([]);
    expect(promoTokens('const c = row.coupon;')).not.toEqual([]);
    expect(promoTokens('const n = deals.length;')).not.toEqual([]);
    expect(promoTokens('const ideal = dealer.score;')).toEqual([]);
  });

  it('ignores the word promo in comments', () => {
    expect(promoTokens('// a promo never changes the score\n/* promo deals coupon */\nconst x = 1;')).toEqual([]);
  });

  it('flags a sort statement keyed on a promo field and passes a score sort', () => {
    const bad = sortStatements('const rows = products.filter(Boolean).sort((a, b) => b.promo - a.promo);');
    expect(bad).toEqual(['const rows = products.filter(Boolean).sort((a, b) => b.promo - a.promo)']);
    expect(promoTokens(bad[0])).not.toEqual([]);
    const good = sortStatements('let x = 1;\nconst rows = products.sort((a, b) => b.score - a.score);');
    expect(good).toEqual(['\nconst rows = products.sort((a, b) => b.score - a.score)']);
    expect(promoTokens(good[0])).toEqual([]);
  });
});

// ---- repo scan -----------------------------------------------------------------------------

describe('promo firewall (repo scan)', () => {
  it('lists real ranking modules and no ranking module is an allowed promo reader', () => {
    expect(RANKING_MODULES.length).toBeGreaterThan(0);
    for (const file of RANKING_MODULES) expect(isFile(join(ROOT, file)), file).toBe(true);
    for (const file of ALLOWED_PROMO_READERS) expect(RANKING_MODULES, file).not.toContain(file);
    for (const file of Object.keys(NON_RANKING_SORT_FILES)) expect(RANKING_MODULES, file).not.toContain(file);
  });

  it.each(RANKING_MODULES)('%s reaches no promo module, script or promo data', (file) => {
    const reach = reachableFrom(file);
    expect(reach.size).toBeGreaterThan(1);
    expect(forbiddenReach(reach)).toEqual([]);
  });

  it.each(RANKING_MODULES)('%s names no promo token outside comments', (file) => {
    expect(promoTokens(read(file))).toEqual([]);
  });

  it('every file that sorts is a ranking module, a listed page or a listed non-ranking file', () => {
    expect(SCANNED.length).toBeGreaterThan(100);
    expect(SORT_FILES.length).toBeGreaterThan(0);
    const known = new Set([...RANKING_MODULES, ...PAGE_SORT_FILES, ...Object.keys(NON_RANKING_SORT_FILES)]);
    expect(SORT_FILES.filter((f) => !known.has(f))).toEqual([]);
  });

  it('the page sort files recomputed from the scan equal the explicit list (24)', () => {
    expect(PAGE_SORT_FILES).toHaveLength(24);
    expect(SORT_FILES.filter((f) => f.startsWith('apps/'))).toEqual(PAGE_SORT_FILES);
  });

  it('no sort statement anywhere names a promo token', () => {
    const offenders = SORT_FILES.flatMap((f) =>
      sortStatements(read(f))
        .filter((s) => promoTokens(s).length > 0)
        .map((s) => `${f}: ${s.replace(/\s+/g, ' ').slice(0, 160)}`),
    );
    const statements = SORT_FILES.reduce((n, f) => n + sortStatements(read(f)).length, 0);
    expect(statements).toBeGreaterThanOrEqual(SORT_FILES.length);
    expect(offenders).toEqual([]);
  });

  it('product records carry no promo keys', () => {
    const forbidden = ['promo', 'promos', 'deal', 'deals', 'coupon', 'discountCode', 'terms_quote', 'confirmed_on', 'vendor_domain'];
    const keys = new Set<string>();
    const visit = (x: unknown): void => {
      if (Array.isArray(x)) x.forEach(visit);
      else if (x && typeof x === 'object') {
        for (const [key, value] of Object.entries(x)) {
          keys.add(key);
          visit(value);
        }
      }
    };
    for (const region of REGIONS) visit(JSON.parse(read(`packages/data/src/products-${region}.json`)));
    expect(keys.size).toBeGreaterThan(10);
    expect(forbidden.filter((k) => keys.has(k))).toEqual([]);
  });
});

// ---- behavioural perturbation --------------------------------------------------------------
// Today nothing imports a promo module, so after === before holds by construction: these cases
// start to bite only once a promo reader exists. The static checks above are the live guard.

const KINDS = ['percent', 'fixed', 'free-item', 'code-only', 'shipping', 'other'];
const PERTURBED = {
  schema_version: 1,
  promos: Array.from({ length: 24 }, (_, i) => ({
    id: `perturb-${i}`,
    vendor_id: `vendor-${i % 5}`,
    vendor_domain: `vendor${i % 5}.example`,
    kind: KINDS[i % KINDS.length],
    headline: `Save ${i * 10}% on everything`,
    terms_quote: 'Any order, no minimum',
    code: i % 3 === 0 ? null : `CODE${i}`,
    starts: i % 2 ? '1970-01-01' : null,
    expires: i % 2 ? '9999-12-31' : '2000-01-01',
    geo: i % 2 ? ['WORLD'] : ['US', 'EU'],
    regulated: i % 4 === 0,
    confirmed_on: '2026-11-16',
  })),
};

function perturbPromos(): void {
  vi.resetModules();
  for (const region of PROMO_REGIONS) vi.doMock(`../../data/promos/${region}.json`, () => ({ default: PERTURBED }));
}

afterEach(() => {
  for (const region of PROMO_REGIONS) vi.doUnmock(`../../data/promos/${region}.json`);
  vi.resetModules();
});

const sample = (): Product[] => [...productsUS, ...productsEU];

describe('promo firewall (behavioural perturbation)', () => {
  it('weightedScore and dosingScore ignore promo data', async () => {
    const compute = (data: { weightedScore: typeof weightedScore; dosingScore: typeof dosingScore }, ps: Product[]) =>
      ps.map((p) => [p.slug, data.weightedScore(p.scoreBreakdown), data.dosingScore(p)]);
    const before = compute({ weightedScore, dosingScore }, sample());
    perturbPromos();
    const data = await import('@nootropic/data');
    const after = compute(data, [...data.productsUS, ...data.productsEU]);
    expect(before.length).toBeGreaterThan(0);
    expect(after).toEqual(before);
  });

  it('scoreTier and splitListiclePicks ignore promo data', async () => {
    const compute = (mod: { scoreTier: typeof scoreTier; splitListiclePicks: typeof splitListiclePicks }, ps: Product[]) => {
      const picks = ps.map((product, i) => ({ product, rank: i + 1 }));
      const evidence = [{ ingredientSlugs: ['bacopa-monnieri'] }, { ingredientSlugs: ['citicoline', 'l-theanine'] }];
      const split = mod.splitListiclePicks(picks, evidence);
      return {
        tiers: ps.map((p) => mod.scoreTier(p.score)),
        ranked: split.ranked.map((x) => [x.product.slug, x.rank]),
        also: split.alsoConsidered.map((x) => [x.product.slug, x.notRanked]),
      };
    };
    const before = compute({ scoreTier, splitListiclePicks }, sample());
    perturbPromos();
    const mod = await import('./templates/listicleRanking');
    const data = await import('@nootropic/data');
    const after = compute(mod, [...data.productsUS, ...data.productsEU]);
    expect(after).toEqual(before);
  });

  it('scoreQuiz ignores promo data', async () => {
    const answers: QuizAnswers[] = [
      { goals: ['Focus'], caffeine: 'Moderate', budget: 60, mbg: 'Very important' },
      { goals: ['Memory', 'Mood'], caffeine: 'Very sensitive', budget: 30, mbg: 'Not important' },
      { goals: ['Energy'], caffeine: 'Not sensitive', budget: 120, mbg: "I don't know yet" },
    ];
    const compute = (fn: typeof scoreQuiz, us: Product[], eu: Product[]) =>
      answers.flatMap((a) => [JSON.stringify(fn(us, a)), JSON.stringify(fn(eu, a))]);
    const before = compute(scoreQuiz, [...productsUS], [...productsEU]);
    perturbPromos();
    const mod = await import('./templates/quizScoring');
    const data = await import('@nootropic/data');
    const after = compute(mod.scoreQuiz, [...data.productsUS], [...data.productsEU]);
    expect(after).toEqual(before);
  });

  it('comparator sortRows and priceSortable ignore promo data', async () => {
    const keys: SortKey[] = ['rank', 'score', 'price', 'trust', 'value'];
    const dirs: SortDir[] = ['asc', 'desc'];
    const compute = (mod: { sortRows: typeof sortRows; priceSortable: typeof priceSortable }, us: Product[], eu: Product[]) =>
      [us, eu].map((ps) => {
        const canSort = mod.priceSortable(ps);
        return [canSort, keys.flatMap((k) => dirs.map((d) => mod.sortRows([...ps], k, d, canSort).map((p) => p.slug)))];
      });
    const before = compute({ sortRows, priceSortable }, [...productsUS], [...productsEU]);
    perturbPromos();
    const mod = await import('./templates/comparator/utils');
    const data = await import('@nootropic/data');
    const after = compute(mod, [...data.productsUS], [...data.productsEU]);
    expect(after).toEqual(before);
  });
});
