import { test, expect } from '@playwright/test';

// US target-size template-DEPTH extension. PR-Q61.
//
// Companion to e2e/us-target-size.spec.ts (PR-Q27 — chrome-shared
// Listicle on /best-nootropics-for-focus/) and the Q57 portfolio
// sweep that brought target-size to 8/8 regions (also chrome-shared
// route only).
//
// Extends WCAG 2.5.8 Target Size (Minimum) coverage to the four
// template surfaces no target-size spec currently touches. These
// are the SAME 4 routes PR-Q60 introduced for axe template-depth:
//
//   /mind-lab-pro-review/                    — ProductDetail
//                                              (tab strip — Reviews,
//                                              Pricing, Pillars, etc.;
//                                              CTAs; pros/cons grid)
//   /alpha-brain-vs-qualia-mind/             — HeadToHead (2-way
//                                              comparison table with
//                                              column toggles)
//   /alpha-brain-vs-mind-lab-pro-vs-noocube/ — ThreeWay (3-column
//                                              comparison table —
//                                              denser interactive
//                                              area than HeadToHead)
//   /ingredients/l-theanine/                 — IngredientDetail
//                                              (ScoreBar interactive
//                                              segments, source links)
//
// Why target-size on these surfaces is the highest-EV depth probe:
//   * Comparison tables are the DENSEST interactive surface in the
//     portfolio. Tightly-packed columns with toggle controls are
//     where small touch targets most commonly appear.
//   * ProductDetail's Tabs primitive (PR-Q38 reflow fix) has
//     ~5 tab buttons at ~80px wide × variable height. If any
//     drops below 24×24 at 320px viewport, the tap targets are
//     hard for motor-impaired users.
//   * Axe-core can flag "small target" but only as moderate severity
//     and only in a narrow set of cases; the explicit geometric
//     probe used by us-target-size catches violations the axe
//     spec already passed.
//
// PR-Q60's axe probe on these same 4 routes returned 0 violations.
// Target-size operates on different criteria (geometric, not
// semantic), so it may surface bugs axe missed — same Q37/Q38/Q41/
// Q51/Q58 pattern of new-axis × new-surface finding latent issues.

const VIEWPORT = { width: 320, height: 800 };
const TARGET_MIN = 24;

interface Offender {
  tag: string;
  role: string | null;
  label: string | null;
  text: string;
  w: number;
  h: number;
  parentTag: string;
}

test.use({ viewport: VIEWPORT });

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

async function probeOffenders(page: import('@playwright/test').Page, url: string): Promise<Offender[]> {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  return page.evaluate((min: number) => {
    const INLINE_PARENT_TAGS = new Set([
      'p', 'li', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'td', 'th', 'caption', 'figcaption', 'blockquote', 'cite',
      'em', 'strong', 'sup', 'sub', 'small', 'address',
    ]);

    const out: Offender[] = [];
    const selectors = [
      'a[href]',
      'button',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      '[role="button"]',
      '[role="link"]',
      '[role="checkbox"]',
      '[role="radio"]',
      '[role="tab"]',
      '[role="switch"]',
      '[role="menuitem"]',
    ];
    function isInlineTextLink(el: HTMLElement): boolean {
      if (el.tagName.toLowerCase() !== 'a') return false;
      if (el.getAttribute('role') === 'button') return false;
      const visualChildren = el.querySelectorAll('img, svg, picture, canvas, video');
      for (const v of visualChildren) {
        const vr = (v as HTMLElement).getBoundingClientRect();
        if (vr.width > 4 || vr.height > 4) return false;
      }
      const text = (el.textContent ?? '').trim();
      if (text.length === 0) return false;
      return true;
    }

    const interactive = document.querySelectorAll<HTMLElement>(selectors.join(','));
    for (const el of interactive) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const parent = el.parentElement;
      const parentTag = parent?.tagName.toLowerCase() ?? '';
      if (INLINE_PARENT_TAGS.has(parentTag)) continue;
      if (isInlineTextLink(el)) continue;
      if (r.width < min || r.height < min) {
        out.push({
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute('role'),
          label: el.getAttribute('aria-label'),
          text: (el.textContent ?? '').trim().slice(0, 50),
          w: Math.round(r.width * 100) / 100,
          h: Math.round(r.height * 100) / 100,
          parentTag,
        });
        if (out.length >= 10) break;
      }
    }
    return out;
  }, TARGET_MIN);
}

test.describe('US template-depth target-size — WCAG 2.5.8 (Minimum) at 320px', () => {
  test('/mind-lab-pro-review/ (ProductDetail tab strip + CTAs) passes 24×24', async ({ page }) => {
    const offenders = await probeOffenders(page, '/mind-lab-pro-review/');
    expect(
      offenders,
      `Target-size offenders on ProductDetail (< ${TARGET_MIN}×${TARGET_MIN}px): ${JSON.stringify(offenders, null, 2)}`,
    ).toHaveLength(0);
  });

  test('/alpha-brain-vs-qualia-mind/ (HeadToHead comparison table) passes 24×24', async ({ page }) => {
    const offenders = await probeOffenders(page, '/alpha-brain-vs-qualia-mind/');
    expect(
      offenders,
      `Target-size offenders on HeadToHead (< ${TARGET_MIN}×${TARGET_MIN}px): ${JSON.stringify(offenders, null, 2)}`,
    ).toHaveLength(0);
  });

  test('/alpha-brain-vs-mind-lab-pro-vs-noocube/ (ThreeWay 3-col table) passes 24×24', async ({ page }) => {
    const offenders = await probeOffenders(page, '/alpha-brain-vs-mind-lab-pro-vs-noocube/');
    expect(
      offenders,
      `Target-size offenders on ThreeWay (< ${TARGET_MIN}×${TARGET_MIN}px): ${JSON.stringify(offenders, null, 2)}`,
    ).toHaveLength(0);
  });

  test('/ingredients/l-theanine/ (IngredientDetail) passes 24×24', async ({ page }) => {
    const offenders = await probeOffenders(page, '/ingredients/l-theanine/');
    expect(
      offenders,
      `Target-size offenders on IngredientDetail (< ${TARGET_MIN}×${TARGET_MIN}px): ${JSON.stringify(offenders, null, 2)}`,
    ).toHaveLength(0);
  });
});
