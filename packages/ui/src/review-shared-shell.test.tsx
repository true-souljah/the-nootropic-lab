import { describe, test, expect, vi, afterEach } from 'vitest';
import { isValidElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { allProductsUS, earnsCommission, getStrings, purchaseUrl } from '@nootropic/data';
import type { Product, RegionalRegionCode, SearchItem, UIStrings } from '@nootropic/data';
import ProductDetail from './templates/ProductDetail';
import { FPHeader, navFromStrings } from './public-chrome/FPHeader';
import { MobileMenu, type MobileMenuProps } from './public-chrome/MobileMenu';

// Design decision 16 (2026-10-19): product review pages leave the AppShell
// sidebar layout for the shared editorial chrome of listicles, guides and
// ingredient pages (PublicShell: skip link → FPHeader → main → FPFooter),
// with the review's own disclosure strip first in <main> and a
// Home / Best Nootropics / <product> breadcrumb. Phones get a menu button on
// FPHeader (MobileMenu); its dialog lists the header's links and the footer's
// best-by-goal and by-region columns for the host.

const en = getStrings('en');
const SEARCH_ITEMS: SearchItem[] = [{ title: 'Mind Lab Pro', href: '/mind-lab-pro-review/', type: 'product' }];

afterEach(() => {
  vi.unstubAllEnvs();
});

function render(product: Product, region: RegionalRegionCode = 'us', uiStrings: UIStrings = en): string {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  return renderToStaticMarkup(
    <ProductDetail product={product} alternatives={[]} siteUrl="https://thenootropiclab.com" searchItems={SEARCH_ITEMS} uiStrings={uiStrings} />,
  );
}

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

/** The inner HTML of `<main id="main-content">`. */
function mainOf(html: string): string {
  const m = /<main id="main-content"[^>]*>([\s\S]*)<\/main>/.exec(html);
  expect(m, '<main id="main-content"> rendered').not.toBeNull();
  return m![1];
}

const bySlug = (slug: string) => allProductsUS.find((p) => p.slug === slug)!;
const mlp = bySlug('mind-lab-pro-review');
const onnit = bySlug('onnit-alpha-brain-review');
const discontinued = bySlug('performance-lab-mind-review');

describe('review page — shared editorial chrome', () => {
  test('fixtures: a linked commission product, a no-commission product, a discontinued one', () => {
    expect(earnsCommission(mlp) && purchaseUrl(mlp) !== null && !mlp.discontinued).toBe(true);
    expect(earnsCommission(onnit)).toBe(false);
    expect(discontinued.discontinued).toBeTruthy();
  });

  test.each([
    ['commission product with its buy link', mlp, 'page'],
    ['no-commission product', onnit, 'product'],
    ['discontinued product (no buy link)', discontinued, 'site'],
  ] as const)('%s: exactly one disclosure strip, first in <main>, scope "%s"', (_label, product, scope) => {
    const html = render(product);
    expect(count(html, 'data-disclosure-scope=')).toBe(1);
    expect(mainOf(html)).toMatch(new RegExp(`^<div role="note" data-disclosure-scope="${scope}"`));
  });

  test('skip link → banner header → main → contentinfo footer, once each', () => {
    const html = render(mlp);
    expect(count(html, 'class="ds-skip-link"')).toBe(1);
    expect(count(html, 'href="#main-content"')).toBe(1);
    expect(count(html, '<header role="banner"')).toBe(1);
    expect(count(html, '<main id="main-content"')).toBe(1);
    expect(count(html, '<footer role="contentinfo"')).toBe(1);
    const order = ['class="ds-skip-link"', '<header role="banner"', '<main id="main-content"', '<footer role="contentinfo"'].map((s) =>
      html.indexOf(s),
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));
    // The search trigger and the primary nav landmark are the header's.
    const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
    expect(header).toContain(`aria-label="${en.nav.primaryLandmark}"`);
    expect(header).toContain(`<span>${en.nav.search}</span><span class="ds-sr-only"> (Command+K)</span>`);
  });

  test('breadcrumb in <main>: Home / Best Nootropics / the product', () => {
    const main = mainOf(render(mlp));
    const crumbs = /<nav aria-label="([^"]*)"[^>]*>([\s\S]*?)<\/nav>/.exec(main);
    expect(crumbs?.[1]).toBe(en.breadcrumb.ariaLabel);
    expect(crumbs![2]).toMatch(new RegExp(`<a [^>]*href="/"[^>]*>${en.breadcrumb.home}</a>`));
    // next/link drops the trailing slash outside a trailingSlash app build.
    expect(crumbs![2]).toMatch(new RegExp(`<a [^>]*href="/best-nootropics/?"[^>]*>${en.nav.bestNootropics}</a>`));
    expect(crumbs![2]).toMatch(new RegExp(`<li aria-current="page"[^>]*>${mlp.name}</li>`));
    // Content is held to the shared 1200px column.
    expect(main).toContain('class="max-w-[1200px] mx-auto');
  });

  test('no AppShell output: no sidebar rail, its 240px column, drawer or "Build my stack"', () => {
    const html = render(mlp);
    expect(html).not.toContain('lg:grid-cols-[240px_1fr]');
    expect(html).not.toContain('appshell-mobile-drawer');
    for (const label of [en.nav.buildMyStack, en.nav.sidebar.browse, en.nav.sidebar.discover, en.nav.sidebar.bestOf2026, en.nav.sidebar.submitTip]) {
      expect(html).not.toContain(`>${label}<`);
    }
  });

  test('the menu button (phones and tablets) is closed and controls an empty <dialog>; no heading before the h1', () => {
    const html = render(mlp);
    const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
    const button = /<button[^>]*aria-controls="fp-mobile-menu"[^>]*>/.exec(header)?.[0];
    expect(button, 'menu button in the header').toBeDefined();
    expect(button).toContain(`aria-label="${en.nav.openMenu}"`);
    expect(button).toContain('aria-expanded="false"');
    // Shown below lg: (1024px) since 2026-10-20: the full header row does not fit at 768.
    expect(button).toMatch(/class="lg:hidden /);
    expect(header).toMatch(new RegExp(`<dialog id="fp-mobile-menu" aria-label="${en.nav.drawerLabel}"[^>]*></dialog>`));
    // The menu's section headings render only while it is open (document outline starts at the h1).
    expect(/<h([1-6])\b/.exec(html)?.[1]).toBe('1');
  });

  test('no comparator button in the header (canvas); the footer links the comparator', () => {
    const html = render(mlp);
    const header = html.slice(html.indexOf('<header'), html.indexOf('</header>'));
    // next/link drops the trailing slash outside a trailingSlash app build.
    expect(header).not.toMatch(/href="\/nootropic-comparison\/?"/);
    const footer = html.slice(html.indexOf('<footer'));
    expect(footer).toMatch(new RegExp(`<a [^>]*href="/nootropic-comparison/?"[^>]*>${en.footer.headToHead.allComparisons}</a>`));
    // The header names the edition instead (fp-header-nav.test.ts covers every host).
    expect(header).toContain(`>${en.footer.byRegion.us}</span>`);
  });

  test('footer: Tools column (5 link columns) on the US host, the 4-column grid elsewhere', () => {
    const us = render(mlp, 'us');
    expect(us).toContain('id="footer-col-tools"');
    expect(us).toMatch(/href="\/dose-calculator\/?"/);
    expect(us).toMatch(/href="\/shortlist\/?"/);
    expect(count(us, '<nav aria-labelledby="footer-col-')).toBe(5);
    expect(us).toContain('lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1fr]');

    // The footer depends on the build region only.
    const jp = render(mlp, 'jp');
    expect(jp).not.toContain('id="footer-col-tools"');
    expect(jp).not.toMatch(/href="\/dose-calculator\/?"/);
    expect(count(jp, '<nav aria-labelledby="footer-col-')).toBe(4);
    expect(jp).toContain('md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]');
  });
});

/** The MobileMenu element FPHeader (a server component) renders, found in its element tree. */
function menuProps(region: RegionalRegionCode, strings?: UIStrings): MobileMenuProps {
  vi.stubEnv('NEXT_PUBLIC_REGION', region);
  const found: MobileMenuProps[] = [];
  const walk = (node: ReactNode): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!isValidElement(node)) return;
    if (node.type === MobileMenu) found.push(node.props as MobileMenuProps);
    walk((node.props as { children?: ReactNode }).children);
  };
  walk(FPHeader({ strings, searchItems: SEARCH_ITEMS }));
  expect(found).toHaveLength(1);
  return found[0];
}

describe('FPHeader phone menu — the data FPHeader passes to MobileMenu', () => {
  test('labels and primary links come from the bundle (es)', () => {
    const es = getStrings('es');
    const props = menuProps('latam', es);
    expect(props.labels).toEqual({
      openMenu: es.nav.openMenu,
      closeMenu: es.nav.closeMenu,
      drawerLabel: es.nav.drawerLabel,
      primaryLandmark: es.nav.primaryLandmark,
    });
    expect(props.nav).toEqual(navFromStrings(es));
    expect(props.brandLabel).toBe('Nootropic Lab');
  });

  test('us: best-by-goal (all 7 goals) then the 8 regions', () => {
    const props = menuProps('us', en);
    expect(props.sections.map((s) => s.id)).toEqual(['footer-col-best-by-goal', 'footer-col-by-region']);
    expect(props.sections[0].heading).toBe(en.footer.bestByGoal.heading);
    expect(props.sections[0].links).toHaveLength(7);
    expect(props.sections[1].heading).toBe(en.footer.byRegion.heading);
    expect(props.sections[1].links).toHaveLength(8);
  });

  test('jp (English chrome): only the goal pages the JP host has, the 8 regions', () => {
    const props = menuProps('jp', en);
    expect(props.sections[0].links.map((l) => l.href)).toEqual([
      '/best-nootropics-for-focus/',
      '/best-nootropics-for-memory/',
      '/best-nootropics-for-aging/',
      '/best-nootropics-for-studying/',
    ]);
    expect(props.sections[1].links).toHaveLength(8);
  });

  test('English fallbacks without a bundle; the region is still required (fails closed)', () => {
    const props = menuProps('us');
    expect(props.labels).toEqual({ openMenu: en.nav.openMenu, closeMenu: en.nav.closeMenu, drawerLabel: en.nav.drawerLabel, primaryLandmark: en.nav.primaryLandmark });
    expect(props.sections.map((s) => s.heading)).toEqual([en.footer.bestByGoal.heading, en.footer.byRegion.heading]);
    vi.stubEnv('NEXT_PUBLIC_REGION', '');
    expect(() => FPHeader({ strings: en })).toThrow(/NEXT_PUBLIC_REGION/);
  });
});
