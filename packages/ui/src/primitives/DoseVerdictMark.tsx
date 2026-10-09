/**
 * ✓ / ✗ / ? after a dose in comparison tables. `null` means the label does not
 * let the dose be checked (not stated inside a blend, or no reference dose on
 * file) — never shown as under-dosed.
 */
export function DoseVerdictMark({ adequate }: { adequate: boolean | null }) {
  if (adequate === null) {
    return <span className="text-ds-muted font-bold" aria-label="not verifiable from the label">?</span>;
  }
  return adequate
    ? <span className="text-ds-good font-bold" aria-label="adequately dosed">✓</span>
    : <span className="text-ds-bad font-bold" aria-label="underdosed">✗</span>;
}
