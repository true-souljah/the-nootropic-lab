import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import {
  allProductsUS, allProductsJP, productsUS, productsEU,
  CLIENT_RENDERED_BUY_LINK_ROUTES,
  disclosureCopy, earnsCommission, getStrings, pageDisclosureScope, purchaseUrl, reviewDisclosureScope,
  ingredients, localizedIngredients,
} from '@nootropic/data';
import type { DisclosureScope, Locale, Product } from '@nootropic/data';
import { FPDisclosure } from './public-chrome/FPDisclosure';
import { FPTrustNote } from './public-chrome/FPTrustNote';
import PublicShell from './templates/PublicShell';
import BestOf from './templates/BestOf';
import HeadToHead from './templates/HeadToHead';
import Listicle from './templates/Listicle';
import ProductDetail from './templates/ProductDetail';
import Shortlist from './templates/Shortlist';

// Operator decision 2026-10-12: a page says "we earn a commission if you buy
// through links on this page" only when it renders a buy link to a product we
// earn a commission on (DisclosureScope 'page'). Every other page carries a
// site-level line ('site'); the review page of a no-commission product keeps
// its no-commission line ('product'). 'site' and 'product' carry a neutral
// badge: never "Affiliate disclosure" or 広告（アフィリエイト）.
// scripts/check-built-disclosure.ts checks the same rule on every built page.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const REPO = join(__dirname, '..', '..', '..');

// Each locale's "on this page" wording. Self-tested below against `inline`.
const PAGE_PHRASE: Record<Locale, RegExp> = {
  en: /\bthis page\b/i,
  es: /\besta página\b/i,
  fr: /\bcette page\b/i,
  'fr-CA': /\bcette page\b/i,
  pt: /\bdesta página\b/i,
  de: /\bdieser Seite\b/i,
  ja: /本ページ|このページ/,
};
const COMMISSION_BADGE = /affiliat|afiliad|広告|アフィリエイト|werbe|publicit|anuncio/i;

/** Rendered text: React escapes quotes and ampersands. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/** The top strip: its scope and its text without tags. */
function strip(html: string): { scope: string; text: string } | null {
  const m = /<div role="note" data-disclosure-scope="(\w+)"[^>]*>([\s\S]*?)<\/div>/.exec(html);
  return m ? { scope: m[1], text: m[2].replace(/<[^>]+>/g, '') } : null;
}

/** The inline trust note's text without tags. */
function trustNote(html: string): string | null {
  const m = /<p role="note" data-trust-note=""[^>]*>([\s\S]*?)<\/p>/.exec(html);
  return m ? m[1].replace(/<[^>]+>/g, '') : null;
}

function assertScope(html: string, s: ReturnType<typeof getStrings>, scope: DisclosureScope, withTrustNote: boolean) {
  const d = s.disclosure;
  const top = strip(html);
  expect(top, 'top strip rendered').not.toBeNull();
  expect(top!.scope).toBe(scope);
  const note = trustNote(html);
  if (withTrustNote) expect(note, 'trust note rendered').not.toBeNull();
  for (const t of [top!.text, ...(withTrustNote ? [note!] : [])]) {
    if (scope === 'page') {
      expect(t).toContain(d.badge);
      expect(t).toContain(d.inline);
    } else {
      expect(t).toContain(d.neutralBadge);
      expect(t).not.toContain(d.badge);
      expect(t).toContain(scope === 'site' ? d.siteWide : d.noCommission);
    }
  }
  if (scope !== 'page') {
    // No "links on this page" sentence of any locale anywhere on the page.
    for (const l of ALL_LOCALES) expect(html).not.toContain(getStrings(l).disclosure.inline);
    expect(html).not.toContain(d.text);
  }
}

const mlp = allProductsUS.find((p) => p.slug === 'mind-lab-pro-review')!;
const qualia = allProductsUS.find((p) => p.slug === 'qualia-mind-review')!;
const onnit = allProductsUS.find((p) => p.slug === 'onnit-alpha-brain-review')!;
const thesis = allProductsUS.find((p) => p.slug === 'thesis-nootropics-review')!;
/** A commission product's record with no affiliate deal (the wiring under test, not catalogue data). */
const zero = (p: Product): Product => ({ ...p, commissionRate: '0%' });
/** A commission product's record with no purchase link in this edition. */
const blocked = (p: Product): Product => ({
  ...p,
  noPurchaseLink: allProductsJP.find((r) => r.noPurchaseLink !== undefined)!.noPurchaseLink,
});

// The shells' footer and sidebar read the build-time region (fail closed when unset).
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_REGION', 'us');
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('fixtures', () => {
  test('the records used here exist with the commission state the tests assume', () => {
    expect(earnsCommission(mlp) && purchaseUrl(mlp) !== null && !mlp.discontinued).toBe(true);
    expect(earnsCommission(qualia) && purchaseUrl(qualia) !== null && !qualia.discontinued).toBe(true);
    expect(earnsCommission(onnit)).toBe(false);
    expect(earnsCommission(thesis)).toBe(false);
    expect(purchaseUrl(blocked(mlp))).toBeNull();
  });
});

describe('pageDisclosureScope / reviewDisclosureScope', () => {
  test.each([
    ['no linked products', [], 'site'],
    ['one commission product', [mlp], 'page'],
    ['only no-commission products', [onnit, thesis], 'site'],
    ['a commission product among no-commission ones', [onnit, mlp, thesis], 'page'],
    ['a commission product without a purchase link here', [blocked(mlp)], 'site'],
  ] as const)('%s → %s', (_label, linked, expected) => {
    expect(pageDisclosureScope(linked as readonly Product[])).toBe(expected);
  });

  test.each([
    ['commission, linked', mlp, 'page'],
    ['no commission, linked', onnit, 'product'],
    ['no commission, discontinued', { ...onnit, discontinued: { note: 'x' } } as Product, 'product'],
    ['commission, discontinued (no buy link)', { ...mlp, discontinued: { note: 'x' } } as Product, 'site'],
    ['commission, no purchase link in this edition', blocked(mlp), 'site'],
  ] as const)('review page: %s → %s', (_label, product, expected) => {
    expect(reviewDisclosureScope(product)).toBe(expected);
  });

  test('every catalogue review page with a buy link to a commission product is a "page" page', () => {
    const linked = allProductsUS.filter((p) => !p.discontinued && purchaseUrl(p) !== null && earnsCommission(p));
    expect(linked.length).toBeGreaterThan(5);
    for (const p of linked) expect(reviewDisclosureScope(p), p.slug).toBe('page');
  });
});

describe('disclosure strings — site-level line and neutral badge in every locale', () => {
  const en = getStrings('en').disclosure;

  test.each(ALL_LOCALES)('%s: inline says "on this page" (phrase self-test)', (locale) => {
    expect(getStrings(locale).disclosure.inline).toMatch(PAGE_PHRASE[locale]);
  });

  test.each(ALL_LOCALES)('%s: siteWide and neutralBadge exist, are translated and never claim this page', (locale) => {
    const d = getStrings(locale).disclosure;
    expect(d.siteWide.trim().length).toBeGreaterThan(20);
    expect(d.neutralBadge.trim().length).toBeGreaterThan(1);
    expect(d.siteWide).not.toBe(d.inline);
    expect(d.neutralBadge).not.toBe(d.badge);
    for (const l of ALL_LOCALES) expect(d.siteWide, `${locale} siteWide vs ${l} phrase`).not.toMatch(PAGE_PHRASE[l]);
    expect(d.neutralBadge).not.toMatch(COMMISSION_BADGE);
    if (locale !== 'en') {
      expect(d.siteWide, `${locale} siteWide is the English copy`).not.toBe(en.siteWide);
      expect(d.neutralBadge, `${locale} neutralBadge is the English copy`).not.toBe(en.neutralBadge);
    }
  });

  test.each(ALL_LOCALES)('%s: disclosureCopy picks badge + sentence per scope', (locale) => {
    const d = getStrings(locale).disclosure;
    expect(disclosureCopy(d, 'page')).toEqual({ badge: d.badge, sentence: d.inline });
    expect(disclosureCopy(d, 'product')).toEqual({ badge: d.neutralBadge, sentence: d.noCommission });
    expect(disclosureCopy(d, 'site')).toEqual({ badge: d.neutralBadge, sentence: d.siteWide });
  });

  test('JP: 広告 only on the badge of a page with a commission-earning link', () => {
    const d = getStrings('ja').disclosure;
    expect(d.badge).toContain('広告');
    expect(d.neutralBadge).not.toContain('広告');
  });
});

describe('FPDisclosure / FPTrustNote render the scope in every locale', () => {
  test.each(ALL_LOCALES.flatMap((l) => (['page', 'product', 'site'] as const).map((sc) => [l, sc] as const)))(
    '%s %s',
    (locale, scope) => {
      const s = getStrings(locale);
      const html = text(
        renderToStaticMarkup(
          createElement('div', null,
            createElement(FPDisclosure, { strings: s.disclosure, scope }),
            createElement(FPTrustNote, { strings: s.disclosure, scope }),
          ),
        ),
      );
      assertScope(html, s, scope, true);
      // The strip adds the ranking statement to the site-level line.
      if (scope === 'site') expect(strip(html)!.text).toContain(`${s.disclosure.siteWide} ${s.disclosure.ranking}`);
    },
  );
});

describe('templates compute the scope from the products they link', () => {
  test.each(ALL_LOCALES)('%s PublicShell: "page" only with a commission product in linkedProducts', (locale) => {
    const s = getStrings(locale);
    const shell = (linkedProducts?: Product[]) =>
      text(renderToStaticMarkup(createElement(PublicShell, { uiStrings: s, linkedProducts, children: createElement('p', null, 'x') })));
    assertScope(shell([mlp, onnit]), s, 'page', false);
    assertScope(shell(undefined), s, 'site', false);
    assertScope(shell([]), s, 'site', false);
    assertScope(shell([onnit, thesis]), s, 'site', false);
    assertScope(shell([blocked(mlp)]), s, 'site', false);
  });

  test('PublicShell hideDisclosure renders no strip', () => {
    const html = renderToStaticMarkup(
      createElement(PublicShell, { uiStrings: getStrings('en'), linkedProducts: [mlp], hideDisclosure: true, children: 'x' }),
    );
    expect(strip(html)).toBeNull();
  });

  test.each(['en', 'ja'] as const)('%s BestOf: strip and trust note follow the ranked rows', (locale) => {
    const s = getStrings(locale);
    const bestOf = (products: Product[]) =>
      text(renderToStaticMarkup(createElement(BestOf, { products, uiStrings: s, refreshDate: '1 Oct 2026' })));
    assertScope(bestOf(productsUS), s, 'page', true);
    assertScope(bestOf([onnit, thesis]), s, 'site', true);
  });

  test.each(['en', 'ja'] as const)('%s HeadToHead: strip and trust note follow the two side cards', (locale) => {
    const s = getStrings(locale);
    const h2h = (productA: Product, productB: Product) =>
      text(
        renderToStaticMarkup(
          createElement(HeadToHead, {
            productA, productB, siteUrl: 'https://example.com', faqItems: [], whoIsForA: [], whoIsForB: [], uiStrings: s,
          }),
        ),
      );
    assertScope(h2h(mlp, onnit), s, 'page', true);
    assertScope(h2h(onnit, thesis), s, 'site', true);
    // A discontinued commission product renders no buy link.
    assertScope(h2h({ ...mlp, discontinued: { note: 'Discontinued.' } } as Product, onnit), s, 'site', true);
  });

  test.each(['en', 'es'] as const)('%s Listicle: strip and trust note follow the ranked picks', (locale) => {
    const s = getStrings(locale);
    const mlpEU = productsEU.find((p) => p.slug === 'mind-lab-pro-review')!;
    const listicle = (product: Product) =>
      text(
        renderToStaticMarkup(
          createElement(Listicle, {
            useCase: 'focus',
            pageTitle: 't',
            pageDescription: 'd',
            heroParagraph: 'h',
            ingredientMechanism: [{ name: 'Citicoline', evidence: 'e', ingredientSlugs: ['citicoline'] }],
            ingredientPages: locale === 'es' ? localizedIngredients('es') : ingredients,
            picks: [{ product, whyItsHere: 'w', rank: 1 }],
            faqItems: [],
            siteUrl: 'https://example.com',
            uiStrings: s,
          }),
        ),
      );
    expect(earnsCommission(mlpEU)).toBe(true);
    assertScope(listicle(mlpEU), s, 'page', true);
    assertScope(listicle(zero(mlpEU)), s, 'site', true);
  });

  test('ProductDetail: JP commission review keeps 広告; JP no-commission reviews never show it', () => {
    vi.stubEnv('NEXT_PUBLIC_REGION', 'jp');
    const s = getStrings('ja');
    const review = (product: Product) =>
      text(renderToStaticMarkup(createElement(ProductDetail, { product, alternatives: [], siteUrl: 'https://example.com', uiStrings: s })));
    const paid = allProductsJP.filter((p) => !p.discontinued && purchaseUrl(p) !== null && earnsCommission(p));
    const unpaid = allProductsJP.filter((p) => !earnsCommission(p));
    expect(paid.length).toBeGreaterThan(0);
    // Suntory since 2026-10-19: no Amazon Associates account in Japan (amazon-associates.test.ts).
    expect(unpaid.map((p) => p.slug).sort()).toEqual(['fancl-brains-review', 'hunter-focus-review', 'suntory-dha-epa-sesamin-review']);
    for (const p of paid) {
      const html = review(p);
      expect(strip(html)!.text, p.slug).toContain('広告');
      expect(trustNote(html), p.slug).toContain('広告');
    }
    for (const p of unpaid) {
      const html = review(p);
      expect(html, p.slug).not.toContain('広告');
      assertScope(html, s, 'product', true);
    }
  });
});

describe('templates without buy links pin the site-level strip', () => {
  test.each(['Comparator.tsx', 'IngredientDetail.tsx'])('%s renders no buy link and scope="site"', (tpl) => {
    const src = readFileSync(join(__dirname, 'templates', tpl), 'utf8');
    expect(src).toMatch(/<FPDisclosure[^>]*scope="site"/);
    expect(src).not.toMatch(/TrackedAffiliateLink|ComparisonTable|StickyCtaBar|purchaseUrl\(|\bsponsored\b/);
  });
});

// ── App pages ────────────────────────────────────────────────────────────
// A page renders its own buy links through these; PublicShell must then get
// the same products in `linkedProducts` (default: site-level strip), and the
// in-content AffiliateDisclosure ("This page contains affiliate links") only
// belongs on such a page.
const BUY_LINK = /<(?:ComparisonTable|StickyCtaBar|TrackedAffiliateLink)\b|rel="[^"]*\bsponsored\b|\bpurchaseUrl\(|\baffiliateUrl\b/;
const TEMPLATE_WITH_STRIP = /<(?:BestOf|Listicle|HeadToHead|ProductDetail)\b/;

function pageFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) pageFiles(full, out);
    else if (name === 'page.tsx') out.push(full);
  }
  return out;
}

const PAGES = readdirSync(join(REPO, 'apps'))
  .flatMap((app) => pageFiles(join(REPO, 'apps', app, 'src', 'app')))
  .map((f) => ({ file: relative(REPO, f), src: readFileSync(f, 'utf8') }));

describe('app pages declare the products they link', () => {
  test('scans every app (non-empty input)', () => {
    expect(PAGES.length).toBeGreaterThan(200);
    for (const app of ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea']) {
      expect(PAGES.some((p) => p.file.startsWith(`apps/${app}/`)), app).toBe(true);
    }
  });

  test('the pages that link products through PublicShell are found', () => {
    const linked = PAGES.filter((p) => /<PublicShell\b/.test(p.src) && BUY_LINK.test(p.src)).map((p) => p.file).sort();
    expect(linked).toEqual([
      'apps/ca/src/app/alpha-brain-canada/page.tsx',
      'apps/ca/src/app/fr/comparer/page.tsx',
      'apps/ca/src/app/fr/meilleurs-nootropiques/page.tsx',
      'apps/eu/src/app/de/beste-nootropika/page.tsx',
      'apps/eu/src/app/fr/meilleurs-nootropiques/page.tsx',
      'apps/eu/src/app/pt/melhores-nootropicos/page.tsx',
      'apps/us/src/app/es/comparar/page.tsx',
      'apps/us/src/app/es/mejores-nootropicos/page.tsx',
    ]);
  });

  test('a PublicShell page with buy links passes linkedProducts; one without passes none', () => {
    const offenders = PAGES.filter((p) => /<PublicShell\b/.test(p.src))
      .filter((p) => BUY_LINK.test(p.src) !== /\blinkedProducts=/.test(p.src))
      .map((p) => p.file);
    expect(offenders).toEqual([]);
  });

  test('AffiliateDisclosure ("This page contains affiliate links") only on pages with buy links', () => {
    const offenders = PAGES.filter((p) => /<AffiliateDisclosure\b/.test(p.src) && !BUY_LINK.test(p.src)).map((p) => p.file);
    expect(offenders).toEqual([]);
  });

  test('every page with buy links renders a page-level disclosure', () => {
    const offenders = PAGES.filter((p) => BUY_LINK.test(p.src))
      .filter((p) => !(/\blinkedProducts=/.test(p.src) || /<AffiliateDisclosure\b/.test(p.src) || TEMPLATE_WITH_STRIP.test(p.src)))
      .map((p) => p.file);
    expect(offenders).toEqual([]);
  });
});

// ── Buy links rendered in the browser ────────────────────────────────────
// The static export renders every page at build time, but content that reads
// browser-only state (localStorage, the query string, window.location) only
// renders after hydration. Buy links under such a module are absent from the
// static HTML: the page cannot compute pageDisclosureScope at build time and
// check-built-disclosure.ts has no link to count. These routes are listed in
// CLIENT_RENDERED_BUY_LINK_ROUTES and carry the 'page' strip unconditionally
// in their static HTML (the built gate checks it on every listed route).
const BROWSER_ONLY = /\buseSearchParams\(|\blocalStorage\b|\bsessionStorage\b|\bwindow\.location\b|\buseShortlist\(|\bssr:\s*false/;
const SPONSORED_ANCHOR = /\brel="[^"]*\bsponsored\b/;

function tsxFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'out' || name === '.next') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) tsxFiles(full, out);
    else if (name.endsWith('.tsx') && !name.endsWith('.test.tsx')) out.push(full);
  }
  return out;
}

/** Source without comments: prose about localStorage is not code reading it. */
function code(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/.*$/gm, '$1');
}

// Every UI and app module, named by file (the component name a page renders).
const MODULES = [__dirname, ...readdirSync(join(REPO, 'apps')).map((app) => join(REPO, 'apps', app, 'src'))]
  .flatMap((dir) => tsxFiles(dir))
  .map((f) => {
    const src = code(readFileSync(f, 'utf8'));
    return { file: relative(REPO, f), name: basename(f, '.tsx'), src, tags: new Set([...src.matchAll(/<([A-Z]\w*)\b/g)].map((m) => m[1])) };
  });
type Module = (typeof MODULES)[number];

/** Modules matching `seed`, plus every module (of `among`) that renders one of them. */
function closure(seed: (m: Module) => boolean, among: readonly Module[] = MODULES): Set<string> {
  const files = new Set<string>();
  const names = new Set<string>();
  for (let grew = true; grew; ) {
    grew = false;
    for (const m of among) {
      if (files.has(m.file) || !(seed(m) || [...m.tags].some((t) => names.has(t)))) continue;
      files.add(m.file);
      names.add(m.name);
      grew = true;
    }
  }
  return files;
}

// Modules that render a buy link (a sponsored anchor, directly or through a
// component), and those of them that do so under browser-only state.
const BUY_LINK_MODULES = closure((m) => SPONSORED_ANCHOR.test(m.src));
const CLIENT_BUY_LINK_MODULES = closure(
  (m) => BROWSER_ONLY.test(m.src),
  MODULES.filter((m) => BUY_LINK_MODULES.has(m.file)),
);
/** `<region>:<route>` of an app page file. */
function pageRoute(file: string): string | null {
  const m = /^apps\/(\w+)\/src\/app\/(.*?)\/?page\.tsx$/.exec(file);
  if (!m) return null;
  const route = m[2].split('/').filter((seg) => seg && !/^\(.*\)$/.test(seg)).join('/');
  return `${m[1]}:/${route ? `${route}/` : ''}`;
}

describe('browser-rendered buy links (shortlist, quiz results)', () => {
  test('scans the UI and every app, and finds the buy-link components (non-empty input)', () => {
    expect(MODULES.length).toBeGreaterThan(300);
    for (const f of ['TrackedAffiliateLink', 'ComparisonTable', 'StickyCtaBar', 'templates/BestOf', 'templates/ProductDetail']) {
      expect(BUY_LINK_MODULES.has(`packages/ui/src/${f}.tsx`), f).toBe(true);
    }
    expect([...BUY_LINK_MODULES].filter((f) => pageRoute(f) !== null).length).toBeGreaterThan(50);
  });

  test('the routes that render buy links in the browser are exactly CLIENT_RENDERED_BUY_LINK_ROUTES', () => {
    const found = [...CLIENT_BUY_LINK_MODULES].map(pageRoute).filter((r): r is string => r !== null).sort();
    const listed = Object.entries(CLIENT_RENDERED_BUY_LINK_ROUTES)
      .flatMap(([region, routes]) => (routes ?? []).map((r) => `${region}:${r}`))
      .sort();
    expect(found.length).toBeGreaterThan(0);
    expect(found).toEqual(listed);
  });

  test('Shortlist: the static (pre-hydration) markup carries the "page" strip', () => {
    const s = getStrings('en');
    const html = text(
      renderToStaticMarkup(createElement(Shortlist, { products: productsUS, siteUrl: 'https://example.com', uiStrings: s })),
    );
    // No saved picks before hydration: the strip is the page's only disclosure.
    expect(html).toContain('Loading your shortlist');
    assertScope(html, s, 'page', false);
  });

  test('quiz results: the "page" strip is outside the Suspense boundary that renders the results', () => {
    const src = readFileSync(join(REPO, 'apps/us/src/app/quiz/results/page.tsx'), 'utf8');
    const strip = src.search(/<FPDisclosure\b[^>]*\bscope="page"/);
    expect(strip, 'FPDisclosure scope="page" rendered').toBeGreaterThan(-1);
    expect(strip, 'strip before <Suspense>').toBeLessThan(src.indexOf('<Suspense'));
  });
});
