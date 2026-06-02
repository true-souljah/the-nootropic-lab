'use client';
import { useEffect } from 'react';
import 'klaro/dist/klaro.css';
import './styles/klaro-overrides.css';
import { klaroConfig } from './klaro-config';

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
      const Klaro = (await import(
        /* webpackIgnore: true */ 'klaro/dist/klaro-no-translations' as string
      )) as unknown as KlaroModule;
      if (cancelled) return;
      window.klaroConfig = klaroConfig;
      Klaro.setup(klaroConfig);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return <div id="klaro" />;
}
