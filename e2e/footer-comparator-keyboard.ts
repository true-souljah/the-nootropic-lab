import { test, expect } from '@playwright/test';

// Shared by the e2e/<region>-keyboard-navigation.spec.ts files (not a spec
// itself: playwright.config.ts collects *.spec.ts only).
//
// Since 2026-10-19 (design decisions 15–16, the header as drawn on the
// Option B canvas) FPHeader has no "Open comparator →" button; the footer's
// Head-to-head column links the comparator ("All comparisons →") on every
// host. The keyboard specs used to find that button in the header's Tab
// order; this checks the comparator is still a keyboard stop, in the footer.
// Shift+Tab on a freshly loaded page starts from the last focusable element,
// so walking backwards reaches the footer without Tabbing through the body.

const MAX_STOPS = 40;

/** Registers one test: from the end of `path`, Shift+Tab reaches the footer's comparator link. */
export function comparatorReachableInFooter(path: string): void {
  test(`${path}: the comparator is reachable by keyboard in the footer (Shift+Tab from the end)`, async ({ page }) => {
    await page.goto(path);
    const stops: string[] = [];
    let reached: { inFooter: boolean } | null = null;
    for (let i = 0; i < MAX_STOPS && !reached; i++) {
      await page.keyboard.press('Shift+Tab');
      const stop = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        return {
          href: el.getAttribute('href'),
          inFooter: !!el.closest('footer[role="contentinfo"]'),
          label: el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 40) ?? el.tagName.toLowerCase(),
        };
      });
      stops.push(stop?.label ?? 'none');
      if (stop?.href && /^\/nootropic-comparison\/?$/.test(stop.href)) reached = stop;
    }
    expect(reached, `no /nootropic-comparison/ link within ${MAX_STOPS} Shift+Tab stops: ${JSON.stringify(stops)}`).not.toBeNull();
    expect(reached!.inFooter, `stops=${JSON.stringify(stops)}`).toBe(true);
  });
}
