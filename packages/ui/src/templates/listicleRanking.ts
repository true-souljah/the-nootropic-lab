import { dosingAnchorFor, type IngredientDosage } from '@nootropic/data';
import { tpl, type UseCaseListPageStrings } from '../templateStrings';

/**
 * The score a listicle pick must reach in the 5-pillar editorial audit to be
 * ranked. Site-owner decisions: 7.5 on 2026-10-08; 7.0 on 2026-10-09, when the
 * dosing pillar became computed from label doses (dosing-anchors.ts) and
 * scores fell by about a point overall. The "How we choose" rule text, the
 * "Also considered" copy and the ranked/also-considered split all read this
 * one constant, so the published rule and the rendered ranking cannot drift.
 * The methodology pages state the bar and its history in prose; a test pins
 * that sentence to this constant.
 */
export const LISTICLE_MIN_SCORE = 7.0;

/**
 * The colour and label tiers of a PRODUCT score, read by every surface that
 * colours or grades one: ScorePill, the review header and verdict, the
 * comparator grade filter, head-to-head and three-way scores, and BestOf's
 * "Recommended" count. Site-owner decision 2026-10-09: green "good" /
 * "Recommended" from 7.5, amber "warn" / "Worth a look" from the listicle
 * bar, red below. `warn` IS the bar, so a pick a listicle ranks is never
 * shown red. score-tiers.test.ts fails if a component types a tier number.
 */
export const SCORE_TIERS = { good: 7.5, warn: LISTICLE_MIN_SCORE } as const;

export type ScoreTier = 'good' | 'warn' | 'bad';

/** The tier of a product score. Anything not >= SCORE_TIERS.warn (including NaN) is 'bad'. */
export function scoreTier(score: number): ScoreTier {
  if (score >= SCORE_TIERS.good) return 'good';
  if (score >= SCORE_TIERS.warn) return 'warn';
  return 'bad';
}

/**
 * Design-system text colour of a product score per tier, as the review header
 * colours its score (ProductDetail). Read by every surface that prints the
 * score as plain text: the geo pages' "Score: x/10", ScoreTooltip, the
 * product cards in RegionalAvailability and IngredientDetail, and
 * ProductDetail's alternatives. score-tiers.test.ts fails on a fixed colour.
 */
export const SCORE_TIER_TEXT_CLASS: Record<ScoreTier, string> = {
  good: 'text-ds-good',
  warn: 'text-ds-warn-ink',
  bad: 'text-ds-bad',
};

/** A score as listicle copy prints it: one decimal ("7.5", "7.0"). */
export function formatListicleScore(score: number): string {
  return score.toFixed(1);
}

/**
 * The machine-readable side of one "What the evidence actually says" card: the
 * ingredient-library pages (ingredients.ts slugs) the card is about — both for
 * a combination card ("L-Theanine + Caffeine"), none when the library has no
 * page for the ingredient. Rule (b) reads these, never the card's display name.
 */
export interface ListicleEvidenceIngredients {
  ingredientSlugs: readonly string[];
}

type DosageRows = ReadonlyArray<Pick<IngredientDosage, 'name' | 'adequatelyDosed'>>;

/**
 * Rule (b) of "How we choose" — a pick doses a use-case evidence ingredient at
 * or near the clinical-trial dose — as data. An ingredient is proven when one
 * of the product's rows anchors to it (dosing-anchors.ts) with
 * `adequatelyDosed === true` (validate-data holds every verdict to
 * rowVerdict). An evidence card counts when EVERY ingredient it lists is
 * proven: a single-ingredient card needs its one ingredient, a combination
 * card ("L-Theanine + Caffeine") needs all of them (site-owner decision
 * 2026-10-09); a card listing no library page never counts. Returns the
 * ingredients of the cards that count; an empty result means the pick fails
 * rule (b) on that page.
 */
export function evidenceAtReferenceDose(
  product: { ingredientDosages: DosageRows },
  evidence: readonly ListicleEvidenceIngredients[],
): string[] {
  const proven = new Set<string>();
  for (const row of product.ingredientDosages) {
    const anchor = dosingAnchorFor(row);
    if (anchor && row.adequatelyDosed === true) proven.add(anchor.ingredientSlug);
  }
  const met = new Set<string>();
  for (const card of evidence) {
    if (card.ingredientSlugs.length > 0 && card.ingredientSlugs.every((slug) => proven.has(slug))) {
      for (const slug of card.ingredientSlugs) met.add(slug);
    }
  }
  return [...met];
}

/**
 * Why an also-considered pick is not ranked: its score is below
 * LISTICLE_MIN_SCORE ('belowBar'), or it meets the bar but fails rule (b)
 * ('doseRule', site-owner decision 2026-10-09).
 */
export type NotRankedReason = 'belowBar' | 'doseRule';

interface SplittablePick {
  product: { score: number; ingredientDosages: DosageRows };
  rank?: number;
}

export interface ListicleSplit<T> {
  /** Picks that meet LISTICLE_MIN_SCORE and rule (b), in hand order, renumbered 1..n. */
  ranked: Array<T & { rank: number }>;
  /** Every other pick, in hand order, with the reason. Never ranked, never a buy CTA. */
  alsoConsidered: Array<T & { notRanked: NotRankedReason }>;
}

/**
 * Splits a page's hand-ordered picks into ranked and "Also considered". A pick
 * is ranked only when it scores at least LISTICLE_MIN_SCORE (a score that is
 * not >= the bar, including NaN, is below it) AND its label proves at least
 * one of the page's evidence cards at our reference dose — every ingredient of
 * a combination card (rule (b), evidenceAtReferenceDose). Hand order is the
 * page's `rank` (picks without one follow those with one, in array order) and
 * is kept within both groups: the rules remove picks from the ranking, they
 * never reorder the editor's list.
 * Every pick lands in exactly one group.
 */
export function splitListiclePicks<T extends SplittablePick>(
  picks: readonly T[],
  evidence: readonly ListicleEvidenceIngredients[],
): ListicleSplit<T> {
  const handOrder = [...picks].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  const ranked: Array<T & { rank: number }> = [];
  const alsoConsidered: Array<T & { notRanked: NotRankedReason }> = [];
  for (const pick of handOrder) {
    if (!(pick.product.score >= LISTICLE_MIN_SCORE)) alsoConsidered.push({ ...pick, notRanked: 'belowBar' });
    else if (evidenceAtReferenceDose(pick.product, evidence).length === 0) alsoConsidered.push({ ...pick, notRanked: 'doseRule' });
    else ranked.push({ ...pick, rank: ranked.length + 1 });
  }
  return { ranked, alsoConsidered };
}

/** The "How we choose" rule with the bar interpolated from LISTICLE_MIN_SCORE. */
export function howWeChooseText(s: Pick<UseCaseListPageStrings, 'howWeChooseBody'>): string {
  return tpl(s.howWeChooseBody, { minScore: formatListicleScore(LISTICLE_MIN_SCORE) });
}

/** "Scores 6.6/10 — below our 7.0 bar" for one also-considered product. */
export function belowBarReason(s: Pick<UseCaseListPageStrings, 'belowBarReason'>, score: number): string {
  return tpl(s.belowBarReason, {
    score: formatListicleScore(score),
    minScore: formatListicleScore(LISTICLE_MIN_SCORE),
  });
}

/** The reason line of a pick that meets the bar but fails rule (b) (doseRuleReason in templateStrings.ts). */
export function doseRuleReason(s: Pick<UseCaseListPageStrings, 'doseRuleReason'>, score: number): string {
  return tpl(s.doseRuleReason, { score: formatListicleScore(score) });
}

/** The reason line of one also-considered pick, for the rule it fails. */
export function notRankedReason(
  s: Pick<UseCaseListPageStrings, 'belowBarReason' | 'doseRuleReason'>,
  pick: { product: { score: number }; notRanked: NotRankedReason },
): string {
  return pick.notRanked === 'doseRule' ? doseRuleReason(s, pick.product.score) : belowBarReason(s, pick.product.score);
}

/**
 * Heading and lead paragraph of the "Also considered" section: the below-bar
 * wording while every pick in it is below the bar, and wording that names
 * both rules as soon as one pick is there for rule (b) — a 7.0 pick must not
 * sit under "below our 7.0 bar".
 */
export function alsoConsideredText(
  s: Pick<
    UseCaseListPageStrings,
    'alsoConsideredHeading' | 'alsoConsideredIntro' | 'alsoConsideredRulesHeading' | 'alsoConsideredRulesIntro'
  >,
  alsoConsidered: ReadonlyArray<{ notRanked: NotRankedReason }>,
): { heading: string; intro: string } {
  const vars = { minScore: formatListicleScore(LISTICLE_MIN_SCORE) };
  const doseRule = alsoConsidered.some((pick) => pick.notRanked === 'doseRule');
  return {
    heading: tpl(doseRule ? s.alsoConsideredRulesHeading : s.alsoConsideredHeading, vars),
    intro: tpl(doseRule ? s.alsoConsideredRulesIntro : s.alsoConsideredIntro, vars),
  };
}
