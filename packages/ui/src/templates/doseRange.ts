/**
 * Parse `Ingredient.clinicalDose` strings into structured min/max/unit
 * values used by the dose calculator's range visualizer.
 *
 * Handles the formats present in the catalog:
 *   "250mg"
 *   "250-500mg"
 *   "250–500mg/day"               (en-dash)
 *   "300mg (45% bacosides)"       (annotated single value)
 *   "100mg (Suntheanine)"
 *   "50–600mg (3% rosavins)"
 *   "1g"                          (treated as 1000mg via known units)
 *
 * Falls back to nulls when no number is detectable. Single-value
 * doses are expanded to a ±20% range so the visualizer can still
 * show a meaningful "in range" band.
 */

export interface ParsedDose {
  min: number;
  max: number;
  unit: string;
}

export function parseClinicalDose(raw: string): ParsedDose | null {
  if (!raw) return null;
  // Normalize en-dash to hyphen, strip parenthetical annotations
  const cleaned = raw.replace(/[–—]/g, '-').replace(/\([^)]*\)/g, '').trim();
  // Pull the first one or two numbers
  const numberMatches = cleaned.match(/\d+(?:\.\d+)?/g);
  if (!numberMatches || numberMatches.length === 0) return null;
  // Pull the unit — first alpha sequence following the last number
  const unitMatch = cleaned.match(/(?:\d+(?:\.\d+)?)(?:[-\s/])*([a-zµ%]+)/i);
  const rawUnit = unitMatch ? unitMatch[1] : 'mg';

  let unit = rawUnit;
  let scale = 1;
  if (/^g$/i.test(rawUnit)) {
    unit = 'mg';
    scale = 1000;
  } else if (/^mcg$|^µg$/i.test(rawUnit)) {
    unit = 'mcg';
  } else if (/^iu$/i.test(rawUnit)) {
    unit = 'IU';
  } else if (/^mg$/i.test(rawUnit)) {
    unit = 'mg';
  }

  const first = parseFloat(numberMatches[0]) * scale;
  const second = numberMatches[1] ? parseFloat(numberMatches[1]) * scale : null;

  if (second !== null && second > first) {
    return { min: first, max: second, unit };
  }
  // Single-value: spread ±20%
  const spread = Math.max(1, Math.round(first * 0.2));
  return { min: Math.max(0, first - spread), max: first + spread, unit };
}

export type DoseStatus = 'in-range' | 'under' | 'over';

export function statusFor(dose: number, range: ParsedDose): DoseStatus {
  if (dose < range.min) return 'under';
  if (dose > range.max) return 'over';
  return 'in-range';
}

/**
 * Suggest the default starting dose for a freshly-added ingredient.
 * Uses the lower bound of the clinical range — never over-prescribe.
 */
export function defaultDoseFor(range: ParsedDose): number {
  return range.min;
}
