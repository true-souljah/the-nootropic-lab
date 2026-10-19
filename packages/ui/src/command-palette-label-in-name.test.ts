import { describe, test, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { allProductsUS, buildRegionSearchContext } from '@nootropic/data';
import type { Locale, SearchItem, UIStrings } from '@nootropic/data';
import { ResultRow } from './templates/CommandPalette';

// WCAG 2.5.3 Label in Name (axe-core 4.14 label-content-name-mismatch,
// 2026-10-19). Each command-palette result option was named by an aria-label,
// "Mind Lab Pro, score 7.5 out of 10 — …". An aria-label replaces the
// option's content, so it must contain the text the option shows, and axe
// counts aria-hidden text as shown: the letter tile "M", the score pill "7.5"
// and the "↵" key cap. The options are now named by their content: the title,
// then the score or evidence grade (visually hidden), then the description,
// with the decorative parts aria-hidden. The e2e guard is
// e2e/<region>-axe-palette.spec.ts.

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

/** React escapes these in text and attribute values. */
function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

const TOKEN = /<(\/?)([a-zA-Z][\w-]*)((?:\s+[\w:-]+(?:="[^"]*")?)*)\s*(\/?)>|([^<]+)/g;
const VOID = new Set(['br', 'img', 'input', 'hr', 'wbr']);

/**
 * The name a browser computes from the option's content (accname 1.2, the
 * parts this markup uses): text nodes in order, aria-hidden subtrees left
 * out, a space at each block (div) boundary, whitespace collapsed.
 */
function nameFromContent(inner: string): string {
  let out = '';
  const hiddenStack: boolean[] = [];
  let hiddenDepth = 0;
  for (const [, close, tag, attrs, selfClose, textNode] of inner.matchAll(TOKEN)) {
    if (textNode !== undefined) {
      if (hiddenDepth === 0) out += decode(textNode);
      continue;
    }
    if (tag === 'div') out += ' ';
    if (close) {
      if (hiddenStack.pop()) hiddenDepth--;
      continue;
    }
    if (selfClose || VOID.has(tag)) continue;
    const hidden = /\saria-hidden="true"/.test(attrs);
    hiddenStack.push(hidden);
    if (hidden) hiddenDepth++;
  }
  return out.replace(/\s+/g, ' ').trim();
}

interface RenderedOption {
  /** The option's opening tag. */
  openTag: string;
  /** Its accessible name: the aria-label when there is one, else the content. */
  name: string;
}

function renderOption(item: SearchItem, strings: UIStrings, active: boolean): RenderedOption {
  const category = item.type === 'ingredient'
    ? 'ingredients'
    : item.type === 'product'
      ? 'products'
      : item.type === 'guide'
        ? 'guides'
        : item.href.includes('-vs-')
          ? 'comparisons'
          : 'other';
  const html = renderToStaticMarkup(
    createElement(ResultRow, {
      strings: strings.search.palette,
      item: { ...item, category },
      active,
      id: 'palette-row-0',
      dataIndex: 0,
      onMouseEnter: () => {},
      onClick: () => {},
    }),
  );
  const openTag = html.match(/^<a\b[^>]*>/)?.[0] ?? '';
  expect(openTag, 'the option renders as one <a> element').not.toBe('');
  expect(html.endsWith('</a>')).toBe(true);
  const ariaLabel = openTag.match(/\saria-label="([^"]*)"/)?.[1];
  const name = ariaLabel !== undefined ? decode(ariaLabel) : nameFromContent(html.slice(openTag.length, -'</a>'.length));
  return { openTag, name };
}

/** What a screen reader should hear: the title, the score or grade, the description. */
function expectedName(item: SearchItem, strings: UIStrings): string {
  const t = strings.search.palette;
  const meta = item.meta?.score !== undefined
    ? t.scoreAria.replace('{score}', item.meta.score.toFixed(1))
    : item.meta?.grade
      ? t.gradeAria.replace('{grade}', item.meta.grade)
      : '';
  return `${item.title}${meta}${item.description ? ` — ${item.description}` : ''}`.replace(/\s+/g, ' ').trim();
}

describe('command palette options are named with the text they show (WCAG 2.5.3)', () => {
  test.each(ALL_LOCALES)('%s: every option kind — product, ingredient, guide, page', (locale) => {
    const { searchItems, uiStrings } = buildRegionSearchContext(allProductsUS, locale, 'us');
    const byType = (type: SearchItem['type']) => searchItems.filter((i) => i.type === type);
    // The scan is non-empty and covers every kind of row.
    expect(byType('product').length).toBeGreaterThanOrEqual(10);
    expect(byType('ingredient').length).toBeGreaterThanOrEqual(10);
    expect(byType('guide').length).toBeGreaterThanOrEqual(1);
    expect(byType('page').length).toBeGreaterThanOrEqual(1);

    for (const item of searchItems) {
      for (const active of [false, true]) {
        const { openTag, name } = renderOption(item, uiStrings, active);
        const where = `${locale} ${item.href}${active ? ' (active)' : ''}`;
        // Same listbox option as before: role, selection state, out of the Tab order.
        expect(openTag, where).toMatch(/\srole="option"/);
        expect(openTag, where).toContain(` aria-selected="${active}"`);
        expect(openTag, where).toContain(' tabindex="-1"');
        // Named by its content: no aria-label (it would have to contain the
        // letter tile, the score pill and the "↵" key cap) and no aria-labelledby.
        expect(openTag, `${where}: aria-label`).not.toMatch(/\saria-label=/);
        expect(openTag, `${where}: aria-labelledby`).not.toMatch(/\saria-labelledby=/);
        // The name starts with the visible title, never with the tile letter.
        expect(name.startsWith(item.title), `${where}: "${name}" starts with "${item.title}"`).toBe(true);
        expect(name, `${where}: the "↵" key cap is not spoken`).not.toContain('↵');
        if (item.meta?.score !== undefined) {
          // The score as "x/10", like the score pill's "7.5" and the table's "7.5/10".
          expect(name, `${where}: score`).toContain(`${item.meta.score.toFixed(1)}/10`);
        }
        expect(name, where).toBe(expectedName(item, uiStrings));
      }
    }
  });

  test.each(ALL_LOCALES)('%s: the spoken score reads "{score}/10"', (locale) => {
    const { uiStrings } = buildRegionSearchContext(allProductsUS, locale, 'us');
    expect(uiStrings.search.palette.scoreAria).toMatch(/^, .*\{score\}\/10$/);
  });

  test('en: what a screen reader hears for a product row', () => {
    const { searchItems, uiStrings } = buildRegionSearchContext(allProductsUS, 'en', 'us');
    const mlp = searchItems.find((i) => i.href === '/mind-lab-pro-review/')!;
    const { name } = renderOption(mlp, uiStrings, true);
    expect(name).toBe(`Mind Lab Pro, score ${mlp.meta!.score!.toFixed(1)}/10 — ${mlp.description!.replace(/\s+/g, ' ').trim()}`);
  });
});
