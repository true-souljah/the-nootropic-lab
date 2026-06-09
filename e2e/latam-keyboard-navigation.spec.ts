import { test, expect } from '@playwright/test';

// Keyboard-navigation coverage on the LATAM Playwright project.
// Companion to us-keyboard-navigation, au-keyboard-navigation,
// gcc-keyboard-navigation, sea-keyboard-navigation, and
// jp-keyboard-navigation (Q22 / Q49 / Q50 / Q51 / Q52).
//
// Targets WCAG 2.1.1 (Keyboard), 2.4.1 (Bypass Blocks), 2.4.3
// (Focus Order).
//
// PR-Q53. LATAM runs es-LATAM at root (single locale, no nested
// /en/ — Spanish is the primary). Localized chrome:
//
//   skip-link text       — Saltar al contenido principal
//   "Comparator" CTA     — comparador (already covered by the
//                          existing regex)
//   Search aria-label    — "Search (⌘K)" (still EN — shared
//                          @nootropic/ui component)
//
// Tab-trap probe types "genomma" — substring match on Genomma Lab
// Neuriplus in the LATAM catalog (Genomma Lab is a Mexican pharma
// conglomerate; Neuriplus is the brand boost product, exclusively
// distributed in LATAM markets). On every other region, "genomma"
// returns no matches.
//
// PR-Q51 portfolio-wide trap fix means the trap holds regardless
// of result count.
//
// LATAM lifts to 5 of 7 covered axes.

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

test.describe('LATAM /best-nootropics-for-focus/ — skip-link (WCAG 2.4.1 Bypass Blocks)', () => {
  test('skip-link is the first focusable element on the page', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? { className: el.className, href: (el as HTMLAnchorElement).href } : null;
    });
    expect(focused?.className).toContain('ds-skip-link');
    expect(focused?.href).toMatch(/#main-content$/);
  });

  test('Activating the skip-link bypasses the header chrome — next Tab lands inside <main>', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    expect(page.url()).toMatch(/#main-content$/);
    await page.keyboard.press('Tab');
    const inMain = await page.evaluate(() => {
      const main = document.getElementById('main-content');
      if (!main) return false;
      const active = document.activeElement;
      return active !== null && (main.contains(active) || active === main);
    });
    expect(inMain).toBe(true);
  });
});

test.describe('LATAM /best-nootropics-for-focus/ — CommandPalette ⌘K modal (WCAG 2.1.1 + 2.4.3 Focus Order)', () => {
  test('Ctrl+K opens the SearchModal and moves focus to the input', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    // PR-Q73 hardening — port of the PR-Q66 toPass() retry pattern
    // applied to us-keyboard. Under heaviest full-suite contention
    // the keydown listener may not be registered by the time
    // networkidle fires. Retry until the dialog attaches OR 5s
    // elapses. Idempotent: CommandPalette ignores ⌘K when already
    // open. Same family that flaked once on jp-keyboard during
    // PR-Q72 verification.
    await expect(async () => {
      await page.keyboard.press('Control+K');
      await expect(
        page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
      ).toBeAttached({ timeout: 500 });
    }).toPass({ timeout: 5000, intervals: [100, 250, 500, 1000] });
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName?.toLowerCase() ?? null,
    );
    expect(focusedTag).toBe('input');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
  });

  test('Escape closes the modal and returns focus to the trigger button', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    // PR-Q73 hardening — port of the PR-Q66 toPass() retry pattern
    // applied to us-keyboard. Under heaviest full-suite contention
    // the keydown listener may not be registered by the time
    // networkidle fires. Retry until the dialog attaches OR 5s
    // elapses. Idempotent: CommandPalette ignores ⌘K when already
    // open. Same family that flaked once on jp-keyboard during
    // PR-Q72 verification.
    await expect(async () => {
      await page.keyboard.press('Control+K');
      await expect(
        page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
      ).toBeAttached({ timeout: 500 });
    }).toPass({ timeout: 5000, intervals: [100, 250, 500, 1000] });
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toHaveCount(0);
    await expect(page.locator('button[aria-label*="Search"]').first()).toBeFocused();
  });

  test('Tab inside the modal loops focus on the input (PR-Q51 portfolio-wide trap fix)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    // PR-Q73 hardening — port of the PR-Q66 toPass() retry pattern
    // applied to us-keyboard. Under heaviest full-suite contention
    // the keydown listener may not be registered by the time
    // networkidle fires. Retry until the dialog attaches OR 5s
    // elapses. Idempotent: CommandPalette ignores ⌘K when already
    // open. Same family that flaked once on jp-keyboard during
    // PR-Q72 verification.
    await expect(async () => {
      await page.keyboard.press('Control+K');
      await expect(
        page.locator('[role="dialog"]:not(#klaro-cookie-notice)'),
      ).toBeAttached({ timeout: 500 });
    }).toPass({ timeout: 5000, intervals: [100, 250, 500, 1000] });
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
    // Type "genomma" — substring match on Genomma Lab Neuriplus in
    // the LATAM catalog (Mexican pharma, LATAM-exclusive in
    // products-latam.ts). The PR-Q51 trap fix means focus loops
    // back to the input regardless of result count.
    await page.keyboard.type('genomma');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const insideDialog = await page.evaluate(() => {
        const dialog = document.querySelector(
          '[role="dialog"]:not(#klaro-cookie-notice)',
        );
        if (!dialog) return false;
        return dialog.contains(document.activeElement);
      });
      expect(insideDialog, `Tab #${i + 1} should keep focus inside the dialog`).toBe(true);
    }
  });
});

test.describe('LATAM /best-nootropics-for-focus/ — primary nav tab order (WCAG 2.4.3 Focus Order)', () => {
  test('Tab order: skip-link is first, primary nav reached within 12 stops, search trigger and comparador present', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    const stops: string[] = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const label = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return 'none';
        return (
          el.getAttribute('aria-label') ??
          el.textContent?.trim().slice(0, 40) ??
          el.tagName.toLowerCase()
        );
      });
      stops.push(label);
    }
    // LATAM renders the skip-link as "Saltar al contenido principal"
    // (Spanish). Pattern accepts EN + Spanish + Japanese variants.
    expect(stops[0], `stops=${JSON.stringify(stops)}`).toMatch(/Skip|skip|スキップ|Saltar/);
    expect(
      stops.some((s) => /Search|⌘K|Ctrl/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
    // Comparator: es-LATAM variant is `comparador` (already in the
    // existing regex from us-keyboard original).
    expect(
      stops.some((s) => /comparator|comparador|comparateur|comparer|Vergleich|比較/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
  });
});
