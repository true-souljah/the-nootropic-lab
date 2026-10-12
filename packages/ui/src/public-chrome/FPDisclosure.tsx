import Link from 'next/link';
import type { UIStrings } from '@nootropic/data';

export interface FPDisclosureProps {
  /** Path to the methodology page (locale-aware in i18n surfaces). */
  methodologyHref?: string;
  /**
   * Locale disclosure bundle (`uiStrings.disclosure`). When present it
   * supplies the badge, body and methodology label, so translated pages
   * never show the English defaults below.
   */
  strings?: UIStrings['disclosure'];
  /**
   * False on the review page of a product we earn no commission on
   * (`earnsCommission(product)` from @nootropic/data): the strip says so
   * instead of the commission sentence.
   */
  earnsCommission?: boolean;
  /** Override copy for translated surfaces. */
  body?: string;
  badgeLabel?: string;
  methodologyLabel?: string;
}

/**
 * FPDisclosure — FTC affiliate banner at the top of every public-facing
 * page that contains affiliate links. WCAG: the warning dot is decorative
 * and aria-hidden; the methodology link is keyboard-focusable.
 */
export function FPDisclosure({
  methodologyHref = '/methodology/',
  strings,
  earnsCommission = true,
  body = strings
    ? earnsCommission
      ? strings.inline
      : strings.noCommission
    : earnsCommission
      ? "We earn a commission when you buy through our links. Our scores are computed before commissions are checked."
      : "We don't earn a commission on this product; we have no affiliate deal for it.",
  badgeLabel = strings?.badge ?? 'Affiliate disclosure',
  methodologyLabel = strings ? `${strings.methodology} →` : 'Read our methodology →',
}: FPDisclosureProps) {
  return (
    <div
      role="note"
      className="bg-ds-card-sub border-b border-ds-border px-6 py-2 text-[14px] text-ds-muted flex justify-center items-center gap-[6px] flex-wrap"
    >
      <span className="text-ds-warn-ink font-semibold inline-flex items-center gap-[5px]">
        <span aria-hidden="true">●</span>
        {badgeLabel}
      </span>
      <span aria-hidden="true">·</span>
      <span>
        {body}{' '}
        <Link
          href={methodologyHref}
          className="text-ds-accent font-medium border-b border-ds-accent pb-[1px] hover:text-ds-accent-press focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[2px]"
        >
          {methodologyLabel}
        </Link>
      </span>
    </div>
  );
}

export default FPDisclosure;
