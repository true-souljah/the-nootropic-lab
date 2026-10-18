// Post-build gate: the comparison table speaks its page's language (BACKLOG
// i18n:comparison-table-localized-strings, 2026-10-15).
//
// ComparisonTable falls back to English for every label when its caller passes
// no `strings` bundle, so a localized page that forgets the prop shows English
// headers, sort controls, units, buttons and mobile labels (CA /fr/, EU /de/
// /fr/ /pt/ until 2026-10-15). For every built page under apps/<region>/out/
// that renders the table (its sort controls: a button whose only text is ⇅, ▼
// or ▲, which only ComparisonTable draws) and whose language is not English
// (the subtree's `<div lang="…">` wrapper, else `<html lang>`), it reads the
// visible text and the aria-label / alt / title / placeholder values (scripts,
// styles, templates and comments stripped) and fails when:
//   - a label of the page locale's bundle is missing: the column headers, the
//     filter chips, the sort controls' names, the buy button, the mobile cards'
//     labels, the Actions column, the editor's-choice badge, the score's
//     accessible name, the per-month unit, the money-back days; on EU pages
//     also the EU column, the EU-storefront badge and its tooltip;
//   - an English table label or unit shows: an en bundle value that differs
//     from the locale's, the component's English fallbacks, "Sort by …",
//     "… out of 10 — tap or hover for breakdown", "/mo", "30 days", "30d".
// It also fails when a page in EXPECTED is not found as a localized table page
// (the detector went stale), and refuses to pass when it checked no page.
//
//   npx tsx scripts/check-built-table-locale.ts [region...] [--root <monorepo root>]
//
// --root scans another checkout's builds (e.g. an origin/main worktree) with
// this checkout's strings.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NO_PURCHASE_LINK_STRINGS, getStrings } from '../packages/data/src/index';
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
  console.error(`check-built-table-locale: no build output for ${missing.join(', ') || 'any region'} under ${ROOT} — build first.`);
  process.exit(2);
}

/** Localized pages that render ComparisonTable (route under out/, page language). */
const EXPECTED: Record<string, Array<[route: string, locale: Locale]>> = {
  us: [['es/comparar', 'es'], ['es/mejores-nootropicos', 'es']],
  eu: [['de/beste-nootropika', 'de'], ['fr/meilleurs-nootropiques', 'fr'], ['pt/melhores-nootropicos', 'pt']],
  ca: [['fr/comparer', 'fr-CA'], ['fr/meilleurs-nootropiques', 'fr-CA']],
};

const SORT_BUTTON = /<button\b[^>]*>(?:⇅|▼|▲)<\/button>/;

function localeOfLang(lang: string): Locale | null {
  if (lang === 'fr-CA') return 'fr-CA';
  const base = lang.split('-')[0];
  return (['en', 'es', 'fr', 'ja', 'pt', 'de'] as const).find((l) => l === base) ?? null;
}

function unescape(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** Visible text segments and accessible-name attribute values, whitespace-collapsed. */
function segments(html: string): string[] {
  const body = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<template\b[\s\S]*?<\/template>|<!--[\s\S]*?-->/g, ' ');
  const attrs = [...body.matchAll(/\b(?:aria-label|alt|title|placeholder)="([^"]*)"/g)].map((m) => m[1]);
  return [...body.split(/<[^>]+>/), ...attrs].map((s) => unescape(s).replace(/\s+/g, ' ').trim()).filter(Boolean);
}

const fill = (template: string, vars: Record<string, string>) => template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** A template as a whole-segment pattern; each {placeholder} matches a number. */
const numberPattern = (template: string) =>
  new RegExp(`^${template.split(/\{\w+\}/).map(escapeRe).join('[0-9][0-9.,\\u00a0\\u202f]*')}$`);

const en = getStrings('en');
const EN_PD = en.productDetail;

interface Expectation {
  required: Array<{ what: string; test: (segs: string[]) => boolean }>;
  forbidden: Array<{ what: string; test: (seg: string) => boolean }>;
}

function expectationsFor(locale: Locale, region: string): Expectation {
  const s = getStrings(locale);
  const t = s.table;
  const pd = s.productDetail;
  const has = (v: string) => (segs: string[]) => segs.includes(v);
  const required: Expectation['required'] = [
    ...(['product', 'bestFor', 'score', 'price', 'caffeineFree', 'moneyBack', 'trustpilot', 'actions', 'checkPrice', 'editorChoice', 'euStorefront'] as const).map(
      (k) => ({ what: `table.${k} "${t[k]}"`, test: has(t[k]) }),
    ),
    { what: `sort control "${fill(t.sortAriaActive, { column: t.sortColumns.score, direction: t.descending })}"`, test: has(fill(t.sortAriaActive, { column: t.sortColumns.score, direction: t.descending })) },
    { what: `sort control "${fill(t.sortAria, { column: t.sortColumns.moneyBack })}"`, test: has(fill(t.sortAria, { column: t.sortColumns.moneyBack })) },
    { what: `sort control "${fill(t.sortAria, { column: t.sortColumns.trustpilot })}"`, test: has(fill(t.sortAria, { column: t.sortColumns.trustpilot })) },
    { what: `mobile caffeine-free value "${t.yes}" or "${t.no}"`, test: (segs) => segs.includes(t.yes) || segs.includes(t.no) },
    { what: `score name "${t.scoreAria}"`, test: (segs) => segs.some((x) => numberPattern(t.scoreAria).test(x)) },
    { what: `per-month unit "/${pd.stats.monthUnit}"`, test: (segs) => segs.some((x) => x.includes(`/${pd.stats.monthUnit}`)) },
    { what: `money-back days "${pd.stats.daysCount}"`, test: (segs) => segs.some((x) => numberPattern(pd.stats.daysCount).test(x)) },
    { what: `mobile money-back days "${pd.stats.daysCountShort}"`, test: (segs) => segs.some((x) => numberPattern(pd.stats.daysCountShort).test(x)) },
  ];
  if (region === 'eu') {
    required.push(
      { what: `table.euStatus "${t.euStatus}"`, test: has(t.euStatus) },
      { what: `EU-storefront badge "${pd.regionalBuying.licence.euStorefront}"`, test: has(pd.regionalBuying.licence.euStorefront) },
      { what: `EU-storefront badge tooltip "${t.euStorefrontNote}"`, test: has(t.euStorefrontNote) },
    );
  }
  const own = new Set([
    ...Object.values(t).filter((v): v is string => typeof v === 'string'),
    pd.regionalBuying.licence.euStorefront,
    NO_PURCHASE_LINK_STRINGS[locale].notSoldLabel,
  ]);
  const englishLabels = [
    ...(['product', 'bestFor', 'score', 'price', 'caffeineFree', 'euStatus', 'moneyBack', 'checkPrice', 'noResults', 'yes', 'no', 'na', 'actions', 'editorChoice', 'euStorefront', 'euStorefrontNote'] as const).map((k) => en.table[k]),
    // ComparisonTable's own English fallbacks (mobile cards, empty state).
    'Check Current Price →',
    'Money-back',
    'Caffeine-free',
    'No products match your filters.',
    EN_PD.regionalBuying.licence.euStorefront,
    NO_PURCHASE_LINK_STRINGS.en.notSoldLabel,
  ].filter((v) => !own.has(v));
  const forbidden: Expectation['forbidden'] = [
    ...[...new Set(englishLabels)].map((v) => ({ what: `English label "${v}"`, test: (x: string) => x === v })),
    { what: 'English sort control "Sort by …"', test: (x) => x.startsWith('Sort by ') },
    { what: 'English score name "… out of 10 — tap or hover for breakdown"', test: (x) => x.includes('tap or hover for breakdown') },
    { what: `English per-month unit "/${EN_PD.stats.monthUnit}"`, test: (x) => new RegExp(`/${escapeRe(EN_PD.stats.monthUnit)}\\b`).test(x) },
    { what: `English money-back days "${EN_PD.stats.daysCount}"`, test: (x) => numberPattern(EN_PD.stats.daysCount).test(x) },
    { what: `English money-back days "${EN_PD.stats.daysCountShort}"`, test: (x) => numberPattern(EN_PD.stats.daysCountShort).test(x) },
  ];
  return { required, forbidden };
}

function* pages(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(path);
    else if (entry.name === 'index.html') yield path;
  }
}

const failures: string[] = [];
const rows: string[] = [];
let checked = 0;
for (const region of scanRegions) {
  const out = join(ROOT, 'apps', region, 'out');
  const found = new Map<string, Locale>();
  let tablePages = 0;
  for (const file of pages(out)) {
    const html = readFileSync(file, 'utf8');
    if (!SORT_BUTTON.test(html)) continue;
    tablePages += 1;
    const route = relative(out, dirname(file)) || '.';
    const lang = /<div lang="([^"]+)">/.exec(html)?.[1] ?? /<html\b[^>]*\slang="([^"]+)"/i.exec(html)?.[1] ?? '';
    const locale = localeOfLang(lang);
    if (locale === null) {
      failures.push(`${region}/${route}: page language "${lang}" has no bundle`);
      continue;
    }
    if (locale === 'en') continue;
    found.set(route, locale);
    checked += 1;
    const segs = segments(html);
    const { required, forbidden } = expectationsFor(locale, region);
    const missingLabels = required.filter((r) => !r.test(segs));
    const english = forbidden.flatMap((f) => segs.filter((x) => f.test(x)).map((x) => `${f.what}: "${x.slice(0, 80)}"`));
    for (const m of missingLabels) failures.push(`${region}/${route} [${locale}]: missing ${m.what}`);
    for (const e of [...new Set(english)]) failures.push(`${region}/${route} [${locale}]: ${e}`);
    rows.push(
      `  ${region}/${route} [${locale}] localized labels ${required.length - missingLabels.length}/${required.length}, English table labels ${new Set(english).size}`,
    );
  }
  for (const [route, locale] of EXPECTED[region] ?? []) {
    if (found.get(route) !== locale) {
      failures.push(`${region}/${route}: expected a "${locale}" page with the comparison table, found ${found.has(route) ? `"${found.get(route)}"` : 'none'}`);
    }
  }
  rows.unshift(`  ${region}: ${tablePages} page(s) render the table, ${found.size} in another language than English`);
}

console.log(`check-built-table-locale: root=${ROOT} regions=[${scanRegions.join(',')}]`);
for (const r of rows) console.log(r);
if (failures.length) {
  console.error(`check-built-table-locale: ${failures.length} problem(s):`);
  for (const f of failures.slice(0, 300)) console.error(`  ${f}`);
  if (failures.length > 300) console.error(`  … ${failures.length - 300} more`);
  process.exit(1);
}
// A scanner that matched nothing reads exactly like a clean pass — refuse it.
if (checked === 0) {
  console.error('check-built-table-locale: checked no localized table page — refusing to report a pass.');
  process.exit(2);
}
console.log(`check-built-table-locale: OK — ${checked} localized page(s) render the comparison table in their own language.`);
