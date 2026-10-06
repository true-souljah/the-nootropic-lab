// Triple-slash reference to the local Klaro type shim. Klaro ships no
// .d.ts; the shim in `./klaro.d.ts` declares the minimal `setup` shape
// we consume. This reference pulls the `declare module` block into the
// type-resolution context for the dynamic import below — important
// because consuming apps' tsconfig doesn't auto-discover .d.ts files
// inside packages/ui without explicit help.
/// <reference path="./klaro.d.ts" />
'use client';
import { useEffect } from 'react';
import 'klaro/dist/klaro.css';
import './styles/klaro-overrides.css';
import { klaroConfig } from './klaro-config';
import { applyActiveLangToKlaroConfig } from './klaro-lang';
import { needsReloadAfterWithdrawal } from './analytics-consent';

interface KlaroManager {
  /** Klaro sets this once a choice is stored; its UI hides Accept all / Decline all while true. */
  confirmed: boolean;
  watch: (watcher: {
    update: (manager: KlaroManager, name: string, data?: { changes?: Record<string, boolean> }) => void;
  }) => void;
}

interface KlaroModule {
  setup: (config: unknown) => void;
  show: (config?: unknown, modal?: boolean) => void;
  getManager: (config?: unknown) => KlaroManager;
}

/** Fired on `window` whenever the visitor saves a consent choice (accept, decline or save). */
export const CONSENT_CHOICE_EVENT = 'nootropic:consent-choice';

/** Name of Klaro's consent cookie (`klaroConfig.cookieName`). */
const KLARO_COOKIE = klaroConfig.cookieName;

/** True once the visitor has made a consent choice (Klaro's cookie exists). */
export function hasConsentChoice(cookieHeader: string): boolean {
  return cookieHeader.split(';').some((c) => c.trim().startsWith(`${KLARO_COOKIE}=`));
}

// Klaro ships no .d.ts; cast the dynamic import once at the boundary.
// PR-Q14 (#78) removed `/* webpackIgnore: true */` which was telling
// the bundler to leave the import path as a literal at build time.
// In a Next.js static export, `klaro/dist/klaro-no-translations`
// isn't a resolvable HTTP route, so Klaro never actually mounted —
// `<div id="klaro">` stayed empty on every page across every region.
// Removing the directive lets turbopack/webpack bundle Klaro as a
// lazy chunk loaded on the client when CookieBanner mounts.
function loadKlaro(): Promise<KlaroModule> {
  return import('klaro/dist/klaro-no-translations') as unknown as Promise<KlaroModule>;
}

/**
 * Re-open the consent banner (the persistent withdraw control) and move
 * keyboard focus into it.
 *
 * Once a choice is stored, Klaro 0.7 re-opens only its settings modal with
 * toggles + "Save" — no "Accept all" / "Decline all" (both are gated on
 * `!manager.confirmed`). Withdrawing would then take more clicks than
 * consenting did, and the portfolio consent checker (C6/C9) does not
 * recognise that modal as consent UI. So the stored choice is marked
 * unconfirmed for this page and the FIRST-LAYER banner is shown again: the
 * same equal-weight "Accept all" / "Decline all" pair (one click either
 * way) plus "Configure" for per-service toggles. Nothing is applied until
 * the visitor clicks — Klaro only applies consents on a button press, and
 * a click re-confirms and re-saves (same cookie, same 365-day lifetime).
 */
export async function openCookieSettings(): Promise<void> {
  const Klaro = await loadKlaro();
  applyActiveLangToKlaroConfig(klaroConfig);
  Klaro.getManager(klaroConfig).confirmed = false;
  Klaro.show(klaroConfig, false);
  // Klaro focuses the notice when it mounts; make sure focus landed inside
  // the consent UI even when it was already mounted.
  requestAnimationFrame(() => {
    const root = document.getElementById(klaroConfig.elementID);
    if (!root || root.contains(document.activeElement)) return;
    root.querySelector<HTMLElement>('.cookie-modal button, .cookie-notice button')?.focus();
  });
}

// Klaro reads `window.klaroConfig` as a fallback. The package ships no types
// for this global, so we declare it locally rather than reaching for
// `@ts-expect-error` at the assignment site.
declare global {
  interface Window {
    klaroConfig?: unknown;
  }
}

// Klaro mounts itself into <div id="klaro" />. The script-control mechanism:
// any <Script type="text/plain" data-name="X" /> in the page is loaded only
// after the user grants consent for the matching service entry in klaroConfig.
//
// Layouts pass type="text/plain" + data-name="google-analytics" /
// data-name="impact-com" on their tracker <Script> tags so Klaro gates them
// behind the user's consent decision; external URLs go in `data-src` so
// next/script emits no pre-consent <link rel="preload">.
//
// The component takes no arguments. A previous `strings?: UIStrings` prop
// was accepted but never read (Klaro carries its own translations baked
// into `klaroConfig`). PR-Q11 (#75) removed it because every region's
// root layout was passing the full UIStrings bundle, which Next.js
// serialized into the RSC payload of every page (~5 KB of dead JSON
// per page across 8 apps) and on CA `/fr/*` + future EU non-EN routes
// produced a WCAG 3.1.2 lang-of-parts leak in the hydration script.
export default function CookieBanner() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    (async () => {
      const Klaro = await loadKlaro();
      if (cancelled) return;
      // PR-Q13 (#77): set `klaroConfig.lang` BEFORE Klaro.setup() so the
      // consent banner renders in the active page locale. Detects from
      // the DOM (`<div lang="...">` nested layouts → `<html lang>` →
      // `'en'`). Strictly synchronous so there's no English-flash race.
      applyActiveLangToKlaroConfig(klaroConfig);
      window.klaroConfig = klaroConfig;
      Klaro.setup(klaroConfig);
      // Let UI that waits for a consent decision (StickyCtaBar) react to the
      // choice on this page without polling.
      Klaro.getManager(klaroConfig).watch({
        update: (_manager, name, data) => {
          if (name !== 'saveConsents') return;
          window.dispatchEvent(new Event(CONSENT_CHOICE_EVENT));
          // Per-purpose withdrawal of a tracker already running on this page:
          // Klaro notifies before it applies the consents, so reload on the
          // next tick — after the decline handlers set ga-disable and deleted
          // the cookies. The reload re-reads the saved choice; the other
          // purpose stays as chosen.
          if (needsReloadAfterWithdrawal(data?.changes, window)) {
            window.setTimeout(() => window.location.reload(), 0);
          }
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return <div id="klaro" />;
}
