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
    const result = buildAlternates({ regionCode: 'us', path: '/best-nootropics/' });
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
