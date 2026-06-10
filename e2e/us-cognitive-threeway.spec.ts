import { test, expect } from '@playwright/test';

// US cognitive-accessibility on 3-WAY COMPARATOR pages — extension
// to Q87 head-to-head coverage. PR-Q93.
//
// Q87 fixed cognitive bugs on 2-way head-to-head pages (NSF in pros).
// Q93 extends the probe to the 3-way comparator template, which
// renders pros + cons + custom Q&A across THREE products on a
// single page. Editorial drift surface is 50% wider than a
// 2-way (3 products' pros visible instead of 2), so likely
// surfaces unexpanded acronyms in the cross-product Q&A copy.

const ABBREVIATIONS = [
  { acronym: 'GMP', expansion: 'Good Manufacturing Practice' },
  { acronym: 'NSF', expansion: 'National Sanitation Foundation' },
  { acronym: 'cGMP', expansion: 'current Good Manufacturing Practice' },
  { acronym: 'USP', expansion: 'United States Pharmacopeia' },
];

const THREEWAY_ROUTES = ['/alpha-brain-vs-mind-lab-pro-vs-noocube/'];

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
      const acronymRe = new RegExp(`\\b${a}\\b`);
      const acronymPresent = acronymRe.test(body);
      if (!acronymPresent) return { found: true, via: 'acronym-absent', match: '', acronymPresent: false };
      const abbrs = document.querySelectorAll('abbr');
      for (const ab of abbrs) {
        const title = ab.getAttribute('title') ?? '';
        const text = (ab.textContent ?? '').trim();
        if (text === a && title.toLowerCase().includes(e.toLowerCase())) {
          return { found: true, via: 'abbr', match: `<abbr title="${title}">${text}</abbr>`, acronymPresent: true };
        }
      }
      const escE = e.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
      const inline1 = new RegExp(`\\b${a}\\s*\\([^()]*${escE}[^()]*\\)`, 'i');
      const inline2 = new RegExp(`${escE}[^.!?]*\\(\\s*${a}\\s*\\)`, 'i');
      if (inline1.test(body)) return { found: true, via: 'inline-acronym-first', match: '', acronymPresent: true };
      if (inline2.test(body)) return { found: true, via: 'inline-expansion-first', match: '', acronymPresent: true };
      return { found: false, via: 'none', match: '', acronymPresent: true };
    },
    { acronym, expansion },
  );
}

test.describe('US — WCAG 3.1.4 Abbreviations on 3-way comparator pages (content-tail)', () => {
  for (const route of THREEWAY_ROUTES) {
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
