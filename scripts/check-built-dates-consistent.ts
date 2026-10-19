// Post-build gate: a page's "Updated" byline and JSON-LD dateModified name the
// day its sitemap <lastmod> names (2026-10-19).
//
// The Listicle, IngredientDetail and HeadToHead templates (and ~30 pages)
// stamped the build time: every rebuild made each of those pages say
// "Updated <today>" with a matching JSON-LD dateModified, while the sitemap
// carried the content date from packages/data/src/content-dates.json — three
// claims about one page that disagreed, and two of them false.
//
// For every built page under apps/<region>/out/ it reads
//   - each FPByline date: a <time datetime> right after the byline's
//     "Updated" label (UIStrings.byline.updated, every locale), and
//   - each "dateModified" in the page's JSON-LD,
// and fails unless each one's day (YYYY-MM-DD) equals the UTC day of the
// <lastmod> that apps/<region>/out/sitemap.xml gives the page's URL. An
// indexable page that carries either date but has no sitemap entry fails; a
// noindex page with no entry is listed, not compared (it has no <lastmod>).
// It refuses to pass when a region's sitemap or pages are empty, or when a
// region has no page with a date to compare.
// Runs in CI after all 8 builds are placed (build.yml e2e job) and locally via
// `npm run check:dates-consistent` (optionally `-- us eu`, `-- --root <dir>`).
//
//   npx tsx scripts/check-built-dates-consistent.ts [region...] [--root <monorepo root>]
//
// --root scans another checkout's builds (e.g. an origin/main worktree).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStrings } from '../packages/data/src/index';
import type { Locale } from '../packages/data/src/index';

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
const args = process.argv.slice(2);
const rootAt = args.indexOf('--root');
const ROOT = rootAt >= 0 ? resolve(args[rootAt + 1] ?? '') : resolve(dirname(fileURLToPath(import.meta.url)), '..');
const only = args.filter((a, i) => REGIONS.includes(a) && args[i - 1] !== '--root');
const present = REGIONS.filter((r) => existsSync(join(ROOT, 'apps', r, 'out', 'index.html')));
const scanRegions = only.length ? only : present;
const missing = scanRegions.filter((r) => !present.includes(r));
if (scanRegions.length === 0 || missing.length) {
  console.error(`check-built-dates-consistent: no build output for ${missing.join(', ') || 'any region'} under ${ROOT} — build first.`);
  process.exit(2);
}

const LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const BYLINE_LABELS = [...new Set(LOCALES.map((l) => getStrings(l).byline.updated))];
// FPByline renders `{updated}{space}<time dateTime>`; React may put a comment
// between the label and the space.
const BYLINE_TIME = new RegExp(
  `(?:${BYLINE_LABELS.map(escapeRe).join('|')})(?:<!-- -->)?\\s?(?:<!-- -->)?<time\\b([^>]*)>`,
  'g',
);
const LD_JSON = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
const NOINDEX = /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i;

function* pages(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

/** URL path of a built file: out/a/b/index.html → /a/b/, out/index.html → /. */
function urlPath(out: string, file: string): string {
  const rel = relative(out, file).split(sep).join('/');
  return rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? `/${rel.slice(0, -'index.html'.length)}` : `/${rel}`;
}

/** Every dateModified string anywhere in a JSON-LD value. */
function dateModifiedValues(node: unknown, found: string[] = []): string[] {
  if (Array.isArray(node)) for (const v of node) dateModifiedValues(v, found);
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'dateModified') found.push(String(v));
      else dateModifiedValues(v, found);
    }
  }
  return found;
}

/** pathname → UTC day of its <lastmod>, from the region's built sitemap.xml. */
function sitemapDays(region: string): Map<string, string> {
  const file = join(ROOT, 'apps', region, 'out', 'sitemap.xml');
  if (!existsSync(file)) return new Map();
  const days = new Map<string, string>();
  for (const [, block] of readFileSync(file, 'utf8').matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1];
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1];
    if (!loc || !lastmod) continue;
    const d = new Date(lastmod);
    if (Number.isNaN(d.getTime())) continue;
    days.set(new URL(loc).pathname, d.toISOString().slice(0, 10));
  }
  return days;
}

const failures: string[] = [];
const rows: string[] = [];
const skipped: string[] = [];
let scanned = 0;
let compared = 0;
for (const region of scanRegions) {
  const out = join(ROOT, 'apps', region, 'out');
  const days = sitemapDays(region);
  let regionPages = 0;
  let regionBylines = 0;
  let regionModified = 0;
  let regionCompared = 0;
  let regionBad = 0;
  for (const file of pages(out)) {
    regionPages += 1;
    const raw = readFileSync(file, 'utf8');
    const modified: string[] = [];
    for (const [, json] of raw.matchAll(LD_JSON)) {
      try {
        dateModifiedValues(JSON.parse(json), modified);
      } catch {
        failures.push(`${region} ${urlPath(out, file)}: unparseable JSON-LD block`);
        regionBad += 1;
      }
    }
    const html = raw.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<template\b[\s\S]*?<\/template>/gi, ' ');
    const bylines = [...html.matchAll(BYLINE_TIME)].map(([, attrs]) => /\bdatetime="([^"]*)"/i.exec(attrs)?.[1] ?? '');
    if (bylines.length === 0 && modified.length === 0) continue;
    regionBylines += bylines.length;
    regionModified += modified.length;
    const path = urlPath(out, file);
    const day = days.get(path);
    if (!day) {
      if (NOINDEX.test(raw)) {
        skipped.push(`${region} ${path} (noindex, no sitemap entry)`);
        continue;
      }
      failures.push(`${region} ${path}: has ${bylines.length} byline date(s) / ${modified.length} dateModified but no sitemap <lastmod>`);
      regionBad += 1;
      continue;
    }
    regionCompared += 1;
    for (const [kind, values] of [['byline <time datetime>', bylines], ['JSON-LD dateModified', modified]] as const) {
      for (const value of values) {
        if (value.slice(0, 10) === day) continue;
        failures.push(`${region} ${path}: ${kind} "${value}" ≠ sitemap <lastmod> day ${day}`);
        regionBad += 1;
      }
    }
  }
  scanned += regionPages;
  compared += regionCompared;
  rows.push(
    `  ${region}: ${regionPages} page(s), ${days.size} sitemap URL(s), ${regionBylines} byline date(s), ` +
      `${regionModified} dateModified, ${regionCompared} page(s) compared, ${regionBad} mismatch(es)`,
  );
  if (days.size === 0) failures.push(`${region}: no <url> with a <lastmod> in out/sitemap.xml`);
  // A region where nothing was compared reads exactly like a clean pass — refuse it.
  if (regionCompared === 0) failures.push(`${region}: compared no page — every host has dated listicle pages`);
}

console.log(`check-built-dates-consistent: root=${ROOT} regions=[${scanRegions.join(',')}]`);
for (const r of rows) console.log(r);
for (const s of skipped) console.log(`  skipped: ${s}`);
if (failures.length) {
  console.error(`check-built-dates-consistent: ${failures.length} problem(s):`);
  for (const f of failures.slice(0, 80)) console.error(`  ${f}`);
  if (failures.length > 80) console.error(`  … ${failures.length - 80} more`);
  process.exit(1);
}
if (scanned === 0 || compared === 0) {
  console.error(`check-built-dates-consistent: scanned ${scanned} page(s), compared ${compared} — refusing to report a pass.`);
  process.exit(2);
}
console.log(`check-built-dates-consistent: OK — byline and JSON-LD dateModified match the sitemap <lastmod> on ${compared} page(s) of ${scanned}.`);
