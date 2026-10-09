import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { buildProductSchema, getStrings } from '@nootropic/data';
import type { Locale, Product } from '@nootropic/data';

// Trust-conformance guards (2026-09 guidance audit, checklist items 6, 7, 9–14):
//   - no FAQPage / HowTo / SpeakableSpecification JSON-LD (retired rich results) and no
//     AggregateRating (the site hosts no user reviews);
//   - every money template renders the localised inline disclosure
//     (FPTrustNote) and feeds the locale bundle to the top FPDisclosure;
//   - the disclosure / ranking / last-verified strings exist in every locale.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
const UI_SRC = __dirname;
const REPO = join(__dirname, '..', '..', '..');

// JSON-LD types that must never be emitted.
// SpeakableSpecification: portfolio policy since 2026-09-08 is no Speakable.
const RETIRED_TYPE =
  /['"]@type['"]\s*:\s*['"](FAQPage|HowTo|HowToStep|AggregateRating|SpeakableSpecification)['"]/;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name === 'out') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

describe('structured data — retired / unsupported types are never emitted', () => {
  const sources = [
    ...walk(UI_SRC),
    ...walk(join(REPO, 'packages', 'data', 'src')),
    ...readdirSync(join(REPO, 'apps'))
      .filter((app) => existsSync(join(REPO, 'apps', app, 'src')))
      .flatMap((app) => walk(join(REPO, 'apps', app, 'src'))),
  ];

  it('scans a non-empty source set (guards against a silently empty glob)', () => {
    expect(sources.length).toBeGreaterThan(100);
  });

  it('no source file declares FAQPage / HowTo / HowToStep / AggregateRating / SpeakableSpecification JSON-LD', () => {
    const offenders = sources
      .filter((f) => RETIRED_TYPE.test(readFileSync(f, 'utf8')))
      .map((f) => relative(REPO, f));
    expect(offenders).toEqual([]);
  });

  it('buildProductSchema emits Product + first-party Review only', () => {
    const product = {
      id: 'x', name: 'X', brand: 'B', slug: 'x-review', score: 8.1, summary: 's',
      trustpilotScore: 4.5, trustpilotCount: 1200,
    } as unknown as Product;
    const json = JSON.stringify(buildProductSchema(product, 'https://example.com'));
    expect(json).toContain('"@type":"Product"');
    expect(json).toContain('"@type":"Review"');
    expect(json).not.toMatch(/FAQPage|HowTo|AggregateRating|aggregateRating|Speakable|speakable/);
    // Review author is the brand team, never a named Person.
    expect(json).not.toContain('"@type":"Person"');
  });
});

describe('disclosure strings — present and translated in every locale', () => {
  const en = getStrings('en');

  it.each(ALL_LOCALES)('%s has non-empty disclosure badge / inline / ranking / methodology', (locale) => {
    const d = getStrings(locale).disclosure;
    for (const key of ['badge', 'inline', 'ranking', 'methodology'] as const) {
      expect(d[key], `${locale} disclosure.${key}`).toBeTruthy();
      expect(d[key].trim().length, `${locale} disclosure.${key}`).toBeGreaterThan(3);
    }
  });

  it.each(ALL_LOCALES.filter((l) => l !== 'en'))('%s disclosure copy is translated (not English)', (locale) => {
    const d = getStrings(locale).disclosure;
    expect(d.inline).not.toBe(en.disclosure.inline);
    expect(d.ranking).not.toBe(en.disclosure.ranking);
  });

  it.each(ALL_LOCALES)('%s has productDetail.meta lastVerified + updated labels + brand reviewedBy byline', (locale) => {
    const m = getStrings(locale).productDetail.meta;
    expect(m.lastVerified, `${locale} lastVerified`).toBeTruthy();
    expect(m.updated, `${locale} updated`).toBeTruthy();
    // Two distinct labels: an edit date must never be presented as a verification.
    expect(m.updated, `${locale} updated vs lastVerified`).not.toBe(m.lastVerified);
    expect(m.reviewedBy, `${locale} reviewedBy`).toContain('The Nootropic Lab');
  });

  it('EN inline disclosure is plain language, not the word "affiliate" alone (UK ASA)', () => {
    expect(en.disclosure.inline).toMatch(/commission/i);
  });

  it('JP badge carries an explicit 広告 (ad) label (stealth-marketing rule)', () => {
    expect(getStrings('ja').disclosure.badge).toContain('広告');
  });
});

describe('money templates — inline disclosure next to the first CTA', () => {
  const TEMPLATES = ['ProductDetail.tsx', 'BestOf.tsx', 'Listicle.tsx', 'HeadToHead.tsx'];

  it.each(TEMPLATES)('%s renders FPTrustNote with the locale disclosure bundle', (tpl) => {
    const src = readFileSync(join(UI_SRC, 'templates', tpl), 'utf8');
    expect(src).toMatch(/<FPTrustNote\s+strings=\{uiStrings\.disclosure\}/);
    // The top strip is localised too.
    expect(src).toMatch(/<FPDisclosure[^>]*strings=\{uiStrings\.disclosure\}/);
  });

  it.each(TEMPLATES)('%s places FPTrustNote before the first TrackedAffiliateLink', (tpl) => {
    const src = readFileSync(join(UI_SRC, 'templates', tpl), 'utf8');
    const body = src.slice(src.indexOf('return ('));
    const note = body.indexOf('<FPTrustNote');
    const cta = body.indexOf('<TrackedAffiliateLink');
    expect(note).toBeGreaterThan(-1);
    // BestOf's first CTA can come from the page's preList slot, which is
    // rendered after the note; a template without an inline CTA passes.
    if (cta > -1) expect(note).toBeLessThan(cta);
  });

  it('ProductDetail labels verifiedAt "Last verified", updatedAt "Updated", with no build-date fallback', () => {
    const src = readFileSync(join(UI_SRC, 'templates', 'ProductDetail.tsx'), 'utf8');
    expect(src).toMatch(/verifiedAt\s*\?\?\s*p\.updatedAt/);
    // Label follows the source field: lastVerified only when verifiedAt exists.
    expect(src).toMatch(/verifiedAt\s*\?\s*pd\.meta\.lastVerified\s*:\s*pd\.meta\.updated/);
    expect(src).not.toMatch(/:\s*new Date\(\)\)/);
  });
});

describe('product review tabs — no hard-coded English commission copy', () => {
  it('PricingTab renders the locale disclosure bundle, not English literals', () => {
    const src = readFileSync(join(UI_SRC, 'templates', 'product-detail', 'PricingTab.tsx'), 'utf8');
    expect(src).not.toMatch(/We earn a commission/i);
    expect(src).toContain('disclosure.inline');
    const pd = readFileSync(join(UI_SRC, 'templates', 'ProductDetail.tsx'), 'utf8');
    expect(pd).toMatch(/<PricingTab[^>]*disclosure=\{uiStrings\.disclosure\}/);
  });
});
