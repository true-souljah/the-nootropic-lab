'use client';

import { Heart } from 'lucide-react';
import { useShortlist } from './useShortlist';

export interface ShortlistButtonProps {
  /** Product slug — matches the value stored in localStorage. */
  slug: string;
  /** Visible label shown alongside the heart icon. Default: hidden (icon-only). */
  showLabel?: boolean;
  /** Visual size. `sm` = 32px tap target, `md` = 40px. */
  size?: 'sm' | 'md';
}

/**
 * ShortlistButton — ♡ toggle that adds/removes the current product from
 * the localStorage shortlist. Icon-only by default; pass `showLabel`
 * for a labelled chip. Keyboard-accessible (Space/Enter via native
 * button). Filled when saved.
 */
export default function ShortlistButton({
  slug,
  showLabel = false,
  size = 'sm',
}: ShortlistButtonProps) {
  const { toggle, isIn, hydrated } = useShortlist();
  const saved = isIn(slug);
  const dim = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
  const iconSize = size === 'md' ? 18 : 14;

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from shortlist' : 'Save to shortlist'}
      // suppressHydrationWarning keeps the SSR-rendered initial state
      // (saved=false) from flashing red when hydration runs.
      suppressHydrationWarning
      className={`inline-flex items-center justify-center gap-2 ${dim} rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 ${
        saved
          ? 'bg-ds-bad-soft border-ds-bad text-ds-bad'
          : 'bg-ds-card border-ds-border text-ds-muted hover:text-ds-bad hover:border-ds-bad-soft'
      } ${showLabel ? 'px-3 w-auto' : ''} ${!hydrated ? 'opacity-60' : ''}`}
    >
      <Heart
        size={iconSize}
        strokeWidth={2}
        fill={saved ? 'currentColor' : 'none'}
        aria-hidden={true}
      />
      {showLabel && (
        <span className="text-[12.5px] font-semibold">
          {saved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
