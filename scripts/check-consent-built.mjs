#!/usr/bin/env node
// Post-build consent gate (portfolio consent audit 2026-09-29; operator
// decisions 2026-09-30: Basic consent mode + persistent withdraw control).
//
// Scans every built page under apps/<region>/out/ and fails when a page:
//   - references a tracker host in a static <script src> or <link> (a
//     preload/preconnect fetches it before the visitor has chosen — the
//     next/script `src` preload that shipped googletagmanager.com and
//     static.cloudflareinsights.com requests on every first visit);
//   - mentions the Cloudflare beacon or its unresolved placeholder token;
//   - lacks the Klaro mount point (<div id="klaro">);
//   - lacks the persistent "Cookie settings" control (data-cookie-settings).
// Runs in CI after all 8 builds are placed (build.yml e2e job) and locally
// via `npm run check:consent [region...]`.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
const only = process.argv.slice(2).filter((a) => REGIONS.includes(a));
const present = REGIONS.filter((r) => existsSync(join(ROOT, 'apps', r, 'out', 'index.html')));
const scanRegions = only.length ? only : present;
if (scanRegions.length === 0) {
  console.error('check-consent-built: no apps/<region>/out/index.html found — build first.');
  process.exit(2);
}
const missing = only.filter((r) => !present.includes(r));
if (missing.length) {
  console.error(`check-consent-built: no build output for ${missing.join(', ')} — build first.`);
  process.exit(2);
}

const TRACKER_HOSTS = /(googletagmanager\.com|google-analytics\.com|impactcdn\.com|cloudflareinsights\.com)/;

function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const failures = [];
let pages = 0;
for (const region of scanRegions) {
  const out = join(ROOT, 'apps', region, 'out');
  const files = walk(out);
  if (files.length === 0) {
    failures.push(`${region}: out/ has no HTML pages`);
    continue;
  }
  for (const file of files) {
    const rel = `${region}/${relative(out, file)}`;
    // 404.html / _not-found are included on purpose: a visitor can land there.
    pages++;
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
      const tag = m[0];
      const url = tag.match(/\s(?:src|href)=["']([^"']+)["']/i)?.[1] ?? '';
      if (TRACKER_HOSTS.test(url)) failures.push(`${rel}: pre-consent tracker fetch ${tag.slice(0, 160)}`);
    }
    if (/cloudflareinsights|data-cf-beacon|REPLACE_WITH_CF/.test(html)) {
      failures.push(`${rel}: Cloudflare beacon / placeholder token present`);
    }
    if (!/<div id="klaro"/.test(html)) failures.push(`${rel}: no Klaro mount point`);
    if (!/data-cookie-settings/.test(html)) failures.push(`${rel}: no "Cookie settings" withdraw control`);
  }
}

console.log(`check-consent-built: scanned ${pages} pages across ${scanRegions.join(', ')}`);
if (pages === 0) {
  console.error('check-consent-built: zero pages scanned — refusing to pass');
  process.exit(1);
}
if (failures.length) {
  for (const f of failures.slice(0, 200)) console.error(`  ✗ ${f}`);
  if (failures.length > 200) console.error(`  … and ${failures.length - 200} more`);
  console.error(`check-consent-built: FAIL (${failures.length} problems)`);
  process.exit(1);
}
console.log('check-consent-built: PASS');
