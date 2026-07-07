import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Money pages must carry BOTH the FTC affiliate disclosure (FPDisclosure)
// and the region-specific YMYL health disclaimer (getRegionalHealthDisclaimer).
//
// Audit 2026-07-07 found these absent on the three highest-commercial-intent
// AppShell templates (ProductDetail / BestOf / Comparator) across all 8
// regions, and healthDisclaimer wired on ProductDetail for CA only. The
// affiliate CTA (TrackedAffiliateLink) rendered with no disclosure banner —
// an FTC 16 CFR Part 255 + YMYL exposure. This sweep locks the fix in.

const TEMPLATES_DIR = join(__dirname, 'templates');
const APPS_DIR = join(__dirname, '..', '..', '..', 'apps');

// The AppShell commercial templates that render TrackedAffiliateLink CTAs.
const MONEY_TEMPLATES = ['ProductDetail.tsx', 'BestOf.tsx', 'Comparator.tsx'];

const regionApps = readdirSync(APPS_DIR).filter((d) =>
  existsSync(join(APPS_DIR, d, 'src', 'app', '[slug]', 'page.tsx')),
);

describe('money-page disclosures', () => {
  it.each(MONEY_TEMPLATES)('%s renders the FTC affiliate disclosure (FPDisclosure)', (tpl) => {
    const src = readFileSync(join(TEMPLATES_DIR, tpl), 'utf8');
    expect(src, `${tpl}: missing FPDisclosure import`).toMatch(
      /import\s+\{\s*FPDisclosure\s*\}\s+from\s+['"]\.\.\/public-chrome\/FPDisclosure['"]/,
    );
    expect(src, `${tpl}: FPDisclosure not rendered`).toMatch(/<FPDisclosure\b/);
  });

  it('finds all 8 region [slug] review pages', () => {
    expect(regionApps.length).toBe(8);
  });

  it.each(regionApps)(
    '%s: product review page passes a regional health disclaimer to ProductDetail',
    (app) => {
      const src = readFileSync(join(APPS_DIR, app, 'src', 'app', '[slug]', 'page.tsx'), 'utf8');
      expect(src, `${app}: getRegionalHealthDisclaimer not imported`).toMatch(
        /getRegionalHealthDisclaimer/,
      );
      expect(src, `${app}: healthDisclaimer prop not passed to ProductDetail`).toMatch(
        /healthDisclaimer=\{getRegionalHealthDisclaimer\(/,
      );
    },
  );
});
