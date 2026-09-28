import type { Product } from './products-us';
import data from './products-latam.json';
import { activeProducts } from './product-status';

/** Every LATAM record, including discontinued ones — review pages, sitemap, hreflang. */
export const allProductsLatam: Product[] = data as Product[];
/** LATAM records that can be recommended (discontinued products excluded). */
export const productsLatam: Product[] = activeProducts(allProductsLatam);
