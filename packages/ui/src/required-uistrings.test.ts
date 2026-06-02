import { describe, test, expect } from 'vitest';
import { type ComponentProps } from 'react';
import ProductDetail from './templates/ProductDetail';
import BestOf from './templates/BestOf';

// Regression guard for PR-Q12 (#76). Before this PR, ProductDetail and
// BestOf each declared `uiStrings?: UIStrings` (optional) and fell back
// to `getStrings('en')` when omitted. The defensive fallback produced
// a latent WCAG 3.1.2 leak: a future caller could silently render
// English content under a non-EN `<html lang>`, mispronouncing every
// string the page exposes through assistive tech.
//
// PR-Q12 tightened both components to require `uiStrings: UIStrings`
// and removed the `?? getStrings('en')` fallback. The compile-time
// guards below lock that contract: if a future refactor re-introduces
// the optional modifier, `tsc` fails in the CI build/typecheck job
// before tests even run.
//
// This file is the BestOf/ProductDetail twin of cookie-banner.test.ts
// (which guards the CookieBanner zero-arg signature from PR-Q11).

type ProductDetailProps = ComponentProps<typeof ProductDetail>;
type BestOfProps = ComponentProps<typeof BestOf>;

describe('ProductDetail — uiStrings is REQUIRED (PR-Q12 regression guard)', () => {
  test('uiStrings is in `keyof Props` and is NOT marked optional', () => {
    // Mapped-type assertion. If a future refactor adds `?` to the prop,
    // `Required<Props>['uiStrings']` still resolves to UIStrings, BUT
    // `Pick<Props, 'uiStrings'>` becomes `{ uiStrings?: ... }` which
    // makes `'uiStrings' extends keyof OptionalPick` change. We assert
    // both: the key exists, AND it has the same shape after Required.
    type HasKey = 'uiStrings' extends keyof ProductDetailProps ? true : false;
    type IsOptional = undefined extends ProductDetailProps['uiStrings'] ? true : false;
    const hasKey: HasKey = true;
    const isOptional: IsOptional = false;
    expect(hasKey).toBe(true);
    expect(isOptional).toBe(false);
  });
});

describe('BestOf — uiStrings is REQUIRED (PR-Q12 regression guard)', () => {
  test('uiStrings is in `keyof Props` and is NOT marked optional', () => {
    type HasKey = 'uiStrings' extends keyof BestOfProps ? true : false;
    type IsOptional = undefined extends BestOfProps['uiStrings'] ? true : false;
    const hasKey: HasKey = true;
    const isOptional: IsOptional = false;
    expect(hasKey).toBe(true);
    expect(isOptional).toBe(false);
  });
});
