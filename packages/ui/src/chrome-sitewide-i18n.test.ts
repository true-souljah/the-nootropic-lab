import { describe, test, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { REGION_PROFILES, getStrings, ingredients, productsUS, type Locale } from '@nootropic/data';
import ComparisonTable from './ComparisonTable';
import { tpl } from './templateStrings';

// 2026-10-12, phase 1 of the JP/LATAM translation ("chrome now, bodies next"):
// the shared templates (listicle, best-of, comparator, ingredient library and
// page, the "In <region>" block, byline, comparison table) and the JP/LATAM page
// shells hard-coded English chrome, so the ja (JP) and es (LATAM) hosts showed
// it in English on every page. The template strings now live in UIStrings in all
// 7 locales; page bodies (guides, ingredient data, product records, legal pages)
// stay English until phase 2.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const UI_SRC = __dirname;
const JA = /[぀-ヿ一-鿿]/;

/** Rendered text: React escapes quotes and ampersands. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/** Every leaf string under `value`, keyed by its dotted path. */
function leaves(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
}

/** The strings this change added, keyed by path (listicle.useCaseLabels is checked on its own). */
function newLeaves(locale: Locale): Map<string, string> {
  const s = getStrings(locale);
  const pd = s.productDetail;
  const t = s.table;
  const i = s.ingredientDetail;
  const g = s.guide;
  const { useCaseLabels: _useCaseLabels, ...listicle } = s.listicle;
  return new Map([
    ['nav.productCount', s.nav.productCount],
    ['nav.ingredientCount', s.nav.ingredientCount],
    ...leaves(
      {
        sortAria: t.sortAria,
        sortAriaActive: t.sortAriaActive,
        sortColumns: t.sortColumns,
        editorChoice: t.editorChoice,
        euStorefront: t.euStorefront,
        maxPrice: t.maxPrice,
        actions: t.actions,
        scoreAria: t.scoreAria,
        scoreBreakdown: t.scoreBreakdown,
      },
      'table',
    ),
    ...leaves(
      {
        relatedCategory: i.relatedCategory,
        humanTrialsOnly: i.humanTrialsOnly,
        evidenceStrength: i.evidenceStrength,
        evidenceKey: i.evidenceKey,
        howToLabels: i.howToLabels,
        topStacks: i.topStacks,
      },
      'ingredientDetail',
    ),
    ['productDetail.score.aria', pd.score.aria],
    ['productDetail.stats.daysCount', pd.stats.daysCount],
    ['productDetail.stats.daysCountShort', pd.stats.daysCountShort],
    ...leaves(pd.pillars.short, 'productDetail.pillars.short'),
    ['productDetail.pillars.shortScoreAria', pd.pillars.shortScoreAria],
    ...leaves(
      { minRead: g.minRead, indexHeading: g.indexHeading, readGuide: g.readGuide, backToGuides: g.backToGuides, categories: g.categories },
      'guide',
    ),
    ...leaves(s.byline, 'byline'),
    ...leaves(listicle, 'listicle'),
    ...leaves(s.bestOf, 'bestOf'),
    ...leaves(s.comparator, 'comparator'),
    ...leaves(s.ingredientLibrary, 'ingredientLibrary'),
    ...leaves(s.geo, 'geo'),
    ...leaves(s.editorialStandards, 'editorialStandards'),
    ...leaves(s.shortlist, 'shortlist'),
  ]);
}

const PLACEHOLDERS: Record<string, string[]> = {
  'nav.productCount': ['{n}'],
  'nav.ingredientCount': ['{n}'],
  'table.sortAria': ['{column}'],
  'table.sortAriaActive': ['{column}', '{direction}'],
  'table.maxPrice': ['{price}'],
  'table.scoreAria': ['{score}'],
  'ingredientDetail.topStacks': ['{name}'],
  'productDetail.score.aria': ['{score}', '{max}'],
  'productDetail.stats.daysCount': ['{days}'],
  'productDetail.stats.daysCountShort': ['{days}'],
  'productDetail.pillars.shortScoreAria': ['{name}', '{pillar}'],
  'guide.minRead': ['{minutes}'],
  'guide.indexHeading': ['{year}'],
  'byline.readTime': ['{minutes}'],
  'listicle.ourPicksFor': ['{useCase}'],
  'listicle.checkProduct': ['{name}'],
  'listicle.howWeChooseBody': ['{minScore}'],
  'listicle.backToBest': ['{year}'],
  'listicle.alsoConsideredHeading': ['{minScore}'],
  'listicle.alsoConsideredIntro': ['{minScore}'],
  'listicle.belowBarReason': ['{score}', '{minScore}'],
  'listicle.alsoConsideredRulesIntro': ['{minScore}'],
  'listicle.doseRuleReason': ['{score}'],
  'listicle.alsoConsideredLinkIntro': ['{minScore}'],
  'listicle.noPurchaseLinkReason': ['{score}'],
  'listicle.moneyBackDays': ['{days}'],
  'bestOf.subtitle': ['{audited}', '{listed}', '{version}', '{date}'],
  'comparator.matchSummary': ['{shown}', '{total}', '{max}'],
  'comparator.compareAria': ['{name}'],
  'comparator.viewAria': ['{name}'],
  'comparator.showResults': ['{n}'],
  'comparator.showResultsOne': ['{n}'],
  'comparator.maxPerMonth': ['{unit}'],
  'comparator.selectedSummary': ['{n}'],
  'ingredientLibrary.guideHeading': ['{year}'],
  'ingredientLibrary.dek': ['{n}'],
  'ingredientLibrary.grade': ['{grade}'],
  'ingredientLibrary.legendCount': ['{n}', '{grade}'],
  'ingredientLibrary.empty': ['{grade}'],
  'ingredientLibrary.gradeAria': ['{grade}'],
  'ingredientLibrary.studyCounts': ['{name}', '{counts}'],
  'ingredientLibrary.showingAll': ['{n}'],
  'ingredientLibrary.showingGrade': ['{n}', '{grade}'],
  'ingredientLibrary.showingGradeOne': ['{n}', '{grade}'],
  'geo.bestIn': ['{place}', '{year}'],
  'geo.topPicksFor': ['{place}'],
};

/**
 * Identical to en on purpose: Trustpilot is a brand name; "Actions" and
 * "Commission" are the same word in French; fr-CA writes "score" (its bundle
 * already says "Notre score"). Every other new string differs from en, and
 * every other ja string contains Japanese script.
 */
const DO_NOT_TRANSLATE: Record<string, Locale[]> = {
  'comparator.columns.trustpilot': ['es', 'fr', 'ja', 'pt', 'de', 'fr-CA'],
  'table.actions': ['fr', 'fr-CA'],
  'bestOf.commission': ['fr', 'fr-CA'],
  'table.sortColumns.score': ['fr-CA'],
  'comparator.columns.score': ['fr-CA'],
};
const exempt = (path: string, locale: Locale) => DO_NOT_TRANSLATE[path]?.includes(locale) ?? false;
const enLeaves = newLeaves('en');

describe('new chrome strings (2026-10-12): every locale, every key', () => {
  test('the scan is non-empty: 187 new strings in en', () => {
    expect(enLeaves.size).toBe(187);
  });

  test.each(ALL_LOCALES)('%s has every key, non-empty', (locale) => {
    const own = newLeaves(locale);
    expect([...own.keys()].sort()).toEqual([...enLeaves.keys()].sort());
    for (const [path, value] of own) expect(value.trim(), `${locale} ${path} is empty`).not.toBe('');
  });

  test.each(ALL_LOCALES)('%s keeps the placeholders and adds none', (locale) => {
    for (const [path, value] of newLeaves(locale)) {
      const allowed = PLACEHOLDERS[path] ?? [];
      for (const token of allowed) expect(value, `${locale} ${path} keeps ${token}`).toContain(token);
      for (const token of value.match(/\{\w+\}/g) ?? []) expect(allowed, `${locale} ${path}: unknown placeholder ${token}`).toContain(token);
    }
  });

  test('ja strings are in Japanese script (do-not-translate entries excepted)', () => {
    for (const [path, value] of newLeaves('ja')) {
      if (exempt(path, 'ja')) continue;
      expect(value, `ja ${path}`).toMatch(JA);
    }
    for (const useCase of ['focus', 'memory', 'studying', 'aging']) {
      expect(getStrings('ja').listicle.useCaseLabels[useCase], useCase).toMatch(JA);
    }
  });

  test.each(['es', 'fr', 'pt', 'de', 'fr-CA'] as Locale[])('%s strings differ from en (do-not-translate list excepted)', (locale) => {
    for (const [path, value] of newLeaves(locale)) {
      if (exempt(path, locale)) continue;
      expect(value, `${locale} ${path} is the English copy`).not.toBe(enLeaves.get(path));
    }
  });

  test('every do-not-translate entry is really identical to en (the list stays honest)', () => {
    for (const [path, locales] of Object.entries(DO_NOT_TRANSLATE)) {
      for (const locale of locales) expect(newLeaves(locale).get(path), `${locale} ${path}`).toBe(enLeaves.get(path));
    }
  });

  test('en keeps the text the templates rendered before the move', () => {
    const s = getStrings('en');
    expect(tpl(s.byline.readTime, { minutes: 8 })).toBe('8 min read');
    expect(tpl(s.ingredientDetail.topStacks, { name: 'Ashwagandha' })).toBe('Top stacks containing Ashwagandha');
    expect(s.ingredientDetail.humanTrialsOnly).toBe('Based on human clinical trials only. Animal and in-vitro data excluded.');
    expect(tpl(s.table.scoreAria, { score: 7.5 })).toBe('Score 7.5 out of 10 — tap or hover for breakdown');
    expect(tpl(s.bestOf.subtitle, { audited: 5, listed: 5, version: 'v3.2', date: '12 Oct 2026' })).toBe(
      '5 audited · 5 listed · methodology v3.2 · refreshed 12 Oct 2026',
    );
    expect(tpl(s.comparator.matchSummary, { shown: 5, total: 5, max: 3 })).toBe('5 of 5 match · select up to 3 to compare side-by-side');
    expect(tpl(s.geo.bestIn, { place: 'Tokyo', year: 2026 })).toBe('Best Nootropics in Tokyo 2026');
    expect(s.editorialStandards.reviewProtocol).toBe('1. Review protocol');
    // The ingredient TOC entry was `inRegion` minus "in "/"en ".
    for (const profile of Object.values(REGION_PROFILES)) {
      if (profile.code === 'jp') continue;
      expect(profile.labels.toc, profile.code).toBe(profile.labels.inRegion.replace(/^(in|en) /, ''));
    }
  });
});

describe('the JP block labels (regional.ts) are Japanese, except the <title> qualifier', () => {
  const L = REGION_PROFILES.jp.labels;
  test.each(['heading', 'availability', 'noProducts', 'licence', 'price', 'monthUnit', 'guides', 'regulatoryNote', 'sources', 'genericSubject', 'toc'] as const)(
    '%s is Japanese',
    (key) => expect(L[key]).toMatch(JA),
  );
  test('inRegion stays English: it is appended to the still-English <title>', () => {
    expect(L.inRegion).toBe('in Japan');
  });
  test('the price, status and month labels are the ja bundle\'s own', () => {
    const rb = getStrings('ja').productDetail.regionalBuying;
    expect(L.price).toBe(rb.price);
    expect(L.licence).toBe(rb.status);
    expect(L.monthUnit).toBe(rb.monthUnit);
  });
});

describe('comparison table sort controls are named in words, never record fields', () => {
  /** [accessible name of each sort button] — the buttons whose only child is ⇅, ▼ or ▲. */
  function sortNames(locale: Locale): string[] {
    const html = text(renderToStaticMarkup(createElement(ComparisonTable, { products: productsUS, market: 'us', strings: getStrings(locale) })));
    return [...html.matchAll(/<button[^>]*aria-label="([^"]*)"[^>]*>(?:⇅|▼|▲)<\/button>/g)].map((m) => m[1]);
  }

  test('en names (the fixed bug: "Sort by trustpilotScore", "Sort by moneyBackDays")', () => {
    expect(sortNames('en')).toEqual([
      'Sort by score, currently descending',
      'Sort by price',
      'Sort by money-back days',
      'Sort by Trustpilot score',
    ]);
  });

  test.each(ALL_LOCALES)('%s: four sort controls, none named with a camelCase field', (locale) => {
    const names = sortNames(locale);
    expect(names).toHaveLength(4);
    for (const name of names) {
      expect(name, `${locale}: ${name}`).not.toMatch(/\b[a-z]+[A-Z]\w*\b/);
      expect(name).not.toMatch(/trustpilotScore|moneyBackDays/);
    }
  });

  test('without a bundle the table still names them in words (en)', () => {
    const html = text(renderToStaticMarkup(createElement(ComparisonTable, { products: productsUS, market: 'us' })));
    expect(html).toContain('aria-label="Sort by Trustpilot score"');
    expect(html).not.toMatch(/Sort by (trustpilotScore|moneyBackDays)/);
  });
});

// ── Render tests: the real JP and LATAM app pages ─────────────────────────────

afterEach(() => {
  vi.unstubAllEnvs();
});

type PageModule = { default: (props: object) => unknown };
const APPS = join(UI_SRC, '..', '..', '..', 'apps');

/**
 * Renders a region app page (apps/<region>/src/app/<route>/page.tsx). The path
 * is built at runtime so `tsc -p packages/ui` does not pull app files (with
 * their `@/…` paths) into its program; vitest.config.ts resolves `@/…` per app.
 */
async function renderPage(region: 'jp' | 'latam', route: string, props: object = {}): Promise<string> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const mod = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
  const element = await mod.default(props);
  return text(renderToStaticMarkup(element as ReactElement));
}

/** Visible text and accessible names: tags stripped, scripts and styles dropped. */
function visible(html: string): string {
  const body = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/g, ' ');
  const attrs = [...body.matchAll(/\b(?:aria-label|alt|title|placeholder)="([^"]*)"/g)].map((m) => m[1]);
  return `${body.replace(/<[^>]+>/g, ' ')} ${attrs.join(' ')}`.replace(/\s+/g, ' ');
}

/** English chrome the JP/LATAM hosts showed before 2026-10-12 (the before-audits); none may render now. */
const ENGLISH_CHROME = [
  'Products in Japan',
  'Prefecture guides',
  'Local price',
  'Regulatory note',
  'Consumer Affairs Agency (FFC)',
  'By The Nootropic Lab editorial team',
  'Fact-checked',
  'min read',
  'With food',
  'Based on human clinical trials only',
  'Top stacks containing',
  'Evidence key:',
  'Best Nootropics in',
  'Top Picks for',
  'Score:',
  '← Back to Guides',
  'Our picks for',
  'What the evidence actually says',
  "Why it's here:",
  'Read full review',
  'Our score',
  'In this guide',
  'Related guides',
  'How we choose',
  'full methodology',
  'Frequently asked questions',
  'Health disclaimer',
  'Sort by',
  'tap or hover for breakdown',
  'Score breakdown',
  "Editor's Choice",
  'Best For',
  'Check Price →',
  'Check Current Price →',
  'Money-Back',
  'Filters',
  'Save view',
  'Reset all filters',
  'Our grade',
  'Products comparison',
  'Search (Command+K)',
];

function expectNoEnglishChrome(html: string, page: string) {
  const shown = visible(html);
  for (const phrase of ENGLISH_CHROME) expect(shown, `${page} still shows "${phrase}"`).not.toContain(phrase);
}

describe('JP pages render their chrome in Japanese', () => {
  const ja = getStrings('ja');

  test('listicle (/best-nootropics-for-memory/)', async () => {
    const html = await renderPage('jp', 'best-nootropics-for-memory');
    for (const s of [
      ja.listicle.whatEvidenceSays,
      tpl(ja.listicle.ourPicksFor, { useCase: ja.listicle.useCaseLabels.memory! }),
      ja.listicle.ourScore,
      ja.listicle.howWeChoose,
      ja.listicle.inThisGuide,
      ja.listicle.relatedGuides,
      ja.byline.attribution,
      tpl(ja.byline.readTime, { minutes: 10 }),
      ja.productDetail.pillars.short.dosing,
    ]) {
      expect(html).toContain(s);
    }
    expectNoEnglishChrome(html, 'JP listicle');
  });

  test('ingredient page (/ingredients/ashwagandha/)', async () => {
    const ing = ingredients.find((i) => i.slug === 'ashwagandha')!;
    const html = await renderPage('jp', 'ingredients/[ingredient]', {
      params: Promise.resolve({ ingredient: 'ashwagandha' }),
    });
    for (const s of [
      ja.ingredientDetail.humanTrialsOnly,
      ja.ingredientDetail.howToLabels.withFood,
      ja.ingredientDetail.evidenceKey.label,
      tpl(ja.ingredientDetail.topStacks, { name: ing.name }),
      REGION_PROFILES.jp.labels.availability,
      REGION_PROFILES.jp.labels.heading.replace('{name}', ing.name),
      ja.productDetail.regionalBuying.regulator.jp,
      ja.byline.attribution,
    ]) {
      expect(html).toContain(s);
    }
    expectNoEnglishChrome(html, 'JP ingredient page');
  });

  test('geo page (/prefectures/tokyo/)', async () => {
    const html = await renderPage('jp', 'prefectures/[prefecture]', {
      params: Promise.resolve({ prefecture: 'tokyo' }),
    });
    expect(html).toContain(tpl(ja.geo.bestIn, { place: '東京都', year: new Date().getFullYear() }));
    expect(html).toContain(tpl(ja.geo.topPicksFor, { place: '東京都' }));
    expect(html).toContain(ja.geo.score);
    expectNoEnglishChrome(html, 'JP prefecture page');
  });

  test('guide page (/guides/what-are-nootropics/)', async () => {
    const html = await renderPage('jp', 'guides/[guide]', {
      params: Promise.resolve({ guide: 'what-are-nootropics' }),
    });
    for (const s of [
      ja.guide.categories.beginner,
      ja.guide.backToGuides,
      REGION_PROFILES.jp.labels.heading.replace('{name}', REGION_PROFILES.jp.labels.genericSubject),
      REGION_PROFILES.jp.labels.availability,
      ja.productDetail.regionalBuying.geoHub.jp,
    ]) {
      expect(html).toContain(s);
    }
    expect(html).toMatch(/\d+分で読めます/);
    expectNoEnglishChrome(html, 'JP guide page');
  });

  test('comparison table (/ja/hikaku/)', async () => {
    const html = await renderPage('jp', 'ja/hikaku');
    expect(html).toContain(`aria-label="${tpl(ja.table.sortAria, { column: ja.table.sortColumns.trustpilot })}"`);
    expect(html).toContain(ja.table.editorChoice);
    expect(html).toContain(ja.table.product);
    expectNoEnglishChrome(html, 'JP comparison table');
  });

  test('best-of hub and comparator (/best-nootropics/, /nootropic-comparison/)', async () => {
    const best = await renderPage('jp', 'best-nootropics');
    for (const s of [ja.bestOf.stats.audited, ja.bestOf.rank, ja.bestOf.commission, ja.bestOf.visit, ja.productDetail.pillars.short.trust]) {
      expect(best).toContain(s);
    }
    expectNoEnglishChrome(best, 'JP best-of');
    const comparator = await renderPage('jp', 'nootropic-comparison');
    for (const s of [ja.comparator.heading, ja.comparator.columns.bestFor, ja.comparator.goals.memory, ja.comparator.grades.worthALook]) {
      expect(comparator).toContain(s);
    }
    expectNoEnglishChrome(comparator, 'JP comparator');
  });
});

describe('LATAM pages render their chrome in Spanish', () => {
  const es = getStrings('es');

  test('listicle (/best-nootropics-for-memory/), now from the bundle', async () => {
    const html = await renderPage('latam', 'best-nootropics-for-memory');
    for (const s of [
      es.listicle.whatEvidenceSays,
      tpl(es.listicle.ourPicksFor, { useCase: es.listicle.useCaseLabels.memory! }),
      es.listicle.ourScore,
      es.byline.attribution,
      tpl(es.byline.readTime, { minutes: 10 }),
    ]) {
      expect(html).toContain(s);
    }
    expectNoEnglishChrome(html, 'LATAM listicle');
  });

  test('ingredient page (/ingredients/ashwagandha/)', async () => {
    const ing = ingredients.find((i) => i.slug === 'ashwagandha')!;
    const html = await renderPage('latam', 'ingredients/[ingredient]', {
      params: Promise.resolve({ ingredient: 'ashwagandha' }),
    });
    for (const s of [
      es.ingredientDetail.humanTrialsOnly,
      es.ingredientDetail.howToLabels.withFood,
      tpl(es.ingredientDetail.topStacks, { name: ing.name }),
      es.byline.attribution,
    ]) {
      expect(html).toContain(s);
    }
    expectNoEnglishChrome(html, 'LATAM ingredient page');
  });

  test('geo page (/countries/mexico/)', async () => {
    const html = await renderPage('latam', 'countries/[country]', {
      params: Promise.resolve({ country: 'mexico' }),
    });
    expect(html).toContain(es.geo.score);
    expectNoEnglishChrome(html, 'LATAM country page');
  });

  test('guide page (/guides/what-are-nootropics/)', async () => {
    const html = await renderPage('latam', 'guides/[guide]', {
      params: Promise.resolve({ guide: 'what-are-nootropics' }),
    });
    expect(html).toContain(es.guide.categories.beginner);
    expectNoEnglishChrome(html, 'LATAM guide page');
  });

  test('comparator (/nootropic-comparison/) and best-of hub', async () => {
    const comparator = await renderPage('latam', 'nootropic-comparison');
    for (const s of [es.comparator.heading, es.comparator.filters, es.comparator.saveView, es.comparator.columns.bestFor]) {
      expect(comparator).toContain(s);
    }
    expectNoEnglishChrome(comparator, 'LATAM comparator');
    const best = await renderPage('latam', 'best-nootropics');
    for (const s of [es.bestOf.stats.recommended, es.bestOf.rank, es.productDetail.breadcrumbBestOf]) expect(best).toContain(s);
    expectNoEnglishChrome(best, 'LATAM best-of');
  });

  test('comparison table with the es bundle (US /es/ pages)', () => {
    const html = text(renderToStaticMarkup(createElement(ComparisonTable, { products: productsUS, market: 'us', strings: es })));
    expect(html).toContain(es.table.product);
    expect(html).toContain(`aria-label="${tpl(es.table.sortAria, { column: es.table.sortColumns.moneyBack })}"`);
    expectNoEnglishChrome(html, 'es comparison table');
  });
});

// ── Source guard: the touched templates type no English chrome ───────────────

/** Templates whose chrome moved to UIStrings on 2026-10-12. */
const GUARDED = [
  'ComparisonTable.tsx',
  'ScoreTooltip.tsx',
  'RegionalAvailability.tsx',
  'public-chrome/FPByline.tsx',
  'templates/BestOf.tsx',
  'templates/Comparator.tsx',
  'templates/comparator/ComparatorFilters.tsx',
  'templates/comparator/ComparatorCompareCard.tsx',
  'templates/IngredientLibrary.tsx',
  'templates/IngredientDetail.tsx',
  'templates/Listicle.tsx',
  'templates/GeoIndexPage.tsx',
  'templates/ShortlistButton.tsx',
];
/** Words that are not English chrome: an acronym button and key/unit symbols. */
const ALLOWED_TEXT = new Set(['CSV']);

describe('the touched templates contain no English literal in JSX text or aria-label/alt/title', () => {
  const sources = GUARDED.map((file) => [file, readFileSync(join(UI_SRC, file), 'utf8')] as const);

  test('the scan is non-empty: every guarded template was read', () => {
    expect(sources).toHaveLength(13);
    for (const [file, src] of sources) expect(src.length, file).toBeGreaterThan(500);
  });

  test.each(GUARDED)('%s', (file) => {
    const src = readFileSync(join(UI_SRC, file), 'utf8');
    const jsx = src
      .slice(src.indexOf('return ('))
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    // `>…<` also matches TypeScript generics and comparisons (`useState<K>('x')`,
    // `>= 4 ? … <`); those fragments carry code punctuation that JSX text does not.
    const literals = [...jsx.matchAll(/>([^<>{}]*)</g)]
      .map((m) => m[1].trim())
      .filter((t) => /[A-Za-z]{2,}/.test(t) && !/[();=?']/.test(t) && !ALLOWED_TEXT.has(t));
    expect(literals, `${file}: JSX text`).toEqual([]);
    const attrs = [...src.matchAll(/\b(?:aria-label|alt|title)="([^"]*)"/g)].map((m) => m[1]).filter((t) => /[A-Za-z]{2,}/.test(t));
    expect(attrs, `${file}: literal aria-label/alt/title`).toEqual([]);
  });

  test('EditorialStandardsSection headings come from the strings (its policy text is the methodology body)', () => {
    const src = readFileSync(join(UI_SRC, 'EditorialStandardsSection.tsx'), 'utf8');
    const headings = [...src.matchAll(/<h[23][^>]*>([^<]*)<\/h[23]>/g)].map((m) => m[1].trim());
    expect(headings.length).toBe(8);
    for (const h of headings) expect(h, h).toMatch(/^\{strings\.\w+\}$/);
  });
});
