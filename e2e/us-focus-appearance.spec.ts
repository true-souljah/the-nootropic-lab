import { test, expect } from '@playwright/test';

// Regression guard for WCAG 2.4.13 Focus Appearance — Level AAA in
// WCAG 2.1, promoted to Level AA in WCAG 2.2 (October 2023):
//
//   "When a user interface component receives focus, the focus
//   indicator meets all the following:
//     - Min area: the focus indicator's area is ≥ the area of a
//       2 CSS px solid perimeter of the unfocused component (or
//       its bounding box).
//     - Adjacent contrast: 3:1 between focused and unfocused
//       states of the same pixel(s).
//     - Not entirely hidden: by author-created content."
//
// This rule catches focus-ring violations that axe-core cannot —
// outline-width too thin (< 2px), outline-style: none, box-shadow
// rings that disappear under user CSS, etc.
//
// The probe Tabs to every focusable element on a representative
// page and reads `getComputedStyle().outline-width` AFTER focus.
// Asserts ≥ 2px AND outline-style is solid (or a documented
// box-shadow / border equivalent is detectable).
//
// The design system sets the canonical focus ring via the token
// chain in packages/ui/src/styles/tokens.css:
//
//   --color-ds-focus-ring: #4F46E5
//
// Used via Tailwind utility classes:
//
//   focus-visible:outline-2
//   focus-visible:outline-ds-focus-ring
//   focus-visible:outline-offset-2
//
// Plus an always-on outline on .ds-skip-link (visible-only-on-focus
// via a transform: translateY trick).
//
// PR-Q58 — adds Focus Appearance as the 8th independent WCAG axis
// (joins smoke / axe / keyboard / reduced-motion / reflow /
// target-size / status-messages already covered across all 8
// regions in PR-Q22..Q57).

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
  // Heuristic: has-equivalent-indicator if box-shadow contains a
  // 2px+ ring even when outline-width parses to 0.
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

test.describe('US — WCAG 2.4.13 Focus Appearance (Level AA in WCAG 2.2)', () => {
  test('every Tab-reached focusable element gets an outline ≥ 2px on focus', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    // Walk 12 Tab stops — enough to reach skip-link, top-bar links,
    // primary nav, search trigger, comparator CTA, and the first 1-2
    // intra-content links. Probe AFTER each Tab so the focused element
    // is current and getComputedStyle reflects :focus-visible state.
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
          // Detect a box-shadow ring equivalent: a non-inset shadow
          // with a blur OR spread ≥ 2px. This catches the common
          // pattern of focus rings drawn via shadow rather than
          // outline (e.g. Tailwind ring-2 + ring-color).
          const boxShadow = cs.boxShadow;
          const hasBoxShadowRing =
            boxShadow !== 'none' &&
            // Crude: look for any number ≥ 2px in the shadow string.
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

    // Each probe must satisfy ONE of:
    //   - outline-style is solid AND outline-width ≥ 2px
    //   - box-shadow ring with at least one ≥ 2px component
    // (The two paths cover both the Tailwind utility outline pattern
    // AND any future ring-shadow approach.)
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
    // Skip-link is the first Tab stop. Its outline is declared
    // statically in tokens.css (.ds-skip-link). Verify the declared
    // outline-width is exactly 2px and outline-style is solid —
    // catches a tokens.css regression that removes the outline rule
    // or changes width below the WCAG 2.2 threshold.
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
    // Color must be the ds-focus-ring token. The token resolves to
    // #059669 (brand emerald) post-PR-Q58 normalization — parsed
    // sRGB form `rgb(5, 150, 105)`. Pre-Q58 the token declared
    // #4F46E5 (indigo) but never effectively rendered because
    // region-globals.css overrode it with a hardcoded #059669
    // literal. Q58 unifies both rules to the token + visible green.
    expect(info?.outlineColor).toBe('rgb(5, 150, 105)');
  });
});
