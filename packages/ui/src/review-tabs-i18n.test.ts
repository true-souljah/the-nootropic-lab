import { describe, test, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { allProductsJP, allProductsLatam, dosingAnchorFor, getStrings, NO_REFERENCE_DOSE, DOSING_ANCHORS } from '@nootropic/data';
import type { Locale, Product } from '@nootropic/data';
import ProductDetail from './templates/ProductDetail';

// 2026-10-12: the review page's Pillars and Dosing tabs hard-coded English
// (pillar names and rationales, "How the score is computed", "Dosing audit",
// table headers, the ✓/✕/? chips, the reference doses), so JP pages (ja) and
// LATAM pages (es) showed both tabs in English. The tabs now render
// UIStrings.productDetail.pillars / .dosing; the row data stays English.

const UI_SRC = __dirname;

/** Rendered text: React escapes quotes and ampersands. */
function text(html: string): string {
  return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

// The AppShell sidebar reads the build-time region (fails closed when unset).
afterEach(() => {
  vi.unstubAllEnvs();
});

function renderReview(product: Product, locale: Locale, region: string): string {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return text(
    renderToStaticMarkup(
      createElement(ProductDetail, {
        product,
        alternatives: [],
        siteUrl: 'https://example.com',
        uiStrings: getStrings(locale),
      }),
    ),
  );
}

describe('Dosing tab — localized reference doses (ja)', () => {
  const ja = getStrings('ja').productDetail.dosing;
  const mlp = allProductsJP.find((p) => p.slug === 'mind-lab-pro-review')!;
  const rows = mlp.ingredientDosages.map((row) => ({ row, anchor: dosingAnchorFor(row) }));
  const anchored = rows.filter((r) => r.anchor !== null);
  const unanchored = rows.filter((r) => r.anchor === null);

  test('JP Mind Lab Pro has both anchored rows and rows without a reference dose', () => {
    expect(anchored.length).toBeGreaterThanOrEqual(5);
    expect(unanchored.length).toBeGreaterThanOrEqual(1);
    for (const { row } of unanchored) expect(row.clinicalDose).toBe(NO_REFERENCE_DOSE);
  });

  test('every row shows the Japanese Clinical cell, never the English data string', () => {
    const html = renderReview(mlp, 'ja', 'jp');
    expect(count(html, `>${ja.noReferenceDose}<`)).toBe(unanchored.length);
    expect(html).not.toContain(NO_REFERENCE_DOSE);
    for (const { anchor } of anchored) {
      expect(html, anchor!.ingredientSlug).toContain(`>${ja.anchorDose[anchor!.ingredientSlug]}<`);
      expect(html, anchor!.ingredientSlug).not.toContain(`>${anchor!.clinicalDose}<`);
    }
  });

  test('status chips: pass / under / unverified for anchored rows, notScored for rows without a reference dose', () => {
    const html = renderReview(mlp, 'ja', 'jp');
    expect(count(html, `>${ja.verdict.notScored}<`)).toBe(unanchored.length);
    expect(count(html, `>${ja.verdict.pass}<`)).toBe(anchored.filter((r) => r.row.adequatelyDosed === true).length);
    expect(count(html, `>${ja.verdict.under}<`)).toBe(anchored.filter((r) => r.row.adequatelyDosed === false).length);
    expect(count(html, `>${ja.verdict.unverified}<`)).toBe(anchored.filter((r) => r.row.adequatelyDosed === null).length);
  });
});

describe('Pillars and Dosing tabs — no English on JP (ja) and LATAM (es) review pages', () => {
  const en = getStrings('en').productDetail;
  // Each English tab string as a whole text node; anchor doses with no words
  // ("100-200mg") are the same in every locale and are left out.
  const english = [
    ...Object.values(en.pillars.labels),
    ...Object.values(en.pillars.rationale),
    en.pillars.howComputedHeading,
    en.pillars.howComputedBody,
    en.pillars.readMethodology,
    en.dosing.heading,
    en.dosing.subtitle,
    en.dosing.unavailable,
    ...Object.values(en.dosing.columns),
    ...Object.values(en.dosing.verdict),
    en.dosing.noReferenceDose,
    ...DOSING_ANCHORS.map((a) => a.clinicalDose).filter((dose) => /[a-z]{3,}/i.test(dose.replace(/mcg|mg/g, ''))),
  ];
  const pages = [
    ...allProductsJP.map((product) => ['jp', 'ja', product] as const),
    ...allProductsLatam.map((product) => ['latam', 'es', product] as const),
  ];

  test('the scan is non-empty', () => {
    expect(english.length).toBeGreaterThan(30);
    expect(pages.length).toBeGreaterThanOrEqual(10);
  });

  test.each(pages.map(([region, locale, product]) => [region, product.slug, locale, product] as const))(
    '%s %s renders both tabs in its locale',
    (region, _slug, locale, product) => {
      const s = getStrings(locale).productDetail;
      const html = renderReview(product, locale, region);
      for (const phrase of english) expect(html, phrase).not.toContain(`>${phrase}<`);
      expect(html).not.toMatch(/\d+ \/ \d+ adequate/);
      expect(html).toContain(`>${s.pillars.howComputedHeading}<`);
      expect(html).toContain(`>${s.pillars.howComputedBody}<`);
      expect(html).toContain(`>${s.pillars.readMethodology}<`);
      for (const label of Object.values(s.pillars.labels)) expect(html).toContain(`>${label}<`);
      for (const rationale of Object.values(s.pillars.rationale)) expect(html).toContain(`>${rationale}<`);
      expect(html).toContain(`>${s.dosing.heading}<`);
      const scored = (Object.keys(product.scoreBreakdown) as Array<keyof Product['scoreBreakdown']>).find(
        (k) => product.scoreBreakdown[k] !== null,
      )!;
      const aria = s.pillars.pillarScoreAria.replace('{product}', product.name).replace('{pillar}', s.pillars.labels[scored]);
      expect(html).toContain(`aria-label="${aria}"`);
    },
  );
});

describe('PillarsTab / DosingTab source — no English text nodes', () => {
  test.each(['PillarsTab.tsx', 'DosingTab.tsx'])('%s renders locale strings only', (file) => {
    const src = readFileSync(join(UI_SRC, 'templates', 'product-detail', file), 'utf8');
    // JSX text between tags must come from uiStrings: a literal word here is
    // English on the ja / es pages.
    const literalText = src.match(/>\s*[A-Za-z][A-Za-z ,.'’&;-]{2,}\s*</g) ?? [];
    expect(literalText).toEqual([]);
    expect(src).not.toMatch(/['"`](?:✓|✕|\?) [A-Z]/);
  });

  test('ProductDetail passes the locale bundle to both tabs', () => {
    const pd = readFileSync(join(UI_SRC, 'templates', 'ProductDetail.tsx'), 'utf8');
    expect(pd).toMatch(/<DosingTab[^>]*strings=\{pd\}/);
    expect(pd).toMatch(/<PillarsTab[^>]*strings=\{pd\}/);
  });
});
