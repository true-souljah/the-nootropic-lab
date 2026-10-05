import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getStrings, type Locale } from '@nootropic/data';
import { klaroConfig } from './klaro-config';
import {
  cookieDomainsFor,
  expireCookies,
  gaInitScript,
  gtagSrc,
  isAnalyticsActive,
} from './analytics-consent';

// Consent regression guard (portfolio consent audit 2026-09-29, operator
// decisions 2026-09-30 — Basic consent mode, equal Accept/Reject weight, no
// pre-consent event queueing, persistent withdraw control). Every assertion
// here failed on origin/main before the fix:
//   - layouts passed gtag.js as next/script `src`, which Next.js turns into a
//     pre-consent <link rel="preload"> to googletagmanager.com;
//   - a Cloudflare beacon with a never-configured placeholder token was
//     declared (and preloaded) on every page;
//   - the GA init set no consent default/update;
//   - the notice's accept button read "Save" / 保存 / Guardar;
//   - Accept was solid, Decline outlined;
//   - affiliate_click fired whenever a gtag function existed;
//   - no page had a Cookie settings control.

const SRC = __dirname;
const APPS_DIR = join(SRC, '..', '..', '..', 'apps');
const regionApps = readdirSync(APPS_DIR).filter((d) =>
  existsSync(join(APPS_DIR, d, 'src', 'app', 'layout.tsx')),
);
const TRACKER_HOST_RE = /googletagmanager\.com|google-analytics\.com|impactcdn\.com|cloudflareinsights\.com/;

describe('region layouts load no tracker before consent', () => {
  it('finds the 8 region apps', () => {
    expect(regionApps.length).toBeGreaterThanOrEqual(8);
  });

  it.each(regionApps)('%s: no Cloudflare beacon / placeholder token', (app) => {
    const layout = readFileSync(join(APPS_DIR, app, 'src', 'app', 'layout.tsx'), 'utf8');
    expect(layout).not.toMatch(/cloudflareinsights|data-cf-beacon|REPLACE_WITH_CF/);
  });

  it.each(regionApps)('%s: tracker URLs never sit in a `src` prop (next/script preloads src)', (app) => {
    const layout = readFileSync(join(APPS_DIR, app, 'src', 'app', 'layout.tsx'), 'utf8');
    for (const m of layout.matchAll(/(?<![-\w])src=\{?["'`]([^"'`]+)["'`]/g)) {
      expect(m[1], `${app}: literal src ${m[1]}`).not.toMatch(TRACKER_HOST_RE);
    }
    expect(layout).not.toMatch(/(?<![-\w])src=\{gtagSrc\(/);
    expect(layout).toMatch(/data-src=\{gtagSrc\('G-[A-Z0-9]+'\)\}/);
  });

  it.each(regionApps)('%s: every tracker <Script> is consent-gated (type="text/plain" + data-name)', (app) => {
    const layout = readFileSync(join(APPS_DIR, app, 'src', 'app', 'layout.tsx'), 'utf8');
    const scripts = [...layout.matchAll(/<Script\b([^>]*)>/g)].map((m) => m[1]!);
    expect(scripts.length).toBeGreaterThan(0);
    for (const attrs of scripts) {
      expect(attrs, `${app}: <Script${attrs}>`).toMatch(/type="text\/plain"/);
      expect(attrs).toMatch(/data-name="(google-analytics|impact-com)"/);
    }
  });

  it.each(regionApps)('%s: GA init comes from the shared consent-mode snippet', (app) => {
    const layout = readFileSync(join(APPS_DIR, app, 'src', 'app', 'layout.tsx'), 'utf8');
    expect(layout).toMatch(/\{gaInitScript\('G-[A-Z0-9]+'\)\}/);
    expect(layout).not.toMatch(/gtag\('config'/);
  });
});

describe('GA4 consent-mode init', () => {
  const s = gaInitScript('G-ABCD1234');
  it('makes gtag global', () => {
    expect(s).toContain('window.gtag = gtag;');
  });
  it('sets denied defaults, then grants analytics_storage, BEFORE js/config', () => {
    const def = s.indexOf("gtag('consent', 'default'");
    const upd = s.indexOf("gtag('consent', 'update', {analytics_storage: 'granted'})");
    const js = s.indexOf("gtag('js'");
    const cfg = s.indexOf("gtag('config', 'G-ABCD1234')");
    expect(def).toBeGreaterThanOrEqual(0);
    expect(upd).toBeGreaterThan(def);
    expect(js).toBeGreaterThan(upd);
    expect(cfg).toBeGreaterThan(js);
    expect(s.slice(def, upd)).toMatch(/analytics_storage: 'denied'/);
  });
  it('never grants ad_* signals (the site runs no ads)', () => {
    expect(s).not.toMatch(/ad_(storage|user_data|personalization): 'granted'/);
  });
  it('rejects a non-GA4 id', () => {
    expect(() => gaInitScript("G-1'); alert(1); ('")).toThrow();
  });
  it('builds the gtag.js URL', () => {
    expect(gtagSrc('G-ABCD1234')).toBe('https://www.googletagmanager.com/gtag/js?id=G-ABCD1234');
  });
});

describe('custom events wait for live, granted analytics (decision 4)', () => {
  it('isAnalyticsActive needs gtag AND the loader flag', () => {
    const gtag = () => undefined;
    expect(isAnalyticsActive(undefined)).toBe(false);
    expect(isAnalyticsActive({ gtag })).toBe(false);
    expect(isAnalyticsActive({ gtag, __nlGa: { id: 'G-X', active: false } })).toBe(false);
    expect(isAnalyticsActive({ __nlGa: { id: 'G-X', active: true } })).toBe(false);
    expect(isAnalyticsActive({ gtag, __nlGa: { id: 'G-X', active: true } })).toBe(true);
  });

  function sourceFiles(dir: string, acc: string[] = []): string[] {
    for (const e of readdirSync(dir)) {
      if (e === 'node_modules' || e === 'out' || e === '.next') continue;
      const p = join(dir, e);
      if (statSync(p).isDirectory()) sourceFiles(p, acc);
      else if (/\.(ts|tsx)$/.test(e) && !/\.test\.tsx?$/.test(e)) acc.push(p);
    }
    return acc;
  }

  it('every gtag event call site gates on isAnalyticsActive', () => {
    const files = [...sourceFiles(SRC), ...regionApps.flatMap((a) => sourceFiles(join(APPS_DIR, a, 'src')))];
    expect(files.length).toBeGreaterThan(50);
    const callers = files.filter((f) => /gtag\??\.?\(\s*['"]event['"]/.test(readFileSync(f, 'utf8')));
    expect(callers.length).toBeGreaterThan(0);
    for (const f of callers) {
      expect(readFileSync(f, 'utf8'), f).toMatch(/isAnalyticsActive\(/);
    }
  });
});

describe('withdraw deletes tracker cookies on host and parent domains', () => {
  it('lists the registrable parent but never the bare TLD', () => {
    expect(cookieDomainsFor('jp.thenootropiclab.com')).toEqual(['jp.thenootropiclab.com', 'thenootropiclab.com']);
    expect(cookieDomainsFor('thenootropiclab.com')).toEqual(['thenootropiclab.com']);
    expect(cookieDomainsFor('localhost')).toEqual(['localhost']);
    expect(cookieDomainsFor('127.0.0.1')).toEqual(['127.0.0.1']);
  });

  it('expires matching cookies with a domain attribute for each level', () => {
    const writes: string[] = [];
    const doc = {
      get cookie() {
        return '_ga=GA1.1.1; _ga_ABC123=GS1; klaro=%7B%7D; IR_PI=x';
      },
      set cookie(v: string) {
        writes.push(v);
      },
    };
    const removed = expireCookies(doc, 'jp.thenootropiclab.com', [/^_ga$/, /^_ga_/]);
    expect(removed).toEqual(['_ga', '_ga_ABC123']);
    expect(writes.some((w) => w.startsWith('_ga=;') && w.includes('domain=.thenootropiclab.com'))).toBe(true);
    expect(writes.some((w) => w.startsWith('klaro='))).toBe(false);
    expect(writes.some((w) => w.startsWith('IR_PI='))).toBe(false);
  });
});

describe('Klaro configuration', () => {
  it('declares no Cloudflare Web Analytics service (token never configured — dead purpose)', () => {
    expect(klaroConfig.services.map((s) => s.name)).not.toContain('cloudflare-insights');
  });

  it('GA withdraw → re-accept on one page re-grants without re-running gtag.js', () => {
    const ga = klaroConfig.services.find((s) => s.name === 'google-analytics')!;
    expect(ga.onlyOnce).toBe(true);
    expect(typeof ga.onAccept).toBe('function');
    expect(typeof ga.onDecline).toBe('function');
    const impact = klaroConfig.services.find((s) => s.name === 'impact-com')!;
    expect(typeof impact.onDecline).toBe('function');
  });

  // Same lexicon the portfolio-hub consent checker uses to recognise an accept control.
  const ACCEPT_RE = /\b(accept|allow|agree)\b|acept|aceit|akzeptieren|accepter|受け入れ|同意/i;
  const translations = klaroConfig.translations as Record<string, { ok?: string; acceptAll?: string; decline?: string }>;
  const locales = Object.keys(translations).filter((k) => k !== 'zz');

  it.each(locales)('%s: first-layer accept button reads as consent, same label as "accept all"', (lang) => {
    const t = translations[lang]!;
    expect(t.ok).toBe(t.acceptAll);
    expect(t.ok).toMatch(ACCEPT_RE);
    expect(t.decline).toBeTruthy();
  });
});

describe('Accept and Decline have identical styling (decision 2)', () => {
  const css = readFileSync(join(SRC, 'styles', 'klaro-overrides.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const VARIANTS = ['cm-btn-success', 'cm-btn-danger', 'cm-btn-decline', 'cm-btn-accept-all'];
  const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((m) => ({ sel: m[1]!.trim(), body: m[2]! }));

  it('styles the buttons at all', () => {
    expect(rules.some((r) => VARIANTS.every((v) => r.sel.includes(v)))).toBe(true);
  });

  it('no rule styles one button variant without the others', () => {
    for (const r of rules) {
      const hit = VARIANTS.filter((v) => r.sel.includes(v));
      if (hit.length === 0) continue;
      expect(hit, `rule "${r.sel}" styles only ${hit.join(', ')}`).toEqual(VARIANTS);
    }
  });
});

describe('persistent "Cookie settings" control (C6)', () => {
  const read = (rel: string) => readFileSync(join(SRC, rel), 'utf8');

  it.each(['public-chrome/FPFooter.tsx', 'templates/AppShell.tsx', 'templates/QuizFlow.tsx'])(
    '%s renders the Cookie settings control',
    (rel) => {
      expect(read(rel)).toMatch(/<CookieSettings(Button|Bar)\b/);
    },
  );

  it('the control re-opens Klaro', () => {
    expect(read('CookieSettingsButton.tsx')).toMatch(/openCookieSettings\(\)/);
    expect(read('CookieBanner.tsx')).toMatch(/Klaro\.show\(klaroConfig, true\)/);
  });

  const LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];
  it.each(LOCALES)('%s: label is translated and names cookies + settings', (loc) => {
    const label = getStrings(loc).cookie.settings;
    expect(label).toMatch(/cookie|témoins/i);
    if (loc !== 'en') expect(label).not.toBe(getStrings('en').cookie.settings);
  });
});
