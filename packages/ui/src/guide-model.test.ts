import { describe, test, expect } from 'vitest';
import {
  ALL_REGIONS,
  allProductsUS,
  buildRegionSearchContext,
  guides,
  guidesEs,
  guidesForRegion,
  ingredients,
  type GuideBlock,
  type GuideSection,
} from '@nootropic/data';

// Guide data model guard (2026-10 education plan, step 1).
//
// Guides are region-gated (`regions`) and may carry structured blocks with
// inline internal links. These rules keep a guide from linking or listing a
// page a host does not serve, keep LATAM fully Spanish, and keep block data
// renderable. check:links re-verifies every link target on the built site.

const LINK = /\[([^\]]*)\]\(([^)]*)\)/g;
const INTERNAL_PATH = /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/;

function textsOf(section: GuideSection): string[] {
  if (!section.blocks) return [section.content];
  return section.blocks.flatMap((b: GuideBlock) => {
    switch (b.type) {
      case 'p':
        return [b.text];
      case 'ul':
      case 'ol':
        return b.items;
      case 'table':
        return [b.caption, ...b.head, ...b.rows.flat()];
      case 'callout':
        return [b.title ?? '', b.text];
    }
  });
}

function blockProblems(section: GuideSection): string[] {
  const out: string[] = [];
  const hasContent = typeof section.content === 'string';
  const hasBlocks = Array.isArray(section.blocks);
  if (hasContent === hasBlocks) out.push(`"${section.heading}": needs exactly one of content / blocks`);
  if (hasContent && !section.content?.trim()) out.push(`"${section.heading}": empty content`);
  if (hasBlocks && section.blocks!.length === 0) out.push(`"${section.heading}": empty blocks`);
  for (const [i, b] of (section.blocks ?? []).entries()) {
    const at = `"${section.heading}" block ${i}`;
    if (b.type === 'p' && !b.text.trim()) out.push(`${at}: empty paragraph`);
    if ((b.type === 'ul' || b.type === 'ol') && (b.items.length === 0 || b.items.some((x) => !x.trim()))) out.push(`${at}: empty list or item`);
    if (b.type === 'table') {
      if (!b.caption.trim()) out.push(`${at}: table needs a caption`);
      if (b.head.length < 2) out.push(`${at}: table needs at least 2 columns`);
      if (b.rows.length === 0) out.push(`${at}: table has no rows`);
      b.rows.forEach((row, r) => {
        if (row.length !== b.head.length) out.push(`${at}: row ${r} has ${row.length} cells, head has ${b.head.length}`);
        if (row.some((c) => !c.trim())) out.push(`${at}: row ${r} has an empty cell`);
      });
    }
    if (b.type === 'callout' && !b.text.trim()) out.push(`${at}: empty callout`);
  }
  return out;
}

const englishBySlug = new Map(guides.map((g) => [g.slug, g]));
const ingredientSlugs = new Set(ingredients.map((i) => i.slug));

describe('guide regions', () => {
  test('inputs are non-empty (fail closed)', () => {
    expect(guides.length).toBeGreaterThanOrEqual(6);
    expect(guidesEs.length).toBeGreaterThanOrEqual(1);
  });

  test.each(guides.map((g) => [g.slug, g]))('%s lists known, unique hosts', (_slug, g) => {
    expect(g.regions.length).toBeGreaterThan(0);
    expect(new Set(g.regions).size).toBe(g.regions.length);
    for (const r of g.regions) expect(ALL_REGIONS).toContain(r);
  });

  test('slugs are unique', () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
  });

  test('every guide served on LATAM has a Spanish translation with the same section structure, and vice versa', () => {
    const problems: string[] = [];
    for (const g of guides.filter((x) => x.regions.includes('latam'))) {
      const es = guidesEs.find((t) => t.slug === g.slug);
      if (!es) {
        problems.push(`${g.slug}: no Spanish translation`);
        continue;
      }
      if (es.sections.length !== g.sections.length) problems.push(`${g.slug}: ${es.sections.length} Spanish sections vs ${g.sections.length} English`);
      es.sections.forEach((s, i) => {
        const en = g.sections[i];
        if (en && Boolean(s.blocks) !== Boolean(en.blocks)) problems.push(`${g.slug} section ${i}: Spanish and English differ in content/blocks shape`);
        if (en?.blocks && s.blocks && s.blocks.length !== en.blocks.length) problems.push(`${g.slug} section ${i}: block count differs`);
      });
    }
    for (const es of guidesEs) {
      if (!englishBySlug.get(es.slug)?.regions.includes('latam')) problems.push(`${es.slug}: Spanish translation of a guide not served on LATAM`);
    }
    expect(problems).toEqual([]);
  });

  test.each(ALL_REGIONS.map((r) => [r]))('guidesForRegion(%s) returns exactly the guides listing it', (region) => {
    const got = guidesForRegion(region).map((g) => g.slug);
    expect(got).toEqual(guides.filter((g) => g.regions.includes(region)).map((g) => g.slug));
  });

  test('LATAM gets the Spanish text', () => {
    for (const g of guidesForRegion('latam')) {
      expect(g.title).toBe(guidesEs.find((t) => t.slug === g.slug)!.title);
    }
  });

  test.each(ALL_REGIONS.map((r) => [r]))('the %s search index lists only that host’s guides', (region) => {
    const { searchItems } = buildRegionSearchContext(allProductsUS, region === 'latam' ? 'es' : 'en', region);
    const hrefs = searchItems.filter((i) => i.type === 'guide').map((i) => i.href);
    expect(hrefs).toEqual(guidesForRegion(region).map((g) => `/guides/${g.slug}/`));
  });
});

describe('guide content', () => {
  const all = [
    ...guides.map((g) => ({ label: g.slug, g, regions: g.regions })),
    ...guidesEs.map((g) => ({ label: `es:${g.slug}`, g, regions: englishBySlug.get(g.slug)?.regions ?? [] })),
  ];

  test.each(all.map((x) => [x.label, x]))('%s: sections are well-formed', (_l, { g }) => {
    expect(g.sections.flatMap(blockProblems)).toEqual([]);
  });

  test.each(all.map((x) => [x.label, x]))('%s: inline links are internal and resolve on every host serving the guide', (_l, { g, regions }) => {
    const problems: string[] = [];
    for (const section of g.sections) {
      for (const text of textsOf(section)) {
        for (const m of text.matchAll(LINK)) {
          const [raw, label, target] = m;
          if (!label.trim()) problems.push(`${raw}: empty label`);
          if (!INTERNAL_PATH.test(target)) {
            problems.push(`${raw}: target must be an internal path with a trailing slash`);
            continue;
          }
          const guide = /^\/guides\/([a-z0-9-]+)\/$/.exec(target);
          if (guide) {
            const t = englishBySlug.get(guide[1]);
            if (!t) problems.push(`${raw}: no such guide`);
            else for (const r of regions) if (!t.regions.includes(r)) problems.push(`${raw}: guide not served on ${r}`);
          }
          const ing = /^\/ingredients\/([a-z0-9-]+)\/$/.exec(target);
          if (ing && !ingredientSlugs.has(ing[1])) problems.push(`${raw}: no such ingredient`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
