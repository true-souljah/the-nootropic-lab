import { describe, test, expect, vi, afterEach } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getStrings, type Locale } from '@nootropic/data';

// 2026-10-19, shared-template semantics leftovers (1): FPByline printed its
// display date in `<time dateTime>` ("Oct 19, 2026", "19 de oct de 2026") —
// not a valid datetime value, so the byline named no machine-readable date.
// Every page whose template renders FPByline (Listicle, IngredientDetail,
// HeadToHead) is rendered here, on every host: each `<time>` must carry a
// valid ISO date, and the byline's text stays the page locale's date.
// The built-output twin is scripts/check-built-datetime.mjs.

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
});

/** Renders a region app page; a dynamic route with its first static params. */
async function renderPage(region: string, route: string): Promise<string> {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const mod = (await import(/* @vite-ignore */ join(APPS, region, 'src', 'app', route, 'page.tsx'))) as PageModule;
  let props: object = {};
  if (route.includes('[')) {
    const params = await mod.generateStaticParams!();
    props = { params: Promise.resolve(params[0]) };
  }
  return renderToStaticMarkup((await mod.default(props)) as ReactElement);
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

/** Today's calendar day in this machine's time zone, as the templates print it. */
function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Today as each page locale writes the byline date (the templates' `updatedDisplay`). */
const TODAY_DISPLAYS = new Set(
  LOCALES.map((l) => new Date().toLocaleDateString(getStrings(l).productDetail.dateLocale, { year: 'numeric', month: 'short', day: 'numeric' })),
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
    const html = await renderPage(region, route);
    const times = [...html.matchAll(/<time\b([^>]*)>([\s\S]*?)<\/time>/gi)];
    expect(times.length, 'no <time> rendered').toBeGreaterThan(0);
    for (const [tag, attrs, text] of times) {
      const value = /\bdatetime="([^"]*)"/i.exec(attrs)?.[1];
      expect(value ?? text, `${tag}: not a valid date`).toSatisfy(validDateTime);
    }
    // Exactly one byline per page: its dateTime is today's ISO date, its text
    // today's date as the page locale writes it (the text is unchanged).
    const bylines = [...html.matchAll(BYLINE_TIME)];
    expect(bylines.length, 'byline <time> count').toBe(1);
    const byline = html.slice(bylines[0].index!).match(/<time\b[^>]*\bdatetime="([^"]*)"[^>]*>([^<]*)<\/time>/i)!;
    expect(byline[1]).toBe(today());
    expect([...TODAY_DISPLAYS]).toContain(byline[2]);
  });
});
