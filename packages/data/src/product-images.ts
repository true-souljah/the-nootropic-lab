// Product pack-shots (site-owner decision 2026-10-07): each product's real
// vendor image replaces the letter monogram tile.
//
// product-images.json is the committed provenance record, written by
// scripts/optimize-product-images.mjs from the research manifest: for every
// product id with an image, the vendor page it came from (sourcePageUrl), the
// exact vendor image URL (imageUrl) and the fetch date. The optimised files
// live in packages/data/assets/products/<id>-{192,480}.webp and
// scripts/sync-product-images.mjs copies each region's set into
// apps/<region>/public/products/, so they are served at /products/<file>.
//
// An id without an entry renders the monogram fallback (ProductThumb). The
// set of such ids is pinned in packages/ui/src/product-images.test.ts, so a
// new product without an image is a deliberate choice.
import provenance from './product-images.json';

/** Square edge, in px, of each optimised variant. */
export const PRODUCT_IMAGE_SIZES = { sm: 192, lg: 480 } as const;
export type ProductImageVariant = keyof typeof PRODUCT_IMAGE_SIZES;

export interface ProductImageFile {
  /** Root-relative URL in every region app that sells the product. */
  src: string;
  width: number;
  height: number;
}

export interface ProductImage {
  /** 192×192 — thumbnails up to 96 CSS px at 2×. */
  sm: ProductImageFile;
  /** 480×480 — review-page hero. */
  lg: ProductImageFile;
  /** Vendor page the image was taken from. */
  sourcePageUrl: string;
  /** Vendor image URL that was downloaded. */
  imageUrl: string;
  /** ISO date the image was fetched. */
  fetchedAt: string;
}

function imageFile(id: string, variant: ProductImageVariant): ProductImageFile {
  const px = PRODUCT_IMAGE_SIZES[variant];
  return { src: `/products/${id}-${px}.webp`, width: px, height: px };
}

export const productImages: Readonly<Record<string, ProductImage>> = Object.fromEntries(
  Object.entries(provenance).map(([id, source]) => [
    id,
    { sm: imageFile(id, 'sm'), lg: imageFile(id, 'lg'), ...source },
  ]),
);

export function productImage(id: string): ProductImage | undefined {
  return Object.prototype.hasOwnProperty.call(productImages, id) ? productImages[id] : undefined;
}
