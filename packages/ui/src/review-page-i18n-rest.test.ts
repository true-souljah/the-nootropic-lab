import { describe, test, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  allProductsJP,
  allProductsLatam,
  buildRegionalBuying,
  getStrings,
  hasRegionalBuyingContent,
  jpPrefectures,
  latamCountries,
  licenceStatus,
  licenceStatusText,
} from '@nootropic/data';
import type { Locale, Product, RegionalRegionCode, SearchItem, UIStrings } from '@nootropic/data';
import ProductDetail from './templates/ProductDetail';
import RegionalBuying from './RegionalBuying';
import { buildGeoIndexLinks } from './templates/GeoIndexPage';
import { SCORE_TIER_TEXT_CLASS, scoreTier } from './templates/listicleRanking';
import { DEFAULT_GROUPS, SIDEBAR_LABELS_EN, sidebarGroups } from './primitives/Sidebar';
import { PALETTE_STRINGS_EN } from './templates/CommandPalette';

// 2026-10-12, follows #372 (Pillars + Dosing tabs): the rest of the review
// page's chrome was hard-coded English, so JP (ja) and LATAM (es) review pages
// showed it in English — the Overview tab ("What it does", "Hero
// ingredients", the verdict line), the Reviews tab ("No Trustpilot profile",
// "Read all … reviews on Trustpilot →"), the "Buying in <region>" block
// ("Local price", "Status", the regulator and licence line), the "Best of"
// breadcrumb and the AppShell chrome (sidebar rail, "Build my stack", menu and
// search labels). They now render UIStrings; the record's own text stays as
// recorded. Since 2026-10-19 the review page has the shared editorial chrome
// (PublicShell: FPHeader with its phone menu, FPFooter) instead of AppShell.

const UI_SRC = __dirname;

/** Rendered text: React escapes quotes and ampersands. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/** `s` as a literal inside a RegExp. */
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

const GEO = {
  jp: buildGeoIndexLinks(jpPrefectures, '/prefectures').slice(0, 6),
  latam: buildGeoIndexLinks(latamCountries, '/countries').slice(0, 6),
};

/** The app's regionalProductProps (apps/<region>/src/lib/regional.ts). */
function regionalProps(product: Product, region: 'jp' | 'latam') {
  const data = buildRegionalBuying(product, region);
  return hasRegionalBuyingContent(data) ? { data, geoLinks: GEO[region] } : undefined;
}

const SEARCH_ITEMS: SearchItem[] = [{ title: 'Mind Lab Pro', href: '/mind-lab-pro-review/', type: 'product' }];

function renderReview(product: Product, locale: Locale, region: 'jp' | 'latam'): string {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return text(
    renderToStaticMarkup(
      createElement(ProductDetail, {
        product,
        alternatives: [],
        siteUrl: 'https://example.com',
        searchItems: SEARCH_ITEMS,
        uiStrings: getStrings(locale),
        regional: regionalProps(product, region),
      }),
    ),
  );
}

/** Every leaf string under `value`, keyed by its dotted path. */
function leaves(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
}

/** The chrome strings this change moved into UIStrings, by dotted path. */
function chromeLeaves(s: UIStrings): Map<string, string> {
  return new Map([
    ['nav.buildMyStack', s.nav.buildMyStack],
    ['nav.drawerLabel', s.nav.drawerLabel],
    ...leaves(s.nav.sidebar, 'nav.sidebar'),
    ...leaves(s.search.palette, 'search.palette'),
    ['productDetail.breadcrumbBestOf', s.productDetail.breadcrumbBestOf],
    ...leaves(s.productDetail.overview, 'productDetail.overview'),
    ...leaves(s.productDetail.reviews, 'productDetail.reviews'),
    ...leaves(s.productDetail.regionalBuying, 'productDetail.regionalBuying'),
  ]);
}

/**
 * The English the review page showed before, as fragments that may not appear
 * in a JP or LATAM page: each en string split at its placeholders, keeping
 * fragments with a word in them. Strings a locale keeps identical
 * (do-not-translate: TGA, AUST L, NPN, …) are left out for that locale.
 */
function englishFragments(locale: Locale): string[] {
  const own = chromeLeaves(getStrings(locale));
  const out = new Set<string>();
  for (const [path, en] of chromeLeaves(getStrings('en'))) {
    if (own.get(path) === en) continue;
    for (const part of en.split(/\{\w+\}/)) {
      const trimmed = part.trim();
      if (/[A-Za-z]{3,}/.test(trimmed)) out.add(trimmed);
    }
  }
  return [...out];
}

const PAGES = [
  ...allProductsJP.map((product) => ['jp', 'ja', product] as const),
  ...allProductsLatam.map((product) => ['latam', 'es', product] as const),
];

describe('Review page chrome — no English on JP (ja) and LATAM (es) review pages', () => {
  test('the scan is non-empty and covers every branch', () => {
    expect(PAGES.length).toBeGreaterThanOrEqual(10);
    expect(englishFragments('ja').length).toBeGreaterThan(60);
    expect(englishFragments('es').length).toBeGreaterThan(60);
    // Both Reviews-tab variants and all three verdict tiers render somewhere.
    expect(PAGES.some(([, , p]) => p.trustpilotScore === null)).toBe(true);
    expect(PAGES.some(([, , p]) => p.trustpilotScore !== null)).toBe(true);
    expect(new Set(PAGES.map(([, , p]) => scoreTier(p.score)))).toEqual(new Set(['good', 'warn', 'bad']));
    // The "Buying in" block renders with a licence line on JP pages.
    expect(allProductsJP.some((p) => licenceStatus(p, 'jp') !== null && regionalProps(p, 'jp'))).toBe(true);
  });

  test.each(PAGES.map(([region, locale, product]) => [region, product.slug, locale, product] as const))(
    '%s %s renders the chrome in its locale',
    (region, _slug, locale, product) => {
      const s = getStrings(locale);
      const pd = s.productDetail;
      const html = renderReview(product, locale, region);

      for (const fragment of englishFragments(locale)) {
        expect(html, `English "${fragment}"`).not.toContain(`>${fragment}<`);
        expect(html, `English "${fragment}"`).not.toContain(`>${fragment} `);
        expect(html, `English "${fragment}"`).not.toContain(` ${fragment}<`);
        expect(html, `English "${fragment}"`).not.toContain(`="${fragment}`);
      }

      // Shared editorial chrome (2026-10-19): the banner header with its
      // primary nav, phone menu button and search trigger, the breadcrumb,
      // and the contentinfo footer.
      expect(html).toContain('<header role="banner"');
      expect(html).toContain('<footer role="contentinfo"');
      expect(html).toContain(`aria-label="${s.nav.primaryLandmark}"`);
      expect(html).toContain(`aria-label="${s.nav.openMenu}"`);
      const crumbs = /<nav aria-label="([^"]*)"[^>]*><ol\b[\s\S]*?<\/ol><\/nav>/.exec(html);
      expect(crumbs?.[1], 'breadcrumb nav').toBe(s.breadcrumb.ariaLabel);
      expect(crumbs![0]).toMatch(new RegExp(`<a [^>]*href="/"[^>]*>${escapeRe(s.breadcrumb.home)}</a>`));
      // next/link drops the trailing slash outside a trailingSlash app build.
      expect(crumbs![0]).toMatch(new RegExp(`<a [^>]*href="/best-nootropics/?"[^>]*>${escapeRe(s.nav.bestNootropics)}</a>`));
      expect(crumbs![0]).toMatch(new RegExp(`<li aria-current="page"[^>]*>${escapeRe(product.name)}</li>`));
      // The search trigger is named by its content: the visible word, then the
      // spoken shortcut in visually hidden text (the ⌘K key cap is aria-hidden).
      // No aria-label: one would have to contain the visible text, ⌘K's "K"
      // included (WCAG 2.5.3, axe-core 4.14 label-content-name-mismatch).
      expect(html).toContain(`<span>${s.nav.search}</span><span class="ds-sr-only"> (Command+K)</span>`);
      expect(html).not.toContain(`aria-label="${s.nav.search} (Command+K)"`);
      // No AppShell output: no sidebar rail or its 240px column, no "Build my stack".
      expect(html).not.toContain('lg:grid-cols-[240px_1fr]');
      for (const label of [s.nav.buildMyStack, s.nav.sidebar.browse, s.nav.sidebar.discover, s.nav.sidebar.allProducts, s.nav.sidebar.bestOf2026, s.nav.sidebar.submitTip]) {
        expect(html).not.toContain(`>${label}<`);
      }

      // Overview tab: the verdict line keeps the product name in its tier colour.
      const tier = scoreTier(product.score);
      expect(html).toContain(pd.overview.verdict[tier].replace('{product}', `<span class="${SCORE_TIER_TEXT_CLASS[tier]}">${product.name}</span>`));
      for (const heading of [pd.overview.verdictEyebrow, pd.overview.whatItDoes, pd.overview.howItWorks, pd.overview.whatToExpect, pd.overview.heroIngredients, pd.overview.whoItsFor, pd.overview.whoShouldSkip]) {
        expect(html).toContain(`>${heading}<`);
      }

      // Reviews tab, either variant.
      if (product.trustpilotScore === null) {
        expect(html).toContain(`>${pd.reviews.noProfileHeading}<`);
        expect(html).toContain(`>${pd.reviews.noProfileBody.replace('{brand}', product.brand)}<`);
        expect(html).toContain(`>${pd.reviews.noProfileTrust}<`);
      } else {
        const count = (product.trustpilotCount ?? 0).toLocaleString(pd.dateLocale);
        expect(html).toContain(`aria-label="${pd.reviews.starsAria.replace('{score}', String(product.trustpilotScore))}"`);
        expect(html).toContain(`>${pd.reviews.countOnTrustpilot.replace('{count}', count)}<`);
        expect(html).toContain(`>${pd.reviews.verifiedCount.replace('{count}', count)}<`);
        expect(html).toContain(`>${pd.reviews.noCherryPicking}<`);
        expect(html).toContain(`>${pd.reviews.readAll.replace('{count}', count)}<`);
      }

      // "Buying in <region>" block, when the record has something regional.
      const regional = regionalProps(product, region);
      if (regional && !product.discontinued) {
        const rb = pd.regionalBuying;
        expect(html).toContain(`>${rb.heading[region]}<`);
        if (regional.data.price) expect(html).toContain(`>${rb.price}<`);
        if (regional.data.status) {
          expect(html).toContain(`>${rb.status}<`);
          expect(html).toContain(`>${licenceStatusText(regional.data.status, rb.licence)}<`);
          expect(html).toContain(`>${rb.regulator[region]}<`);
        }
        if (regional.data.channels.length > 0) expect(html).toContain(`>${rb.whereToBuy}<`);
        if (regional.data.importPathway) expect(html).toContain(`>${rb.importPathway}<`);
        expect(html).toContain(`>${rb.geoHub[region]} →<`);
      }
    },
  );
});

describe('"Buying in <region>" block — every label and licence line in the page locale', () => {
  // The catalogues do not exercise every branch on JP and LATAM pages (LATAM
  // records carry no licence status); render the block directly so each
  // label and each JP licence line is covered in ja and es.
  const mlp = allProductsJP.find((p) => p.slug === 'mind-lab-pro-review')!;
  const base = buildRegionalBuying(mlp, 'jp');
  const FFC: Array<Product['ffcStatus']> = [
    { notified: true, notificationNumber: 'G425' },
    { notified: true },
    { notified: false, checkedAt: '2026-10-06' },
    { notified: false },
  ];

  test.each([
    ['jp', 'ja'],
    ['latam', 'es'],
  ] as Array<[RegionalRegionCode, Locale]>)('%s block in %s', (region, locale) => {
    const rb = getStrings(locale).productDetail.regionalBuying;
    for (const ffcStatus of FFC) {
      const status = licenceStatus({ ...mlp, ffcStatus }, 'jp')!;
      const data = { ...base, region: { ...base.region, code: region }, status, channels: ['Rakuten'], importPathway: 'personal import' };
      const html = text(renderToStaticMarkup(createElement(RegionalBuying, { data, geoLinks: GEO.jp, strings: getStrings(locale).productDetail })));
      expect(html).toContain(`>${rb.heading[region]}<`);
      for (const label of [rb.price, rb.status, rb.whereToBuy, rb.importPathway, rb.regulator[region], `${rb.geoHub[region]} →`]) {
        expect(html).toContain(`>${label}<`);
      }
      expect(html).toContain(`>${licenceStatusText(status, rb.licence)}<`);
      expect(html).toContain(`/${rb.monthUnit}<`);
      for (const en of ['Local price', 'Status<', 'Where to buy', 'Import pathway', 'No FFC notification', 'FFC notified', 'Consumer Affairs Agency', 'Prefecture guides', '/month']) {
        expect(html).not.toContain(en);
      }
    }
  });

  test('en keeps the English lines it showed before (licenceStatus labels)', () => {
    const en = getStrings('en').productDetail.regionalBuying.licence;
    const labels = FFC.map((ffcStatus) => licenceStatus({ ...mlp, ffcStatus }, 'jp')!);
    expect(labels.map((s) => s.label)).toEqual([
      'FFC 届出 G425',
      'FFC notified',
      'No FFC notification found (checked 2026-10-06)',
      'No FFC notification on file',
    ]);
    for (const s of labels) expect(licenceStatusText(s, en)).toBe(s.label);
    expect(licenceStatus({ ...mlp, austl: undefined }, 'au')!.label).toBe('Personal Importation Scheme');
    expect(licenceStatus({ ...mlp, euStorefront: true }, 'eu')!.label).toBe('EU storefront');
    expect(licenceStatus({ ...mlp, npnStatus: { status: 'licensed' } }, 'ca')!.label).toBe('NPN licensed');
  });
});

describe('English fallbacks for callers without a bundle are the en bundle', () => {
  const en = getStrings('en');

  test('Sidebar and CommandPalette defaults', () => {
    expect(SIDEBAR_LABELS_EN).toEqual(en.nav.sidebar);
    expect(DEFAULT_GROUPS).toEqual(sidebarGroups(en.nav.sidebar));
    expect(PALETTE_STRINGS_EN).toEqual(en.search.palette);
    const sidebar = readFileSync(join(UI_SRC, 'primitives', 'Sidebar.tsx'), 'utf8');
    expect(sidebar).toContain(`landmarkLabel = '${en.nav.primaryLandmark}'`);
  });

  test.each([
    ['templates/AppShell.tsx', 10],
    ['templates/CommandPalette.tsx', 1],
    ['public-chrome/FPHeader.tsx', 5],
  ] as const)('%s: every `?? \'…\'` fallback equals the en value at the same path', (file, expected) => {
    const src = readFileSync(join(UI_SRC, file), 'utf8');
    const fallbacks = [...src.matchAll(/(?:uiStrings|strings)\?\.([\w.]+) \?\? '([^']*)'/g)];
    expect(fallbacks.length).toBe(expected);
    for (const [, path, literal] of fallbacks) {
      const value = path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], en);
      expect(value, path).toBe(literal);
    }
  });
});

describe('Review-page chrome source — no English literals', () => {
  // The review page and its shared chrome (PublicShell, FPHeader with the
  // phone menu, FPFooter since 2026-10-19); AppShell and its rail still
  // frame the best-of hub and the comparator.
  const FILES = [
    'templates/ProductDetail.tsx',
    'templates/ProductDetailBody.tsx',
    'templates/product-detail/OverviewTab.tsx',
    'templates/product-detail/ReviewsTab.tsx',
    'RegionalBuying.tsx',
    'templates/PublicShell.tsx',
    'public-chrome/FPHeader.tsx',
    'public-chrome/MobileMenu.tsx',
    'public-chrome/FPFooter.tsx',
    'templates/AppShell.tsx',
    'primitives/Sidebar.tsx',
    'templates/CommandPalette.tsx',
  ];
  /** Key caps and the spoken shortcut stay as written in every locale. */
  const KEY_NAMES = ['Esc', 'Command+K'];

  /** The `{…}` expression starting at `open` (balanced braces). */
  function expressionAt(src: string, open: number): string {
    let depth = 0;
    for (let i = open; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}' && --depth === 0) return src.slice(open + 1, i);
    }
    return src.slice(open + 1);
  }

  test.each(FILES)('%s renders locale strings only', (file) => {
    const src = readFileSync(join(UI_SRC, file), 'utf8');

    // JSX text between tags.
    const literalText = (src.match(/>\s*[A-Za-z][A-Za-z ,.'’&;-]{2,}\s*</g) ?? []).filter(
      (m) => !KEY_NAMES.includes(m.replace(/[<>\s]/g, '')),
    );
    expect(literalText).toEqual([]);

    // Text attributes written as plain strings.
    expect(src.match(/\b(?:aria-label|placeholder|alt|title|label)="[^"]*[A-Za-z]{2,}[^"]*"/g) ?? []).toEqual([]);

    // Text attributes written as expressions: string literals in them, after
    // dropping `${…}` and the `?? '…'` fallbacks pinned above.
    for (const m of src.matchAll(/\b(?:aria-label|placeholder|alt|title|label)=\{/g)) {
      const expr = expressionAt(src, m.index! + m[0].length - 1)
        .replace(/\$\{[^}]*\}/g, '')
        .replace(/\?\? '[^']*'/g, '');
      const literals = [...expr.matchAll(/'([^']*)'|"([^"]*)"|`([^`]*)`/g)].map((l) => l[1] ?? l[2] ?? l[3]);
      for (const literal of literals) {
        // Placeholder tokens ('{score}') name a value; they are not text.
        const words = KEY_NAMES.reduce((rest, key) => rest.replace(key, ''), literal.replace(/\{\w+\}/g, ''));
        expect(words, `${file}: ${m[0]}${expr}`).not.toMatch(/[A-Za-z]{2,}/);
      }
    }
  });

  test('ProductDetail passes the locale bundle to the Overview and Reviews tabs and the "Buying in" block', () => {
    const pd = readFileSync(join(UI_SRC, 'templates', 'ProductDetailBody.tsx'), 'utf8');
    expect(pd).toMatch(/<OverviewTab[^>]*strings=\{pd\}/);
    expect(pd).toMatch(/<ReviewsTab[^>]*strings=\{pd\}/);
    expect(pd).toMatch(/<RegionalBuying[^>]*strings=\{pd\}/);
  });
});
