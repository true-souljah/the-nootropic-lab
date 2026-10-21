import { describe, test, expect, vi, afterEach } from 'vitest';
import { join } from 'node:path';
import { type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HEAD_TO_HEAD_PAGES, ALL_REGIONS, routeAvailableIn, allProductsUS, allProductsCA, allProductsAU } from '@nootropic/data';
import type { Product } from '@nootropic/data';
import { headToHeadPageEnDefaults, tpl } from './templateStrings';

// Head-to-head pages answer "which one is better?" in the first screen
// (2026-10-20). The verdict card used to render below the two side cards,
// which stack on a phone, so a reader scrolled past both product cards and
// their buy links before reaching the answer. It now renders after the
// health note and before the inline trust note, and the trust note stays
// directly above the side cards, i.e. right above the first affiliate CTA
// (trust-conformance.test.ts pins that rule in source; this pins it in the
// rendered pages). Every head-to-head page in HEAD_TO_HEAD_PAGES is rendered
// from its app page with the real product records.

afterEach(() => {
  vi.unstubAllEnvs();
});

type PageModule = { default: (props: object) => unknown };
const APPS = join(__dirname, '..', '..', '..', 'apps');
const CATALOGUES: Partial<Record<string, readonly Product[]>> = { us: allProductsUS, ca: allProductsCA, au: allProductsAU };

/** Rendered markup with the escapes React adds to quotes and ampersands undone. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

/**
 * Renders a region app page (apps/<region>/src/app/<route>/page.tsx). The path
 * is built at runtime so `tsc -p packages/ui` does not pull app files into its
 * program; vitest.config.ts resolves each app's `@/…` imports.
 */
async function renderPage(region: string, route: string): Promise<string> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const mod = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
  const element = await mod.default({});
  return text(renderToStaticMarkup(element as ReactElement));
}

const PAGES = HEAD_TO_HEAD_PAGES.flatMap((page) =>
  ALL_REGIONS.filter((region) => routeAvailableIn(page.path, region)).map((region) => ({ region, page })),
);

describe('head-to-head pages: verdict in the first screen', () => {
  test('renders every head-to-head page (us ×5, au, ca)', () => {
    expect(PAGES.map(({ region, page }) => `${region}${page.path}`).sort()).toEqual([
      'au/blackmores-brain-active-vs-mind-lab-pro/',
      'ca/aor-ortho-mind-vs-mind-lab-pro/',
      'us/alpha-brain-vs-qualia-mind/',
      'us/mind-lab-pro-vs-alpha-brain/',
      'us/mind-lab-pro-vs-noocube/',
      'us/mind-lab-pro-vs-qualia-mind/',
      'us/mind-lab-pro-vs-thesis/',
    ]);
  });

  test.each(PAGES.map(({ region, page }) => [`${region}${page.path}`, region, page.path] as const))(
    '%s: verdict after the health note, before the trust note, the product cards and the first buy link',
    async (_name, region, path) => {
      const html = await renderPage(region, path.replace(/^\/|\/$/g, ''));
      const catalogue = CATALOGUES[region];
      expect(catalogue, `${region} catalogue`).toBeDefined();
      const page = HEAD_TO_HEAD_PAGES.find((p) => p.path === path)!;
      const names = page.products.map((slug) => {
        const p = catalogue!.find((x) => x.slug === slug);
        expect(p, `${region} ${slug}`).toBeDefined();
        return p!.name;
      });

      const main = html.indexOf('<main');
      expect(main, 'main landmark').toBeGreaterThan(-1);

      // The verdict heading: "<winner> wins on score", one of the two names.
      const verdictTexts = names.map((name) => tpl(headToHeadPageEnDefaults.winnerHeadline, { name }));
      const verdictHits = verdictTexts.map((t) => html.indexOf(`>${t}<`)).filter((i) => i > -1);
      expect(verdictHits, `verdict heading (${verdictTexts.join(' / ')})`).toHaveLength(1);
      const verdict = html.lastIndexOf('<h2', verdictHits[0]);
      expect(verdict).toBeGreaterThan(main);

      // It is the first h2 of the page body.
      expect(html.indexOf('<h2', main), 'first <h2> in <main> is the verdict').toBe(verdict);

      // After the health note.
      const health = html.indexOf('Health & regulatory note');
      expect(health, 'health note rendered').toBeGreaterThan(main);
      expect(health, 'health note before the verdict').toBeLessThan(verdict);

      // Before the trust note, which closes directly above the side cards.
      const noteAttr = html.indexOf('data-trust-note=""');
      expect(noteAttr, 'trust note rendered').toBeGreaterThan(-1);
      const note = html.lastIndexOf('<p', noteAttr);
      const noteEnd = html.indexOf('</p>', noteAttr) + '</p>'.length;
      expect(verdict, 'verdict before the trust note').toBeLessThan(note);

      // The product-card headings (the side cards are the only <h2>{name}</h2>).
      const cards = names.map((name) => html.indexOf(`>${name}</h2>`));
      for (const [i, c] of cards.entries()) expect(c, `side card h2 for ${names[i]}`).toBeGreaterThan(-1);
      const firstCard = html.lastIndexOf('<h2', Math.min(...cards));
      expect(verdict, 'verdict before the first product card').toBeLessThan(firstCard);

      // The trust note is followed directly by the side-card grid: no other
      // element between them, and the next heading is the first product card.
      expect(html.slice(noteEnd, noteEnd + 18), 'side-card grid directly after the trust note').toBe('<div class="grid g');
      expect(html.indexOf('<h2', noteEnd), 'next heading after the trust note').toBe(firstCard);

      // The first affiliate link sits in the side cards, after the verdict and the trust note.
      const cta = html.indexOf('rel="nofollow sponsored');
      expect(cta, 'an affiliate link is rendered').toBeGreaterThan(-1);
      expect(verdict, 'verdict before the first affiliate link').toBeLessThan(cta);
      expect(noteEnd, 'trust note before the first affiliate link').toBeLessThan(cta);
      const afterCards = html.indexOf('<h2', html.lastIndexOf('<h2', Math.max(...cards)) + 3);
      expect(afterCards, 'first affiliate link inside the side cards').toBeGreaterThan(cta);
    },
  );
});
