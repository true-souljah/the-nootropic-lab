import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ENDING_SOON_DAYS, msUntilNextUtcDay, offerState, utcToday, watchUtcDay } from './templates/dealsState';
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
  it('crosses a month and a year boundary by UTC days', () => {
    expect(state(null, '2033-01-03', '2032-12-27')).toBe('ending-soon');
    expect(state(null, '2033-01-04', '2032-12-27')).toBe('active');
  });
  it('an upcoming offer is never active or ending soon, whatever its end date', () => {
    for (const expires of ['2032-02-12', '2032-02-18', '2032-09-01']) expect(state('2032-02-11', expires, '2032-02-10')).toBe('upcoming');
  });
  it('reads the clock without an argument and returns a UTC day', () => expect(utcToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/));
});

describe('msUntilNextUtcDay', () => {
  it('is 1 ms one millisecond before midnight', () => expect(msUntilNextUtcDay(new Date('2032-02-10T23:59:59.999Z'))).toBe(1));
  it('is a full day at midnight', () => expect(msUntilNextUtcDay(new Date('2032-02-11T00:00:00.000Z'))).toBe(86_400_000));
  it('counts to the UTC midnight across the leap day and the year end, whatever the offset', () => {
    expect(msUntilNextUtcDay(new Date('2032-02-29T12:00:00Z'))).toBe(43_200_000);
    expect(msUntilNextUtcDay(new Date('2032-12-31T18:00:00-05:00'))).toBe(3_600_000); // 23:00 UTC
  });
});

// A page left open: the reader's UTC date moves at each UTC midnight and when the page becomes
// visible again (timers are held while a device sleeps), with one pending timer, all cleared on unmount.
describe('watchUtcDay (fake timers)', () => {
  let doc: EventTarget & { visibilityState: string };
  const show = (visibility: string) => {
    doc.visibilityState = visibility;
    doc.dispatchEvent(new Event('visibilitychange'));
  };
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    doc = Object.assign(new EventTarget(), { visibilityState: 'visible' });
    vi.stubGlobal('document', doc);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('reports the date at once and the next UTC date exactly at midnight', () => {
    vi.setSystemTime(new Date('2032-02-10T23:59:59.000Z'));
    const onDay = vi.fn();
    watchUtcDay(onDay);
    expect(onDay.mock.calls).toEqual([['2032-02-10']]);
    vi.advanceTimersByTime(999);
    expect(onDay).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(onDay).toHaveBeenLastCalledWith('2032-02-11');
  });

  it('keeps exactly one pending timer across several midnights', () => {
    vi.setSystemTime(new Date('2032-02-10T12:00:00Z'));
    const onDay = vi.fn();
    watchUtcDay(onDay);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(3 * 86_400_000);
    expect(onDay.mock.calls.map(([day]) => day)).toEqual(['2032-02-10', '2032-02-11', '2032-02-12', '2032-02-13']);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('re-reads the date when the page becomes visible again after the clock moved with timers held', () => {
    vi.setSystemTime(new Date('2032-02-10T22:00:00Z'));
    const onDay = vi.fn();
    watchUtcDay(onDay);
    vi.setSystemTime(new Date('2032-02-12T08:00:00Z')); // asleep: no timer fired
    show('hidden');
    expect(onDay).toHaveBeenCalledTimes(1);
    show('visible');
    expect(onDay).toHaveBeenLastCalledWith('2032-02-12');
    expect(vi.getTimerCount()).toBe(1);
  });

  it('the cleanup clears the timer and the visibility listener', () => {
    vi.setSystemTime(new Date('2032-02-10T23:00:00Z'));
    const onDay = vi.fn();
    const stop = watchUtcDay(onDay);
    stop();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(2 * 86_400_000);
    show('visible');
    expect(onDay).toHaveBeenCalledTimes(1);
  });

  it('an offer read on its last day is ended from the next 00:00 UTC, without a reload', () => {
    vi.setSystemTime(new Date('2032-02-10T23:30:00Z'));
    let today = '';
    watchUtcDay((day) => (today = day));
    const offer = { starts: null, expires: '2032-02-10' };
    expect(offerState(offer, today)).toBe('ending-soon');
    vi.advanceTimersByTime(30 * 60_000);
    expect(offerState(offer, today)).toBe('ended');
  });
});
