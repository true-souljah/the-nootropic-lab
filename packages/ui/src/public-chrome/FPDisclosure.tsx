import Link from 'next/link';

export interface FPDisclosureProps {
  /** Path to the methodology page (locale-aware in i18n surfaces). */
  methodologyHref?: string;
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
  methodologyHref = '/methodology',
  body = "We earn a commission when you buy through our links. Our scores are computed before commissions are checked.",
  badgeLabel = 'Affiliate disclosure',
  methodologyLabel = 'Read our methodology →',
}: FPDisclosureProps) {
  return (
    <div
      role="note"
      className="bg-ds-card-sub border-b border-ds-border px-6 py-2 text-[11.5px] text-ds-muted flex justify-center items-center gap-[6px] flex-wrap"
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
