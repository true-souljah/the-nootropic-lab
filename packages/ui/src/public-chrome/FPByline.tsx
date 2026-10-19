import type { UIStrings } from '@nootropic/data';
import { tpl } from '../templateStrings';

export interface FPBylineProps {
  /**
   * The page's content date as ISO YYYY-MM-DD (`isoDay(updated)`): the `<time dateTime>` value. It is the
   * day of the page's sitemap <lastmod> (`sitemapDate`), never the build date.
   */
  updated: string;
  /** The same day as the page locale writes it ("Oct 19, 2026", "19 oct 2026"), formatted in UTC: the visible text. */
  updatedDisplay: string;
  /** Estimated read time in minutes. */
  minutes: number;
  /** Page-locale byline strings (team credit, "Updated", read time, fact-check badge). */
  strings: UIStrings['byline'];
  /** The page locale's `uiStrings.typography.space` between "Updated" and the date ('' in ja, whose label ends in ：). */
  space?: string;
}

/**
 * FPByline — meta row sitting under H1 + dek on every editorial page.
 * Per Phase 5: team credit only, no named author, no medical reviewer.
 * The ✓ Fact-checked badge is the EEAT trust signal.
 */
export function FPByline({ updated, updatedDisplay, minutes, strings, space = ' ' }: FPBylineProps) {
  return (
    <div className="flex items-center gap-[14px] text-[12.5px] text-ds-muted py-[14px] border-y border-ds-border flex-wrap">
      <span className="text-ds-ink font-semibold">{strings.attribution}</span>
      <span aria-hidden="true">·</span>
      <span>
        {strings.updated}{space}<time dateTime={updated}>{updatedDisplay}</time>
      </span>
      <span aria-hidden="true">·</span>
      <span>{tpl(strings.readTime, { minutes })}</span>
      <span className="flex-1" aria-hidden="true" />
      <span className="inline-flex items-center gap-[5px] bg-ds-good-soft text-ds-good-ink px-2 py-[2px] rounded-full text-[11.5px] font-semibold">
        {strings.factChecked}
      </span>
    </div>
  );
}

export default FPByline;
