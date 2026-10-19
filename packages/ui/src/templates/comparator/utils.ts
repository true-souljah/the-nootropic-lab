// Pure utilities for the Comparator template. No React, no DOM (CSV
// download triggers a DOM operation, but the function itself is safe
// to call from anywhere — guards `document` access).

import { servingAmount, guaranteeDaysValue, monthlyStorePrice, perServingStorePrice } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import type { SortKey, SortDir, Goal, Grade } from './constants';
import { MAX_SELECTED } from './constants';

export interface UrlState {
  sortKey?: SortKey;
  sortDir?: SortDir;
  maxPrice?: number;
  caffeineFreeOnly?: boolean;
  euCompliantOnly?: boolean;
  showCommission?: boolean;
  bestFor?: Goal;
  grade?: Grade;
  selected?: string[];
}

/**
 * Parse a URLSearchParams object (typically from `window.location.search`)
 * into a partial state object. Only keys whose value passes its narrow
 * type guard are included. The caller spreads this into `setState` calls.
 * The full set of products is needed to validate `cmp` slugs.
 */
export function parseUrlState(params: URLSearchParams, products: Product[]): UrlState {
  const state: UrlState = {};

  const s = params.get('sort');
  if (s === 'score' || s === 'price' || s === 'trust' || s === 'value' || s === 'rank') {
    state.sortKey = s;
  }
  const d = params.get('dir');
  if (d === 'asc' || d === 'desc') state.sortDir = d;
  const m = Number(params.get('max'));
  if (Number.isFinite(m) && m >= 20 && m <= 100) state.maxPrice = m;
  if (params.get('caf') === '1') state.caffeineFreeOnly = true;
  if (params.get('eu') === '1') state.euCompliantOnly = true;
  if (params.get('comm') === '0') state.showCommission = false;
  const f = params.get('for');
  if (f === 'Any' || f === 'Focus' || f === 'Memory' || f === 'Energy' || f === 'Beginners' || f === 'Budget') {
    state.bestFor = f;
  }
  const g = params.get('grade');
  if (g === 'All' || g === 'Recommended' || g === 'Worth a look' || g === 'Skip') {
    state.grade = g;
  }
  const cmp = params.get('cmp');
  if (cmp) {
    const slugs = cmp
      .split(',')
      .map((s) => s.trim())
      .filter((s) => products.some((p) => p.slug === s))
      .slice(0, MAX_SELECTED);
    if (slugs.length > 0) state.selected = slugs;
  }

  return state;
}

/**
 * Prices stay in each store's own currency (never converted), so the table
 * can be sorted by price only when every per-month store price in it shares
 * one currency.
 */
export function priceSortable(products: Product[]): boolean {
  const currencies = new Set(products.flatMap((p) => {
    const m = monthlyStorePrice(p);
    return m ? [m.currency] : [];
  }));
  return currencies.size === 1;
}

/** Rows in sort order; a price sort the currencies do not allow keeps the given order. */
export function sortRows(rows: Product[], sortKey: SortKey, sortDir: SortDir, canSortPrice: boolean): Product[] {
  const get = (x: Product): number =>
    sortKey === 'score'
      ? x.score
      : sortKey === 'price'
        ? canSortPrice ? monthlyStorePrice(x)?.amount ?? Infinity : 0
        : sortKey === 'trust'
          ? x.trustpilotScore ?? 0
          : sortKey === 'value'
            ? x.scoreBreakdown.value ?? 0
            : 0;
  return [...rows].sort((a, b) => (sortDir === 'desc' ? get(b) - get(a) : get(a) - get(b)));
}

/**
 * Build a query-string from non-default state values. Used by "Save view"
 * to put a shareable URL on the clipboard. Returns the bare `?...` form
 * (or empty string when no overrides are set).
 */
export function buildViewQueryString(opts: {
  sortKey: SortKey;
  sortDir: SortDir;
  maxPrice: number;
  caffeineFreeOnly: boolean;
  euCompliantOnly: boolean;
  showCommission: boolean;
  bestFor: Goal;
  grade: Grade;
  selected: string[];
}): string {
  const params = new URLSearchParams();
  if (opts.sortKey !== 'score') params.set('sort', opts.sortKey);
  if (opts.sortDir !== 'desc') params.set('dir', opts.sortDir);
  if (opts.maxPrice !== 100) params.set('max', String(opts.maxPrice));
  if (opts.caffeineFreeOnly) params.set('caf', '1');
  if (opts.euCompliantOnly) params.set('eu', '1');
  if (!opts.showCommission) params.set('comm', '0');
  if (opts.bestFor !== 'Any') params.set('for', opts.bestFor);
  if (opts.grade !== 'All') params.set('grade', opts.grade);
  if (opts.selected.length > 0) params.set('cmp', opts.selected.join(','));
  return params.toString() ? `?${params.toString()}` : '';
}

/**
 * Trigger a CSV download for the given rows. Safe to call from any
 * environment — no-ops when `document` is undefined (SSR / static export).
 */
export function exportRowsToCsv(rows: Product[], strings: UIStrings): void {
  if (typeof document === 'undefined') return;
  // Header words in the page's language.
  const h = strings.comparator.csvHeaders;
  const headers = [
    h.rank,
    h.name,
    h.brand,
    h.score,
    h.packPrice,
    h.currency,
    h.pack,
    h.perMonth,
    h.perServing,
    h.dailyServing,
    h.moneyBackDays,
    h.trustpilot,
    h.bestFor,
  ];
  const perServingAmount = (p: Product) => {
    const s = perServingStorePrice(p);
    return s.ok ? s.amount : '';
  };
  const lines = rows.map((p, i) => [
    i + 1,
    p.name,
    p.brand,
    p.score,
    p.storePrice?.amount ?? '',
    p.storePrice?.currency ?? '',
    p.storePrice?.pack ?? '',
    monthlyStorePrice(p)?.amount ?? '',
    perServingAmount(p),
    servingAmount(p, strings),
    guaranteeDaysValue(p.moneyBackDays),
    p.trustpilotScore ?? '',
    // The tags as the page shows them: a translation overlay's display text
    // where there is one (LATAM), otherwise the record's own tags.
    (p.display?.bestFor ?? p.bestFor).join('; '),
  ]);
  const csv = [headers, ...lines]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
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
