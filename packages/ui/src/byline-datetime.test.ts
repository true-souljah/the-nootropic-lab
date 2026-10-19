import { describe, test, expect, vi, afterEach } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getStrings, isoDay, sitemapDate, type Locale, type SitemapEntryDate } from '@nootropic/data';

// 2026-10-19, shared-template semantics leftovers (1): FPByline printed its
// display date in `<time dateTime>` ("Oct 19, 2026", "19 de oct de 2026") —
// not a valid datetime value, so the byline named no machine-readable date.
// Every page whose template renders FPByline (Listicle, IngredientDetail,
// HeadToHead) is rendered here, on every host: each `<time>` must carry a
// valid ISO date, and the byline's text stays the page locale's date.
// The built-output twin is scripts/check-built-datetime.mjs.
//
// 2026-10-19, updated-date accuracy: the same templates stamped the build
// time, so every rebuild made each page say "Updated <today>". The byline and
// the JSON-LD dateModified must now be the page's sitemap <lastmod> day, and
// stay put however far the clock moves: every page is rendered with the clock
// set to 2099. Built-output twin: scripts/check-built-dates-consistent.ts.

const APPS = join(__dirname, '..', '..', '..', 'apps');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;
const LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
/** The templates that render FPByline. */
const BYLINE_TEMPLATE = /<(?:Listicle|IngredientDetail|HeadToHead)\b/;

function* pageFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pageFiles(path);
    else if (entry.name === 'page.tsx') yield path;
  }
}

/** [region, route] of every app page that renders an FPByline template. */
const PAGES: Array<[string, string]> = REGIONS.flatMap((region) => {
  const app = join(APPS, region, 'src', 'app');
  return [...pageFiles(app)]
    .filter((file) => BYLINE_TEMPLATE.test(readFileSync(file, 'utf8')))
    .map((file): [string, string] => [region, relative(app, file).split(sep).slice(0, -1).join('/')]);
});

type PageModule = {
  default: (props: object) => unknown;
  generateStaticParams?: () => Promise<Array<Record<string, string>>> | Array<Record<string, string>>;
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

/**
 * Renders a region app page (a dynamic route with its first static params)
 * and returns its HTML and URL path (`/ingredients/<slug>/`).
 */
async function renderPage(region: string, route: string): Promise<{ html: string; path: string }> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const mod = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
  let props: object = {};
  let params: Record<string, string> = {};
  if (route.includes('[')) {
    params = (await mod.generateStaticParams!())[0];
    props = { params: Promise.resolve(params) };
  }
  const path = `/${route.replace(/\[([^\]]+)\]/g, (_, name: string) => params[name])}/`;
  return { html: renderToStaticMarkup((await mod.default(props)) as ReactElement), path };
}

/** The <lastmod> the region's own sitemap gives `path`. */
async function sitemapLastmod(region: string, path: string): Promise<Date> {
  const sitemap = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', 'sitemap.ts'))) as {
    default: () => SitemapEntryDate[];
  };
  return sitemapDate(sitemap.default(), path);
}

/** Every dateModified in the page's JSON-LD. */
function jsonLdDateModified(html: string): string[] {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].flatMap(
    ([, json]) => [...json.matchAll(/"dateModified":"([^"]*)"/g)].map((m) => m[1]),
  );
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/;

/** A valid HTML date or date-time string on a real calendar day (no "2026-02-30"). */
function validDateTime(value: string): boolean {
  if (!ISO_DATE.test(value) && !ISO_DATE_TIME.test(value)) return false;
  const day = value.slice(0, 10);
  const d = new Date(`${day}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === day;
}

/** `date` as each page locale writes the byline date (the templates' `updatedDisplay`). */
const displays = (date: Date) =>
  LOCALES.map((l) =>
    date.toLocaleDateString(getStrings(l).productDetail.dateLocale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }),
  );
const UPDATED_LABELS = [...new Set(LOCALES.map((l) => getStrings(l).byline.updated))];
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** "Updated <time dateTime="…">…</time>" in any locale; React may put a comment between label and space. */
const BYLINE_TIME = new RegExp(`(?:${UPDATED_LABELS.map(escapeRe).join('|')})(?:<!-- -->)?\\s?(?:<!-- -->)?<time\\b[^>]*>`, 'g');

describe('FPByline: <time dateTime> is an ISO date on every page that renders it', () => {
  test('the scan is non-empty: Listicle, IngredientDetail and HeadToHead pages on all 8 hosts', () => {
    expect(PAGES.length).toBeGreaterThanOrEqual(40);
    expect(new Set(PAGES.map(([region]) => region)).size).toBe(REGIONS.length);
  });

  test.each(PAGES)('%s /%s', async (region, route) => {
    // A rebuild long after the last content change must not move the date.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2099-01-01T00:00:00Z'));
    const { html, path } = await renderPage(region, route);
    const times = [...html.matchAll(/<time\b([^>]*)>([\s\S]*?)<\/time>/gi)];
    expect(times.length, 'no <time> rendered').toBeGreaterThan(0);
    for (const [tag, attrs, text] of times) {
      const value = /\bdatetime="([^"]*)"/i.exec(attrs)?.[1];
      expect(value ?? text, `${tag}: not a valid date`).toSatisfy(validDateTime);
    }
    // Exactly one byline per page: its dateTime is the day of the page's
    // sitemap <lastmod>, its text that day as the page locale writes it, and
    // the JSON-LD dateModified the same day.
    const lastmod = await sitemapLastmod(region, path);
    expect(lastmod.getUTCFullYear(), `${path} <lastmod>`).toBeLessThan(2099);
    const bylines = [...html.matchAll(BYLINE_TIME)];
    expect(bylines.length, 'byline <time> count').toBe(1);
    const byline = html.slice(bylines[0].index!).match(/<time\b[^>]*\bdatetime="([^"]*)"[^>]*>([^<]*)<\/time>/i)!;
    expect(byline[1]).toBe(isoDay(lastmod));
    expect(displays(lastmod)).toContain(byline[2]);
    const modified = jsonLdDateModified(html);
    expect(modified.length, 'JSON-LD dateModified count').toBeGreaterThan(0);
    for (const value of modified) expect(value).toBe(isoDay(lastmod));
  });
});
