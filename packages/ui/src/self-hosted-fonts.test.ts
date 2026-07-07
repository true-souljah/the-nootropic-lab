import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Fonts must stay self-hosted (next/font/local). next/font/google fetches
// from fonts.googleapis.com at BUILD time, which fails behind the research
// pipeline runner's TLS proxy (SELF_SIGNED_CERT_IN_CHAIN) — the failure that
// blocked every your-watts Stage 8 delivery on 2026-07-07. This sweep keeps
// the network-fetch pattern out of all region apps.

const APPS_DIR = join(__dirname, '..', '..', '..', 'apps');

const regionApps = readdirSync(APPS_DIR).filter((d) =>
  existsSync(join(APPS_DIR, d, 'src', 'app', 'layout.tsx')),
);

describe('self-hosted fonts (all region apps)', () => {
  it('finds the region apps', () => {
    expect(regionApps.length).toBeGreaterThanOrEqual(8);
  });

  it.each(regionApps)('%s: layout.tsx does not import next/font/google', (app) => {
    const layout = readFileSync(join(APPS_DIR, app, 'src', 'app', 'layout.tsx'), 'utf8');
    // Match import statements only — prose mentions in comments are fine.
    expect(layout).not.toMatch(/from\s+['"]next\/font\/google['"]/);
    expect(layout).toMatch(/from\s+['"]next\/font\/local['"]/);
  });

  it.each(regionApps)('%s: referenced font files ship and are valid woff2', (app) => {
    const appDir = join(APPS_DIR, app, 'src', 'app');
    const layout = readFileSync(join(appDir, 'layout.tsx'), 'utf8');
    const referenced = [...layout.matchAll(/\.\/fonts\/([\w.-]+\.woff2)/g)].map((m) => m[1]);
    expect(referenced.length).toBeGreaterThan(0);
    for (const file of referenced) {
      const path = join(appDir, 'fonts', file);
      expect(existsSync(path), `${app}: ${file} missing`).toBe(true);
      const head = readFileSync(path).subarray(0, 4);
      expect(head.toString('latin1'), `${app}: ${file} magic bytes`).toBe('wOF2');
    }
  });

  // OG images render via satori (next/og), which fetches ANY glyph its
  // bundled latin font can't cover from Google Fonts, and raw emoji from
  // cdn.jsdelivr.net — both at build time, both dead behind the TLS proxy.
  it.each(regionApps)('%s: opengraph-image has no raw emoji (use inlined data URIs)', (app) => {
    const og = readFileSync(join(APPS_DIR, app, 'src', 'app', 'opengraph-image.tsx'), 'utf8');
    expect(og).not.toMatch(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u);
  });

  it.each(regionApps)('%s: opengraph-image CJK text requires bundled og-fonts', (app) => {
    const appDir = join(APPS_DIR, app, 'src', 'app');
    const og = readFileSync(join(appDir, 'opengraph-image.tsx'), 'utf8');
    const hasCjk = /[\u{3040}-\u{30FF}\u{3400}-\u{9FFF}]/u.test(og);
    if (!hasCjk) return;
    expect(og, `${app}: CJK text without a fonts: option`).toMatch(/fonts:\s*\[/);
    const referenced = [...og.matchAll(/ogFont\('([\w.-]+\.ttf)'\)/g)].map((m) => m[1]);
    expect(referenced.length).toBeGreaterThan(0);
    for (const file of referenced) {
      expect(existsSync(join(appDir, 'og-fonts', file)), `${app}: ${file} missing`).toBe(true);
    }
  });
});
