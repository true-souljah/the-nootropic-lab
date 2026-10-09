import { scoreTier } from '../templates/listicleRanking';

export interface ScorePillProps {
  /** Score in the range 0..10. */
  score: number;
  /** Optional max value (defaults to 10). Used for the accessible label. */
  max?: number;
  /** Localised accessible label; defaults to "Score {score} out of {max}" in English. */
  label?: string;
}

/**
 * ScorePill — visual badge containing a colored dot + numeric score.
 * The dot is decorative (color encodes the tone, SCORE_TIERS) and is hidden
 * from assistive tech; the entire pill carries a single aria-label.
 */
export function ScorePill({ score, max = 10, label }: ScorePillProps) {
  const tone = scoreTier(score);
  const classes = {
    good: { bg: 'bg-ds-good-soft', text: 'text-ds-good-ink', dot: 'bg-ds-good' },
    warn: { bg: 'bg-ds-warn-soft', text: 'text-ds-warn-ink', dot: 'bg-ds-warn' },
    bad: { bg: 'bg-ds-bad-soft', text: 'text-ds-bad-ink', dot: 'bg-ds-bad' },
  }[tone];

  return (
    <span
      role="img"
      aria-label={label ?? `Score ${score.toFixed(1)} out of ${max.toFixed(1)}`}
      className={`inline-flex items-center gap-[6px] px-[9px] py-[3px] rounded-[6px] text-[12px] font-bold ds-tabular ${classes.bg} ${classes.text}`}
    >
      <span aria-hidden="true" className={`w-[6px] h-[6px] rounded-full ${classes.dot}`} />
      {score.toFixed(1)}
    </span>
  );
}

export default ScorePill;
