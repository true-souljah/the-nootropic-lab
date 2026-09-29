import type { Product } from './products-us';
import data from './products-jp.json';
import { activeProducts } from './product-status';

/** Every JP record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsJP: Product[] = data as Product[];
/** JP records that can be recommended (discontinued products excluded). */
export const productsJP: Product[] = activeProducts(allProductsJP);
