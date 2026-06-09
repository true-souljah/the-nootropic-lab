import { test, expect } from '@playwright/test';

// Regression guard for WCAG 2.5.8 Target Size (Minimum) — Level AA:
//
//   "The size of the target for pointer inputs is at least 24×24 CSS
//   pixels, except when:
//     - Spacing: the target offset is at least 24px to every adjacent
//       target;
//     - Equivalent: the function can be achieved through a different
//       control on the same page that meets this criterion;
//     - Inline: the target is in a sentence or block of text;
//     - User agent control: the size is determined by the user agent
//       and is not modified by the author;
//     - Essential: a particular presentation of the target is
//       essential or is legally required for the information being
//       conveyed."
//
// The probe walks every focusable element on a representative public
// page (US Listicle template) at 320px viewport (mobile, where touch-
// target violations matter most) and reports any whose bounding box
// drops below 24×24 CSS px AND who don't satisfy the Inline exception
// (heuristic: parent is a sentence/paragraph/list-item with text).
//
// Inline exception coverage: links inside breadcrumb `<li>`, body
// paragraphs, list items, or footer column lists are considered inline
// and pass automatically — these are textual hyperlinks where 24×24
// would force an unnatural pill shape around words. The probe excludes
// them via a parent-node tag-name allowlist.
//
// PR-Q27 #91 — joins axe / keyboard / reduced-motion / reflow as the
// 5th independent WCAG coverage axis for the US Playwright project.

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
  // Skip Klaro banner so the test isn't fighting consent overlay focus.
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('US — WCAG 2.5.8 Target Size (Minimum) at 320px viewport', () => {
  test('every non-inline interactive element has a bounding box of at least 24×24 CSS px', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');

    const offenders: Offender[] = await page.evaluate((min: number) => {
      // Inline-exception parent tags. Per WCAG 2.5.8: "the target is
      // in a sentence or block of text" — covers anchor links inside
      // paragraphs, list items, headings, table cells. The footer
      // and breadcrumb consist of lists of textual links; the inline
      // exception applies there too.
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
      // Detect "inline text link" — an `<a>` whose only renderable
      // content is text (no images, no icons, no SVGs, no nested
      // interactive widgets). These satisfy the Inline exception
      // regardless of parent tag because their visual footprint IS
      // their text content. Catches the common case of styled
      // textual hyperlinks like "Source →" or "← Back to X" that
      // live inside a `<div>` wrapper.
      function isInlineTextLink(el: HTMLElement): boolean {
        if (el.tagName.toLowerCase() !== 'a') return false;
        if (el.getAttribute('role') === 'button') return false;
        // Reject if the link contains any non-text/icon content
        // bigger than 4×4 px.
        const visualChildren = el.querySelectorAll('img, svg, picture, canvas, video');
        for (const v of visualChildren) {
          const vr = (v as HTMLElement).getBoundingClientRect();
          if (vr.width > 4 || vr.height > 4) return false;
        }
        // Must have actual text content (≥ 1 non-whitespace char).
        const text = (el.textContent ?? '').trim();
        if (text.length === 0) return false;
        return true;
      }

      const interactive = document.querySelectorAll<HTMLElement>(selectors.join(','));
      for (const el of interactive) {
        // Skip elements not actually rendered (display: none, visibility,
        // hidden ancestors, zero-dim from `hidden md:flex` etc.).
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // Skip elements inside an inline-context parent.
        const parent = el.parentElement;
        const parentTag = parent?.tagName.toLowerCase() ?? '';
        if (INLINE_PARENT_TAGS.has(parentTag)) continue;
        // Skip inline text links (Inline exception covers them
        // regardless of parent — see isInlineTextLink docblock).
        if (isInlineTextLink(el)) continue;
        // Below the AA minimum on either dimension counts.
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
