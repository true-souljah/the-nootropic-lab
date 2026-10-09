// Types + pillar constants for the ProductDetail template.

export type TabId = 'overview' | 'dosing' | 'pillars' | 'reviews' | 'pricing';

export const PILLAR_LABELS: Record<string, string> = {
  ingredients: 'Ingredient quality',
  dosing: 'Dosing vs. clinical evidence',
  transparency: 'Formula transparency',
  value: 'Value for money',
  trust: 'Brand trust',
};

export const PILLAR_RATIONALE: Record<string, string> = {
  ingredients: 'Number and quality of evidence-graded ingredients. Trademarked extracts and standardized actives raise this score.',
  dosing: "The share of ingredients with a reference dose on our ingredient pages whose label-stated daily amount meets that page's minimum. Amounts the label hides (blend shares) or states on a different basis count as not met; ingredients with no reference page are listed but not scored.",
  transparency: 'Full disclosure of every ingredient at its exact dose. Proprietary blends are scored as opaque.',
  value: 'Cost per month relative to per-serving clinical doses delivered. Cheaper products with underdoses score lower.',
  trust: 'Brand reputation, third-party testing, refund track record, and Trustpilot signal across multiple years.',
};
