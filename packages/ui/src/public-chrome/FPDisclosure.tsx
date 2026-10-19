import Link from 'next/link';
import { AMAZON_ASSOCIATES_STATEMENT, disclosureCopy } from '@nootropic/data';
import type { DisclosureScope, UIStrings } from '@nootropic/data';

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
   * What the strip says (`DisclosureScope` from @nootropic/data):
   * - 'page' only when the page renders a buy link to a product we earn a
   *   commission on (`pageDisclosureScope(linkedProducts)`): "We earn a
   *   commission if you buy through links on this page…";
   * - 'product' on the review page of a product we earn no commission on
   *   (`reviewDisclosureScope(product)`);
   * - 'site' on every other page: a site-level line plus the ranking statement.
   * 'product' and 'site' carry the neutral badge, never "affiliate"/広告.
   */
  scope: DisclosureScope;
  /**
   * The page renders an Amazon Associates buy link
   * (`linksAmazonAssociates` over the same products as `scope`): the strip
   * adds Amazon's required statement, verbatim and in English
   * (AMAZON_ASSOCIATES_STATEMENT, lang="en"). Never on a page without one.
   */
  amazonAssociate?: boolean;
  /** Override copy for translated surfaces. */
  body?: string;
  badgeLabel?: string;
  methodologyLabel?: string;
  /** The page locale's `uiStrings.typography.space` between sentences and before the link ('' in ja). */
  space?: string;
}

// English copy for callers without a locale bundle.
const EN_FALLBACK: Record<DisclosureScope, { badge: string; body: string }> = {
  page: {
    badge: 'Affiliate disclosure',
    body: 'We earn a commission when you buy through our links. Our scores are computed before commissions are checked.',
  },
  product: {
    badge: 'Disclosure',
    body: "We don't earn a commission on this product; we have no affiliate deal for it.",
  },
  site: {
    badge: 'Disclosure',
    body: 'Some pages on this site contain affiliate links; we may earn a commission when you buy through them. Our scores and rankings follow our published methodology; commissions do not influence them.',
  },
};

function stripCopy(strings: UIStrings['disclosure'] | undefined, scope: DisclosureScope, space: string): { badge: string; body: string } {
  if (!strings) return EN_FALLBACK[scope];
  const { badge, sentence } = disclosureCopy(strings, scope);
  return { badge, body: scope === 'site' ? `${sentence}${space}${strings.ranking}` : sentence };
}

/**
 * FPDisclosure — affiliate disclosure strip at the top of public-facing
 * pages. Says "on this page" only where the page carries a commission-earning
 * buy link (FTC); elsewhere a site-level line. WCAG: the warning dot is
 * decorative and aria-hidden; the methodology link is keyboard-focusable.
 */
export function FPDisclosure({
  methodologyHref = '/methodology/',
  strings,
  scope,
  amazonAssociate = false,
  body,
  badgeLabel,
  methodologyLabel = strings ? `${strings.methodology} →` : 'Read our methodology →',
  space = ' ',
}: FPDisclosureProps) {
  const copy = stripCopy(strings, scope, space);
  return (
    <div
      role="note"
      data-disclosure-scope={scope}
      className="bg-ds-card-sub border-b border-ds-border px-6 py-2 text-[14px] text-ds-muted flex justify-center items-center gap-[6px] flex-wrap"
    >
      <span className="text-ds-warn-ink font-semibold inline-flex items-center gap-[5px]">
        <span aria-hidden="true">●</span>
        {badgeLabel ?? copy.badge}
      </span>
      <span aria-hidden="true">·</span>
      <span>
        {body ?? copy.body}{space}
        {amazonAssociate && (
          <>
            <span lang="en" data-amazon-associates-statement="">{AMAZON_ASSOCIATES_STATEMENT}</span>{space}
          </>
        )}
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
