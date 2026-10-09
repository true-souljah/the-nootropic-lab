import type { ReactNode } from 'react';
import type { GuideBlock, GuideSection } from '@nootropic/data';

// Internal links inside guide text: `[label](/path/)`. Only "/"-rooted paths
// are turned into links; guide-model.test.ts rejects anything else in the data.
const INLINE_LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const LINK_CLASS = 'text-green-700 underline';

/** Guide text with `[label](/internal/path/)` rendered as links. */
export function GuideText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(INLINE_LINK)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    // Numeric keys: path-shaped React keys end up in the RSC payload and get
    // crawled as URLs (see scripts/check-built-links.mjs).
    parts.push(
      <a key={n++} href={m[2]} className={LINK_CLASS}>
        {m[1]}
      </a>,
    );
    last = start + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const SPACED = 'mt-4 first:mt-0';

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p className={`text-gray-700 leading-relaxed ${SPACED}`}>
          <GuideText text={block.text} />
        </p>
      );
    case 'ul':
    case 'ol': {
      const List = block.type;
      return (
        <List className={`${block.type === 'ul' ? 'list-disc' : 'list-decimal'} pl-6 space-y-1 text-gray-700 leading-relaxed ${SPACED}`}>
          {block.items.map((item, i) => (
            <li key={i}>
              <GuideText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case 'table':
      return (
        // A focusable, labelled scroll region so keyboard users can scroll a
        // wide table on small screens (WCAG 2.1.1 / 1.4.10).
        <div
          className={`overflow-x-auto focus-visible:outline-2 focus-visible:outline-green-700 focus-visible:outline-offset-2 ${SPACED}`}
          role="region"
          aria-label={block.caption}
          tabIndex={0}
        >
          <table className="w-full text-sm text-left border-collapse">
            <caption className="text-left text-sm text-gray-600 mb-2">{block.caption}</caption>
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="border-b border-gray-300 py-2 pr-4 font-semibold text-gray-900 align-bottom">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-gray-100">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="py-2 pr-4 font-medium text-gray-900 align-top">
                        <GuideText text={cell} />
                      </th>
                    ) : (
                      <td key={c} className="py-2 pr-4 text-gray-700 align-top">
                        <GuideText text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div
          role="note"
          className={`rounded-lg border p-4 ${block.tone === 'caution' ? 'border-amber-300 bg-amber-50' : 'border-green-200 bg-green-50'} ${SPACED}`}
        >
          {block.title ? <p className="font-semibold text-gray-900 mb-1">{block.title}</p> : null}
          <p className="text-gray-800 leading-relaxed">
            <GuideText text={block.text} />
          </p>
        </div>
      );
  }
}

/** A guide's sections: a heading plus one paragraph (`content`) or structured blocks. */
export function GuideBody({ sections }: { sections: GuideSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
          {section.blocks ? (
            section.blocks.map((block, i) => <Block key={i} block={block} />)
          ) : (
            <p className="text-gray-700 leading-relaxed">
              <GuideText text={section.content} />
            </p>
          )}
        </section>
      ))}
    </>
  );
}
