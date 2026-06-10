import { test, expect } from '@playwright/test';

// Keyboard-navigation coverage on the JP Playwright project.
// Companion to us-keyboard-navigation (Q22 #86, Q48 #112, Q50 #114),
// au-keyboard-navigation (Q49 #113), gcc-keyboard-navigation (Q50 #114),
// sea-keyboard-navigation (Q51 #115 — surfaced the CommandPalette
// focus-trap bug now fixed portfolio-wide).
//
// Targets WCAG 2.1.1 (Keyboard), 2.4.1 (Bypass Blocks), 2.4.3
// (Focus Order).
//
// PR-Q52 — first non-English-chrome region for keyboard. JP renders
// <html lang="ja-JP"> with translated chrome labels:
//
//   skip-link text       — メインコンテンツへスキップ
//   "Comparator" CTA     — 比較
//   Search aria-label    — "Search (⌘K)" (still English — shared
//                          @nootropic/ui component)
//
// Tab-trap probe types "fancl" — substring match on FANCL Brains in
// the JP catalog (FANCL is a Japanese supplement chain; the product
// is FFC (機能性表示食品 / Foods with Function Claims) and JP-
// exclusive in products-jp.ts). On every other region, "fancl"
// returns no matches.
//
// The PR-Q51 portfolio-wide focus-trap fix means even small result
// counts no longer escape — the Tab-trap test passes regardless of
// how many products match the query.
//
// JP lifts to 5 of 7 covered axes (smoke is implicit — JP has
// jp-smoke covered via earlier specs; axe, reflow,
// status-messages, keyboard).

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

test.describe('JP /best-nootropics-for-focus/ — skip-link (WCAG 2.4.1 Bypass Blocks)', () => {
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

test.describe('JP /best-nootropics-for-focus/ — CommandPalette ⌘K modal (WCAG 2.1.1 + 2.4.3 Focus Order)', () => {
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
    // Type "fancl" — substring match on FANCL Brains in the JP
    // catalog (FFC-classified, JP-exclusive). The Tab-trap fix
    // from PR-Q51 means focus loops back to the input regardless
    // of result count — verify for 5 consecutive Tabs.
    await page.keyboard.type('fancl');
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

test.describe('JP /best-nootropics-for-focus/ — primary nav tab order (WCAG 2.4.3 Focus Order)', () => {
  test('Tab order: skip-link is first, primary nav reached within 12 stops, search trigger and comparator present', async ({ page }) => {
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
    // JP renders the skip-link as メインコンテンツへスキップ
    // ("Skip to main content" in Japanese). Match either the
    // English or Japanese variant.
    expect(stops[0], `stops=${JSON.stringify(stops)}`).toMatch(/Skip|skip|スキップ/);
    expect(
      stops.some((s) => /Search|⌘K|Ctrl/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
    // Comparator: ja-JP variant 比較. Pattern accepts every locale's
    // word for "comparator" (kept for portfolio sweep).
    expect(
      stops.some((s) => /comparator|comparador|comparateur|comparer|Vergleich|比較/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
  });
});
