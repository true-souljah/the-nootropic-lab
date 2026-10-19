import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { getStrings, ingredients, localizedIngredients, productsEU, type Locale, type UIStrings } from '@nootropic/data';
import Listicle, { type ListicleIngredientMechanism } from './templates/Listicle';
import { tpl } from './templateStrings';

// 2026-10-19. An evidence card ("What the evidence actually says") names the
// ingredient pages it is about in `ingredientSlugs`, which only fed ranking
// rule (b): nothing rendered them, while 18 cards told readers "(see our
// phosphatidylserine page)" (LATAM "(ver nuestra página sobre la
// fosfatidilserina)", JP "(see our DHA ingredient page)") with nothing to
// click. Each card now links every page in its ingredientSlugs that the host
// builds, after its Source and extraCitations links, in their style and with
// their " · " separator, labelled UIStrings.listicle.ingredientPageLink with
// the page's own name. A slug the host builds no page for gets no link, and
// the real-page checks below fail on it. The removed phrases are forbidden in
// registration-claims.test.ts (round twenty-one).

const REPO = join(__dirname, '..', '..', '..');
const APPS = join(REPO, 'apps');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const LINK_CLASS =
  'inline-block mt-2 text-[12.5px] text-ds-accent underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded';
const SEPARATOR = '<span aria-hidden="true" class="text-[12.5px] text-ds-muted"> · </span>';
const PUBMED = 'https://pubmed.ncbi.nlm.nih.gov/20523044/';

/** React escapes these in text and attributes; the checks read the text. */
const decode = (html: string) => html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

const sourceLink = (href: string, text: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer" class="${LINK_CLASS}">${text}</a>`;
const pageLink = (slug: string, text: string) => `<a class="${LINK_CLASS}" href="/ingredients/${slug}/">${text}</a>`;

/** A card's link row: from the end of its evidence paragraph to the card's closing tag. */
function cardLinks(html: string, evidence: string): string {
  const at = html.indexOf(`>${evidence}</p>`);
  expect(at, evidence).toBeGreaterThan(-1);
  const from = at + `>${evidence}</p>`.length;
  return html.slice(from, html.indexOf('</div>', from));
}

beforeEach(() => {
  // Every app builds with trailingSlash: true; next/link reads it from here.
  vi.stubEnv('__NEXT_TRAILING_SLASH', 'true');
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Listicle links each evidence card to the ingredient pages it lists', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_REGION', 'eu');
  });
  const mlpEU = productsEU.find((p) => p.slug === 'mind-lab-pro-review')!;
  const pagesFor = (locale: Locale) => (locale === 'es' ? localizedIngredients('es') : ingredients);
  const render = (
    uiStrings: UIStrings,
    ingredientMechanism: ListicleIngredientMechanism[],
    ingredientPages: readonly { slug: string; name: string }[],
  ) =>
    renderToStaticMarkup(
      createElement(Listicle, {
        useCase: 'memory',
        pageTitle: 't',
        pageDescription: 'd',
        heroParagraph: 'h',
        ingredientMechanism,
        ingredientPages,
        picks: [{ product: mlpEU, whyItsHere: 'w', rank: 1 }],
        faqItems: [],
        siteUrl: 'https://example.com',
        uiStrings,
        updated: new Date('2026-10-01T00:00:00Z'),
      }),
    );

  test.each([
    ['en', 'Source →', 'Our Phosphatidylserine page'],
    ['es', 'Fuente →', 'Nuestra página sobre Fosfatidilserina'],
  ] as const)('%s: Source link, then the page link, labelled with the page-language name', (locale, source, label) => {
    const html = render(getStrings(locale), [{ name: 'PS', evidence: 'e1', ingredientSlugs: ['phosphatidylserine'], citationUrl: PUBMED }], pagesFor(locale));
    expect(cardLinks(html, 'e1')).toBe(sourceLink(PUBMED, source) + SEPARATOR + pageLink('phosphatidylserine', label));
  });

  test.each([
    ['en', ['Our L-Theanine page', 'Our Caffeine page']],
    ['es', ['Nuestra página sobre L-Teanina', 'Nuestra página sobre Cafeína']],
  ] as const)('%s: a combination card links every slug, in order, after its extraCitations', (locale, labels) => {
    const s = getStrings(locale);
    const html = render(
      s,
      [
        {
          name: 'L-Theanine + Caffeine',
          evidence: 'e2',
          ingredientSlugs: ['l-theanine', 'caffeine'],
          citationUrl: 'https://pubmed.ncbi.nlm.nih.gov/18681988/',
          extraCitations: [{ label: 'Giesbrecht 2010', url: 'https://pubmed.ncbi.nlm.nih.gov/21040626/' }],
        },
      ],
      pagesFor(locale),
    );
    expect(cardLinks(html, 'e2')).toBe(
      sourceLink('https://pubmed.ncbi.nlm.nih.gov/18681988/', s.listicle.sourceLink) +
        SEPARATOR +
        sourceLink('https://pubmed.ncbi.nlm.nih.gov/21040626/', 'Giesbrecht 2010') +
        SEPARATOR +
        pageLink('l-theanine', labels[0]) +
        SEPARATOR +
        pageLink('caffeine', labels[1]),
    );
  });

  test('with neither citationUrl nor extraCitations the first page link has no leading separator', () => {
    const html = render(getStrings('en'), [{ name: 'Combo', evidence: 'e3', ingredientSlugs: ['l-theanine', 'caffeine'] }], ingredients);
    expect(cardLinks(html, 'e3')).toBe(pageLink('l-theanine', 'Our L-Theanine page') + SEPARATOR + pageLink('caffeine', 'Our Caffeine page'));
  });

  test('with extraCitations but no citationUrl the page link follows the last extra link', () => {
    const html = render(
      getStrings('en'),
      [
        {
          name: 'Bacopa',
          evidence: 'e4',
          ingredientSlugs: ['bacopa-monnieri'],
          extraCitations: [{ label: 'Calabrese 2008', url: 'https://pubmed.ncbi.nlm.nih.gov/18611150/' }],
        },
      ],
      ingredients,
    );
    expect(cardLinks(html, 'e4')).toBe(
      sourceLink('https://pubmed.ncbi.nlm.nih.gov/18611150/', 'Calabrese 2008') + SEPARATOR + pageLink('bacopa-monnieri', 'Our Bacopa Monnieri page'),
    );
  });

  test('a slug the host builds no page for gets no link and no separator', () => {
    const withoutCaffeine = ingredients.filter((i) => i.slug !== 'caffeine');
    const html = render(
      getStrings('en'),
      [
        { name: 'Combo', evidence: 'e5', ingredientSlugs: ['l-theanine', 'caffeine'], citationUrl: PUBMED },
        { name: 'Unknown, cited', evidence: 'e6', ingredientSlugs: ['no-such-ingredient'], citationUrl: PUBMED },
        { name: 'Unknown', evidence: 'e7', ingredientSlugs: ['no-such-ingredient'] },
        { name: 'No pages', evidence: 'e8', ingredientSlugs: [] },
      ],
      withoutCaffeine,
    );
    expect(cardLinks(html, 'e5')).toBe(sourceLink(PUBMED, 'Source →') + SEPARATOR + pageLink('l-theanine', 'Our L-Theanine page'));
    expect(cardLinks(html, 'e6')).toBe(sourceLink(PUBMED, 'Source →'));
    expect(cardLinks(html, 'e7')).toBe('');
    expect(cardLinks(html, 'e8')).toBe('');
    expect(html).not.toContain('/ingredients/caffeine/');
    expect(html).not.toContain('no-such-ingredient');
  });

  test('a page link is internal: no target, no rel', () => {
    const html = render(getStrings('en'), [{ name: 'PS', evidence: 'e9', ingredientSlugs: ['phosphatidylserine'], citationUrl: PUBMED }], ingredients);
    const anchors = [...cardLinks(html, 'e9').matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
    expect(anchors).toHaveLength(2);
    expect(anchors[0]).toMatch(/ target="_blank" rel="noopener noreferrer"/);
    expect(anchors[1]).toBe(`<a class="${LINK_CLASS}" href="/ingredients/phosphatidylserine/">`);
    expect(anchors[1]).not.toMatch(/\b(target|rel)=/);
  });

  test("a bundle without the key shows en's text (fr: no edition renders a listicle in it)", () => {
    const fr = getStrings('fr');
    expect(fr.listicle.ingredientPageLink).toBeUndefined();
    const html = render(fr, [{ name: 'PS', evidence: 'e10', ingredientSlugs: ['phosphatidylserine'], citationUrl: PUBMED }], ingredients);
    expect(cardLinks(html, 'e10')).toBe(sourceLink(PUBMED, fr.listicle.sourceLink) + SEPARATOR + pageLink('phosphatidylserine', 'Our Phosphatidylserine page'));
  });
});

// ── The strings ─────────────────────────────────────────────────────────────

/** [region, route] of every app page that renders a Listicle. */
function* pageFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pageFiles(path);
    else if (entry.name === 'page.tsx') yield path;
  }
}
const LISTICLE_PAGES: Array<{ region: string; route: string; file: string }> = REGIONS.flatMap((region) => {
  const app = join(APPS, region, 'src', 'app');
  return [...pageFiles(app)]
    .filter((file) => /<Listicle\b/.test(readFileSync(file, 'utf8')))
    .map((file) => ({ region, route: relative(app, file).split(sep).slice(0, -1).join('/'), file }))
    .sort((a, b) => a.route.localeCompare(b.route));
});

describe('ingredientPageLink is set in en and es only, and every listicle host uses one of them', () => {
  test('en and es carry it with exactly one {name}; es is its own Spanish text', () => {
    const en = getStrings('en').listicle.ingredientPageLink;
    const es = getStrings('es').listicle.ingredientPageLink;
    expect(en).toBe('Our {name} page');
    expect(es).toBe('Nuestra página sobre {name}');
    for (const s of [en, es]) expect(s?.match(/\{\w+\}/g)).toEqual(['{name}']);
  });

  test('fr, pt, de, fr-CA and ja leave it unset (the ja bundle is untouched)', () => {
    for (const locale of ['fr', 'pt', 'de', 'fr-CA', 'ja'] as Locale[]) {
      expect(getStrings(locale).listicle.ingredientPageLink, locale).toBeUndefined();
    }
  });

  test('every app that renders a Listicle uses a locale whose bundle sets it', () => {
    const apps = [...new Set(LISTICLE_PAGES.map((p) => p.region))];
    expect(apps).toHaveLength(8);
    for (const app of apps) {
      const search = readFileSync(join(APPS, app, 'src', 'lib', 'search.ts'), 'utf8');
      const locale = /buildRegionSearchContext\([^,]+,\s*'([\w-]+)'/.exec(search)?.[1] as Locale | undefined;
      expect(locale, `${app}: locale not found in src/lib/search.ts`).toBeDefined();
      expect(getStrings(locale!).listicle.ingredientPageLink, `${app} (${locale})`).toBeDefined();
    }
  });
});

// ── The real pages ──────────────────────────────────────────────────────────

interface SourceCard {
  name: string;
  slugs: string[];
}

const unquote = (s: string) => s.replace(/\\(.)/g, '$1');

/** A page's evidence cards (name and ingredientSlugs) from its source, or a loud error. */
function sourceCards(file: string): SourceCard[] {
  const rel = relative(REPO, file);
  const block = readFileSync(file, 'utf8').match(/: ListicleIngredientMechanism\[\] = \[\n([\s\S]*?)\n\];/)?.[1];
  if (!block) throw new Error(`${rel}: no ListicleIngredientMechanism[] array`);
  return block
    .split(/^ {2}\{\n/m)
    .slice(1)
    .map((entry) => {
      const name = entry.match(/^ {4}name: '((?:\\.|[^'\\])*)',$/m)?.[1];
      const slugs = entry.match(/^ {4}ingredientSlugs: \[([^\]\n]*)\],$/m)?.[1];
      if (name === undefined || slugs === undefined) throw new Error(`${rel}: unparsed evidence card "${entry.slice(0, 80)}"`);
      const list = [...slugs.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
      if (list.length !== slugs.split(',').filter((s) => s.trim() !== '').length) throw new Error(`${rel} "${name}": unparsed ingredientSlugs [${slugs}]`);
      return { name: unquote(name), slugs: list };
    });
}

type PageModule = {
  default: (props: object) => unknown;
  generateStaticParams?: () => Array<Record<string, string>> | Promise<Array<Record<string, string>>>;
};

async function load(region: string, ...path: string[]): Promise<PageModule> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return (await import(/* @vite-ignore */ join(APPS, region, 'src', ...path))) as PageModule;
}

interface RenderedLink {
  slug: string;
  label: string;
  tag: string;
}
interface RenderedCard {
  page: string;
  region: string;
  name: string;
  slugs: string[];
  evidence: string;
  row: string;
  pageLinks: RenderedLink[];
}

/** Per region: slug -> the name the region's ingredient page shows in its H1, for every page it builds. */
const built = new Map<string, Map<string, string>>();
const rendered: RenderedCard[] = [];
let sourceCardCount = 0;

/** Every rendered listicle card, read from the real pages (filled once). */
async function realCards(): Promise<RenderedCard[]> {
  if (rendered.length > 0) return rendered;
  for (const region of REGIONS) {
    const route = await load(region, 'app', 'ingredients', '[ingredient]', 'page.tsx');
    const params = await route.generateStaticParams!();
    const names = new Map<string, string>();
    const usedSlugs = new Set(LISTICLE_PAGES.filter((p) => p.region === region).flatMap((p) => sourceCards(p.file).flatMap((c) => c.slugs)));
    for (const { ingredient } of params) {
      // The H1 only for the pages the cards link; the rest just exist.
      if (!usedSlugs.has(ingredient)) {
        names.set(ingredient, '');
        continue;
      }
      const html = decode(renderToStaticMarkup((await route.default({ params: Promise.resolve({ ingredient }) })) as ReactElement));
      const h1 = html.match(/<h1\b[^>]*>([^<]*)<\/h1>/)?.[1];
      if (!h1) throw new Error(`${region} /ingredients/${ingredient}/: no H1`);
      names.set(ingredient, h1);
    }
    built.set(region, names);
  }
  for (const { region, route, file } of LISTICLE_PAGES) {
    const cards = sourceCards(file);
    sourceCardCount += cards.length;
    const mod = await load(region, 'app', route, 'page.tsx');
    const html = decode(renderToStaticMarkup((await mod.default({})) as ReactElement));
    for (const card of cards) {
      const at = html.indexOf(`>${card.name}</h3>`);
      if (at < 0) throw new Error(`${region}/${route}: card "${card.name}" not rendered`);
      const from = html.indexOf('</p>', at) + '</p>'.length;
      const evidence = html.slice(html.indexOf('>', html.indexOf('<p', at)) + 1, from - '</p>'.length);
      const row = html.slice(from, html.indexOf('</div>', from));
      const pageLinks = [...row.matchAll(/<a\b[^>]*href="\/ingredients\/([^"]*)\/"[^>]*>([^<]*)<\/a>/g)].map((m) => ({
        slug: m[1],
        label: m[2],
        tag: m[0].slice(0, m[0].indexOf('>') + 1),
      }));
      rendered.push({ page: `${region}/${route}`, region, name: card.name, slugs: card.slugs, evidence, row, pageLinks });
    }
  }
  return rendered;
}

describe('every listicle page links its evidence cards to pages its host builds', () => {
  test('scans all 36 listicle pages and their 148 evidence cards (guards against an empty or partial scan)', async () => {
    const cards = await realCards();
    expect(LISTICLE_PAGES).toHaveLength(36);
    expect(sourceCardCount).toBe(148);
    expect(cards).toHaveLength(148);
    for (const region of REGIONS) expect(built.get(region)?.size, region).toBeGreaterThanOrEqual(25);
    expect(cards.reduce((n, c) => n + c.pageLinks.length, 0)).toBeGreaterThanOrEqual(148);
  }, 120_000);

  test("every slug in every card's ingredientSlugs is an ingredient page that card's host builds", async () => {
    const cards = await realCards();
    const missing = cards.flatMap((c) => c.slugs.filter((slug) => !built.get(c.region)!.has(slug)).map((slug) => `${c.page} "${c.name}": ${slug}`));
    expect(missing, 'Fix the slug, or add the ingredient page on that host').toEqual([]);
  }, 120_000);

  test('each card links exactly its built slugs, in order, labelled with the name the ingredient page shows', async () => {
    const cards = await realCards();
    const problems: string[] = [];
    for (const c of cards) {
      const s = (await import(/* @vite-ignore */ join(APPS, c.region, 'src', 'lib', 'search.ts'))) as { uiStrings: UIStrings };
      const template = s.uiStrings.listicle.ingredientPageLink ?? getStrings('en').listicle.ingredientPageLink!;
      const expected = c.slugs.filter((slug) => built.get(c.region)!.has(slug));
      const got = c.pageLinks.map((l) => l.slug);
      if (got.join(' ') !== expected.join(' ')) problems.push(`${c.page} "${c.name}": links [${got}] for slugs [${expected}]`);
      for (const link of c.pageLinks) {
        const label = tpl(template, { name: built.get(c.region)!.get(link.slug)! });
        if (link.label !== label) problems.push(`${c.page} "${c.name}": label "${link.label}", expected "${label}"`);
        if (link.tag !== `<a class="${LINK_CLASS}" href="/ingredients/${link.slug}/">`) problems.push(`${c.page} "${c.name}": ${link.tag}`);
      }
      const anchors = (c.row.match(/<a\b/g) ?? []).length;
      const separators = c.row.split(SEPARATOR).length - 1;
      if (anchors > 0 && separators !== anchors - 1) problems.push(`${c.page} "${c.name}": ${anchors} links, ${separators} separators`);
    }
    expect(problems).toEqual([]);
  }, 120_000);

  test('LATAM labels name the Spanish ingredient pages (Fosfatidilserina, Citicolina)', async () => {
    const cards = await realCards();
    const labels = cards.filter((c) => c.region === 'latam').flatMap((c) => c.pageLinks.map((l) => l.label));
    expect(labels).toContain('Nuestra página sobre Fosfatidilserina');
    expect(labels).toContain('Nuestra página sobre Citicolina (CDP-Colina)');
    expect(labels.filter((l) => !l.startsWith('Nuestra página sobre '))).toEqual([]);
  }, 120_000);

  test('the aging and memory phosphatidylserine cards (and the JP DHA cards) now link the page they used to point at', async () => {
    const cards = await realCards();
    const linked = (page: string, slug: string) =>
      cards.some((c) => c.page === page && c.slugs.includes(slug) && c.pageLinks.some((l) => l.slug === slug));
    const pages = REGIONS.flatMap((r) => [`${r}/best-nootropics-for-aging`, `${r}/best-nootropics-for-memory`]);
    expect(pages.filter((p) => !linked(p, 'phosphatidylserine'))).toEqual([]);
    expect(['jp/best-nootropics-for-aging', 'jp/best-nootropics-for-memory'].filter((p) => !linked(p, 'dha-omega-3'))).toEqual([]);
  }, 120_000);

  test('no card text names one of our pages without linking it', async () => {
    const cards = await realCards();
    // "Our citicoline page rates …", "(see our DHA ingredient page)",
    // "Nuestra página sobre la citicolina …", "nuestra página de L-Teanina".
    const REFERENCE = /\b[Oo]ur ([\p{L}\d-]+)(?: ingredient)? page\b|\b[Nn]uestra página (?:sobre|de) (?:la |el |los |las )?([\p{L}\d-]+)/gu;
    const unlinked: string[] = [];
    let references = 0;
    for (const c of cards) {
      for (const m of c.evidence.matchAll(REFERENCE)) {
        references++;
        const word = (m[1] ?? m[2]).toLowerCase();
        const hit = c.pageLinks.some((l) => l.slug.includes(word) || built.get(c.region)!.get(l.slug)!.toLowerCase().includes(word));
        if (!hit) unlinked.push(`${c.page} "${c.name}": "${m[0]}"`);
      }
    }
    // The citicoline cards on the focus, studying, energy and Adderall pages.
    expect(references).toBeGreaterThanOrEqual(18);
    expect(unlinked).toEqual([]);
  }, 120_000);
});
