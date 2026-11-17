// Server render of the Deals page and its offer list (renderToStaticMarkup: effects do not run,
// so the list renders with `builtOn` as "today", exactly the first, hydration-safe render).
// Fixtures are invented: vendors and products on .example hosts, codes like SAMPLE10, dates
// relative to the injected build date. No real vendor, product or code.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { getStrings, getRegionalHealthDisclaimer, type Product } from '@nootropic/data';
import DealsList, { type DealCardView, type DealOfferView, type DealsLabels } from './templates/DealsList.client';
import DealsPage from './templates/DealsPage';

const en = getStrings('en');
const es = getStrings('es');
const labelsOf = (s: typeof en): DealsLabels => ({
  deals: s.deals,
  scoreAria: s.productDetail.score.aria,
  noCommission: s.disclosure.noCommission,
  noPurchaseLink: s.noPurchaseLink,
});
const LABELS = labelsOf(en);
const BUILT = '2032-06-10';

function product(slug: string, brand: string, host: string, score: number, extra: Record<string, unknown> = {}): Product {
  return {
    id: slug,
    slug,
    name: `${brand} ${slug}`,
    brand,
    score,
    commissionRate: '20%',
    affiliateNetwork: 'Example Network',
    affiliateUrl: `https://${host}/buy/${slug}`,
    ...extra,
  } as unknown as Product;
}
const buyHref = (p: Product) => `href="https://${new URL(purchase(p)).host}/buy/${p.slug}"`;
const purchase = (p: Product) => (p as unknown as Record<string, string>)[`affiliate${'Url'}`];

function offer(id: string, patch: Partial<DealOfferView> = {}): DealOfferView {
  return {
    id,
    kind: 'percent',
    headline: 'Save 10% on every bottle',
    terms_quote: 'One code per order, no minimum',
    code: 'SAMPLE10',
    starts: null,
    expires: '2032-07-31',
    geo: ['US'],
    regulated: false,
    confirmed_on: '2032-06-01',
    ...patch,
  };
}

const ALPHA = product('alpha-focus', 'Alpha Labs', 'alpha.example', 9.1);
const BETA = product('beta-mind', 'Beta Botanics', 'shop.beta.example', 8.2);
const GAMMA = product('gamma-calm', 'Gamma Goods', 'gamma.example', 7.4);
const NO_COMMISSION = product('delta-direct', 'Delta Direct', 'delta.example', 6.9, { commissionRate: '0%' });
const NO_LINK = product('eps-pure', 'Epsilon Pure', 'eps.example', 6.1, {
  noPurchaseLink: { reason: 'not-sold-on-linked-store', store: 'Example Store', observed: 'Unavailable', checkedAt: '2032-05-01' },
});

const list = (cards: DealCardView[], builtOn = BUILT, labels = LABELS, dateLocale = 'en-US') =>
  renderToStaticMarkup(<DealsList cards={cards} builtOn={builtOn} labels={labels} dateLocale={dateLocale} />);
const text = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const count = (html: string, needle: string) => html.split(needle).length - 1;
const main = (html: string) => /<main[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1] ?? '';

beforeEach(() => {
  // Every app builds with trailingSlash: true; next/link reads it from here.
  vi.stubEnv('__NEXT_TRAILING_SLASH', 'true');
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('DealsList (server render with the build date)', () => {
  it('an active offer with a code: code, copy button, and the commission sentence right before the buy link', () => {
    const html = list([{ promo: offer('alpha-save'), products: [ALPHA] }]);
    expect(html).toContain('SAMPLE10');
    expect(text(html)).toContain(en.deals.copy);
    expect(html).toMatch(/role="status"[^>]*class="ds-sr-only"|class="ds-sr-only"[^>]*role="status"/);
    const sentence = html.indexOf(en.deals.linkDisclosure);
    const anchor = html.lastIndexOf('<a ', html.indexOf(buyHref(ALPHA)));
    expect(sentence).toBeGreaterThan(-1);
    expect(anchor).toBeGreaterThan(sentence);
    // Nothing but closing/opening wrappers between the sentence and the buy link: no other link or text.
    expect(text(html.slice(sentence + en.deals.linkDisclosure.length, anchor)).trim()).toBe('');
    expect(html.slice(sentence, anchor)).not.toContain('<a ');
    expect(html).toMatch(/<a [^>]*rel="nofollow sponsored noopener noreferrer"/);
    expect(text(html)).toContain('Buy at Alpha Labs');
  });

  it('an active offer without a code shows "No code needed" and no copy button', () => {
    const html = list([{ promo: offer('alpha-ship', { code: null, kind: 'shipping' }), products: [ALPHA] }]);
    expect(text(html)).toContain(en.deals.noCode);
    expect(text(html)).toContain(en.deals.kind.shipping);
    expect(text(html)).not.toContain(en.deals.copy);
    expect(html).not.toContain('<code');
  });

  it('an offer ending within 7 days carries the warn chip with its date in the text', () => {
    const html = list([{ promo: offer('alpha-soon', { expires: '2032-06-13' }), products: [ALPHA] }]);
    expect(text(html)).toContain('Ends soon — June 13, 2032');
    expect(html).toMatch(/<time datetime="2032-06-13">June 13, 2032<\/time>/i);
    expect(html).toMatch(/<time datetime="2032-06-01">June 1, 2032<\/time>/i);
  });

  it('an ended offer loses its code, copy button, commission sentence and every buy link; products stay listed', () => {
    const html = list(
      [
        { promo: offer('alpha-live', { code: 'SAMPLE10' }), products: [ALPHA] },
        { promo: offer('beta-old', { code: 'SAMPLE20', expires: '2032-06-09' }), products: [BETA, GAMMA] },
      ],
      BUILT,
    );
    expect(html).not.toContain('SAMPLE20');
    expect(html).not.toContain(buyHref(BETA));
    expect(html).not.toContain(buyHref(GAMMA));
    expect(count(html, en.deals.linkDisclosure)).toBe(1); // only the live card's link
    expect(count(text(html), en.deals.copy)).toBe(1);
    expect(text(html)).toContain('This offer ended on June 9, 2032. The code is no longer shown.');
    expect(text(html)).toContain('Ended June 9, 2032');
    expect(html).toContain('href="/beta-mind/"');
    expect(html).toContain('href="/gamma-calm/"');
    expect(text(html)).toContain('Read our review of Beta Botanics beta-mind');
  });

  it('a product without a purchase link shows the notice, no link and no commission sentence', () => {
    const html = list([{ promo: offer('eps-save'), products: [NO_LINK] }]);
    expect(html).toContain('data-no-purchase-link="not-sold-on-linked-store"');
    expect(text(html)).toContain(en.noPurchaseLink.notSoldLabel);
    expect(html).not.toContain('rel="nofollow sponsored');
    expect(html).not.toContain(en.deals.linkDisclosure);
    expect(html).not.toContain('eps.example');
  });

  it('a product we earn no commission on shows the no-commission line and no commission sentence', () => {
    const html = list([{ promo: offer('delta-save'), products: [NO_COMMISSION] }]);
    expect(text(html)).toContain(en.disclosure.noCommission);
    expect(html).not.toContain(en.deals.linkDisclosure);
    expect(html).toContain(buyHref(NO_COMMISSION));
    expect(text(html).indexOf(en.disclosure.noCommission)).toBeLessThan(text(html).indexOf('Buy at Delta Direct'));
  });

  it('vendor quotes are marked lang="en"; the translated attribution sits outside them', () => {
    const html = list([{ promo: offer('alpha-save'), products: [ALPHA] }], BUILT, labelsOf(es), 'es-419');
    expect(count(html, '<blockquote lang="en"')).toBe(2);
    expect(html).toMatch(/<blockquote lang="en"[^>]*>Save 10% on every bottle<\/blockquote><footer[^>]*>Texto del proveedor, citado<\/footer>/);
    expect(html).toMatch(/<blockquote lang="en"[^>]*>One code per order, no minimum<\/blockquote><footer[^>]*>Condiciones del proveedor, citadas<\/footer>/);
    expect(text(html)).toContain(es.deals.linkDisclosure);
    expect(html).not.toContain(en.deals.linkDisclosure);
  });

  it('cards render in the order given (never re-sorted by expiry, kind, code or score)', () => {
    const html = list([
      { promo: offer('gamma-a', { expires: '2032-12-31', kind: 'other' }), products: [GAMMA] },
      { promo: offer('alpha-b', { expires: '2032-06-12', code: null }), products: [ALPHA] },
      { promo: offer('beta-c', { expires: '2032-08-01', kind: 'fixed' }), products: [BETA] },
    ]);
    const at = ['deal-gamma-a', 'deal-alpha-b', 'deal-beta-c'].map((id) => html.indexOf(`id="${id}"`));
    expect(at.every((i) => i > -1)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });

  it('the ending-soon filter is an opt-in show/hide button, off by default, and absent for an empty list', () => {
    const html = list([{ promo: offer('alpha-save'), products: [ALPHA] }]);
    expect(html).toMatch(/<button type="button" aria-pressed="false"[^>]*>Only ending soon<\/button>/);
    expect(text(html)).toContain('Offers listed: 1');
    const empty = list([]);
    expect(empty).not.toContain('aria-pressed');
    expect(empty).not.toContain(en.deals.filterOff);
  });

  it('an upcoming offer renders nothing', () => {
    const html = list([
      { promo: offer('alpha-save'), products: [ALPHA] },
      { promo: offer('beta-later', { starts: '2032-06-11', code: 'SAMPLE30' }), products: [BETA] },
    ]);
    expect(html).not.toContain('SAMPLE30');
    expect(html).not.toContain('deal-beta-later');
    expect(text(html)).toContain('Offers listed: 1');
  });

  it('when every offer has ended the list is replaced by the all-ended block', () => {
    const html = list(
      [
        { promo: offer('alpha-old', { expires: '2032-06-01' }), products: [ALPHA] },
        { promo: offer('beta-old', { expires: '2032-06-05', code: 'SAMPLE20' }), products: [BETA] },
      ],
      '2032-06-10',
    );
    expect(text(html)).toContain(en.deals.allEndedChip);
    expect(text(html)).toContain(en.deals.allEndedTitle);
    expect(text(html)).toContain('This page was built on June 10, 2032');
    for (const gone of ['SAMPLE10', 'SAMPLE20', 'rel="nofollow sponsored', en.deals.linkDisclosure, 'aria-pressed']) expect(html).not.toContain(gone);
  });

  it('a regulated offer carries its chip and label; controls carry the focus ring and a 24px minimum', () => {
    const html = list([{ promo: offer('alpha-reg', { regulated: true }), products: [ALPHA] }]);
    expect(text(html)).toContain(en.deals.regulatedChip);
    expect(text(html)).toContain(en.deals.regulatedLabel);
    const copyButton = /<button type="button"[^>]*>Copy code<\/button>/.exec(html)?.[0] ?? '';
    expect(copyButton).toContain('focus-visible:outline-ds-focus-ring');
    expect(copyButton).toContain('min-h-6');
    expect(copyButton).toContain('bg-ds-ink text-white');
  });
});

describe('DealsPage', () => {
  beforeEach(() => {
    // The page chrome (FPHeader, FPFooter) resolves its region from the build env.
    vi.stubEnv('NEXT_PUBLIC_REGION', 'us');
  });
  const page =(promosDoc: unknown, products: Product[]) =>
    renderToStaticMarkup(
      <DealsPage
        regionCode="us"
        products={products}
        promosDoc={promosDoc}
        strings={en}
        healthDisclaimer={getRegionalHealthDisclaimer('us')}
        dateLocale="en-US"
      />,
    );
  const FAR = '2099-12-31';
  const row = (id: string, vendor_domain: string) => ({
    id,
    vendor_id: id,
    vendor_domain,
    kind: 'percent',
    headline: 'Save 10% on every bottle',
    terms_quote: 'One code per order, no minimum',
    code: 'SAMPLE10',
    starts: null,
    expires: FAR,
    geo: ['US'],
    regulated: false,
    confirmed_on: '2032-06-01',
  });

  it('the empty page (launch state): empty state, site strip, no sponsored link, no commission sentence', () => {
    const html = page({ schema_version: 1, promos: [] }, [ALPHA, BETA]);
    expect(text(html)).toContain(en.deals.emptyTitle);
    expect(html).toContain('href="/best-nootropics/"');
    expect(html).toContain('data-disclosure-scope="site"');
    expect(html).not.toContain('data-disclosure-scope="page"');
    expect(html).not.toMatch(/rel="[^"]*sponsored/);
    expect(html).not.toContain(en.deals.linkDisclosure);
    expect(html).not.toContain(en.disclosure.inline);
    expect(html).not.toContain('aria-pressed');
    expect(count(html, '<h1')).toBe(1);
    expect(text(html)).toContain(en.productDetail.healthDisclaimerHeading);
  });

  it('with offers: cards in score order whatever the file order, the page strip, and a buy link per product', () => {
    const html = page({ schema_version: 1, promos: [row('gamma-save', 'gamma.example'), row('alpha-save', 'alpha.example')] }, [GAMMA, ALPHA]);
    expect(html.indexOf('id="deal-alpha-save"')).toBeGreaterThan(-1);
    expect(html.indexOf('id="deal-alpha-save"')).toBeLessThan(html.indexOf('id="deal-gamma-save"'));
    expect(html).toContain('data-disclosure-scope="page"');
    expect(html).toContain(buyHref(ALPHA));
    expect(html).toContain(buyHref(GAMMA));
    expect(count(html, en.deals.linkDisclosure)).toBe(2);
    expect(html).not.toContain('"@type":"Offer"');
  });

  it('a bad promo file fails the build', () => {
    expect(() => page({ schema_version: 1, promos: [row('nobody', 'nobody.example')] }, [ALPHA])).toThrow(/^promos.json invalid:/);
  });

  it('no "may" next to "commission" in the page content (English)', () => {
    const near = /\bmay\b[^.]{0,40}commission|commission[^.]{0,40}\bmay\b/i;
    const outputs = [
      main(page({ schema_version: 1, promos: [] }, [ALPHA])),
      main(page({ schema_version: 1, promos: [row('alpha-save', 'alpha.example')] }, [ALPHA, NO_COMMISSION])),
      list([{ promo: offer('delta-save'), products: [NO_COMMISSION, NO_LINK] }]),
    ];
    for (const html of outputs) {
      expect(html.length).toBeGreaterThan(0);
      expect(near.test(text(html))).toBe(false);
    }
  });
});
