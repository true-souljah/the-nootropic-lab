#!/usr/bin/env node
// Post-build gate: every <time> names a machine-readable date (2026-10-19).
//
// FPByline put its display date in `<time dateTime>` ("Oct 19, 2026",
// "19 de oct de 2026", "19 oct 2026") on every listicle, ingredient and
// head-to-head page of all 8 hosts — not a valid datetime value, so the
// element named no date a machine could read.
//
// For every built page under apps/<region>/out/ (scripts, styles and templates
// stripped) it reads each <time> element and fails when its datetime attribute
// — or, without one, its text — is not an ISO date (YYYY-MM-DD) or ISO
// date-time on a real calendar day (no "2026-02-30"). It refuses to pass when
// it scanned no page or found no <time>.
// Runs in CI after all 8 builds are placed (build.yml e2e job) and locally via
// `npm run check:datetime` (optionally `npm run check:datetime -- us eu`).
//
//   node scripts/check-built-datetime.mjs [region...] [--root <monorepo root>]
//
// --root scans another checkout's builds (e.g. an origin/main worktree).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
const args = process.argv.slice(2);
const rootAt = args.indexOf('--root');
const ROOT = rootAt >= 0 ? resolve(args[rootAt + 1] ?? '') : resolve(dirname(fileURLToPath(import.meta.url)), '..');
const only = args.filter((a, i) => REGIONS.includes(a) && args[i - 1] !== '--root');
const present = REGIONS.filter((r) => existsSync(join(ROOT, 'apps', r, 'out', 'index.html')));
const scanRegions = only.length ? only : present;
const missing = scanRegions.filter((r) => !present.includes(r));
if (scanRegions.length === 0 || missing.length) {
  console.error(`check-built-datetime: no build output for ${missing.join(', ') || 'any region'} under ${ROOT} — build first.`);
  process.exit(2);
}

function* pages(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/;

/** A valid HTML date or date-time string on a real calendar day. */
function validDateTime(value) {
  if (!ISO_DATE.test(value) && !ISO_DATE_TIME.test(value)) return false;
  const day = value.slice(0, 10);
  const d = new Date(`${day}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === day;
}

const TIME = /<time\b([^>]*)>([\s\S]*?)<\/time>/gi;
const failures = [];
const rows = [];
let scanned = 0;
let times = 0;
for (const region of scanRegions) {
  const out = join(ROOT, 'apps', region, 'out');
  let regionPages = 0;
  let regionTimes = 0;
  let regionBad = 0;
  for (const file of pages(out)) {
    regionPages += 1;
    const html = readFileSync(file, 'utf8').replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<template\b[\s\S]*?<\/template>/gi, ' ');
    for (const [tag, attrs, text] of html.matchAll(TIME)) {
      regionTimes += 1;
      const attr = /\bdatetime="([^"]*)"/i.exec(attrs);
      const value = attr ? attr[1] : text.replace(/<[^>]+>/g, '').trim();
      if (validDateTime(value)) continue;
      regionBad += 1;
      failures.push(`${region}/${relative(out, file)}: ${tag.slice(0, 120)} — ${attr ? 'datetime' : 'text'} "${value}" is not an ISO date`);
    }
  }
  scanned += regionPages;
  times += regionTimes;
  rows.push(`  ${region}: ${regionPages} page(s), ${regionTimes} <time> element(s), ${regionBad} invalid`);
}

console.log(`check-built-datetime: root=${ROOT} regions=[${scanRegions.join(',')}]`);
for (const r of rows) console.log(r);
if (failures.length) {
  console.error(`check-built-datetime: ${failures.length} problem(s):`);
  for (const f of failures.slice(0, 50)) console.error(`  ${f}`);
  if (failures.length > 50) console.error(`  … ${failures.length - 50} more`);
  process.exit(1);
}
// A scanner that matched nothing reads exactly like a clean pass — refuse it.
if (scanned === 0 || times === 0) {
  console.error(`check-built-datetime: scanned ${scanned} page(s) and ${times} <time> element(s) — refusing to report a pass.`);
  process.exit(2);
}
console.log(`check-built-datetime: OK — ${times} <time> element(s) on ${scanned} page(s) name an ISO date.`);
