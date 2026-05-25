export interface FPBylineProps {
  /** ISO date string or human-formatted date (rendered as-is). */
  updated: string;
  /** Estimated read time (e.g. "12 min"). */
  read: string;
  /** Override for non-English surfaces. */
  attribution?: string;
  factCheckedLabel?: string;
  updatedLabel?: string;
  readSuffix?: string;
}

/**
 * FPByline — meta row sitting under H1 + dek on every editorial page.
 * Per Phase 5: team credit only, no named author, no medical reviewer.
 * The ✓ Fact-checked badge is the EEAT trust signal.
 */
export function FPByline({
  updated,
  read,
  attribution = 'By The Nootropic Lab editorial team',
  factCheckedLabel = '✓ Fact-checked',
  updatedLabel = 'Updated',
  readSuffix = 'read',
}: FPBylineProps) {
  return (
    <div className="flex items-center gap-[14px] text-[12.5px] text-ds-muted py-[14px] border-y border-ds-border flex-wrap">
      <span className="text-ds-ink font-semibold">{attribution}</span>
      <span aria-hidden="true">·</span>
      <span>
        {updatedLabel} <time dateTime={updated}>{updated}</time>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        {read} {readSuffix}
      </span>
      <span className="flex-1" aria-hidden="true" />
      <span className="inline-flex items-center gap-[5px] bg-ds-good-soft text-ds-good-ink px-2 py-[2px] rounded-full text-[11.5px] font-semibold">
        {factCheckedLabel}
      </span>
    </div>
  );
}

export default FPByline;
