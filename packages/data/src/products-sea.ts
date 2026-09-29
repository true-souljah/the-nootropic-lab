import type { Product } from './products-us';
import data from './products-sea.json';
import { activeProducts } from './product-status';

/** Every SEA record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsSEA: Product[] = data as Product[];
/** SEA records that can be recommended (discontinued products excluded). */
export const productsSEA: Product[] = activeProducts(allProductsSEA);
