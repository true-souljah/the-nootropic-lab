import type { Product } from './products-us';
import data from './products-eu.json';
import { activeProducts } from './product-status';

/** Every EU record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsEU: Product[] = data as Product[];
/** EU records that can be recommended (discontinued products excluded). */
export const productsEU: Product[] = activeProducts(allProductsEU);
