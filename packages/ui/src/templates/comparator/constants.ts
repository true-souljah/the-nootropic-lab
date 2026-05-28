// Types + constants for the Comparator template. Extracted from the
// 748-line Comparator.tsx for readability; values are unchanged.

export type SortKey = 'rank' | 'score' | 'price' | 'trust' | 'value';
export type SortDir = 'asc' | 'desc';
export type Goal = 'Any' | 'Focus' | 'Memory' | 'Energy' | 'Beginners' | 'Budget';
export type Grade = 'All' | 'Recommended' | 'Worth a look' | 'Skip';

export const GOALS: Goal[] = ['Any', 'Focus', 'Memory', 'Energy', 'Beginners', 'Budget'];

export const GRADES: Array<{ id: Grade; tone?: 'good' | 'warn' | 'bad' }> = [
  { id: 'All' },
  { id: 'Recommended', tone: 'good' },
  { id: 'Worth a look', tone: 'warn' },
  { id: 'Skip', tone: 'bad' },
];

export const MAX_SELECTED = 3;

export const COLUMNS: Array<{
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
