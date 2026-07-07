import { describe, test, expect } from 'vitest';
import { REGIONS, buildAlternates, buildOpenGraph, buildTwitter } from './seo';

describe('REGIONS', () => {
  test('exposes all 8 regions', () => {
    const codes = Object.keys(REGIONS).sort();
    expect(codes).toEqual(['au', 'ca', 'eu', 'gcc', 'jp', 'latam', 'sea', 'us']);
  });

  test('each region has a siteUrl + hreflang', () => {
    for (const [code, region] of Object.entries(REGIONS)) {
      expect(region.siteUrl, `${code} siteUrl`).toMatch(/^https:\/\//);
      expect(region.hreflang, `${code} hreflang`).toMatch(/^[a-z]{2}(-[A-Z0-9]{2,3})?$/);
    }
  });

  test('US is the only domain without subdomain', () => {
    expect(REGIONS.us.siteUrl).toBe('https://thenootropiclab.com');
    expect(REGIONS.eu.siteUrl).toBe('https://eu.thenootropiclab.com');
  });
});

describe('buildAlternates', () => {
  test('emits self-canonical for the current region', () => {
    const result = buildAlternates({ regionCode: 'us', path: '/best-nootropics/' });
    expect(result.canonical).toBe('https://thenootropiclab.com/best-nootropics/');
  });

  test('emits hreflang for every region by default', () => {
    // Uses a non-clustered path so this asserts the plain cross-region set.
    // (/best-nootropics/ is now a US/EU/CA locale cluster — see the
    // "locale clusters" describe below. audit OPT-3b.)
    const result = buildAlternates({ regionCode: 'us', path: '/methodology/' });
    expect(Object.keys(result.languages).sort()).toEqual([
      'en-AE', 'en-AU', 'en-CA', 'en-GB', 'en-SG', 'en-US', 'es-419', 'ja-JP', 'x-default',
    ]);
  });

  test('x-default points to US when US is in the region set', () => {
    const result = buildAlternates({ regionCode: 'eu', path: '/best-nootropics/' });
    expect(result.languages['x-default']).toBe('https://thenootropiclab.com/best-nootropics/');
  });

  test('x-default falls back to canonical when US is excluded', () => {
    const result = buildAlternates({
      regionCode: 'latam',
      path: '/anmat-disposicion-2105-2022-prohibidos/',
      availableInRegions: ['latam'],
    });
    expect(result.languages['x-default']).toBe(
      'https://latam.thenootropiclab.com/anmat-disposicion-2105-2022-prohibidos/'
    );
    // Region-only page should NOT advertise other regions
    expect(Object.keys(result.languages).sort()).toEqual(['es-419', 'x-default']);
  });

  test('explicit availableInRegions=["us","jp"] emits exactly those two hreflang entries plus x-default', () => {
    const result = buildAlternates({
      regionCode: 'us',
      path: '/foo/',
      availableInRegions: ['us', 'jp'],
    });
    expect(Object.keys(result.languages).sort()).toEqual(['en-US', 'ja-JP', 'x-default']);
    expect(result.languages['en-US']).toBe('https://thenootropiclab.com/foo/');
    expect(result.languages['ja-JP']).toBe('https://jp.thenootropiclab.com/foo/');
  });

  test('paths are appended verbatim to siteUrl (no trailing slash normalization)', () => {
    const result = buildAlternates({ regionCode: 'us', path: '/ingredients/l-theanine/' });
    expect(result.canonical).toBe('https://thenootropiclab.com/ingredients/l-theanine/');
    const noSlash = buildAlternates({ regionCode: 'us', path: '/foo' });
    expect(noSlash.canonical).toBe('https://thenootropiclab.com/foo');
  });
});

describe('buildAlternates — locale clusters (OPT-3b)', () => {
  test('a localized page labels itself with its own locale, not the region default', () => {
    const de = buildAlternates({
      regionCode: 'eu',
      path: '/de/beste-nootropika/',
      availableInRegions: ['eu'],
    });
    expect(de.canonical).toBe('https://eu.thenootropiclab.com/de/beste-nootropika/');
    // labelled `de` (NOT en-GB), pointing at itself
    expect(de.languages['de']).toBe('https://eu.thenootropiclab.com/de/beste-nootropika/');
    // reciprocal links to its EU siblings
    expect(de.languages['en-GB']).toBe('https://eu.thenootropiclab.com/best-nootropics/');
    expect(de.languages['fr']).toBe('https://eu.thenootropiclab.com/fr/meilleurs-nootropiques/');
    expect(de.languages['pt']).toBe('https://eu.thenootropiclab.com/pt/melhores-nootropicos/');
    // no stray en-GB→German-URL mislabel
    expect(de.languages['en-GB']).not.toBe(de.canonical);
    // x-default → the region's English base
    expect(de.languages['x-default']).toBe('https://eu.thenootropiclab.com/best-nootropics/');
  });

  test('the English base page lists its localized variants + the cross-region set', () => {
    const en = buildAlternates({ regionCode: 'eu', path: '/best-nootropics/' });
    expect(en.languages['en-US']).toBe('https://thenootropiclab.com/best-nootropics/');
    expect(en.languages['en-GB']).toBe('https://eu.thenootropiclab.com/best-nootropics/');
    expect(en.languages['de']).toBe('https://eu.thenootropiclab.com/de/beste-nootropika/');
    expect(en.languages['fr']).toBe('https://eu.thenootropiclab.com/fr/meilleurs-nootropiques/');
    expect(en.languages['pt']).toBe('https://eu.thenootropiclab.com/pt/melhores-nootropicos/');
  });

  test('EN base and localized page reciprocate (each lists the other)', () => {
    const en = buildAlternates({ regionCode: 'eu', path: '/best-nootropics/' });
    const de = buildAlternates({
      regionCode: 'eu',
      path: '/de/beste-nootropika/',
      availableInRegions: ['eu'],
    });
    expect(en.languages['de']).toBe(de.canonical);
    expect(de.languages['en-GB']).toBe(en.canonical);
  });

  test('US /es/ and CA /fr/ clusters emit the correct locale code + English base', () => {
    const es = buildAlternates({
      regionCode: 'us',
      path: '/es/mejores-nootropicos/',
      availableInRegions: ['us'],
    });
    expect(es.languages['es']).toBe('https://thenootropiclab.com/es/mejores-nootropicos/');
    expect(es.languages['en-US']).toBe('https://thenootropiclab.com/best-nootropics/');

    const fr = buildAlternates({
      regionCode: 'ca',
      path: '/fr/comparer/',
      availableInRegions: ['ca'],
    });
    expect(fr.languages['fr']).toBe('https://ca.thenootropiclab.com/fr/comparer/');
    expect(fr.languages['en-CA']).toBe('https://ca.thenootropiclab.com/nootropic-comparison/');
  });

  test('non-clustered pages keep the plain cross-region behaviour (no regression)', () => {
    const g = buildAlternates({ regionCode: 'eu', path: '/guides/' });
    expect(Object.keys(g.languages).sort()).toEqual([
      'en-AE', 'en-AU', 'en-CA', 'en-GB', 'en-SG', 'en-US', 'es-419', 'ja-JP', 'x-default',
    ]);
  });
});

describe('buildOpenGraph', () => {
  test('returns full Open Graph object including images', () => {
    const result = buildOpenGraph({
      regionCode: 'us',
      path: '/best-nootropics/',
      title: 'Best Nootropics 2026',
      description: 'Comparison.',
    });
    expect(result).toEqual({
      title: 'Best Nootropics 2026',
      description: 'Comparison.',
      url: 'https://thenootropiclab.com/best-nootropics/',
      siteName: 'The Nootropic Lab',
      type: 'website',
      images: ['https://thenootropiclab.com/opengraph-image'],
    });
  });

  test('honors type=article when passed', () => {
    const result = buildOpenGraph({
      regionCode: 'jp',
      path: '/guides/foo/',
      title: 'T',
      description: 'D',
      type: 'article',
    });
    expect(result.type).toBe('article');
    expect(result.images[0]).toBe('https://jp.thenootropiclab.com/opengraph-image');
  });
});

describe('buildTwitter', () => {
  test('defaults to summary_large_image', () => {
    const result = buildTwitter({ title: 'T', description: 'D' });
    expect(result.card).toBe('summary_large_image');
  });

  test('honors explicit card=summary', () => {
    const result = buildTwitter({ title: 'T', description: 'D', card: 'summary' });
    expect(result.card).toBe('summary');
  });

  test('passes title and description through verbatim', () => {
    const result = buildTwitter({ title: 'Foo', description: 'Bar' });
    expect(result.title).toBe('Foo');
    expect(result.description).toBe('Bar');
  });
});
