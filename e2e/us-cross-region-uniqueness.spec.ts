import { test, expect, request as pwRequest } from '@playwright/test';

// Cross-region uniqueness guard (2026-09 audit). The six English hosts used to
// serve byte-identical guide and ingredient pages under hreflang, and Google
// de-duplicated the regional copies. The RegionalAvailability block is what
// differentiates them now; this spec fails if any sampled page on any two
// English hosts drifts back above the similarity ceiling.
//
// Runs under the us-chromium project but reads every English region through
// the same prebuilt static servers playwright.config.ts already starts.

const HOSTS: Record<string, string> = {
  us: 'http://127.0.0.1:4177',
  eu: 'http://127.0.0.1:4176',
  ca: 'http://127.0.0.1:4175',
  au: 'http://127.0.0.1:4178',
  gcc: 'http://127.0.0.1:4179',
  sea: 'http://127.0.0.1:4180',
};

const PATHS = [
  '/guides/what-are-nootropics/',
  '/guides/how-to-stack-nootropics/',
  '/ingredients/citicoline/',
  '/ingredients/l-theanine/',
  '/ingredients/alpha-gpc/',
];

const CEILING = 0.95;

function mainText(html: string): string[] {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const main = noScript.match(/<main[\s\S]*?<\/main>/)?.[0] ?? noScript;
  return main.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
}

// Token-level Jaccard-style similarity over word bigrams — cheap, order-aware
// enough to catch verbatim clones, and independent of difflib.
function similarity(a: string[], b: string[]): number {
  const grams = (w: string[]) => {
    const m = new Map<string, number>();
    for (let i = 0; i < w.length - 1; i++) {
      const g = `${w[i]} ${w[i + 1]}`;
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const ga = grams(a), gb = grams(b);
  let inter = 0, total = 0;
  for (const [g, n] of ga) { inter += Math.min(n, gb.get(g) ?? 0); total += n; }
  for (const n of gb.values()) total += n;
  return total === 0 ? 0 : (2 * inter) / total;
}

test.describe('cross-region uniqueness of shared guide + ingredient pages', () => {
  for (const path of PATHS) {
    test(`${path} differs across English hosts (similarity < ${CEILING})`, async () => {
      const ctx = await pwRequest.newContext();
      const texts: Record<string, string[]> = {};
      for (const [region, base] of Object.entries(HOSTS)) {
        const res = await ctx.get(`${base}${path}`);
        expect(res.status(), `${region}${path}`).toBe(200);
        const words = mainText(await res.text());
        expect(words.length, `${region}${path} has body text`).toBeGreaterThan(200);
        texts[region] = words;
      }
      await ctx.dispose();
      const regions = Object.keys(texts);
      for (let i = 0; i < regions.length; i++) {
        for (let j = i + 1; j < regions.length; j++) {
          const s = similarity(texts[regions[i]], texts[regions[j]]);
          expect(s, `${regions[i]} vs ${regions[j]} ${path}`).toBeLessThan(CEILING);
        }
      }
    });
  }

  test('each English host renders its own regional block on the citicoline page', async () => {
    const ctx = await pwRequest.newContext();
    const expected: Record<string, string> = {
      us: 'in the United States', eu: 'in the EU', ca: 'in Canada', au: 'in Australia', gcc: 'in the Gulf', sea: 'in Southeast Asia',
    };
    for (const [region, base] of Object.entries(HOSTS)) {
      const html = await (await ctx.get(`${base}/ingredients/citicoline/`)).text();
      expect(html, `${region} regional heading`).toContain(`id="regional-heading"`);
      expect(html, `${region} regional label`).toContain(expected[region]);
    }
    await ctx.dispose();
  });
});
