// The visitor's stored consent record (operator decision 8 + addendum,
// 2026-10-08).
//
// Until 2026-10-06 Analytics and Affiliate attribution were ONE purpose: a
// single "Accept" granted Google Analytics and Impact.com together. PR #302
// split them, but Klaro stores consent per service in the same cookie and the
// same JSON shape (`klaro` = {"google-analytics":true,"impact-com":true}) and
// keeps no config version, so it went on honouring those old accepts as if the
// visitor had allowed each purpose separately. Choices saved after the split
// are byte-identical, so no stored `klaro` record can be trusted as a
// per-purpose choice.
//
// Klaro's own mechanism for a fresh start is its storage name: the config now
// stores choices under `klaroConfig.storageName`, so a record under that name is
// the marked, per-purpose record. Any record still under the old `klaro` name is
// unmarked:
//   - it grants anything (or cannot be read) → no choice: the record and the GA
//     (`_ga`, `_ga_*`) and Impact (`IR_*`) cookies are deleted on the host and
//     parent domains, and Klaro shows the banner with nothing loaded;
//   - it grants nothing → the refusal covers every purpose: it is rewritten as
//     the marked record with every service declined, so no re-ask.
// Side effect the operator accepted: per-purpose choices saved between
// 2026-10-06 and this change are asked once more.
//
// A marked record Klaro cannot read is no choice either: Klaro parses it with
// an unguarded JSON.parse, so a malformed value made it throw before it
// rendered (no banner, a dead "Cookie settings" control). Such a record is
// deleted with the tracker cookies, like an unmarked grant.
//
// readStoredConsent() is the one parser every reader uses: the migration that
// runs before Klaro starts (CookieBanner) and hasConsentChoice (StickyCtaBar,
// which can mount before that migration ran).

import {
  expireCookies,
  GA_COOKIE_PATTERNS,
  IMPACT_COOKIE_PATTERNS,
  type CookieDocument,
} from './analytics-consent';
import { klaroConfig } from './klaro-config';

/** Cookie the single-purpose banner (and Klaro until this change) stored choices in. */
export const LEGACY_CONSENT_COOKIE = 'klaro';

export type StoredConsentKind =
  /** No record at all: a first visit. */
  | 'none'
  /** A readable record under the marked storage name: Klaro honours it as is. */
  | 'current'
  /** A marked record Klaro cannot read, or (with no marked record) an unmarked one that grants something or cannot be read: ask again. */
  | 'ask-again'
  /** Only an unmarked record that grants nothing: carry it forward as every purpose declined. */
  | 'legacy-refusal';

function cookieValues(cookieHeader: string, name: string): string[] {
  return cookieHeader
    .split(';')
    .map((c) => c.trim())
    .filter((c) => c.startsWith(`${name}=`))
    .map((c) => c.slice(name.length + 1));
}

/**
 * Read a record the way Klaro does (JSON.parse(decodeURIComponent(value)),
 * consent-manager.js loadConsents). Null unless it is an object of booleans
 * with at least one entry, the only shape Klaro writes.
 */
function parseRecord(value: string): Record<string, boolean> | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const entries = Object.values(parsed);
  if (entries.length === 0 || !entries.every((v) => typeof v === 'boolean')) return null;
  return parsed as Record<string, boolean>;
}

/** True only for a readable record that grants nothing. */
function isRefusal(value: string): boolean {
  const record = parseRecord(value);
  return record !== null && Object.values(record).every((v) => v === false);
}

/** Klaro treats a record as confirmed only when it lists every configured service. */
function coversEveryService(value: string): boolean {
  const record = parseRecord(value);
  return record !== null && klaroConfig.services.every((s) => typeof record[s.name] === 'boolean');
}

/** Classify the stored consent from a `document.cookie`-style header. */
export function readStoredConsent(cookieHeader: string): StoredConsentKind {
  const marked = cookieValues(cookieHeader, klaroConfig.storageName);
  if (marked.length > 0) return marked.every((v) => parseRecord(v) !== null) ? 'current' : 'ask-again';
  const legacy = cookieValues(cookieHeader, LEGACY_CONSENT_COOKIE);
  if (legacy.length === 0) return 'none';
  return legacy.every(isRefusal) ? 'legacy-refusal' : 'ask-again';
}

/**
 * True once the visitor has a choice that stands, i.e. Klaro will not show the
 * banner: a marked record listing every service, or a pre-split refusal about
 * to be carried forward.
 */
export function hasStoredChoice(cookieHeader: string): boolean {
  const kind = readStoredConsent(cookieHeader);
  if (kind === 'legacy-refusal') return true;
  return kind === 'current' && cookieValues(cookieHeader, klaroConfig.storageName).every(coversEveryService);
}

/** The marked record with every service declined, in Klaro's own cookie format. */
export function declinedRecordCookie(now: Date = new Date()): string {
  const consents = Object.fromEntries(klaroConfig.services.map((s) => [s.name, false]));
  const expires = new Date(now.getTime() + klaroConfig.cookieExpiresAfterDays * 24 * 60 * 60 * 1000);
  return `${klaroConfig.storageName}=${encodeURIComponent(JSON.stringify(consents))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Apply decision 8 to the stored record. Must run before Klaro reads its
 * storage (Klaro.setup / getManager). Idempotent: once the unmarked record is
 * gone it only reports the kind.
 */
export function migrateStoredConsent(doc: CookieDocument, hostname: string, now: Date = new Date()): StoredConsentKind {
  const kind = readStoredConsent(doc.cookie);
  if (kind === 'none') return kind;
  if (kind === 'ask-again') {
    // An unreadable marked record goes too, so Klaro starts with no choice.
    expireCookies(doc, hostname, [
      ...GA_COOKIE_PATTERNS,
      ...IMPACT_COOKIE_PATTERNS,
      new RegExp(`^${klaroConfig.storageName}$`),
    ]);
  } else if (kind === 'legacy-refusal') {
    doc.cookie = declinedRecordCookie(now);
  }
  // Any unmarked record still here is stale: a marked record (readable or not)
  // supersedes it, and an ask-again or a carried refusal has replaced it.
  if (cookieValues(doc.cookie, LEGACY_CONSENT_COOKIE).length > 0) {
    expireCookies(doc, hostname, [new RegExp(`^${LEGACY_CONSENT_COOKIE}$`)]);
  }
  return kind;
}
