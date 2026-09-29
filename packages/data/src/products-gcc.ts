import type { Product } from './products-us';
import data from './products-gcc.json';
import { activeProducts } from './product-status';

/** Every GCC record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsGCC: Product[] = data as Product[];
/** GCC records that can be recommended (discontinued products excluded). */
export const productsGCC: Product[] = activeProducts(allProductsGCC);
