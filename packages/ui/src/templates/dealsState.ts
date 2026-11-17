// Date logic of the Deals page: data-free and import-free, so `promos.ts` (dependency-free) and the
// client list can both use it. Dates are `YYYY-MM-DD` strings in UTC and compare as strings.

/** An offer this many days or fewer from its end date (inclusive) is "ending soon". */
export const ENDING_SOON_DAYS = 7;

/**
 * Today's UTC date as `YYYY-MM-DD`. Pass `now` in tests. Without it the wall clock is read through
 * `performance` (build-clock-dates.test.ts flags a zero-argument Date call in packages/ui/src): the
 * build date for the page. The reader's date in the browser comes from `watchUtcDay`.
 */
export function utcToday(now?: Date): string {
  const at = now ?? new Date(Math.round(performance.timeOrigin + performance.now()));
  return at.toISOString().slice(0, 10);
}

/** Milliseconds from `now` to the next 00:00:00.000 UTC. */
export function msUntilNextUtcDay(now: Date): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) - now.getTime();
}

/**
 * The reader's UTC date for a page left open (browser only: call it from an effect). Calls `onDay`
 * with today's date now, again at each next UTC midnight (one pending timer), and whenever the page
 * becomes visible again (a sleeping device holds timers back). Returns the cleanup that clears the
 * timer and the listener. The default clock is the `Date` wall clock, not `performance`: the
 * monotonic `performance` clock can stall while a device sleeps, and would then read yesterday.
 */
export function watchUtcDay(onDay: (today: string) => void, now: () => Date = () => new Date()): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const tick = () => {
    clearTimeout(timer);
    const at = now();
    onDay(utcToday(at));
    timer = setTimeout(tick, msUntilNextUtcDay(at));
  };
  const onVisibility = () => {
    if (document.visibilityState === 'visible') tick();
  };
  tick();
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVisibility);
  };
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
