// Fail-closed record rules enforced by scripts/validate-data.ts.
// Pure functions so the rules themselves are unit-tested
// (packages/ui/src/product-lifecycle.test.ts).
import type { Product } from './products-us';
import { PRODUCT_FORMS } from './serving-unit';

const SEARCH_PAGE_MARKERS = ['/s?', '?q=', '&q=', '?k=', '&k='];

/**
 * Why `affiliateUrl` is not an acceptable buy link, or null when it is.
 * Rules: absolute https URL; not a search-results page (`/s?`, `?q=`, `?k=`,
 * `/search`); not a bare homepage (path longer than "/") — the homepage rule
 * is waived for discontinued products, which render no buy link.
 */
export function affiliateUrlProblem(url: unknown, discontinued = false): string | null {
  if (typeof url !== 'string') return `affiliateUrl is not a string: ${JSON.stringify(url) ?? String(url)}`;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return `affiliateUrl is not an absolute URL: "${url}"`;
  }
  if (parsed.protocol !== 'https:') return `affiliateUrl is not https: "${url}"`;
  if (SEARCH_PAGE_MARKERS.some((m) => url.includes(m)) || /\/search(\/|$)/.test(parsed.pathname)) {
    return `affiliateUrl is a search page: "${url}"`;
  }
  if (!discontinued && parsed.pathname.length <= 1) {
    return `affiliateUrl is a bare homepage (no product path): "${url}"`;
  }
  return null;
}

/** Why the formula is unusable, or null. Every record must list at least one dosed ingredient. */
export function formulaProblem(product: Pick<Product, 'ingredientDosages'>): string | null {
  const dosages = product.ingredientDosages;
  if (!Array.isArray(dosages) || dosages.length === 0) return 'ingredientDosages is empty';
  return null;
}

/** Why `form` is not an allowed dosage form, or null. Absent = capsule (allowed). */
export function formProblem(form: unknown): string | null {
  if (form === undefined) return null;
  if (typeof form === 'string' && (PRODUCT_FORMS as readonly string[]).includes(form)) return null;
  return `form is not one of ${PRODUCT_FORMS.join(' | ')}: ${JSON.stringify(form) ?? String(form)}`;
}

/**
 * Pillar weights of the overall score (operator decision 2026-10-07; the
 * review page's "How the score is computed" panel renders them). Single
 * source for the UI and for scoreProblem.
 */
export const PILLAR_WEIGHTS: Readonly<Record<keyof Product['scoreBreakdown'], number>> = {
  ingredients: 0.25,
  dosing: 0.30,
  transparency: 0.20,
  value: 0.15,
  trust: 0.10,
};

/** Pillars that cannot be measured without disclosed doses (dosing vs. clinical dose; value per clinical-dose ingredient). */
export const UNSCORABLE_PILLARS = ['dosing', 'value'] as const;

/**
 * Why the score data is inconsistent, or null. A pillar may be null only when
 * it cannot be measured (UNSCORABLE_PILLARS); the record must then say why
 * (`unscoredReason`) and `score` must be the PILLAR_WEIGHTS-weighted mean of
 * the scored pillars, renormalised over their weights and rounded to one
 * decimal. Fully scored records are not checked here.
 */
export function scoreProblem(product: Pick<Product, 'score' | 'scoreBreakdown' | 'unscoredReason'>): string | null {
  const entries = Object.entries(product.scoreBreakdown) as [string, number | null][];
  const unscored = entries.filter(([, v]) => v === null).map(([k]) => k);
  if (unscored.length === 0) return null;
  const notAllowed = unscored.filter((k) => !(UNSCORABLE_PILLARS as readonly string[]).includes(k));
  if (notAllowed.length > 0) return `scoreBreakdown: only ${UNSCORABLE_PILLARS.join('/')} may be null, got ${notAllowed.join(', ')}`;
  if (!product.unscoredReason?.trim()) return `scoreBreakdown: ${unscored.join(', ')} null without unscoredReason`;
  const scored = entries.filter((e): e is [keyof Product['scoreBreakdown'], number] => typeof e[1] === 'number');
  const weight = scored.reduce((sum, [k]) => sum + PILLAR_WEIGHTS[k], 0);
  const expected = Math.round((scored.reduce((sum, [k, v]) => sum + PILLAR_WEIGHTS[k] * v, 0) / weight) * 10) / 10;
  if (Math.abs(product.score - expected) > 0.05) {
    return `scoreBreakdown: score ${product.score} is not the weighted mean of the scored pillars (${expected})`;
  }
  return null;
}

/** All rule violations for one record. */
export function productRuleProblems(
  product: Pick<Product, 'affiliateUrl' | 'ingredientDosages' | 'discontinued' | 'form' | 'score' | 'scoreBreakdown' | 'unscoredReason'>,
): string[] {
  const problems: string[] = [];
  const url = affiliateUrlProblem(product.affiliateUrl, product.discontinued != null);
  if (url) problems.push(url);
  const formula = formulaProblem(product);
  if (formula) problems.push(formula);
  const form = formProblem(product.form);
  if (form) problems.push(form);
  const score = scoreProblem(product);
  if (score) problems.push(score);
  return problems;
}
