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

interface KlaroModule {
  setup: (config: unknown) => void;
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
// Layouts pass type="text/plain" + data-name="cloudflare-insights" or
// data-name="google-analytics" on their analytics <Script> tags so Klaro
// gates them behind the user's consent decision.
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
      // Klaro ships no .d.ts; cast the dynamic import once at the boundary.
      // PR-Q14 (#78) removed `/* webpackIgnore: true */` which was telling
      // the bundler to leave the import path as a literal at build time.
      // In a Next.js static export, `klaro/dist/klaro-no-translations`
      // isn't a resolvable HTTP route, so Klaro never actually mounted —
      // `<div id="klaro">` stayed empty on every page across every region.
      // Removing the directive lets turbopack/webpack bundle Klaro as a
      // lazy chunk loaded on the client when CookieBanner mounts.
      const Klaro = (await import(
        'klaro/dist/klaro-no-translations'
      )) as unknown as KlaroModule;
      if (cancelled) return;
      // PR-Q13 (#77): set `klaroConfig.lang` BEFORE Klaro.setup() so the
      // consent banner renders in the active page locale. Detects from
      // the DOM (`<div lang="...">` nested layouts → `<html lang>` →
      // `'en'`). Strictly synchronous so there's no English-flash race.
      applyActiveLangToKlaroConfig(klaroConfig);
      window.klaroConfig = klaroConfig;
      Klaro.setup(klaroConfig);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return <div id="klaro" />;
}
