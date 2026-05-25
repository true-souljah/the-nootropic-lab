'use client';
import type { Product } from '@nootropic/data';
import { trackAffiliateClick, type AffiliateClickContext } from './trackAffiliateClick';

interface Props {
  product: Product;
  position?: number;
  surface: AffiliateClickContext['surface'];
  className?: string;
  children: React.ReactNode;
}

export default function TrackedAffiliateLink({ product, position, surface, className, children }: Props) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => trackAffiliateClick({ product, position, surface })}
      className={className}
    >
      {children}
    </a>
  );
}
