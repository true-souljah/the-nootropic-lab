import { describe, test, expect } from 'vitest';
import { type ComponentProps } from 'react';
import CookieBanner from './CookieBanner';

// Regression guard for the PR-Q11 (#75) decision to drop the dead `strings`
// prop from CookieBanner. Background: CookieBanner is a `'use client'`
// component. Every region's root layout was passing the full UIStrings
// bundle as `<CookieBanner strings={getStrings('en')} />`, which Next.js
// serialized into the RSC hydration payload of every page. The body never
// read the prop — Klaro ships its own translations baked into klaroConfig.
//
// If a future change re-introduces a `strings` (or `uiStrings`) prop, this
// test fails — forcing the author to read this file, understand why the
// prop was deleted, and either justify the change or use Klaro's own
// translation mechanism instead. See packages/ui/src/CookieBanner.tsx
// docblock + PR-Q11 description for the full story.

type Props = ComponentProps<typeof CookieBanner>;

describe('CookieBanner — public surface (PR-Q11 regression guard)', () => {
  // We deliberately do NOT call CookieBanner() at runtime here — it
  // invokes useEffect, which throws outside a React render. The check
  // below is type-level and runs at compile time via `tsc`. The runtime
  // expect()s assert constant booleans so the test framework still has
  // something to count.
  test('Props type has no `strings` or `uiStrings` key', () => {
    // Mapped-type assertions. For a zero-arg component, `keyof Props`
    // is `never`, and `'strings' extends never` is `false`. If a future
    // refactor restores the prop, these aliases become `true`, the
    // `: false` annotation on the constant fails to typecheck, CI tsc
    // turns red, and the author has to read this file and PR-Q11.
    type HasStrings = 'strings' extends keyof Props ? true : false;
    type HasUiStrings = 'uiStrings' extends keyof Props ? true : false;
    const hasStrings: HasStrings = false;
    const hasUiStrings: HasUiStrings = false;
    expect(hasStrings).toBe(false);
    expect(hasUiStrings).toBe(false);
  });
});
