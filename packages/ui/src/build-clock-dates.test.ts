import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';

// Source guard (2026-10-19, updated-date accuracy). Listicle, IngredientDetail
// and HeadToHead — and ~30 pages — computed their "Updated" byline, date chip,
// "Last updated" line and JSON-LD dateModified from `new Date()`: the build
// time, so every rebuild re-dated every page while the sitemap carried the
// content date. A page's date now comes from its sitemap <lastmod>
// (sitemapDate in packages/data/src/sitemap-dates.ts).
//
// Every zero-argument `new Date()` / `Date()` and every `Date.now()` in the
// app and UI sources must be either the current year (`new Date().getFullYear()`:
// the year in titles and the copyright line) or one of the genuinely
// current-time uses below, each with its reason. Anything else fails.

const ROOT = join(__dirname, '..', '..', '..');
const SCAN_DIRS = [
  ...readdirSync(join(ROOT, 'apps'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join('apps', d.name, 'src')),
  join('packages', 'ui', 'src'),
];

/** file (repo-relative, `/`-separated) → the current-time expressions it may contain, and why. */
const ALLOWED: Record<string, Array<{ code: string; reason: string }>> = {
  'packages/ui/src/templates/Shortlist.tsx': [
    { code: 'new Date().toISOString()', reason: 'CSV download file name: the day the reader clicks Export, in the browser' },
  ],
  'packages/ui/src/templates/comparator/utils.ts': [
    { code: 'new Date().toISOString()', reason: 'CSV download file name: the day the reader clicks Export, in the browser' },
  ],
  'packages/ui/src/analytics-consent.ts': [
    { code: 'new Date()', reason: "gtag('js', new Date()) inside the inline loader string: runs in the browser at page load, as gtag requires" },
  ],
  'packages/ui/src/consent-record.ts': [
    { code: 'new Date()', reason: 'default `now` for the consent cookie expiry and migration: the reader’s clock, in the browser' },
    { code: 'new Date()', reason: 'default `now` for the consent cookie expiry and migration: the reader’s clock, in the browser' },
  ],
};

const CURRENT_TIME = /\bnew\s+Date\s*\(\s*\)|(?<![\w.$])Date\s*\(\s*\)|\bDate\.now\s*\(\s*\)/g;
const YEAR_ONLY = /^\s*\.getFullYear\s*\(\s*\)/;

function* sources(dir: string): Generator<string> {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) yield* sources(path);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name) && !/\.(test|spec)\.[jt]sx?$/.test(entry.name)) {
      yield path;
    }
  }
}

/** Current-time expressions in one file that are not the current year: `[line, 'new Date().toISOString()']`. */
function currentTimeUses(file: string): Array<[number, string]> {
  const src = readFileSync(join(ROOT, file), 'utf8');
  const uses: Array<[number, string]> = [];
  for (const m of src.matchAll(CURRENT_TIME)) {
    const end = m.index! + m[0].length;
    if (YEAR_ONLY.test(src.slice(end))) continue;
    const line = src.slice(0, m.index).split('\n').length;
    const expr = m[0].startsWith('new') ? 'new Date()' : m[0].startsWith('Date.') ? 'Date.now()' : 'Date()';
    const call = /^\s*\.\w+\s*\(\s*\)/.exec(src.slice(end))?.[0].replace(/\s+/g, '') ?? '';
    uses.push([line, `${expr}${call}`]);
  }
  return uses;
}

const FILES = SCAN_DIRS.flatMap((dir) => [...sources(dir)]).map((f) => f.split(sep).join('/'));

describe('no page or template dates itself with the build clock', () => {
  test('the scan is non-empty: every app and packages/ui', () => {
    expect(SCAN_DIRS.length).toBe(9);
    expect(FILES.filter((f) => f.endsWith('/page.tsx')).length).toBeGreaterThan(200);
    expect(FILES).toContain('packages/ui/src/templates/Listicle.tsx');
  });

  test('every current-time use is the current year or on the reviewed allow-list', () => {
    const unexpected: string[] = [];
    for (const file of FILES) {
      const allowed = [...(ALLOWED[file] ?? [])];
      for (const [line, expr] of currentTimeUses(file)) {
        const i = allowed.findIndex((a) => a.code === expr);
        if (i >= 0) allowed.splice(i, 1);
        else unexpected.push(`${file}:${line} ${expr}`);
      }
    }
    expect(unexpected, 'build-time dates — take the page date from sitemapDate(sitemap(), path)').toEqual([]);
  });

  test('every allow-list entry is still used (no stale exemptions)', () => {
    for (const [file, entries] of Object.entries(ALLOWED)) {
      expect(FILES, file).toContain(file);
      expect(currentTimeUses(file).length, `${file}: current-time uses`).toBe(entries.length);
    }
  });
});
