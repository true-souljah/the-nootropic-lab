'use client';
// The offer list of the Deals page: the "ending soon" show/hide filter, the copy button and the
// view-time expiry. It renders the cards in the order it is given and never reorders them.
// It reads no promo module or promo file (only the Deals readers do, promo-firewall.test.ts):
// the cards arrive as props from DealsPage.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { earnsCommission, purchaseUrl } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import { ProductThumb } from '../primitives/ProductThumb';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import { tpl } from '../templateStrings';
import { ENDING_SOON_DAYS, offerState, watchUtcDay } from './dealsState';

/** The serialisable offer fields the list renders (a subset of the validated record). */
export type DealOfferView = {
  id: string;
  kind: 'percent' | 'fixed' | 'free-item' | 'code-only' | 'shipping' | 'other';
  headline: string;
  terms_quote: string;
  code: string | null;
  starts: string | null;
  expires: string;
  geo: string[];
  regulated: boolean;
  confirmed_on: string;
};
export type DealCardView = { promo: DealOfferView; products: Product[] };
export type DealsLabels = {
  deals: UIStrings['deals'];
  scoreAria: string;
  noCommission: string;
  noPurchaseLink: UIStrings['noPurchaseLink'];
};
export interface DealsListProps {
  cards: DealCardView[];
  /** The build's UTC date (`YYYY-MM-DD`): the first render uses it, so hydration never mismatches. */
  builtOn: string;
  labels: DealsLabels;
  dateLocale: string;
}

const KIND_KEY: Record<DealOfferView['kind'], keyof UIStrings['deals']['kind']> = {
  percent: 'percent',
  fixed: 'fixed',
  'free-item': 'freeItem',
  'code-only': 'codeOnly',
  shipping: 'shipping',
  other: 'other',
};

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2';
const BUY =
  'inline-block text-center bg-ds-accent hover:bg-ds-accent-press text-white border-0 py-2 px-3 rounded-[8px] text-[12px] font-semibold min-h-6 focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2';
const LIST_ID = 'deals-offer-list';
const COPIED_MS = 2500;

function formatDay(day: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${day}T00:00:00Z`),
  );
}

export default function DealsList({ cards, builtOn, labels, dateLocale }: DealsListProps) {
  const d = labels.deals;
  const [today, setToday] = useState(builtOn);
  const [filterSoon, setFilterSoon] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ id: string; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The reader's own UTC date after mount, again at each UTC midnight and when the page becomes
  // visible again (watchUtcDay): an offer that has ended since the build, or ends while the page is
  // open, loses its code, copy button and links (removed from the DOM, not hidden).
  useEffect(() => {
    const stopWatching = watchUtcDay(setToday);
    return () => {
      stopWatching();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const date = (day: string) => formatDay(day, dateLocale);
  const stated = cards.map((card) => ({ card, state: offerState(card.promo, today) })).filter((x) => x.state !== 'upcoming');

  if (stated.length > 0 && stated.every((x) => x.state === 'ended')) {
    return (
      <Card variant="subdued" padding={20} className="mt-6">
        <Chip tone="bad">{d.allEndedChip}</Chip>
        <h2 className="text-[18px] font-bold text-ds-ink mt-3 mb-2">{d.allEndedTitle}</h2>
        <p className="text-[14px] text-ds-ink-soft leading-relaxed m-0">{tpl(d.allEndedBody, { date: date(builtOn) })}</p>
      </Card>
    );
  }

  // The filter only removes cards that do not end soon; the order of the rest is unchanged.
  const shown = filterSoon ? stated.filter((x) => x.state === 'ending-soon') : stated;

  const copy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setStatus({ id, text: tpl(d.copiedStatus, { code }) });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiedId(null), COPIED_MS);
    } catch {
      setStatus({ id, text: d.copyFailed });
    }
  };

  return (
    <section aria-labelledby="deals-list-heading" className="mt-6">
      <h2 id="deals-list-heading" className="ds-sr-only">
        {d.listLabel}
      </h2>
      {cards.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Chip active={filterSoon} onClick={() => setFilterSoon((on) => !on)} className="min-h-6">
            {filterSoon ? d.filterOn : d.filterOff}
          </Chip>
          <span role="status" className="text-[13px] text-ds-ink-soft">
            {tpl(filterSoon ? d.statusSoon : d.statusAll, { n: shown.length })}
          </span>
        </div>
      )}
      {filterSoon && shown.length === 0 ? (
        <Card variant="subdued" padding={20} id={LIST_ID}>
          <h3 className="text-[16px] font-bold text-ds-ink m-0 mb-2">{d.soonEmptyTitle}</h3>
          <p className="text-[14px] text-ds-ink-soft leading-relaxed m-0">{tpl(d.soonEmptyBody, { days: ENDING_SOON_DAYS })}</p>
        </Card>
      ) : (
        <ul id={LIST_ID} className="list-none m-0 p-0 grid gap-5">
          {shown.map(({ card, state }) => {
            const p = card.promo;
            const ended = state === 'ended';
            const headingId = `deal-${p.id}`;
            return (
              <li key={p.id}>
                <Card as="article" aria-labelledby={headingId} padding={20} className="grid gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 id={headingId} className="text-[18px] font-bold text-ds-ink m-0 mr-1">
                      {card.products[0]?.brand}
                    </h3>
                    <Chip>{d.kind[KIND_KEY[p.kind]]}</Chip>
                    {state === 'ending-soon' && <Chip tone="warn">{tpl(d.endsSoonChip, { date: date(p.expires) })}</Chip>}
                    {ended && <Chip tone="bad">{tpl(d.endedChip, { date: date(p.expires) })}</Chip>}
                    {p.regulated && <Chip tone="warn">{d.regulatedChip}</Chip>}
                  </div>

                  {p.regulated && !ended && (
                    <p className="m-0 text-[13px] font-semibold text-ds-warn-ink bg-ds-warn-soft rounded-[8px] px-3 py-2">{d.regulatedLabel}</p>
                  )}

                  <figure className="m-0">
                    <blockquote lang="en" className="m-0 text-[15px] text-ds-ink leading-relaxed">
                      {p.headline}
                    </blockquote>
                    <footer className="text-[12px] text-ds-ink-soft mt-1">{d.quoteHeadline}</footer>
                  </figure>
                  <figure className="m-0">
                    <blockquote lang="en" className="m-0 text-[14px] text-ds-ink-soft leading-relaxed">
                      {p.terms_quote}
                    </blockquote>
                    <footer className="text-[12px] text-ds-ink-soft mt-1">{d.quoteTerms}</footer>
                  </figure>

                  {ended ? (
                    <p className="m-0 bg-ds-card-sub rounded-[8px] px-3 py-2 text-[13px] text-ds-ink-soft">
                      {tpl(d.endedNote, { date: date(p.expires) })}
                    </p>
                  ) : p.code ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-[8px] border border-ds-border bg-ds-card-sub px-3 py-1 text-[13px] text-ds-ink">
                        <span>{d.codeLabel}</span>
                        <code className="font-mono font-semibold">{p.code}</code>
                      </span>
                      <button
                        type="button"
                        onClick={() => copy(p.id, p.code as string)}
                        className={`min-h-6 min-w-6 px-3 py-1 rounded-full bg-ds-ink text-white border border-ds-ink text-[12px] font-semibold cursor-pointer ${FOCUS}`}
                      >
                        {copiedId === p.id ? d.copied : d.copy}
                      </button>
                      <span role="status" className="ds-sr-only">
                        {status?.id === p.id ? status.text : ''}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <Chip tone="good">{d.noCode}</Chip>
                    </div>
                  )}

                  <dl className="m-0 grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-3">
                    <div>
                      <dt className="text-ds-ink-soft">{d.confirmedOn}</dt>
                      <dd className="m-0 text-ds-ink">
                        <time dateTime={p.confirmed_on}>{date(p.confirmed_on)}</time>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ds-ink-soft">{ended ? d.endedLabel : d.endsLabel}</dt>
                      <dd className="m-0 text-ds-ink">
                        <time dateTime={p.expires}>{date(p.expires)}</time>
                      </dd>
                    </div>
                    {p.geo.length > 0 && (
                      <div>
                        <dt className="text-ds-ink-soft">{d.availableIn}</dt>
                        <dd className="m-0 text-ds-ink">{p.geo.join(', ')}</dd>
                      </div>
                    )}
                  </dl>

                  <div>
                    <h4 className="text-[14px] font-bold text-ds-ink m-0 mb-2">{d.productsHeading}</h4>
                    <ul className="list-none m-0 p-0 grid gap-3">
                      {card.products.map((product, index) => (
                        <li key={product.slug} className="flex flex-wrap items-center gap-3 border-t border-ds-border pt-3">
                          <ProductThumb product={product} size={36} variant="sm" />
                          <div className="min-w-0 flex-1">
                            <Link href={`/${product.slug}/`} className={`font-semibold text-ds-ink underline ${FOCUS}`}>
                              {product.name}
                            </Link>
                            <div className="text-[12px] text-ds-ink-soft">{product.brand}</div>
                          </div>
                          <ScorePill
                            score={product.score}
                            label={tpl(labels.scoreAria, { score: product.score.toFixed(1), max: (10).toFixed(1) })}
                          />
                          <Link href={`/${product.slug}/`} className={`text-[13px] text-ds-accent underline ${FOCUS}`}>
                            {tpl(d.review, { product: product.name })}
                          </Link>
                          {!ended && (
                            <div className="w-full sm:w-auto grid gap-1">
                              {purchaseUrl(product) !== null && (
                                <p className="m-0 text-[12px] text-ds-ink-soft">
                                  {earnsCommission(product) ? d.linkDisclosure : labels.noCommission}
                                </p>
                              )}
                              <TrackedAffiliateLink
                                product={product}
                                position={index + 1}
                                surface="deals"
                                className={BUY}
                                noticeStrings={labels.noPurchaseLink}
                                noticeVariant="compact"
                              >
                                {tpl(d.buy, { brand: product.brand })}
                              </TrackedAffiliateLink>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
