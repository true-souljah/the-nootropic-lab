// Pure similarity helpers for the cross-geo gate (scripts/check-built-geo-similarity.ts):
// word-level 8-gram Jaccard similarity over the visible text of a built page,
// plus the ratchet rule that decides whether a SEA↔region pair is allowed.
// Keep this module dependency-free so both the tsx runner and vitest can
// import it.
export const SHINGLE_K = 8;
export const SIMILARITY_THRESHOLD = 0.45;
export const BASELINE_TOLERANCE = 0.02;
export const MIN_PAGE_TOKENS = 30;
export const TECHNICAL_EXCLUDES = ['404.html', '404/index.html', '_not-found/index.html'];
export const LOCALE_PREFIXES = ['es/', 'de/', 'fr/', 'pt/', 'ja/'];

const HTML_LANG = /<html\b[^>]*\blang\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
const MAIN_BLOCK = /<main\b[^>]*>([\s\S]*?)<\/main>/i;

/** Value of <html lang="…"> lowercased; '' when the attribute is absent. */
export function htmlLang(html: string): string {
  const match = HTML_LANG.exec(html);
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').toLowerCase();
}

/** True when the page declares an English lang (en, en-US, en-GB, …). */
export function isEnglishPage(html: string): boolean {
  return htmlLang(html).startsWith('en');
}

/**
 * Visible text of a page: the first <main>…</main> block when present, else
 * the whole input, with script/style/svg/noscript/template blocks, comments
 * and remaining tags stripped and the common HTML entities decoded.
 */
export function extractMainText(html: string): string {
  const scope = MAIN_BLOCK.exec(html)?.[1] ?? html;
  return scope
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<template\b[\s\S]*?<\/template>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // &amp; last among the ampersand entities so "&amp;quot;" stays "&quot;".
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Lowercased alphanumeric tokens: split on /[^a-z0-9]+/, empties dropped. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

/** Set of k-word shingles; ≤ k tokens collapse to the single whole-text shingle. */
export function shingles(text: string, k = SHINGLE_K): Set<string> {
  const tokens = tokenize(text);
  if (tokens.length === 0) return new Set();
  if (tokens.length <= k) return new Set([tokens.join(' ')]);
  const grams = new Set<string>();
  for (let i = 0; i + k <= tokens.length; i++) grams.add(tokens.slice(i, i + k).join(' '));
  return grams;
}

/** |A∩B| / |A∪B|; two empty sets are identical (1), one empty set shares nothing (0). */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const gram of a) if (b.has(gram)) shared += 1;
  return shared / (a.size + b.size - shared);
}

/**
 * May this pair ship? A page absent from the baseline (new page) must stay at
 * or below the threshold; a baseline entry grandfathers its pair up to
 * baseline + tolerance, but never below the threshold floor.
 */
export function pairAllowed(
  sim: number,
  baseline: number | undefined,
  threshold = SIMILARITY_THRESHOLD,
  tolerance = BASELINE_TOLERANCE,
): boolean {
  return baseline === undefined ? sim <= threshold : sim <= Math.max(threshold, baseline + tolerance);
}
