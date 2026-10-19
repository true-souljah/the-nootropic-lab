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
//     cannot be classified, so the page cannot be judged);
//   - on a route in CLIENT_RENDERED_BUY_LINK_ROUTES (buy links rendered in the
//     browser, absent from the static HTML), requires the "page" strip and
//     the page-level sentence regardless, and fails when the route is not built;
//   - on a page in another language than English (the subtree's
//     `<div lang="…">` wrapper, else `<html lang>`), fails any English
//     disclosure sentence or label, and any strip / trust note / in-content
//     notice that is not in the page's own language;
//   - Amazon Associates (US account only): a page with a rel="sponsored" link
//     to an Associates record's purchase URL (isAmazonAssociatesLink) must
//     carry AMAZON_ASSOCIATES_STATEMENT in its disclosure strip, and a page
//     without one must not carry it anywhere. A client-rendered route may link
//     any catalogue product, so it carries the statement exactly when the
//     region's catalogue has an Associates link. The statement is Amazon's
//     verbatim English text on every page, so the language checks skip it.
// Runs in CI after all 8 builds are placed (build.yml e2e job) and locally
// via `npm run check:disclosure [region...]`.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  AMAZON_ASSOCIATES_STATEMENT, CLIENT_RENDERED_BUY_LINK_ROUTES, earnsCommission, getStrings,
  isAmazonAssociatesLink, purchaseUrl,
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

// ── Language of the disclosure ─────────────────────────────────────────
const EN = getStrings('en').disclosure;
// English disclosure sentences: the bundle's, plus FPDisclosure's English
// fallback for callers without a bundle. None may appear on a page in
// another language.
const EN_SENTENCES = [
  EN.text, EN.inline, EN.noCommission, EN.siteWide, EN.ranking,
  'We earn a commission when you buy through our links.',
  'Our scores are computed before commissions are checked.',
];
// English labels: checked on the disclosure elements and their aria-labels
// ("Disclosure" alone is too common a word to search the whole page for).
const EN_LABELS = [EN.badge, EN.neutralBadge, EN.methodology];
/** Locale bundle of a page language (`<html lang>` / subtree `<div lang>`). */
function localeOfLang(lang: string): Locale | null {
  if (lang === 'fr-CA') return 'fr-CA';
  const base = lang.split('-')[0];
  return (LOCALES as string[]).includes(base) ? (base as Locale) : null;
}
/** The locale whose disclosure sentence a strip / trust note / notice carries. */
function localeOfDisclosure(text: string): Locale | undefined {
  return LOCALES.find((l) => {
    const d = getStrings(l).disclosure;
    return [d.inline, d.siteWide, d.noCommission, d.text].some((s) => text.includes(s));
  });
}

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
const totals = { pages: 0, withLink: 0, without: 0, strips: 0, clientRendered: 0, associates: 0 };
for (const region of scanRegions) {
  const commissionUrls = new Set<string>();
  const catalogueUrls = new Set<string>();
  const associatesUrls = new Set<string>();
  for (const p of CATALOGUES[region]) {
    const url = purchaseUrl(p);
    if (url === null) continue;
    catalogueUrls.add(url);
    if (earnsCommission(p)) commissionUrls.add(url);
    if (isAmazonAssociatesLink(p)) associatesUrls.add(url);
  }
  // A URL shared by a commission and a no-commission record cannot be judged.
  for (const p of CATALOGUES[region]) {
    const url = purchaseUrl(p);
    if (url !== null && !earnsCommission(p) && commissionUrls.has(url)) {
      failures.push(`${region}: ${url} belongs to records with and without a commission`);
    }
  }
  const out = join(ROOT, 'apps', region, 'out');
  // Routes whose buy links render in the browser: their static HTML holds no
  // buy link to count, so they must carry the "page" strip regardless.
  const clientRoutes = new Set(
    CLIENT_RENDERED_BUY_LINK_ROUTES[region as keyof typeof CLIENT_RENDERED_BUY_LINK_ROUTES] ?? [],
  );
  for (const route of clientRoutes) {
    if (!existsSync(join(out, route, 'index.html'))) {
      failures.push(`${region}${route}: listed in CLIENT_RENDERED_BUY_LINK_ROUTES but not in the build`);
    }
  }
  const scope = { page: 0, site: 0, product: 0, none: 0 };
  let withLink = 0;
  let without = 0;
  let clientRendered = 0;
  // Pages whose static HTML links an Amazon Associates record, and pages that carry the statement.
  let associatesLinkPages = 0;
  let associatesStatements = 0;
  // Per page language: pages, and disclosure elements checked on them.
  const langs: Record<string, { pages: number; disclosures: number }> = {};
  const files = walk(out);
  for (const file of files) {
    const route = file.slice(out.length).replace(/index\.html$/, '');
    const page = `${region}${file.slice(out.length)}`;
    const html = stripCode(readFileSync(file, 'utf8'));
    const text = textOf(html);

    // Buy links carry rel="sponsored" (TrackedAffiliateLink, ComparisonTable,
    // StickyCtaBar, page CTAs); a plain citation of the same vendor page is
    // not a buy link.
    let commissionLinks = 0;
    let associatesLinks = 0;
    for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
      if (!/\srel="[^"]*\bsponsored\b/i.test(m[0])) continue;
      const href = /\shref="([^"]*)"/i.exec(m[0])?.[1];
      if (href === undefined) continue;
      const url = decode(href);
      if (associatesUrls.has(url)) associatesLinks++;
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
    // In-content notices (AffiliateDisclosure and page-authored equivalents).
    const notices = [...html.matchAll(/<div class="disclosure-banner[^"]*" role="note"[^>]*>([\s\S]*?)<\/div>/g)].map((m) =>
      textOf(m[1]),
    );
    const claims = PAGE_CLAIMS.filter((c) => text.includes(c));

    // Amazon Associates statement: on the strip of a page that links an
    // Associates record (a client-rendered route: when the catalogue has one),
    // and nowhere on any other page.
    if (associatesLinks > 0 && !clientRoutes.has(route)) associatesLinkPages++;
    const needsStatement = clientRoutes.has(route) ? associatesUrls.size > 0 : associatesLinks > 0;
    if (needsStatement) {
      associatesStatements++;
      if (!(strips[0] && textOf(strips[0][2]).includes(AMAZON_ASSOCIATES_STATEMENT))) {
        const why = clientRoutes.has(route)
          ? 'may render an Amazon Associates link in the browser (CLIENT_RENDERED_BUY_LINK_ROUTES)'
          : `${associatesLinks} Amazon Associates link(s)`;
        failures.push(`${page}: ${why}, yet no "${AMAZON_ASSOCIATES_STATEMENT}" on the disclosure strip`);
      }
    } else if (text.includes(AMAZON_ASSOCIATES_STATEMENT)) {
      failures.push(`${page}: no Amazon Associates link, yet says "${AMAZON_ASSOCIATES_STATEMENT}"`);
    }

    if (clientRoutes.has(route)) {
      clientRendered++;
      if (stripScope !== 'page') {
        failures.push(`${page}: renders buy links in the browser (CLIENT_RENDERED_BUY_LINK_ROUTES), yet the static strip scope is "${stripScope}"`);
      }
      if (claims.length === 0) {
        failures.push(`${page}: renders buy links in the browser (CLIENT_RENDERED_BUY_LINK_ROUTES), yet no page-level commission sentence`);
      }
    } else if (commissionLinks > 0) {
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

    // Language: a translated subtree wraps its pages in <div lang="…">
    // (us /es/, eu /de/ /fr/ /pt/, ca /fr/); otherwise the page is in its
    // root layout's <html lang> (ja for jp, es for latam).
    const lang = /<div lang="([^"]+)">/.exec(html)?.[1] ?? /<html\b[^>]*\slang="([^"]+)"/i.exec(html)?.[1] ?? '';
    const locale = localeOfLang(lang);
    if (locale === null) {
      failures.push(`${page}: page language "${lang}" has no disclosure bundle`);
      continue;
    }
    const disclosures = [...labelled, ...notices];
    const stat = (langs[lang] ??= { pages: 0, disclosures: 0 });
    stat.pages++;
    stat.disclosures += disclosures.length;
    for (const t of disclosures) {
      const found = localeOfDisclosure(t);
      if (found !== undefined && found !== locale) {
        failures.push(`${page}: ${found} disclosure on a "${lang}" page: "${t.slice(0, 70)}…"`);
      } else if (found === undefined && locale !== 'en') {
        failures.push(`${page}: disclosure in no "${locale}" bundle on a "${lang}" page: "${t.slice(0, 70)}…"`);
      }
    }
    if (locale !== 'en') {
      for (const s of EN_SENTENCES) {
        if (text.includes(s)) failures.push(`${page}: English disclosure on a "${lang}" page: "${s.slice(0, 70)}…"`);
      }
      for (const t of disclosures) {
        for (const l of EN_LABELS) if (t.includes(l)) failures.push(`${page}: English disclosure label "${l}" on a "${lang}" page`);
      }
      for (const m of html.matchAll(/<[a-z]+\b[^>]*\srole="note"[^>]*>/gi)) {
        const label = decode(/\saria-label="([^"]*)"/.exec(m[0])?.[1] ?? '');
        if (EN_LABELS.includes(label)) failures.push(`${page}: English aria-label "${label}" on a disclosure of a "${lang}" page`);
      }
    }
  }
  totals.pages += files.length;
  totals.withLink += withLink;
  totals.without += without;
  totals.strips += scope.page + scope.site + scope.product;
  totals.clientRendered += clientRendered;
  totals.associates += associatesStatements;
  if (clientRendered !== clientRoutes.size) {
    failures.push(`${region}: checked ${clientRendered} of ${clientRoutes.size} CLIENT_RENDERED_BUY_LINK_ROUTES pages`);
  }
  // A language with pages but no disclosure element matched means the
  // element patterns above went stale: refuse rather than pass.
  for (const [lang, s] of Object.entries(langs)) {
    if (lang !== 'en' && s.pages > 0 && s.disclosures === 0) {
      failures.push(`${region}: ${s.pages} "${lang}" page(s) but no disclosure element matched on them`);
    }
  }
  // The catalogue has Associates links but no built page links one: the
  // link pattern went stale, so the statement check scanned nothing.
  if (associatesUrls.size > 0 && associatesLinkPages === 0) {
    failures.push(`${region}: ${associatesUrls.size} Amazon Associates purchase URL(s) in the catalogue, but no built page links one`);
  }
  rows.push(
    `  ${region.padEnd(5)} pages=${files.length} withCommissionLink=${withLink} without=${without} ` +
      `clientRendered=${clientRendered} amazonAssociates=${associatesLinkPages}p/${associatesStatements}s ` +
      `strip page=${scope.page} site=${scope.site} product=${scope.product} none=${scope.none} ` +
      `lang ${Object.entries(langs)
        .map(([l, s]) => `${l}=${s.pages}p/${s.disclosures}d`)
        .join(' ')}`,
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
    `${totals.without} page(s) without one carry no "on this page" claim; ` +
    `${totals.clientRendered} page(s) with browser-rendered buy links carry the page-level strip; ` +
    `${totals.associates} page(s) that link an Amazon Associates record carry Amazon's statement, and no other page does; ` +
    `every disclosure is in its page's language.`,
);
