import Link from 'next/link';
import type { RegionalBuying as RegionalBuyingData, UIStrings } from '@nootropic/data';
import { licenceStatusText } from '@nootropic/data';
import { Card } from './primitives/Card';
import { localPriceShort } from './price-text';
import type { RegionalGeoLink } from './RegionalAvailability';

/**
 * RegionalBuying — "Buying in <region>" block on a product review page.
 * Derived from the region's own product record (local price, licence status,
 * distribution channels, import pathway, regulatory note, per-region notes)
 * plus the region's local buyer's guides. Nothing here is authored per page.
 * The labels come from the page locale (`strings.regionalBuying`); the
 * record's own text (channels, import pathway, notes) is data and stays as
 * recorded.
 */
export interface RegionalBuyingProps {
  data: RegionalBuyingData;
  geoLinks: RegionalGeoLink[];
  /** Locale product-detail bundle: block heading, labels, regulator, status lines. */
  strings: UIStrings['productDetail'];
  id?: string;
}

const TONE: Record<'good' | 'neutral' | 'warn', string> = {
  good: 'bg-ds-good-soft text-ds-good',
  neutral: 'bg-ds-card-sub text-ds-muted',
  warn: 'bg-ds-warn-soft text-ds-warn',
};

export default function RegionalBuying({ data, geoLinks, strings, id = 'regional-buying' }: RegionalBuyingProps) {
  const t = strings.regionalBuying;
  const region = data.region.code;
  return (
    <section id={id} className="mt-10" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-[18px] font-bold text-ds-ink mb-3">{t.heading[region]}</h2>
      <Card variant="subdued" padding={20}>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 m-0">
          {data.price && (
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">{t.price}</dt>
              <dd className="m-0 text-[15px] font-bold text-ds-ink ds-tabular">
                {localPriceShort(data.price, t.monthUnit)}
              </dd>
            </div>
          )}
          {data.status && (
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">{t.status}</dt>
              <dd className="m-0 mt-1">
                <span className={`inline-block text-[12px] px-2 py-[2px] rounded-full font-semibold ${TONE[data.status.tone]}`}>
                  {licenceStatusText(data.status, t.licence)}
                </span>
                <span className="text-[12px] text-ds-muted ml-2">{t.regulator[region]}</span>
              </dd>
            </div>
          )}
          {data.channels.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">{t.whereToBuy}</dt>
              <dd className="m-0 text-[14px] text-ds-ink">{data.channels.join(' · ')}</dd>
            </div>
          )}
          {data.importPathway && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">{t.importPathway}</dt>
              <dd className="m-0 text-[14px] text-ds-ink">{data.importPathway}</dd>
            </div>
          )}
        </dl>
        {data.regulatoryNote && (
          <p className="text-[13px] leading-relaxed text-ds-ink mt-4 mb-0">{data.regulatoryNote}</p>
        )}
        {data.notes.map((n) => (
          <p key={n.slice(0, 40)} className="text-[13px] leading-relaxed text-ds-muted mt-3 mb-0">{n}</p>
        ))}
        {geoLinks.length > 0 && (
          <ul className="flex flex-wrap gap-2 list-none p-0 mt-4 mb-0">
            {geoLinks.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="inline-block text-[13px] px-3 py-1 rounded-full border border-ds-border bg-ds-card text-ds-ink hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">{g.label}</Link>
              </li>
            ))}
            <li>
              <Link href={data.region.geoHub.path} className="inline-block text-[13px] px-3 py-1 rounded-full bg-ds-accent-soft text-ds-accent font-semibold">{`${t.geoHub[region]} →`}</Link>
            </li>
          </ul>
        )}
      </Card>
    </section>
  );
}
