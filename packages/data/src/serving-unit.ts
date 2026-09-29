// Serving-unit helpers: every template that shows `capsulesPerServing` goes
// through these, so sachet / tablet / shot products never render as capsules.
// Type-only imports keep this module safe for client components.
import type { Product } from './products-us';
import type { UIStrings } from './i18n';

export type ProductForm = NonNullable<Product['form']>;

/** Allowed `Product.form` values; `'capsule'` is the default when absent. */
export const PRODUCT_FORMS: readonly ProductForm[] = ['capsule', 'tablet', 'sachet', 'shot'];

export function productForm(product: Pick<Product, 'form'>): ProductForm {
  return product.form ?? 'capsule';
}

/** Localized unit label for the product's form, e.g. "caps" / "sachets" / "錠". */
export function servingUnit(product: Pick<Product, 'form'>, strings: UIStrings): string {
  return strings.productDetail.stats.units[productForm(product)];
}

/**
 * "{count} {unit}" for one daily serving, e.g. "2 caps" / "1 sachets" / "4 錠".
 * A count of 0 (or less) is unknown, never a real serving: renders "—".
 */
export function servingAmount(product: Pick<Product, 'form' | 'capsulesPerServing'>, strings: UIStrings): string {
  if (!(product.capsulesPerServing > 0)) return '—';
  return `${product.capsulesPerServing} ${servingUnit(product, strings)}`;
}

/**
 * Fewer-units-is-better comparison is only meaningful between products of
 * the same form with known counts; otherwise comparison rows pick no winner.
 */
export function servingsComparable(products: readonly Pick<Product, 'form' | 'capsulesPerServing'>[]): boolean {
  if (products.some((p) => !(p.capsulesPerServing > 0))) return false;
  const forms = new Set(products.map(productForm));
  return forms.size === 1;
}
