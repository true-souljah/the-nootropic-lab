import { test, expect } from '@playwright/test';

// WCAG 1.4.10 Reflow on JP routes. Companion to e2e/us-reflow.spec.ts
// (PR-Q24 → Q26 closed it on US). JP-specific because Japanese
// typography has properties that Latin-text-tuned reflow fixes can
// miss:
//
//   - Full-width characters: 全角 chars are ~1em wide, twice the
//     average Latin letter at the same font-size. A heading that fits
//     at 320px in English may overflow in Japanese.
//   - No spaces between words: `word-break: break-word` (the Chip
//     primitive fix in PR-Q26) only breaks at whitespace by default;
//     long Japanese strings without spaces need `overflow-wrap:
//     anywhere` or `word-break: break-all` to break mid-character-
//     sequence. PR-Q26's `break-words` may or may not handle this.
//   - Mixed scripts: Japanese pages often combine 漢字 (kanji),
//     ひらがな (hiragana), カタカナ (katakana), and Latin (brand
//     names like FANCL, NooCube). Different scripts wrap differently.
//
// Target: 3 JP routes that cover different templates:
//   /ja/yakkan-shoumei/  — custom standalone page (full Japanese prose)
//   /fancl-brains-review/ — [slug] ProductDetail (full chrome + chips)
//   /ingredients/l-theanine/ — IngredientDetail (Chip primitive,
//                              fixed-by-PR-Q26 on US)
//
// PR-Q31 #95.

const VIEWPORT = { width: 320, height: 800 };
const SLOP_PX = 1;

interface Offender {
  tag: string;
  cls: string;
  text: string;
  w: number;
  right: number;
}

const ROUTES = [
  { path: '/ja/yakkan-shoumei/', label: '/ja/yakkan-shoumei/ (custom Japanese prose page)' },
  { path: '/fancl-brains-review/', label: '/fancl-brains-review/ (ProductDetail with Japanese chips)' },
  { path: '/ingredients/l-theanine/', label: '/ingredients/l-theanine/ (IngredientDetail with localized chips)' },
];

test.use({ viewport: VIEWPORT });

test.beforeEach(async ({ context }) => {
  // Skip Klaro consent banner so it doesn't push fixed-position chrome
  // wider than viewport.
  await context.addCookies([
    {
      name: 'klaro',
      value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
});

test.describe('JP — WCAG 1.4.10 Reflow at 320px viewport (Japanese typography)', () => {
  for (const route of ROUTES) {
    test(`${route.label} reflows without horizontal overflow`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const { scrollWidth, viewportWidth, offenders } = await page.evaluate(() => {
        const offs: Offender[] = [];
        const vw = window.innerWidth;
        for (const el of document.querySelectorAll<HTMLElement>('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 4) {
            offs.push({
              tag: el.tagName.toLowerCase(),
              cls: el.className.toString().slice(0, 80),
              text: (el.textContent ?? '').trim().slice(0, 40),
              w: Math.round(r.width),
              right: Math.round(r.right),
            });
            if (offs.length >= 5) break;
          }
        }
        return {
          scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          viewportWidth: vw,
          offenders: offs,
        };
      });

      expect(
        scrollWidth,
        `Reflow failure: scrollWidth=${scrollWidth} > viewportWidth=${viewportWidth} + ${SLOP_PX}px slop. ` +
          `Offenders: ${JSON.stringify(offenders, null, 2)}`,
      ).toBeLessThanOrEqual(viewportWidth + SLOP_PX);
    });
  }
});
