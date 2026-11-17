'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { earnsCommission, purchaseUrl, type Product, type UIStrings } from '@nootropic/data';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import { ProductThumb } from '../primitives/ProductThumb';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import { tpl } from '../templateStrings';
import { ENDING_SOON_DAYS, offerState, utcToday } from './dealsState';
import type { PromoRecord } from '../promos';

export type DealCardView = { promo: PromoRecord; products: Product[] };
export type DealsLabels = { deals: UIStrings['deals']; scoreAria: string; noCommission: string; noPurchaseLink: UIStrings['noPurchaseLink'] };
const date = (value: string, locale: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export default function DealsList({ cards, builtOn, labels, dateLocale }: { cards: DealCardView[]; builtOn: string; labels: DealsLabels; dateLocale: string }) {
  const [today, setToday] = useState(builtOn); const [filterSoon, setFilterSoon] = useState(false); const [copied, setCopied] = useState<string | null>(null); const [message, setMessage] = useState('');
  useEffect(() => setToday(utcToday()), []);
  const visible = cards.filter((card) => offerState(card.promo, today) !== 'upcoming');
  if (visible.length > 0 && visible.every((card) => offerState(card.promo, today) === 'ended')) return <Card variant="subdued" padding={20}><Chip tone="bad">{labels.deals.allEndedChip}</Chip><h2 className="text-ds-ink">{labels.deals.allEndedTitle}</h2><p className="text-ds-ink-soft">{tpl(labels.deals.allEndedBody, { date: date(builtOn, dateLocale) })}</p></Card>;
  const shown = filterSoon ? visible.filter((card) => offerState(card.promo, today) === 'ending-soon') : visible;
  return <section aria-label={labels.deals.listLabel}>
    <div className="flex gap-3 items-center mb-4"><Chip active={filterSoon} onClick={() => setFilterSoon(!filterSoon)}>{filterSoon ? labels.deals.filterOn : labels.deals.filterOff}</Chip><span role="status" className="text-ds-muted text-sm">{tpl(filterSoon ? labels.deals.statusSoon : labels.deals.statusAll, { n: shown.length })}</span></div>
    {filterSoon && shown.length === 0 ? <Card variant="subdued" padding={20}><h2>{labels.deals.soonEmptyTitle}</h2><p>{tpl(labels.deals.soonEmptyBody, { days: ENDING_SOON_DAYS })}</p></Card> : <div id="deals-list" className="space-y-5">{shown.map((card) => {
      const state = offerState(card.promo, today); const ended = state === 'ended'; const p = card.promo;
      return <Card key={p.id} padding={20} className="space-y-4"><div className="flex flex-wrap gap-2 items-center"><h2 className="text-lg font-bold text-ds-ink m-0">{card.products[0]?.brand}</h2><Chip>{labels.deals.kind[p.kind]}</Chip>{state === 'ending-soon' && <Chip tone="warn">{tpl(labels.deals.endsSoonChip, { date: date(p.expires, dateLocale) })}</Chip>}{ended && <Chip tone="bad">{tpl(labels.deals.endedChip, { date: date(p.expires, dateLocale) })}</Chip>}</div>
        <blockquote lang="en" className="text-ds-ink-soft"><p>{p.headline}</p><footer>{labels.deals.quoteHeadline}</footer></blockquote><blockquote lang="en" className="text-ds-ink-soft"><p>{p.terms_quote}</p><footer>{labels.deals.quoteTerms}</footer></blockquote>
        {ended ? <p className="bg-ds-card-sub p-3 text-ds-ink-soft">{tpl(labels.deals.endedNote, { date: date(p.expires, dateLocale) })}</p> : <>{p.code ? <div className="flex gap-2 items-center"><span className="font-mono"><strong>{labels.deals.codeLabel}:</strong> {p.code}</span><button className="min-h-6 px-3 bg-ds-ink text-white rounded focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2" onClick={async () => { try { await navigator.clipboard.writeText(p.code!); setCopied(p.id); setMessage(tpl(labels.deals.copiedStatus, { code: p.code! })); setTimeout(() => setCopied(null), 2500); } catch { setMessage(labels.deals.copyFailed); } }}>{copied === p.id ? labels.deals.copied : labels.deals.copy}</button><span className="ds-sr-only" role="status">{message}</span></div> : <Chip tone="good">{labels.deals.noCode}</Chip>}</>}
        <dl className="grid grid-cols-2 gap-2 text-sm"><div><dt>{labels.deals.confirmedOn}</dt><dd><time dateTime={p.confirmed_on}>{date(p.confirmed_on, dateLocale)}</time></dd></div><div><dt>{labels.deals.endsLabel}</dt><dd><time dateTime={p.expires}>{date(p.expires, dateLocale)}</time></dd></div>{p.geo.length > 0 && <div><dt>{labels.deals.availableIn}</dt><dd>{p.geo.join(', ')}</dd></div>}</dl>
        <h3 className="text-ds-ink">{labels.deals.productsHeading}</h3>{card.products.map((product, index) => <div key={product.slug} className="flex flex-wrap items-center gap-3 border-t border-ds-border pt-3"><ProductThumb product={product} size={36} variant="sm"/><Link className="text-ds-accent underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2" href={`/${product.slug}/`}>{product.name}</Link><span className="text-ds-muted">{product.brand}</span><ScorePill score={product.score} ariaLabel={tpl(labels.scoreAria, { score: product.score.toFixed(1), max: (10).toFixed(1) })}/><Link className="text-ds-accent underline" href={`/${product.slug}/`}>{tpl(labels.deals.review, { product: product.name })}</Link>{!ended && <span className="ml-auto">{purchaseUrl(product) === null ? <TrackedAffiliateLink product={product} position={index + 1} surface="deals" noticeStrings={labels.noPurchaseLink}>{tpl(labels.deals.buy, { brand: product.brand })}</TrackedAffiliateLink> : earnsCommission(product) ? <><span className="block text-sm text-ds-ink-soft">{labels.deals.linkDisclosure}</span><TrackedAffiliateLink product={product} position={index + 1} surface="deals" noticeStrings={labels.noPurchaseLink} className="inline-block bg-ds-accent text-white px-4 py-2 rounded focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2">{tpl(labels.deals.buy, { brand: product.brand })}</TrackedAffiliateLink></> : <><span className="block text-sm text-ds-ink-soft">{labels.noCommission}</span><TrackedAffiliateLink product={product} position={index + 1} surface="deals" noticeStrings={labels.noPurchaseLink} className="inline-block bg-ds-accent text-white px-4 py-2 rounded">{tpl(labels.deals.buy, { brand: product.brand })}</TrackedAffiliateLink></>}</span>}</div>)}</Card>;
    })}</div>}
  </section>;
}
