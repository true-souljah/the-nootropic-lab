export interface BrandMarkProps {
  /** Pixel width/height of the SVG. Default 28px. */
  size?: number;
  /** Brand color (default ds-brand green #15803D). Pass another hex to override. */
  color?: string;
  className?: string;
}

/**
 * BrandMark — the green lab-flask SVG used in FPHeader, FPFooter,
 * Sidebar, Quiz header, and Quiz results header. Extracted from 5
 * duplicate inlinings during the code-quality sweep. Hard-coded to
 * the Phase-5 green (#15803D) by default; pass `color` for the
 * lighter footer variant (#5fcf86).
 */
export function BrandMark({ size = 28, color = '#15803d', className = '' }: BrandMarkProps) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M11 4h6v6l5.5 11.5a2 2 0 0 1-1.8 2.9H7.3a2 2 0 0 1-1.8-2.9L11 10V4z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8.5 16h11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="11.5" cy="19" r="1" fill={color} />
      <circle cx="15.5" cy="20.5" r="0.8" fill={color} />
      <path d="M10 4h8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default BrandMark;
