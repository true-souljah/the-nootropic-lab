#!/usr/bin/env node
// Post-build link integrity gate (GSC 404 cleanup, 2026-09).
//
// Scans every built page under apps/<region>/out/ and asserts that each
// <link rel="alternate" hreflang> target and each internal <a href> resolves
// to a file in the target region's build output. This is the deterministic
// guard for the two 404 classes GSC reported: hreflang alternates pointing at
// products/geo pages another host does not have, and shared-chrome links to
// region-specific pages. Runs in CI after all 8 builds are placed (build.yml
// e2e job) and locally via `npm run check:links`.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const HOSTS = {
  'https://thenootropiclab.com': 'us',
  'https://eu.thenootropiclab.com': 'eu',
  'https://ca.thenootropiclab.com': 'ca',
  'https://au.thenootropiclab.com': 'au',
  'https://jp.thenootropiclab.com': 'jp',
  'https://latam.thenootropiclab.com': 'latam',
  'https://gcc.thenootropiclab.com': 'gcc',
  'https://sea.thenootropiclab.com': 'sea',
};
const REGIONS = Object.values(HOSTS);
const only = process.argv.slice(2).filter((a) => REGIONS.includes(a));
const present = REGIONS.filter((r) => existsSync(join(ROOT, 'apps', r, 'out', 'index.html')));
const scanRegions = only.length ? only : present;
if (scanRegions.length === 0) {
  console.error('check-built-links: no apps/<region>/out/index.html found — build first.');
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

function targetExists(region, path) {
  const out = join(ROOT, 'apps', region, 'out');
  if (!existsSync(out)) return 'unbuilt';
  const clean = path.split('#')[0].split('?')[0];
  const candidates = clean.endsWith('/')
    ? [join(out, clean, 'index.html')]
    : [join(out, clean), join(out, `${clean}.html`), join(out, clean, 'index.html')];
  return candidates.some((c) => existsSync(c) && statSync(c).isFile()) ? 'ok' : 'missing';
}

function toRegionPath(href, selfRegion) {
  if (href.startsWith('/')) return href.startsWith('//') ? null : { region: selfRegion, path: href };
  for (const [host, region] of Object.entries(HOSTS)) {
    if (href === host) return { region, path: '/' };
    if (href.startsWith(`${host}/`)) return { region, path: href.slice(host.length) };
  }
  return null; // external
}

const altRe = /<link[^>]+rel="alternate"[^>]*>/gi;
const hrefRe = /href="([^"]+)"/;
const anchorRe = /<a\s[^>]*href="([^"]+)"/g;

const failures = [];
let pages = 0, alternates = 0, anchors = 0, skippedUnbuilt = 0;
for (const region of scanRegions) {
  const out = join(ROOT, 'apps', region, 'out');
  for (const file of walk(out)) {
    pages += 1;
    const html = readFileSync(file, 'utf8');
    const rel = file.slice(out.length);
    const seen = new Set();
    const check = (kind, href) => {
      const decoded = href.replace(/&amp;/g, '&');
      const t = toRegionPath(decoded, region);
      if (!t || t.path.startsWith('/_next/') || t.path.startsWith('/cdn-cgi/')) return;
      const key = `${kind} ${t.region}${t.path}`;
      if (seen.has(key)) return;
      seen.add(key);
      const status = targetExists(t.region, t.path);
      if (status === 'unbuilt') { skippedUnbuilt += 1; return; }
      if (status === 'missing') failures.push(`${region}${rel}  ${kind} → ${t.region}${t.path}`);
    };
    for (const tag of html.match(altRe) ?? []) {
      if (!/hreflang=/i.test(tag)) continue;
      const m = hrefRe.exec(tag);
      if (m) { alternates += 1; check('hreflang', m[1]); }
    }
    let a;
    while ((a = anchorRe.exec(html)) !== null) { anchors += 1; check('a', a[1]); }
  }
}

console.log(
  `check-built-links: regions=[${scanRegions.join(',')}] pages=${pages} hreflang=${alternates} anchors=${anchors}` +
    (skippedUnbuilt ? ` (skipped ${skippedUnbuilt} targets in unbuilt regions)` : ''),
);
if (pages === 0 || alternates === 0) {
  console.error('check-built-links: scanned nothing — refusing to report a pass.');
  process.exit(2);
}
if (failures.length) {
  console.error(`check-built-links: ${failures.length} dead link(s):`);
  for (const f of failures.slice(0, 200)) console.error('  ' + f);
  if (failures.length > 200) console.error(`  … ${failures.length - 200} more`);
  process.exit(1);
}
console.log('check-built-links: OK — every hreflang alternate and internal anchor resolves.');
