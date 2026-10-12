// Post-build affiliate-disclosure gate (operator decision 2026-10-12).
//
// A page may say "we earn a commission if you buy through links on this page"
// (disclosure.inline, the AffiliateDisclosure text, any locale) only when it
// links a product we earn a commission on; every page that does must say it.
// Other pages carry the site-level line (disclosure.siteWide) or, on a
// no-commission product's review page, the no-commission line.
//
// For every built page under apps/<region>/out/ it reads the static HTML
// (scripts, styles and comments stripped) and:
//   - finds commission-earning links: a rel="sponsored" buy link whose href is
//     purchaseUrl(p) of a product in the region's catalogue with
//     earnsCommission(p);
//   - fails a page WITH one that has no page-level commission sentence, or
//     whose top strip is not data-disclosure-scope="page";
//   - fails a page WITHOUT one that carries a page-level commission sentence,
//     a "page" strip, or the commission badge ("Affiliate disclosure",
//     広告（アフィリエイト）…) on its strip or trust note;
//   - fails a rel="sponsored" link that is not a catalogue purchase URL (it
//     cannot be classified, so the page cannot be judged).
// Runs in CI after all 8 builds are placed (build.yml e2e job) and locally
// via `npm run check:disclosure [region...]`.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  earnsCommission, getStrings, purchaseUrl,
} from '../packages/data/src/index';
import type { Locale, Product } from '../packages/data/src/index';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOGUES: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};
const REGIONS = Object.keys(CATALOGUES);
const only = process.argv.slice(2).filter((a) => REGIONS.includes(a));
const present = REGIONS.filter((r) => existsSync(join(ROOT, 'apps', r, 'out', 'index.html')));
const scanRegions = only.length ? only : present;
if (scanRegions.length === 0) {
  console.error('check-built-disclosure: no apps/<region>/out/index.html found — build first.');
  process.exit(2);
}
const missing = only.filter((r) => !present.includes(r));
if (missing.length) {
  console.error(`check-built-disclosure: no build output for ${missing.join(', ')} — build first.`);
  process.exit(2);
}

const LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const BUNDLES = LOCALES.map((l) => getStrings(l).disclosure);
// Page-level commission sentences: the strip / trust note / pricing sentence,
// the in-content AffiliateDisclosure text, and FPDisclosure's English fallback.
const PAGE_CLAIMS = [
  ...new Set([
    ...BUNDLES.map((d) => d.inline),
    ...BUNDLES.map((d) => d.text),
    'We earn a commission when you buy through our links.',
  ]),
];
const COMMISSION_BADGES = [...new Set(BUNDLES.map((d) => d.badge))];

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const decode = (s: string) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|&#xa0;/g, ' ')
    .replace(/&amp;/g, '&');
const stripCode = (html: string) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, '');
const textOf = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

const failures: string[] = [];
const rows: string[] = [];
const totals = { pages: 0, withLink: 0, without: 0, strips: 0 };
for (const region of scanRegions) {
  const commissionUrls = new Set<string>();
  const catalogueUrls = new Set<string>();
  for (const p of CATALOGUES[region]) {
    const url = purchaseUrl(p);
    if (url === null) continue;
    catalogueUrls.add(url);
    if (earnsCommission(p)) commissionUrls.add(url);
  }
  // A URL shared by a commission and a no-commission record cannot be judged.
  for (const p of CATALOGUES[region]) {
    const url = purchaseUrl(p);
    if (url !== null && !earnsCommission(p) && commissionUrls.has(url)) {
      failures.push(`${region}: ${url} belongs to records with and without a commission`);
    }
  }
  const out = join(ROOT, 'apps', region, 'out');
  const scope = { page: 0, site: 0, product: 0, none: 0 };
  let withLink = 0;
  let without = 0;
  const files = walk(out);
  for (const file of files) {
    const page = `${region}${file.slice(out.length)}`;
    const html = stripCode(readFileSync(file, 'utf8'));
    const text = textOf(html);

    // Buy links carry rel="sponsored" (TrackedAffiliateLink, ComparisonTable,
    // StickyCtaBar, page CTAs); a plain citation of the same vendor page is
    // not a buy link.
    let commissionLinks = 0;
    for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
      if (!/\srel="[^"]*\bsponsored\b/i.test(m[0])) continue;
      const href = /\shref="([^"]*)"/i.exec(m[0])?.[1];
      if (href === undefined) continue;
      const url = decode(href);
      if (commissionUrls.has(url)) commissionLinks++;
      else if (!catalogueUrls.has(url)) {
        failures.push(`${page}: rel="sponsored" link to ${url} is not a purchase URL in the ${region} catalogue`);
      }
    }

    const strips = [...html.matchAll(/<div role="note" data-disclosure-scope="(\w+)"[^>]*>([\s\S]*?)<\/div>/g)];
    if (strips.length > 1) failures.push(`${page}: ${strips.length} disclosure strips`);
    const stripScope = strips[0]?.[1] ?? 'none';
    if (!(stripScope in scope)) failures.push(`${page}: unknown strip scope "${stripScope}"`);
    else scope[stripScope as keyof typeof scope]++;
    const labelled = [
      ...strips.map((m) => textOf(m[2])),
      ...[...html.matchAll(/<p role="note" data-trust-note=""[^>]*>([\s\S]*?)<\/p>/g)].map((m) => textOf(m[1])),
    ];
    const claims = PAGE_CLAIMS.filter((c) => text.includes(c));

    if (commissionLinks > 0) {
      withLink++;
      if (claims.length === 0) failures.push(`${page}: ${commissionLinks} commission-earning link(s) but no page-level commission sentence`);
      if (strips.length > 0 && stripScope !== 'page') {
        failures.push(`${page}: ${commissionLinks} commission-earning link(s) but the strip scope is "${stripScope}"`);
      }
    } else {
      without++;
      for (const c of claims) failures.push(`${page}: no commission-earning link, yet says "${c.slice(0, 70)}…"`);
      if (stripScope === 'page') failures.push(`${page}: no commission-earning link, yet the strip scope is "page"`);
      for (const t of labelled) {
        for (const b of COMMISSION_BADGES) if (t.includes(b)) failures.push(`${page}: no commission-earning link, yet the badge "${b}"`);
      }
    }
  }
  totals.pages += files.length;
  totals.withLink += withLink;
  totals.without += without;
  totals.strips += scope.page + scope.site + scope.product;
  rows.push(
    `  ${region.padEnd(5)} pages=${files.length} withCommissionLink=${withLink} without=${without} ` +
      `strip page=${scope.page} site=${scope.site} product=${scope.product} none=${scope.none}`,
  );
}

console.log(`check-built-disclosure: regions=[${scanRegions.join(',')}]`);
for (const r of rows) console.log(r);
if (failures.length) {
  console.error(`check-built-disclosure: ${failures.length} problem(s):`);
  for (const f of failures.slice(0, 300)) console.error(`  ${f}`);
  if (failures.length > 300) console.error(`  … ${failures.length - 300} more`);
  process.exit(1);
}
// A scanner that matched nothing reads exactly like a clean pass — refuse it.
if (totals.pages === 0 || totals.withLink === 0 || totals.without === 0 || totals.strips === 0) {
  console.error(`check-built-disclosure: scanned nothing for ${JSON.stringify(totals)} — refusing to report a pass.`);
  process.exit(2);
}
console.log(
  `check-built-disclosure: OK — ${totals.withLink} page(s) with a commission-earning link all say so; ` +
    `${totals.without} page(s) without one carry no "on this page" claim.`,
);
