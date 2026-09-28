// Product lifecycle helpers.
//
// A discontinued product keeps its review page (search demand) but must not
// be recommended anywhere: best-of picks, comparison tables, home rails,
// alternatives rails, quiz/shortlist pools, regional availability lists.
// Each region module exports two lists:
//   allProducts<R>  — every record (review pages, sitemap, hreflang)
//   products<R>     — activeProducts(allProducts<R>), the recommendable set
// so every existing list builder that reads `products<R>` excludes
// discontinued records by default (fail-closed for new surfaces too).
import type { Product } from './products-us';

export function isDiscontinued(product: Pick<Product, 'discontinued'>): boolean {
  // A stray `null` in JSON must not flip a product to discontinued.
  return product.discontinued != null;
}

export function activeProducts<T extends Pick<Product, 'discontinued'>>(products: readonly T[]): T[] {
  return products.filter((p) => !isDiscontinued(p));
}
