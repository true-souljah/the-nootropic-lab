import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getUseCaseListStrings,
  useCaseListPageEnDefaults,
  useCaseListPageEsStrings,
  tpl,
  type UseCaseListPageStrings,
} from './templateStrings';

// The Listicle renders in English everywhere except LATAM, which passes
// useCaseListPageEsStrings. Until 2026-10-09 the template hard-coded part of its
// chrome ("In this guide", "Related guides", "Our score", "Caffeine-free",
// "Audited", pillar names, "/mo", "MBG", the byline), so LATAM pages showed it in
// English. Every visible string now comes from UseCaseListPageStrings.

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
    for (const use of [
      '{s.audited}',
      'attribution={s.bylineAttribution}',
      'factCheckedLabel={s.bylineFactChecked}',
      'updatedLabel={s.bylineUpdated}',
      'readSuffix={s.bylineReadSuffix}',
      's.useCaseLabels[useCase] ?? useCase',
      '{s.caffeineFree}',
      '{s.hasCaffeine}',
      '${s.monthUnit}',
      'tpl(s.moneyBackDays',
      '{s.moneyBackLabel}',
      '{s.ourScore}',
      'tpl(s.scoreAriaLabel',
      's.pillarLabels[key]',
      'tpl(s.pillarScoreLabel',
      '{s.relatedGuides}',
      's.relatedGuideLabels[u]',
      '{s.inThisGuide}',
    ]) {
      expect(jsx, use).toContain(use);
    }
  });
});

describe('Spanish Listicle strings are complete', () => {
  const keys = Object.keys(useCaseListPageEnDefaults) as (keyof UseCaseListPageStrings)[];

  it('every English key has a Spanish value (nothing falls back to English on LATAM)', () => {
    expect(keys.filter((k) => !(k in useCaseListPageEsStrings))).toEqual([]);
  });

  it.each(keys.filter((k) => k !== 'useCaseLabels'))('%s is translated, not copied from English', (key) => {
    const es = useCaseListPageEsStrings[key];
    expect(es, key).toBeTruthy();
    expect(JSON.stringify(es)).not.toBe(JSON.stringify(useCaseListPageEnDefaults[key]));
  });

  it('labels the four LATAM use cases (focus, memory, studying, aging) in Spanish', () => {
    const es = getUseCaseListStrings('es');
    for (const useCase of ['focus', 'memory', 'studying', 'aging']) {
      expect(es.useCaseLabels[useCase], useCase).toBeTruthy();
      expect(es.useCaseLabels[useCase]).not.toBe(useCase);
    }
  });

  it('keeps the English output the template rendered before the move', () => {
    const en = getUseCaseListStrings('en');
    expect(`$59/${en.monthUnit}`).toBe('$59/mo');
    expect(`${tpl(en.moneyBackDays, { days: 30 })} ${en.moneyBackLabel}`).toBe('30d MBG');
    expect(tpl(en.scoreAriaLabel, { score: '9.4', max: '10.0' })).toBe('Score 9.4 out of 10.0');
    expect(tpl(en.pillarScoreLabel, { name: 'Mind Lab Pro', pillar: en.pillarLabels.dosing })).toBe('Mind Lab Pro dosing score');
    expect(en.useCaseLabels).toEqual({});
  });

  it('Spanish monthly unit has no leading slash (a "/"-led string in the RSC payload is crawled as a URL)', () => {
    expect(getUseCaseListStrings('es').monthUnit).not.toMatch(/^\//);
    expect(getUseCaseListStrings('en').monthUnit).not.toMatch(/^\//);
  });
});
