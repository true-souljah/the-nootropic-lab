import { test, expect } from '@playwright/test';

// Keyboard-navigation coverage on the EU Playwright project.
// Companion to us / au / gcc / sea / jp / latam / ca keyboard specs.
//
// Targets WCAG 2.1.1 (Keyboard), 2.4.1 (Bypass Blocks), 2.4.3
// (Focus Order).
//
// PR-Q55 — closes the keyboard axis at 8/8. After this PR, 5 axes
// are universally covered: smoke (7/8 by design), axe (8/8),
// reflow (8/8), status-messages (8/8), keyboard (8/8).
//
// EU is the most-localized region — 4 chrome locales render
// distinct skip-link + comparator strings:
//
//   en-EU root /best-nootropics-for-focus/:
//     skip-link  — "Skip to main content"
//     comparator — "Open comparator"
//   de  /de/:    skip — "Zum Hauptinhalt springen"
//                comparator — "Vergleich"
//   fr  /fr/:    skip — "Aller au contenu principal"
//                comparator — "comparateur"
//   pt  /pt/:    skip — "Ir para o conteúdo principal"
//                comparator — "comparador"
//
// All 3 comparator variants are already in the existing regex.
// The skip-link regex is widened in this spec to cover the 3 new
// EU locale variants alongside EN, Saltar (es), and スキップ (ja).
//
// Spec layout:
//   1. Full 6-test contract on the en-EU root (mirror of US/AU/GCC).
//   2. Three single-test sanity blocks on /de/, /fr/, /pt/ —
//      each verifying skip-link is first-focusable + carries the
//      locale-specific text. Sufficient evidence that the chrome
//      locale-flip preserves the WCAG 2.4.1 contract on every
//      EU-shipped locale.
//
// Tab-trap probe types "braineffect" — substring match on BRAINEFFECT
// Focus in the EU catalog (BRAINEFFECT is a Berlin-based supplement
// company; the product is EU-exclusive in products-eu.ts and ships
// with German Lebensmittelverordnung compliance language). On every
// other region "braineffect" returns no matches.
//
// PR-Q51 portfolio-wide trap fix verified on EU's en-EU chrome.
// PR-Q54 PublicShell #main-content normalization means the de/fr/pt
// PublicShell-based landings now use the same skip-link target ID
// as every other route.

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

test.describe('EU /best-nootropics-for-focus/ (en-EU chrome) — skip-link', () => {
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

test.describe('EU /best-nootropics-for-focus/ (en-EU) — CommandPalette ⌘K modal', () => {
  test('Ctrl+K opens the SearchModal and moves focus to the input', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
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
    await expect(page.locator('button[aria-label*="Search"]').first()).toBeFocused();
  });

  test('Tab inside the modal loops focus on the input (PR-Q51 trap fix, EU catalog)', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Control+K');
    await expect(page.locator('[role="dialog"]:not(#klaro-cookie-notice)')).toBeAttached();
    // Type "braineffect" — substring match on BRAINEFFECT Focus in
    // the EU catalog (Berlin-based brand, EU-exclusive in
    // products-eu.ts with German Lebensmittelverordnung copy).
    await page.keyboard.type('braineffect');
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

test.describe('EU /best-nootropics-for-focus/ (en-EU) — primary nav tab order', () => {
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
    // Widened skip regex: EN + ES (Saltar) + JA (スキップ) + DE
    // (Zum Hauptinhalt) + FR (Aller au) + PT (Ir para).
    expect(stops[0], `stops=${JSON.stringify(stops)}`).toMatch(
      /Skip|skip|スキップ|Saltar|Zum Hauptinhalt|Aller au|Ir para/,
    );
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

// Nested-locale sanity blocks — verify the chrome locale-flip
// preserves the skip-link contract on de / fr / pt.

test.describe('EU /de/ (German chrome) — skip-link sanity', () => {
  test('skip-link is first-focusable + carries "Zum Hauptinhalt springen" label', async ({ page }) => {
    await page.goto('/de/');
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
    expect(focused?.text).toMatch(/Zum Hauptinhalt/);
  });
});

test.describe('EU /fr/ (French chrome) — skip-link sanity', () => {
  test('skip-link is first-focusable + carries "Aller au contenu principal" label', async ({ page }) => {
    await page.goto('/fr/');
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
    expect(focused?.text).toMatch(/Aller au contenu/);
  });
});

test.describe('EU /pt/ (Portuguese chrome) — skip-link sanity', () => {
  test('skip-link is first-focusable + carries "Ir para o conteúdo principal" label', async ({ page }) => {
    await page.goto('/pt/');
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
    expect(focused?.text).toMatch(/Ir para o conteúdo/);
  });
});
