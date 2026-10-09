'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from './AppShell';
import { FPDisclosure } from '../public-chrome/FPDisclosure';
import { FPTrustNote } from '../public-chrome/FPTrustNote';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { Tabs, TabPanel } from '../primitives/Tabs';
import { ProductThumb } from '../primitives/ProductThumb';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import NoPurchaseLinkNotice from '../NoPurchaseLinkNotice';
import { productForm, servingAmount, servingUnit, guaranteeDays, dosingTally } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';
import type { TabId } from './product-detail/constants';
import { OverviewTab } from './product-detail/OverviewTab';
import { DosingTab } from './product-detail/DosingTab';
import { PillarsTab } from './product-detail/PillarsTab';
import { ReviewsTab } from './product-detail/ReviewsTab';
import { PricingTab } from './product-detail/PricingTab';
import RegionalBuying from '../RegionalBuying';
import { formatLocalPrice } from '../RegionalAvailability';
import type { RegionalBuyingProps } from '../RegionalBuying';
import { scoreTier } from './listicleRanking';

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
  /** "Buying in <region>" block: local price, licence status, channels, local guides. */
  regional?: Omit<RegionalBuyingProps, 'id'>;
}

/**
 * ProductDetail — in-app product review surface with 5 tabs
 * (Overview, Dosing audit, Pillars, Reviews, Pricing). Uses AppShell
 * with persistent sidebar. The header card + tab bar + alternatives
 * rail are owned here; each tab body lives in `./product-detail/<Tab>Tab.tsx`
 * for readability.
 */
export default function ProductDetail({
  product: p,
  alternatives,
  siteUrl: _siteUrl,
  searchItems,
  uiStrings,
  healthDisclaimer,
  regional,
}: ProductDetailProps) {
  const [tab, setTab] = useState<TabId>('overview');

  const pd = uiStrings.productDetail;
  // Meta-line pack count in the product's own units (servings × units per
  // serving), e.g. "60 caps" / "120 錠" / "20 shots"; omitted when unknown.
  const packUnits =
    p.servingsPerContainer > 0 && p.capsulesPerServing > 0
      ? p.servingsPerContainer * p.capsulesPerServing
      : 0;
  // Inline filter (not activeProducts from @nootropic/data): this is a client
  // component and a value import from the data package would ship every
  // catalogue JSON to the browser.
  const recommendable = alternatives.filter((alt) => alt.discontinued == null);

  // Record date line: "Last verified: <verifiedAt>" when the record carries a
  // verification date, otherwise "Updated: <updatedAt>"; nothing when neither
  // exists (no build-date fallback). Records store calendar dates (YYYY-MM-DD);
  // anchor at UTC midnight and format in UTC so the day never shifts with TZ.
  const verifiedAt = p.verifiedAt;
  const recordDateISO = (verifiedAt ?? p.updatedAt)?.slice(0, 10);
  const recordDateLabel = verifiedAt ? pd.meta.lastVerified : pd.meta.updated;
  const recordDate = recordDateISO ? new Date(`${recordDateISO}T00:00:00Z`) : null;
  const recordDateDisplay =
    recordDate && !Number.isNaN(recordDate.getTime())
      ? recordDate.toLocaleDateString(pd.dateLocale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        })
      : null;

  // "All clinical doses" = every dosing unit (row with a reference dose, a
  // combined anchor once) proven adequate — the units the dosing pillar scores.
  const dosing = dosingTally(p);
  const allAdequate = dosing.total > 0 && dosing.adequate === dosing.total;

  // A discontinued product keeps its review page but loses every buy surface:
  // no affiliate CTAs, no price stat, no Pricing tab, no "Buying in" block.
  const discontinued = p.discontinued;

  const tabItems: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: pd.tabs.overview },
    { id: 'dosing', label: pd.tabs.dosing },
    { id: 'pillars', label: pd.tabs.pillars },
    { id: 'reviews', label: pd.tabs.reviews },
    ...(discontinued ? [] : [{ id: 'pricing' as const, label: pd.tabs.pricing }]),
  ];

  const priceStat: [string, string, boolean] = [
    pd.stats.price,
    regional?.data.price ? `${formatLocalPrice(regional.data.price.amount, regional.data.price.currency, regional.data.price.locale)}/${pd.stats.monthUnit}` : p.priceMonthlyUSD ? `$${p.priceMonthlyUSD}/${pd.stats.monthUnit}` : '—',
    false,
  ];

  const scoreColor = { good: 'text-ds-good', warn: 'text-ds-warn-ink', bad: 'text-ds-bad' }[scoreTier(p.score)];

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={[
        { label: 'Best of', href: '/best-nootropics/' },
        { label: p.name },
      ]}
      searchItems={searchItems}
      uiStrings={uiStrings}
    >
      <FPDisclosure methodologyHref="/methodology/" strings={uiStrings.disclosure} />
      <div className="px-4 sm:px-7 pt-6 pb-10">
        {discontinued && (
          <aside
            role="note"
            aria-labelledby="product-discontinued-heading"
            className="bg-ds-warn-soft border-l-4 border-ds-warn rounded-r-[8px] p-4 mb-4 text-[14px] text-ds-warn-ink"
          >
            <strong id="product-discontinued-heading" className="block mb-1">
              {pd.discontinued.heading}
            </strong>
            <p className="m-0">{discontinued.note}</p>
            {discontinued.successorSlug && (
              <p className="m-0 mt-2">
                <Link
                  href={`/${discontinued.successorSlug}/`}
                  className="underline font-semibold text-ds-warn-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  {pd.discontinued.successorLink} →
                </Link>
              </p>
            )}
          </aside>
        )}

        {/* No purchase link in this edition (Product.noPurchaseLink): the full
            notice here; the CTA slots below show the short label. */}
        <NoPurchaseLinkNotice product={p} strings={uiStrings.noPurchaseLink} id="no-purchase-link" className="mb-4" />

        {/* Header card */}
        <Card padding={24} className="mb-4">
          <div className="flex gap-[22px] items-start flex-wrap">
            <ProductThumb product={p} size={72} variant="lg" eager />
            <div className="flex-1 min-w-0">
              <div
                role="group"
                aria-label={pd.chipGroupLabel}
                className="flex flex-wrap gap-[6px] mb-2"
              >
                {p.editorChoice && (
                  <Chip tone="accent">
                    <span aria-hidden="true">★ </span>
                    {pd.chips.editorPick}
                  </Chip>
                )}
                {p.caffeineFree ? (
                  <Chip tone="good">{pd.chips.caffeineFree}</Chip>
                ) : (
                  <Chip tone="warn">{pd.chips.hasCaffeine}</Chip>
                )}
                {allAdequate && <Chip tone="good">{pd.chips.allClinicalDoses}</Chip>}
                {p.npnStatus?.status === 'licensed' && (
                  <Chip tone="good">
                    {pd.chips.npnLicensed}
                    {p.npnStatus.npn ? ` ${p.npnStatus.npn}` : ''}
                  </Chip>
                )}
                {p.npnStatus?.status === 'pip' && (
                  <Chip tone="warn">{pd.chips.personalImport}</Chip>
                )}
                {p.ffcStatus?.notified === true && (
                  <Chip tone="good">{pd.chips.ffcNotified}</Chip>
                )}
                {p.austl && (
                  <Chip tone="good">
                    {pd.chips.austListed} {p.austl}
                  </Chip>
                )}
                {p.halalCertified === true && (
                  <Chip tone="good">{pd.chips.halalCertified}</Chip>
                )}
              </div>
              <h1 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.025em] leading-[1.05] m-0 text-ds-ink">
                {p.name}
              </h1>
              <div className="text-ds-muted text-[14px] mt-1">
                {pd.meta.by} {p.brand} · {pd.meta.productDescriptorByForm[productForm(p)]}
                {packUnits > 0 && ` · ${packUnits} ${servingUnit(p, uiStrings, packUnits)}`}
              </div>
              <div className="text-ds-muted text-[13px] mt-1">
                <span className="text-ds-ink font-semibold">{pd.meta.reviewedBy}</span>
                {recordDateDisplay && (
                  <>
                    {' · '}
                    <span data-record-date={verifiedAt ? 'verified' : 'updated'}>
                      {recordDateLabel} <time dateTime={recordDateISO}>{recordDateDisplay}</time>
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">
                {pd.score.label}
              </div>
              <div className={`text-[48px] font-bold tracking-[-0.03em] leading-none ${scoreColor} ds-tabular`}>
                {p.score.toFixed(1)}
              </div>
              <div className="text-[11px] text-ds-muted">{pd.score.outOf10}</div>
            </div>
          </div>

          {!discontinued && <FPTrustNote strings={uiStrings.disclosure} className="mt-[18px]" />}

          <div className="mt-[18px] pt-[18px] border-t border-ds-border grid gap-[18px] items-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(5,1fr)_auto]">
            {[
              ...(discontinued ? [] : [priceStat]),
              [pd.stats.dailyServing, servingAmount(p, uiStrings), false],
              [pd.stats.moneyBack, guaranteeDays(p.moneyBackDays, (d) => `${d} ${pd.stats.days}`), false],
              [
                pd.stats.trustpilot,
                p.trustpilotScore === null
                  ? pd.stats.notAvailable
                  : `${p.trustpilotScore} (${(p.trustpilotCount ?? 0).toLocaleString(pd.dateLocale)})`,
                false,
              ],
              [pd.stats.ourCut, p.commissionRate, true],
            ].map(([k, v, isOurCut]) => (
              <div key={k as string}>
                <div className="text-[11px] uppercase tracking-[0.1em] text-ds-muted">{k}</div>
                <div
                  className={`text-[14px] font-semibold mt-[2px] ${
                    isOurCut ? 'text-ds-accent' : 'text-ds-ink'
                  }`}
                >
                  {v}
                </div>
              </div>
            ))}
            {!discontinued && (
              <TrackedAffiliateLink
                product={p}
                position={1}
                surface="review"
                className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white border-0 px-[18px] py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                noticeStrings={uiStrings.noPurchaseLink}
                noticeVariant="compact"
              >
                {pd.visitBrand}
              </TrackedAffiliateLink>
            )}
          </div>
        </Card>

        {/* Tab bar */}
        <Tabs<TabId>
          items={tabItems}
          value={tab}
          onChange={setTab}
          ariaLabel={pd.tabs.ariaLabel}
          idPrefix="product"
        />

        {/* All 5 tab panels rendered statically with `hidden`; each tab body
            lives in its own file under ./product-detail/ for readability. */}
        <TabPanel idPrefix="product" id="overview" hidden={tab !== 'overview'} className="mt-5">
          <OverviewTab product={p} />
        </TabPanel>
        <TabPanel idPrefix="product" id="dosing" hidden={tab !== 'dosing'} className="mt-5">
          <DosingTab product={p} />
        </TabPanel>
        <TabPanel idPrefix="product" id="pillars" hidden={tab !== 'pillars'} className="mt-5">
          <PillarsTab product={p} />
        </TabPanel>
        <TabPanel idPrefix="product" id="reviews" hidden={tab !== 'reviews'} className="mt-5">
          <ReviewsTab product={p} />
        </TabPanel>
        {!discontinued && (
          <TabPanel idPrefix="product" id="pricing" hidden={tab !== 'pricing'} className="mt-5">
            <PricingTab product={p} disclosure={uiStrings.disclosure} strings={pd} noticeStrings={uiStrings.noPurchaseLink} />
          </TabPanel>
        )}

        {regional && !discontinued && <RegionalBuying {...regional} id="regional-buying" />}

        {/* Always-shown alternatives rail (never recommends a discontinued product) */}
        {recommendable.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[18px] font-bold tracking-[-0.01em] m-0 mb-4 text-ds-ink">
              {pd.alternatives}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {recommendable.slice(0, 3).map((alt) => (
                <Link
                  key={alt.slug}
                  href={`/${alt.slug}/`}
                  className="block border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border bg-ds-card focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  <div className="font-semibold text-ds-ink text-[14px] mb-1">{alt.name}</div>
                  <div className="text-[12px] text-ds-muted mb-2">{alt.brand}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-ds-good-ink font-bold text-[13px] ds-tabular">{`${alt.score}/10`}</span>
                    {alt.priceMonthlyUSD && (
                      <span className="text-[12px] text-ds-muted ds-tabular">{`$${alt.priceMonthlyUSD}/${pd.stats.monthUnit}`}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regional YMYL disclaimer (Health Canada / FDA / EFSA / etc.).
            Passed via the healthDisclaimer prop; render only when supplied. */}
        {healthDisclaimer && (
          <section
            aria-labelledby="product-health-disclaimer-heading"
            className="mt-10 pt-6 border-t border-ds-border"
          >
            <h2
              id="product-health-disclaimer-heading"
              className="text-[13px] uppercase tracking-[0.1em] text-ds-muted font-semibold m-0 mb-2"
            >
              {pd.healthDisclaimerHeading}
            </h2>
            <p className="text-[12px] text-ds-ink leading-relaxed">{healthDisclaimer}</p>
          </section>
        )}
      </div>
    </AppShell>
  );
}
