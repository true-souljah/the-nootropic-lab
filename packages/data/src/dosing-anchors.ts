// Canonical clinical-dose anchors for product `ingredientDosages` rows.
//
// Why (2026-10-06): five product records anchored Acetyl-L-Carnitine at
// "500-2000mg" (so a 500mg dose was shown as adequately dosed) and DHA at
// "250-500mg" or "500mg", while the site's own PubMed-reviewed evidence pages
// (ingredients.ts, `howToTake.dosage`) say 1.5–3 g/day ALCAR and
// 900 mg–1.2 g DHA/day. Every row whose name matches an anchor must carry that
// anchor's `clinicalDose` string and an `adequatelyDosed` verdict derived from
// it. Enforced by scripts/validate-data.ts (no grandfather list) and unit-tested
// in packages/ui/src/dosing-anchors.test.ts, which also pins each anchor to its
// evidence page so the two cannot drift apart.
import type { Product } from './products-us';

export interface DosingAnchor {
  /** Slug of the evidence page in ingredients.ts that the anchor restates. */
  ingredientSlug: string;
  /** Matches the `ingredientDosages[].name` rows the anchor governs. */
  match: RegExp;
  /** The exact `clinicalDose` string every matching row must carry. */
  clinicalDose: string;
  /** Lower bound of the anchor: a row is adequately dosed iff its dose is at least this. */
  minMg: number;
}

export const DOSING_ANCHORS: readonly DosingAnchor[] = [
  { ingredientSlug: 'acetyl-l-carnitine', match: /carnitine|\bALCAR\b/i, clinicalDose: '1500-3000mg/day', minMg: 1500 },
  { ingredientSlug: 'dha-omega-3', match: /\bDHA\b/i, clinicalDose: '900mg-1.2g DHA/day', minMg: 900 },
];

/**
 * Milligrams from the leading number + unit of a `doseInProduct` string
 * ("500mg" → 500, "1.16g" → 1160, "2200mg blend (split undisclosed)" → 2200).
 * Any other unit (mcg, IU, …) or no leading number → null.
 */
export function doseMg(doseInProduct: string): number | null {
  const m = /^\s*(\d+(?:\.\d+)?)\s*(mg|g)\b/i.exec(doseInProduct);
  if (!m) return null;
  const value = Number(m[1]);
  return m[2].toLowerCase() === 'g' ? value * 1000 : value;
}

/**
 * One message per (row, anchor) where the row's name matches the anchor but its
 * `clinicalDose` differs from the anchor's, or its `adequatelyDosed` differs from
 * `doseMg(doseInProduct) >= minMg`, or its dose cannot be parsed. Each message
 * starts with the product slug.
 */
export function dosingAnchorProblems(product: Pick<Product, 'slug' | 'ingredientDosages'>): string[] {
  const problems: string[] = [];
  const rows = Array.isArray(product.ingredientDosages) ? product.ingredientDosages : [];
  for (const row of rows) {
    for (const anchor of DOSING_ANCHORS) {
      if (!anchor.match.test(row.name)) continue;
      const reasons: string[] = [];
      if (row.clinicalDose !== anchor.clinicalDose) {
        reasons.push(`clinicalDose "${row.clinicalDose}" is not the ${anchor.ingredientSlug} anchor "${anchor.clinicalDose}"`);
      }
      const mg = doseMg(row.doseInProduct);
      if (mg === null) {
        reasons.push(`unparseable dose "${row.doseInProduct}"`);
      } else if (row.adequatelyDosed !== mg >= anchor.minMg) {
        reasons.push(`adequatelyDosed is ${row.adequatelyDosed} but ${mg}mg is ${mg >= anchor.minMg ? 'at or above' : 'below'} the ${anchor.minMg}mg anchor minimum`);
      }
      if (reasons.length > 0) problems.push(`${product.slug}: "${row.name}" ${reasons.join('; ')}`);
    }
  }
  return problems;
}
