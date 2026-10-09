// Fires a GA4 `affiliate_click` event when a reader clicks an affiliate CTA.
// Used by HeadToHeadPage, UseCaseListPage, and any
// future commercial template. Silently no-ops on the server and whenever GA4
// is not loaded-and-granted (before consent, after a withdraw), so it's safe
// to call unconditionally from the onClick handler. The gate is the GA
// loader's active flag, never `typeof gtag === 'function'`: a pre-consent
// call pushed into a dataLayer stub would be sent after a later Accept.

import type { Product } from '@nootropic/data';
import { vendorHost } from '@nootropic/data';
import { isAnalyticsActive } from './analytics-consent';

export interface AffiliateClickContext {
  product: Product;
  /** 1-based ranking position in the surface (listicle row, h2h winner-loser, etc.) */
  position?: number;
  /** Where the click originated — used to segment conversion data */
  surface:
    | 'listicle'
    | 'h2h'
    | 'three_way'
    | 'review'
    | 'cancellation'
    | 'best_of'
    | 'best_of_us'
    | 'best_of_eu'
    | 'best_of_ca'
    | 'best_of_au'
    | 'best_of_jp'
    | 'best_of_latam'
    | 'best_of_gcc'
    | 'best_of_sea'
    | 'best_of_state'
    | 'discover'
    | 'product_detail';
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAffiliateClick({ product, position, surface }: AffiliateClickContext): void {
  if (typeof window === 'undefined') return;
  if (!isAnalyticsActive(window) || typeof window.gtag !== 'function') return;
  // Portfolio-standard params (registered as event-scoped custom dimensions
  // via gsc-data ga4-setup.mjs) alongside the site-specific payload.
  // Malformed/missing vendor URL — the dimension stays empty for this click.
  const linkDomain = vendorHost(product) ?? '';
  window.gtag('event', 'affiliate_click', {
    partner: product.brand,
    product: product.slug,
    product_name: product.name,
    position: position ?? null,
    surface,
    affiliate_network: product.affiliateNetwork,
    score: product.score,
    affiliate_partner: product.brand,
    affiliate_status: product.affiliateNetwork ? 'live' : 'unknown',
    link_domain: linkDomain,
  });
}
