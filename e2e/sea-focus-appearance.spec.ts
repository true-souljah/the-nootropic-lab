import { test, expect } from '@playwright/test';

// Regression guard for WCAG 2.4.13 Focus Appearance — Level AA in
// WCAG 2.2 (Oct 2023) on the SEA Playwright project.
// Twin of us-focus-appearance (PR-Q58 #122).
//
// PR-Q59 portfolio sweep — promotes US-only Focus Appearance
// coverage (PR-Q58) to all 8 regions in a single mechanical PR.
// Closes the 8th axis at 8/8, bringing all 8 axes to universal
// coverage. Every region at full parity, no remaining gaps.
//
// Like reduced-motion (Q56) and target-size (Q57), Focus Appearance
// has no region-specific surface area: the focus-ring token chain
// in packages/ui/src/styles/tokens.css + region-globals.css
// (normalized in PR-Q58 to a single source of truth at
// var(--color-ds-focus-ring)) renders identically across all 8
// region builds.

const MIN_OUTLINE_WIDTH_PX = 2;

interface FocusedProbe {
  index: number;
  tag: string;
  ariaLabel: string | null;
  text: string;
  outlineWidth: string;
  outlineStyle: string;
  outlineColor: string;
  outlineOffset: string;
  boxShadow: string;
  parsedWidthPx: number;
  hasBoxShadowRing: boolean;
}

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('SEA — WCAG 2.4.13 Focus Appearance (Level AA in WCAG 2.2)', () => {
  test('every Tab-reached focusable element gets an outline ≥ 2px on focus', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    const probes: FocusedProbe[] = [];
    const MAX_STOPS = 12;
    for (let i = 0; i < MAX_STOPS; i++) {
      await page.keyboard.press('Tab');
      const probe = await page.evaluate(
        (idx: number) => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = window.getComputedStyle(el);
          const outlineWidth = cs.outlineWidth;
          const widthPx = parseFloat(outlineWidth);
          const boxShadow = cs.boxShadow;
          const hasBoxShadowRing =
            boxShadow !== 'none' &&
            /(\d+(?:\.\d+)?)px/.test(boxShadow) &&
            (() => {
              const matches = boxShadow.match(/(\d+(?:\.\d+)?)px/g) ?? [];
              return matches.some((m) => parseFloat(m) >= 2);
            })();
          return {
            index: idx,
            tag: el.tagName.toLowerCase(),
            ariaLabel: el.getAttribute('aria-label'),
            text: (el.textContent ?? '').trim().slice(0, 50),
            outlineWidth,
            outlineStyle: cs.outlineStyle,
            outlineColor: cs.outlineColor,
            outlineOffset: cs.outlineOffset,
            boxShadow,
            parsedWidthPx: isNaN(widthPx) ? 0 : widthPx,
            hasBoxShadowRing,
          };
        },
        i,
      );
      if (probe) probes.push(probe);
    }

    const offenders = probes.filter((p) => {
      const hasOutlineRing =
        p.outlineStyle === 'solid' && p.parsedWidthPx >= MIN_OUTLINE_WIDTH_PX;
      return !(hasOutlineRing || p.hasBoxShadowRing);
    });

    expect(
      offenders,
      `WCAG 2.4.13 Focus Appearance offenders (no visible ≥ ${MIN_OUTLINE_WIDTH_PX}px focus indicator):\n${JSON.stringify(offenders, null, 2)}\n\nFull walk:\n${JSON.stringify(probes, null, 2)}`,
    ).toHaveLength(0);
  });

  test('skip-link carries its always-on outline declaration (regression guard for tokens.css)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        className: el.className,
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
      };
    });
    expect(info?.className).toContain('ds-skip-link');
    expect(info?.outlineWidth).toBe('2px');
    expect(info?.outlineStyle).toBe('solid');
    // Post-PR-Q58, the token `--color-ds-focus-ring` resolves to
    // #059669 (brand emerald), parsed sRGB form rgb(5, 150, 105).
    expect(info?.outlineColor).toBe('rgb(5, 150, 105)');
  });
});
