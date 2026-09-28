// Fail-closed record rules enforced by scripts/validate-data.ts.
// Pure functions so the rules themselves are unit-tested
// (packages/ui/src/product-rules.test.ts).
import type { Product } from './products-us';

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

/** All rule violations for one record. */
export function productRuleProblems(
  product: Pick<Product, 'affiliateUrl' | 'ingredientDosages' | 'discontinued'>,
): string[] {
  const problems: string[] = [];
  const url = affiliateUrlProblem(product.affiliateUrl, product.discontinued != null);
  if (url) problems.push(url);
  const formula = formulaProblem(product);
  if (formula) problems.push(formula);
  return problems;
}
