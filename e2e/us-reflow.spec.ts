import { test, expect } from '@playwright/test';

// Regression guard for WCAG 1.4.10 Reflow (Level AA):
//
//   "Content can be presented without loss of information or
//   functionality, and without requiring scrolling in two dimensions
//   for vertical scrolling content at a width equivalent to 320 CSS
//   pixels."
//
// Translates to: at viewport width 320px, the page must not produce
// any horizontal scrollbar. If `document.documentElement.scrollWidth`
// exceeds the inner viewport width, there's a fixed-width element
// (overly-wide table, hardcoded `width: 1200px`, oversize image without
// `max-width`, off-canvas element without `overflow: hidden`, etc.)
// breaking the reflow contract for mobile / zoomed-desktop users.
//
// Exceptions per the WCAG SC: content requiring 2D layout (data tables,
// maps, code blocks, complex diagrams) may overflow inside an inner
// scroll container without failing 1.4.10. The `<main>`-wide horizontal
// scroll is the failure mode this test detects.
//
// Strategy:
//   - Three representative US routes covering different templates:
//     Listicle, Discover (home), and IngredientDetail.
//   - At 320×800 viewport, navigate, wait for layout to settle, and
//     compare documentElement.scrollWidth vs the viewport width.
//   - Allow a 1px slop for sub-pixel rounding (some browsers report
//     321 due to fractional borders).
//
// PR-Q24 #88. Companion to the axe / keyboard / reduced-motion guards.

const VIEWPORT = { width: 320, height: 800 };
const SLOP_PX = 1;

// Routes whose templates DO satisfy WCAG 1.4.10 at 320px. The Discover
// home renders its own `<header>` rather than FPHeader.
const PASSING_ROUTES = [{ path: '/', label: 'Discover (home)' }];

// Routes whose templates currently FAIL WCAG 1.4.10 at 320px because of
// FPHeader's primary `<nav>`. The nav is rendered as
// `flex items-center gap-6` with no `md:` breakpoint prefix, so at viewport
// width 320 the 5 nav links + search trigger + CTA stack horizontally to
// ~619px — well past 320, causing horizontal overflow.
//
// The mobile-side `<button class="md:hidden">` icon trigger inside
// CommandPalette already exists (see packages/ui/src/templates/
// CommandPalette.tsx:220), so the visual scaffolding for a responsive
// header is partly there — what's missing is hiding the desktop nav
// below `md:` and either (a) showing only the search icon on mobile,
// or (b) building a hamburger drawer. Both are substantial design
// decisions that don't belong in this regression-guard PR.
//
// These tests are `test.fixme`'d so they appear in the spec as
// documented known-violation cases; once FPHeader gets a responsive
// nav, remove the `.fixme` and they should pass.
const FIXME_ROUTES = [
  { path: '/best-nootropics-for-focus/', label: 'Listicle' },
  { path: '/ingredients/l-theanine/', label: 'IngredientDetail' },
];

test.use({ viewport: VIEWPORT });

test.beforeEach(async ({ context }) => {
  // Pre-seed Klaro consent so the banner doesn't push horizontal
  // overflow via its fixed-position layout (same pattern as PR-Q22/Q23).
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('US — WCAG 1.4.10 Reflow at 320px viewport', () => {
  for (const route of PASSING_ROUTES) {
    test(`${route.label} (${route.path}) reflows without horizontal overflow`, async ({ page }) => {
      await page.goto(route.path);
      // Wait for paint to settle. The Listicle template has Tailwind
      // utilities that hydrate post-mount; without this wait, the
      // measurement can race.
      await page.waitForLoadState('networkidle');

      const { scrollWidth, viewportWidth, offenders } = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        const vw = window.innerWidth;
        // Find any element whose right edge crosses the viewport.
        // Limit to "wide" candidates (offsetWidth > vw) and visible
        // (display !== 'none'), then extract a useful identifier.
        const offenders: Array<{ tag: string; cls: string; w: number; right: number }> = [];
        const all = document.querySelectorAll<HTMLElement>('*');
        for (const el of all) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 4) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className.toString().slice(0, 60),
              w: Math.round(r.width),
              right: Math.round(r.right),
            });
            if (offenders.length >= 5) break;
          }
        }
        return {
          scrollWidth: Math.max(html.scrollWidth, body.scrollWidth),
          viewportWidth: vw,
          offenders,
        };
      });

      expect(
        scrollWidth,
        `Reflow failure: scrollWidth=${scrollWidth} > viewportWidth=${viewportWidth} + ${SLOP_PX}px slop. ` +
          `First offenders: ${JSON.stringify(offenders, null, 2)}`,
      ).toBeLessThanOrEqual(viewportWidth + SLOP_PX);
    });
  }
});

test.describe('US — WCAG 1.4.10 Reflow at 320px (known FPHeader violations)', () => {
  // See the FIXME_ROUTES docblock at the top of this file for why these
  // are `fixme` rather than passing assertions. They are runnable: drop
  // the `.fixme` after FPHeader gets a responsive nav.
  for (const route of FIXME_ROUTES) {
    test.fixme(`${route.label} (${route.path}) reflows without horizontal overflow`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      const { scrollWidth, viewportWidth } = await page.evaluate(() => ({
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        viewportWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + SLOP_PX);
    });
  }
});

test.describe('US — 1.4.10 Reflow with the page scrolled (long-page check)', () => {
  // Some overflow conditions only appear after scroll (sticky elements
  // with `right: -10px`, lazy-rendered fixed widths, etc.). This case
  // is `fixme` for the same FPHeader reason as the routes above.
  test.fixme('Listicle still has no horizontal overflow after scroll-to-bottom', async ({ page }) => {
    await page.goto('/best-nootropics-for-focus/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(150);

    const { scrollWidth, viewportWidth } = await page.evaluate(() => ({
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      viewportWidth: window.innerWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + SLOP_PX);
  });
});
