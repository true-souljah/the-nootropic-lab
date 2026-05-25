import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'default' | 'subdued';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children: ReactNode;
  variant?: CardVariant;
  /** Padding in px. Set 0 for cards with internally-padded sections. */
  padding?: number;
  /** Semantic element. Default `div`; use `section` when the card represents a labeled region. */
  as?: ElementType;
}

/**
 * Card — white surface with border and radius. The default surface for
 * grouped content in the new design system. No landmark role by default;
 * pass `as="section"` and `aria-labelledby` when the card behaves as a
 * discrete region.
 */
export function Card({
  children,
  variant = 'default',
  padding = 20,
  as: Component = 'div',
  className = '',
  style,
  ...rest
}: CardProps) {
  const bg = variant === 'subdued' ? 'bg-ds-card-sub' : 'bg-ds-card';
  return (
    <Component
      {...rest}
      className={`${bg} border border-ds-border rounded-[12px] ${className}`.trim()}
      style={{ padding, ...style }}
    >
      {children}
    </Component>
  );
}

export default Card;
