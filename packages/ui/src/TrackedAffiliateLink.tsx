'use client';
import type { Product } from '@nootropic/data';
import { trackAffiliateClick } from './trackAffiliateClick';

interface Props {
  product: Product;
  position?: number;
  surface: 'listicle' | 'h2h' | 'three_way' | 'review' | 'cancellation';
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
