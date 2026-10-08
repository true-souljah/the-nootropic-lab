import { describe, it, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  allProductsUS, allProductsEU, allProductsCA, allProductsAU,
  allProductsJP, allProductsLatam, allProductsGCC, allProductsSEA,
  productsJP,
  purchaseUrl, vendorHost, noPurchaseLinkProblem, getStrings, NO_PURCHASE_LINK_STRINGS,
} from '@nootropic/data';
import type { Locale, Product } from '@nootropic/data';
import TrackedAffiliateLink from './TrackedAffiliateLink';
import ComparisonTable from './ComparisonTable';
import NoPurchaseLinkNotice from './NoPurchaseLinkNotice';

// Site-owner decision 2026-10-08: the Japanese edition shows no purchase link
// for products whose formula contains an ingredient from a plant on Japan's
// MHLW list of ingredients used exclusively as medicines
// (https://www.mhlw.go.jp/content/001734637.pdf, 2026.8.5更新). The products
// keep their pages and list positions; only the links go. purchaseUrl()
// (packages/data/src/purchase-link.ts) is the single gate: this file checks
// the data, the rendered CTAs, and that no template, page or data module
// reads the vendor-URL field around it.

const MHLW_PDF = 'https://www.mhlw.go.jp/content/001734637.pdf';

const ALL: Record<string, Product[]> = {
  us: allProductsUS, eu: allProductsEU, ca: allProductsCA, au: allProductsAU,
  jp: allProductsJP, latam: allProductsLatam, gcc: allProductsGCC, sea: allProductsSEA,
};

function fixture(overrides: Partial<Product> = {}): Product {
  return {
    ...allProductsJP.find((p) => p.slug === 'hunter-focus-review')!,
    ...overrides,
  };
}

describe('purchaseUrl / vendorHost', () => {
  test('purchaseUrl returns the vendor URL when there is no block, null when there is one', () => {
    const open = fixture({ noPurchaseLink: undefined, affiliateUrl: 'https://shop.example/p/x' });
    expect(purchaseUrl(open)).toBe('https://shop.example/p/x');
    expect(purchaseUrl(fixture())).toBeNull();
  });

  test('a stray null is not a block (validate-data rejects it separately)', () => {
    const stray = { ...fixture(), noPurchaseLink: null } as unknown as Product;
    expect(purchaseUrl(stray)).toBe(stray.affiliateUrl);
    expect(noPurchaseLinkProblem(stray, 'jp')).toMatch(/not an object/);
  });

  test('vendorHost returns the host, or null for an unparsable URL', () => {
    expect(vendorHost(fixture({ affiliateUrl: 'https://www.hunterevolve.com/en-us/hunter-focus' }))).toBe('www.hunterevolve.com');
    expect(vendorHost(fixture({ affiliateUrl: 'not a url' }))).toBeNull();
  });
});

describe('noPurchaseLinkProblem (validate-data rule)', () => {
  const good = fixture().noPurchaseLink!;
  const withBlock = (patch: Record<string, unknown>) =>
    ({ ...fixture(), noPurchaseLink: { ...good, ...patch } }) as unknown as Product;

  test('accepts the real JP record', () => {
    expect(noPurchaseLinkProblem(fixture(), 'jp')).toBeNull();
  });

  test('absent field is fine', () => {
    expect(noPurchaseLinkProblem(fixture({ noPurchaseLink: undefined }), 'us')).toBeNull();
  });

  test.each([
    ['unknown reason', { reason: 'other' }, 'jp', /reason is not one of/],
    ['JP reason on another region', {}, 'us', /applies to jp records only/],
    ['empty ingredients', { ingredients: [] }, 'jp', /ingredients is empty/],
    ['ingredient the formula does not list', { ingredients: [{ name: 'Huperzine A', plant: 'Huperzia serrata', listedAs: 'トウゲシバ' }] }, 'jp', /not in the record's heroIngredients or ingredientDosages/],
    ['ingredient without a plant', { ingredients: [{ name: 'Ashwagandha', plant: '', listedAs: 'x' }] }, 'jp', /has no plant/],
    ['ingredient without a list entry', { ingredients: [{ name: 'Ashwagandha', plant: 'Withania somnifera', listedAs: ' ' }] }, 'jp', /has no listedAs/],
    ['http source', { sourceUrl: 'http://www.mhlw.go.jp/content/001734637.pdf' }, 'jp', /not https/],
    ['relative source', { sourceUrl: '/content/001734637.pdf' }, 'jp', /not an absolute URL/],
    ['bad listUpdated', { listUpdated: '2026.8.5' }, 'jp', /listUpdated is not a YYYY-MM-DD/],
    ['impossible checkedAt', { checkedAt: '2026-02-30' }, 'jp', /checkedAt is not a YYYY-MM-DD/],
    ['checked before the list update', { checkedAt: '2026-08-01' }, 'jp', /is before listUpdated/],
  ] as const)('rejects %s', (_label, patch, region, message) => {
    expect(noPurchaseLinkProblem(withBlock(patch), region)).toMatch(message);
  });
});

describe('catalogue data', () => {
  test.each(Object.entries(ALL))('%s: every noPurchaseLink record passes the rule', (region, products) => {
    for (const p of products) expect(noPurchaseLinkProblem(p, region), `${region}/${p.slug}`).toBeNull();
  });

  test('jp: every record with noPurchaseLink yields no purchase URL', () => {
    const blocked = allProductsJP.filter((p) => p.noPurchaseLink !== undefined);
    expect(blocked.length).toBeGreaterThan(0);
    for (const p of blocked) expect(purchaseUrl(p), p.slug).toBeNull();
  });

  test('jp: Hunter Focus (Ashwagandha KSM-66, Withania somnifera on the MHLW list) has no purchase link', () => {
    const hunter = allProductsJP.find((p) => p.slug === 'hunter-focus-review')!;
    expect(hunter.noPurchaseLink).toMatchObject({
      reason: 'jp-mhlw-medicine-only-ingredient',
      sourceUrl: MHLW_PDF,
      listUpdated: '2026-08-05',
    });
    expect(hunter.noPurchaseLink!.ingredients.map((i) => i.plant)).toEqual(['Withania somnifera']);
    expect(purchaseUrl(hunter)).toBeNull();
  });

  test('jp: the block is links-only — the product stays in the recommendable list', () => {
    expect(productsJP.some((p) => p.slug === 'hunter-focus-review')).toBe(true);
  });

  test('jp: the other records keep their links (the gate is not blanket)', () => {
    const open = allProductsJP.filter((p) => p.noPurchaseLink === undefined && p.discontinued == null);
    expect(open.length).toBeGreaterThan(0);
    for (const p of open) expect(purchaseUrl(p), p.slug).toMatch(/^https:\/\//);
  });
});

describe('notice strings', () => {
  const LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

  test.each(LOCALES)('%s bundle carries a complete noPurchaseLink notice', (locale) => {
    const s = getStrings(locale).noPurchaseLink;
    expect(s).toBe(NO_PURCHASE_LINK_STRINGS[locale]);
    for (const key of ['lang', 'label', 'jpMhlwReason', 'jpMhlwReasonJa', 'sourceLink', 'sourceDates'] as const) {
      expect(s[key], `${locale}.${key}`).toBeTruthy();
    }
    expect(s.jpMhlwReason).toContain('{ingredients}');
    expect(s.sourceDates).toContain('{listUpdated}');
    expect(s.sourceDates).toContain('{checkedAt}');
    // Owner wording: "may" (可能性がある); never "is a drug" / "illegal".
    expect(s.jpMhlwReasonJa).toBe('日本では医薬品として扱われる原料を含む可能性があるため、本サイトでは購入リンクを掲載しません。');
    expect(`${s.label} ${s.jpMhlwReason}`).not.toMatch(/illegal|banned|prohibited|ilegal|interdit|verboten|proibid|prohib/i);
  });

  test('the JP edition (English body copy, translation paused) carries the English line', () => {
    expect(getStrings('ja').noPurchaseLink.lang).toBe('en');
    expect(getStrings('ja').noPurchaseLink.label).toBe('No purchase link in Japan');
  });
});

describe('rendered CTAs', () => {
  const ja = getStrings('ja').noPurchaseLink;
  const hunter = allProductsJP.find((p) => p.slug === 'hunter-focus-review')!;
  const mlp = allProductsJP.find((p) => p.slug === 'mind-lab-pro-review')!;
  const vendorHref = (p: Product) => `href="${p.affiliateUrl.replace(/&/g, '&amp;')}"`;

  test('TrackedAffiliateLink renders the full notice, not a vendor link, for a blocked product', () => {
    const html = renderToStaticMarkup(
      createElement(TrackedAffiliateLink, { product: hunter, surface: 'listicle', noticeStrings: ja, children: 'Check Hunter Focus' }),
    );
    expect(html).not.toContain(vendorHref(hunter));
    expect(html).not.toContain('hunterevolve.com');
    expect(html).not.toContain('Check Hunter Focus');
    expect(html).toContain('role="note"');
    expect(html).toContain('No purchase link in Japan');
    expect(html).toContain('Ashwagandha (Withania somnifera)');
    expect(html).toContain('<p class="m-0 mt-1" lang="ja">日本では医薬品として扱われる原料を含む可能性があるため');
    expect(html).toContain(`href="${MHLW_PDF}"`);
    expect(html).toContain('list updated 2026-08-05; checked 2026-10-08');
  });

  test('TrackedAffiliateLink compact variant renders the short label only', () => {
    const html = renderToStaticMarkup(
      createElement(TrackedAffiliateLink, { product: hunter, surface: 'best_of_jp', noticeStrings: ja, noticeVariant: 'compact', children: 'Visit →' }),
    );
    expect(html).not.toContain('<a');
    expect(html).toContain('lang="en"');
    expect(html).toContain('No purchase link in Japan');
  });

  test('TrackedAffiliateLink still links an unblocked product', () => {
    const html = renderToStaticMarkup(
      createElement(TrackedAffiliateLink, { product: mlp, surface: 'listicle', noticeStrings: ja, children: 'Check Mind Lab Pro' }),
    );
    expect(html).toContain(vendorHref(mlp));
    expect(html).toContain('rel="nofollow sponsored noopener noreferrer"');
    expect(html).not.toContain('No purchase link');
  });

  test('ComparisonTable (/ja/hikaku/, /ja/best-nootropics/) shows the label instead of the Hunter Focus link', () => {
    const html = renderToStaticMarkup(createElement(ComparisonTable, { products: productsJP, market: 'jp' }));
    expect(html).not.toContain('hunterevolve.com');
    // Desktop row + mobile card.
    expect(html.match(/data-no-purchase-link="jp-mhlw-medicine-only-ingredient"/g)).toHaveLength(2);
    expect(html).toContain(vendorHref(mlp));
  });

  test('NoPurchaseLinkNotice renders nothing for a product without a block', () => {
    expect(renderToStaticMarkup(createElement(NoPurchaseLinkNotice, { product: mlp, strings: ja }))).toBe('');
  });
});

// ── Source guard ─────────────────────────────────────────────────────────
// Templates, shared components, data modules and the pages of every app
// whose catalogue has a blocked record must not name the vendor-URL field:
// they go through purchaseUrl() (buy links) or vendorHost() (Trustpilot
// domain, analytics). A plain token match — comments count too, so the scan
// cannot be fooled by stripping. Test files are not scanned.

const REPO = join(__dirname, '..', '..', '..');
const FIELD = /\baffiliateUrl\b/;

const ALLOWED: Record<string, string> = {
  'packages/data/src/purchase-link.ts': 'the gate itself',
  'packages/data/src/products-us.ts': 'declares the Product field',
  'packages/data/src/product-rules.ts': 'validates the URL shape for validate-data; renders nothing',
};

/** Apps in scope: JP plus any region whose catalogue carries a blocked record. */
const APPS_IN_SCOPE = [...new Set(['jp', ...Object.entries(ALL).filter(([, ps]) => ps.some((p) => p.noPurchaseLink !== undefined)).map(([r]) => r)])];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (/\.(ts|tsx|js|mjs)$/.test(name) && !/\.(test|spec)\.(ts|tsx)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

const SCANNED = [
  'packages/ui/src',
  'packages/data/src',
  ...APPS_IN_SCOPE.map((r) => `apps/${r}/src`),
].flatMap((d) => sourceFiles(join(REPO, d)).map((f) => relative(REPO, f)));

describe('source guard: no CTA reads the vendor URL around purchaseUrl()', () => {
  it('matcher self-test: catches reads, ignores the helpers and the URL-rule name', () => {
    for (const bad of ['href={p.affiliateUrl}', 'const { affiliateUrl } = product;', "product['affiliateUrl']", 'winner?.affiliateUrl']) {
      expect(FIELD.test(bad), bad).toBe(true);
    }
    for (const ok of ['href={purchaseUrl(p)}', 'vendorHost(product)', 'affiliateUrlProblem(url)']) {
      expect(FIELD.test(ok), ok).toBe(false);
    }
  });

  it('scans the shared packages and the in-scope apps (non-empty input)', () => {
    expect(APPS_IN_SCOPE).toContain('jp');
    expect(SCANNED.length).toBeGreaterThan(100);
    for (const must of [
      'packages/ui/src/TrackedAffiliateLink.tsx',
      'packages/ui/src/ComparisonTable.tsx',
      'packages/ui/src/StickyCtaBar.tsx',
      'packages/ui/src/templates/ProductDetail.tsx',
      'apps/jp/src/app/best-nootropics/page.tsx',
      'apps/jp/src/app/ja/best-nootropics/page.tsx',
    ]) {
      expect(SCANNED, must).toContain(must);
    }
  });

  it('every allow-listed file exists in the scan', () => {
    for (const file of Object.keys(ALLOWED)) expect(SCANNED, file).toContain(file);
  });

  it('no other file names the vendor-URL field', () => {
    const offenders = SCANNED.filter((f) => !(f in ALLOWED))
      .flatMap((f) =>
        readFileSync(join(REPO, f), 'utf8')
          .split('\n')
          .map((line, i) => (FIELD.test(line) ? `${f}:${i + 1}: ${line.trim()}` : null))
          .filter((x): x is string => x !== null),
      );
    expect(offenders, 'read the vendor URL through purchaseUrl() / vendorHost() from @nootropic/data').toEqual([]);
  });

  it('the CTA components route through purchaseUrl()', () => {
    for (const f of ['packages/ui/src/TrackedAffiliateLink.tsx', 'packages/ui/src/ComparisonTable.tsx']) {
      expect(readFileSync(join(REPO, f), 'utf8'), f).toMatch(/\bpurchaseUrl\(/);
    }
  });
});
