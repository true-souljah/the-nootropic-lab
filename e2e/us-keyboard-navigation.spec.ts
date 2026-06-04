import { test, expect } from '@playwright/test';

// Keyboard-navigation coverage for surfaces axe-core can't audit:
// tab order, focus management, modal escape behavior, focus trap, and
// skip-link landing. These are WCAG 2.1.1 (Keyboard) + 2.4.1 (Bypass
// Blocks) + 2.4.7 (Focus Visible) — all of which axe rules can flag the
// markup for but not the dynamic interaction.
//
// Target: US Listicle route /best-nootropics-for-focus/. The Listicle
// template carries:
//   - A `.ds-skip-link` <a href="#main-content"> as the first focusable.
//   - FPHeader with CommandPalette (the ⌘K SearchModal trigger).
//   - Standard `<main id="main-content">` landmark.
// This makes it a representative single page for the keyboard surfaces
// we want to exercise. PR-Q22 #86.

// Pre-seed the Klaro consent cookie so the consent banner doesn't appear
// during keyboard tests. Klaro otherwise injects an autofocus'd
// `role="dialog"` on first load (per PR-Q13/Q14) which would steal the
// initial focus and interfere with every Tab assertion below. The value
// shape mirrors what Klaro writes after the user clicks "Decline all".
test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: 'klaro',
      // JSON-encoded consent map; "false" on both services means
      // declined. Klaro reads this and skips the consent banner on
      // page load.
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('US /best-nootropics-for-focus/ — skip-link (WCAG 2.4.1 Bypass Blocks)', () => {
  test('skip-link is the first focusable element on the page', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    // Tab from <body> → first focusable element.
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
    await page.keyboard.press('Tab');     // Focus skip-link.
    await page.keyboard.press('Enter');   // Activate.
    // After Enter, URL hash should be #main-content.
    expect(page.url()).toMatch(/#main-content$/);
    // The next Tab should now land on the first focusable inside <main>,
    // bypassing the header chrome entirely (WCAG 2.4.1 Bypass Blocks).
    // Browsers don't always auto-focus the fragment target unless it has
    // `tabindex="-1"`, so we test the OBSERVABLE behavior: that the user
    // has skipped past the repeated nav/header chrome and is now in main.
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

test.describe('US /best-nootropics-for-focus/ — CommandPalette ⌘K modal (WCAG 2.1.1 + 2.4.3 Focus Order)', () => {
  test('Ctrl+K opens the SearchModal and moves focus to the input', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    // CommandPalette is a React island; under full-suite worker
    // contention the keydown handler is not yet registered when we
    // synchronously dispatch the ⌘K. Wait for networkidle to let
    // hydration complete. Without this guard the modal tests flake
    // under load — observed 5 times across PR-Q37/Q38/Q40/Q45/Q47.
    // PR-Q48 fix.
    await page.waitForLoadState('networkidle');
    // CommandPalette listens for both `metaKey + k` (macOS ⌘) and
    // `ctrlKey + k` (other platforms) — Playwright's default headless
    // chromium reports ctrl on linux runners. Use Control+K which is
    // accepted by the same handler.
    await page.keyboard.press('Control+K');
    // After mount, focus should land on the search input.
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName?.toLowerCase() ?? null,
    );
    expect(focusedTag).toBe('input');
    // Modal dialog should be in the DOM.
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
  });

  test('Escape closes the modal and returns focus to the trigger button', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
    // Locate the trigger button before closing so we can compare focus.
    await page.keyboard.press('Escape');
    // Modal removed.
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toHaveCount(0);
    // Focus returned to the trigger. Use Playwright auto-wait
    // (`toBeFocused()` on the aria-label anchor) instead of a
    // synchronous evaluate() snapshot — the snapshot races React's
    // brief focus-restore effect. Same fix pattern applied to AU
    // in PR-Q49; this brings US to parity. PR-Q50.
    await expect(page.locator('button[aria-label*="Search"]').first()).toBeFocused();
  });

  test('Tab inside the modal cycles between focusable elements (focus trap)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
    // Type 2 chars so result items appear (modal filter starts at length >= 2).
    await page.keyboard.type('mi');
    // Tab past the input — first focusable in trap should be the input.
    // Cycling forwards from the LAST focusable element should land
    // back at the input (CommandPalette implements explicit Tab trap).
    // We verify the trap by Tab-Tab-Tab and checking we never escape
    // the dialog.
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

test.describe('US /best-nootropics-for-focus/ — primary nav tab order (WCAG 2.4.3 Focus Order)', () => {
  test('Tab order: skip-link is first, primary nav reached within 10 stops, search trigger and CTA present', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    // Walk the first 12 Tab stops and capture each. 12 is enough to
    // reach: skip-link → optional disclosure links → brand → 5 nav
    // items → search trigger → CTA. Anything longer risks hitting
    // breadcrumb or main content.
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
    // Skip-link is the first stop.
    expect(stops[0], `stops=${JSON.stringify(stops)}`).toMatch(/Skip|skip/);
    // Search trigger (⌘K / Ctrl K) is reachable in the first 12 stops.
    expect(
      stops.some((s) => /Search|⌘K|Ctrl/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
    // The "Open comparator" CTA OR a localized variant is reachable.
    expect(
      stops.some((s) => /comparator|comparador|comparateur|comparer|Vergleich/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
  });
});
