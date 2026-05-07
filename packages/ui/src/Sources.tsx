export interface Source {
  /** Display label, e.g. "PubMed: L-theanine + caffeine attention RCT (Owen 2008)" */
  label: string;
  /** Full URL to the authoritative source */
  url: string;
  /** Optional short type label rendered as a pill: "Clinical trial", "Regulatory", "Meta-analysis", etc. */
  type?: string;
}

interface Props {
  sources: Source[];
  /** Heading text — defaults to "Sources" */
  heading?: string;
  /** Open by default? Defaults to false (collapsed) */
  defaultOpen?: boolean;
}

/**
 * Collapsible Sources block rendered at the bottom of editorial pages.
 *
 * LLM-citability impact: structured Sources blocks signal authoritative
 * sourcing. Crawlers and citation models reward visible source attribution,
 * particularly on YMYL / health content where competitor pages from
 * Healthline, Examine.com, and university health publishers all cite per-page
 * sources prominently.
 *
 * Visual default is collapsed (<details>) so the block doesn't clutter the
 * reading flow but is still in the DOM for indexing.
 */
export default function Sources({
  sources,
  heading = 'Sources',
  defaultOpen = false,
}: Props) {
  if (sources.length === 0) return null;
  return (
    <section className="my-10">
      <details
        className="border border-gray-200 rounded-xl p-5 bg-gray-50"
        {...(defaultOpen && { open: true })}
      >
        <summary className="cursor-pointer font-semibold text-gray-900 text-base list-none flex items-center justify-between">
          <span>
            {heading}{' '}
            <span className="text-xs font-normal text-gray-500 ml-1">({sources.length})</span>
          </span>
          <span className="text-xs text-gray-400">expand</span>
        </summary>
        <ul className="mt-4 space-y-3">
          {sources.map((s, i) => (
            <li key={`${s.url}-${i}`} className="text-sm leading-relaxed">
              {s.type && (
                <span className="inline-block mr-2 text-[10px] font-semibold uppercase tracking-wide bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {s.type}
                </span>
              )}
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline break-words"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
