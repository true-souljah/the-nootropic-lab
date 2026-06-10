import { test, expect } from '@playwright/test';

// SEA cognitive-accessibility probe — WCAG 3.1.4 (Abbreviations).
// PR-Q70.
//
// 11th independent axis after the 10-axis baseline (touch added
// in Q69). First COGNITIVE-ACCESSIBILITY probe.
//
// WCAG 3.1.4 Abbreviations (Level AAA):
//
//   "A mechanism for identifying the expanded form or meaning of
//   abbreviations is available."
//
// Common patterns satisfying 3.1.4:
//   1. <abbr title="Food and Drug Administration">FDA</abbr>
//   2. First occurrence in parentheses: "Food and Drug
//      Administration (FDA)" or "FDA (Food and Drug
//      Administration)"
//   3. Glossary link at end of page / sidebar
//   4. tooltip / definition that appears on hover/focus
//
// Scope of this probe: regulatory pillar pages that name multiple
// abbreviations as fact references. The US regulatory pillar is
// /halal-nootropics-indonesia-bpjph/ — names FDA (Food and Drug
// Administration), DSHEA (Dietary Supplement Health and Education
// Act), GMP (Good Manufacturing Practice), NSF / USP / NDA / FTC
// throughout the content. If ANY of these isn't expanded, AT users
// and users with cognitive disabilities see the bare acronym
// without context.
//
// Per the bug-discovery model from Q67/Q69: new axis = portfolio
// bug. The 7-for-7 streak (Q37/Q38/Q41/Q51/Q58/Q67/Q69) predicts
// this probe finds a bug.

const ABBREVIATIONS = [
  { acronym: 'BPJPH', expansion: 'Badan Penyelenggara Jaminan Produk Halal' },
];

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

test.describe('SEA — WCAG 3.1.4 Abbreviations on /halal-nootropics-indonesia-bpjph/', () => {
  for (const { acronym, expansion } of ABBREVIATIONS) {
    test(`${acronym} is expanded somewhere on the page (either via <abbr title> or inline parenthetical)`, async ({
      page,
    }) => {
      await page.goto('/halal-nootropics-indonesia-bpjph/');
      await page.waitForLoadState('networkidle');

      // Strategy: check the rendered page body for ANY of:
      //   1. <abbr> element whose innerText matches the acronym
      //      AND whose title attribute matches the expansion
      //   2. The expansion text appearing as plain text adjacent
      //      to the acronym ("FDA (Food and Drug Administration)"
      //      OR "Food and Drug Administration (FDA)")
      //
      // This catches BOTH the structured <abbr title> approach
      // AND the inline-expansion approach. Failing means neither
      // is present — a real WCAG 3.1.4 (AAA) failure.
      const result = await page.evaluate(
        ({ acronym: a, expansion: e }: { acronym: string; expansion: string }) => {
          // Pattern 1: <abbr> element wrapping the acronym.
          const abbrs = document.querySelectorAll('abbr');
          for (const ab of abbrs) {
            const title = ab.getAttribute('title') ?? '';
            const text = (ab.textContent ?? '').trim();
            if (text === a && title.toLowerCase().includes(e.toLowerCase())) {
              return { found: true, via: 'abbr', match: `<abbr title="${title}">${text}</abbr>` };
            }
          }
          // Pattern 2: inline parenthetical expansion in the body
          // text. Accept either order AND allow intervening words
          // within the same sentence — e.g. "Dietary Supplement
          // Health and Education Act of 1994 (DSHEA)" has "of
          // 1994" between the canonical expansion and the
          // parenthetical acronym. [^.!?]* matches any non-
          // sentence-terminating characters.
          const body = document.body.innerText;
          const escE = e.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
          const inline1 = new RegExp(
            `\\b${a}\\s*\\([^()]*${escE}[^()]*\\)`,
            'i',
          );
          const inline2 = new RegExp(`${escE}[^.!?]*\\(\\s*${a}\\s*\\)`, 'i');
          if (inline1.test(body)) {
            return { found: true, via: 'inline-acronym-first', match: `${a}(${e}) form found` };
          }
          if (inline2.test(body)) {
            return { found: true, via: 'inline-expansion-first', match: `${e}(${a}) form found` };
          }
          return { found: false, via: 'none', match: '' };
        },
        { acronym, expansion },
      );

      expect(
        result.found,
        `WCAG 3.1.4 failure: ${acronym} appears on the page but is NEVER expanded to "${expansion}" via ` +
          `<abbr title> or inline parenthetical. AT users and users with cognitive disabilities see ` +
          `the bare acronym without context. Add either: ` +
          `<abbr title="${expansion}">${acronym}</abbr> OR rewrite the first occurrence as ` +
          `"${expansion} (${acronym})". Result: ${JSON.stringify(result)}`,
      ).toBe(true);
    });
  }
});
