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

/** A score as listicle copy prints it: one decimal ("7.5", "7.0"). */
export function formatListicleScore(score: number): string {
  return score.toFixed(1);
}

interface SplittablePick {
  product: { score: number };
  rank?: number;
}

export interface ListicleSplit<T> {
  /** Picks scoring at or above LISTICLE_MIN_SCORE, in hand order, renumbered 1..n. */
  ranked: Array<T & { rank: number }>;
  /** Picks scoring below LISTICLE_MIN_SCORE, in hand order. Never ranked, never a buy CTA. */
  alsoConsidered: T[];
}

/**
 * Splits a page's hand-ordered picks at LISTICLE_MIN_SCORE. Hand order is the
 * page's `rank` (picks without one follow those with one, in array order),
 * and is kept within both groups: the bar removes picks from the
 * ranking, it never reorders the editor's list. Every pick lands in exactly
 * one group — a score that is not >= the bar (including NaN) is below it.
 */
export function splitListiclePicks<T extends SplittablePick>(picks: readonly T[]): ListicleSplit<T> {
  const handOrder = [...picks].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  const ranked: Array<T & { rank: number }> = [];
  const alsoConsidered: T[] = [];
  for (const pick of handOrder) {
    if (pick.product.score >= LISTICLE_MIN_SCORE) ranked.push({ ...pick, rank: ranked.length + 1 });
    else alsoConsidered.push(pick);
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
