'use client';
import { useEffect } from 'react';
import 'klaro/dist/klaro.css';
import './styles/klaro-overrides.css';
import type { UIStrings } from '@nootropic/data';
import { klaroConfig } from './klaro-config';

interface KlaroModule {
  setup: (config: unknown) => void;
}

// Backwards-compatible signature: existing layouts pass `strings` to the
// banner for the legacy binary accept/decline UI. Klaro has its own
// translations baked into klaroConfig; the prop is accepted but unused.
//
// Klaro mounts itself into <div id="klaro" />. The script-control mechanism:
// any <Script type="text/plain" data-name="X" /> in the page is loaded only
// after the user grants consent for the matching service entry in klaroConfig.
//
// Layouts pass type="text/plain" + data-name="cloudflare-insights" or
// data-name="google-analytics" on their analytics <Script> tags so Klaro
// gates them behind the user's consent decision.
export default function CookieBanner(_props?: { strings?: UIStrings }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    (async () => {
      // Klaro ships no .d.ts; cast the dynamic import once at the boundary.
      const Klaro = (await import(
        /* webpackIgnore: true */ 'klaro/dist/klaro-no-translations' as string
      )) as unknown as KlaroModule;
      if (cancelled) return;
      // @ts-expect-error Klaro reads window.klaroConfig as a fallback.
      window.klaroConfig = klaroConfig;
      Klaro.setup(klaroConfig);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return <div id="klaro" />;
}
