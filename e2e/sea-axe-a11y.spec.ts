import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

// Automated axe-core accessibility checks on 3 representative SEA
// routes. Twin of jp/eu/latam/ca/au/gcc axe specs. PR-Q42.
//
// SEA has no nested locales (en-only chrome), so route diversity
// comes from template-shape + SEA-unique content:
//
//   /                                  — SEA root home (PublicShell)
//   /best-nootropics/                  — BestOf with SEA catalog
//   /halal-nootropics-indonesia-bpjph/ — SEA-exclusive BPJPH+JAKIM pillar
//
// Why these 3:
//   * Root home exercises the shared chrome (Klaro banner, nav,
//     CommandPalette mount). Catches any SEA-app-specific layout
//     drift.
//   * BestOf with SEA catalog carries NatureBell + EYS BrainMAX
//     plus per-country regulator chips (HSA / NPRA / BPOM / VFA).
//     Different chip set than GCC; if a SEA-catalog-specific chip
//     styling regresses contrast, this surface catches it.
//   * /halal-nootropics-indonesia-bpjph/ is a SEA-exclusive pillar
//     template — distinct from GCC's /halal-certified-nootropics/.
//     Two halal pillars across the portfolio: this one verifies
//     SEA's BPJPH (Indonesia mandatory since 2024) + JAKIM
//     (Malaysia) framing. PR-Q41 found the Sources component
//     "expand" contrast bug on the GCC halal pillar; SEA's twin
//     ships the same component but with different content.
//
// PR-Q40 #104 brought SEA to 8-of-8 covered regions with smoke
// only. This spec extends SEA to smoke + axe, closing the LAST
// axe gap in the portfolio.

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

test.describe('SEA routes — axe-core WCAG 2.1 A/AA (serious + critical only)', () => {
  test('/ (en SEA home) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/best-nootropics/ (SEA BestOf with per-country regulator chips) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/best-nootropics/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });

  test('/halal-nootropics-indonesia-bpjph/ (SEA-exclusive BPJPH+JAKIM pillar) has no serious or critical a11y violations', async ({ page }) => {
    const results = await runAxe(page, '/halal-nootropics-indonesia-bpjph/');
    const blockers = blockingViolations(results);
    expect(blockers, summarize(blockers)).toHaveLength(0);
  });
});

test.describe('SEA routes — axe-core informational (logged, not failed)', () => {
  test('/halal-nootropics-indonesia-bpjph/ moderate+minor count (informational)', async ({ page }) => {
    const results = await runAxe(page, '/halal-nootropics-indonesia-bpjph/');
    const advisory = results.violations.filter(
      (v) => !SERIOUSNESS.includes((v.impact ?? 'minor') as (typeof SERIOUSNESS)[number]),
    );
    // eslint-disable-next-line no-console
    console.log(`/halal-nootropics-indonesia-bpjph/ advisory violations: ${advisory.length}`);
    for (const v of advisory.slice(0, 5)) {
      // eslint-disable-next-line no-console
      console.log(`  [${v.impact}] ${v.id}`);
    }
  });
});
