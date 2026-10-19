import { describe, test, expect, vi, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { REGION_PROFILES, getStrings, ingredients, productsUS, type Locale } from '@nootropic/data';
import ComparisonTable from './ComparisonTable';
import { tpl, tplLink } from './templateStrings';

// 2026-10-12, phase 1 of the JP/LATAM translation ("chrome now, bodies next"):
// the shared templates (listicle, best-of, comparator, ingredient library and
// page, the "In <region>" block, byline, comparison table) and the JP/LATAM page
// shells hard-coded English chrome, so the ja (JP) and es (LATAM) hosts showed
// it in English on every page. The template strings now live in UIStrings in all
// 7 locales; page bodies (guides, ingredient data, product records, legal pages)
// stay English until phase 2.
//
// 2026-10-13, owner decision: Japanese copy on the JP host is paused until a
// Japanese pharmaceutical-advertising lawyer has reviewed it. The JP host
// renders the en bundle again (its ja strings stay in i18n.ts, unused on JP);
// the JP tests below assert English chrome and no Japanese in header, nav and
// footer.

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
  // The eight headings are this change's chrome; the policy text (`body`,
  // en and es only, 2026-10-19) is checked in products-latam-es.test.ts.
  const { body: _editorialBody, ...editorialHeadings } = s.editorialStandards;
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
    ...leaves(editorialHeadings, 'editorialStandards'),
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
  'listicle.howWeChooseBody': ['{minScore}', '{link}'],
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
    // "7.5/10", not "7.5 out of 10" since 2026-10-19: the name must contain the
    // score button's visible "7.5/10" (WCAG 2.5.3; see the Label in Name test).
    expect(tpl(s.table.scoreAria, { score: 7.5 })).toBe('Score 7.5/10 — tap or hover for breakdown');
    expect(tpl(s.bestOf.subtitle, { audited: 5, listed: 5, version: 'v3.2', date: '12 Oct 2026' })).toBe(
      '5 audited · 5 listed · methodology v3.2 · refreshed 12 Oct 2026',
    );
    expect(tpl(s.comparator.matchSummary, { shown: 5, total: 5, max: 3 })).toBe('5 of 5 match · select up to 3 to compare side-by-side');
    expect(tpl(s.geo.bestIn, { place: 'Tokyo', year: 2026 })).toBe('Best Nootropics in Tokyo 2026');
    expect(s.editorialStandards.reviewProtocol).toBe('1. Review protocol');
    // The ingredient TOC entry was `inRegion` minus "in "/"en ".
    for (const profile of Object.values(REGION_PROFILES)) {
      expect(profile.labels.toc, profile.code).toBe(profile.labels.inRegion.replace(/^(in|en) /, ''));
    }
  });
});

describe('the JP block labels (regional.ts) are English (Japanese copy paused 2026-10-13)', () => {
  const L = REGION_PROFILES.jp.labels;
  test('the labels JP showed before 2026-10-12, word for word', () => {
    expect(L).toEqual({
      inRegion: 'in Japan',
      heading: '{name} in Japan',
      availability: 'Products in Japan',
      noProducts: 'None of the stacks we have audited are listed in our catalogue in Japan yet.',
      licence: 'Status',
      price: 'Local price',
      monthUnit: 'month',
      guides: 'Prefecture guides',
      regulatoryNote: 'Regulatory note',
      sources: 'Sources',
      genericSubject: 'Nootropics',
      toc: 'Japan',
    });
  });
  test('no label carries Japanese script', () => {
    for (const [key, value] of Object.entries(L)) expect(value, key).not.toMatch(JA);
  });
  test('prices keep yen formatting (ja-JP number format)', () => {
    expect(REGION_PROFILES.jp.priceLocale).toBe('ja-JP');
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

// WCAG 2.5.3 Label in Name (axe-core 4.14 label-content-name-mismatch, no
// longer experimental): an aria-label replaces the button's text, so it must
// contain the text the button shows. The score buttons showed "7.5/10" but were
// named "Score 7.5 out of 10 — …" ("Note de 7.5 sur 10", "スコア 10点中7.5点", …),
// so a speech-input user saying what they see matched nothing.
describe('comparison table score buttons are named with the text they show (WCAG 2.5.3)', () => {
  /** [accessible name, visible text] of each ScoreTooltip button (desktop rows and mobile cards). */
  function scoreButtons(locale: Locale): Array<[string, string]> {
    const html = text(renderToStaticMarkup(createElement(ComparisonTable, { products: productsUS, market: 'us', strings: getStrings(locale) })));
    return [...html.matchAll(/<button class="[^"]*\bcursor-help\b[^"]*" aria-label="([^"]*)"[^>]*>([^<]*)<\/button>/g)].map((m) => [m[1], m[2]]);
  }

  test.each(ALL_LOCALES)('%s: every score button name contains its visible "x/10"', (locale) => {
    const buttons = scoreButtons(locale);
    expect(buttons.length, 'one per product in the rows and one in the mobile cards').toBe(productsUS.length * 2);
    for (const [name, shown] of buttons) {
      expect(shown, `${locale}: visible text`).toMatch(/^\d+(\.\d+)?\/10$/);
      expect(name, `${locale}: "${name}" does not contain "${shown}"`).toContain(shown);
    }
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
async function renderPage(region: 'jp' | 'latam' | 'us', route: string, props: object = {}): Promise<string> {
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

/** Japanese script, CJK punctuation and full-width forms (not the ￥ currency sign, U+FFE5). */
const JA_ANY = /[　-ヿㇰ-ㇿ㐀-䶿一-鿿！-～｡-ﾟ]/;

/** The site chrome around a rendered page body: every header, nav and footer element. */
function chromeParts(html: string): string[] {
  return [...html.matchAll(/<(header|nav|footer)\b[\s\S]*?<\/\1>/g)].map((m) => m[0]);
}

/**
 * ja wording the JP compliance guide flags (§6, owner decision 2026-10-13): the
 * footer's best-by-goal line, the listicle use-case labels and the related-guide
 * link labels. The strings stay in i18n.ts, unused; none may render on JP.
 */
const JA_FLAGGED = (() => {
  const ja = getStrings('ja');
  const { heading: _heading, ...goals } = ja.footer.bestByGoal;
  return [
    ...Object.values(goals),
    ...Object.values(ja.listicle.useCaseLabels).filter((v): v is string => !!v),
    ...Object.values(ja.listicle.relatedGuideLabels),
  ];
})();

/**
 * JP chrome is English: the page's header / nav / footer (PublicShell) or
 * sidebar nav (AppShell) render and carry no Japanese; no flagged ja label
 * renders anywhere on the page.
 */
function expectEnglishJpChrome(html: string, page: string, jaChrome: string[] = []) {
  const parts = chromeParts(html);
  expect(parts.some((p) => /^<(header|nav)\b/.test(p)), `${page}: a header or nav rendered (the chrome scan is non-empty)`).toBe(true);
  for (const part of parts) expect(visible(part), `${page}: Japanese in ${part.slice(0, 60)}`).not.toMatch(JA_ANY);
  const shown = visible(html);
  for (const s of [...JA_FLAGGED, ...jaChrome]) expect(shown, `${page} shows ja chrome "${s}"`).not.toContain(s);
}

describe('JP pages render their chrome in English (Japanese copy paused 2026-10-13)', () => {
  const en = getStrings('en');
  const ja = getStrings('ja');

  test('the flagged ja labels exist (the guard checks real strings)', () => {
    expect(JA_FLAGGED.length).toBeGreaterThanOrEqual(15);
    for (const s of JA_FLAGGED) expect(s).toMatch(JA);
  });

  test('listicle (/best-nootropics-for-memory/)', async () => {
    const html = await renderPage('jp', 'best-nootropics-for-memory');
    for (const s of [
      en.listicle.whatEvidenceSays,
      tpl(en.listicle.ourPicksFor, { useCase: en.listicle.useCaseLabels.memory ?? 'memory' }),
      en.listicle.ourScore,
      en.listicle.howWeChoose,
      en.listicle.inThisGuide,
      en.listicle.relatedGuides,
      en.byline.attribution,
      tpl(en.byline.readTime, { minutes: 10 }),
      en.productDetail.pillars.short.dosing,
    ]) {
      expect(html).toContain(s);
    }
    expectEnglishJpChrome(html, 'JP listicle', [
      ja.listicle.whatEvidenceSays,
      ja.listicle.ourScore,
      ja.listicle.howWeChoose,
      ja.listicle.inThisGuide,
      ja.listicle.relatedGuides,
      ja.byline.attribution,
    ]);
  });

  test('ingredient page (/ingredients/ashwagandha/)', async () => {
    const ing = ingredients.find((i) => i.slug === 'ashwagandha')!;
    const html = await renderPage('jp', 'ingredients/[ingredient]', {
      params: Promise.resolve({ ingredient: 'ashwagandha' }),
    });
    for (const s of [
      en.ingredientDetail.humanTrialsOnly,
      en.ingredientDetail.howToLabels.withFood,
      en.ingredientDetail.evidenceKey.label,
      tpl(en.ingredientDetail.topStacks, { name: ing.name }),
      'Products in Japan',
      `${ing.name} in Japan`,
      en.productDetail.regionalBuying.regulator.jp,
      en.byline.attribution,
    ]) {
      expect(html).toContain(s);
    }
    expectEnglishJpChrome(html, 'JP ingredient page', [
      ja.ingredientDetail.humanTrialsOnly,
      ja.ingredientDetail.howToLabels.withFood,
      ja.productDetail.regionalBuying.regulator.jp,
    ]);
  });

  test('geo page (/prefectures/tokyo/)', async () => {
    const html = await renderPage('jp', 'prefectures/[prefecture]', {
      params: Promise.resolve({ prefecture: 'tokyo' }),
    });
    expect(html).toContain(tpl(en.geo.bestIn, { place: 'Tokyo', year: new Date().getFullYear() }));
    expect(html).toContain(tpl(en.geo.topPicksFor, { place: 'Tokyo' }));
    expect(html).toContain(en.geo.score);
    expect(html).toContain('Best Nootropics Japan');
    expectEnglishJpChrome(html, 'JP prefecture page', [tpl(ja.geo.topPicksFor, { place: '東京都' })]);
  });

  test('guide page (/guides/what-are-nootropics/)', async () => {
    const html = await renderPage('jp', 'guides/[guide]', {
      params: Promise.resolve({ guide: 'what-are-nootropics' }),
    });
    for (const s of [
      en.guide.categories.beginner,
      en.guide.backToGuides,
      'Nootropics in Japan',
      'Products in Japan',
      en.productDetail.regionalBuying.geoHub.jp,
    ]) {
      expect(html).toContain(s);
    }
    expect(html).toMatch(/\d+ min read/);
    expectEnglishJpChrome(html, 'JP guide page', [ja.guide.backToGuides]);
  });

  test('best-of hub and comparator (/best-nootropics/, /nootropic-comparison/)', async () => {
    const best = await renderPage('jp', 'best-nootropics');
    for (const s of [en.bestOf.stats.audited, en.bestOf.rank, en.bestOf.commission, en.bestOf.visit, en.productDetail.pillars.short.trust]) {
      expect(best).toContain(s);
    }
    expectEnglishJpChrome(best, 'JP best-of', [ja.bestOf.rank, ja.bestOf.visit]);
    const comparator = await renderPage('jp', 'nootropic-comparison');
    for (const s of [en.comparator.heading, en.comparator.columns.bestFor, en.comparator.goals.memory, en.comparator.grades.worthALook]) {
      expect(comparator).toContain(s);
    }
    expectEnglishJpChrome(comparator, 'JP comparator', [ja.comparator.heading, ja.comparator.goals.memory]);
    expect(comparator).toContain(`>${en.productDetail.stats.perServingLabel}</div>`);
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
    // The per-serving column (main, 2026-10-13) is headed in the page language.
    expect(comparator).toContain(`>${es.productDetail.stats.perServingLabel}</div>`);
    expect(visible(comparator)).not.toMatch(/Per serving|Per day/i);
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

// ── Locale typography: what goes between translated pieces (2026-10-13) ──────
//
// Japanese punctuation (。、：) carries its own spacing, and Japanese puts no
// space between words or around a link. The JP host showed
// "…詳しくは当サイトの 評価方法の全文." (a space before the methodology link, a
// Latin full stop after it), "更新日 <date>", "販売： FANCL", "最終全面監査:".
// A sentence around a link now comes whole from the locale ({link}); every
// other join reads uiStrings.typography (colon, space).

describe('locale typography', () => {
  test.each([
    ['en', ': ', ' '],
    ['es', ': ', ' '],
    ['pt', ': ', ' '],
    ['de', ': ', ' '],
    ['fr', '\u00a0: ', ' '],
    ['fr-CA', '\u00a0: ', ' '],
    ['ja', '：', ''],
  ] as const)('%s joins', (locale, colon, space) => {
    expect(getStrings(locale).typography).toEqual({ colon, space });
  });

  test.each(ALL_LOCALES)('%s: "How we choose" places the link once and closes its own sentence', (locale) => {
    const body = getStrings(locale).listicle.howWeChooseBody;
    expect(body.split('{link}'), locale).toHaveLength(2);
    const { before, after } = tplLink(body, { minScore: '7.0' });
    expect(after, locale).toMatch(locale === 'ja' ? /^をご覧ください。$/ : /^\.$/);
    expect(before, locale).toMatch(locale === 'ja' ? /当サイトの$/ : /\S $/);
  });

  test('no ja string ends in a Latin colon or full stop, or in a space', () => {
    // noPurchaseLink is the English bundle on purpose (purchase-link.ts, site-owner decision 2026-10-08).
    const { noPurchaseLink: _english, ...ja } = getStrings('ja');
    // English sentences on purpose: keys added 2026-10-15 while Japanese copy is paused
    // (compliance:jp-japanese-paused-2026-10-13); i18n-leftovers.test.ts holds them equal to en.
    const englishWhilePaused = /^ja\.(table\.euStorefrontNote|ingredientDetail\.schema\.)/;
    const bad = leaves(ja, 'ja').filter(([path, v]) => !englishWhilePaused.test(path) && /[:.]$|\s$/.test(v));
    expect(bad).toEqual([]);
  });
});

/** Joins that are wrong in Japanese, as they show in rendered HTML. */
const JA_CHAR = '[぀-ヿ一-鿿]';
const JA_JOIN_ERRORS: Array<[string, RegExp]> = [
  ['a space after 。、：', /[。、：](?:<\/(?:strong|span|b)>)? +/],
  ['a space between Japanese text and a link, date, value or button', new RegExp(`${JA_CHAR} +<(?:a|time|strong|button)\\b`)],
  ['a space between an element and Japanese text', new RegExp(`</(?:a|time|strong|span|button)> +${JA_CHAR}`)],
  ['a Latin colon after Japanese text', new RegExp(`${JA_CHAR}(?:</(?:strong|span|b)>)?:`)],
  ['a Latin full stop after a Japanese link', new RegExp(`${JA_CHAR}</a>\\.`)],
];

function jaJoinErrors(html: string): string[] {
  const body = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/g, ' ');
  return JA_JOIN_ERRORS.flatMap(([name, re]) => {
    const m = body.match(re);
    return m ? [`${name}: …${body.slice(Math.max(0, m.index! - 40), m.index! + m[0].length + 40)}…`] : [];
  });
}

// The JP host renders the en bundle since 2026-10-13 (Japanese copy paused), so
// its joins are the English ones; Japanese that stays in page bodies (FFC terms,
// the regional disclaimer's Japanese half) must still join cleanly.
describe('JP pages: English joins, and clean joins around the Japanese that stays in bodies', () => {
  test('"How we choose": "… Read our <link>." as on the US listicle', async () => {
    const html = await renderPage('jp', 'best-nootropics-for-memory');
    expect(html).toMatch(
      /in our 5-pillar editorial audit\. Read our <a class="text-ds-accent underline" href="\/methodology\/?">full methodology<\/a>\.<\/p>/,
    );
  });

  test.each([
    ['', {}],
    ['about', {}],
    ['methodology', {}],
    ['guides', {}],
    ['ingredients', {}],
    ['prefectures', {}],
    ['best-nootropics-for-memory', {}],
    ['best-nootropics', {}],
    ['nootropic-comparison', {}],
    ['ingredients/[ingredient]', { params: Promise.resolve({ ingredient: 'ashwagandha' }) }],
    ['guides/[guide]', { params: Promise.resolve({ guide: 'how-nootropics-work' }) }],
    ['prefectures/[prefecture]', { params: Promise.resolve({ prefecture: 'tokyo' }) }],
    ['[slug]', { params: Promise.resolve({ slug: 'fancl-brains-review' }) }],
    ['ffc-notified-cognitive-supplements', {}],
    ['japanese-brain-supplements', {}],
  ] as const)('%s', async (route, props) => {
    const html = await renderPage('jp', route, props);
    expect(html.length).toBeGreaterThan(5000);
    expect(jaJoinErrors(html)).toEqual([]);
    expectEnglishJpChrome(html, `JP ${route || '/'}`);
  });

  test('the joins render as English sets them', async () => {
    const en = getStrings('en');
    const listicle = await renderPage('jp', 'best-nootropics-for-memory');
    expect(listicle).toContain('Updated <time');
    expect(listicle).toContain("Why it's here:</strong> ");
    expect(listicle).toMatch(/Last full re-audit: \w/);
    const ingredient = await renderPage('jp', 'ingredients/[ingredient]', { params: Promise.resolve({ ingredient: 'ashwagandha' }) });
    expect(ingredient).toContain('Evidence reviewed: <time');
    expect(ingredient).toContain('Evidence key: <span aria-hidden="true">●●●</span> Strong');
    expect(ingredient).toContain('Sources <span');
    const review = await renderPage('jp', '[slug]', { params: Promise.resolve({ slug: 'fancl-brains-review' }) });
    expect(review).toContain(`${en.productDetail.meta.lastVerified} <time`);
    const prefecture = await renderPage('jp', 'prefectures/[prefecture]', { params: Promise.resolve({ prefecture: 'tokyo' }) });
    expect(prefecture).toContain(`${en.geo.score} <strong`);
  });
});

describe('en output is unchanged by the typography joins', () => {
  test('"How we choose" (US listicle): "… Read our <link>." as before', async () => {
    const html = await renderPage('us', 'best-nootropics-for-memory');
    expect(html).toMatch(
      /in our 5-pillar editorial audit\. Read our <a class="text-ds-accent underline" href="\/methodology\/?">full methodology<\/a>\.<\/p>/,
    );
    expect(html).toContain('Updated <time');
    expect(html).toContain("Why it's here:</strong> ");
    expect(html).toMatch(/Last full re-audit: \w/);
  });

  test('ingredient and review pages keep "label: value" and "By Brand"', async () => {
    const ingredient = await renderPage('us', 'ingredients/[ingredient]', { params: Promise.resolve({ ingredient: 'ashwagandha' }) });
    expect(ingredient).toContain('Evidence reviewed: <time');
    expect(ingredient).toContain('Evidence key: <span aria-hidden="true">●●●</span> Strong');
    expect(ingredient).toContain('Sources <span');
    const table = text(renderToStaticMarkup(createElement(ComparisonTable, { products: productsUS, market: 'us', strings: getStrings('en') })));
    expect(table).toContain('Price: </span>');
    expect(table).toContain('Score <button');
  });
});

describe('every JP-reachable caller passes the locale join to the components that join translated pieces', () => {
  const JOINERS = ['FPDisclosure', 'FPTrustNote', 'FPByline', 'Sources', 'AffiliateDisclosure', 'StickyCtaBar'];
  const files = [
    ...readdirSync(join(UI_SRC, 'templates')).filter((f) => f.endsWith('.tsx')).map((f) => join(UI_SRC, 'templates', f)),
    ...(readdirSync(join(APPS, 'jp', 'src'), { recursive: true }) as string[])
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => join(APPS, 'jp', 'src', f)),
  ];
  const calls = files.flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(new RegExp(`<(${JOINERS.join('|')})\\b[\\s\\S]*?/>`, 'g'))].map((m) => ({ file, tag: m[0] })),
  );

  test('the scan is non-empty', () => {
    expect(files.length).toBeGreaterThan(30);
    expect(calls.length).toBeGreaterThan(20);
  });

  test('each call passes space= (English-only callers excepted)', () => {
    const missing = calls.filter(({ tag }) => !/\bspace=/.test(tag) && !tag.includes("getStrings('en')"));
    expect(missing.map(({ file, tag }) => `${file}: ${tag.slice(0, 80)}`)).toEqual([]);
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
