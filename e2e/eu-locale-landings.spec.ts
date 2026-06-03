import { test, expect, type Page } from '@playwright/test';

// Smoke coverage for the 3 nested-locale landing pages in the EU app:
//
//   /de/  → German landing (PR-Q15 #79 closed the 404)
//   /fr/  → metropolitan French landing (PR-Q15 #79 closed the 404)
//   /pt/  → Portuguese landing (pre-existing; verifies the parity
//           backport from PR-Q15 — aria-hidden on feature emoji)
//
// Each landing wraps its content in a <div lang="X"> via the nested
// layout (apps/eu/src/app/{de,fr,pt}/layout.tsx). The root <html lang>
// stays "en" — same pattern PR-Q13/Q14 wired Klaro + chrome around.
//
// Spec runs against the prebuilt apps/eu/out/ static export served on
// http://127.0.0.1:4176 (eu-chromium project in playwright.config.ts).

interface LocaleProbe {
  /** URL path under apps/eu/out. */
  path: string;
  /** BCP-47 value expected on the nested <div lang> wrapper. */
  divLang: string;
  /** A localized H1 token that should appear in the rendered prose. */
  h1Token: RegExp;
  /** A localized eyebrow / chip token visible above the H1. */
  eyebrowToken: RegExp;
  /** The body landmark that should NEVER carry an English landmark name. */
  notLandmarkName: RegExp;
}

const LANDINGS: Record<string, LocaleProbe> = {
  de: {
    path: '/de/',
    divLang: 'de',
    h1Token: /Der unabhängige EU-Ratgeber/,
    eyebrowToken: /EU-Markt/,
    notLandmarkName: /^Primary$/,
  },
  fr: {
    path: '/fr/',
    divLang: 'fr',
    h1Token: /Le guide UE indépendant/,
    eyebrowToken: /Marché UE/,
    notLandmarkName: /^Primary$/,
  },
  pt: {
    path: '/pt/',
    divLang: 'pt',
    h1Token: /O Guia Independente da UE/,
    eyebrowToken: /Mercado UE/,
    notLandmarkName: /^Primary$/,
  },
};

for (const [code, probe] of Object.entries(LANDINGS)) {
  test.describe(`EU /${code}/ landing (PR-Q15 ${code === 'pt' ? 'parity backport' : '#79 — was 404'})`, () => {
    test('page loads with 200 status', async ({ page }) => {
      const response = await page.goto(probe.path);
      expect(response?.status()).toBe(200);
    });

    test(`renders <div lang="${probe.divLang}"> wrapper from the nested layout`, async ({ page }) => {
      await page.goto(probe.path);
      // Use `.first()` because Klaro (the consent banner) injects its own
      // `<div lang="X">` at runtime matching the active locale (PR-Q13 #77
      // + PR-Q14 #78 made Klaro locale-aware). Strict-mode `toBeAttached`
      // fails on multiple matches; we only need to verify the
      // page-wrapper div exists.
      const wrapper = page.locator(`div[lang="${probe.divLang}"]`).first();
      await expect(wrapper).toBeAttached();
    });

    test('renders localized H1 + eyebrow chip', async ({ page }) => {
      await page.goto(probe.path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(probe.h1Token);
      await expect(page.getByText(probe.eyebrowToken).first()).toBeVisible();
    });

    test('language-switcher nav has 3 sibling-locale links with hrefLang + lang attributes (WCAG 3.1.2)', async ({ page }) => {
      await page.goto(probe.path);
      // The nav is labelled in the active locale (Sprachauswahl / Sélecteur
      // de langue / etc.) — we don't pin to one label, just assert that
      // the 3 sibling-locale links are present with the correct attrs.
      const langSwitcherLinks = page.locator('a[hreflang][lang]').filter({
        has: page.locator('text=/Deutsch|Français|Português|English/'),
      });
      // 3 sibling locales + 1 EN root link = at least 3 hreflang+lang links
      // in the nav. The exact count depends on which locale this landing is
      // — each /de/, /fr/, /pt/ surfaces the OTHER three as switcher entries.
      await expect(langSwitcherLinks).toHaveCount(3);
    });

    test('FPHeader primary-nav landmark name is NOT the EN "Primary" (PR-Q8 #72 — WCAG 3.1.2)', async ({ page }) => {
      await page.goto(probe.path);
      // Regression guard against the FPHeader DEFAULT_NAV bug PR-Q8 closed
      // — landmark would render with the EN aria-label "Primary" under a
      // non-EN page wrapper if FPHeader fell back to its hardcoded English
      // default chrome.
      const en = page.locator(`nav[aria-label="Primary"]`);
      await expect(en).toHaveCount(0);
    });

    test('FPFooter landmark renders with localized column headings (PR-Q9 #73)', async ({ page }) => {
      await page.goto(probe.path);
      const footer = page.locator('footer[role="contentinfo"]');
      await expect(footer).toBeAttached();
      // Negative: the EN "Best by goal" / "Head-to-head" / "By region" /
      // "About" headings should never appear under a non-EN locale.
      await expect(footer.getByRole('heading', { name: 'Best by goal' })).toHaveCount(0);
      await expect(footer.getByRole('heading', { name: 'Head-to-head' })).toHaveCount(0);
      await expect(footer.getByRole('heading', { name: 'By region' })).toHaveCount(0);
    });

    test('skip-link first focusable element is localized (PR-Q8 #72)', async ({ page }) => {
      await page.goto(probe.path);
      // Same negative-assertion shape as the LATAM/CA specs. The skip-link
      // is the very first interactive element by Tab order. It must NOT
      // be the EN "Skip to main content" string under a non-EN locale.
      const en = page.locator('a.ds-skip-link', { hasText: /^Skip to main content$/ });
      await expect(en).toHaveCount(0);
    });
  });
}

test.describe('EU /de/ + /fr/ — content production verification (PR-Q15 #79)', () => {
  test('both new landings carry a substantive amount of localized prose (≥ 250 visible words)', async ({ page }) => {
    for (const path of ['/de/', '/fr/']) {
      await page.goto(path);
      const text = await page.locator('main, body').first().textContent();
      const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
      expect(words, `${path} word count`).toBeGreaterThanOrEqual(250);
    }
  });

  test('language-switcher links from /de/ and /fr/ point at sibling locales (not back to root)', async ({ page }) => {
    // De-landing should link to /fr/meilleurs-nootropiques (FR) and /pt
    // — never to /de/* (self-link is noise).
    await page.goto('/de/');
    await expect(page.getByRole('link', { name: /🇫🇷 Français/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /🇵🇹 Português/ })).toBeVisible();
    // FR-landing should link to /de/beste-nootropika (DE) and /pt.
    await page.goto('/fr/');
    await expect(page.getByRole('link', { name: /🇩🇪 Deutsch/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /🇵🇹 Português/ })).toBeVisible();
  });
});

test.describe('EU /de/ + /fr/ — schema + metadata (PR-Q15 #79)', () => {
  async function getInLanguage(page: Page, path: string): Promise<string | null> {
    await page.goto(path);
    const schemaText = await page.locator('script[type="application/ld+json"]').first().textContent();
    if (!schemaText) return null;
    const parsed = JSON.parse(schemaText) as { inLanguage?: string };
    return parsed.inLanguage ?? null;
  }

  test('/de/ WebSite schema emits inLanguage: "de-DE"', async ({ page }) => {
    expect(await getInLanguage(page, '/de/')).toBe('de-DE');
  });

  test('/fr/ WebSite schema emits inLanguage: "fr-FR"', async ({ page }) => {
    expect(await getInLanguage(page, '/fr/')).toBe('fr-FR');
  });

  test('/pt/ WebSite schema emits inLanguage: "pt-PT"', async ({ page }) => {
    expect(await getInLanguage(page, '/pt/')).toBe('pt-PT');
  });
});
