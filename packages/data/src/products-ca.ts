import type { Product } from './products-us';
import data from './products-ca.json';
import { activeProducts } from './product-status';

/** Every CA record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsCA: Product[] = data as Product[];
/** CA records that can be recommended (discontinued products excluded). */
export const productsCA: Product[] = activeProducts(allProductsCA);
