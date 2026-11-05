import { describe, test, expect } from 'vitest';
import {
  LOCALE_CLUSTERS,
  REGIONS,
  buildAlternates,
  buildOpenGraph,
  buildTwitter,
  type AlternatesOutput,
  type RegionCode,
} from './seo';

describe('REGIONS', () => {
  test('exposes all 8 regions', () => {
    const codes = Object.keys(REGIONS).sort();
    expect(codes).toEqual(['au', 'ca', 'eu', 'gcc', 'jp', 'latam', 'sea', 'us']);
  });

  test('each region has a siteUrl + hreflang', () => {
    for (const [code, region] of Object.entries(REGIONS)) {
      expect(region.siteUrl, `${code} siteUrl`).toMatch(/^https:\/\//);
      expect(region.hreflang, `${code} hreflang`).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
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
      'en-AE', 'en-AU', 'en-CA', 'en-GB', 'en-JP', 'en-SG', 'en-US', 'es', 'x-default',
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
    expect(Object.keys(result.languages).sort()).toEqual(['es', 'x-default']);
  });

  test('explicit availableInRegions=["us","jp"] emits exactly those two hreflang entries plus x-default', () => {
    const result = buildAlternates({
      regionCode: 'us',
      path: '/foo/',
      availableInRegions: ['us', 'jp'],
    });
    // JP is en-JP while its Japanese copy is paused (owner decision 2026-10-13).
    expect(Object.keys(result.languages).sort()).toEqual(['en-JP', 'en-US', 'x-default']);
    expect(result.languages['en-US']).toBe('https://thenootropiclab.com/foo/');
    expect(result.languages['en-JP']).toBe('https://jp.thenootropiclab.com/foo/');
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
    expect(es.languages['es-US']).toBe('https://thenootropiclab.com/es/mejores-nootropicos/');
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
      'en-AE', 'en-AU', 'en-CA', 'en-GB', 'en-JP', 'en-SG', 'en-US', 'es', 'x-default',
    ]);
  });
});

describe('buildAlternates — Google-supported hreflang codes', () => {
  // One array of buildAlternates outputs per alternate group, built the way
  // the pages call it, keyed by base path: a plain group (every region's
  // /methodology/), plus one group per English base path found in
  // LOCALE_CLUSTERS (base = cluster[REGIONS[region].hreflang]): every region's
  // copy of that base path, plus each localized path of every cluster with
  // that base, across all regions that own one, called with
  // availableInRegions: [region] as the localized pages do.
  function alternateGroups(): Map<string, AlternatesOutput[]> {
    const allRegions = Object.keys(REGIONS) as RegionCode[];
    const everyRegionsCopy = (path: string) =>
      allRegions.map((region) => buildAlternates({ regionCode: region, path }));
    const groups = new Map<string, AlternatesOutput[]>();

    // A plain group: every region's /methodology/.
    groups.set('/methodology/', everyRegionsCopy('/methodology/'));

    for (const region of Object.keys(LOCALE_CLUSTERS) as RegionCode[]) {
      const regionHreflang = REGIONS[region].hreflang;
      for (const cluster of LOCALE_CLUSTERS[region] ?? []) {
        const basePath = cluster[regionHreflang];
        const members = groups.get(basePath) ?? everyRegionsCopy(basePath);
        for (const [code, localizedPath] of Object.entries(cluster)) {
          // The English base page is already a member above.
          if (code === regionHreflang) continue;
          members.push(
            buildAlternates({
              regionCode: region,
              path: localizedPath,
              availableInRegions: [region],
            }),
          );
        }
        groups.set(basePath, members);
      }
    }

    return groups;
  }

  // Pre-existing (EU /fr/ and CA /fr/ both carry plain `fr`), left as they are
  // because this change only replaces es-419; the open item is in BACKLOG.md.
  // Delete an entry when it is fixed.
  const KNOWN_COLLISIONS = ['/ fr', '/best-nootropics/ fr'];

  test('every hreflang value has a form Google supports', () => {
    const codes = new Set<string>();
    for (const region of Object.values(REGIONS)) codes.add(region.hreflang);
    for (const clusters of Object.values(LOCALE_CLUSTERS)) {
      for (const cluster of clusters ?? []) {
        for (const code of Object.keys(cluster)) codes.add(code);
      }
    }
    for (const group of alternateGroups().values()) {
      for (const { languages } of group) {
        for (const code of Object.keys(languages)) codes.add(code);
      }
    }
    expect(codes.size).toBeGreaterThan(8);
    // Google: "Only language codes listed in ISO 639-1 and region codes listed in ISO 3166-1 Alpha 2 are supported; other codes that aren't listed in those standards, such as es-419, aren't supported."
    const googleSupported = /^(?:[a-z]{2}(?:-[A-Z]{2})?|x-default)$/;
    for (const code of codes) {
      expect(code, `hreflang ${code}`).toMatch(googleSupported);
    }
  });

  test('no code maps to two URLs within an alternate group', () => {
    // A JS object cannot hold a duplicate key — the second write silently
    // wins, which is exactly how a cluster key steals a region's entry — so
    // the check must be a union across a group's pages, not of one object.
    let groupsChecked = 0;
    const collisions: string[] = [];
    for (const [basePath, group] of alternateGroups()) {
      groupsChecked += 1;
      const codeUrls = new Map<string, Set<string>>();
      for (const { languages } of group) {
        for (const [code, url] of Object.entries(languages)) {
          // x-default legitimately differs within a group: an EU /de/ page
          // falls back to its EU English base, an EU English page falls back
          // to US. That behaviour is out of scope here.
          if (code === 'x-default') continue;
          const urls = codeUrls.get(code) ?? new Set<string>();
          urls.add(url);
          codeUrls.set(code, urls);
        }
      }
      for (const [code, urls] of codeUrls) {
        if (urls.size > 1) collisions.push(`${basePath} ${code}`);
      }
    }
    expect(groupsChecked).toBeGreaterThan(0);
    expect(collisions.sort()).toEqual(KNOWN_COLLISIONS);
  });

  test('plain es is the LATAM host and the US /es/ edition is es-US', () => {
    const usHome = buildAlternates({ regionCode: 'us', path: '/' });
    expect(usHome.languages['es']).toBe('https://latam.thenootropiclab.com/');
    expect(usHome.languages['es-US']).toBe('https://thenootropiclab.com/es/');

    const latamHome = buildAlternates({ regionCode: 'latam', path: '/' });
    expect(latamHome.languages['es']).toBe('https://latam.thenootropiclab.com/');
    expect(latamHome.languages['es-US']).toBeUndefined();

    const usEs = buildAlternates({ regionCode: 'us', path: '/es/', availableInRegions: ['us'] });
    expect(usEs.languages['es-US']).toBe(usEs.canonical);
    expect(usEs.languages['es']).toBeUndefined();

    for (const { languages } of [usHome, latamHome, usEs]) {
      expect(Object.keys(languages)).not.toContain('es-419');
    }
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
