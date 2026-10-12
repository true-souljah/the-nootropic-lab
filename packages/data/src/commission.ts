// Whether the site earns a commission on a product: the one rule behind every
// "we earn a commission" sentence on a page.
//
// Records of brands we have no affiliate deal with carry `commissionRate: "0%"`
// (with `affiliateNetwork: "<Brand> Direct"` and `cookieDays: 0`). Their pages
// say we earn no commission instead of the commission sentence.
//
// A page says "we earn a commission if you buy through links on this page"
// only when it renders a buy link to a product we earn a commission on
// (DisclosureScope 'page'). Other pages carry a site-level line instead
// ('site'), and the review page of a no-commission product says so ('product').
//
// Type-only imports (plus the pure purchase-link gate): client components
// import this module, so it must not pull a catalogue JSON or the i18n
// bundles into the browser.

import type { Product } from './products-us';
import type { UIStrings } from './i18n';
import { purchaseUrl } from './purchase-link';

/**
 * Non-numeric `commissionRate` values that state there is no affiliate deal.
 * Every other non-numeric value (e.g. "Not publicly disclosed") keeps the
 * commission disclosure. commission.test.ts lists every non-numeric value in
 * the catalogues, so a new one fails until it is classified here or there.
 */
export const NO_COMMISSION_RATE_VALUES: readonly string[] = ['Retail (no direct DTC affiliate)'];

/**
 * False when we earn no commission on the product: its `commissionRate` is a
 * zero percentage ("0%") or one of NO_COMMISSION_RATE_VALUES. True for any
 * other value, including undisclosed or unparsable ones, so the page keeps
 * the commission disclosure unless the record says there is none. The whole
 * value must be a percentage: "0–15%" is not a zero rate.
 */
export function earnsCommission(product: Pick<Product, 'commissionRate'>): boolean {
  const raw = product.commissionRate.trim();
  if (NO_COMMISSION_RATE_VALUES.includes(raw)) return false;
  const pct = /^(\d+(?:\.\d+)?)\s*%$/.exec(raw);
  return pct === null || Number(pct[1]) !== 0;
}

/**
 * What a page's disclosure strip and trust note say about commissions:
 * - 'page': the page renders at least one buy link to a product we earn a
 *   commission on: `disclosure.badge` + `disclosure.inline` ("…links on this page…").
 * - 'product': the review page of a product we earn no commission on:
 *   `disclosure.neutralBadge` + `disclosure.noCommission`.
 * - 'site': no commission-earning buy link on the page:
 *   `disclosure.neutralBadge` + `disclosure.siteWide`.
 */
export type DisclosureScope = 'page' | 'product' | 'site';

// The fields purchaseUrl() reads, plus the commission rate.
type LinkedProduct = Parameters<typeof purchaseUrl>[0] & Pick<Product, 'commissionRate'>;

/**
 * Scope of a page from the products it renders a buy link for (pass exactly
 * the list the page's CTAs map over): 'page' when at least one of them has a
 * purchase link in this edition and earns us a commission, else 'site'.
 */
export function pageDisclosureScope(linkedProducts: readonly LinkedProduct[]): 'page' | 'site' {
  return linkedProducts.some((p) => purchaseUrl(p) !== null && earnsCommission(p)) ? 'page' : 'site';
}

/**
 * Scope of a product's review page. 'product' when we earn no commission on
 * it (with or without a buy link); otherwise the page's only buy link is the
 * product's own, which a discontinued product does not render.
 */
export function reviewDisclosureScope(product: LinkedProduct & Pick<Product, 'discontinued'>): DisclosureScope {
  if (!earnsCommission(product)) return 'product';
  return pageDisclosureScope(product.discontinued ? [] : [product]);
}

/** Badge and commission sentence of the locale disclosure bundle for a scope. */
export function disclosureCopy(
  d: UIStrings['disclosure'],
  scope: DisclosureScope,
): { badge: string; sentence: string } {
  if (scope === 'page') return { badge: d.badge, sentence: d.inline };
  return { badge: d.neutralBadge, sentence: scope === 'product' ? d.noCommission : d.siteWide };
}
