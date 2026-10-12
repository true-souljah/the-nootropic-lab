import Link from 'next/link';
import type { UIStrings } from '@nootropic/data';

export interface FPTrustNoteProps {
  /**
   * Locale disclosure strings (`uiStrings.disclosure`). Required — no
   * English fallback, so a non-EN page can never render an English
   * disclosure under a non-EN `<html lang>`.
   */
  strings: UIStrings['disclosure'];
  /**
   * False on the review page of a product we earn no commission on
   * (`earnsCommission(product)` from @nootropic/data): the note says so
   * instead of the commission sentence; the ranking statement stays.
   */
  earnsCommission?: boolean;
  /** Path to the methodology page. */
  methodologyHref?: string;
  className?: string;
}

/**
 * FPTrustNote — inline affiliate disclosure rendered immediately above the
 * first affiliate CTA / ranked list on money pages. Complements the
 * page-top FPDisclosure strip:
 *   - FTC .com Disclosures: "as close as possible to the triggering claim";
 *   - UK ASA: plain-language commission wording, not the word "affiliate" alone;
 *   - EU UCPD Annex I 11a: says whether commission influences the ranking
 *     (mirrors the published /methodology/ policy);
 *   - one-click path to the methodology next to the verdict/ranking.
 */
export function FPTrustNote({
  strings: d,
  earnsCommission = true,
  methodologyHref = '/methodology/',
  className = '',
}: FPTrustNoteProps) {
  return (
    <p
      role="note"
      data-trust-note=""
      className={`bg-ds-card-sub border border-ds-border rounded-[8px] px-4 py-3 m-0 text-[12.5px] leading-[1.55] text-ds-muted ${className}`}
    >
      <span className="text-ds-warn-ink font-semibold">{d.badge}</span>
      <span aria-hidden="true"> · </span>
      {earnsCommission ? d.inline : d.noCommission} {d.ranking}{' '}
      <Link
        href={methodologyHref}
        className="text-ds-accent font-medium underline hover:text-ds-accent-press focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[2px]"
      >
        {d.methodology}
      </Link>
    </p>
  );
}

export default FPTrustNote;
