import { test, expect } from '@playwright/test';

// EU cognitive-accessibility on BRAND REVIEW pages — content-tail
// extension to Q70/Q71's regulatory-pillar coverage. PR-Q82.
//
// The Q70/Q71 sweep probed FDA / DSHEA / TGA / SFDA / BPJPH / NPN /
// EFSA / FFC / ANMAT on each region's regulatory pillar. The same
// abbreviations + new ones (GMP, NSF, USP, NDI) appear throughout
// brand review pages without explicit expansion.
//
// Brand reviews are content-heavy (per-product editorial) and
// region-rare per Q60 pattern (template substrate is clean, content
// drift is where bugs live). Per the Q75/Q76/Q77 model: editorial
// content is Category A (substrate doesn't enforce abbreviation
// expansion at the content layer).
//
// Probes 5 US brand review surfaces and checks for inline
// parenthetical or <abbr title> expansion of common
// quality/regulatory acronyms appearing in product copy.

const ABBREVIATIONS = [
  { acronym: 'GMP', expansion: 'Good Manufacturing Practice' },
  { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  // PR-Q85 region-specific regulator acronym
  { acronym: 'EFSA', expansion: 'European Food Safety Authority' },
];

const REVIEW_ROUTES = [
  '/mind-lab-pro-review/',
  '/noocube-review/',
  '/performance-lab-mind-review/',
  '/braineffect-focus-review/',
  '/brainzyme-focus-pro-review/',
  '/hunter-focus-review/',
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

interface ExpansionResult {
  found: boolean;
  via: string;
  match: string;
  acronymPresent: boolean;
}

async function checkExpansion(
  page: import('@playwright/test').Page,
  url: string,
  acronym: string,
  expansion: string,
): Promise<ExpansionResult> {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  return page.evaluate(
    ({ acronym: a, expansion: e }: { acronym: string; expansion: string }) => {
      const body = document.body.innerText;
      // If the acronym never appears on the page, the expansion
      // requirement doesn't apply (the page never asks the AT user
      // to recognise it).
      const acronymRe = new RegExp(`\\b${a}\\b`);
      const acronymPresent = acronymRe.test(body);
      if (!acronymPresent) {
        return { found: true, via: 'acronym-absent', match: '', acronymPresent: false };
      }
      // Pattern 1: <abbr> element.
      const abbrs = document.querySelectorAll('abbr');
      for (const ab of abbrs) {
        const title = ab.getAttribute('title') ?? '';
        const text = (ab.textContent ?? '').trim();
        if (text === a && title.toLowerCase().includes(e.toLowerCase())) {
          return { found: true, via: 'abbr', match: `<abbr title="${title}">${text}</abbr>`, acronymPresent: true };
        }
      }
      // Pattern 2: inline parenthetical (acronym-first OR expansion-first,
      // allowing intervening words within the same sentence).
      const escE = e.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
      const inline1 = new RegExp(`\\b${a}\\s*\\([^()]*${escE}[^()]*\\)`, 'i');
      const inline2 = new RegExp(`${escE}[^.!?]*\\(\\s*${a}\\s*\\)`, 'i');
      if (inline1.test(body)) {
        return { found: true, via: 'inline-acronym-first', match: '', acronymPresent: true };
      }
      if (inline2.test(body)) {
        return { found: true, via: 'inline-expansion-first', match: '', acronymPresent: true };
      }
      return { found: false, via: 'none', match: '', acronymPresent: true };
    },
    { acronym, expansion },
  );
}

test.describe('EU — WCAG 3.1.4 Abbreviations on brand review pages (content-tail)', () => {
  for (const route of REVIEW_ROUTES) {
    for (const { acronym, expansion } of ABBREVIATIONS) {
      test(`${route} ${acronym} is expanded if mentioned`, async ({ page }) => {
        const result = await checkExpansion(page, route, acronym, expansion);

        if (!result.acronymPresent) {
          test.skip(true, `${acronym} not mentioned on ${route} — no expansion required`);
          return;
        }

        expect(
          result.found,
          `WCAG 3.1.4 failure on ${route}: ${acronym} appears but is NEVER expanded to "${expansion}" via ` +
            `<abbr title> or inline parenthetical. AT users + cognitive-disability users see the bare ` +
            `acronym without context. Result: ${JSON.stringify(result)}`,
        ).toBe(true);
      });
    }
  }
});
