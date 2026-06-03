import type { ReactNode } from 'react';

export type ChipTone = 'neutral' | 'accent' | 'good' | 'bad' | 'warn';

export interface ChipProps {
  children: ReactNode;
  tone?: ChipTone;
  /**
   * When provided, the chip renders as a `<button>` with `aria-pressed`,
   * suitable for filter pills. Without `onClick`, the chip is a
   * non-interactive `<span>` (display-only badge).
   */
  onClick?: () => void;
  /** Active/pressed state for selectable chips. Inverts to ink-on-white. */
  active?: boolean;
  /** Accessible label override (e.g. when children are only an icon). */
  'aria-label'?: string;
  className?: string;
}

const TONE_CLASSES: Record<ChipTone, { bg: string; text: string; border: string }> = {
  // Surface tones use ink-suffixed text colors against soft backgrounds —
  // see tokens.css notes; WCAG AA contrast.
  neutral: { bg: 'bg-ds-card-sub', text: 'text-ds-ink-soft', border: 'border-ds-border' },
  accent: { bg: 'bg-ds-accent-soft', text: 'text-ds-accent', border: 'border-ds-accent-border' },
  good: { bg: 'bg-ds-good-soft', text: 'text-ds-good-ink', border: 'border-ds-good-soft' },
  bad: { bg: 'bg-ds-bad-soft', text: 'text-ds-bad-ink', border: 'border-ds-bad-soft' },
  warn: { bg: 'bg-ds-warn-soft', text: 'text-ds-warn-ink', border: 'border-ds-warn-soft' },
};

const ACTIVE_CLASSES = {
  bg: 'bg-ds-ink',
  text: 'text-white',
  border: 'border-ds-ink',
};

/**
 * Chip — small pill-shaped badge. Display-only by default; pass `onClick`
 * to make it a filter button with `aria-pressed`.
 */
export function Chip({
  children,
  tone = 'neutral',
  onClick,
  active = false,
  className = '',
  ...rest
}: ChipProps) {
  const palette = active ? ACTIVE_CLASSES : TONE_CLASSES[tone];
  // PR-Q26 (#90): swapped `whitespace-nowrap` for `min-w-0 max-w-full
  // break-words`. The old nowrap meant any chip with a long data-content
  // value (e.g. IngredientDetail's "Clinical dose · 100-200mg, 1-2 hours
  // before activity") forced the chip — and therefore the document — to
  // a width greater than viewport at 320px, breaking WCAG 1.4.10 Reflow
  // (the last residual fixme tracked by PR-Q25's e2e/us-reflow spec).
  // `break-words` allows long words to break at character boundaries so
  // the chip can shrink to its container width; short chips continue to
  // render on a single line as before.
  const base = `inline-flex items-center gap-1 px-[10px] py-[3px] rounded-full text-[11.5px] font-semibold min-w-0 max-w-full break-words border ${palette.bg} ${palette.text} ${palette.border}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={rest['aria-label']}
        className={`${base} cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 ${className}`.trim()}
      >
        {children}
      </button>
    );
  }

  return (
    <span aria-label={rest['aria-label']} className={`${base} ${className}`.trim()}>
      {children}
    </span>
  );
}

export default Chip;
