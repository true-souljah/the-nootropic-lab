import { purchaseLinkBlock, noPurchaseLinkIngredientList } from '@nootropic/data';
import type { NoPurchaseLink, NoPurchaseLinkStrings, Product } from '@nootropic/data';

export interface NoPurchaseLinkNoticeProps {
  product: Pick<Product, 'noPurchaseLink'>;
  /** `uiStrings.noPurchaseLink` of the page's bundle. */
  strings: NoPurchaseLinkStrings;
  /**
   * `full` (default): the reason, the Japanese line and the source link.
   * `compact`: the short label only, for slots too narrow for the full notice
   * (table cells, a ranked row's action column, a sticky bar); the review page
   * carries the full notice.
   */
  variant?: 'full' | 'compact';
  className?: string;
  id?: string;
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
}

function reasonLines(block: NoPurchaseLink, s: NoPurchaseLinkStrings): { line: string; lineJa: string } {
  switch (block.reason) {
    case 'jp-mhlw-medicine-only-ingredient':
      return {
        line: fill(s.jpMhlwReason, { ingredients: noPurchaseLinkIngredientList(block) }),
        lineJa: s.jpMhlwReasonJa,
      };
  }
}

/**
 * Rendered in place of a buy CTA when `purchaseUrl(product)` is null
 * (`Product.noPurchaseLink`). TrackedAffiliateLink renders it automatically;
 * pages that build their own CTA render it directly. Renders nothing for a
 * product without a block.
 */
export default function NoPurchaseLinkNotice({ product, strings, variant = 'full', className = '', id }: NoPurchaseLinkNoticeProps) {
  const block = purchaseLinkBlock(product);
  if (!block) return null;

  if (variant === 'compact') {
    return (
      <span
        id={id}
        lang={strings.lang}
        data-no-purchase-link={block.reason}
        className={`inline-block text-[12px] font-semibold leading-[1.35] text-ds-warn-ink ${className}`}
      >
        {strings.label}
      </span>
    );
  }

  const { line, lineJa } = reasonLines(block, strings);
  return (
    <div
      id={id}
      role="note"
      data-no-purchase-link={block.reason}
      className={`bg-ds-warn-soft border-l-4 border-ds-warn rounded-r-[8px] p-3 text-[13px] leading-[1.55] text-ds-warn-ink ${className}`}
    >
      <p className="m-0" lang={strings.lang}>
        <strong>{strings.label}:</strong> {line}
      </p>
      <p className="m-0 mt-1" lang="ja">
        {lineJa}
      </p>
      <p className="m-0 mt-1 text-[12px]" lang={strings.lang}>
        <a
          href={block.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-ds-warn-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          {strings.sourceLink}
        </a>
        {' · '}
        {fill(strings.sourceDates, { listUpdated: block.listUpdated, checkedAt: block.checkedAt })}
      </p>
    </div>
  );
}
