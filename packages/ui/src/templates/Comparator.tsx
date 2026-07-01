'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Download, Save, X, SlidersHorizontal } from 'lucide-react';
import AppShell from './AppShell';
import { ScorePill } from '../primitives/ScorePill';
import { LiveRegion } from '../primitives/LiveRegion';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';
import { COLUMNS, MAX_SELECTED } from './comparator/constants';
import type { SortKey, SortDir, Goal, Grade } from './comparator/constants';
import { parseUrlState, buildViewQueryString, exportRowsToCsv } from './comparator/utils';
import { ComparatorFilters } from './comparator/ComparatorFilters';
import { ComparatorCompareCard } from './comparator/ComparatorCompareCard';

export interface ComparatorProps {
  products: Product[];
  siteUrl: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

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
  const filtersTriggerRef = useRef<HTMLButtonElement>(null);
  const filterSheetRef = useRef<HTMLDivElement>(null);

  // Move focus into the filter sheet on open; restore to the trigger on close.
  // The wasOpenRef guard prevents stealing focus on initial mount when the
  // sheet has never been open.
  const wasFiltersOpenRef = useRef(false);
  useEffect(() => {
    if (mobileFiltersOpen) {
      wasFiltersOpenRef.current = true;
      const close = filterSheetRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close filters"]');
      close?.focus();
    } else if (wasFiltersOpenRef.current) {
      wasFiltersOpenRef.current = false;
      filtersTriggerRef.current?.focus();
    }
  }, [mobileFiltersOpen]);

  // One-shot URL → state rehydration on mount. After hydration, "Save view"
  // writes back to the URL; we don't sync on every state change to avoid
  // a noisy initial paint per the M6 a11y review.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const state = parseUrlState(new URLSearchParams(window.location.search), products);
    if (state.sortKey !== undefined) setSortKey(state.sortKey);
    if (state.sortDir !== undefined) setSortDir(state.sortDir);
    if (state.maxPrice !== undefined) setMaxPrice(state.maxPrice);
    if (state.caffeineFreeOnly !== undefined) setCaffeineFreeOnly(state.caffeineFreeOnly);
    if (state.euCompliantOnly !== undefined) setEuCompliantOnly(state.euCompliantOnly);
    if (state.handsOnOnly !== undefined) setHandsOnOnly(state.handsOnOnly);
    if (state.showCommission !== undefined) setShowCommission(state.showCommission);
    if (state.bestFor !== undefined) setBestFor(state.bestFor);
    if (state.grade !== undefined) setGrade(state.grade);
    if (state.selected !== undefined) setSelected(state.selected);
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
    const qs = buildViewQueryString({
      sortKey,
      sortDir,
      maxPrice,
      caffeineFreeOnly,
      euCompliantOnly,
      handsOnOnly,
      showCommission,
      bestFor,
      grade,
      selected,
    });
    const url = `${siteUrl}/nootropic-comparison${qs}`;
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

  const filterProps = {
    bestFor,
    setBestFor,
    maxPrice,
    setMaxPrice,
    grade,
    setGrade,
    caffeineFreeOnly,
    setCaffeineFreeOnly,
    euCompliantOnly,
    setEuCompliantOnly,
    handsOnOnly,
    setHandsOnOnly,
    showCommission,
    setShowCommission,
    onReset: reset,
  };

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={[{ label: 'Comparator' }]}
      searchItems={searchItems}
      uiStrings={uiStrings}
      hideStackCta
      sidebarMeta={`${products.length} products`}
    >
      {/* When the mobile filter sheet is open, `inert` removes everything
          else from tab order + AT focus — keyboard users can't escape the
          dialog into obscured content. */}
      <div
        {...(mobileFiltersOpen ? { inert: '' as unknown as undefined } : {})}
        className="grid items-start grid-cols-1 lg:grid-cols-[260px_1fr]"
      >
        {/* Desktop filter sidebar — sticky column on lg+ */}
        <div className="hidden lg:block bg-ds-card border-r border-ds-border p-5 sticky top-[60px] self-start min-h-[calc(100vh-60px)]">
          <ComparatorFilters idPrefix="d" {...filterProps} />
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
              <LiveRegion message={savedNotice ?? ''} />
              {savedNotice && (
                <span
                  aria-hidden="true"
                  className="text-[12px] text-ds-good-ink bg-ds-good-soft px-3 py-[7px] rounded-[8px] font-medium"
                >
                  {savedNotice}
                </span>
              )}
              <button
                ref={filtersTriggerRef}
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                aria-expanded={mobileFiltersOpen}
                aria-controls="comparator-mobile-filters"
                className="lg:hidden bg-ds-accent text-white px-3 py-[7px] rounded-[8px] text-[12px] font-semibold cursor-pointer inline-flex items-center gap-[6px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <SlidersHorizontal size={12} strokeWidth={2.4} aria-hidden={true} />
                Filters
              </button>
              <button
                type="button"
                onClick={() => exportRowsToCsv(rows)}
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
          <div className="bg-ds-card border border-ds-border rounded-[10px] overflow-x-auto overscroll-x-contain">
            <div
              role="grid"
              aria-label="Products comparison"
              aria-rowcount={rows.length + 1}
              className="min-w-[1024px]"
            >
            {/* Header */}
            <div
              role="row"
              aria-rowindex={1}
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
              <div role="row" aria-rowindex={2}>
                <div role="gridcell" className="p-9 text-center text-ds-muted text-[13px]">
                  No products match.{' '}
                  <button
                    type="button"
                    onClick={reset}
                    className="bg-transparent text-ds-accent border-0 cursor-pointer font-semibold underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            ) : (
              rows.map((p, idx) => {
                const isSelected = selected.includes(p.slug);
                return (
                  <div
                    key={p.slug}
                    role="row"
                    aria-rowindex={idx + 2}
                    aria-selected={isSelected}
                    className={`flex border-b border-ds-border last:border-b-0 items-center ${
                      isSelected ? 'bg-ds-accent-soft' : 'bg-transparent'
                    }`}
                  >
                    <div role="gridcell" className="px-[14px] py-3 flex justify-center" style={{ flex: '0 0 44px' }}>
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
                      role="gridcell"
                      className="px-[14px] py-3 text-ds-muted font-medium ds-tabular"
                      style={{ flex: '0 0 50px' }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div
                      role="gridcell"
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
                    <div role="gridcell" className="px-[14px] py-3" style={{ flex: '0 0 110px' }}>
                      <ScorePill score={p.score} />
                    </div>
                    <div
                      role="gridcell"
                      className="px-[14px] py-3 text-right text-ds-ink-soft ds-tabular"
                      style={{ flex: '0 0 80px' }}
                    >
                      {p.scoreBreakdown.value}/10
                    </div>
                    <div
                      role="gridcell"
                      className="px-[14px] py-3 text-right font-semibold ds-tabular"
                      style={{ flex: '0 0 80px' }}
                    >
                      {p.priceMonthlyUSD ? `$${p.priceMonthlyUSD}` : '—'}
                    </div>
                    <div
                      role="gridcell"
                      className={`px-[14px] py-3 text-right ds-tabular ${
                        p.trustpilotScore === null
                          ? 'text-ds-muted'
                          : p.trustpilotScore >= 4
                            ? 'text-ds-good-ink font-semibold'
                            : p.trustpilotScore < 3.5
                              ? 'text-ds-bad-ink font-semibold'
                              : 'text-ds-ink'
                      }`}
                      style={{ flex: '0 0 130px' }}
                    >
                      {p.trustpilotScore === null ? (
                        <span className="text-ds-muted">N/A</span>
                      ) : (
                        <>
                          {p.trustpilotScore}{' '}
                          <span className="text-ds-muted font-normal">
                            · {p.trustpilotCount?.toLocaleString() ?? 'n/a'}
                          </span>
                        </>
                      )}
                    </div>
                    <div
                      role="gridcell"
                      className="px-[14px] py-3 text-ds-muted text-[12px]"
                      style={{ flex: '0 0 180px' }}
                    >
                      {p.bestFor.join(' · ')}
                    </div>
                    {showCommission && (
                      <div
                        role="gridcell"
                        className="px-[14px] py-3 text-right font-semibold text-ds-accent"
                        style={{ flex: '0 0 90px' }}
                      >
                        {p.commissionRate}
                      </div>
                    )}
                    <div role="gridcell" className="px-[14px] py-3 text-right" style={{ flex: '0 0 80px' }}>
                      <Link
                        href={`/${p.slug}`}
                        aria-label={`View ${p.name}`}
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
          <ComparatorCompareCard
            selectedProducts={selectedProducts}
            onClear={() => setSelected([])}
          />
        </div>
      </div>

      {/* Mobile bottom-sheet for filters */}
      {mobileFiltersOpen && (
        <div
          ref={filterSheetRef}
          id="comparator-mobile-filters"
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
            <ComparatorFilters idPrefix="m" {...filterProps} />
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
