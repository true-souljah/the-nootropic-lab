import { test, expect } from '@playwright/test';

// GCC heading-outline / document-structure probe. PR-Q74.
//
// 12th independent axis. First STRUCTURE-VALIDATION probe of the
// content hierarchy itself (vs. AT-tree from Q67 which validates
// landmark presence; cognitive from Q70 which validates abbreviation
// expansion).
//
// WCAG 1.3.1 (Info and Relationships) + 2.4.6 (Headings and Labels):
//
//   Heading hierarchy must be programmatically determinable and
//   logical. axe-core catches "no h1" and "empty heading" but
//   doesn't validate the OUTLINE — it'll pass a page with
//   h1 → h3 → h2 → h4 (skipped + reversed levels) as long as each
//   heading has content. Screen-reader users navigating by
//   heading-level (NVDA H key, JAWS H key, VoiceOver Control-Option-
//   Cmd-H) hear a broken outline.
//
// Probes the US regulatory pillar /are-nootropics-fda-approved/ —
// editorial-heavy page with multiple sections + ToC-style content.
// The most likely class of bug here: a content author bumped a
// section heading from h2 to h3 without checking the outline,
// creating a skipped level (h1 → h3) or a reverse (h3 → h2).
//
// Per the bug-discovery model: NEW category = bug. Q67/Q69/Q70/
// Q71a/Q71b all found bugs on first probe.
//
// 3 invariants probed:
//   1. Exactly ONE h1 exists.
//   2. No heading levels skipped (h1 → h2 OK; h1 → h3 NOT OK).
//   3. Document starts with h1 (no h2 before any h1).

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

interface HeadingNode {
  level: number;
  text: string;
}

async function captureOutline(page: import('@playwright/test').Page, url: string): Promise<HeadingNode[]> {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  return page.evaluate(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'),
    );
    return headings.map((h) => ({
      level: parseInt(h.tagName.substring(1), 10),
      text: (h.textContent ?? '').trim().slice(0, 80),
    }));
  });
}

const ROUTES = [
  { path: '/halal-certified-nootropics/', template: 'GCC halal pillar' },
  { path: '/best-nootropics-for-focus/', template: 'Listicle' },
  { path: '/mind-lab-pro-review/', template: 'ProductDetail (international brand)' },
  { path: '/nahdi-brain-boost-review/', template: 'GCC brand (Nahdi)' },
  { path: '/ingredients/l-theanine/', template: 'IngredientDetail' },
];

test.describe('GCC — heading outline / document structure', () => {
  for (const route of ROUTES) {
    test(`${route.path} (${route.template}) has exactly one h1`, async ({ page }) => {
      const outline = await captureOutline(page, route.path);
      const h1s = outline.filter((h) => h.level === 1);
      expect(
        h1s.length,
        `Page must have exactly ONE h1 (WCAG 1.3.1 / 2.4.6). Got ${h1s.length}.\n` +
          `Outline:\n${JSON.stringify(outline, null, 2)}`,
      ).toBe(1);
    });

    test(`${route.path} (${route.template}) has no skipped heading levels`, async ({ page }) => {
      const outline = await captureOutline(page, route.path);
      const skips: Array<{ from: number; to: number; index: number; text: string }> = [];
      let prevLevel = 0;
      outline.forEach((h, idx) => {
        if (h.level > prevLevel + 1 && prevLevel > 0) {
          skips.push({ from: prevLevel, to: h.level, index: idx, text: h.text });
        }
        prevLevel = h.level;
      });
      expect(
        skips,
        `Heading outline skips levels (WCAG 1.3.1 / 2.4.6). Each skip is a screen-reader heading-key navigation gap:\n${JSON.stringify(skips, null, 2)}\n\nFull outline:\n${JSON.stringify(outline, null, 2)}`,
      ).toHaveLength(0);
    });

    test(`${route.path} (${route.template}) outline starts with h1 (no h2+ before any h1)`, async ({ page }) => {
      const outline = await captureOutline(page, route.path);
      const firstHeading = outline[0];
      expect(firstHeading, 'Page must have at least one heading').toBeDefined();
      expect(
        firstHeading?.level,
        `First heading on the page must be h1, got h${firstHeading?.level}: "${firstHeading?.text}"`,
      ).toBe(1);
    });
  }
});
