// The dosing formula: reference doses ("anchors") for product
// `ingredientDosages` rows and the verdict each row gets against them
// (operator decisions b → b1, 2026-10-08/09).
//
// A row is anchored when its ingredient has a reference dose on the site's own
// PubMed-reviewed ingredient library (ingredients.ts). An anchored row carries
// the anchor's exact `clinicalDose` string and the verdict rowVerdict() derives
// from what the label proves: `true` only when the label-stated daily amount
// meets the anchor's minimum on the same basis, `false` when the label proves
// it is below, `null` otherwise (a hidden blend share, a ratio or
// equivalent-weight amount, an unprinted standardisation). Every other row
// carries NO_REFERENCE_DOSE and `null`: it is listed but not scored. The dosing
// pillar is dosingScore() in product-rules.ts: adequate units ÷ anchored units.
//
// Enforced by scripts/validate-data.ts (no grandfather list), written by
// scripts/recompute-scores.ts, unit-tested in
// packages/ui/src/dosing-anchors.test.ts, which also pins each anchor to its
// evidence page so the two cannot drift apart.
//
// History (2026-10-06): five records anchored Acetyl-L-Carnitine at
// "500-2000mg" and DHA at "250-500mg"/"500mg" while the evidence pages say
// 1.5–3 g/day ALCAR and 900 mg–1.2 g DHA/day; that two-anchor check grew into
// this formula. The ALCAR anchor deliberately excludes plain L-carnitine
// ("L-Carnitine", "L-Carnitine Tartrate"): it has a different evidence base.
import type { IngredientDosage, Product } from './products-us';

/**
 * What an anchor's minimum is measured on: the compound itself, a
 * standardised extract (the standardisation must be printed), or the raw,
 * unconcentrated material (a ratio extract's weight is not comparable).
 */
export type DosingBasis = 'compound' | 'extract' | 'raw';

export interface DosingAnchor {
  /** Slug of the evidence page in ingredients.ts that the anchor restates. */
  ingredientSlug: string;
  /** Tested against the row's BASE name: the text before the first " (". */
  match: RegExp;
  /** Test `match` against the full row name instead (needed for brand-specific anchors). */
  matchFull?: boolean;
  /** The exact `clinicalDose` string every matching row must carry. */
  clinicalDose: string;
  /** Lower bound of the reference dose in mg (huperzine A 100mcg = 0.1). */
  minMg: number;
  basis: DosingBasis;
  /** Extract basis: what must be PRINTED in the row's name or dose for a `true` verdict. */
  standardisation?: RegExp;
  /** Marker compound of the extract and its minimum in mg. */
  marker?: { pattern: RegExp; minMg: number };
  /** All matching rows of one record are summed and count as ONE dosing unit. */
  combined?: boolean;
}

/** The `clinicalDose` of every row whose ingredient has no reference dose on the ingredient library. */
export const NO_REFERENCE_DOSE = 'No reference dose on file';

// Strings and minimums are fixed by the operator-approved spec (2026-10-09);
// each is pinned to its evidence page in dosing-anchors.test.ts.
export const DOSING_ANCHORS: readonly DosingAnchor[] = [
  { ingredientSlug: 'lions-mane', match: /lion'?s?\s*mane|hericium/i, clinicalDose: '1000-1800mg/day', minMg: 1000, basis: 'raw' },
  {
    ingredientSlug: 'bacopa-monnieri', match: /bacopa|brahmi/i, clinicalDose: '300-450mg/day (55% bacosides)', minMg: 300, basis: 'extract',
    standardisation: /\d+(\.\d+)?\s*%|bacosid|bacopasid|saponin/i,
    marker: { pattern: /bacosides?|bacopasides?|saponins?/i, minMg: 165 },
  },
  { ingredientSlug: 'citicoline', match: /citicolin|cdp[-\s]?cholin|cognizin/i, clinicalDose: '250-500mg/day', minMg: 250, basis: 'compound' },
  { ingredientSlug: 'l-theanine', match: /theanine/i, clinicalDose: '100-200mg/day', minMg: 100, basis: 'compound' },
  {
    ingredientSlug: 'rhodiola-rosea', match: /rhodiola/i, clinicalDose: '200-600mg/day', minMg: 200, basis: 'extract',
    standardisation: /rosavin|salidrosid|\d+(\.\d+)?\s*%/i,
  },
  { ingredientSlug: 'phosphatidylserine', match: /phosphatidyl\s?serine/i, clinicalDose: '100-300mg/day', minMg: 100, basis: 'compound' },
  { ingredientSlug: 'alpha-gpc', match: /alpha[-\s]?gpc|glycerylphosphorylcholine/i, clinicalDose: '300-600mg/day', minMg: 300, basis: 'compound' },
  {
    ingredientSlug: 'ashwagandha', match: /ashwagandha|withania/i, clinicalDose: '300-600mg/day (KSM-66)', minMg: 300, basis: 'extract',
    standardisation: /KSM-?66/i,
  },
  { ingredientSlug: 'huperzine-a', match: /huperzine/i, clinicalDose: '100-200mcg/day', minMg: 0.1, basis: 'compound' },
  { ingredientSlug: 'l-tyrosine', match: /tyrosine|\bNALT\b/i, clinicalDose: '2000mg/day (lowest positive trial)', minMg: 2000, basis: 'compound' },
  { ingredientSlug: 'caffeine', match: /caffeine/i, clinicalDose: '100-200mg', minMg: 100, basis: 'compound' },
  {
    ingredientSlug: 'ginkgo-biloba', match: /ginkgo/i, clinicalDose: '240mg/day (24/6 extract)', minMg: 240, basis: 'extract',
    standardisation: /\d+(\.\d+)?\s*%|glycosid|flavon|EGb/i,
    marker: { pattern: /flavon\w*\s+glycosides?|flavonol\w*\s+glycosides?/i, minMg: 57.6 },
  },
  { ingredientSlug: 'dha-omega-3', match: /\bDHA\b|docosahexa/i, clinicalDose: '900mg-1.2g DHA/day', minMg: 900, basis: 'compound' },
  {
    ingredientSlug: 'maritime-pine-bark', match: /pine\s*bark|pycnogenol/i, clinicalDose: '100-200mg/day', minMg: 100, basis: 'extract',
    standardisation: /proanthocyanid|pycnogenol|\d+(\.\d+)?\s*%/i,
  },
  { ingredientSlug: 'acetyl-l-carnitine', match: /acetyl[-\s]?l[-\s]?carnitine|\bALCAR\b/i, clinicalDose: '1500-3000mg/day', minMg: 1500, basis: 'compound' },
  { ingredientSlug: 'lutemax-2020', match: /lutemax|lutein|zeaxanthin/i, clinicalDose: '12-27mg/day', minMg: 12, basis: 'compound', combined: true },
  { ingredientSlug: 'oat-straw', match: /oat\s*straw|green\s*oat|avena\s*sativa|neuravena/i, clinicalDose: '430-1600mg/day', minMg: 430, basis: 'compound' },
  { ingredientSlug: 'zynamite', match: /zynamite|mango\s*leaf|mangiferin/i, clinicalDose: '140-300mg/day', minMg: 140, basis: 'compound' },
  { ingredientSlug: 'dynamine', match: /dynamine|methylliberine/i, clinicalDose: '100-150mg/day', minMg: 100, basis: 'compound' },
];

/** The row name before its first " (" — the ingredient without its form, brand or blend notes. */
export function baseName(name: string): string {
  const cut = name.indexOf(' (');
  return cut === -1 ? name : name.slice(0, cut);
}

/** Every anchor whose `match` hits the row. More than one is a data (or regex) error. */
export function matchingAnchors(row: Pick<IngredientDosage, 'name'>, anchors: readonly DosingAnchor[] = DOSING_ANCHORS): DosingAnchor[] {
  return anchors.filter((anchor) => anchor.match.test(anchor.matchFull ? row.name : baseName(row.name)));
}

/** The anchor that governs a row, or null. Throws when the row matches more than one anchor. */
export function dosingAnchorFor(row: Pick<IngredientDosage, 'name'>): DosingAnchor | null {
  const anchors = matchingAnchors(row);
  if (anchors.length > 1) {
    throw new Error(`"${row.name}" matches more than one dosing anchor (${anchors.map((a) => a.ingredientSlug).join(', ')})`);
  }
  return anchors[0] ?? null;
}

const UNIT = '(mcg|µg|μg|ug|mg|g)';
const LEADING_AMOUNT = new RegExp(`^\\s*(\\d+(?:\\.\\d+)?)\\s*${UNIT}\\b`, 'i');

function toMg(value: number, unit: string): number {
  const u = unit.toLowerCase();
  if (u === 'g') return value * 1000;
  if (u === 'mg') return value;
  return value / 1000; // mcg / µg / μg / ug
}

/**
 * Milligrams from the leading number + unit of a dose string ("500mg" → 500,
 * "1.16g" → 1160, "400mcg" → 0.4, "5µg" → 0.005, "2200mg blend (split
 * undisclosed)" → 2200). Any other unit (IU, mmol, …) or no leading number →
 * null.
 */
export function amountMg(text: string): number | null {
  const m = LEADING_AMOUNT.exec(text);
  return m ? toMg(Number(m[1]), m[2]) : null;
}

const NOT_STATED = /^\s*(not stated|undisclosed)/i;
const BLEND_BOUND = /\b(?:at most|share of)\s+(.*)$/i;
const PER_CAPSULE_OR_SERVING = /per capsule or per serving|per serving or per capsule/i;

type ServingInfo = Partial<Pick<Product, 'capsulesPerServing'>>;

/**
 * The daily amount a row's `doseInProduct` proves, as an interval [lo, hi] in mg:
 * - "Not stated…" / "Undisclosed…": [0, the amount after "at most" or "share
 *   of" (the blend total)], or [0, Infinity] when no bound is printed;
 * - a dose marked "per capsule or per serving" (either order): [x, x ×
 *   capsulesPerServing] (Infinity when the record has no serving count);
 * - otherwise the leading amount x: [x, x]; unparseable: [0, Infinity].
 */
export function doseInterval(row: Pick<IngredientDosage, 'doseInProduct'>, product: ServingInfo): [number, number] {
  const dose = row.doseInProduct;
  if (NOT_STATED.test(dose)) {
    const bound = BLEND_BOUND.exec(dose);
    const hi = bound ? amountMg(bound[1]) : null;
    return [0, hi ?? Infinity];
  }
  const x = amountMg(dose);
  if (x === null) return [0, Infinity];
  if (PER_CAPSULE_OR_SERVING.test(dose)) {
    const units = product.capsulesPerServing;
    return [x, typeof units === 'number' && units >= 1 ? x * units : Infinity];
  }
  return [x, x];
}

/** A ratio extract "N:1" with N > 1 ("8:1", "12:1"); "1:1" is not concentrated. */
function isRatioExtract(text: string): boolean {
  for (const m of text.matchAll(/(\d+(?:\.\d+)?)\s*:\s*1(?!\d)/g)) {
    if (Number(m[1]) > 1) return true;
  }
  return false;
}

/**
 * The marker amount a row prints, as an interval in mg, or null when it prints
 * none. Checked in this order: "<n><unit> <marker>" ("92mg bacopasides"), then
 * "<p>% <marker>" of a stated extract amount (marker = amount × p/100; a
 * printed range "50-55%" gives [amount × 50%, amount × 55%]), then a base
 * name that is itself the marker ("Bacopa saponins": the amount is the marker).
 */
function markerInterval(rows: readonly IngredientDosage[], pattern: RegExp, text: string, lo: number, hi: number): [number, number] | null {
  const stated = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${UNIT}\\s+(?:${pattern.source})`, 'i').exec(text);
  if (stated) {
    const mg = toMg(Number(stated[1]), stated[2]);
    return [mg, mg];
  }
  const percent = new RegExp(`(?:(\\d+(?:\\.\\d+)?)\\s*[-–]\\s*)?(\\d+(?:\\.\\d+)?)\\s*%\\s*(?:${pattern.source})`, 'i').exec(text);
  if (percent && lo > 0 && Number.isFinite(hi)) {
    const pHi = Number(percent[2]);
    const pLo = percent[1] === undefined ? pHi : Number(percent[1]);
    return [(lo * pLo) / 100, (hi * pHi) / 100];
  }
  if (rows.some((row) => pattern.test(baseName(row.name)))) return [lo, hi];
  return null;
}

/**
 * The `adequatelyDosed` verdict of an anchored row ("score dosing from what the
 * label proves"). `row` must be one of `recordRows`.
 * 1. A combined anchor sums lo and hi over all its rows in the record.
 * 2. hi < minMg → false (proven below), whatever the basis — except a ratio
 *    extract on a raw basis (the amount is concentrated) → null.
 * 3. A printed marker decides: marker ≥ marker minimum (else false; a marker
 *    range straddling it → null) AND, unless the amount is a ratio or
 *    equivalent weight, lo ≥ minMg (else null).
 * 4. An equivalent (dried-herb) weight on an extract basis → null; on a raw
 *    basis it is compared as is.
 * 5. A ratio extract on a raw basis → null; on an extract basis the ratio is
 *    ignored (an extract weight is an extract weight).
 * 6. Extract basis, lo ≥ minMg, but the standardisation is not printed in the
 *    name or dose → null.
 * 7. lo ≥ minMg → true; otherwise null (the interval straddles the minimum).
 */
export function rowVerdict(
  row: IngredientDosage,
  anchor: DosingAnchor,
  product: ServingInfo,
  recordRows: readonly IngredientDosage[],
): boolean | null {
  const rows = anchor.combined ? recordRows.filter((r) => matchingAnchors(r).includes(anchor)) : [row];
  let lo = 0;
  let hi = 0;
  for (const r of rows) {
    const [rowLo, rowHi] = doseInterval(r, product);
    lo += rowLo;
    hi += rowHi;
  }
  const text = rows.map((r) => `${r.name} ${r.doseInProduct}`).join(' ');
  const ratio = isRatioExtract(text);
  const equivalent = /equivalent/i.test(text);

  if (hi < anchor.minMg) return anchor.basis === 'raw' && ratio ? null : false;
  if (anchor.marker) {
    const marker = markerInterval(rows, anchor.marker.pattern, text, lo, hi);
    if (marker) {
      if (marker[1] < anchor.marker.minMg) return false;
      if (marker[0] < anchor.marker.minMg) return null;
      return ratio || equivalent || lo >= anchor.minMg ? true : null;
    }
  }
  if (equivalent && anchor.basis === 'extract') return null;
  if (ratio && anchor.basis === 'raw') return null;
  if (anchor.basis === 'extract' && lo >= anchor.minMg && !anchor.standardisation?.test(text)) return null;
  return lo >= anchor.minMg ? true : null;
}

type DosingRecord = Pick<Product, 'ingredientDosages'> & ServingInfo;

/**
 * The `clinicalDose` and `adequatelyDosed` the formula requires of each row,
 * in row order: the anchor's string and rowVerdict(), or NO_REFERENCE_DOSE and
 * null. Throws on a row that matches more than one anchor.
 */
export function expectedDosingRows(product: DosingRecord): Array<Pick<IngredientDosage, 'clinicalDose' | 'adequatelyDosed'>> {
  const rows = product.ingredientDosages;
  return rows.map((row) => {
    const anchor = dosingAnchorFor(row);
    return anchor
      ? { clinicalDose: anchor.clinicalDose, adequatelyDosed: rowVerdict(row, anchor, product, rows) }
      : { clinicalDose: NO_REFERENCE_DOSE, adequatelyDosed: null };
  });
}

/**
 * One verdict per dosing unit: every anchored row, except that all rows of one
 * combined anchor form a single unit with their shared verdict. Rows without a
 * reference dose are not units. Throws on a row that matches more than one anchor.
 */
export function dosingUnits(product: DosingRecord): Array<boolean | null> {
  const rows = product.ingredientDosages;
  const counted = new Set<DosingAnchor>();
  const units: Array<boolean | null> = [];
  for (const row of rows) {
    const anchor = dosingAnchorFor(row);
    if (!anchor) continue;
    if (anchor.combined) {
      if (counted.has(anchor)) continue;
      counted.add(anchor);
    }
    units.push(rowVerdict(row, anchor, product, rows));
  }
  return units;
}

/**
 * One message per row that breaks the formula: an anchored row whose
 * `clinicalDose` is not its anchor's string or whose `adequatelyDosed` is not
 * rowVerdict(); a row without a reference dose that does not carry
 * NO_REFERENCE_DOSE and null; a row matching more than one anchor. Each
 * message starts with the product slug.
 */
export function dosingAnchorProblems(product: Pick<Product, 'slug' | 'ingredientDosages'> & ServingInfo): string[] {
  const problems: string[] = [];
  const rows = Array.isArray(product.ingredientDosages) ? product.ingredientDosages : [];
  for (const row of rows) {
    const anchors = matchingAnchors(row);
    if (anchors.length > 1) {
      problems.push(
        `${product.slug}: "${row.name}" matches more than one dosing anchor (${anchors.map((a) => a.ingredientSlug).join(', ')}) — fix the row name or the anchor regex`,
      );
      continue;
    }
    const anchor = anchors[0];
    const reasons: string[] = [];
    if (anchor) {
      if (row.clinicalDose !== anchor.clinicalDose) {
        reasons.push(`clinicalDose "${row.clinicalDose}" is not the ${anchor.ingredientSlug} anchor "${anchor.clinicalDose}"`);
      }
      const verdict = rowVerdict(row, anchor, product, rows);
      if (row.adequatelyDosed !== verdict) {
        reasons.push(
          `adequatelyDosed is ${row.adequatelyDosed} but the label ("${row.doseInProduct}") gives ${verdict} against the ${anchor.minMg}mg ${anchor.ingredientSlug} minimum`,
        );
      }
    } else {
      if (row.clinicalDose !== NO_REFERENCE_DOSE) {
        reasons.push(`clinicalDose "${row.clinicalDose}" is not "${NO_REFERENCE_DOSE}" (no anchor matches the row)`);
      }
      if (row.adequatelyDosed !== null) {
        reasons.push(`adequatelyDosed is ${row.adequatelyDosed} but a row without a reference dose is null`);
      }
    }
    if (reasons.length > 0) problems.push(`${product.slug}: "${row.name}" ${reasons.join('; ')}`);
  }
  return problems;
}
