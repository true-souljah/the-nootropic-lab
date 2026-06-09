import { test, expect } from '@playwright/test';

// Regression guard for WCAG 2.5.8 Target Size (Minimum) — Level AA
// on the CA Playwright project. Twin of us-target-size
// (PR-Q27 #91).
//
// Walks every focusable interactive element on /best-nootropics-for-
// focus/ at 320px viewport (mobile, where touch-target violations
// matter most) and reports any whose bounding box drops below 24×24
// CSS px AND who don't satisfy the Inline exception (links inside
// paragraphs, list items, headings, table cells; or text-only `<a>`
// with no nested visual children).
//
// PR-Q57 portfolio sweep — promotes US-only coverage (PR-Q27) to
// all 8 regions in a single mechanical PR. Closes the target-size
// axis at 8/8 and brings ALL 7 axes to universal coverage.
//
// Like reduced-motion (PR-Q56), the target-size assertion has no
// region-specific surface area: the chrome (FPHeader, CommandPalette
// trigger, primary nav, footer, breadcrumb, Listicle card actions)
// is shared via @nootropic/ui and renders identically across all 8
// region builds.

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
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('CA — WCAG 2.5.8 Target Size (Minimum) at 320px viewport', () => {
  test('every non-inline interactive element has a bounding box of at least 24×24 CSS px', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    const offenders: Offender[] = await page.evaluate((min: number) => {
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

    expect(
      offenders,
      `Target-size offenders (< ${TARGET_MIN}×${TARGET_MIN}px): ${JSON.stringify(offenders, null, 2)}`,
    ).toHaveLength(0);
  });
});
