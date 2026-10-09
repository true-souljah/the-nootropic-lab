// Whether the site earns a commission on a product: the one rule behind every
// "we earn a commission" sentence on a product's review page.
//
// Records of brands we have no affiliate deal with carry `commissionRate: "0%"`
// (with `affiliateNetwork: "<Brand> Direct"` and `cookieDays: 0`). Their pages
// say we earn no commission instead of the commission sentence.
//
// Type-only imports: client components import this module, so it must not
// pull a catalogue JSON or the i18n bundles into the browser.

import type { Product } from './products-us';

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
