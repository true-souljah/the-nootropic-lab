'use client';

import { useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { Download, Save, X, SlidersHorizontal } from 'lucide-react';
import AppShell from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import { Bar } from '../primitives/Bar';
import { ToggleSwitch } from '../primitives/ToggleSwitch';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';

export interface ComparatorProps {
  products: Product[];
  siteUrl: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

type SortKey = 'rank' | 'score' | 'price' | 'trust' | 'value';
type SortDir = 'asc' | 'desc';
type Goal = 'Any' | 'Focus' | 'Memory' | 'Energy' | 'Beginners' | 'Budget';
type Grade = 'All' | 'Recommended' | 'Worth a look' | 'Skip';

const GOALS: Goal[] = ['Any', 'Focus', 'Memory', 'Energy', 'Beginners', 'Budget'];
const GRADES: Array<{ id: Grade; tone?: 'good' | 'warn' | 'bad' }> = [
  { id: 'All' },
  { id: 'Recommended', tone: 'good' },
  { id: 'Worth a look', tone: 'warn' },
  { id: 'Skip', tone: 'bad' },
];

const MAX_SELECTED = 3;

const COLUMNS: Array<{
  key: SortKey | null;
  label: string;
  width: number;
  align?: 'right' | 'center';
}> = [
  { key: null, label: '', width: 44 },
  { key: 'rank', label: '#', width: 50 },
  { key: null, label: 'Product', width: 260 },
  { key: 'score', label: 'Score', width: 110 },
  { key: 'value', label: 'Value', width: 80, align: 'right' },
  { key: 'price', label: '$/mo', width: 80, align: 'right' },
  { key: 'trust', label: 'Trustpilot', width: 130, align: 'right' },
  { key: null, label: 'Best for', width: 180 },
];

/**
 * Comparator — Phase 1's interactive flagship surface. 260px filter
 * sidebar inside the AppShell main content (which itself sits beside
 * the dark sidebar). Sortable table with checkbox-selectable rows
 * (max 3 FIFO), per-Phase-5 EU + Hands-on toggles, Save view → URL
 * + clipboard copy. Compare drawer renders below the table when ≥1
 * row is selected.
 */
export default function Comparator({
  products,
  siteUrl,
  searchItems,
  uiStrings,
}: ComparatorProps) {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [maxPrice, setMaxPrice] = useState(100);
  const [caffeineFreeOnly, setCaffeineFreeOnly] = useState(false);
  const [euCompliantOnly, setEuCompliantOnly] = useState(false);
  const [handsOnOnly, setHandsOnOnly] = useState(false);
  const [showCommission, setShowCommission] = useState(true);
  const [bestFor, setBestFor] = useState<Goal>('Any');
  const [grade, setGrade] = useState<Grade>('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // One-shot URL → state rehydration on mount. After hydration, "Save view"
  // writes back to the URL; we don't sync on every state change to avoid
  // a noisy initial paint per the M6 a11y review.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const s = params.get('sort');
    if (s === 'score' || s === 'price' || s === 'trust' || s === 'value' || s === 'rank') setSortKey(s);
    const d = params.get('dir');
    if (d === 'asc' || d === 'desc') setSortDir(d);
    const m = Number(params.get('max'));
    if (Number.isFinite(m) && m >= 20 && m <= 100) setMaxPrice(m);
    if (params.get('caf') === '1') setCaffeineFreeOnly(true);
    if (params.get('eu') === '1') setEuCompliantOnly(true);
    if (params.get('hands') === '1') setHandsOnOnly(true);
    if (params.get('comm') === '0') setShowCommission(false);
    const f = params.get('for');
    if (f === 'Any' || f === 'Focus' || f === 'Memory' || f === 'Energy' || f === 'Beginners' || f === 'Budget') {
      setBestFor(f);
    }
    const g = params.get('grade');
    if (g === 'All' || g === 'Recommended' || g === 'Worth a look' || g === 'Skip') {
      setGrade(g);
    }
    const cmp = params.get('cmp');
    if (cmp) {
      const slugs = cmp
        .split(',')
        .map((s) => s.trim())
        .filter((s) => products.some((p) => p.slug === s))
        .slice(0, MAX_SELECTED);
      if (slugs.length > 0) setSelected(slugs);
    }
  }, [products]);

  const reset = useCallback(() => {
    setMaxPrice(100);
    setCaffeineFreeOnly(false);
    setEuCompliantOnly(false);
    setHandsOnOnly(false);
    setBestFor('Any');
    setGrade('All');
  }, []);

  const rows = useMemo(() => {
    let r = products.filter((p) => (p.priceMonthlyUSD ?? Infinity) <= maxPrice);
    if (caffeineFreeOnly) r = r.filter((p) => p.caffeineFree);
    if (euCompliantOnly) r = r.filter((p) => p.euCompliance === 'compliant');
    if (handsOnOnly) r = r.filter((p) => p.handsOnTested === true);
    if (bestFor !== 'Any') r = r.filter((p) => p.bestFor.includes(bestFor));
    if (grade !== 'All') {
      r = r.filter((p) => {
        if (grade === 'Recommended') return p.score >= 8.5;
        if (grade === 'Worth a look') return p.score >= 7.5 && p.score < 8.5;
        return p.score < 7.5;
      });
    }
    return [...r].sort((a, b) => {
      const get = (x: Product) =>
        sortKey === 'score'
          ? x.score
          : sortKey === 'price'
            ? x.priceMonthlyUSD ?? Infinity
            : sortKey === 'trust'
              ? x.trustpilotScore ?? 0
              : sortKey === 'value'
                ? x.scoreBreakdown.value
                : 0;
      return sortDir === 'desc' ? get(b) - get(a) : get(a) - get(b);
    });
  }, [
    products,
    sortKey,
    sortDir,
    maxPrice,
    caffeineFreeOnly,
    euCompliantOnly,
    handsOnOnly,
    bestFor,
    grade,
  ]);

  function toggleSort(k: SortKey | null) {
    if (!k) return;
    if (k === sortKey) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(k);
      setSortDir('desc');
    }
  }
  const arrow = (k: SortKey | null) =>
    k && k === sortKey ? (sortDir === 'desc' ? ' ↓' : ' ↑') : '';

  function toggleSelect(slug: string) {
    setSelected((s) => {
      if (s.includes(slug)) return s.filter((x) => x !== slug);
      return s.length >= MAX_SELECTED ? [...s.slice(1), slug] : [...s, slug];
    });
  }
  const selectedProducts = selected
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  function saveView() {
    const params = new URLSearchParams();
    if (sortKey !== 'score') params.set('sort', sortKey);
    if (sortDir !== 'desc') params.set('dir', sortDir);
    if (maxPrice !== 100) params.set('max', String(maxPrice));
    if (caffeineFreeOnly) params.set('caf', '1');
    if (euCompliantOnly) params.set('eu', '1');
    if (handsOnOnly) params.set('hands', '1');
    if (!showCommission) params.set('comm', '0');
    if (bestFor !== 'Any') params.set('for', bestFor);
    if (grade !== 'All') params.set('grade', grade);
    if (selected.length > 0) params.set('cmp', selected.join(','));
    const url = `${siteUrl}/nootropic-comparison${params.toString() ? `?${params.toString()}` : ''}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setSavedNotice('Link copied to clipboard');
        setTimeout(() => setSavedNotice(null), 2500);
      });
    } else {
      setSavedNotice('Could not access clipboard');
      setTimeout(() => setSavedNotice(null), 2500);
    }
  }

  function exportCsv() {
    const headers = ['Rank', 'Name', 'Brand', 'Score', 'Price USD/mo', 'Caps/day', 'MBG days', 'Trustpilot', 'Best for'];
    const lines = rows.map((p, i) => [
      i + 1,
      p.name,
      p.brand,
      p.score,
      p.priceMonthlyUSD ?? '',
      p.capsulesPerServing,
      p.moneyBackDays,
      p.trustpilotScore ?? '',
      p.bestFor.join('; '),
    ]);
    const csv = [headers, ...lines]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    if (typeof document === 'undefined') return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nootropic-comparison-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Shared filter UI — rendered into both the desktop sidebar and the
  // mobile bottom-sheet. idPrefix keeps form ids unique between renderings.
  function renderFilters(idPrefix: 'd' | 'm'): ReactNode {
    return (
      <>
        <div className="text-[11px] uppercase tracking-[0.14em] text-ds-muted font-semibold mb-3">
          Filters
        </div>
        <div className="mb-[22px]">
          <div className="text-[12px] font-semibold mb-2 text-ds-ink">Goal</div>
          <div role="group" aria-label="Filter by goal" className="flex flex-wrap gap-[6px]">
            {GOALS.map((g) => (
              <Chip key={g} active={bestFor === g} onClick={() => setBestFor(g)}>
                {g}
              </Chip>
            ))}
          </div>
        </div>
        <div className="mb-[22px]">
          <div className="flex justify-between mb-2">
            <label htmlFor={`${idPrefix}-max-price`} className="text-[12px] font-semibold text-ds-ink">
              Max $/month
            </label>
            <span className="text-[12px] font-bold text-ds-accent ds-tabular">${maxPrice}</span>
          </div>
          <input
            id={`${idPrefix}-max-price`}
            type="range"
            min={20}
            max={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: 'var(--color-ds-accent)' }}
          />
          <div className="flex justify-between text-[10px] text-ds-muted mt-[2px] ds-tabular">
            <span>$20</span>
            <span>$100</span>
          </div>
        </div>
        <fieldset className="mb-[22px] m-0 p-0 border-0">
          <legend className="text-[12px] font-semibold mb-2 text-ds-ink">Our grade</legend>
          <div className="flex flex-col gap-1">
            {GRADES.map(({ id, tone }) => {
              const dotClass =
                tone === 'good'
                  ? 'bg-ds-good'
                  : tone === 'warn'
                    ? 'bg-ds-warn'
                    : tone === 'bad'
                      ? 'bg-ds-bad'
                      : '';
              return (
                <label key={id} className="flex gap-2 items-center cursor-pointer py-1">
                  <input
                    type="radio"
                    name={`${idPrefix}-grade`}
                    checked={grade === id}
                    onChange={() => setGrade(id)}
                    style={{ accentColor: 'var(--color-ds-accent)' }}
                  />
                  {dotClass && <span aria-hidden="true" className={`w-2 h-2 rounded-full ${dotClass}`} />}
                  <span className="text-[13px] text-ds-ink">{id}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="mb-[22px] pt-[14px] border-t border-ds-border flex flex-col gap-[14px]">
          <ToggleSwitch checked={caffeineFreeOnly} onChange={setCaffeineFreeOnly} label="Caffeine-free only" />
          <ToggleSwitch checked={euCompliantOnly} onChange={setEuCompliantOnly} label="EU-compliant only" />
          <ToggleSwitch checked={handsOnOnly} onChange={setHandsOnOnly} label="★ Hands-on tested only" />
          <ToggleSwitch
            checked={showCommission}
            onChange={setShowCommission}
            label="Show our commission"
            description="Doesn't change scores"
          />
        </div>
        <button
          type="button"
          onClick={reset}
          className="w-full bg-transparent text-ds-muted border border-ds-border py-2 rounded-[8px] text-[12px] font-medium cursor-pointer hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          Reset all filters
        </button>
      </>
    );
  }

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={[{ label: 'Comparator' }]}
      searchItems={searchItems}
      uiStrings={uiStrings}
      hideStackCta
      sidebarMeta={`${products.length} products`}
    >
      {/* Shared filter body — rendered in both the desktop sticky column and
          the mobile bottom-sheet overlay. State flows via closure. The
          idPrefix keeps form ids unique between the two renderings. */}
      {(() => null)()}

      <div className="grid items-start grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Desktop filter sidebar — sticky column on lg+ */}
        <div className="hidden lg:block bg-ds-card border-r border-ds-border p-5 sticky top-[60px] self-start min-h-[calc(100vh-60px)]">
          {renderFilters('d')}
        </div>

        {/* Main content */}
        <div className="px-4 sm:px-6 pt-6">
          <div className="flex justify-between items-end mb-[14px] flex-wrap gap-3">
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.02em] m-0 text-ds-ink">
                Comparator
              </h1>
              <div className="text-[12px] text-ds-muted mt-[2px]">
                {rows.length} of {products.length} match · select up to {MAX_SELECTED} to compare side-by-side
              </div>
            </div>
            <div className="flex gap-[6px] items-center flex-wrap">
              {savedNotice && (
                <span className="text-[12px] text-ds-good-ink bg-ds-good-soft px-3 py-[7px] rounded-[8px] font-medium">
                  {savedNotice}
                </span>
              )}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                aria-expanded={mobileFiltersOpen}
                className="lg:hidden bg-ds-accent text-white px-3 py-[7px] rounded-[8px] text-[12px] font-semibold cursor-pointer inline-flex items-center gap-[6px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <SlidersHorizontal size={12} strokeWidth={2.4} aria-hidden={true} />
                Filters
              </button>
              <button
                type="button"
                onClick={exportCsv}
                className="bg-ds-card border border-ds-border px-3 py-[7px] rounded-[8px] text-[12px] text-ds-ink-soft font-medium cursor-pointer flex items-center gap-[6px] hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <Download size={12} strokeWidth={2.2} aria-hidden={true} />
                CSV
              </button>
              <button
                type="button"
                onClick={saveView}
                className="bg-ds-card border border-ds-border px-3 py-[7px] rounded-[8px] text-[12px] text-ds-ink-soft font-medium cursor-pointer flex items-center gap-[6px] hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <Save size={12} strokeWidth={2.2} aria-hidden={true} />
                Save view
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-ds-card border border-ds-border rounded-[10px] overflow-x-auto">
            <div className="min-w-[1024px]">
            {/* Header */}
            <div
              role="row"
              className="flex border-b border-ds-border bg-ds-card-sub text-[11px] text-ds-muted uppercase tracking-[0.08em] font-bold"
            >
              {COLUMNS.map((c) => {
                const headerProps = c.key
                  ? {
                      onClick: () => toggleSort(c.key),
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleSort(c.key);
                        }
                      },
                      tabIndex: 0,
                      role: 'columnheader' as const,
                      'aria-sort':
                        c.key === sortKey
                          ? sortDir === 'asc'
                            ? ('ascending' as const)
                            : ('descending' as const)
                          : ('none' as const),
                    }
                  : { role: 'columnheader' as const };
                return (
                  <div
                    key={c.label || `spacer-${c.width}`}
                    {...headerProps}
                    style={{
                      flex: `0 0 ${c.width}px`,
                      textAlign: c.align ?? 'left',
                    }}
                    className={`px-[14px] py-3 ${c.key ? 'cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2' : ''} ${
                      c.key === sortKey ? 'text-ds-accent' : ''
                    }`}
                  >
                    {c.label}
                    {arrow(c.key)}
                  </div>
                );
              })}
              {showCommission && (
                <div
                  role="columnheader"
                  className="px-[14px] py-3 text-right"
                  style={{ flex: '0 0 90px' }}
                >
                  Our cut
                </div>
              )}
              <div role="columnheader" className="px-[14px] py-3" style={{ flex: '0 0 80px' }} />
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
              <div className="p-9 text-center text-ds-muted text-[13px]">
                No products match.{' '}
                <button
                  type="button"
                  onClick={reset}
                  className="bg-transparent text-ds-accent border-0 cursor-pointer font-semibold underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              rows.map((p, idx) => {
                const isSelected = selected.includes(p.slug);
                return (
                  <div
                    key={p.slug}
                    className={`flex border-b border-ds-border last:border-b-0 items-center ${
                      isSelected ? 'bg-ds-accent-soft' : 'bg-transparent'
                    }`}
                  >
                    <div className="px-[14px] py-3 flex justify-center" style={{ flex: '0 0 44px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(p.slug)}
                        aria-label={`Compare ${p.name}`}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: 'var(--color-ds-accent)' }}
                      />
                    </div>
                    <div
                      className="px-[14px] py-3 text-ds-muted font-medium ds-tabular"
                      style={{ flex: '0 0 50px' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div
                      className="px-[14px] py-3 flex items-center gap-[10px]"
                      style={{ flex: '0 0 260px' }}
                    >
                      <div
                        className="w-8 h-8 bg-ds-ink rounded-[7px] grid place-items-center text-white font-bold text-[13px] flex-shrink-0"
                        aria-hidden="true"
                      >
                        {p.name[0]}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/${p.slug}`}
                          className="font-semibold text-[13.5px] text-ds-ink tracking-[-0.005em] truncate block hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                        >
                          {p.name}
                        </Link>
                        <div className="text-[11.5px] text-ds-muted">
                          {p.brand}
                          {!p.caffeineFree ? ' · caffeine' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="px-[14px] py-3" style={{ flex: '0 0 110px' }}>
                      <ScorePill score={p.score} />
                    </div>
                    <div
                      className="px-[14px] py-3 text-right text-ds-ink-soft ds-tabular"
                      style={{ flex: '0 0 80px' }}
                    >
                      {p.scoreBreakdown.value}/10
                    </div>
                    <div
                      className="px-[14px] py-3 text-right font-semibold ds-tabular"
                      style={{ flex: '0 0 80px' }}
                    >
                      {p.priceMonthlyUSD ? `$${p.priceMonthlyUSD}` : '—'}
                    </div>
                    <div
                      className={`px-[14px] py-3 text-right ds-tabular ${
                        p.trustpilotScore >= 4
                          ? 'text-ds-good-ink font-semibold'
                          : p.trustpilotScore < 3.5
                            ? 'text-ds-bad-ink font-semibold'
                            : 'text-ds-ink'
                      }`}
                      style={{ flex: '0 0 130px' }}
                    >
                      {p.trustpilotScore}{' '}
                      <span className="text-ds-muted font-normal">
                        · {p.trustpilotCount?.toLocaleString() ?? 'n/a'}
                      </span>
                    </div>
                    <div
                      className="px-[14px] py-3 text-ds-muted text-[12px]"
                      style={{ flex: '0 0 180px' }}
                    >
                      {p.bestFor.join(' · ')}
                    </div>
                    {showCommission && (
                      <div
                        className="px-[14px] py-3 text-right font-semibold text-ds-accent"
                        style={{ flex: '0 0 90px' }}
                      >
                        {p.commissionRate}
                      </div>
                    )}
                    <div className="px-[14px] py-3 text-right" style={{ flex: '0 0 80px' }}>
                      <Link
                        href={`/${p.slug}`}
                        className="bg-transparent text-ds-accent border-0 text-[12px] font-semibold no-underline hover:text-ds-accent-press focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </div>

          {/* Compare drawer */}
          {selectedProducts.length > 0 && (
            <Card
              padding={18}
              className="mt-4 mb-6 border-ds-accent-border"
              style={{ borderColor: 'var(--color-ds-accent-border)', boxShadow: '0 4px 16px rgba(15,22,35,0.06)' }}
            >
              <div className="flex justify-between items-center mb-[14px] flex-wrap gap-2">
                <div>
                  <div className="text-[11px] text-ds-accent tracking-[0.14em] uppercase font-bold">
                    Compare
                  </div>
                  <div className="font-semibold text-[15px] mt-[2px]">
                    {selectedProducts.length} selected · side by side
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="inline-flex items-center gap-1 bg-transparent text-ds-muted border border-ds-border px-3 py-[6px] rounded-[6px] text-[12px] cursor-pointer hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  <X size={12} strokeWidth={2.4} aria-hidden={true} />
                  Clear
                </button>
              </div>
              <div
                className="grid gap-[14px]"
                style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)` }}
              >
                {selectedProducts.map((p) => (
                  <Card key={p.slug} variant="subdued" padding={14}>
                    <div className="flex items-center gap-[10px]">
                      <div
                        className="w-8 h-8 bg-ds-ink rounded-[7px] grid place-items-center text-white font-bold text-[13px] flex-shrink-0"
                        aria-hidden="true"
                      >
                        {p.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/${p.slug}`}
                          className="font-semibold text-[14px] truncate block text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                        >
                          {p.name}
                        </Link>
                        <div className="text-[11px] text-ds-muted">{p.brand}</div>
                      </div>
                      <ScorePill score={p.score} />
                    </div>
                    <dl className="mt-3 text-[12px] text-ds-ink-soft m-0">
                      {[
                        ['Price', p.priceMonthlyUSD ? `$${p.priceMonthlyUSD}/mo` : '—'],
                        ['Caps', `${p.capsulesPerServing}/day`],
                        ['MBG', `${p.moneyBackDays} days`],
                        ['Caffeine', p.caffeineFree ? 'Free' : 'Yes'],
                        ['Trustpilot', `${p.trustpilotScore} (${p.trustpilotCount?.toLocaleString() ?? 'n/a'})`],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex justify-between py-[5px] border-b border-ds-border last:border-b-0"
                        >
                          <dt className="text-ds-muted m-0">{k}</dt>
                          <dd className="font-medium text-ds-ink m-0">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-[10px]">
                      {(['ingredients', 'dosing', 'transparency'] as const).map((k) => {
                        const v = p.scoreBreakdown[k];
                        return (
                          <div
                            key={k}
                            className="grid items-center gap-[6px] py-[2px]"
                            style={{ gridTemplateColumns: '70px 1fr 22px' }}
                          >
                            <span className="text-[11px] text-ds-muted capitalize">{k}</span>
                            <Bar value={v} label={`${p.name} ${k} score`} height={5} />
                            <span className="text-[11px] text-ds-ink text-right ds-tabular">{v}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile bottom-sheet for filters */}
      {mobileFiltersOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-[rgba(11,18,32,0.55)] cursor-default"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-ds-card rounded-t-[16px] overflow-y-auto p-5 shadow-[0_-12px_36px_rgba(15,22,35,0.18)]">
            <div className="flex justify-between items-center mb-4 -mt-1">
              <span className="text-[14px] font-semibold text-ds-ink">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="w-9 h-9 grid place-items-center text-ds-muted hover:bg-ds-card-sub rounded focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <X size={18} strokeWidth={2} aria-hidden={true} />
              </button>
            </div>
            {renderFilters('m')}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-4 bg-ds-accent hover:bg-ds-accent-press text-white py-[10px] rounded-[8px] text-[13px] font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              Show {rows.length} product{rows.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
