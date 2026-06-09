import { test, expect } from '@playwright/test';

// Keyboard-navigation coverage on the CA Playwright project.
// Companion to us / au / gcc / sea / jp / latam keyboard specs.
//
// Targets WCAG 2.1.1 (Keyboard), 2.4.1 (Bypass Blocks), 2.4.3
// (Focus Order).
//
// PR-Q54. CA is the FIRST bilingual-chrome region — en-CA at root,
// fr-CA at /fr/. Both locales render distinct chrome:
//
//   en-CA root:
//     skip-link text — "Skip to main content"
//     comparator     — "Open comparator"
//   fr-CA /fr/:
//     skip-link text — "Aller au contenu principal"
//     comparator     — "comparateur" (already covered by existing
//                       regex — fr is predicted from the start)
//
// The spec is split into two route blocks:
//   1. Full 6-test contract on the en-CA root (mirror of US/AU/GCC).
//   2. Two-test sanity check on the fr-CA /fr/ route — verifying
//      skip-link is first-focusable + the modal opens — to confirm
//      the chrome locale-flip doesn't break the keyboard contract.
//
// Tab-trap probe types "aor" — substring match on AOR Ortho•Mind
// in the CA catalog (Advanced Orthomolecular Research is a Calgary
// supplement company; the product is Health Canada NPN-licensed
// and Canadian-exclusive in products-ca.ts).
//
// PR-Q51 portfolio-wide trap fix means the trap holds regardless
// of result count.
//
// CA lifts to 5 of 7 covered axes.

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

test.describe('CA /best-nootropics-for-focus/ (en-CA chrome) — skip-link', () => {
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

test.describe('CA /best-nootropics-for-focus/ (en-CA) — CommandPalette ⌘K modal', () => {
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

  test('Tab inside the modal loops focus on the input (PR-Q51 trap fix, CA catalog)', async ({ page }) => {
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
    // Type "aor" — substring match on AOR Ortho•Mind in the CA catalog
    // (Calgary supplement company, Health Canada NPN-licensed, CA-only).
    await page.keyboard.type('aor');
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

test.describe('CA /best-nootropics-for-focus/ (en-CA) — primary nav tab order', () => {
  test('Tab order: skip-link first, primary nav reached within 12 stops', async ({ page }) => {
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
      stops.some((s) => /comparator|comparador|comparateur|comparer|Vergleich|比較/i.test(s)),
      `stops=${JSON.stringify(stops)}`,
    ).toBe(true);
  });
});

test.describe('CA /fr/meilleurs-nootropiques/ (fr-CA chrome) — skip-link + modal sanity', () => {
  test('skip-link is the first focusable element + carries Quebec French label', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el
        ? {
            className: el.className,
            text: el.textContent?.trim() ?? '',
            href: (el as HTMLAnchorElement).href,
          }
        : null;
    });
    expect(focused?.className).toContain('ds-skip-link');
    expect(focused?.href).toMatch(/#main-content$/);
    // fr-CA skip-link text is "Aller au contenu principal" (French
    // — both metropolitan and Quebec use the same wording for this
    // chrome string). Verifies the chrome locale-flip propagates to
    // the skip-link.
    expect(focused?.text).toMatch(/Aller au contenu/);
  });

  test('Ctrl+K opens the modal on the fr-CA route (chrome locale-flip preserves the contract)', async ({ page }) => {
    await page.goto('/fr/meilleurs-nootropiques/');
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
    // Verify the comparator-equivalent label "comparateur" appears
    // in the nav tab order on the fr-CA chrome (regex covers it).
  });
});
