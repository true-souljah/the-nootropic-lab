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
  /** A record under the marked storage name: Klaro honours it as is. */
  | 'current'
  /** Only an unmarked record that grants something or cannot be read: ask again. */
  | 'legacy-ask-again'
  /** Only an unmarked record that grants nothing: carry it forward as every purpose declined. */
  | 'legacy-refusal';

function cookieValues(cookieHeader: string, name: string): string[] {
  return cookieHeader
    .split(';')
    .map((c) => c.trim())
    .filter((c) => c.startsWith(`${name}=`))
    .map((c) => c.slice(name.length + 1));
}

/** Klaro writes encodeURIComponent(JSON.stringify(consents)). */
function parseRecord(value: string): Record<string, unknown> | null {
  for (const candidate of [value, safeDecode(value)]) {
    if (candidate === null) continue;
    try {
      const parsed: unknown = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
      // not JSON in this encoding; try the next one
    }
  }
  return null;
}

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

/** True only for a readable record that lists at least one service and grants none. */
function isRefusal(value: string): boolean {
  const record = parseRecord(value);
  if (!record) return false;
  const entries = Object.values(record);
  return entries.length > 0 && entries.every((v) => v === false);
}

/** Classify the stored consent from a `document.cookie`-style header. */
export function readStoredConsent(cookieHeader: string): StoredConsentKind {
  if (cookieValues(cookieHeader, klaroConfig.storageName).length > 0) return 'current';
  const legacy = cookieValues(cookieHeader, LEGACY_CONSENT_COOKIE);
  if (legacy.length === 0) return 'none';
  return legacy.every(isRefusal) ? 'legacy-refusal' : 'legacy-ask-again';
}

/** True once the visitor has a choice that stands (a marked record, or a refusal about to be carried forward). */
export function hasStoredChoice(cookieHeader: string): boolean {
  const kind = readStoredConsent(cookieHeader);
  return kind === 'current' || kind === 'legacy-refusal';
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
  if (kind === 'legacy-ask-again') {
    expireCookies(doc, hostname, [...GA_COOKIE_PATTERNS, ...IMPACT_COOKIE_PATTERNS]);
  } else if (kind === 'legacy-refusal') {
    doc.cookie = declinedRecordCookie(now);
  }
  // A marked record always wins; any unmarked one left beside it is stale.
  if (cookieValues(doc.cookie, LEGACY_CONSENT_COOKIE).length > 0) {
    expireCookies(doc, hostname, [new RegExp(`^${LEGACY_CONSENT_COOKIE}$`)]);
  }
  return kind;
}
