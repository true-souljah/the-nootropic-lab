import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { klaroConfig } from './klaro-config';
import {
  LEGACY_CONSENT_COOKIE,
  declinedRecordCookie,
  hasStoredChoice,
  migrateStoredConsent,
  readStoredConsent,
} from './consent-record';
import { hasConsentChoice } from './CookieBanner';

// Operator decision 8 + addendum (2026-10-08): a choice stored before
// Analytics and Affiliate attribution became separate purposes (PR #302) is
// not a per-purpose choice. Klaro keeps no version in its record and #302 kept
// the same cookie and JSON shape, so on origin/main a pre-split "Accept" in the
// `klaro` cookie still loaded both trackers with no banner. Every case below
// failed on origin/main (no storageName, no consent-record module).

const enc = (o: unknown) => encodeURIComponent(JSON.stringify(o));
const ACCEPT_ALL = enc({ 'google-analytics': true, 'impact-com': true });
const DECLINE_ALL = enc({ 'google-analytics': false, 'impact-com': false });

/** Minimal document.cookie: name → value; a write with Max-Age=0 / a past expiry deletes; every write is logged. */
function cookieJar(initial: Record<string, string>) {
  const jar = new Map(Object.entries(initial));
  const writes: string[] = [];
  return {
    jar,
    writes,
    get cookie() {
      return [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
    },
    set cookie(v: string) {
      writes.push(v);
      const [pair, ...attrs] = v.split(';').map((s) => s.trim());
      const eq = pair!.indexOf('=');
      const name = pair!.slice(0, eq);
      const expired = attrs.some(
        (a) => /^max-age=(0|-\d+)$/i.test(a) || (/^expires=/i.test(a) && Date.parse(a.slice(8)) < Date.now()),
      );
      if (expired) jar.delete(name);
      else jar.set(name, pair!.slice(eq + 1));
    },
  };
}

describe('Klaro stores per-purpose choices under a new storage name', () => {
  it('uses storageName, not the pre-split `klaro` cookie', () => {
    expect(klaroConfig.storageName).toBeTruthy();
    expect(klaroConfig.storageName).not.toBe(LEGACY_CONSENT_COOKIE);
    expect(klaroConfig).not.toHaveProperty('cookieName');
  });
});

describe('readStoredConsent: the one parser every reader uses', () => {
  const S = klaroConfig.storageName;
  it.each([
    ['nothing stored', '', 'none'],
    ['a marked record', `${S}=${ACCEPT_ALL}`, 'current'],
    ['a marked record beside a pre-split accept', `klaro=${ACCEPT_ALL}; ${S}=${DECLINE_ALL}`, 'current'],
    ['pre-split accept all', `klaro=${ACCEPT_ALL}`, 'legacy-ask-again'],
    ['pre-split analytics only', `klaro=${enc({ 'google-analytics': true, 'impact-com': false })}`, 'legacy-ask-again'],
    ['pre-split affiliate only', `klaro=${enc({ 'google-analytics': false, 'impact-com': true })}`, 'legacy-ask-again'],
    ['pre-Impact grant of Cloudflare only', `klaro=${enc({ 'cloudflare-insights': true, 'google-analytics': false })}`, 'legacy-ask-again'],
    ['pre-split decline all', `klaro=${DECLINE_ALL}`, 'legacy-refusal'],
    ['pre-Impact decline all', `klaro=${enc({ 'cloudflare-insights': false, 'google-analytics': false })}`, 'legacy-refusal'],
    ['unencoded JSON refusal', `klaro={"google-analytics":false,"impact-com":false}`, 'legacy-refusal'],
    ['empty record', `klaro=${enc({})}`, 'legacy-ask-again'],
    ['unreadable record', 'klaro=%E0%A4%A', 'legacy-ask-again'],
    ['a refusal and a grant under the same name', `klaro=${DECLINE_ALL}; klaro=${ACCEPT_ALL}`, 'legacy-ask-again'],
    ['an unrelated cookie with a similar name', `klaroX=${ACCEPT_ALL}; _ga=GA1.1`, 'none'],
  ])('%s → %s', (_label, header, kind) => {
    expect(readStoredConsent(header)).toBe(kind);
  });

  it('only a marked record or a pre-split refusal counts as a choice', () => {
    expect(hasStoredChoice(`${S}=${ACCEPT_ALL}`)).toBe(true);
    expect(hasStoredChoice(`klaro=${DECLINE_ALL}`)).toBe(true);
    expect(hasStoredChoice(`klaro=${ACCEPT_ALL}`)).toBe(false);
    expect(hasStoredChoice('')).toBe(false);
    // StickyCtaBar reads the same parser (it can mount before the migration runs).
    expect(hasConsentChoice(`klaro=${ACCEPT_ALL}`)).toBe(false);
    expect(hasConsentChoice(`klaro=${DECLINE_ALL}`)).toBe(true);
  });
});

describe('migrateStoredConsent (runs before Klaro reads its storage)', () => {
  const S = klaroConfig.storageName;
  const HOST = 'jp.thenootropiclab.com';
  const TRACKERS = { _ga: 'GA1.1.1', _ga_WFREESJQYP: 'GS1', IR_12345: 'x', IR_gbd: 'thenootropiclab.com' };

  it('pre-split accept: no choice, the record and every GA / Impact cookie deleted on host + parent', () => {
    const doc = cookieJar({ klaro: ACCEPT_ALL, ...TRACKERS, other: 'keep' });
    expect(migrateStoredConsent(doc, HOST)).toBe('legacy-ask-again');
    expect([...doc.jar.keys()]).toEqual(['other']);
    for (const name of ['klaro', ...Object.keys(TRACKERS)]) {
      expect(doc.writes.some((w) => w.startsWith(`${name}=;`) && w.includes('domain=.thenootropiclab.com'))).toBe(true);
      expect(doc.writes.some((w) => w.startsWith(`${name}=;`) && w.includes(`domain=${HOST}`))).toBe(true);
    }
    expect(doc.writes.some((w) => w.startsWith(`${S}=`))).toBe(false);
    expect(readStoredConsent(doc.cookie)).toBe('none');
  });

  it('pre-split refusal: carried forward as the marked record with every purpose declined', () => {
    const doc = cookieJar({ klaro: DECLINE_ALL });
    expect(migrateStoredConsent(doc, HOST, new Date('2026-10-12T00:00:00Z'))).toBe('legacy-refusal');
    expect(doc.jar.has('klaro')).toBe(false);
    const stored = JSON.parse(decodeURIComponent(doc.jar.get(S)!));
    expect(stored).toEqual(Object.fromEntries(klaroConfig.services.map((s) => [s.name, false])));
    expect(readStoredConsent(doc.cookie)).toBe('current');
  });

  it('a pre-Impact refusal also covers Affiliate attribution (no re-ask)', () => {
    const doc = cookieJar({ klaro: enc({ 'cloudflare-insights': false, 'google-analytics': false }) });
    expect(migrateStoredConsent(doc, HOST)).toBe('legacy-refusal');
    expect(JSON.parse(decodeURIComponent(doc.jar.get(S)!))).toEqual({ 'google-analytics': false, 'impact-com': false });
  });

  it('the carried refusal is kept exactly as long as Klaro keeps an accept (same cookie format)', () => {
    const now = new Date('2026-10-12T00:00:00Z');
    const cookie = declinedRecordCookie(now);
    const expires = Date.parse(cookie.match(/expires=([^;]+)/)![1]!);
    expect(expires - now.getTime()).toBe(klaroConfig.cookieExpiresAfterDays * 86_400_000);
    expect(cookie).toMatch(/; path=\/; SameSite=Lax$/);
    expect(cookie).not.toMatch(/domain=/); // host-only, like Klaro's own write
  });

  it('a marked record is honoured as is; a stale unmarked one beside it is removed', () => {
    const marked = enc({ 'google-analytics': true, 'impact-com': false });
    const doc = cookieJar({ [S]: marked, klaro: DECLINE_ALL, ...TRACKERS });
    expect(migrateStoredConsent(doc, HOST)).toBe('current');
    expect(doc.jar.get(S)).toBe(marked);
    expect(doc.jar.has('klaro')).toBe(false);
    expect(doc.jar.has('_ga')).toBe(true); // Klaro applies the marked record itself
    expect(doc.writes.some((w) => w.startsWith(`${S}=`))).toBe(false);
  });

  it('a first visit writes nothing', () => {
    const doc = cookieJar({ _ga: 'GA1.1.1' });
    expect(migrateStoredConsent(doc, HOST)).toBe('none');
    expect(doc.writes).toEqual([]);
  });

  it('is idempotent', () => {
    const doc = cookieJar({ klaro: DECLINE_ALL });
    migrateStoredConsent(doc, HOST);
    const after = doc.cookie;
    const writes = doc.writes.length;
    expect(migrateStoredConsent(doc, HOST)).toBe('current');
    expect(doc.cookie).toBe(after);
    expect(doc.writes.length).toBe(writes);
  });
});

describe('CookieBanner migrates before Klaro starts', () => {
  it('calls migrateStoredConsent before loading and setting up Klaro', () => {
    const src = readFileSync(join(__dirname, 'CookieBanner.tsx'), 'utf8');
    const effect = src.slice(src.indexOf('export default function CookieBanner'));
    const migrate = effect.indexOf('migrateStoredConsent(document, window.location.hostname)');
    expect(migrate).toBeGreaterThan(0);
    expect(effect.indexOf('await loadKlaro()')).toBeGreaterThan(migrate);
    expect(effect.indexOf('Klaro.setup(klaroConfig)')).toBeGreaterThan(migrate);
  });
});
