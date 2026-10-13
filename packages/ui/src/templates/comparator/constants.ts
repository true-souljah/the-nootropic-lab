// Types + constants for the Comparator template. Extracted from the
// 748-line Comparator.tsx for readability. Goal and grade ids are the values
// the filters match and the saved-view URL carries; their visible labels come
// from UIStrings.comparator (`label` below names the key).

import type { UIStrings } from '@nootropic/data';

type ComparatorStrings = UIStrings['comparator'];

export type SortKey = 'rank' | 'score' | 'price' | 'trust' | 'value';
export type SortDir = 'asc' | 'desc';
export type Goal = 'Any' | 'Focus' | 'Memory' | 'Energy' | 'Beginners' | 'Budget';
export type Grade = 'All' | 'Recommended' | 'Worth a look' | 'Skip';

export const GOALS: Array<{ id: Goal; label: keyof ComparatorStrings['goals'] }> = [
  { id: 'Any', label: 'any' },
  { id: 'Focus', label: 'focus' },
  { id: 'Memory', label: 'memory' },
  { id: 'Energy', label: 'energy' },
  { id: 'Beginners', label: 'beginners' },
  { id: 'Budget', label: 'budget' },
];

export const GRADES: Array<{ id: Grade; label: keyof ComparatorStrings['grades']; tone?: 'good' | 'warn' | 'bad' }> = [
  { id: 'All', label: 'all' },
  { id: 'Recommended', label: 'recommended', tone: 'good' },
  { id: 'Worth a look', label: 'worthALook', tone: 'warn' },
  { id: 'Skip', label: 'skip', tone: 'bad' },
];

export const MAX_SELECTED = 3;

export const COLUMNS: Array<{
  key: SortKey | null;
  /** The header's UIStrings.comparator.columns key; '#' and the checkbox spacer ('') are not words. */
  label: keyof ComparatorStrings['columns'] | '#' | '';
  width: number;
  align?: 'right' | 'center';
  /**
   * The per-serving price: labelled from uiStrings, shown only when a product
   * has the figure, never sortable (a serving is not a unit that compares
   * across products).
   */
  perServing?: true;
}> = [
  { key: null, label: '', width: 44 },
  { key: 'rank', label: '#', width: 50 },
  { key: null, label: 'product', width: 260 },
  { key: 'score', label: 'score', width: 110 },
  { key: 'value', label: 'value', width: 80, align: 'right' },
  { key: 'price', label: 'price', width: 80, align: 'right' },
  { key: null, label: '', width: 100, align: 'right', perServing: true },
  { key: 'trust', label: 'trustpilot', width: 130, align: 'right' },
  { key: null, label: 'bestFor', width: 180 },
];

/** Visible text of a column header. */
export function columnHeader(label: (typeof COLUMNS)[number]['label'], strings: ComparatorStrings): string {
  return label === '' || label === '#' ? label : strings.columns[label];
}
