import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import * as data from '@nootropic/data';
import type { Product } from '@nootropic/data';
import {
  LISTICLE_MIN_SCORE,
  alsoConsideredText,
  belowBarReason,
  doseRuleReason,
  evidenceAtReferenceDose,
  formatListicleScore,
  howWeChooseText,
  notRankedReason,
  splitListiclePicks,
  type ListicleEvidenceIngredients,
} from './templates/listicleRanking';
import { getUseCaseListStrings, type TemplateLocale } from './templateStrings';

// Site-owner decision 2026-10-08: every listicle says a pick must "score ≥ {bar}/10
// in our 5-pillar editorial audit". Ranked picks must meet that bar; picks below
// it stay on the page, unranked and without a buy link, under "Also considered".
// The bar was 7.5 (2026-10-08) and is 7.0 since 2026-10-09 (site-owner decision,
// when the dosing pillar became computed from label doses).
// Site-owner decision 2026-10-09: rule (b) — a pick doses one of the page's
// evidence ingredients at or near the clinical-trial dose — is enforced too: a
// pick whose label proves none of them at our reference dose (dosing-anchors.ts)
// moves to "Also considered" with that reason. Site-owner decision 2026-10-09
// (later): a combination evidence card ("L-Theanine + Caffeine") counts only
// when EVERY ingredient it lists is proven; single-ingredient cards unchanged.

const REPO = join(__dirname, '..', '..', '..');
const UI_SRC = __dirname;
const LOCALES: TemplateLocale[] = ['en', 'es'];
const BAR = formatListicleScore(LISTICLE_MIN_SCORE);

// Mind Lab Pro's citicoline row (250mg Cognizin, proven at the 250mg reference
// dose): every synthetic pick carries it, so the bar tests exercise the score
// rule alone.
const AT_REFERENCE_DOSE = { name: 'Citicoline (Cognizin)', doseInProduct: '250mg', clinicalDose: '250-500mg/day', adequatelyDosed: true };
const EVIDENCE: ListicleEvidenceIngredients[] = [{ ingredientSlugs: ['citicoline'] }];

function pick(name: string, score: number, rank?: number) {
  return {
    product: { name, score, ingredientDosages: [AT_REFERENCE_DOSE] },
    whyItsHere: `${name} blurb`,
    ...(rank === undefined ? {} : { rank }),
  };
}
const names = (picks: Array<{ product: { name: string } }>) => picks.map((p) => p.product.name);

describe('LISTICLE_MIN_SCORE', () => {
  it('is the 7.0 bar the site owner set (2026-10-09, was 7.5) — change it deliberately', () => {
    expect(LISTICLE_MIN_SCORE).toBe(7.0);
    expect(BAR).toBe('7.0');
  });

  // The methodology pages render the bar from the constant and state its
  // history in prose ("was set to 7.0 when …"). When the bar changes, this
  // fails until every page's history sentence is rewritten by hand.
  const methodologyPages = readdirSync(join(REPO, 'apps'))
    .map((app) => [app, join(REPO, 'apps', app, 'src', 'app', 'methodology', 'page.tsx')] as const)
    .filter(([, file]) => existsSync(file));

  it('finds all 8 methodology pages (guards against an empty scan)', () => {
    expect(methodologyPages.map(([app]) => app).sort()).toEqual(['au', 'ca', 'eu', 'gcc', 'jp', 'latam', 'sea', 'us']);
  });

  it.each(methodologyPages)('%s methodology renders the bar from the constant and its history ends at it', (app, file) => {
    const src = readFileSync(file, 'utf8');
    // One template literal: a JSX run `{score}/10 …` puts a "/10 …" string in the RSC payload,
    // which check:links (rsc-string) rejects as a dead path.
    expect(src).toContain('${formatListicleScore(LISTICLE_MIN_SCORE)}/10');
    expect(src).not.toMatch(/(?<!\$)\{formatListicleScore\(LISTICLE_MIN_SCORE\)\}\/10/);
    expect(src).toContain(app === 'latam' ? `se fijó en ${BAR} cuando` : `was set to ${BAR} when`);
  });
});

describe('splitListiclePicks', () => {
  it('ranks a pick scoring exactly the bar; a 6.9 pick is not ranked', () => {
    const { ranked, alsoConsidered } = splitListiclePicks([pick('At bar', 7.0, 1), pick('Just under', 6.9, 2)], EVIDENCE);
    expect(names(ranked)).toEqual(['At bar']);
    expect(names(alsoConsidered)).toEqual(['Just under']);
    expect(alsoConsidered[0].notRanked).toBe('belowBar');
  });

  it('keeps hand order (not score order) in both groups and renumbers ranks 1..n', () => {
    const { ranked, alsoConsidered } = splitListiclePicks(
      [pick('C', 9.4, 3), pick('A', 7.6, 1), pick('B', 6.6, 2), pick('E', 8.3, 5), pick('D', 6.9, 4)],
      EVIDENCE,
    );
    expect(ranked.map((p) => [p.product.name, p.rank])).toEqual([['A', 1], ['C', 2], ['E', 3]]);
    expect(names(alsoConsidered)).toEqual(['B', 'D']);
  });

  it('puts every pick in exactly one group — a NaN score is below the bar, never dropped', () => {
    const input = [pick('Ok', 8, 1), pick('Broken', Number.NaN, 2), pick('Low', 3, 3)];
    const { ranked, alsoConsidered } = splitListiclePicks(input, EVIDENCE);
    expect(names(ranked)).toEqual(['Ok']);
    expect(names(alsoConsidered)).toEqual(['Broken', 'Low']);
  });

  it('places picks without a rank after those with one, in array order', () => {
    const { ranked } = splitListiclePicks([pick('No rank 1', 9), pick('Ranked', 8, 1), pick('No rank 2', 8.5)], EVIDENCE);
    expect(ranked.map((p) => [p.product.name, p.rank])).toEqual([['Ranked', 1], ['No rank 1', 2], ['No rank 2', 3]]);
  });

  it('does not mutate the page’s picks', () => {
    const input = [pick('B', 9, 2), pick('A', 8, 1)];
    const before = JSON.stringify(input);
    splitListiclePicks(input, EVIDENCE);
    expect(JSON.stringify(input)).toBe(before);
  });
});

// ---------------------------------------------------------------------------
// Rule (b) on real catalogue rows. The premises (each row's anchor and stored
// verdict) are asserted first, so a data change fails here loudly instead of
// silently flipping what the rule test proves.
// ---------------------------------------------------------------------------

const allSets = data as unknown as Record<string, Product[] | undefined>;
function record(set: string, slug: string): Product {
  const product = allSets[set]?.find((p) => p.slug === slug);
  if (!product) throw new Error(`${set} has no "${slug}"`);
  return product;
}
function rowVerdicts(product: Product, slug: string) {
  return product.ingredientDosages
    .filter((row) => data.dosingAnchorFor(row)?.ingredientSlug === slug)
    .map((row) => [row.name, row.adequatelyDosed]);
}
const cards = (...slugs: string[][]): ListicleEvidenceIngredients[] => slugs.map((ingredientSlugs) => ({ ingredientSlugs }));
// The evidence cards of EU memory (Bacopa, Lion's Mane, PS, citicoline), SEA studying (L-theanine + caffeine, Bacopa,
// citicoline, L-tyrosine) and US focus (L-theanine + caffeine, citicoline, L-tyrosine, Alpha-GPC).
const EU_MEMORY = cards(['bacopa-monnieri'], ['lions-mane'], ['phosphatidylserine'], ['citicoline']);
const SEA_STUDYING = cards(['l-theanine', 'caffeine'], ['bacopa-monnieri'], ['citicoline'], ['l-tyrosine']);
const US_FOCUS = cards(['l-theanine', 'caffeine'], ['citicoline'], ['l-tyrosine'], ['alpha-gpc']);

describe('rule (b): a ranked pick doses one of the page’s evidence ingredients at our reference dose', () => {
  const mlpEU = record('productsEU', 'mind-lab-pro-review');
  const noocubeEU = record('productsEU', 'noocube-review');
  const naturebellSEA = record('productsSEA', 'naturebell-ginkgo-ginseng-review');
  const hunterEU = record('productsEU', 'hunter-focus-review');

  it('passes Mind Lab Pro (EU) on EU memory: citicoline 250mg and PS 100mg are proven at the reference dose', () => {
    expect(rowVerdicts(mlpEU, 'citicoline')).toEqual([['Citicoline (Cognizin)', true]]);
    expect(rowVerdicts(mlpEU, 'phosphatidylserine')).toEqual([['Phosphatidylserine', true]]);
    expect(evidenceAtReferenceDose(mlpEU, EU_MEMORY).sort()).toEqual(['citicoline', 'phosphatidylserine']);
  });

  it('fails NooCube (EU) on EU memory: its only memory ingredient, Bacopa 250mg at 20% bacosides, is proven below', () => {
    expect(noocubeEU.score).toBeGreaterThanOrEqual(LISTICLE_MIN_SCORE);
    expect(rowVerdicts(noocubeEU, 'bacopa-monnieri')).toEqual([['Bacopa Monnieri Extract (herb, 20% bacosides)', false]]);
    expect(evidenceAtReferenceDose(noocubeEU, EU_MEMORY)).toEqual([]);
    const { ranked, alsoConsidered } = splitListiclePicks(
      [{ product: mlpEU, rank: 1 }, { product: noocubeEU, rank: 2 }],
      EU_MEMORY,
    );
    expect(ranked.map((p) => [p.product.slug, p.rank])).toEqual([['mind-lab-pro-review', 1]]);
    expect(alsoConsidered.map((p) => [p.product.slug, p.notRanked])).toEqual([['noocube-review', 'doseRule']]);
  });

  it('judges the same product per page: NatureBell (SEA) passes on Ginkgo evidence, fails on studying evidence', () => {
    expect(rowVerdicts(naturebellSEA, 'ginkgo-biloba')).toEqual([['Ginkgo Biloba Extract (leaf)', true]]);
    expect(evidenceAtReferenceDose(naturebellSEA, cards(['ginkgo-biloba']))).toEqual(['ginkgo-biloba']);
    expect(evidenceAtReferenceDose(naturebellSEA, SEA_STUDYING)).toEqual([]);
  });

  it('a row whose verdict is null (label hides the standardisation) does not count', () => {
    expect(rowVerdicts(hunterEU, 'bacopa-monnieri')).toEqual([['Bacopa', null]]);
    expect(evidenceAtReferenceDose(hunterEU, cards(['bacopa-monnieri']))).toEqual([]);
  });

  it('a row with no dosing anchor never counts: NooCube’s VitaCholine choline is not citicoline', () => {
    expect(noocubeEU.ingredientDosages.some((row) => /choline/i.test(row.name) && data.dosingAnchorFor(row) === null)).toBe(true);
    expect(evidenceAtReferenceDose(noocubeEU, cards(['citicoline']))).toEqual([]);
  });

  it('a page with no evidence ingredient ranks nothing (fails closed)', () => {
    expect(evidenceAtReferenceDose(mlpEU, cards([]))).toEqual([]);
    expect(splitListiclePicks([{ product: mlpEU, rank: 1 }], cards([])).ranked).toEqual([]);
  });

  describe('a combination card counts only when every ingredient it lists is proven', () => {
    const qualiaUS = record('productsUS', 'qualia-mind-review');
    const noocubeUS = record('productsUS', 'noocube-review');
    const mlpUS = record('productsUS', 'mind-lab-pro-review');
    const THEANINE_CAFFEINE = cards(['l-theanine', 'caffeine']);

    it('both met → counts: Qualia Mind (US) proves L-theanine 200mg and caffeine 100mg', () => {
      expect(rowVerdicts(qualiaUS, 'l-theanine')).toEqual([['L-Theanine', true]]);
      expect(rowVerdicts(qualiaUS, 'caffeine').map(([, verdict]) => verdict)).toEqual([true]);
      expect(evidenceAtReferenceDose(qualiaUS, THEANINE_CAFFEINE).sort()).toEqual(['caffeine', 'l-theanine']);
    });

    it('one met → does not count: NooCube (US) proves L-theanine 100mg but has no caffeine row', () => {
      expect(rowVerdicts(noocubeUS, 'l-theanine')).toEqual([['L-Theanine', true]]);
      expect(rowVerdicts(noocubeUS, 'caffeine')).toEqual([]);
      expect(evidenceAtReferenceDose(noocubeUS, THEANINE_CAFFEINE)).toEqual([]);
    });

    it('a single-ingredient card is unchanged: NooCube’s L-theanine alone counts on an L-theanine card', () => {
      expect(evidenceAtReferenceDose(noocubeUS, cards(['l-theanine']))).toEqual(['l-theanine']);
    });

    it('US focus: NooCube (7.0, L-theanine only) moves to "Also considered"; Mind Lab Pro ranks on citicoline', () => {
      expect(noocubeUS.score).toBeGreaterThanOrEqual(LISTICLE_MIN_SCORE);
      for (const slug of ['citicoline', 'l-tyrosine', 'alpha-gpc']) {
        expect(rowVerdicts(noocubeUS, slug).some(([, verdict]) => verdict === true), slug).toBe(false);
      }
      expect(rowVerdicts(mlpUS, 'citicoline')).toEqual([['Citicoline (Cognizin)', true]]);
      const { ranked, alsoConsidered } = splitListiclePicks(
        [{ product: mlpUS, rank: 1 }, { product: qualiaUS, rank: 2 }, { product: noocubeUS, rank: 3 }],
        US_FOCUS,
      );
      expect(ranked.map((p) => [p.product.slug, p.rank])).toEqual([['mind-lab-pro-review', 1], ['qualia-mind-review', 2]]);
      expect(alsoConsidered.map((p) => [p.product.slug, p.notRanked])).toEqual([['noocube-review', 'doseRule']]);
    });

    it('the ingredients of every counting card are returned, those of a half-met combination are not', () => {
      // Mind Lab Pro: citicoline 250mg proven; L-theanine 100mg proven but no caffeine.
      expect(rowVerdicts(mlpUS, 'l-theanine')).toEqual([['L-Theanine', true]]);
      expect(evidenceAtReferenceDose(mlpUS, US_FOCUS)).toEqual(['citicoline']);
      // Qualia Mind: only the combination card counts (its citicoline is 50mg, below).
      expect(rowVerdicts(qualiaUS, 'citicoline')).toEqual([['Cognizin (citicoline)', false]]);
      expect(evidenceAtReferenceDose(qualiaUS, US_FOCUS).sort()).toEqual(['caffeine', 'l-theanine']);
    });
  });

  it('the bar is checked first: a pick below it is "belowBar" even when it also fails rule (b)', () => {
    expect(hunterEU.score).toBeLessThan(LISTICLE_MIN_SCORE);
    const { alsoConsidered } = splitListiclePicks([{ product: hunterEU }], cards(['bacopa-monnieri']));
    expect(alsoConsidered.map((p) => p.notRanked)).toEqual(['belowBar']);
  });
});

describe('the rule text and the also-considered copy render LISTICLE_MIN_SCORE', () => {
  it('templateStrings.ts types no score (the bar is a {minScore} placeholder)', () => {
    const src = readFileSync(join(UI_SRC, 'templateStrings.ts'), 'utf8');
    expect(src).not.toMatch(/\b\d[.,]\d\s?\/\s?10\b/);
    expect(src).not.toMatch(/\b7[.,]5\b/);
  });

  it.each(LOCALES)('%s: "How we choose" states the bar from the constant', (locale) => {
    const s = getUseCaseListStrings(locale);
    expect(s.howWeChooseBody).toContain('{minScore}/10');
    const text = howWeChooseText(s);
    expect(text).toContain(`≥ ${BAR}/10`);
    expect(text).not.toContain('{');
  });

  it.each(LOCALES)('%s: section heading, intro and reason line carry the bar (and the score)', (locale) => {
    const s = getUseCaseListStrings(locale);
    expect(s.alsoConsideredHeading).toContain('{minScore}');
    expect(s.alsoConsideredIntro).toContain('{minScore}/10');
    expect(s.belowBarReason).toContain('{score}/10');
    expect(s.belowBarReason).toContain('{minScore}');
    const reason = belowBarReason(s, 6.6);
    expect(reason).toContain('6.6/10');
    expect(reason).toContain(BAR);
    expect(belowBarReason(s, 7)).toContain('7.0/10');
    expect(reason).not.toContain('{');
  });

  it('English reason line reads as specified', () => {
    expect(belowBarReason(getUseCaseListStrings('en'), 6.6)).toBe(`Scores 6.6/10 — below our ${BAR} bar`);
  });

  it.each(LOCALES)('%s: a rule (b) pick gets its own reason line, with its score and no claim that it is below the bar', (locale) => {
    const s = getUseCaseListStrings(locale);
    expect(s.doseRuleReason).toContain('{score}/10');
    const reason = doseRuleReason(s, 7);
    expect(reason).toContain('7.0/10');
    expect(reason).not.toContain('{');
    expect(reason).not.toBe(belowBarReason(s, 7));
    expect(notRankedReason(s, { product: { score: 7 }, notRanked: 'doseRule' })).toBe(reason);
    expect(notRankedReason(s, { product: { score: 6.6 }, notRanked: 'belowBar' })).toBe(belowBarReason(s, 6.6));
  });

  // Reworded 2026-10-09 when combination cards started to need every ingredient:
  // "shows none of this guide's evidence ingredients at our reference dose" was
  // false for NooCube on the focus pages, whose L-theanine (half of the
  // "L-Theanine + Caffeine" card) is at our reference dose.
  it('English rule (b) reason reads as specified', () => {
    expect(doseRuleReason(getUseCaseListStrings('en'), 7)).toBe(
      'Scores 7.0/10, but its label does not reach our reference dose for any evidence entry above (for a combination, every ingredient in it)',
    );
  });

  it.each(LOCALES)('%s: the rule (b) reason and the section intro both state the combination rule', (locale) => {
    const s = getUseCaseListStrings(locale);
    const combination = locale === 'es' ? 'en una combinación, en cada uno de sus ingredientes' : 'for a combination, every ingredient in it';
    expect(s.doseRuleReason).toContain(combination);
    expect(s.alsoConsideredRulesIntro).toContain(combination);
  });

  it.each(LOCALES)('%s: the section heading and intro name both rules once a pick is there for rule (b)', (locale) => {
    const s = getUseCaseListStrings(locale);
    const belowBarOnly = alsoConsideredText(s, [{ notRanked: 'belowBar' }]);
    expect(belowBarOnly.heading).toBe(s.alsoConsideredHeading.replace('{minScore}', BAR));
    expect(belowBarOnly.intro).toBe(s.alsoConsideredIntro.replace('{minScore}', BAR));
    const withDoseRule = alsoConsideredText(s, [{ notRanked: 'belowBar' }, { notRanked: 'doseRule' }]);
    // "below our 7.0 bar" would be false over a 7.0 pick.
    expect(withDoseRule.heading).not.toContain(BAR);
    expect(s.alsoConsideredRulesIntro).toContain('{minScore}/10');
    expect(withDoseRule.intro).toContain(`${BAR}/10`);
    expect(withDoseRule.heading + withDoseRule.intro).not.toContain('{');
  });

  it('Spanish translates every also-considered string (none falls back to English)', () => {
    const en = getUseCaseListStrings('en');
    const es = getUseCaseListStrings('es');
    for (const key of [
      'alsoConsideredHeading',
      'alsoConsideredIntro',
      'belowBarReason',
      'alsoConsideredRulesHeading',
      'alsoConsideredRulesIntro',
      'doseRuleReason',
      'alsoConsideredToc',
    ] as const) {
      expect(es[key], key).toBeTruthy();
      expect(es[key], key).not.toBe(en[key]);
    }
  });
});

describe('Listicle template wiring', () => {
  const src = readFileSync(join(UI_SRC, 'templates', 'Listicle.tsx'), 'utf8');

  it('splits the picks once, against the page’s evidence cards, and renders the rule through howWeChooseText', () => {
    expect(src).toContain('splitListiclePicks(picks, ingredientMechanism)');
    expect(src.match(/splitListiclePicks\(/g)).toHaveLength(1);
    expect(src).toContain('howWeChooseText(s)');
    expect(src).not.toContain('s.howWeChooseBody');
    // Nothing else enumerates the raw picks (cards, TOC, ItemList read `ranked`).
    expect(src).not.toMatch(/\bpicks\.(map|length|sort|filter|forEach|slice)\b|\.\.\.picks\b/);
    expect(src).toMatch(/numberOfItems:\s*ranked\.length/);
    expect(src).toMatch(/itemListElement:\s*ranked\.map/);
  });

  it('the also-considered section renders no affiliate link', () => {
    const start = src.indexOf('id="also-considered"');
    expect(start).toBeGreaterThan(-1);
    const block = src.slice(start, src.indexOf('</section>', start));
    expect(block).toContain('ProductThumb');
    expect(block).toContain('notRankedReason(s, pick)');
    expect(block).toContain('alsoConsideredCopy.heading');
    expect(block).toContain('alsoConsideredCopy.intro');
    expect(block).toContain('href={`/${pick.product.slug}/`}');
    expect(block).not.toMatch(/TrackedAffiliateLink|affiliateUrl|sponsored/);
  });
});

// ---------------------------------------------------------------------------
// Every Listicle page in every app: the ranked set never holds a pick below the
// bar or one failing rule (b). Characterization of the data on 2026-10-08
// (after the weighted-score recompute, #323): 24 of 128 picks on 20 of the 36
// listicles score below 7.5.
// 2026-10-09, after the computed dosing pillar (dosing-anchors.ts) and the
// #333/#334/#336 label rows: 88 picks on all 36 listicles at the 7.5 bar.
// 2026-10-09, bar 7.0 (site-owner decision): 37 picks on 30 listicles; every
// listicle keeps at least one ranked pick (Mind Lab Pro at 7.5 ranks on all
// 36; EU studying, JP aging and JP memory rank only Mind Lab Pro).
// 2026-10-09, rule (b) enforced (site-owner decision): 3 more picks move —
// NooCube on EU aging and EU memory, NatureBell on SEA studying — so 40 picks
// on 31 listicles; EU aging and EU memory now rank only Mind Lab Pro too.
// 2026-10-09, combination cards need every ingredient (site-owner decision):
// NooCube (L-theanine, no caffeine) moves on 13 more focus/studying/ADHD
// pages, so 53 picks on 34 listicles; EU focus, JP focus, JP studying and SEA
// studying now rank only Mind Lab Pro too (9 single-pick listicles, none at 0).
// When a score, a pick or a page changes, update the expected counts below on
// purpose, after checking that the page still reads right.
// ---------------------------------------------------------------------------

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name === 'page.tsx') out.push(p);
  }
  return out;
}

const listiclePages = readdirSync(join(REPO, 'apps'))
  .map((app) => join(REPO, 'apps', app, 'src', 'app'))
  .filter(existsSync)
  .flatMap((dir) => walk(dir))
  .filter((file) => /<Listicle\b/.test(readFileSync(file, 'utf8')))
  .sort();

/**
 * The value of a pick's `whyItsHere:` — one string literal ('…', "…" or a
 * `…` without ${}) or several joined with `+` — or a loud error for anything
 * else, so the blurb guard below never scans a half-read string.
 */
function whyItsHereOf(file: string, entry: string): string {
  const at = entry.indexOf('whyItsHere:');
  if (at < 0) throw new Error(`${file}: pick without whyItsHere "${entry.slice(0, 80)}"`);
  let i = at + 'whyItsHere:'.length;
  const parts: string[] = [];
  for (;;) {
    while (/\s/.test(entry[i] ?? '')) i++;
    const quote = entry[i];
    if (quote !== "'" && quote !== '"' && quote !== '`') throw new Error(`${file}: unparsed whyItsHere "${entry.slice(at, at + 80)}"`);
    let text = '';
    for (i++; entry[i] !== quote; i++) {
      if (i >= entry.length) throw new Error(`${file}: unterminated whyItsHere "${entry.slice(at, at + 80)}"`);
      if (quote === '`' && entry.startsWith('${', i)) throw new Error(`${file}: whyItsHere with a template expression`);
      if (entry[i] === '\\') i++;
      text += entry[i];
    }
    parts.push(text);
    i++;
    while (/\s/.test(entry[i] ?? '')) i++;
    if (entry[i] === '+') {
      i++;
      continue;
    }
    if (entry[i] !== ',' && entry[i] !== '}') throw new Error(`${file}: unexpected "${entry.slice(i, i + 40)}" after whyItsHere`);
    return parts.join('');
  }
}

function pagePicks(file: string) {
  const src = readFileSync(file, 'utf8');
  const block = src.match(/: ListiclePick\[\] = \[([\s\S]*?)\n\];/)?.[1];
  if (!block) throw new Error(`${file}: no ListiclePick[] array`);
  const entries = block.split(/\bproduct:/).slice(1);
  return entries.map((entry) => {
    const m = entry.match(/^\s*(products\w+)\.find\(\s*p\s*=>\s*p\.slug === '([^']+)'\s*\)/);
    if (!m) throw new Error(`${file}: unparsed pick "${entry.slice(0, 80)}"`);
    const [, set, slug] = m;
    const product = allSets[set]?.find((p) => p.slug === slug);
    if (!product) throw new Error(`${file}: ${set} has no product "${slug}"`);
    const rank = entry.match(/\brank:\s*(\d+)/)?.[1];
    return { product, whyItsHere: whyItsHereOf(file, entry), ...(rank ? { rank: Number(rank) } : {}) };
  });
}

/** The page's evidence cards: display name + `ingredientSlugs`, one per card, or a loud error. */
function pageEvidence(file: string): Array<{ name: string; ingredientSlugs: string[] }> {
  const src = readFileSync(file, 'utf8');
  const block = src.match(/: ListicleIngredientMechanism\[\] = \[([\s\S]*?)\n\];/)?.[1];
  if (!block) throw new Error(`${file}: no ListicleIngredientMechanism[] array`);
  const cardCount = (block.match(/^ {4}evidence:/gm) ?? []).length;
  const names = [...block.matchAll(/^ {4}name: '((?:\\.|[^'\\])*)',$/gm)].map((m) => m[1].replace(/\\'/g, "'"));
  const slugLists = [...block.matchAll(/^ {4}ingredientSlugs: \[([^\]]*)\],$/gm)].map((m) =>
    [...m[1].matchAll(/'([^']+)'/g)].map((s) => s[1]),
  );
  if (cardCount === 0 || names.length !== cardCount || slugLists.length !== cardCount) {
    throw new Error(`${file}: ${cardCount} evidence cards, ${names.length} parsed names, ${slugLists.length} ingredientSlugs lines`);
  }
  return names.map((name, i) => ({ name, ingredientSlugs: slugLists[i] }));
}

// How a card names each ingredient-library page: the dosing anchor's name regex
// (English) plus the Spanish names the LATAM cards use.
const SPANISH_CARD_NAMES: Partial<Record<string, RegExp>> = {
  phosphatidylserine: /fosfatidilserina/i,
  'l-theanine': /teanina/i,
  caffeine: /cafe[ií]na/i,
  'l-tyrosine': /tirosina/i,
  'alpha-gpc': /alfa[-\s]?gpc/i,
};
function cardNames(slug: string, name: string): boolean {
  const anchor = data.DOSING_ANCHORS.find((a) => a.ingredientSlug === slug);
  return Boolean(anchor?.match.test(name) || SPANISH_CARD_NAMES[slug]?.test(name));
}

describe('every Listicle page ranks only picks at or above the bar that pass rule (b)', () => {
  const pages = listiclePages.map((file) => ({
    rel: relative(REPO, file),
    picks: pagePicks(file),
    evidence: pageEvidence(file),
  }));

  it('finds all 36 listicle pages, their 128 picks and 148 evidence cards (guards against an empty or partial scan)', () => {
    expect(pages).toHaveLength(36);
    expect(pages.reduce((n, p) => n + p.picks.length, 0)).toBe(128);
    expect(pages.reduce((n, p) => n + p.evidence.length, 0)).toBe(148);
  });

  // The slugs restate what each card's own name says (no new claims): every
  // slug is an ingredient-library page the card names, and every library
  // page the card names is listed — both halves of a combination card.
  it.each(pages.map((p) => [p.rel, p.evidence] as const))('%s: evidence-card slugs match the card names', (_rel, evidence) => {
    const library = data.ingredients.map((i) => i.slug);
    expect(library.length).toBeGreaterThan(0);
    for (const card of evidence) {
      for (const slug of card.ingredientSlugs) expect(library, `${card.name}: ${slug}`).toContain(slug);
      const named = library.filter((slug) => cardNames(slug, card.name));
      expect([...card.ingredientSlugs].sort(), card.name).toEqual(named.sort());
    }
  });

  it.each(pages.map((p) => [p.rel, p.picks, p.evidence] as const))('%s', (_rel, picks, evidence) => {
    const { ranked, alsoConsidered } = splitListiclePicks(picks, evidence);
    expect(ranked.length + alsoConsidered.length).toBe(picks.length);
    expect(ranked.length, 'a listicle needs at least one ranked pick').toBeGreaterThan(0);
    expect(ranked.filter((p) => p.product.score < LISTICLE_MIN_SCORE)).toEqual([]);
    expect(ranked.map((p) => p.rank)).toEqual(ranked.map((_, i) => i + 1));
    // Rule (b), recomputed from the formula (expectedDosingRows), not from the
    // stored verdicts the split reads: for each ranked pick, at least one of
    // the page's evidence cards has EVERY ingredient it lists on a row that the
    // label proves at the reference dose.
    for (const p of ranked) {
      const verdicts = data.expectedDosingRows(p.product);
      const proven = new Set(
        p.product.ingredientDosages
          .filter((_, i) => verdicts[i].adequatelyDosed === true)
          .map((row) => data.dosingAnchorFor(row)?.ingredientSlug),
      );
      const met = evidence.filter((card) => card.ingredientSlugs.length > 0 && card.ingredientSlugs.every((slug) => proven.has(slug)));
      expect(met.length, `${p.product.slug} fails rule (b)`).toBeGreaterThan(0);
    }
    for (const p of alsoConsidered) {
      if (p.notRanked === 'belowBar') expect(p.product.score).toBeLessThan(LISTICLE_MIN_SCORE);
      else expect(evidenceAtReferenceDose(p.product, evidence)).toEqual([]);
    }
  });

  it('moves 53 picks (34 pages) to "Also considered": 37 below the 7.0 bar, 16 for rule (b) — 2026-10-09 data', () => {
    const moved = pages.flatMap((p) =>
      splitListiclePicks(p.picks, p.evidence).alsoConsidered.map((x) => ({ page: p.rel, slug: x.product.slug, why: x.notRanked })),
    );
    expect(moved).toHaveLength(53);
    expect(new Set(moved.map((m) => m.page)).size).toBe(34);
    const bySlug = moved
      .filter((m) => m.why === 'belowBar')
      .reduce<Record<string, number>>((acc, m) => ({ ...acc, [m.slug]: (acc[m.slug] ?? 0) + 1 }), {});
    expect(bySlug).toEqual({
      'onnit-alpha-brain-review': 15,
      'nootropics-depot-lions-mane': 8,
      'hunter-focus-review': 7,
      'suntory-dha-epa-sesamin-review': 3,
      'brainzyme-focus-pro-review': 2,
      'fancl-brains-review': 2,
    });
    expect(moved.filter((m) => m.why === 'doseRule').map((m) => [m.page, m.slug])).toEqual([
      ['apps/au/src/app/best-nootropics-for-focus/page.tsx', 'noocube-review'],
      ['apps/ca/src/app/best-nootropics-for-focus/page.tsx', 'noocube-review'],
      ['apps/eu/src/app/best-nootropics-for-aging/page.tsx', 'noocube-review'],
      ['apps/eu/src/app/best-nootropics-for-focus/page.tsx', 'noocube-review'],
      ['apps/eu/src/app/best-nootropics-for-memory/page.tsx', 'noocube-review'],
      ['apps/gcc/src/app/best-nootropics-for-focus/page.tsx', 'noocube-review'],
      ['apps/gcc/src/app/best-nootropics-for-studying/page.tsx', 'noocube-review'],
      ['apps/jp/src/app/best-nootropics-for-focus/page.tsx', 'noocube-review'],
      ['apps/jp/src/app/best-nootropics-for-studying/page.tsx', 'noocube-review'],
      ['apps/latam/src/app/best-nootropics-for-focus/page.tsx', 'noocube-review'],
      ['apps/latam/src/app/best-nootropics-for-studying/page.tsx', 'noocube-review'],
      ['apps/sea/src/app/best-nootropics-for-studying/page.tsx', 'noocube-review'],
      ['apps/sea/src/app/best-nootropics-for-studying/page.tsx', 'naturebell-ginkgo-ginseng-review'],
      ['apps/us/src/app/best-nootropics-for-adhd/page.tsx', 'noocube-review'],
      ['apps/us/src/app/best-nootropics-for-focus/page.tsx', 'noocube-review'],
      ['apps/us/src/app/natural-adderall-alternatives/page.tsx', 'noocube-review'],
    ]);
  });

  it('nine listicles rank a single pick (Mind Lab Pro) — none ranks zero', () => {
    const single = pages
      .map((p) => ({ page: p.rel, ranked: splitListiclePicks(p.picks, p.evidence).ranked }))
      .filter((p) => p.ranked.length === 1);
    expect(single.map((p) => p.page)).toEqual([
      'apps/eu/src/app/best-nootropics-for-aging/page.tsx',
      'apps/eu/src/app/best-nootropics-for-focus/page.tsx',
      'apps/eu/src/app/best-nootropics-for-memory/page.tsx',
      'apps/eu/src/app/best-nootropics-for-studying/page.tsx',
      'apps/jp/src/app/best-nootropics-for-aging/page.tsx',
      'apps/jp/src/app/best-nootropics-for-focus/page.tsx',
      'apps/jp/src/app/best-nootropics-for-memory/page.tsx',
      'apps/jp/src/app/best-nootropics-for-studying/page.tsx',
      'apps/sea/src/app/best-nootropics-for-studying/page.tsx',
    ]);
    expect(single.every((p) => p.ranked[0].product.slug === 'mind-lab-pro-review')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Guard (2026-10-09): the "Also considered" section is "not ranked or
// recommended", so the blurb (`whyItsHere`) of a pick the split puts there must
// not recommend it. The blurb is written once per pick and the split decides
// where it renders, so this runs on the split of every page: a score change
// that moves a pick fails here until its blurb reads neutrally.
// ---------------------------------------------------------------------------

/** Recommendation wording, English and Spanish (the two listicle locales). */
const RECOMMENDS: readonly RegExp[] = [
  /\bthe right (?:pick|choice|option)\b/i,
  /\bpick (?:this|it)\b/i,
  /\bbest (?:for|value|paired|pick|choice|option|bet)\b/i,
  /\bcheapest legitimate\b/i,
  /\bwe recommend\b/i,
  /\brecommended (?:for|if|pick)\b/i,
  /\bworth (?:it|buying|trying|a try|a look|considering)\b/i,
  /\b(?:good|great|solid) value\b/i,
  /\b(?:pair|combine) (?:it |this )?with\b/i,
  /\bstack (?:it|this) with\b/i,
  /(?<!\bnot )\b(?:ideal|perfect|great) (?:for|if)\b/i,
  /\buseful (?:if|when)\b/i,
  /\bstandout\b/i,
  /\bour (?:top |#\d+ )?pick\b/i,
  /\bcost-conscious\b/i,
  /\bthe leading\b/i,
  /\breasonable (?:for|choice|pick)\b/i,
  /\bsolid [\w-]+ coverage\b/i,
  /\bappeals to\b/i,
  /\boption for\b/i,
  /\bla opci[oó]n correcta\b/i,
  /\bmejor opci[oó]n\b/i,
  /\bmejor para\b/i,
  /\brecomendamos\b/i,
  /\bbuen valor\b/i,
  /\bvale la pena\b/i,
  /\bcomb[ií]n(?:alo|ala)\b/i,
  /\bcombinad[oa] con\b/i,
  /\bideal para\b/i,
  /\bm[aá]s barat[oa] leg[ií]tim[oa]\b/i,
  /\bel[ií]ge(?:lo|la)\b/i,
];
const recommendationIn = (text: string) => RECOMMENDS.filter((re) => re.test(text)).map((re) => text.match(re)?.[0]);

describe('an "Also considered" blurb does not recommend the pick', () => {
  const alsoConsidered = listiclePages.flatMap((file) => {
    const { alsoConsidered: moved } = splitListiclePicks(pagePicks(file), pageEvidence(file));
    return moved.map((p) => ({ page: relative(REPO, file), slug: p.product.slug, whyItsHere: p.whyItsHere }));
  });

  it('scans the blurb of every also-considered pick: 53 on 34 pages, none empty (guards against an empty scan)', () => {
    expect(alsoConsidered).toHaveLength(53);
    expect(new Set(alsoConsidered.map((p) => p.page)).size).toBe(34);
    for (const p of alsoConsidered) expect(p.whyItsHere.length, `${p.page} ${p.slug}`).toBeGreaterThan(40);
  });

  it.each(alsoConsidered.map((p) => [`${p.page} ${p.slug}`, p.whyItsHere] as const))('%s', (_name, whyItsHere) => {
    expect(recommendationIn(whyItsHere)).toEqual([]);
  });

  // The guard's own phrase list, proven against the wording it exists to catch
  // (the 2026-10-09 blurbs it replaced) and against neutral wording it must pass.
  it.each([
    'The right pick if you want to test Lion\'s Mane in isolation.',
    'The right choice for Canadian professionals who want energy + focus in one supplement.',
    '€85/mo and 6 capsules/day are friction; pick this only if you specifically want the broader stack.',
    'Best value for buyers who want the acute focus effect rather than long-term cognitive support.',
    'Lacks long-term memory ingredients, so best for acute study sessions rather than term-long retention.',
    'The cheapest legitimate brain supplement on this page at ~SGD $7/month.',
    '$64.99 USD per 30-serving bottle on noocube.com — worth it if the Lutemax angle matters to you.',
    'Best paired with a dedicated nootropic stack like Mind Lab Pro for users wanting both.',
    'Not a "daily nootropic" — pair with Bacopa or Mind Lab Pro for memory-stack coverage.',
    'Lutemax 2020 is the standout ingredient for screen-heavy students.',
    'Marketing-heavy positioning, but the formula is reasonable for ADHD-adjacent focus support.',
    'Lower trust score than Mind Lab Pro but solid focus-ingredient coverage.',
    'Caffeine-free Classic version is widely available — useful when you need a study supplement on short notice.',
    'At USD $64.99 per 30-serving bottle it is the most cost-conscious premium import option for students.',
    'The leading domestic Japanese option for aging adults.',
    'The budget-friendly Japanese domestic option for students.',
    'Its low price appeals to first-year university students.',
    'Ideal for long study sessions.',
    'We recommend it for beginners.',
    'La opción correcta si quieres probar Melena de León de forma aislada.',
    'No es un "nootrópico diario" — combínalo con Bacopa o Mind Lab Pro.',
    'Buen valor a $64.99 USD/mes con 60 días de garantía.',
    'Posiblemente combinada con un suplemento separado de fosfatidilserina.',
    'Es la mejor opción para estudiantes.',
    'Te recomendamos empezar con media dosis.',
  ])('flags: %s', (text) => {
    expect(recommendationIn(text).length).toBeGreaterThan(0);
  });

  it.each([
    'Single-ingredient Lion\'s Mane fruiting-body extract at 500mg, half the 1,000mg low end of our Lion\'s Mane reference dose.',
    'Stack with 100mg caffeine + 200mg L-theanine in the classic 1:2 ratio, plus 250mg citicoline and 500mg Lion\'s Mane.',
    'Pairs a 350mg Camellia sinensis (matcha) EMT blend that includes L-theanine with 330mg guarana seed.',
    'Japanese buyers sensitive to stimulants should pick a caffeine-free option above.',
    'Contains Bacopa and Huperzine A. Mainstream availability is its strongest feature for memory buyers.',
    'Contains 100mg caffeine — not ideal for stimulant-sensitive older adults.',
    'Cuesta $64.99 USD/mes, con 60 días de garantía.',
    'Aporta 500mg de Melena de León, la mitad del mínimo de 1g al día de nuestra dosis de referencia.',
  ])('passes: %s', (text) => {
    expect(recommendationIn(text)).toEqual([]);
  });
});
