import { describe, test, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GuideBody } from './GuideBody';

// GuideBody renders guide sections. A plain `content` section must produce
// exactly the markup the guide pages rendered inline before GuideBody existed,
// so existing guides do not change; structured blocks get accessible markup.

describe('GuideBody', () => {
  test('a content section renders the legacy markup byte for byte', () => {
    const html = renderToStaticMarkup(<GuideBody sections={[{ heading: 'The definition', content: 'Plain text, no links.' }]} />);
    expect(html).toBe(
      '<section class="mb-8"><h2 class="text-xl font-bold text-gray-900 mb-3">The definition</h2><p class="text-gray-700 leading-relaxed">Plain text, no links.</p></section>',
    );
  });

  test('inline internal links become anchors; other bracket text stays text', () => {
    const html = renderToStaticMarkup(
      <GuideBody sections={[{ heading: 'H', content: 'See [citicoline](/ingredients/citicoline/) and [not a link](https://example.com).' }]} />,
    );
    expect(html).toContain('See <a href="/ingredients/citicoline/" class="text-green-700 underline">citicoline</a> and');
    expect(html).toContain('[not a link](https://example.com).');
    expect(html).not.toContain('href="https://example.com"');
  });

  test('tables have a caption, column headers and row headers inside a labelled, focusable scroll region', () => {
    const html = renderToStaticMarkup(
      <GuideBody
        sections={[
          {
            heading: 'Evidence',
            blocks: [{ type: 'table', caption: 'Evidence by ingredient', head: ['Ingredient', 'Verdict'], rows: [['[Bacopa](/ingredients/bacopa-monnieri/)', 'Supported']] }],
          },
        ]}
      />,
    );
    expect(html).toContain('role="region" aria-label="Evidence by ingredient" tabindex="0"');
    expect(html).toContain('<caption class="text-left text-sm text-gray-600 mb-2">Evidence by ingredient</caption>');
    expect(html).toContain('<th scope="col"');
    expect(html).toContain('<th scope="row"');
    expect(html).toContain('<a href="/ingredients/bacopa-monnieri/" class="text-green-700 underline">Bacopa</a>');
  });

  test('lists, paragraphs and callouts render in order', () => {
    const html = renderToStaticMarkup(
      <GuideBody
        sections={[
          {
            heading: 'Key takeaways',
            blocks: [
              { type: 'callout', tone: 'caution', title: 'Before you start', text: 'Talk to a clinician.' },
              { type: 'p', text: 'First.' },
              { type: 'ol', items: ['One', 'Two'] },
              { type: 'ul', items: ['A'] },
            ],
          },
        ]}
      />,
    );
    expect(html).toMatch(/<div role="note" class="[^"]*border-amber-300[^"]*"><p class="font-semibold text-gray-900 mb-1">Before you start<\/p>/);
    expect(html.indexOf('First.')).toBeLessThan(html.indexOf('<ol'));
    expect(html).toContain('<ol class="list-decimal');
    expect(html).toContain('<li>One</li><li>Two</li>');
    expect(html).toContain('<ul class="list-disc');
  });
});
