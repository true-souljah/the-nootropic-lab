import { describe, test, expect } from 'vitest';
import {
  BASELINE_TOLERANCE,
  LOCALE_PREFIXES,
  MIN_PAGE_TOKENS,
  SHINGLE_K,
  SIMILARITY_THRESHOLD,
  TECHNICAL_EXCLUDES,
  extractMainText,
  htmlLang,
  isEnglishPage,
  jaccard,
  pairAllowed,
  shingles,
  tokenize,
} from './geo-similarity';

describe('calibration constants', () => {
  test('lock the values the gate header records (2026-10-26 calibration)', () => {
    expect(SHINGLE_K).toBe(8);
    expect(SIMILARITY_THRESHOLD).toBe(0.45);
    expect(BASELINE_TOLERANCE).toBe(0.02);
    expect(MIN_PAGE_TOKENS).toBe(30);
    expect(TECHNICAL_EXCLUDES).toEqual(['404.html', '404/index.html', '_not-found/index.html']);
    expect(LOCALE_PREFIXES).toEqual(['es/', 'de/', 'fr/', 'pt/', 'ja/']);
  });
});

describe('htmlLang / isEnglishPage', () => {
  test('returns the lang attribute lowercased', () => {
    expect(htmlLang('<html lang="en"><body></body></html>')).toBe('en');
    expect(htmlLang('<html lang="en-US"><body></body></html>')).toBe('en-us');
    expect(htmlLang('<html lang="PT-BR">')).toBe('pt-br');
    expect(htmlLang('<html data-analytics="x" lang="en-GB">')).toBe('en-gb');
    expect(htmlLang("<html lang='en-AU'>")).toBe('en-au');
    expect(htmlLang('<html lang=en-SG>')).toBe('en-sg');
  });

  test('returns "" when there is no lang attribute', () => {
    expect(htmlLang('<html><body></body></html>')).toBe('');
    expect(htmlLang('<p>no html element here</p>')).toBe('');
  });

  test('only English lang codes count as English pages', () => {
    expect(isEnglishPage('<html lang="en">')).toBe(true);
    expect(isEnglishPage('<html lang="en-US">')).toBe(true);
    expect(isEnglishPage('<html lang="es">')).toBe(false);
    expect(isEnglishPage('<html lang="pt-BR">')).toBe(false);
    expect(isEnglishPage('<html lang="ja">')).toBe(false);
    // a page with no lang declaration is not provably English — fail closed
    expect(isEnglishPage('<html><main>text</main></html>')).toBe(false);
  });
});

describe('extractMainText', () => {
  test('keeps only the first <main> block when present', () => {
    const html = '<p>header noise</p><main><p>Alpha beta</p> gamma</main><footer><p>footer noise</p></footer>';
    expect(extractMainText(html)).toBe('Alpha beta gamma');
  });

  test('falls back to the whole input without <main>', () => {
    expect(extractMainText('<body><p>Hello</p> world</body>')).toBe('Hello world');
  });

  test('strips script/style/svg/noscript/template blocks and comments', () => {
    const html =
      '<main>keep<script>drop()</script>keep2<style>a{color:red}</style>keep3' +
      '<svg><title>icon</title><path d="M0"/></svg>keep4<noscript>hidden</noscript>keep5' +
      '<template>shadow</template>keep6<!-- react -->end</main>';
    expect(extractMainText(html)).toBe('keep keep2 keep3 keep4 keep5 keep6 end');
  });

  test('decodes the common HTML entities', () => {
    const html = '<main>a&nbsp;b &amp; c &quot;d&quot; &#x27;e&#x27; &#39;f&#39; &lt;g&gt;</main>';
    expect(extractMainText(html)).toBe(`a b & c "d" 'e' 'f' <g>`);
  });

  test('does not double-decode &amp;quot; into a quote', () => {
    // &amp; decodes last, so text that literally reads "&quot;" survives as such
    expect(extractMainText('<main>&amp;quot; &amp;amp;</main>')).toBe('&quot; &amp;');
  });

  test('collapses whitespace runs and trims', () => {
    expect(extractMainText('<main>  a\n\t b   <span>c</span>\n  </main>')).toBe('a b c');
  });
});

describe('tokenize / shingles', () => {
  test('lowercases and splits on non-alphanumerics, dropping empties', () => {
    expect(tokenize('Hello, World! foo_bar 42')).toEqual(['hello', 'world', 'foo', 'bar', '42']);
    expect(tokenize('   !!!   ')).toEqual([]);
    expect(tokenize('')).toEqual([]);
  });

  test('every sliding window of k tokens becomes a shingle', () => {
    // 5 tokens, k=3 → windows [1-3] [2-4] [3-5]
    expect(shingles('a b c d e', 3)).toEqual(new Set(['a b c', 'b c d', 'c d e']));
    // 9 tokens at the default k=8 → first and last window
    expect(shingles('one two three four five six seven eight nine')).toEqual(
      new Set(['one two three four five six seven eight', 'two three four five six seven eight nine']),
    );
  });

  test('at most k tokens collapse into one whole-text shingle', () => {
    expect(shingles('a b', 3)).toEqual(new Set(['a b']));
    expect(shingles('a b c', 3)).toEqual(new Set(['a b c']));
  });

  test('empty text yields an empty shingle set', () => {
    expect(shingles('', 3).size).toBe(0);
    expect(shingles('!!! ???', 3).size).toBe(0);
  });
});

describe('jaccard', () => {
  test('identical sets score 1', () => {
    expect(jaccard(new Set(['a b', 'b c']), new Set(['b c', 'a b']))).toBe(1);
  });

  test('disjoint sets score 0', () => {
    expect(jaccard(new Set(['a b']), new Set(['c d']))).toBe(0);
  });

  test('hand-computed overlap: 3 and 3 sharing 1 → 1/5', () => {
    expect(jaccard(new Set(['a', 'b', 'c']), new Set(['c', 'd', 'e']))).toBe(0.2);
  });

  test('two empty sets are identical (1); one empty set shares nothing (0)', () => {
    expect(jaccard(new Set(), new Set())).toBe(1);
    expect(jaccard(new Set(['a']), new Set())).toBe(0);
    expect(jaccard(new Set(), new Set(['a']))).toBe(0);
  });
});

describe('pairAllowed', () => {
  test('new page (no baseline entry): threshold only — 0.44 passes, 0.46 fails', () => {
    expect(pairAllowed(0.44, undefined)).toBe(true);
    expect(pairAllowed(0.46, undefined)).toBe(false);
  });

  test('grandfathered pair at baseline 0.90: 0.91 passes (within tolerance), 0.93 fails', () => {
    expect(pairAllowed(0.91, 0.9)).toBe(true);
    expect(pairAllowed(0.93, 0.9)).toBe(false);
  });

  test('baseline below the threshold cannot lower the ceiling (threshold floor)', () => {
    expect(pairAllowed(0.44, 0.3)).toBe(true);
    expect(pairAllowed(0.46, 0.3)).toBe(false);
  });

  test('exactly at the ceiling is allowed', () => {
    expect(pairAllowed(0.45, undefined)).toBe(true);
    expect(pairAllowed(0.47, 0.45)).toBe(true);
  });

  test('threshold and tolerance defaults can be overridden', () => {
    expect(pairAllowed(0.6, undefined, 0.7)).toBe(true);
    expect(pairAllowed(0.55, 0.5, 0.45, 0.1)).toBe(true);
    expect(pairAllowed(0.62, 0.5, 0.45, 0.1)).toBe(false);
  });
});
