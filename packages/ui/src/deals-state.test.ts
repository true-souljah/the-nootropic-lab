import { describe, expect, it } from 'vitest';
import { ENDING_SOON_DAYS, offerState, utcToday } from './templates/dealsState';
const state = (starts: string | null, expires: string, today: string) => offerState({ starts, expires }, today);
describe('deal dates', () => {
  it('is live on its expiry day', () => expect(state(null, '2032-02-10', '2032-02-10')).toBe('ending-soon'));
  it('ends the next day', () => expect(state(null, '2032-02-10', '2032-02-11')).toBe('ended'));
  it('is upcoming before starts', () => expect(state('2032-02-11', '2032-02-20', '2032-02-10')).toBe('upcoming'));
  it('starts on its start date', () => expect(state('2032-02-10', '2032-02-20', '2032-02-10')).not.toBe('upcoming'));
  it('includes seven days', () => expect(state(null, '2032-02-17', '2032-02-10')).toBe('ending-soon'));
  it('excludes eight days', () => expect(state(null, '2032-02-18', '2032-02-10')).toBe('active'));
  it('handles leap days', () => expect(state(null, '2032-02-29', '2032-02-28')).toBe('ending-soon'));
  it('does not activate an upcoming offer in the window', () => expect(state('2032-02-11', '2032-02-12', '2032-02-10')).toBe('upcoming'));
  it('uses UTC at midnight', () => expect(utcToday(new Date('2032-02-10T00:00:00Z'))).toBe('2032-02-10'));
  it('uses UTC at day end', () => expect(utcToday(new Date('2032-02-10T23:59:59Z'))).toBe('2032-02-10'));
  it('keeps a far offer active', () => expect(state(null, '2032-03-10', '2032-02-10')).toBe('active'));
  it('uses the documented window', () => expect(ENDING_SOON_DAYS).toBe(7));
  it('ends before a later start as ended first', () => expect(state('2032-02-12', '2032-02-10', '2032-02-11')).toBe('ended'));
  it('keeps null starts active', () => expect(state(null, '2032-02-20', '2032-02-10')).toBe('active'));
});
