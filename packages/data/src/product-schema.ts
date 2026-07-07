// schema.org Product schema builder for /[slug]/page.tsx routes.
// Previously each of 8 region apps duplicated this block inline; this
// helper centralises it.
//
// We deliberately emit ONLY the first-party editorial Review (reviewRating
// derived from our own audited `product.score`). We do NOT emit an
// `aggregateRating` sourced from third-party Trustpilot data: Google's
// May 2024 review-snippet policy treats a self-hosted AggregateRating that
// reflects a third-party aggregator's score — with no corresponding
// on-page reviews — as spammy structured markup, a manual-action risk on
// YMYL supplement pages. The Trustpilot value stays in the data layer for
// on-page display; it is not surfaced as a structured rich-result claim.
// (audit OPT-2, 2026-07-07)

import type { Product } from './products-us';
import { buildPersonAuthorReference } from './authors';

const ORG_NAME = 'The Nootropic Lab';

/**
 * Build the canonical Product schema.org JSON-LD object for a product
 * review page. Emits the first-party editorial Review only (no
 * third-party aggregateRating — see file header).
 */
export function buildProductSchema(
  product: Product,
  siteUrl: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(product.score),
        bestRating: '10',
      },
      author: buildPersonAuthorReference(undefined, siteUrl),
      publisher: { '@type': 'Organization', name: ORG_NAME, url: siteUrl },
      reviewBody: product.summary,
    },
  };
}
