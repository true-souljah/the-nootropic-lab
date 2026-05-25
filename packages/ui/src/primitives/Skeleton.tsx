import type { CSSProperties } from 'react';

export interface SkeletonProps {
  /** Optional height override (px). Default depends on `variant`. */
  height?: number;
  /** Optional width override — accepts any CSS length. Defaults to 100%. */
  width?: string | number;
  /**
   * Preset shapes:
   *   `text`   — single 12px line, rounded corners.
   *   `title`  — 22px tall line for H2-ish placeholders.
   *   `box`    — generic rectangle, 100% width by default.
   *   `card`   — 220px tall card placeholder.
   *   `row`    — full-width row, 132px tall (BestOf row height).
   *   `ingr`   — ingredient-row placeholder, 88px tall.
   */
  variant?: 'text' | 'title' | 'box' | 'card' | 'row' | 'ingr';
  className?: string;
  /** Optional accessible label. Defaults to "Loading"; rendered as sr-only text. */
  label?: string;
}

const VARIANT_HEIGHT: Record<NonNullable<SkeletonProps['variant']>, number> = {
  text: 12,
  title: 22,
  box: 80,
  card: 220,
  row: 132,
  ingr: 88,
};

/**
 * Skeleton — visual loading placeholder. Shimmer animation respects
 * `prefers-reduced-motion` automatically via the global rule in
 * tokens.css. Carries a single sr-only "Loading" label per skeleton
 * group; consumers stacking several should set `aria-hidden="true"` on
 * inner duplicates and a single live region above.
 */
export function Skeleton({
  height,
  width,
  variant = 'text',
  className = '',
  label = 'Loading',
}: SkeletonProps) {
  const h = height ?? VARIANT_HEIGHT[variant];
  const style: CSSProperties = {
    height: h,
    width: typeof width === 'number' ? `${width}px` : width ?? '100%',
    backgroundImage:
      'linear-gradient(90deg, var(--color-ds-border) 0%, var(--color-ds-card-sub) 50%, var(--color-ds-border) 100%)',
    backgroundSize: '200% 100%',
    animation: 'ds-skeleton-shimmer 2s ease-in-out infinite',
    borderRadius: variant === 'text' || variant === 'title' ? 6 : 10,
  };
  return (
    <div className={className} role="status" aria-label={label} style={style}>
      <span className="ds-sr-only">{label}</span>
    </div>
  );
}

export default Skeleton;
