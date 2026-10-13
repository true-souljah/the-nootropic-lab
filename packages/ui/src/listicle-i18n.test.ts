import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tpl } from './templateStrings';
import { getStrings, type Locale } from '@nootropic/data';

// Until 2026-10-09 the template hard-coded part of its chrome ("In this guide",
// "Related guides", "Our score", "Caffeine-free", "Audited", pillar names,
// "/mo", "MBG", the byline), so LATAM pages showed it in English. Since
// 2026-10-12 the strings live in the locale bundle (UIStrings.listicle, plus
// the shared byline, chips, score and pillar keys), so JP listicles render
// Japanese and LATAM no longer passes a separate Spanish override.

const src = readFileSync(join(__dirname, 'templates', 'Listicle.tsx'), 'utf8');
const jsx = src
  .slice(src.indexOf('return ('))
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/^\s*\/\/.*$/gm, '');

describe('Listicle template renders no hard-coded English', () => {
  it('no JSX text node is a literal word (all copy comes from strings)', () => {
    const literals = [...jsx.matchAll(/>([^<>{}]*)</g)].map((m) => m[1].trim()).filter((t) => /[A-Za-z]{2,}/.test(t));
    expect(literals).toEqual([]);
  });

  it.each([
    'Audited',
    'Caffeine-free',
    '>Caffeine<',
    'Our score',
    'Related guides',
    'Best nootropics for',
    'In this guide',
    '/mo`',
    ' MBG',
    '} score`',
  ])('the former literal %j is gone', (literal) => {
    expect(jsx).not.toContain(literal);
  });

  it('byline, chips, price line, score panel, related guides and TOC read the strings', () => {
    expect(src).toContain('const s = uiStrings.listicle;');
    for (const use of [
      '{s.audited}',
      'strings={uiStrings.byline}',
      'tpl(s.ourPicksFor, { useCase: s.useCaseLabels[useCase] ?? useCase })',
      '{pd.chips.caffeineFree}',
      '{pd.chips.hasCaffeine}',
      // The price line is the shared store-price text, localized through uiStrings.
      'priceText(pick.product, uiStrings)',
      'tpl(s.moneyBackDays',
      '{s.moneyBackLabel}',
      '{s.ourScore}',
      'tpl(pd.score.aria',
      'pd.pillars.short[key]',
      'tpl(pd.pillars.shortScoreAria',
      '{s.relatedGuides}',
      's.relatedGuideLabels[u]',
      '{s.inThisGuide}',
      'heading={uiStrings.guide.sources}',
    ]) {
      expect(jsx, use).toContain(use);
    }
  });
});

describe('Listicle strings are complete in every locale', () => {
  const LOCALES: Locale[] = ['es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
  const en = getStrings('en').listicle;
  const keys = Object.keys(en) as (keyof typeof en)[];

  it.each(LOCALES)('%s has every key, and translates it (not copied from English)', (locale) => {
    const own = getStrings(locale).listicle;
    expect(Object.keys(own).sort()).toEqual([...keys].sort());
    for (const key of keys.filter((k) => k !== 'useCaseLabels')) {
      expect(JSON.stringify(own[key]), `${locale} ${key}`).not.toBe(JSON.stringify(en[key]));
    }
  });

  it.each(['es', 'ja'] as Locale[])('%s labels the four use cases its listicles carry (focus, memory, studying, aging)', (locale) => {
    const own = getStrings(locale).listicle;
    for (const useCase of ['focus', 'memory', 'studying', 'aging']) {
      expect(own.useCaseLabels[useCase], useCase).toBeTruthy();
      expect(own.useCaseLabels[useCase]).not.toBe(useCase);
    }
  });

  it('keeps the English output the template rendered before the move', () => {
    const ui = getStrings('en');
    const s = ui.listicle;
    expect(`${tpl(s.moneyBackDays, { days: 30 })} ${s.moneyBackLabel}`).toBe('30d MBG');
    expect(tpl(ui.productDetail.score.aria, { score: '9.4', max: '10.0' })).toBe('Score 9.4 out of 10.0');
    expect(tpl(ui.productDetail.pillars.shortScoreAria, { name: 'Mind Lab Pro', pillar: ui.productDetail.pillars.short.dosing })).toBe(
      'Mind Lab Pro dosing score',
    );
    expect(tpl(s.ourPicksFor, { useCase: s.useCaseLabels.memory ?? 'memory' })).toBe('Our picks for memory');
    expect(`${ui.byline.attribution} · ${ui.byline.updated} · ${tpl(ui.byline.readTime, { minutes: 10 })} · ${ui.byline.factChecked}`).toBe(
      'By The Nootropic Lab editorial team · Updated · 10 min read · ✓ Fact-checked',
    );
    expect(s.useCaseLabels).toEqual({});
  });

  it('the monthly unit the price line renders has no leading slash in any locale (a "/"-led string in the RSC payload is crawled as a URL)', () => {
    for (const locale of ['en', 'es', 'fr', 'fr-CA', 'de', 'pt', 'ja'] as const) {
      expect(getStrings(locale).productDetail.stats.monthUnit, locale).not.toMatch(/^\//);
    }
  });
});
