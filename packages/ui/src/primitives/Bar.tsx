export type BarTone = 'accent' | 'good' | 'bad' | 'warn';

export interface BarProps {
  value: number;
  max?: number;
  /**
   * Explicit tone. If omitted, tone is derived from value:
   *   ≥ 8 → good · ≥ 6 → warn · else bad
   */
  tone?: BarTone;
  /**
   * Accessible label. Required when the bar represents a measured value
   * (score, completion). When the bar is purely decorative, pass
   * `decorative` instead of `label`.
   */
  label?: string;
  decorative?: boolean;
  /** Bar height in px (default 6). */
  height?: number;
}

const TONE_BG: Record<BarTone, string> = {
  accent: 'bg-ds-accent',
  good: 'bg-ds-good',
  warn: 'bg-ds-warn',
  bad: 'bg-ds-bad',
};

function deriveTone(value: number, max: number): BarTone {
  const v = (value / max) * 10;
  if (v >= 8) return 'good';
  if (v >= 6) return 'warn';
  return 'bad';
}

/**
 * Bar — thin horizontal progress bar. When `label` is provided, the bar
 * carries `role="progressbar"` + aria-value props for screen readers.
 * When `decorative` is true (visual rhythm only), the bar is hidden from
 * assistive tech.
 */
export function Bar({
  value,
  max = 10,
  tone,
  label,
  decorative = false,
  height = 6,
}: BarProps) {
  const t = tone ?? deriveTone(value, max);
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  const trackProps = decorative
    ? { 'aria-hidden': true as const }
    : {
        role: 'progressbar' as const,
        'aria-valuenow': value,
        'aria-valuemin': 0,
        'aria-valuemax': max,
        'aria-label': label,
      };

  return (
    <div
      {...trackProps}
      className="bg-ds-border rounded-full overflow-hidden relative"
      style={{ height }}
    >
      <div
        className={`absolute inset-y-0 left-0 rounded-full ${TONE_BG[t]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default Bar;
