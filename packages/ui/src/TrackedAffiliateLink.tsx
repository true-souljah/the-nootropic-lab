'use client';
import type { NoPurchaseLinkStrings, Product } from '@nootropic/data';
import { purchaseUrl } from '@nootropic/data';
import { trackAffiliateClick, type AffiliateClickContext } from './trackAffiliateClick';
import NoPurchaseLinkNotice from './NoPurchaseLinkNotice';

interface Props {
  product: Product;
  position?: number;
  surface: AffiliateClickContext['surface'];
  className?: string;
  children: React.ReactNode;
  /**
   * `uiStrings.noPurchaseLink` of the page's bundle. Rendered instead of the
   * link when `purchaseUrl(product)` is null (Product.noPurchaseLink).
   */
  noticeStrings: NoPurchaseLinkStrings;
  /** Notice shape when the link is suppressed: `full` (default) or `compact` for narrow slots. */
  noticeVariant?: 'full' | 'compact';
  /** Class for the notice in place of `className` (a button's classes do not suit a note). */
  noticeClassName?: string;
}

export default function TrackedAffiliateLink({
  product,
  position,
  surface,
  className,
  children,
  noticeStrings,
  noticeVariant = 'full',
  noticeClassName,
}: Props) {
  const href = purchaseUrl(product);
  if (href === null) {
    return <NoPurchaseLinkNotice product={product} strings={noticeStrings} variant={noticeVariant} className={noticeClassName} />;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => trackAffiliateClick({ product, position, surface })}
      className={className}
    >
      {children}
    </a>
  );
}
