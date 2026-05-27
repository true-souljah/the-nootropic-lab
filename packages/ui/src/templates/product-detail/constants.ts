// Types + pillar constants for the ProductDetail template.

export type TabId = 'overview' | 'dosing' | 'pillars' | 'reviews' | 'pricing';

export const PILLAR_LABELS: Record<string, string> = {
  ingredients: 'Ingredient quality',
  dosing: 'Dosing vs. clinical evidence',
  transparency: 'Formula transparency',
  value: 'Value for money',
  trust: 'Brand trust',
};

export const PILLAR_WEIGHTS: Record<string, number> = {
  ingredients: 0.25,
  dosing: 0.30,
  transparency: 0.20,
  value: 0.15,
  trust: 0.10,
};

export const PILLAR_RATIONALE: Record<string, string> = {
  ingredients: 'Number and quality of evidence-graded ingredients. Trademarked extracts and standardized actives raise this score.',
  dosing: 'How many ingredients meet their clinical-trial dose. Underdosing flagship actives is the biggest score deduction.',
  transparency: 'Full disclosure of every ingredient at its exact dose. Proprietary blends are scored as opaque.',
  value: 'Cost per month relative to per-serving clinical doses delivered. Cheaper products with underdoses score lower.',
  trust: 'Brand reputation, third-party testing, refund track record, and Trustpilot signal across multiple years.',
};
