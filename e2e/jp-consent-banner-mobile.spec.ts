import { test, expect } from '@playwright/test';

// Klaro consent notice on narrow screens + its dialog name (live check
// 2026-10-07, all 8 regions). JP counterpart of us-consent-banner-mobile
// (Klaro `ja` locale from <html lang="ja">).
//
// klaro-overrides.css centred the notice with `--notice-left: 50%` plus
// `transform: translateX(-50%)` at every width, but Klaro's own stylesheet
// applies `left: var(--notice-left)` only at `@media (min-width: 1024px)`.
// Below that Klaro pins the notice full width (right: 0; width: 100%), so the
// transform pushed it half its width off the left edge (left -195 at 390px).
// The notice (role="dialog") also points aria-labelledby at
// "id-cookie-title", an element Klaro renders only when `showNoticeTitle` is
// set, so the dialog had no accessible name.
//
// Each test gets a fresh context with no consent cookie, so the first-layer
// notice shows. 1023px is the last width below Klaro's desktop breakpoint;
// 1280px checks the desktop notice stays centred.

const PATH = '/';
/** `consentNotice.title` of this page's Klaro locale (packages/ui/src/klaro-config.ts). */
const TITLE = '分析とアフィリエイト計測のためのCookie';

const VIEWPORTS = [
  { width: 360, isMobile: true },
  { width: 390, isMobile: true },
  { width: 1023, isMobile: false },
  { width: 1280, isMobile: false },
];

for (const { width, isMobile } of VIEWPORTS) {
  test.describe(`JP consent notice at ${width}px${isMobile ? ' (mobile)' : ''}`, () => {
    test.use({ viewport: { width, height: 800 }, isMobile, hasTouch: isMobile });

    test('sits fully inside the viewport', async ({ page }) => {
      await page.goto(PATH);
      const notice = page.locator('#klaro-cookie-notice');
      await expect(notice).toBeVisible({ timeout: 10_000 });
      const box = await notice.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, viewport: document.documentElement.clientWidth };
      });
      expect(box.left, `notice left edge at ${width}px`).toBeGreaterThanOrEqual(0);
      expect(box.right, `notice right edge at ${width}px`).toBeLessThanOrEqual(box.viewport);
      if (width >= 1024) {
        expect(Math.abs(box.left - (box.viewport - box.right)), 'desktop notice is centred').toBeLessThanOrEqual(1);
      }
    });

    test('dialog is named by its localized title', async ({ page }) => {
      await page.goto(PATH);
      await expect(page.getByRole('dialog', { name: TITLE, exact: true })).toBeVisible({ timeout: 10_000 });
    });
  });
}
