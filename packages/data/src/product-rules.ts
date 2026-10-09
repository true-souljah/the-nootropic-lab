// Fail-closed record rules enforced by scripts/validate-data.ts.
// Pure functions so the rules themselves are unit-tested
// (packages/ui/src/product-lifecycle.test.ts).
import type { Product } from './products-us';
import { PRODUCT_FORMS } from './serving-unit';
import { dosingUnits, matchingAnchors } from './dosing-anchors';

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

export const VENDOR_TERM_FIELDS = ['shipping', 'cancellation', 'oneTimePrice', 'guarantee'] as const;

function isIsoDate(value: unknown): boolean {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/**
 * Why `vendorTerms` is malformed (one line per problem), or [] when it is
 * absent or valid. `checkedAt` must be an ISO date (YYYY-MM-DD); every term
 * present needs non-empty `text`, an absolute https `url` and a two-letter
 * `lang`, and optional `fragments` must join with " | " back to `text`; no
 * other vendorTerms keys are allowed (a typo would silently render nothing).
 */
export function vendorTermsProblems(terms: unknown): string[] {
  if (terms === undefined) return [];
  if (terms === null || typeof terms !== 'object' || Array.isArray(terms)) return ['vendorTerms is not an object'];
  const record = terms as Record<string, unknown>;
  const problems: string[] = [];
  if (!isIsoDate(record.checkedAt)) problems.push(`vendorTerms.checkedAt is not an ISO date (YYYY-MM-DD): ${JSON.stringify(record.checkedAt)}`);
  for (const key of Object.keys(record)) {
    if (key !== 'checkedAt' && !(VENDOR_TERM_FIELDS as readonly string[]).includes(key)) {
      problems.push(`vendorTerms has an unknown key "${key}" (allowed: checkedAt, ${VENDOR_TERM_FIELDS.join(', ')})`);
    }
  }
  for (const field of VENDOR_TERM_FIELDS) {
    const term = record[field];
    if (term === undefined) continue;
    if (term === null || typeof term !== 'object' || Array.isArray(term)) {
      problems.push(`vendorTerms.${field} is not an object`);
      continue;
    }
    const { text, url, lang, fragments } = term as Record<string, unknown>;
    if (typeof text !== 'string' || text.trim() === '') problems.push(`vendorTerms.${field}.text is empty`);
    if (
      fragments !== undefined &&
      (!Array.isArray(fragments) ||
        fragments.length < 2 ||
        fragments.some((f) => typeof f !== 'string' || f.trim() === '') ||
        fragments.join(' | ') !== text)
    ) {
      problems.push(`vendorTerms.${field}.fragments must be 2+ non-empty strings that join with " | " to text`);
    }
    let protocol: string | null = null;
    try {
      protocol = typeof url === 'string' ? new URL(url).protocol : null;
    } catch {
      protocol = null;
    }
    if (protocol !== 'https:') problems.push(`vendorTerms.${field}.url is not an absolute https URL: ${JSON.stringify(url)}`);
    if (typeof lang !== 'string' || !/^[a-z]{2}$/.test(lang)) problems.push(`vendorTerms.${field}.lang is not a two-letter language code: ${JSON.stringify(lang)}`);
  }
  if (problems.length === 0 && VENDOR_TERM_FIELDS.every((field) => record[field] === undefined)) {
    problems.push('vendorTerms has no terms (omit the key instead)');
  }
  return problems;
}

/**
 * Pillar weights of the overall score (operator decision 2026-10-07; the
 * review page's "How the score is computed" panel and every /methodology/
 * page render them). Single source for the UI, weightedScore and scoreProblem.
 */
export const PILLAR_WEIGHTS: Readonly<Record<keyof Product['scoreBreakdown'], number>> = {
  ingredients: 0.25,
  dosing: 0.30,
  transparency: 0.20,
  value: 0.15,
  trust: 0.10,
};

/** A pillar's weight as a whole-number percentage (dosing → 30), for copy such as "Dosing vs. clinical evidence (30%)". */
export function pillarWeightPercent(pillar: keyof Product['scoreBreakdown']): number {
  return Math.round(PILLAR_WEIGHTS[pillar] * 100);
}

/**
 * Half-up rounding to one decimal — the one rounding of every computed score
 * (weightedScore, dosingScore). Binary floats put exact .x5 values just below
 * the boundary: US Performance Lab Mind (9/10/10/8/6) sums to
 * 9.049999999999999 for 9.05. Adding Number.EPSILON does not help above 1 (it
 * is smaller than the spacing of doubles there), so the scaled value is
 * snapped to 12 significant digits — far above that noise, far below the
 * distance of any real value from a .x5 — before rounding half up.
 */
export function roundToTenth(value: number): number {
  return Math.round(Number((value * 10).toPrecision(12))) / 10;
}

/**
 * The overall score a pillar breakdown yields: the PILLAR_WEIGHTS-weighted
 * mean of the scored (non-null) pillars, renormalised over their weights —
 * with all five pillars scored that is the plain weighted sum — rounded half
 * up to one decimal. The one formula behind scoreProblem and
 * scripts/recompute-scores.ts.
 */
export function weightedScore(breakdown: Product['scoreBreakdown']): number {
  let weight = 0;
  let sum = 0;
  for (const [pillar, w] of Object.entries(PILLAR_WEIGHTS) as [keyof Product['scoreBreakdown'], number][]) {
    const value = breakdown[pillar];
    if (typeof value !== 'number') continue;
    weight += w;
    sum += w * value;
  }
  return roundToTenth(sum / weight);
}

/**
 * The dosing pillar (operator decision b → b1, 2026-10-09):
 * round1(10 × adequate units ÷ anchored units). A unit is a row whose
 * ingredient has a reference dose on the ingredient library — all rows of a
 * combined anchor (lutein + zeaxanthin) count once — and it is adequate only
 * when its verdict is `true` (dosing-anchors.ts rowVerdict); a `null` verdict
 * counts as not adequate. No anchored row → null (requires `unscoredReason`).
 * Throws on a row that matches more than one anchor.
 */
export function dosingScore(product: Pick<Product, 'ingredientDosages'> & Partial<Pick<Product, 'capsulesPerServing'>>): number | null {
  const units = dosingUnits(product);
  if (units.length === 0) return null;
  return roundToTenth((10 * units.filter((verdict) => verdict === true).length) / units.length);
}

/** Pillars that cannot be measured: dosing when no ingredient has a reference dose; value per clinical-dose ingredient. */
export const UNSCORABLE_PILLARS = ['dosing', 'value'] as const;

/**
 * Why the score data is inconsistent, or null. `scoreBreakdown.dosing` must
 * equal dosingScore(product), and every record's `score` must equal
 * weightedScore(scoreBreakdown): the PILLAR_WEIGHTS-weighted mean of its
 * pillars, rounded to one decimal (`npm run recompute-scores` writes both).
 * A pillar may be null only when it cannot be measured (UNSCORABLE_PILLARS);
 * the record must then say why (`unscoredReason`), and the mean is taken
 * over the scored pillars, renormalised over their weights.
 */
export function scoreProblem(
  product: Pick<Product, 'score' | 'scoreBreakdown' | 'unscoredReason' | 'ingredientDosages'> & Partial<Pick<Product, 'capsulesPerServing'>>,
): string | null {
  const entries = Object.entries(product.scoreBreakdown) as [string, number | null][];
  const unscored = entries.filter(([, v]) => v === null).map(([k]) => k);
  if (unscored.length > 0) {
    const notAllowed = unscored.filter((k) => !(UNSCORABLE_PILLARS as readonly string[]).includes(k));
    if (notAllowed.length > 0) return `scoreBreakdown: only ${UNSCORABLE_PILLARS.join('/')} may be null, got ${notAllowed.join(', ')}`;
    if (!product.unscoredReason?.trim()) return `scoreBreakdown: ${unscored.join(', ')} null without unscoredReason`;
  }
  const rows = Array.isArray(product.ingredientDosages) ? product.ingredientDosages : [];
  const ambiguous = rows.filter((row) => matchingAnchors(row).length > 1);
  if (ambiguous.length > 0) {
    return `scoreBreakdown: dosing cannot be computed — ${ambiguous.map((row) => `"${row.name}"`).join(', ')} match more than one dosing anchor`;
  }
  const dosing = dosingScore({ ingredientDosages: rows, capsulesPerServing: product.capsulesPerServing });
  if (product.scoreBreakdown.dosing !== dosing) {
    return `scoreBreakdown: dosing ${product.scoreBreakdown.dosing} is not the dosing formula's ${dosing} (adequate ÷ anchored ingredients, dosing-anchors.ts)`;
  }
  const expected = weightedScore(product.scoreBreakdown);
  if (product.score !== expected) {
    return `scoreBreakdown: score ${product.score} is not the weighted mean of the scored pillars (${expected})`;
  }
  return null;
}

/**
 * Halal certification bodies a `halalCertified: true` record may cite in
 * `halalBasis`. Matched as whole words. Extend deliberately when a verified
 * certificate names another body.
 */
export const HALAL_CERTIFIERS = [
  'JAKIM', 'BPJPH', 'MUI', 'MUIS', 'IFANCA', 'ESMA', 'GAC', 'CICOT', 'HCA', 'HFA', 'HMC', 'SANHA', 'HALAL India',
] as const;

/**
 * Why the halal evidence is incomplete, or null. A record with
 * `halalCertified` defined must carry `halalCheckedAt` (a real YYYY-MM-DD date)
 * and a non-empty `halalBasis`; `true` additionally requires `halalBasis` to
 * name a certifier from HALAL_CERTIFIERS. Undefined `halalCertified` is not
 * checked (no chip renders).
 */
export function halalEvidenceProblem(
  product: Pick<Product, 'halalCertified' | 'halalCheckedAt' | 'halalBasis'>,
): string | null {
  const { halalCertified, halalCheckedAt, halalBasis } = product;
  if (halalCertified === undefined) return null;
  if (typeof halalCertified !== 'boolean') return `halalCertified is not a boolean: ${JSON.stringify(halalCertified)}`;
  const checked = typeof halalCheckedAt === 'string' ? new Date(`${halalCheckedAt}T00:00:00Z`) : null;
  if (
    !checked ||
    !/^\d{4}-\d{2}-\d{2}$/.test(halalCheckedAt as string) ||
    Number.isNaN(checked.getTime()) ||
    checked.toISOString().slice(0, 10) !== halalCheckedAt
  ) {
    return `halalCheckedAt is not a YYYY-MM-DD date: ${JSON.stringify(halalCheckedAt) ?? 'undefined'}`;
  }
  if (typeof halalBasis !== 'string' || !halalBasis.trim()) return 'halalBasis is empty';
  if (halalCertified && !HALAL_CERTIFIERS.some((c) => new RegExp(`\\b${c}\\b`).test(halalBasis))) {
    return `halalBasis does not name a certifier (${HALAL_CERTIFIERS.join(', ')}) for halalCertified: true`;
  }
  return null;
}

/** All rule violations for one record. */
export function productRuleProblems(
  product: Pick<
    Product,
    'affiliateUrl' | 'ingredientDosages' | 'discontinued' | 'form' | 'score' | 'scoreBreakdown' | 'unscoredReason' | 'halalCertified' | 'halalCheckedAt' | 'halalBasis' | 'vendorTerms'
  > &
    Partial<Pick<Product, 'capsulesPerServing'>>,
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
  const halal = halalEvidenceProblem(product);
  if (halal) problems.push(halal);
  problems.push(...vendorTermsProblems(product.vendorTerms));
  return problems;
}
