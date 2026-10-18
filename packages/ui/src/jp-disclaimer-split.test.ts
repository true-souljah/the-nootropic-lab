import { describe, test, expect, vi, afterEach } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { disclaimerParts, getRegionalHealthDisclaimer, getStrings } from '@nootropic/data';
import type { DisclaimerMarket } from '@nootropic/data';
import DisclaimerText from './DisclaimerText';

// The JP regional disclaimer is bilingual. Owner decision 2026-10-13 ("keep
// notices"): its Japanese half stays on the now-English JP host as a protective
// notice, with the same text, marked lang="ja" so assistive technology and
// search engines read it as Japanese. disclaimerParts (data) splits it at the
// start of the English half; DisclaimerText renders the runs; every page and
// template that shows a regional disclaimer renders through DisclaimerText.

const REPO = join(__dirname, '..', '..', '..');
const APPS = join(REPO, 'apps');
const JA = /[぀-ヿ㐀-䶿一-鿿]/;
const JP_FULL = getRegionalHealthDisclaimer('jp');
const [JA_HALF, EN_HALF] = disclaimerParts(JP_FULL);

describe('disclaimerParts: the JP disclaimer in two language runs, text unchanged', () => {
  test('the text is unchanged by the split (sha256 of the jp disclaimer on origin/main 86906f69)', () => {
    expect(createHash('sha256').update(JP_FULL).digest('hex')).toBe('0d5abb39e32d8ebc789b3d480ddc295bf8b41486242c515f5b8f9da0973eca46');
  });

  test('two runs, Japanese (lang ja) then English, that join back to the full text', () => {
    expect(disclaimerParts(JP_FULL)).toHaveLength(2);
    expect(JA_HALF.lang).toBe('ja');
    expect(EN_HALF.lang).toBeUndefined();
    expect(JA_HALF.text + EN_HALF.text).toBe(JP_FULL);
    expect(EN_HALF.text.startsWith('This page is editorial and not medical advice.')).toBe(true);
  });

  test('the Japanese run carries no English sentence; the English run no Japanese', () => {
    expect(JA_HALF.text).toMatch(JA);
    // Only the acronyms the Japanese sentences cite in parentheses (FFC, FOSHU).
    expect(JA_HALF.text.match(/[A-Za-z]+/g)?.sort()).toEqual(['FFC', 'FOSHU']);
    expect(EN_HALF.text).not.toMatch(JA);
  });

  test('every other disclaimer, and any other text, stays one unmarked run', () => {
    for (const m of ['us', 'eu', 'ca', 'au', 'latam', 'gcc', 'sea'] as DisclaimerMarket[]) {
      const text = getRegionalHealthDisclaimer(m);
      expect(disclaimerParts(text), m).toEqual([{ text }]);
    }
    expect(disclaimerParts(getRegionalHealthDisclaimer())).toEqual([{ text: getRegionalHealthDisclaimer() }]);
    expect(disclaimerParts(`${JP_FULL} `)).toEqual([{ text: `${JP_FULL} ` }]);
  });
});

describe('DisclaimerText renders the runs', () => {
  test('JP: the Japanese half inside <span lang="ja">, the English half right after it, no added space', () => {
    const html = renderToStaticMarkup(createElement('p', null, createElement(DisclaimerText, { text: JP_FULL })));
    expect(html).toBe(`<p><span lang="ja">${JA_HALF.text}</span>${EN_HALF.text}</p>`);
  });

  test('any other disclaimer renders exactly as plain {text} did', () => {
    for (const m of ['us', 'eu', 'latam'] as DisclaimerMarket[]) {
      const text = getRegionalHealthDisclaimer(m);
      const viaComponent = renderToStaticMarkup(createElement('p', null, createElement(DisclaimerText, { text })));
      expect(viaComponent, m).toBe(renderToStaticMarkup(createElement('p', null, text)));
    }
  });
});

// ── Every render site handles the split ───────────────────────────────────────

afterEach(() => {
  vi.unstubAllEnvs();
});

async function renderJpPage(route: string, props: object = {}): Promise<string> {
  vi.stubEnv('NEXT_PUBLIC_REGION', 'jp');
  const mod = (await import(/* @vite-ignore */ join(APPS, 'jp', 'src', 'app', route, 'page.tsx'))) as {
    default: (p: object) => unknown;
  };
  return renderToStaticMarkup((await mod.default(props)) as ReactElement);
}

describe('JP pages render the disclaimer with its Japanese half marked lang="ja"', () => {
  const marked = `<span lang="ja">${JA_HALF.text}</span>${EN_HALF.text}`;

  test.each([
    ['best-nootropics-for-memory', 'Listicle', {}],
    ['best-nootropics-for-aging', 'Listicle', {}],
    ['[slug]', 'ProductDetail', { params: Promise.resolve({ slug: 'fancl-brains-review' }) }],
    ['guides/[guide]', 'RegionalAvailability', { params: Promise.resolve({ guide: 'what-are-nootropics' }) }],
    ['ingredients/[ingredient]', 'RegionalAvailability', { params: Promise.resolve({ ingredient: 'ashwagandha' }) }],
    ['ffc-notified-cognitive-supplements', 'page aside', {}],
  ] as const)('%s (%s)', async (route, _site, props) => {
    const html = await renderJpPage(route, props);
    const shown = html.split(JA_HALF.text).length - 1;
    expect(shown, 'the disclaimer renders on this page').toBeGreaterThan(0);
    // Every occurrence of the Japanese half is the marked one.
    expect(html.split(marked).length - 1).toBe(shown);
  });
});

// The owner-worded Japanese no-purchase-link reason (2026-10-08) is the other
// notice that stays: English label, Japanese reason marked lang="ja".
describe('the no-purchase-link notice keeps its English label and its Japanese reason, marked lang="ja"', () => {
  test('/hunter-focus-review/ (ProductDetail)', async () => {
    const en = getStrings('en').noPurchaseLink;
    expect(en.jpMhlwReasonJa).toMatch(JA);
    const html = await renderJpPage('[slug]', { params: Promise.resolve({ slug: 'hunter-focus-review' }) });
    expect(html).toContain(`<strong>${en.label}:</strong>`);
    const shown = html.split(en.jpMhlwReasonJa).length - 1;
    expect(shown, 'the Japanese reason renders').toBeGreaterThan(0);
    expect(html.split(`lang="ja">${en.jpMhlwReasonJa}</p>`).length - 1).toBe(shown);
  });
});

function sources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) sources(full, out);
    else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) out.push(full);
  }
  return out;
}

describe('source guard: no disclaimer renders as a bare string', () => {
  const files = [...sources(join(REPO, 'packages', 'ui', 'src')), ...sources(join(APPS, 'jp', 'src'))];

  test('the scan is non-empty and covers the disclaimer render sites', () => {
    const rel = files.map((f) => relative(REPO, f));
    expect(rel.length).toBeGreaterThan(80);
    for (const must of [
      'packages/ui/src/templates/BestOf.tsx',
      'packages/ui/src/templates/HeadToHead.tsx',
      'packages/ui/src/templates/Listicle.tsx',
      'packages/ui/src/templates/ProductDetail.tsx',
      'packages/ui/src/RegionalAvailability.tsx',
      'apps/jp/src/app/ffc-notified-cognitive-supplements/page.tsx',
    ]) {
      expect(rel, must).toContain(must);
    }
  });

  test('templates pass healthDisclaimer / regulatoryNote, and JP pages the jp disclaimer, through DisclaimerText', () => {
    // A JSX child `{healthDisclaimer}` (or `{x || fallback}`) renders the bare
    // string; an attribute value (`text={…}`, `healthDisclaimer={…}`) does not.
    const bare = files.flatMap((f) => {
      const src = readFileSync(f, 'utf8');
      return [...src.matchAll(/\{\s*(healthDisclaimer|regulatoryNote|getRegionalHealthDisclaimer\([^)]*\))\s*(\|\|[^}]*)?\}/g)]
        .filter((m) => !/=\s*$/.test(src.slice(Math.max(0, m.index! - 4), m.index)))
        .map((m) => `${relative(REPO, f)}: ${m[0]}`);
    });
    expect(bare).toEqual([]);
  });
});
