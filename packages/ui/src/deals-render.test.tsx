// Server render of the Deals page and its offer list (renderToStaticMarkup: effects do not run,
// so the list renders with `builtOn` as "today", exactly the first, hydration-safe render).
// Fixtures are invented: vendors and products on .example hosts, codes like SAMPLE10, dates
// relative to the injected build date. No real vendor, product or code.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
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

  it("the region's markets: each links its guide page with its own note, in the given order; no section without a list", () => {
    vi.stubEnv('NEXT_PUBLIC_REGION', 'sea');
    const markets = [
      { name: 'Examplestan', href: '/countries/examplestan/', note: 'Parcels to Examplestan arrive as personal-use imports.' },
      { name: 'Sampleland', href: '/countries/sampleland/', note: 'Check the delivery estimate to Sampleland at checkout.' },
    ];
    const html = renderToStaticMarkup(
      <DealsPage
        regionCode="sea"
        products={[ALPHA]}
        promosDoc={{ schema_version: 1, promos: [] }}
        strings={en}
        healthDisclaimer={getRegionalHealthDisclaimer('sea')}
        dateLocale="en-SG"
        markets={markets}
      />,
    );
    expect(html).toMatch(new RegExp(`<h2 id="deals-markets-heading"[^>]*>${en.productDetail.regionalBuying.heading.sea}</h2>`));
    for (const m of markets) {
      expect(html).toMatch(new RegExp(`<a [^>]*href="${m.href}"[^>]*>${m.name}</a>`));
      expect(text(html)).toContain(m.note);
    }
    expect(html.indexOf('Examplestan')).toBeLessThan(html.indexOf('Sampleland'));
    // After the offers or empty state, before the health disclaimer; it adds no buy link.
    expect(html.indexOf('id="deals-empty-heading"')).toBeLessThan(html.indexOf('id="deals-markets-heading"'));
    expect(html.indexOf('id="deals-markets-heading"')).toBeLessThan(html.indexOf('id="deals-health-disclaimer-heading"'));
    expect(html).not.toMatch(/rel="[^"]*sponsored/);
    expect(html).toContain('data-disclosure-scope="site"');
    expect(page({ schema_version: 1, promos: [] }, [ALPHA])).not.toContain('deals-markets-heading');
  });
});

// ---- the reader's browser: a page left open across 00:00 UTC ---------------------------------
// renderToStaticMarkup runs no effect and no DOM library is installed, so these cases mount the
// list with react-dom/client into the minimal DOM below (only the calls React makes for this
// tree) and move the reader's clock with fake timers.
const HTML_NS = 'http://www.w3.org/1999/xhtml';
class FakeNode extends EventTarget {
  parentNode: FakeNode | null = null;
  childNodes: FakeNode[] = [];
  nodeValue: string | null = null;
  constructor(
    readonly nodeType: number,
    readonly nodeName: string,
    readonly ownerDocument: FakeDocument | null,
  ) {
    super();
  }
  get firstChild() {
    return this.childNodes[0] ?? null;
  }
  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] ?? null;
  }
  get nextSibling(): FakeNode | null {
    const siblings = this.parentNode?.childNodes ?? [];
    return siblings[siblings.indexOf(this) + 1] ?? null;
  }
  get textContent(): string {
    return this.nodeType === 3 ? (this.nodeValue ?? '') : this.childNodes.map((c) => c.textContent).join('');
  }
  set textContent(value: string) {
    if (this.nodeType === 3) {
      this.nodeValue = value;
      return;
    }
    for (const child of this.childNodes) child.parentNode = null;
    this.childNodes = [];
    if (value) this.appendChild(new FakeNode(3, '#text', this.ownerDocument)).nodeValue = value;
  }
  insertBefore(child: FakeNode, before: FakeNode | null): FakeNode {
    child.parentNode?.removeChild(child);
    const at = before ? this.childNodes.indexOf(before) : -1;
    this.childNodes.splice(at < 0 ? this.childNodes.length : at, 0, child);
    child.parentNode = this;
    return child;
  }
  appendChild(child: FakeNode): FakeNode {
    return this.insertBefore(child, null);
  }
  removeChild(child: FakeNode): FakeNode {
    this.childNodes.splice(this.childNodes.indexOf(child), 1);
    child.parentNode = null;
    return child;
  }
}
class FakeElement extends FakeNode {
  readonly tagName: string;
  readonly attributes = new Map<string, string>();
  readonly style = { setProperty() {}, removeProperty() {} };
  constructor(
    tag: string,
    doc: FakeDocument,
    readonly namespaceURI = HTML_NS,
  ) {
    super(1, tag.toUpperCase(), doc);
    this.tagName = tag.toUpperCase();
  }
  setAttribute(name: string, value: string) {
    this.attributes.set(name, String(value));
  }
  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }
  removeAttribute(name: string) {
    this.attributes.delete(name);
  }
}
class FakeDocument extends FakeNode {
  visibilityState = 'visible';
  readonly activeElement = null;
  readonly defaultView = { document: this, event: undefined, HTMLIFrameElement: class {} };
  readonly documentElement = new FakeElement('html', this);
  readonly body = this.documentElement.appendChild(new FakeElement('body', this)) as FakeElement;
  constructor() {
    super(9, '#document', null);
    this.appendChild(this.documentElement);
  }
  createElement(tag: string) {
    return new FakeElement(tag, this);
  }
  createElementNS(ns: string, tag: string) {
    return new FakeElement(tag, this, ns);
  }
  createTextNode(value: string) {
    const node = new FakeNode(3, '#text', this);
    node.nodeValue = value;
    return node;
  }
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function outerHtml(node: FakeNode): string {
  if (!(node instanceof FakeElement)) return esc(node.nodeValue ?? '');
  const tag = node.tagName.toLowerCase();
  const attrs = [...node.attributes].map(([name, value]) => ` ${name}="${esc(value)}"`).join('');
  return `<${tag}${attrs}>${node.childNodes.map(outerHtml).join('')}</${tag}>`;
}

/** DealsList mounted in the fake browser; `html()` is the live DOM, serialised. */
function mountList(cards: DealCardView[], builtOn: string) {
  const doc = new FakeDocument();
  vi.stubGlobal('window', doc.defaultView);
  vi.stubGlobal('document', doc);
  vi.stubGlobal('self', globalThis); // next/link's idle-callback fallback calls self.setTimeout
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const container = doc.body.appendChild(doc.createElement('div'));
  const root = createRoot(container as unknown as Element);
  act(() => {
    root.render(<DealsList cards={cards} builtOn={builtOn} labels={LABELS} dateLocale="en-US" />);
  });
  return {
    html: () => outerHtml(container),
    show(visibility: string) {
      act(() => {
        doc.visibilityState = visibility;
        doc.dispatchEvent(new Event('visibilitychange'));
      });
    },
    unmount: () =>
      act(() => {
        root.unmount();
      }),
  };
}

describe("DealsList in the reader's browser: a page left open across 00:00 UTC (fake timers)", () => {
  const LAST_DAY = '2032-06-10';
  const cards = (): DealCardView[] => [
    { promo: offer('alpha-last', { code: 'SAMPLE10', expires: LAST_DAY }), products: [ALPHA] },
    { promo: offer('beta-live', { code: 'SAMPLE20' }), products: [BETA] },
  ];
  let mounted: ReturnType<typeof mountList> | null = null;
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  });
  afterEach(() => {
    mounted?.unmount();
    mounted = null;
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  /** The ended card lost its code, copy button, commission sentence and buy link; the live card kept them. */
  const expectAlphaEnded = (html: string) => {
    expect(html).not.toContain('SAMPLE10');
    expect(html).not.toContain(buyHref(ALPHA));
    expect(count(text(html), en.deals.copy)).toBe(1);
    expect(count(html, en.deals.linkDisclosure)).toBe(1);
    expect(text(html)).toContain('This offer ended on June 10, 2032. The code is no longer shown.');
    expect(text(html)).toContain('Read our review of Alpha Labs alpha-focus');
    expect(html).toContain('SAMPLE20');
    expect(html).toContain(buyHref(BETA));
  };

  it('an offer read on its expiry day loses its code, copy button and buy link at the next 00:00 UTC, without a reload', () => {
    vi.setSystemTime(new Date(`${LAST_DAY}T23:59:00Z`));
    mounted = mountList(cards(), '2032-06-01');
    const before = mounted.html();
    expect(before).toContain('SAMPLE10');
    expect(before).toContain(buyHref(ALPHA));
    expect(count(text(before), en.deals.copy)).toBe(2);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expectAlphaEnded(mounted.html());
  });

  it('a page shown again after 00:00 UTC passed with timers held (device asleep) drops the ended offer at once', () => {
    vi.setSystemTime(new Date(`${LAST_DAY}T22:00:00Z`));
    mounted = mountList(cards(), '2032-06-01');
    expect(mounted.html()).toContain('SAMPLE10');
    vi.setSystemTime(new Date('2032-06-11T07:00:00Z')); // the clock moved, no timer fired
    mounted.show('hidden');
    expect(mounted.html()).toContain('SAMPLE10');
    mounted.show('visible');
    expectAlphaEnded(mounted.html());
  });
});
