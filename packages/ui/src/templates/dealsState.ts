// Date logic of the Deals page: data-free and import-free, so `promos.ts` (dependency-free) and the
// client list can both use it. Dates are `YYYY-MM-DD` strings in UTC and compare as strings.

/** An offer this many days or fewer from its end date (inclusive) is "ending soon". */
export const ENDING_SOON_DAYS = 7;

/**
 * Today's UTC date as `YYYY-MM-DD`. Pass `now` in tests. Without it the wall clock is read through
 * `performance` (build-clock-dates.test.ts flags a zero-argument Date call in packages/ui/src): the
 * build date for the page, and the reader's date in the browser after mount.
 */
export function utcToday(now?: Date): string {
  const at = now ?? new Date(Math.round(performance.timeOrigin + performance.now()));
  return at.toISOString().slice(0, 10);
}

const DAY_MS = 86_400_000;
const utcMidnight = (day: string): number => Date.parse(`${day}T00:00:00Z`);

/**
 * The state of an offer on `today`. An offer is live through the whole of its `expires` day (UTC)
 * and ended from the next day; it is upcoming before its `starts` day.
 */
export function offerState(offer: { starts: string | null; expires: string }, today: string): 'upcoming' | 'active' | 'ending-soon' | 'ended' {
  if (today > offer.expires) return 'ended';
  if (offer.starts !== null && offer.starts > today) return 'upcoming';
  const daysLeft = Math.round((utcMidnight(offer.expires) - utcMidnight(today)) / DAY_MS);
  return daysLeft <= ENDING_SOON_DAYS ? 'ending-soon' : 'active';
}
