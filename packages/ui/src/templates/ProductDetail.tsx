'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { Tabs, TabPanel } from '../primitives/Tabs';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';
import type { TabId } from './product-detail/constants';
import { OverviewTab } from './product-detail/OverviewTab';
import { DosingTab } from './product-detail/DosingTab';
import { PillarsTab } from './product-detail/PillarsTab';
import { ReviewsTab } from './product-detail/ReviewsTab';
import { PricingTab } from './product-detail/PricingTab';

export interface ProductDetailProps {
  product: Product;
  /** Up to 3 ranked alternatives surfaced at the bottom of every tab. */
  alternatives: Product[];
  siteUrl: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
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
}: ProductDetailProps) {
  const [tab, setTab] = useState<TabId>('overview');

  const formattedDate = (p.updatedAt ? new Date(p.updatedAt) : new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const adequateCount = p.ingredientDosages.filter((d) => d.adequatelyDosed).length;
  const totalDoses = p.ingredientDosages.length;
  const allAdequate = totalDoses > 0 && adequateCount === totalDoses;

  const tabItems: Array<{ id: TabId; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'dosing', label: 'Dosing audit' },
    { id: 'pillars', label: 'Pillars' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const scoreColor =
    p.score >= 8.5 ? 'text-ds-good' : p.score >= 7.5 ? 'text-ds-warn-ink' : 'text-ds-bad';

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={[
        { label: 'Best of', href: '/best-nootropics' },
        { label: p.name },
      ]}
      searchItems={searchItems}
      uiStrings={uiStrings}
    >
      <div className="px-4 sm:px-7 pt-6 pb-10">
        {/* Header card */}
        <Card padding={24} className="mb-4">
          <div className="flex gap-[22px] items-start flex-wrap">
            <div
              className="w-[72px] h-[72px] bg-ds-ink rounded-[16px] grid place-items-center text-white font-extrabold text-[28px] flex-shrink-0"
              aria-hidden="true"
            >
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-[6px] mb-2">
                {p.editorChoice && <Chip tone="accent">★ Editor&apos;s pick</Chip>}
                {p.caffeineFree ? <Chip tone="good">Caffeine-free</Chip> : <Chip tone="warn">Caffeine</Chip>}
                {allAdequate && <Chip tone="good">All clinical doses</Chip>}
                {p.handsOnTested && <Chip tone="accent">Hands-on tested</Chip>}
              </div>
              <h1 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.025em] leading-[1.05] m-0 text-ds-ink">
                {p.name}
              </h1>
              <div className="text-ds-muted text-[14px] mt-1">
                By {p.brand} · daily nootropic capsule · {p.servingsPerContainer} ct ·{' '}
                <span className="text-ds-muted">Updated {formattedDate}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">
                Our score
              </div>
              <div className={`text-[48px] font-bold tracking-[-0.03em] leading-none ${scoreColor} ds-tabular`}>
                {p.score.toFixed(1)}
              </div>
              <div className="text-[11px] text-ds-muted">of 10.0</div>
            </div>
          </div>

          <div className="mt-[22px] pt-[18px] border-t border-ds-border grid gap-[18px] items-center grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(5,1fr)_auto]">
            {[
              ['Price', p.priceMonthlyUSD ? `$${p.priceMonthlyUSD}/mo` : '—'],
              ['Caps', `${p.capsulesPerServing}/day`],
              ['MBG', `${p.moneyBackDays} days`],
              [
                'Trustpilot',
                p.trustpilotScore === null
                  ? 'N/A'
                  : `${p.trustpilotScore} (${(p.trustpilotCount ?? 0).toLocaleString()})`,
              ],
              ['Our cut', p.commissionRate],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[11px] uppercase tracking-[0.1em] text-ds-muted">{k}</div>
                <div
                  className={`text-[14px] font-semibold mt-[2px] ${
                    k === 'Our cut' ? 'text-ds-accent' : 'text-ds-ink'
                  }`}
                >
                  {v}
                </div>
              </div>
            ))}
            <TrackedAffiliateLink
              product={p}
              position={1}
              surface="review"
              className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white border-0 px-[18px] py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              Visit brand →
            </TrackedAffiliateLink>
          </div>
        </Card>

        {/* Tab bar */}
        <Tabs<TabId>
          items={tabItems}
          value={tab}
          onChange={setTab}
          ariaLabel="Product sections"
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
        <TabPanel idPrefix="product" id="pricing" hidden={tab !== 'pricing'} className="mt-5">
          <PricingTab product={p} />
        </TabPanel>

        {/* Always-shown alternatives rail */}
        {alternatives.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[18px] font-bold tracking-[-0.01em] m-0 mb-4 text-ds-ink">
              Similar alternatives
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {alternatives.slice(0, 3).map((alt) => (
                <Link
                  key={alt.slug}
                  href={`/${alt.slug}`}
                  className="block border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border bg-ds-card focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  <div className="font-semibold text-ds-ink text-[14px] mb-1">{alt.name}</div>
                  <div className="text-[12px] text-ds-muted mb-2">{alt.brand}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-ds-good-ink font-bold text-[13px] ds-tabular">{alt.score}/10</span>
                    {alt.priceMonthlyUSD && (
                      <span className="text-[12px] text-ds-muted ds-tabular">${alt.priceMonthlyUSD}/mo</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
