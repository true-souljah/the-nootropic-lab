import type { GuideSource, UIStrings } from '@nootropic/data';
import Sources from './Sources';

/**
 * "Evidence reviewed: <date>" line shown under a guide's title. The date is an
 * ISO YYYY-MM-DD string, formatted in UTC so the rendered day never shifts
 * with the build machine's timezone.
 */
export function GuideEvidenceReviewed({ date, uiStrings }: { date: string; uiStrings: UIStrings }) {
  const formatted = new Date(`${date}T00:00:00Z`).toLocaleDateString(uiStrings.productDetail.dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return (
    <span className="text-xs text-gray-500">
      {uiStrings.guide.evidenceReviewed} <time dateTime={date}>{formatted}</time>
    </span>
  );
}

/** Localized Sources block for a guide; PubMed entries carry a "PMID <id>" pill. */
export function GuideSources({ sources, uiStrings }: { sources: GuideSource[]; uiStrings: UIStrings }) {
  return (
    <Sources
      heading={uiStrings.guide.sources}
      expandLabel={uiStrings.guide.expand}
      sources={sources.map((s) => ({
        label: `${s.title} (${s.year})`,
        url: s.url,
        ...(s.pmid ? { type: `PMID ${s.pmid}` } : {}),
      }))}
    />
  );
}
