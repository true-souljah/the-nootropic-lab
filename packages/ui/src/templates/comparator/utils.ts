// Pure utilities for the Comparator template. No React, no DOM (CSV
// download triggers a DOM operation, but the function itself is safe
// to call from anywhere — guards `document` access).

import type { Product } from '@nootropic/data';
import type { SortKey, SortDir, Goal, Grade } from './constants';
import { MAX_SELECTED } from './constants';

export interface UrlState {
  sortKey?: SortKey;
  sortDir?: SortDir;
  maxPrice?: number;
  caffeineFreeOnly?: boolean;
  euCompliantOnly?: boolean;
  handsOnOnly?: boolean;
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
  if (params.get('hands') === '1') state.handsOnOnly = true;
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
  handsOnOnly: boolean;
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
  if (opts.handsOnOnly) params.set('hands', '1');
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
export function exportRowsToCsv(rows: Product[]): void {
  if (typeof document === 'undefined') return;
  const headers = [
    'Rank',
    'Name',
    'Brand',
    'Score',
    'Price USD/mo',
    'Caps/day',
    'MBG days',
    'Trustpilot',
    'Best for',
  ];
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
