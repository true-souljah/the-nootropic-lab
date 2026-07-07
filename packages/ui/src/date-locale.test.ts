import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// "Last updated" dates must format in the active locale, not a hardcoded
// en-US (audit OPT-6, 2026-07-07). ProductDetail already resolves
// uiStrings.productDetail.dateLocale; these four templates independently
// hardcoded 'en-US', rendering US-format dates (e.g. "Jul 7, 2026") on
// de/fr/pt/ja/es pages instead of the locale-native form.

const TEMPLATES_DIR = join(__dirname, 'templates');
const DATE_TEMPLATES = ['ThreeWay.tsx', 'Listicle.tsx', 'HeadToHead.tsx', 'IngredientDetail.tsx'];

describe('locale-aware "last updated" dates', () => {
  it.each(DATE_TEMPLATES)('%s does not hardcode en-US in toLocaleDateString', (tpl) => {
    const src = readFileSync(join(TEMPLATES_DIR, tpl), 'utf8');
    expect(src, `${tpl}: hardcoded en-US date`).not.toMatch(/toLocaleDateString\(\s*['"]en-US['"]/);
    expect(src, `${tpl}: should resolve dateLocale`).toMatch(
      /toLocaleDateString\(\s*uiStrings\?\.productDetail\.dateLocale/,
    );
  });
});
