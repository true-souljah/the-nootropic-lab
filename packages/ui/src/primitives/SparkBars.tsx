export interface SparkBarsProps {
  values: number[];
  /** Tailwind background-color class for the bars (e.g. "bg-ds-good"). */
  colorClass?: string;
  /** Total height in px. */
  height?: number;
  /**
   * If the sparkline data conveys meaning, pass a one-line summary here
   * (e.g. "Trial count trend over 5 years, increasing"). Otherwise the
   * component is treated as fully decorative.
   */
  summary?: string;
}

/**
 * SparkBars — tiny bar-chart sparkline. Decorative by default; pass
 * `summary` to surface the chart's meaning to assistive tech.
 */
export function SparkBars({
  values,
  colorClass = 'bg-ds-accent',
  height = 28,
  summary,
}: SparkBarsProps) {
  const max = Math.max(...values, 10);

  return (
    <div
      role={summary ? 'img' : undefined}
      aria-label={summary}
      aria-hidden={summary ? undefined : true}
      className="flex gap-[2px] items-end"
      style={{ height }}
    >
      {values.map((v, i) => (
        <span
          key={i}
          className={`w-[6px] rounded-[1px] ${colorClass}`}
          style={{ height: `${(v / max) * 100}%`, minHeight: 2 }}
        />
      ))}
    </div>
  );
}

export default SparkBars;
