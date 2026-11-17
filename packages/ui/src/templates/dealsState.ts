export const ENDING_SOON_DAYS = 7;

/** UTC calendar day, deliberately injectable for deterministic rendering and tests. */
export function utcToday(now: Date = new Date(Math.round(performance.timeOrigin + performance.now()))): string {
  return now.toISOString().slice(0, 10);
}

export function offerState(offer: { starts: string | null; expires: string }, today: string): 'upcoming' | 'active' | 'ending-soon' | 'ended' {
  if (today > offer.expires) return 'ended';
  if (offer.starts !== null && offer.starts > today) return 'upcoming';
  const days = (Date.parse(`${offer.expires}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000;
  return days <= ENDING_SOON_DAYS ? 'ending-soon' : 'active';
}
