import type { Product } from './products-us';

/** Documented limits for the per-product review-page overrides (see `Product.seoTitle`). */
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 155;

/**
 * Rule violations for a record's `seoTitle` / `seoDescription` overrides.
 *
 * An override is hand-written snippet copy that sits outside the record's
 * reviewed fields, so it drifts when they change: the SEA Blackmores Brain
 * Active override kept calling it a "pharmacy pick at Guardian & Watsons"
 * after the product was delisted (removed by hand on 2026-09-29). Rules:
 * - each field stays within its documented length;
 * - on a discontinued record, each field says "discontinued";
 * - every number in a field (dose, price, year) also appears in the rest of
 *   the record, so a price or dose edited in the summary/cons fails the gate
 *   until the override is updated too.
 * Records without overrides have no problems.
 */
export function seoOverrideProblems(product: Product): string[] {
  const { seoTitle, seoDescription, ...rest } = product;
  const recordText = JSON.stringify(rest);
  const fields: Array<[string, string | undefined, number]> = [
    ['seoTitle', seoTitle, SEO_TITLE_MAX],
    ['seoDescription', seoDescription, SEO_DESCRIPTION_MAX],
  ];
  const problems: string[] = [];
  for (const [field, value, max] of fields) {
    if (value === undefined) continue;
    if (!value.trim()) {
      problems.push(`${product.slug}: ${field} is empty`);
      continue;
    }
    if (value.length > max) problems.push(`${product.slug}: ${field} is ${value.length} chars (max ${max})`);
    if (product.discontinued && !/discontinued/i.test(value)) {
      problems.push(`${product.slug}: ${field} must say "discontinued" (record is discontinued)`);
    }
    for (const number of value.match(/\d+(?:[.,]\d+)*/g) ?? []) {
      if (!recordText.includes(number)) {
        problems.push(`${product.slug}: ${field} quotes "${number}", which appears nowhere else in the record`);
      }
    }
  }
  return problems;
}
