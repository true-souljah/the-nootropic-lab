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
//
// 2026-10 extension: Googlebot also harvests URL-shaped strings from places a
// browser never navigates — the inline RSC flight payload (`self.__next_f`)
// and JSON-LD. GSC "Page with redirect" filled with slash-less URLs because
// the payload carries `href` props as authored ("/imprint") while the rendered
// <a> gets Next's trailing slash; "Not found (404)" got "/methodology/Methodology"
// from a React key built as href + label. So every internal reference — anchor,
// hreflang, canonical, og:url, JSON-LD URL, payload `href` prop and path-shaped React
// key — must resolve AND, when it resolves to a directory page, end in "/"
// (Cloudflare Pages 308s the slash-less form).
//
// Any other payload string that starts with "/" is crawled the same way: GSC
// 404s included "/mo", "/day", "/10", "/5" — price units and score suffixes
// that React emitted as separate text nodes ({price}/mo) or as i18n props.
// So every "/"-prefixed payload string must resolve too (rsc-string); render
// such text as one template literal (`${price}/mo`) so it starts with a digit
// or currency sign. Next.js internals ("/_not-found") are skipped.
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

const isFile = (p) => existsSync(p) && statSync(p).isFile();

// 'ok' | 'slashless' (a directory page referenced without its trailing slash —
// served as a 308) | 'missing' | 'unbuilt'.
function targetExists(region, path) {
  const out = join(ROOT, 'apps', region, 'out');
  if (!existsSync(out)) return 'unbuilt';
  let clean = path.split('#')[0].split('?')[0];
  try { clean = decodeURIComponent(clean); } catch { /* keep the raw path; a bad escape will not resolve */ }
  if (clean.endsWith('/')) return isFile(join(out, clean, 'index.html')) ? 'ok' : 'missing';
  if (isFile(join(out, clean)) || isFile(join(out, `${clean}.html`))) return 'ok';
  return isFile(join(out, clean, 'index.html')) ? 'slashless' : 'missing';
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
const canonicalRe = /<link[^>]+rel="canonical"[^>]*>/gi;
const ogUrlRe = /<meta property="og:url" content="([^"]+)"/g;
const hrefRe = /href="([^"]+)"/;
const anchorRe = /<a\s[^>]*href="([^"]+)"/g;
const jsonLdRe = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
// Each flight chunk is a JSON-encoded string literal: self.__next_f.push([1,"…"]).
const flightRe = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g;
// Inside the decoded payload: `href` props, and React element keys
// (["$", type, key, props]) that look like paths.
const payloadHrefRe = /"href":"(\/[^"]*)"/g;
const payloadKeyRe = /\["\$","[^"]*","(\/[^"]*)"/g;
// Every other string literal in the payload that starts with a single "/".
const payloadStringRe = /"(\/(?![/_])(?:[^"\\]|\\.)*)"/g;
// Every serialized element, keyed or not — proves the payload decoded into
// elements even when no key happens to be path-shaped.
const payloadElementRe = /\["\$","[^"]*",(?:null|"[^"]*")/g;

function absoluteUrls(node, acc = []) {
  if (typeof node === 'string') {
    if (Object.keys(HOSTS).some((h) => node === h || node.startsWith(`${h}/`))) acc.push(node);
  } else if (Array.isArray(node)) {
    for (const v of node) absoluteUrls(v, acc);
  } else if (node && typeof node === 'object') {
    for (const v of Object.values(node)) absoluteUrls(v, acc);
  }
  return acc;
}

const failures = new Map(); // "<kind> <reason> <region><path>" -> [pages]
const counts = { pages: 0, hreflang: 0, canonical: 0, 'og:url': 0, a: 0, 'json-ld': 0, 'rsc-href': 0, 'rsc-key': 0, 'rsc-string': 0, flightChunks: 0, rscElements: 0 };
let skippedUnbuilt = 0;
for (const region of scanRegions) {
  const out = join(ROOT, 'apps', region, 'out');
  for (const file of walk(out)) {
    counts.pages += 1;
    const html = readFileSync(file, 'utf8');
    const rel = file.slice(out.length);
    const page = `${region}${rel}`;
    const seen = new Set();
    const fail = (key) => {
      if (!failures.has(key)) failures.set(key, []);
      failures.get(key).push(page);
    };
    const check = (kind, href) => {
      counts[kind] += 1;
      const decoded = href.replace(/&amp;/g, '&');
      const t = toRegionPath(decoded, region);
      if (!t || t.path.startsWith('/_next/') || t.path.startsWith('/cdn-cgi/')) return;
      const key = `${kind} ${t.region}${t.path}`;
      if (seen.has(key)) return;
      seen.add(key);
      const status = targetExists(t.region, t.path);
      if (status === 'unbuilt') { skippedUnbuilt += 1; return; }
      if (status === 'missing') fail(`${kind} dead → ${t.region}${t.path}`);
      if (status === 'slashless') fail(`${kind} no trailing slash (308) → ${t.region}${t.path}`);
    };
    for (const tag of html.match(altRe) ?? []) {
      if (!/hreflang=/i.test(tag)) continue;
      const m = hrefRe.exec(tag);
      if (m) check('hreflang', m[1]);
    }
    for (const tag of html.match(canonicalRe) ?? []) {
      const m = hrefRe.exec(tag);
      if (m) check('canonical', m[1]);
    }
    for (const m of html.matchAll(ogUrlRe)) check('og:url', m[1]);
    for (const a of html.matchAll(anchorRe)) check('a', a[1]);
    for (const s of html.matchAll(jsonLdRe)) {
      let data;
      try { data = JSON.parse(s[1]); } catch { fail('json-ld unparseable block'); continue; }
      for (const u of absoluteUrls(data)) check('json-ld', u);
    }
    let payload = '';
    for (const c of html.matchAll(flightRe)) {
      counts.flightChunks += 1;
      try { payload += JSON.parse(c[1]); } catch { fail('rsc unparseable flight chunk'); }
    }
    const typed = new Set();
    for (const m of payload.matchAll(payloadHrefRe)) { typed.add(m[1]); check('rsc-href', m[1]); }
    for (const m of payload.matchAll(payloadKeyRe)) { typed.add(m[1]); check('rsc-key', m[1]); }
    for (const m of payload.matchAll(payloadStringRe)) if (!typed.has(m[1])) check('rsc-string', JSON.parse(`"${m[1]}"`));
    counts.rscElements += (payload.match(payloadElementRe) ?? []).length;
  }
}

console.log(
  `check-built-links: regions=[${scanRegions.join(',')}] ` +
    Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(' ') +
    (skippedUnbuilt ? ` (skipped ${skippedUnbuilt} targets in unbuilt regions)` : ''),
);
// A scanner that matched nothing reads exactly like a clean pass — refuse it.
// Only the parser-health signals must be non-zero: path-shaped React keys and
// og:url may legitimately be absent from a clean build.
const MUST_SCAN = ['pages', 'hreflang', 'canonical', 'a', 'json-ld', 'flightChunks', 'rscElements', 'rsc-href'];
const empty = MUST_SCAN.filter((k) => counts[k] === 0);
if (empty.length) {
  console.error(`check-built-links: scanned nothing for [${empty.join(', ')}] — refusing to report a pass.`);
  process.exit(2);
}
if (failures.size) {
  const rows = [...failures].sort((x, y) => y[1].length - x[1].length);
  const total = rows.reduce((n, [, p]) => n + p.length, 0);
  console.error(`check-built-links: ${rows.length} bad target(s) across ${total} page reference(s):`);
  for (const [key, pages] of rows.slice(0, 300)) {
    console.error(`  ${key}  ×${pages.length}  e.g. ${pages[0]}`);
  }
  if (rows.length > 300) console.error(`  … ${rows.length - 300} more`);
  process.exit(1);
}
console.log('check-built-links: OK — every internal reference resolves, trailing slash included.');
