'use client';
import { useId, useState, useMemo } from 'react';
import type { Product } from '@nootropic/data';
import ScoreTooltip from './ScoreTooltip';
import EUBadge from './EUBadge';

type SortKey = 'score' | 'priceMonthlyUSD' | 'priceMonthlyEUR' | 'moneyBackDays' | 'trustpilotScore';
type SortDir = 'asc' | 'desc';

interface Props {
  products: Product[];
  market: 'us' | 'eu';
}

interface SortBtnProps {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

function SortBtn({ col, sortKey, sortDir, onSort }: SortBtnProps) {
  const active = sortKey === col;
  return (
    <button
      onClick={() => onSort(col)}
      className={`ml-1 text-xs ${active ? 'text-green-700 font-bold' : 'text-gray-400'}`}
      aria-label={`Sort by ${col}`}
    >
      {active ? (sortDir === 'desc' ? '▼' : '▲') : '⇅'}
    </button>
  );
}

const FILTERS = [
  { key: 'caffeineFree', label: 'Caffeine-Free' },
  { key: 'euStorefront', label: 'EU Storefront' },
];

export default function ComparisonTable({ products, market }: Props) {
  const uid = useId();
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [priceMax, setPriceMax] = useState(200);
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const currency = market === 'eu' ? '€' : '$';
  const priceField = market === 'eu' ? 'priceMonthlyEUR' : 'priceMonthlyUSD';

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
    list = list.filter(p => {
      const price = p[priceField] as number | undefined;
      return price === undefined || price <= priceMax;
    });
    list.sort((a, b) => {
      const va = ((a[sortKey] as number | undefined) ?? 0);
      const vb = ((b[sortKey] as number | undefined) ?? 0);
      return sortDir === 'desc' ? vb - va : va - vb;
    });
    return list;
  }, [products, activeFilters, priceMax, sortKey, sortDir, priceField]);

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
        <div className="flex items-center gap-2 ml-auto text-sm text-gray-600">
          <label htmlFor={priceInputId}>Max {currency}{priceMax}/mo</label>
          <input
            id={priceInputId}
            type="range"
            min={20}
            max={200}
            step={5}
            value={priceMax}
            onChange={e => setPriceMax(Number(e.target.value))}
            className="w-28 accent-green-700"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-16 z-10">
            <tr>
              <th className="text-left p-3 w-8 font-semibold text-gray-600">#</th>
              <th className="text-left p-3 font-semibold text-gray-600">Product</th>
              <th className="text-left p-3 font-semibold text-gray-600">Best For</th>
              <th className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                Score <SortBtn col="score" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </th>
              <th className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                Price/mo <SortBtn col={priceField as SortKey} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </th>
              <th className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">Caffeine-Free</th>
              {market === 'eu' && (
                <th className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">EU Status</th>
              )}
              <th className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                Money-Back <SortBtn col="moneyBackDays" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </th>
              <th className="text-left p-3 font-semibold text-gray-600 whitespace-nowrap">
                Trustpilot <SortBtn col="trustpilotScore" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </th>
              <th className="p-3" />
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
                <td className="p-3 text-gray-400 font-bold">{i + 1}</td>
                <td className="p-3">
                  <div className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                    {p.name}
                    {p.editorChoice && <span className="editor-badge">Editor&apos;s Choice</span>}
                  </div>
                  <div className="text-xs text-gray-500">{p.brand}</div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {p.bestFor.slice(0, 2).map(tag => (
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
                  <ScoreTooltip score={p.score} breakdown={p.scoreBreakdown} />
                </td>
                <td className="p-3 font-semibold">
                  {p[priceField] !== undefined ? `${currency}${p[priceField]}` : '—'}
                </td>
                <td className="p-3 text-center">
                  {p.caffeineFree ? (
                    <span className="text-green-700 font-bold">✓</span>
                  ) : (
                    <span className="text-gray-400">✗</span>
                  )}
                </td>
                {market === 'eu' && (
                  <td className="p-3">
                    <EUBadge status={p.euCompliance} />
                  </td>
                )}
                <td className="p-3">{p.moneyBackDays} days</td>
                <td className="p-3">
                  <span
                    className={
                      p.trustpilotScore >= 4
                        ? 'text-green-700 font-semibold'
                        : p.trustpilotScore >= 3
                        ? 'text-amber-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {p.trustpilotScore}/5
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    ({p.trustpilotCount.toLocaleString()})
                  </span>
                </td>
                <td className="p-3">
                  <a
                    href={p.affiliateUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap"
                  >
                    Check Price →
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  No products match your filters. Try removing one.
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
                    <span className="text-gray-400 font-bold text-sm">#{i + 1}</span>
                    <span className="font-bold text-gray-900">{p.name}</span>
                    {p.editorChoice && <span className="editor-badge">Editor&apos;s Choice</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.brand}</div>
                </div>
                <ScoreTooltip score={p.score} breakdown={p.scoreBreakdown} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">Price: </span>
                  <strong>
                    {p[priceField] !== undefined ? `${currency}${p[priceField]}/mo` : '—'}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500">Money-back: </span>
                  <strong>{p.moneyBackDays}d</strong>
                </div>
                <div>
                  <span className="text-gray-500">Caffeine-free: </span>
                  <strong>{p.caffeineFree ? 'Yes' : 'No'}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Trustpilot: </span>
                  <strong
                    className={
                      p.trustpilotScore >= 4
                        ? 'text-green-700'
                        : p.trustpilotScore >= 3
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }
                  >
                    {p.trustpilotScore}/5
                  </strong>
                </div>
              </div>
              {market === 'eu' && (
                <div className="mb-3">
                  <EUBadge status={p.euCompliance} />
                </div>
              )}
              <a
                href={p.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="block w-full bg-green-700 hover:bg-green-600 text-white text-sm font-bold py-2 rounded text-center"
              >
                Check Current Price →
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">No products match your filters.</p>
        )}
      </div>
    </div>
  );
}
