import { test, expect } from '@playwright/test';

// Keyboard-navigation coverage on the GCC Playwright project.
// Companion to us-keyboard-navigation (PR-Q22 #86, stabilized in
// PR-Q48 #112) and au-keyboard-navigation (PR-Q49 #113).
//
// Targets WCAG 2.1.1 (Keyboard), 2.4.1 (Bypass Blocks), 2.4.3
// (Focus Order).
//
// Why a GCC twin of US/AU-keyboard:
//
//   The keyboard contract (skip-link → ⌘K modal → focus trap → Tab
//   order) lives in shared chrome (FPHeader, CommandPalette,
//   BaseLayout). All 3 of US/AU/GCC consume the @nootropic/ui
//   versions. Promoting keyboard sideways across regions catches
//   chrome forks at the keyboard contract level.
//
//   The Tab-trap test types "na" — a substring match on Nahdi in
//   the GCC catalog (Nahdi Brain Boost, SFDA-registered KSA private
//   label exclusive to products-gcc.ts). On US/AU, "na" wouldn't
//   match Nahdi; the GCC-only catalog probe verifies the SearchModal
//   product index is correctly wired through to modal interactions
//   on GCC specifically.
//
// PR-Q50 — promotes keyboard navigation to a 3rd region. After this
// PR: US + AU + GCC have keyboard coverage; JP/LATAM/CA/EU/SEA
// remain. GCC lifts to 5 of 7 covered axes.

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

test.describe('GCC /best-nootropics-for-focus/ — skip-link (WCAG 2.4.1 Bypass Blocks)', () => {
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

test.describe('GCC /best-nootropics-for-focus/ — CommandPalette ⌘K modal (WCAG 2.1.1 + 2.4.3 Focus Order)', () => {
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

  test('Tab inside the modal cycles between focusable elements (focus trap on GCC catalog)', async ({ page }) => {
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
    // Type "na" — substring match on Nahdi in the GCC catalog. On
    // US/AU the same query would match different products. The trap
    // behavior should be identical regardless of which catalog
    // matches.
    await page.keyboard.type('na');
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

test.describe('GCC /best-nootropics-for-focus/ — primary nav tab order (WCAG 2.4.3 Focus Order)', () => {
  test('Tab order: skip-link is first, primary nav reached within 12 stops, search trigger and CTA present', async ({ page }) => {
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
    expect(stops[0], `stops=${JSON.stringify(stops)}`).toMatch(/Skip|skip/);
    expect(
      stops.some((s) => /Search|⌘K|Ctrl/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
    expect(
      stops.some((s) => /comparator|comparador|comparateur|comparer|Vergleich/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
  });
});
