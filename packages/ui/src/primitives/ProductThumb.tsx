import { productImage } from '@nootropic/data';
import type { Product } from '@nootropic/data';

export interface ProductThumbProps {
  product: Pick<Product, 'id' | 'name'>;
  /** Edge of the square tile in CSS px. */
  size: number;
  /**
   * 'sm' serves the 192px file (tiles up to 96px at 2×). 'lg' (review-page
   * hero) lets the browser choose between the 192px and 480px files for the
   * tile's rendered size and pixel density.
   */
  variant: 'sm' | 'lg';
  /** Above-the-fold image: load immediately instead of lazily. */
  eager?: boolean;
  className?: string;
  /**
   * Monogram fallback background (ids without an image). Defaults to ink;
   * callers whose tile was accent/rank-coloured pass that colour.
   */
  monogramBg?: string;
}

// Radius / monogram type per tile size, matching the inline monograms this
// primitive replaced (2026-10-07). Other sizes scale proportionally.
const TILE: Record<number, { radius: number; fontSize: number; fontWeight: number }> = {
  32: { radius: 7, fontSize: 13, fontWeight: 700 },
  36: { radius: 8, fontSize: 14, fontWeight: 800 },
  40: { radius: 10, fontSize: 16, fontWeight: 800 },
  44: { radius: 10, fontSize: 18, fontWeight: 800 },
  56: { radius: 12, fontSize: 22, fontWeight: 800 },
  64: { radius: 14, fontSize: 24, fontWeight: 800 },
  72: { radius: 16, fontSize: 28, fontWeight: 800 },
};

function tileStyle(size: number) {
  return TILE[size] ?? { radius: Math.round(size * 0.22), fontSize: Math.round(size * 0.4), fontWeight: 800 };
}

/**
 * ProductThumb — the product's vendor pack-shot on a white rounded square,
 * or the letter monogram when the product has no image (see
 * packages/data/src/product-images.ts). Explicit width/height on both paths,
 * so swapping one for the other never shifts layout.
 */
export function ProductThumb({
  product,
  size,
  variant,
  eager = false,
  className = '',
  monogramBg = 'var(--color-ds-ink)',
}: ProductThumbProps) {
  const image = productImage(product.id);
  const { radius, fontSize, fontWeight } = tileStyle(size);

  if (!image) {
    return (
      <div
        className={`grid place-items-center text-white flex-shrink-0 ${className}`}
        style={{ width: size, height: size, borderRadius: radius, background: monogramBg, fontSize, fontWeight }}
        aria-hidden="true"
      >
        {product.name[0]}
      </div>
    );
  }

  const lg = variant === 'lg';
  return (
    // Static export: next/image optimisation is unavailable, and the files are
    // pre-sized WebP — a plain <img> with explicit dimensions is the right tool.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={lg ? image.lg.src : image.sm.src}
      srcSet={lg ? `${image.sm.src} ${image.sm.width}w, ${image.lg.src} ${image.lg.width}w` : undefined}
      sizes={lg ? `${size}px` : undefined}
      width={size}
      height={size}
      alt={product.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`block flex-shrink-0 bg-ds-card border border-ds-border object-contain ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    />
  );
}

export default ProductThumb;
