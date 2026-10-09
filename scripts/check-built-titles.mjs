#!/usr/bin/env node
// Post-build page-title gate (2026-10).
//
// Every app layout sets `title.template: '%s | The Nootropic Lab <REGION>'`,
// so a page whose own `title` already ends in the brand renders it twice:
// "What Are Nootropics? … — The Nootropic Lab | The Nootropic Lab". That shipped
// on all 8 hosts' guide and imprint pages plus two US tools before this guard.
// A source grep cannot see titles built in generateMetadata or helpers, so this
// checks the rendered output instead.
//
// For every built page under apps/<region>/out/ it asserts:
//   - exactly one non-empty <title>;
//   - the brand ("Nootropic Lab") appears at most once in <title>, og:title
//     and twitter:title.
// Runs in CI after all 8 builds are placed (build.yml e2e job) and locally via
// `npm run check:titles` (optionally `npm run check:titles -- us eu`).
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
const only = process.argv.slice(2).filter((a) => REGIONS.includes(a));
const present = REGIONS.filter((r) => existsSync(join(ROOT, 'apps', r, 'out', 'index.html')));
const scanRegions = only.length ? only : present;
if (scanRegions.length === 0) {
  console.error('check-built-titles: no apps/<region>/out/index.html found — build first.');
  process.exit(2);
}

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

const BRAND = /nootropic lab/gi;
const brandCount = (s) => (s.match(BRAND) ?? []).length;
const titleRe = /<title[^>]*>([\s\S]*?)<\/title>/gi;
const metaRe = (attr, name) => new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, 'g');
const OG = metaRe('property', 'og:title');
const TW = metaRe('name', 'twitter:title');

const failures = [];
const counts = { pages: 0, titles: 0, 'og:title': 0, 'twitter:title': 0 };
for (const region of scanRegions) {
  const out = join(ROOT, 'apps', region, 'out');
  for (const file of walk(out)) {
    counts.pages += 1;
    const html = readFileSync(file, 'utf8');
    const page = `${region}${file.slice(out.length)}`;
    // <title> inside an inline <svg> is an accessible name, not the document title.
    const head = html.replace(/<svg[\s\S]*?<\/svg>/gi, '');
    const titles = [...head.matchAll(titleRe)].map((m) => decode(m[1]));
    counts.titles += titles.length;
    if (titles.length !== 1) failures.push(`${page}: ${titles.length} <title> elements`);
    else if (!titles[0]) failures.push(`${page}: empty <title>`);
    for (const t of titles) {
      if (brandCount(t) > 1) failures.push(`${page}: brand repeated in <title> "${t}"`);
    }
    for (const [kind, re] of [['og:title', OG], ['twitter:title', TW]]) {
      for (const m of html.matchAll(re)) {
        counts[kind] += 1;
        const t = decode(m[1]);
        if (brandCount(t) > 1) failures.push(`${page}: brand repeated in ${kind} "${t}"`);
      }
    }
  }
}

console.log(
  `check-built-titles: regions=[${scanRegions.join(',')}] ` +
    Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(' '),
);
// A scanner that matched nothing reads exactly like a clean pass — refuse it.
const empty = ['pages', 'titles', 'og:title'].filter((k) => counts[k] === 0);
if (empty.length) {
  console.error(`check-built-titles: scanned nothing for [${empty.join(', ')}] — refusing to report a pass.`);
  process.exit(2);
}
if (failures.length) {
  console.error(`check-built-titles: ${failures.length} problem(s):`);
  for (const f of failures.slice(0, 300)) console.error(`  ${f}`);
  if (failures.length > 300) console.error(`  … ${failures.length - 300} more`);
  process.exit(1);
}
console.log('check-built-titles: OK — one non-empty <title> per page, brand never repeated.');
