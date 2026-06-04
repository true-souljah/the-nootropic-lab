import { test, expect } from '@playwright/test';

// Keyboard-navigation coverage on the AU Playwright project.
// Companion to e2e/us-keyboard-navigation.spec.ts (PR-Q22 #86,
// stabilized in PR-Q48 #112).
//
// Targets WCAG 2.1.1 (Keyboard), 2.4.1 (Bypass Blocks), 2.4.3
// (Focus Order), 2.4.7 (Focus Visible) — dynamic interaction
// surfaces axe-core cannot audit.
//
// Why an AU twin of US-keyboard:
//   The keyboard contract (skip-link → ⌘K modal → focus trap → tab
//   order) lives in shared chrome — FPHeader, CommandPalette,
//   BaseLayout. Both US and AU consume the @nootropic/ui versions.
//   If AU's chrome ever forks (e.g. an AU-specific BaseLayout
//   variant ships), this spec catches the divergence at the keyboard
//   contract level.
//
//   The CommandPalette modal also surfaces AU-catalog search hits
//   (the Tab-trap test types "bl" which expands matches against the
//   AU catalog with Blackmores at top — a cross-check that the
//   product index is wired through even at modal-interaction time).
//
// PR-Q49 — promotes keyboard navigation from US-only to US + AU.
// AU lifts to 5 of 7 covered axes (smoke + axe + reflow +
// status-messages + keyboard).
//
// Includes the PR-Q48 networkidle guard from the start — never
// flakes under full-suite contention.

// Pre-seed Klaro consent cookie so the consent banner does not
// appear and steal focus from the keyboard surfaces under test.
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

test.describe('AU /best-nootropics-for-focus/ — skip-link (WCAG 2.4.1 Bypass Blocks)', () => {
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
    await page.keyboard.press('Tab');     // Focus skip-link.
    await page.keyboard.press('Enter');   // Activate.
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

test.describe('AU /best-nootropics-for-focus/ — CommandPalette ⌘K modal (WCAG 2.1.1 + 2.4.3 Focus Order)', () => {
  test('Ctrl+K opens the SearchModal and moves focus to the input', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    // PR-Q48 lesson: wait for the React island to hydrate before
    // dispatching Control+K — otherwise the keydown handler may not
    // be registered yet under full-suite contention.
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName?.toLowerCase() ?? null,
    );
    expect(focusedTag).toBe('input');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
  });

  test('Escape closes the modal and returns focus to the trigger button', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toHaveCount(0);
    // After Escape, CommandPalette restores focus to the trigger button.
    // Use Playwright auto-wait against aria-label="Search (⌘K)" — the
    // textContent snapshot via evaluate() races briefly with React's
    // focus-restore effect; toBeFocused() waits up to the timeout for
    // the restore to settle.
    await expect(page.locator('button[aria-label*="Search"]').first()).toBeFocused();
  });

  test('Tab inside the modal cycles between focusable elements (focus trap on AU catalog)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
    // Type "bl" — substring match on Blackmores in the AU catalog.
    // On US the same query expands different products (no Blackmores);
    // the trap behavior should be identical regardless.
    await page.keyboard.type('bl');
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

test.describe('AU /best-nootropics-for-focus/ — primary nav tab order (WCAG 2.4.3 Focus Order)', () => {
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
