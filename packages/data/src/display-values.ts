// Display helpers for nullable product fields. An unscorable pillar
// (scoreBreakdown.dosing/value) or a guarantee with no single published length
// (moneyBackDays) is null in the data; templates render it as "—", never as
// "null", "NaN" or a bare suffix ("null days", "MBG d"). Comparisons treat
// null as 0, so an unscored or unpublished value never "wins" a row.

/** Shown where a value is not scored or not published. Language-neutral. */
export const NOT_AVAILABLE = '—';

/** "7/10", or "—" for an unscored pillar. */
export function outOfTen(score: number | null): string {
  return score === null ? NOT_AVAILABLE : `${score}/10`;
}

/** A pillar value as plain text ("7"), or "—" when unscored. */
export function pillarText(score: number | null): string {
  return score === null ? NOT_AVAILABLE : String(score);
}

/** Formats a guarantee length with `format`, or "—" when the brand publishes none. */
export function guaranteeDays(days: number | null, format: (days: number) => string): string {
  return days === null ? NOT_AVAILABLE : format(days);
}
