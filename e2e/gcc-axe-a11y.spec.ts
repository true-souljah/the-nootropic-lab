import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on 3 representative GCC
// routes. Twin of jp/eu/latam/ca/au axe specs. PR-Q41.
//
// GCC has no nested locales (en-only chrome), so route diversity
// comes from template-shape and GCC-unique content surfaces:
//
//   /                              — GCC root home (PublicShell chrome)
//   /best-nootropics/              — BestOf with GCC catalog
//   /halal-certified-nootropics/   — GCC-exclusive pillar (no twin
//                                    on any other region)
//
// Why these 3:
//   * Root home exercises the shared chrome (Klaro banner, top nav,
//     CommandPalette mount).
//   * BestOf with GCC catalog carries Nahdi + Life Pharmacy + EYS
//     private-label entries plus SFDA / MOHAP regulatory chips. The
//     GCC catalog adds halal-friendly / porcine-free copy patterns
//     across the rank rows. PR-Q37 found the ds-faint Rank-label
//     contrast bug on AU's BestOf; if any GCC-catalog-specific
//     chip styling regresses contrast, this surface will catch it.
//   * /halal-certified-nootropics/ is a GCC-exclusive pillar
//     template — exercises text-on-color compliance chips, FAQ
//     accordion semantics, and methodology table structure that
//     no other region's axe spec touches.
//
// PR-Q39 #103 brought GCC to 7-of-8 covered regions with smoke
// only. This spec extends GCC to smoke + axe parity with EU/LATAM/
// CA/JP/AU.

const SERIOUSNESS = ['serious', 'critical'] as const;

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

test.describe('GCC routes — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/ (en GCC home) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/best-nootropics/ (GCC BestOf with SFDA + halal chips) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/best-nootropics/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/halal-certified-nootropics/ (GCC-exclusive pillar) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/halal-certified-nootropics/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('GCC routes — axe-core informational (logged, not failed)', () => {
  test('/halal-certified-nootropics/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/halal-certified-nootropics/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/halal-certified-nootropics/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
