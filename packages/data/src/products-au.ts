import type { Product } from './products-us';
import data from './products-au.json';
import { activeProducts } from './product-status';

/** Every AU record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsAU: Product[] = data as Product[];
/** AU records that can be recommended (discontinued products excluded). */
export const productsAU: Product[] = activeProducts(allProductsAU);
