// Fires a GA4 `affiliate_click` event when a reader clicks an affiliate CTA.
// Used by HeadToHeadPage, UseCaseListPage, ThreeWayComparisonPage, and any
// future commercial template. Silently no-ops on the server and when GA4
// has not loaded (e.g. before consent is granted via Klaro), so it's safe to
// call unconditionally from the onClick handler.

import type { Product } from '@nootropic/data';

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
  if (typeof window.gtag !== 'function') return;
  // Portfolio-standard params (registered as event-scoped custom dimensions
  // via gsc-data ga4-setup.mjs) alongside the site-specific payload.
  let linkDomain = '';
  try {
    linkDomain = new URL(product.affiliateUrl).host;
  } catch {
    // malformed/missing affiliate URL — dimension stays empty for this click
  }
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
