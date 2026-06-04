import { test, expect } from '@playwright/test';

// US keyboard template-DEPTH extension. PR-Q63.
//
// Fourth DEPTH PR after the 8-axis universal-coverage milestone
// (PR-Q59 #123). Per the bug-discovery model: the 3 static-axis
// depth PRs (Q60 axe / Q61 target-size / Q62 focus-appearance) all
// returned 0 portfolio bugs. The remaining bug surface lives in
// JS-driven interactions — keyboard contracts implemented per
// template, not by the design-system substrate.
//
// This spec focuses on the highest-value JS-driven keyboard probe:
// ProductDetail's Tabs primitive (the same Tabs component PR-Q38
// reflow-fixed). The Tabs primitive ships across all 8 region apps
// via @nootropic/ui — if its ARIA tablist contract regresses, EVERY
// region's ProductDetail loses keyboard navigation simultaneously.
//
// What the spec verifies (WCAG 2.1.1 + 2.4.3 + WAI-ARIA tablist
// pattern):
//
//   1. Tab walk reaches a [role="tab"] element within a reasonable
//      number of stops (Tabs are rendered after hero + sticky CTA;
//      typically within the first 20 Tab stops on ProductDetail).
//   2. ArrowRight on a focused tab moves selection AND focus to
//      the next tab (roving tabindex contract).
//   3. Tab from a focused tab hands focus INTO the active
//      [role="tabpanel"] — the WCAG 2.4.3 contract that keyboard
//      users can reach the tab's content without skipping it.
//
// Why these 3 checks together:
//   - axe (Q60) flagged 0 violations on /mind-lab-pro-review/, but
//     axe only checks STATIC structure (presence of role attributes,
//     valid aria-controls relationships). It can't simulate the
//     ArrowRight keypress or the Tab handoff.
//   - target-size (Q61) and focus-appearance (Q62) check
//     GEOMETRY and OUTLINE — also static.
//   - This spec is the first DYNAMIC keyboard-interaction probe
//     of a template-specific primitive beyond chrome-shared
//     ⌘K modal coverage.

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

// Walk Tab forward until the active element matches a predicate or
// the max-stops budget is exhausted. Returns the index reached + the
// total stops walked.
async function tabUntil(
  page: import('@playwright/test').Page,
  predicate: () => boolean,
  maxStops: number,
): Promise<{ matched: boolean; stops: number }> {
  for (let i = 0; i < maxStops; i++) {
    await page.keyboard.press('Tab');
    const matched = await page.evaluate(predicate);
    if (matched) return { matched: true, stops: i + 1 };
  }
  return { matched: false, stops: maxStops };
}

test.describe('US template-depth keyboard — Tabs primitive ARIA tablist contract on ProductDetail', () => {
  test('/mind-lab-pro-review/ — Tab walk reaches a [role="tab"] within 25 stops', async ({ page }) => {
    await page.goto('/mind-lab-pro-review/');
    await page.waitForLoadState('networkidle');

    const result = await tabUntil(
      page,
      () => (document.activeElement as HTMLElement | null)?.getAttribute('role') === 'tab',
      25,
    );
    expect(
      result.matched,
      `Tab walk did not reach a [role="tab"] element in 25 stops.`,
    ).toBe(true);
  });

  test('/mind-lab-pro-review/ — ArrowRight on a focused tab moves selection + focus to next tab (roving tabindex)', async ({ page }) => {
    await page.goto('/mind-lab-pro-review/');
    await page.waitForLoadState('networkidle');

    // Step Tab until we land on a [role="tab"].
    const walked = await tabUntil(
      page,
      () => (document.activeElement as HTMLElement | null)?.getAttribute('role') === 'tab',
      25,
    );
    expect(walked.matched, 'Could not reach [role="tab"]').toBe(true);

    const before = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        id: el?.getAttribute('id') ?? null,
        ariaSelected: el?.getAttribute('aria-selected') ?? null,
      };
    });

    await page.keyboard.press('ArrowRight');

    const after = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return {
        id: el?.getAttribute('id') ?? null,
        role: el?.getAttribute('role') ?? null,
        ariaSelected: el?.getAttribute('aria-selected') ?? null,
      };
    });

    expect(after.role, 'ArrowRight should keep focus on a [role="tab"]').toBe('tab');
    expect(after.ariaSelected, 'ArrowRight should set aria-selected=true on the new tab').toBe('true');
    expect(after.id, 'ArrowRight should move focus to a DIFFERENT tab').not.toBe(before.id);
  });

  test('/mind-lab-pro-review/ — Tab from a focused tab hands focus INTO the active [role="tabpanel"]', async ({ page }) => {
    await page.goto('/mind-lab-pro-review/');
    await page.waitForLoadState('networkidle');

    const walked = await tabUntil(
      page,
      () => (document.activeElement as HTMLElement | null)?.getAttribute('role') === 'tab',
      25,
    );
    expect(walked.matched, 'Could not reach [role="tab"]').toBe(true);

    // Tab from the focused tab should land inside the active
    // [role="tabpanel"]. The Tabs primitive renders the panel
    // immediately after the tablist with tabindex=0 so it's the
    // next focusable element. If focus instead skips to the next
    // chrome element (sticky CTA, footer link), the keyboard user
    // has lost access to the tab's content — WCAG 2.4.3 failure.
    await page.keyboard.press('Tab');
    const next = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return { insideTabpanel: false, tabpanelHidden: null };
      let ancestor: HTMLElement | null = el;
      while (ancestor && ancestor !== document.body) {
        if (ancestor.getAttribute('role') === 'tabpanel') {
          return {
            insideTabpanel: true,
            tabpanelHidden: ancestor.hasAttribute('hidden'),
          };
        }
        ancestor = ancestor.parentElement;
      }
      return { insideTabpanel: false, tabpanelHidden: null };
    });

    expect(
      next.insideTabpanel,
      `Tab from a [role="tab"] should land inside [role="tabpanel"], not skip past it.`,
    ).toBe(true);
    expect(next.tabpanelHidden, 'Active tabpanel must NOT be hidden when focus enters it').toBeFalsy();
  });
});
