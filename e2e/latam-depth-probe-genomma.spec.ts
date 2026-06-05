import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// LATAM depth probe on the region-only Genomma
// ProductDetail. PR-Q64.
//
// Fifth DEPTH PR after the 8-axis universal-coverage milestone
// (PR-Q59 #123). First CROSS-REGION depth PR. Joins:
//
//   PR-Q60 → US axe template-depth → 0 portfolio bugs
//   PR-Q61 → US target-size template-depth → 0 portfolio bugs
//   PR-Q62 → US focus-appearance template-depth → 0 portfolio bugs
//   PR-Q63 → US keyboard template-depth (Tabs primitive) → 0 portfolio bugs
//
// The Q60-Q63 streak validated that the SHARED design-system
// substrate (@nootropic/ui templates + tokens) is structurally
// accessible at template depth. This PR probes the SECOND-MOST-
// LIKELY bug source per the bug-discovery model: per-region
// content drift.
//
// Specifically: /genomma-lab-neuriplus-review/ on AU. This route
// only exists in products-au.ts (Genomma is ANZ-exclusive in
// this catalog). The CONTENT (alt text, TGA copy, vendor links,
// ingredient grid descriptions) is hand-written for the AU market
// and isn't validated by any spec yet.
//
// If content drift exists, this is where it surfaces — not in the
// shared template substrate. Per the bug-discovery model, the hit
// rate here may be higher than the Q60-Q63 0% baseline because:
//   - The substrate Q60-Q63 probed is shared chrome
//   - This route's body content is region-unique editorial
//   - axe catches missing alt, missing form labels, role
//     mismatches — all of which are CONTENT-AUTHORED issues
//   - target-size + focus-appearance on the same route may
//     surface custom buttons / CTAs added without using design-
//     system primitives
//
// 3 depth axes probed on the same route:
//   1. axe (semantic / WCAG 2.1 A/AA serious + critical)
//   2. target-size (WCAG 2.5.8 24×24 at 320px viewport)
//   3. focus-appearance (WCAG 2.4.13 ≥ 2px outline on Tab walk)

const SERIOUSNESS = ['serious', 'critical'] as const;
const TARGET_MIN = 24;
const MIN_OUTLINE_WIDTH_PX = 2;

interface Offender {
  tag: string;
  role: string | null;
  label: string | null;
  text: string;
  w: number;
  h: number;
  parentTag: string;
}

interface FocusedProbe {
  index: number;
  tag: string;
  ariaLabel: string | null;
  text: string;
  outlineWidth: string;
  outlineStyle: string;
  boxShadow: string;
  parsedWidthPx: number;
  hasBoxShadowRing: boolean;
}

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

async function runAxe(page: Page, url: string): Promise<AxeResults> {
  await page.goto(url);
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
}

function blockingViolations(results: AxeResults): Result[] {
  return results.violations.filter((v) =>
    SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
  );
}

function summarize(violations: Result[]): string {
  if (violations.length === 0) return '0 blocking violations';
  return violations
    .map((v) => {
      const nodes = v.nodes
        .slice(0, 3)
        .map((n) => `  - ${JSON.stringify(n.target)}: ${n.html.slice(0, 100)}`)
        .join('\n');
      return `[${v.impact}] ${v.id}: ${v.description}\n${nodes}`;
    })
    .join('\n\n');
}

test.describe('LATAM depth probe — region-only /genomma-lab-neuriplus-review/ across 3 WCAG axes', () => {
  test('axe (WCAG 2.1 A/AA serious + critical) → 0 violations', async ({ page }) => {
    const results = await runAxe(page, '/genomma-lab-neuriplus-review/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('target-size (WCAG 2.5.8 — 24×24 at 320px viewport) → 0 offenders', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/genomma-lab-neuriplus-review/');
    await page.waitForLoadState('networkidle');

    const offenders: Offender[] = await page.evaluate((min: number) => {
      const INLINE_PARENT_TAGS = new Set([
        'p', 'li', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'td', 'th', 'caption', 'figcaption', 'blockquote', 'cite',
        'em', 'strong', 'sup', 'sub', 'small', 'address',
      ]);
      const out: Offender[] = [];
      const selectors = [
        'a[href]', 'button', 'input:not([type="hidden"])', 'select', 'textarea',
        '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="radio"]',
        '[role="tab"]', '[role="switch"]', '[role="menuitem"]',
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
      `Target-size offenders on Genomma ProductDetail (< ${TARGET_MIN}×${TARGET_MIN}px):\n${JSON.stringify(offenders, null, 2)}`,
    ).toHaveLength(0);
  });

  test('focus-appearance (WCAG 2.4.13 — ≥ 2px outline) → 0 offenders across 12 Tab stops', async ({ page }) => {
    await page.goto('/genomma-lab-neuriplus-review/');
    await page.waitForLoadState('networkidle');

    const probes: FocusedProbe[] = [];
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const probe = await page.evaluate(
        (idx: number) => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = window.getComputedStyle(el);
          const outlineWidth = cs.outlineWidth;
          const widthPx = parseFloat(outlineWidth);
          const boxShadow = cs.boxShadow;
          const hasBoxShadowRing =
            boxShadow !== 'none' &&
            /(\d+(?:\.\d+)?)px/.test(boxShadow) &&
            (() => {
              const matches = boxShadow.match(/(\d+(?:\.\d+)?)px/g) ?? [];
              return matches.some((m) => parseFloat(m) >= 2);
            })();
          return {
            index: idx,
            tag: el.tagName.toLowerCase(),
            ariaLabel: el.getAttribute('aria-label'),
            text: (el.textContent ?? '').trim().slice(0, 50),
            outlineWidth,
            outlineStyle: cs.outlineStyle,
            boxShadow,
            parsedWidthPx: isNaN(widthPx) ? 0 : widthPx,
            hasBoxShadowRing,
          };
        },
        i,
      );
      if (probe) probes.push(probe);
    }

    const offenders = probes.filter((p) => {
      const hasOutlineRing =
        (p.outlineStyle === 'solid' || p.outlineStyle === 'auto') && p.parsedWidthPx >= MIN_OUTLINE_WIDTH_PX;
      return !(hasOutlineRing || p.hasBoxShadowRing);
    });

    expect(
      offenders,
      `Focus Appearance offenders on Genomma ProductDetail (no visible ≥ ${MIN_OUTLINE_WIDTH_PX}px ring):\n${JSON.stringify(offenders, null, 2)}`,
    ).toHaveLength(0);
  });
});
