import Link from 'next/link';
import type { Product, RegionProfile, RegionalNote } from '@nootropic/data';
import { licenceStatus, localPrice } from '@nootropic/data';
import { Card } from './primitives/Card';
import { FaqAccordion } from './primitives/FaqAccordion';

/**
 * RegionalAvailability — the "In <region>" block rendered on guide and
 * ingredient pages so each host carries facts only that region has:
 * products that ship there with their local price and licence status,
 * the region's local buyer's guides, an optional authored note with its
 * sources, and the audited per-market regulatory note.
 *
 * Everything shown is derived from region data already in the repo; the
 * component never synthesises a status or a price.
 */

export interface RegionalGeoLink {
  href: string;
  label: string;
}

export interface RegionalAvailabilityProps {
  region: RegionProfile;
  /** Ingredient name for the heading, or omit for a guide page. */
  subjectName?: string;
  /** Products available in this region (caller filters — e.g. containing the ingredient). */
  products: Product[];
  /** Local buyer's guides (country / state / province / prefecture pages). */
  geoLinks: RegionalGeoLink[];
  /** Audited per-market disclaimer text. */
  regulatoryNote: string;
  /** Authored regional note, when one exists for this page. */
  note?: RegionalNote;
  /** Section id for the sticky TOC. */
  id?: string;
}

const TONE: Record<'good' | 'neutral' | 'warn', string> = {
  good: 'bg-ds-good-soft text-ds-good',
  neutral: 'bg-ds-card-sub text-ds-muted',
  warn: 'bg-ds-warn-soft text-ds-warn',
};

export function formatLocalPrice(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export default function RegionalAvailability({
  region,
  subjectName,
  products,
  geoLinks,
  regulatoryNote,
  note,
  id = 'regional',
}: RegionalAvailabilityProps) {
  const L = region.labels;
  const heading = L.heading.replace('{name}', subjectName ?? L.genericSubject);
  const rows = products
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((p) => ({ p, status: licenceStatus(p, region.code), price: localPrice(p, region.code) }));

  return (
    <section id={id} className="mt-9" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-[24px] font-bold tracking-[-0.02em] mb-3 text-ds-ink">{heading}</h2>

      {note && (
        <div className="mb-5">
          <p className="text-[15px] leading-relaxed text-ds-ink m-0">{note.summary}</p>
          {note.sections?.map((s) => (
            <div key={s.heading} className="mt-4">
              <h3 className="text-[17px] font-bold text-ds-ink mb-1">{s.heading}</h3>
              <p className="text-[15px] leading-relaxed text-ds-ink m-0">{s.content}</p>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-[17px] font-bold text-ds-ink mb-2">{L.availability}</h3>
      {rows.length === 0 ? (
        <p className="text-[14px] text-ds-muted m-0">{L.noProducts}</p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
          {rows.map(({ p, status, price }) => (
            <li key={p.slug}>
              <Link
                href={`/${p.slug}/`}
                className="block bg-ds-card border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <div className="flex justify-between items-start gap-3 mb-1">
                  <span className="font-bold text-ds-ink text-[14px]">{p.name}</span>
                  <span className="text-ds-good font-bold text-[14px] ds-tabular shrink-0">{p.score}/10</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  {status && (
                    <span className={`px-2 py-[2px] rounded-full font-semibold ${TONE[status.tone]}`}>{status.label}</span>
                  )}
                  {price && (
                    <span className="text-ds-muted ds-tabular">
                      {L.price}: <strong className="text-ds-ink">{formatLocalPrice(price.amount, price.currency, price.locale)}</strong>{L.perMonth}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[12px] text-ds-muted mt-2 mb-0">{region.regulator}</p>

      {note?.faqs && note.faqs.length > 0 && (
        <div className="mt-5">
          <FaqAccordion items={note.faqs.map((f) => ({ q: f.question, a: f.answer }))} />
        </div>
      )}

      {geoLinks.length > 0 && (
        <div className="mt-5">
          <h3 className="text-[17px] font-bold text-ds-ink mb-2">{L.guides}</h3>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {geoLinks.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className="inline-block text-[13px] px-3 py-1 rounded-full border border-ds-border bg-ds-card text-ds-ink hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  {g.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={region.geoHub.path} className="inline-block text-[13px] px-3 py-1 rounded-full bg-ds-accent-soft text-ds-accent font-semibold">
                {region.geoHub.label} →
              </Link>
            </li>
          </ul>
        </div>
      )}

      {note?.sources && note.sources.length > 0 && (
        <p className="text-[12px] text-ds-muted mt-4 mb-0">
          {L.sources}:{' '}
          {note.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} rel="noopener noreferrer" className="underline">{s.label}</a>
            </span>
          ))}
        </p>
      )}

      <Card variant="subdued" padding={16} className="mt-5">
        <h3 className="text-[13px] font-bold text-ds-ink mb-1">{L.regulatoryNote}</h3>
        <p className="text-[12px] leading-relaxed text-ds-muted m-0">{regulatoryNote}</p>
      </Card>
    </section>
  );
}
