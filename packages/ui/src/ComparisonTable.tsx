'use client';
import { useId, useState, useMemo } from 'react';
import type { Product, UIStrings } from '@nootropic/data';
import ScoreTooltip from './ScoreTooltip';
import EUBadge from './EUBadge';
import NoPurchaseLinkNotice from './NoPurchaseLinkNotice';
import { guaranteeDays, purchaseUrl, NO_PURCHASE_LINK_STRINGS, REGION_PROFILES, getStrings, formatMoney } from '@nootropic/data';
import { priceText } from './price-text';
import { PriceShort } from './PriceShort';
import { tpl } from './templateStrings';
import { formatScore } from './templates/listicleRanking';

type SortKey = 'score' | 'price' | 'moneyBackDays' | 'trustpilotScore';
type SortDir = 'asc' | 'desc';

/**
 * The words each sort control is named by. Its accessible name used to carry
 * the record field (`Sort by trustpilotScore`, `Sort by moneyBackDays`).
 */
const SORT_COLUMN: Record<SortKey, keyof UIStrings['table']['sortColumns']> = {
  score: 'score',
  price: 'price',
  moneyBackDays: 'moneyBack',
  trustpilotScore: 'trustpilot',
};

interface Props {
  products: Product[];
  market: 'us' | 'eu' | 'jp' | 'ca';
  strings?: UIStrings;
}

interface SortBtnProps {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  t: UIStrings['table'];
}

function SortBtn({ col, sortKey, sortDir, onSort, t }: SortBtnProps) {
  const active = sortKey === col;
  const column = t.sortColumns[SORT_COLUMN[col]];
  return (
    <button
      onClick={() => onSort(col)}
      className={`ml-1 text-xs ${active ? 'text-green-700 font-bold' : 'text-gray-500'}`}
      aria-label={
        active
          ? tpl(t.sortAriaActive, { column, direction: sortDir === 'desc' ? t.descending : t.ascending })
          : tpl(t.sortAria, { column })
      }
    >
      {active ? (sortDir === 'desc' ? '▼' : '▲') : '⇅'}
    </button>
  );
}

export default function ComparisonTable({ products, market, strings }: Props) {
  const t = strings?.table;
  // The bundle, or the en bundle on the callers that pass none (whose English
  // text below is unchanged).
  const ui = strings ?? getStrings('en');
  const tt = ui.table;
  const pd = ui.productDetail;
  const { colon, space } = ui.typography;
  // Same English fallback as the rest of this table when no bundle is passed.
  const noticeStrings = strings?.noPurchaseLink ?? NO_PURCHASE_LINK_STRINGS.en;
  // Buy link through the purchaseUrl() gate; the short notice when the
  // edition shows no purchase link for the product.
  const buyLink = (p: Product, className: string, label: string) => {
    const href = purchaseUrl(p);
    if (href === null) {
      return <NoPurchaseLinkNotice product={p} strings={noticeStrings} variant="compact" />;
    }
    return (
      <a href={href} target="_blank" rel="nofollow sponsored noopener noreferrer" className={className}>
        {label}
      </a>
    );
  };
  const uid = useId();
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  // Each price stays in its store's own currency (never converted). Sorting
  // and the max-price slider compare per-month figures, so they appear only
  // when every per-month figure in the table shares one currency.
  const priceStrings = {
    priceLocale: strings?.priceLocale ?? REGION_PROFILES[market].priceLocale,
    productDetail: pd,
  };
  const prices = new Map(products.map((p) => [p.slug, priceText(p, priceStrings)]));
  const monthlyOf = (p: Product) => prices.get(p.slug)?.monthlyMoney ?? null;
  const monthlyCurrencies = new Set(products.flatMap((p) => (monthlyOf(p) ? [monthlyOf(p)!.currency] : [])));
  const monthlyCurrency = monthlyCurrencies.size === 1 ? [...monthlyCurrencies][0] : null;
  // Yen prices run to thousands; a 20-200 slider would filter every one out.
  const sliderBounds =
    monthlyCurrency === 'JPY' ? { min: 1000, max: 20000, step: 500 } : { min: 20, max: 200, step: 5 };
  const [priceMax, setPriceMax] = useState(sliderBounds.max);
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const maxLabel = monthlyCurrency
    ? `≈ ${formatMoney({ amount: priceMax, currency: monthlyCurrency }, priceStrings.priceLocale)}/${priceStrings.productDetail.stats.monthUnit}`
    : '';

  const FILTERS = [
    { key: 'caffeineFree', label: t?.caffeineFree || 'Caffeine-Free' },
    { key: 'euStorefront', label: tt.euStorefront },
  ];

  function toggleFilter(key: string) {
    setActiveFilters(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeFilters.has('caffeineFree')) list = list.filter(p => p.caffeineFree);
    if (activeFilters.has('euStorefront')) list = list.filter(p => p.euStorefront);
    if (monthlyCurrency) list = list.filter(p => (monthlyOf(p)?.amount ?? 0) <= priceMax);
    const value = (p: Product): number =>
      sortKey === 'price' ? (monthlyOf(p)?.amount ?? 0) : ((p[sortKey] as number | null | undefined) ?? 0);
    list.sort((a, b) => (sortDir === 'desc' ? value(b) - value(a) : value(a) - value(b)));
    return list;
  }, [products, activeFilters, priceMax, sortKey, sortDir, monthlyCurrency]);

  const priceInputId = `${uid}-price-max`;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => toggleFilter(f.key)}
            aria-pressed={activeFilters.has(f.key)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              activeFilters.has(f.key)
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white text-gray-600 border-gray-300 hover:border-green-700'
            }`}
          >
            {f.label}
          </button>
        ))}
        {monthlyCurrency && (
        <div className="flex items-center gap-2 ml-auto text-sm text-gray-600">
          <label htmlFor={priceInputId}>{tpl(tt.maxPrice, { price: maxLabel })}</label>
          <input
            id={priceInputId}
            type="range"
            min={sliderBounds.min}
            max={sliderBounds.max}
            step={sliderBounds.step}
            value={priceMax}
            aria-valuetext={maxLabel}
            onChange={e => setPriceMax(Number(e.target.value))}
            className="w-28 accent-green-700"
          />
        </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-16 z-10">
            <tr>
              <th scope="col" className="text-left p-3 w-8 font-semibold text-gray-600">#</th>
              <th scope="col" className="text-left p-3 font-semibold text-gray-600">{t?.product || 'Product'}</th>
              <th scope="col" className="text-left p-3 font-semibold text-gray-600">{t?.bestFor || 'Best For'}</th>
              <th scope="col" className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                {t?.score || 'Score'}{space}<SortBtn col="score" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} t={tt} />
              </th>
              <th scope="col" className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                {t?.price || 'Price'}{space}{monthlyCurrency && <SortBtn col="price" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} t={tt} />}
              </th>
              <th scope="col" className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">{t?.caffeineFree || 'Caffeine-Free'}</th>
              {market === 'eu' && (
                <th scope="col" className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">{t?.euStatus || 'EU Status'}</th>
              )}
              <th scope="col" className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                {t?.moneyBack || 'Money-Back'}{space}<SortBtn col="moneyBackDays" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} t={tt} />
              </th>
              <th scope="col" className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                {t?.trustpilot || 'Trustpilot'}{space}<SortBtn col="trustpilotScore" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} t={tt} />
              </th>
              <th scope="col" className="p-3"><span className="sr-only">{tt.actions}</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                className={`border-t border-gray-100 ${
                  p.editorChoice ? 'winner-row' : 'hover:bg-gray-50'
                }`}
              >
                <td className="p-3 text-gray-500 font-bold">{i + 1}</td>
                <td className="p-3">
                  <div className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                    {p.name}
                    {p.editorChoice && <span className="editor-badge">{tt.editorChoice}</span>}
                  </div>
                  <div className="text-xs text-gray-500">{p.brand}</div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {(p.display?.bestFor ?? p.bestFor).slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <ScoreTooltip score={p.score} breakdown={p.scoreBreakdown} strings={ui} />
                </td>
                <td className="p-3 font-semibold">
                  <PriceShort price={prices.get(p.slug)} />
                </td>
                <td className="p-3 text-center">
                  {p.caffeineFree ? (
                    <span className="text-green-700 font-bold">✓</span>
                  ) : (
                    <span className="text-gray-500">✗</span>
                  )}
                </td>
                {market === 'eu' && (
                  <td className="p-3">
                    {p.euStorefront ? <EUBadge euStorefront strings={ui} /> : <span className="text-gray-500">—</span>}
                  </td>
                )}
                <td className="p-3">{guaranteeDays(p.moneyBackDays, (d) => tpl(pd.stats.daysCount, { days: d }))}</td>
                <td className="p-3">
                  {p.trustpilotScore !== null && p.trustpilotScore > 0 ? (
                    <>
                      <span
                        className={
                          p.trustpilotScore >= 4
                            ? 'text-green-700 font-semibold'
                            : p.trustpilotScore >= 3
                            ? 'text-amber-700 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {`${formatScore(p.trustpilotScore, pd.dateLocale)}/5`}
                      </span>
                      {p.trustpilotCount !== null && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({p.trustpilotCount.toLocaleString(pd.dateLocale)})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">{t?.na || 'N/A'}</span>
                  )}
                </td>
                <td className="p-3">
                  {buyLink(
                    p,
                    'bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap',
                    t?.checkPrice || 'Check Price →',
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  {t?.noResults || 'No products match your filters. Try removing one.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {filtered.map((p, i) => (
          <div
            key={p.id}
            className={`border rounded-lg overflow-hidden ${
              p.editorChoice ? 'border-yellow-400 winner-row' : 'border-gray-200'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-500 font-bold text-sm">#{i + 1}</span>
                    <span className="font-bold text-gray-900">{p.name}</span>
                    {p.editorChoice && <span className="editor-badge">{tt.editorChoice}</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.brand}</div>
                </div>
                <ScoreTooltip score={p.score} breakdown={p.scoreBreakdown} strings={ui} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">{t?.price || 'Price'}{colon}</span>
                  <strong><PriceShort price={prices.get(p.slug)} /></strong>
                </div>
                <div>
                  <span className="text-gray-500">{t?.moneyBack || 'Money-back'}{colon}</span>
                  <strong>{guaranteeDays(p.moneyBackDays, (d) => tpl(pd.stats.daysCountShort, { days: d }))}</strong>
                </div>
                <div>
                  <span className="text-gray-500">{t?.caffeineFree || 'Caffeine-free'}{colon}</span>
                  <strong>{p.caffeineFree ? (t?.yes || 'Yes') : (t?.no || 'No')}</strong>
                </div>
                <div>
                  <span className="text-gray-500">{t?.trustpilot || 'Trustpilot'}{colon}</span>
                  {p.trustpilotScore !== null && p.trustpilotScore > 0 ? (
                    <strong
                      className={
                        p.trustpilotScore >= 4
                          ? 'text-green-700'
                          : p.trustpilotScore >= 3
                          ? 'text-amber-700'
                          : 'text-red-600'
                      }
                    >
                      {`${formatScore(p.trustpilotScore, pd.dateLocale)}/5`}
                    </strong>
                  ) : (
                    <span className="text-gray-500">{t?.na || 'N/A'}</span>
                  )}
                </div>
              </div>
              {market === 'eu' && p.euStorefront && (
                <div className="mb-3">
                  <EUBadge euStorefront strings={ui} />
                </div>
              )}
              {buyLink(
                p,
                'block w-full bg-green-700 hover:bg-green-600 text-white text-sm font-bold py-2 rounded text-center',
                t?.checkPrice || 'Check Current Price →',
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">{t?.noResults || 'No products match your filters.'}</p>
        )}
      </div>
    </div>
  );
}
