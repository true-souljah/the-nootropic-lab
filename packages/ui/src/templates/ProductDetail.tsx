import Link from 'next/link';
import PublicShell from './PublicShell';
import { FPDisclosure } from '../public-chrome/FPDisclosure';
import { ProductDetailBody } from './ProductDetailBody';
import { linksAmazonAssociates, reviewDisclosureScope } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';
import type { RegionalBuyingProps } from '../RegionalBuying';

export interface ProductDetailProps {
  product: Product;
  /** Up to 3 ranked alternatives surfaced at the bottom of every tab. */
  alternatives: Product[];
  siteUrl: string;
  searchItems?: SearchItem[];
  /**
   * Locale UIStrings bundle. Required — PR-Q12 (#76) removed the
   * `?? getStrings('en')` defensive fallback because it produced a
   * latent WCAG 3.1.2 leak: a future caller could silently render
   * English content under a non-EN `<html lang>`. Pass the bundle
   * from `buildRegionSearchContext(productsX, locale, region)` at the page.
   */
  uiStrings: UIStrings;
  /**
   * YMYL regulatory disclaimer rendered at the bottom of the page.
   * Pass `getRegionalHealthDisclaimer(market)` from @nootropic/data;
   * the text varies by region (Health Canada framing for CA, FDA
   * framing for US, EFSA for EU, etc.). Omit on legacy pages — the
   * disclaimer section will simply not render.
   */
  healthDisclaimer?: string;
  /** "Buying in <region>" block: local price, licence status, channels, local guides (labels come from `uiStrings`). */
  regional?: Omit<RegionalBuyingProps, 'id' | 'strings'>;
  /**
   * Head-to-head pages on this host that compare this product. Pass
   * `headToHeadFor(slug, region)` from @nootropic/data at the page (server
   * side); the section is not rendered when the list is empty.
   */
  headToHead?: { label: string; href: string }[];
}

/**
 * ProductDetail — the product review page. Server component: the shared
 * editorial chrome (PublicShell: skip link, FPHeader, FPFooter, as on
 * listicles, guides and ingredient pages), the review's own disclosure strip
 * and a Home / Best Nootropics / <product> breadcrumb around the interactive
 * ProductDetailBody (header card, tabs, alternatives).
 *
 * The strip is the review's own (reviewDisclosureScope: "page", "product"
 * or "site"), so PublicShell's strip, which only knows "page" and "site", is
 * off: a page carries exactly one (check-built-disclosure.ts).
 */
export default function ProductDetail({
  product: p,
  alternatives,
  siteUrl: _siteUrl,
  searchItems,
  uiStrings,
  healthDisclaimer,
  regional,
  headToHead,
}: ProductDetailProps) {
  // A discontinued product loses every buy surface, so it links nothing.
  const amazonAssociate = linksAmazonAssociates(p.discontinued ? [] : [p]);

  return (
    <PublicShell hideDisclosure mainBackground="bg" searchItems={searchItems} uiStrings={uiStrings}>
      {/* The commission sentence only when the page renders the product's buy
          link and we earn a commission on it; the no-commission line for a
          product without an affiliate deal ("0%"); the site-level line
          otherwise (discontinued or no purchase link here). Amazon's
          Associates statement when the page renders an Associates buy link. */}
      <FPDisclosure
        methodologyHref="/methodology/"
        strings={uiStrings.disclosure}
        scope={reviewDisclosureScope(p)}
        amazonAssociate={amazonAssociate}
        space={uiStrings.typography.space}
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-10">
        <nav aria-label={uiStrings.breadcrumb.ariaLabel} className="text-[12.5px] text-ds-muted mb-[18px]">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            <li>
              <Link href="/" className="hover:text-ds-ink">{uiStrings.breadcrumb.home}</Link>
            </li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li>
              <Link href="/best-nootropics/" className="hover:text-ds-ink">{uiStrings.nav.bestNootropics}</Link>
            </li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li aria-current="page" className="text-ds-ink font-medium">{p.name}</li>
          </ol>
        </nav>
        <ProductDetailBody
          product={p}
          alternatives={alternatives}
          uiStrings={uiStrings}
          healthDisclaimer={healthDisclaimer}
          regional={regional}
          headToHead={headToHead}
        />
      </div>
    </PublicShell>
  );
}
