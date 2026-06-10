import { test, expect } from '@playwright/test';

// US focus-appearance template-DEPTH extension. PR-Q62.
//
// Third DEPTH PR after the 8-axis universal-coverage milestone
// (PR-Q59 #123). Joins:
//
//   PR-Q60 → axe template-depth (ProductDetail / HeadToHead /
//            ThreeWay / IngredientDetail) — 0 portfolio bugs
//   PR-Q61 → target-size template-depth on same 4 routes — 0
//            portfolio bugs
//
// Extends WCAG 2.4.13 Focus Appearance (Level AA in WCAG 2.2)
// coverage from chrome-shared Listicle (PR-Q58 US + Q59 portfolio
// sweep) to the same four template surfaces:
//
//   /mind-lab-pro-review/                    — ProductDetail
//   /alpha-brain-vs-qualia-mind/             — HeadToHead
//   /alpha-brain-vs-mind-lab-pro-vs-noocube/ — ThreeWay
//   /ingredients/l-theanine/                 — IngredientDetail
//
// Why focus-appearance on these surfaces is the highest-EV depth
// probe of the remaining options:
//
//   ProductDetail's tab strip has 5 tab buttons + Reviews / Pricing
//   subtab content with multiple focusables each. The tab buttons
//   themselves should use the ds-focus-ring token but the inner
//   tabpanel content (e.g. PricingTab's vendor CTAs, ReviewsTab's
//   rating filters) is custom per template and may have skipped
//   the focus-visible utility class.
//
//   HeadToHead and ThreeWay tables have column-header buttons,
//   sortable columns, and per-row toggle controls. Each is a
//   custom interactive element that — like the SearchModal trap
//   in PR-Q51 — may have been built without remembering the
//   focus-ring contract.
//
//   IngredientDetail's source citations + ScoreBar segments are
//   the smallest interactive elements in the codebase. If any
//   focusable element on this page renders with outline: none
//   or outline-width < 2px under :focus-visible, the keyboard-
//   only user loses navigational orientation entirely.
//
// Spec reuses the 12-stop Tab walk + outline / box-shadow probe
// from us-focus-appearance.spec.ts (PR-Q58), targeting one template
// route per test. The shared probeFocusables helper is defined
// here to avoid cross-file imports.

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
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

async function walkAndProbe(page: import('@playwright/test').Page, url: string): Promise<FocusedProbe[]> {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  const probes: FocusedProbe[] = [];
  for (let i = 0; i < 12; i++) {
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
  return probes;
}

function offendersFrom(probes: FocusedProbe[]): FocusedProbe[] {
  return probes.filter((p) => {
    const hasOutlineRing =
      (p.outlineStyle === 'solid' || p.outlineStyle === 'auto') && p.parsedWidthPx >= MIN_OUTLINE_WIDTH_PX;
    return !(hasOutlineRing || p.hasBoxShadowRing);
  });
}

test.describe('US template-depth focus-appearance — WCAG 2.4.13', () => {
  test('/mind-lab-pro-review/ (ProductDetail) — every Tab stop has ≥ 2px focus indicator', async ({ page }) => {
    const probes = await walkAndProbe(page, '/mind-lab-pro-review/');
    const offenders = offendersFrom(probes);
    expect(
      offenders,
      `Focus Appearance offenders on ProductDetail (no visible ≥ ${MIN_OUTLINE_WIDTH_PX}px ring):\n${JSON.stringify(offenders, null, 2)}\n\nFull walk:\n${JSON.stringify(probes, null, 2)}`,
    ).toHaveLength(0);
  });

  test('/alpha-brain-vs-qualia-mind/ (HeadToHead) — every Tab stop has ≥ 2px focus indicator', async ({ page }) => {
    const probes = await walkAndProbe(page, '/alpha-brain-vs-qualia-mind/');
    const offenders = offendersFrom(probes);
    expect(
      offenders,
      `Focus Appearance offenders on HeadToHead (no visible ≥ ${MIN_OUTLINE_WIDTH_PX}px ring):\n${JSON.stringify(offenders, null, 2)}\n\nFull walk:\n${JSON.stringify(probes, null, 2)}`,
    ).toHaveLength(0);
  });

  test('/alpha-brain-vs-mind-lab-pro-vs-noocube/ (ThreeWay) — every Tab stop has ≥ 2px focus indicator', async ({ page }) => {
    const probes = await walkAndProbe(page, '/alpha-brain-vs-mind-lab-pro-vs-noocube/');
    const offenders = offendersFrom(probes);
    expect(
      offenders,
      `Focus Appearance offenders on ThreeWay (no visible ≥ ${MIN_OUTLINE_WIDTH_PX}px ring):\n${JSON.stringify(offenders, null, 2)}\n\nFull walk:\n${JSON.stringify(probes, null, 2)}`,
    ).toHaveLength(0);
  });

  test('/ingredients/l-theanine/ (IngredientDetail) — every Tab stop has ≥ 2px focus indicator', async ({ page }) => {
    const probes = await walkAndProbe(page, '/ingredients/l-theanine/');
    const offenders = offendersFrom(probes);
    expect(
      offenders,
      `Focus Appearance offenders on IngredientDetail (no visible ≥ ${MIN_OUTLINE_WIDTH_PX}px ring):\n${JSON.stringify(offenders, null, 2)}\n\nFull walk:\n${JSON.stringify(probes, null, 2)}`,
    ).toHaveLength(0);
  });
});
