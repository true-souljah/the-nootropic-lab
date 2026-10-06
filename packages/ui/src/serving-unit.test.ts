import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  PRODUCT_FORMS,
  formProblem,
  getStrings,
  productRuleProblems,
  servingAmount,
  servingUnit,
  servingsComparable,
  allProductsUS,
  allProductsEU,
  allProductsCA,
  allProductsAU,
  allProductsJP,
  allProductsLatam,
  allProductsGCC,
  allProductsSEA,
} from '@nootropic/data';
import type { Locale, Product, ProductForm } from '@nootropic/data';

// Product.form (2026-09): sachet / tablet / shot products rendered with
// hard-coded capsule wording ("1 caps", "0/day"). Every template now goes
// through servingAmount(); these guards keep it that way.

const TEMPLATES_DIR = join(__dirname, 'templates');

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p);
  }
  return out;
}

const FORBIDDEN = ['caps ·', 'caps/day', "['Caps'", '}/day</span>'];

describe('templates — no hard-coded capsule wording for capsulesPerServing', () => {
  const files = walk(TEMPLATES_DIR);

  it('scans a non-empty template set (guards against a silently empty glob)', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it.each(FORBIDDEN)('no template contains %j', (needle) => {
    const offenders = files
      .filter((f) => readFileSync(f, 'utf8').includes(needle))
      .map((f) => relative(TEMPLATES_DIR, f));
    expect(offenders).toEqual([]);
  });
});

const EXPECTED_UNITS: Record<'en' | 'ja', Record<ProductForm, string>> = {
  en: { capsule: 'caps', tablet: 'tablets', sachet: 'sachets', shot: 'shots', powder: 'scoops' },
  ja: { capsule: 'カプセル', tablet: '錠', sachet: '包', shot: '本', powder: 'スクープ' },
};
const EXPECTED_SINGULAR: Record<'en' | 'ja', Record<ProductForm, string>> = {
  en: { capsule: 'cap', tablet: 'tablet', sachet: 'sachet', shot: 'shot', powder: 'scoop' },
  ja: { capsule: 'カプセル', tablet: '錠', sachet: '包', shot: '本', powder: 'スクープ' },
};

describe('servingUnit / servingAmount', () => {
  const cases = (['en', 'ja'] as const).flatMap((locale) =>
    PRODUCT_FORMS.map((form) => [locale, form] as const),
  );

  it.each(cases)('%s × %s', (locale, form) => {
    const strings = getStrings(locale);
    const unit = EXPECTED_UNITS[locale][form];
    expect(servingUnit({ form }, strings)).toBe(unit);
    expect(servingAmount({ form, capsulesPerServing: 3 }, strings)).toBe(`3 ${unit}`);
    // A count of 1 takes the singular label ("1 sachet", never "1 sachets").
    expect(servingAmount({ form, capsulesPerServing: 1 }, strings)).toBe(`1 ${EXPECTED_SINGULAR[locale][form]}`);
  });

  it('absent form defaults to capsule', () => {
    expect(servingAmount({ capsulesPerServing: 2 }, getStrings('en'))).toBe('2 caps');
    expect(servingAmount({ capsulesPerServing: 2 }, getStrings('ja'))).toBe('2 カプセル');
  });

  it('powder (drink-powder scoops) renders "1 scoop" / "2 scoops", never capsule wording', () => {
    const en = getStrings('en');
    expect(servingAmount({ form: 'powder', capsulesPerServing: 1 }, en)).toBe('1 scoop');
    expect(servingAmount({ form: 'powder', capsulesPerServing: 2 }, en)).toBe('2 scoops');
    expect(en.productDetail.meta.productDescriptorByForm.powder).toBe('daily nootropic drink powder');
  });

  it('a zero count renders "—", never "0 …"', () => {
    expect(servingAmount({ form: 'shot', capsulesPerServing: 0 }, getStrings('en'))).toBe('—');
  });

  it('every locale defines a non-empty unit for every form', () => {
    const locales: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
    for (const locale of locales) {
      const strings = getStrings(locale);
      expect(strings.productDetail.stats.dailyServing.trim(), `${locale} dailyServing`).not.toBe('');
      for (const form of PRODUCT_FORMS) {
        expect(servingUnit({ form }, strings).trim(), `${locale} ${form}`).not.toBe('');
        expect(servingUnit({ form }, strings, 1).trim(), `${locale} ${form} singular`).not.toBe('');
      }
    }
  });

  it('servingsComparable: same form with known counts only', () => {
    expect(servingsComparable([{ capsulesPerServing: 2 }, { form: 'capsule', capsulesPerServing: 4 }])).toBe(true);
    expect(servingsComparable([{ capsulesPerServing: 2 }, { form: 'sachet', capsulesPerServing: 1 }])).toBe(false);
    expect(servingsComparable([{ form: 'shot', capsulesPerServing: 0 }, { form: 'shot', capsulesPerServing: 1 }])).toBe(false);
  });
});

const CATALOGUES: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

describe('product data — form', () => {
  const records = Object.entries(CATALOGUES).flatMap(([region, list]) =>
    list.map((p) => ({ region, p })),
  );

  it('loads all 8 catalogues, each non-empty', () => {
    for (const [region, list] of Object.entries(CATALOGUES)) {
      expect(list.length, region).toBeGreaterThan(0);
    }
    expect(records.length).toBeGreaterThan(50);
  });

  it('every record with form set uses an allowed value', () => {
    const bad = records
      .filter(({ p }) => p.form !== undefined && !(PRODUCT_FORMS as readonly string[]).includes(p.form))
      .map(({ region, p }) => `${region}/${p.slug}: ${String(p.form)}`);
    expect(bad).toEqual([]);
  });

  it('formProblem rejects unknown values and the record rules surface it', () => {
    expect(formProblem(undefined)).toBeNull();
    for (const form of PRODUCT_FORMS) expect(formProblem(form)).toBeNull();
    // 'powder' became an allowed form in 2026-10 (Pre Lab Pro is a scoop powder).
    expect(formProblem('powder')).toBeNull();
    expect(formProblem('gummy')).toMatch(/^form is not one of/);
    expect(formProblem('')).toMatch(/^form is not one of/);
    expect(formProblem(null)).toMatch(/^form is not one of/);
    const base = allProductsUS[0];
    const problems = productRuleProblems({ ...base, form: 'gummy' as unknown as ProductForm });
    expect(problems.some((p) => p.startsWith('form is not one of'))).toBe(true);
  });

  it.each([
    ['gcc', 'eu-yan-sang-brainmax-review', 'sachet', 1],
    ['sea', 'eu-yan-sang-brainmax-review', 'sachet', 1],
    ['jp', 'fancl-brains-review', 'tablet', 4],
    ['us', 'trubrain-review', 'shot', 1],
    ['us', 'pre-lab-pro-review', 'powder', 1],
  ] as const)('%s/%s is a %s product (%i per serving)', (region, slug, form, count) => {
    const record = CATALOGUES[region].find((p) => p.slug === slug);
    expect(record, `${region}/${slug} missing`).toBeDefined();
    expect(record!.form).toBe(form);
    expect(record!.capsulesPerServing).toBe(count);
  });
});
