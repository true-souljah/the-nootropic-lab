// schema.org Product schema builder for /[slug]/page.tsx routes.
// Previously each of 8 region apps duplicated this block inline; this
// helper centralises it and adds the conservative AggregateRating gate
// designed to avoid Google's May 2024 fake-review-schema policy
// while still emitting verifiable trust signals where they exist.

import type { Product } from './products-us';
import { buildPersonAuthorReference } from './authors';

/**
 * AggregateRating emission threshold: only emit when we have BOTH a
 * statistically meaningful review count AND a score floor that avoids
 * surfacing legitimately low-rated products. Conservative gates:
 *
 * - `trustpilotCount >= 100` — fewer than 100 reviews isn't a reliable
 *   "aggregate" by most editorial standards; below this we omit.
 * - `trustpilotScore >= 3.5` — emitting confirmed-low ratings can
 *   attract Google's fake-review-policy attention even when the data
 *   is real; we let the data layer keep the value but don't surface
 *   it as a structured rich-result claim.
 *
 * Products that fail either gate get the schema WITHOUT
 * `aggregateRating` (the Review reviewRating block is unaffected).
 */
const MIN_TRUSTPILOT_COUNT = 100;
const MIN_TRUSTPILOT_SCORE = 3.5;

const ORG_NAME = 'The Nootropic Lab';

/**
 * Build the canonical Product schema.org JSON-LD object for a product
 * review page. Includes editorial Review (always) and AggregateRating
 * (conditional on the trustpilot floor).
 */
export function buildProductSchema(
  product: Product,
  siteUrl: string,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
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

  if (
    product.trustpilotScore !== null &&
    product.trustpilotCount !== null &&
    product.trustpilotCount >= MIN_TRUSTPILOT_COUNT &&
    product.trustpilotScore >= MIN_TRUSTPILOT_SCORE
  ) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(product.trustpilotScore),
      reviewCount: String(product.trustpilotCount),
      bestRating: '5',
    };
  }

  return schema;
}
