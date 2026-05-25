'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { Bar } from '../primitives/Bar';
import { Tabs, TabPanel } from '../primitives/Tabs';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';

export interface ProductDetailProps {
  product: Product;
  /** Up to 3 ranked alternatives surfaced at the bottom of every tab. */
  alternatives: Product[];
  siteUrl: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

type TabId = 'overview' | 'dosing' | 'pillars' | 'reviews' | 'pricing';

const PILLAR_LABELS: Record<string, string> = {
  ingredients: 'Ingredient quality',
  dosing: 'Dosing vs. clinical evidence',
  transparency: 'Formula transparency',
  value: 'Value for money',
  trust: 'Brand trust',
};

const PILLAR_WEIGHTS: Record<string, number> = {
  ingredients: 0.25,
  dosing: 0.30,
  transparency: 0.20,
  value: 0.15,
  trust: 0.10,
};

const PILLAR_RATIONALE: Record<string, string> = {
  ingredients: 'Number and quality of evidence-graded ingredients. Trademarked extracts and standardized actives raise this score.',
  dosing: 'How many ingredients meet their clinical-trial dose. Underdosing flagship actives is the biggest score deduction.',
  transparency: 'Full disclosure of every ingredient at its exact dose. Proprietary blends are scored as opaque.',
  value: 'Cost per month relative to per-serving clinical doses delivered. Cheaper products with underdoses score lower.',
  trust: 'Brand reputation, third-party testing, refund track record, and Trustpilot signal across multiple years.',
};

/**
 * ProductDetail — in-app product review surface with 5 tabs
 * (Overview, Dosing audit, Pillars, Reviews, Pricing). Uses AppShell
 * with persistent sidebar. Preserves the legacy review's content
 * (whatItIs, howItWorks, whatToExpect, ingredientDosages, scoreBreakdown,
 * pros/cons, heroIngredients, alternatives) while applying Phase 1+3
 * visual tokens. No medical-reviewer byline (Phase 5).
 */
export default function ProductDetail({
  product: p,
  alternatives,
  siteUrl,
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
                `${p.trustpilotScore} (${p.trustpilotCount.toLocaleString()})`,
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

        {/* Tab 1 — Overview */}
        <TabPanel idPrefix="product" id="overview" hidden={tab !== 'overview'} className="mt-5">
          <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-4">
              <Card variant="subdued" padding={22}>
                <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-2">
                  Verdict
                </div>
                <h2 className="text-[22px] font-bold tracking-[-0.02em] m-0 mb-3 text-ds-ink">
                  {p.score >= 8.5 ? (
                    <>
                      <span className="text-ds-good">{p.name}</span> is recommended.
                    </>
                  ) : p.score >= 7.5 ? (
                    <>
                      <span className="text-ds-warn-ink">{p.name}</span> is worth a look.
                    </>
                  ) : (
                    <>
                      <span className="text-ds-bad">{p.name}</span> falls short.
                    </>
                  )}
                </h2>
                <p className="text-[14.5px] text-ds-ink-soft m-0 leading-[1.65]">{p.summary}</p>
              </Card>

              <Card padding={22}>
                <h3 className="text-[16px] font-semibold m-0 mb-2 text-ds-ink">What it does</h3>
                <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.whatItIs}</p>
              </Card>

              <Card padding={22}>
                <h3 className="text-[16px] font-semibold m-0 mb-2 text-ds-ink">How it works</h3>
                <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.howItWorks}</p>
              </Card>

              <Card padding={22}>
                <h3 className="text-[16px] font-semibold m-0 mb-3 text-ds-ink">What to expect</h3>
                <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.whatToExpect}</p>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              <Card padding={20}>
                <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">Hero ingredients</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {p.heroIngredients.slice(0, 6).map((name) => {
                    const dose = p.ingredientDosages.find(
                      (d) => d.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(d.name.toLowerCase())
                    );
                    return (
                      <li
                        key={name}
                        className="flex justify-between gap-3 py-[6px] border-b border-ds-border last:border-b-0"
                      >
                        <span className="text-[13.5px] font-semibold text-ds-ink">{name}</span>
                        {dose && (
                          <span className="text-[12.5px] font-bold text-ds-accent ds-tabular">
                            {dose.doseInProduct}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>

              <Card variant="subdued" padding={20}>
                <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">Who it&apos;s for</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-2 mb-4">
                  {p.pros.slice(0, 3).map((pro) => (
                    <li key={pro} className="flex gap-2 text-[13px] text-ds-ink-soft">
                      <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">Who should skip</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {p.cons.slice(0, 3).map((con) => (
                    <li key={con} className="flex gap-2 text-[13px] text-ds-ink-soft">
                      <span className="text-ds-bad font-bold shrink-0" aria-hidden="true">✕</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </TabPanel>

        {/* Tab 2 — Dosing audit */}
        <TabPanel idPrefix="product" id="dosing" hidden={tab !== 'dosing'} className="mt-5">
          <Card padding={22}>
            <div className="flex justify-between items-baseline flex-wrap gap-3 mb-[14px]">
              <div>
                <h2 className="text-[18px] font-semibold m-0 tracking-[-0.01em] text-ds-ink">
                  Dosing audit
                </h2>
                <div className="text-[12px] text-ds-muted mt-1">
                  Label dose vs. dose used in the largest published RCT
                </div>
              </div>
              {totalDoses > 0 && (
                <Chip tone={allAdequate ? 'good' : 'warn'}>
                  {adequateCount} / {totalDoses} adequate
                </Chip>
              )}
            </div>

            {totalDoses === 0 ? (
              <p className="text-[13px] text-ds-muted m-0">
                Dosing data unavailable for this product. Many ingredients are hidden inside
                proprietary blends.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="text-left border-b border-ds-border">
                      <th className="py-2 pr-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted">
                        Ingredient
                      </th>
                      <th className="py-2 px-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                        Label
                      </th>
                      <th className="py-2 px-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                        Clinical
                      </th>
                      <th className="py-2 pl-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.ingredientDosages.map((d) => (
                      <tr key={d.name} className="border-b border-ds-border last:border-b-0">
                        <td className="py-3 pr-3 font-medium text-ds-ink">{d.name}</td>
                        <td className="py-3 px-3 text-right ds-tabular text-ds-ink">{d.doseInProduct}</td>
                        <td className="py-3 px-3 text-right ds-tabular text-ds-muted">{d.clinicalDose}</td>
                        <td className="py-3 pl-3 text-right">
                          <Chip tone={d.adequatelyDosed ? 'good' : 'bad'}>
                            {d.adequatelyDosed ? '✓ Pass' : '✕ Under'}
                          </Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabPanel>

        {/* Tab 3 — Pillars */}
        <TabPanel idPrefix="product" id="pillars" hidden={tab !== 'pillars'} className="mt-5">
          <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-4">
              {(Object.entries(p.scoreBreakdown) as [string, number][]).map(([k, v]) => {
                const toneClass = v >= 8 ? 'text-ds-good' : v >= 6 ? 'text-ds-warn-ink' : 'text-ds-bad';
                return (
                  <Card key={k} padding={20}>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-[17px] font-semibold m-0 text-ds-ink">{PILLAR_LABELS[k]}</h3>
                      <div>
                        <span className={`text-[26px] font-bold tracking-[-0.02em] ds-tabular ${toneClass}`}>{v}</span>
                        <span className="text-ds-muted text-[14px]">/10</span>
                      </div>
                    </div>
                    <Bar value={v} label={`${p.name} ${k} pillar score`} />
                    <p className="text-[13.5px] text-ds-ink-soft mt-3 m-0 leading-[1.6]">{PILLAR_RATIONALE[k]}</p>
                  </Card>
                );
              })}
            </div>

            <Card variant="subdued" padding={20} className="sticky top-[90px] self-start">
              <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">How the score is computed</h3>
              <p className="text-[13px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">
                Each pillar is weighted by editorial importance. Weights are constant across every
                brand we audit — they&apos;re not adjusted to favour any particular product.
              </p>
              <ul className="list-none p-0 m-0 mb-4 flex flex-col">
                {Object.entries(PILLAR_WEIGHTS).map(([k, w]) => (
                  <li
                    key={k}
                    className="flex justify-between py-[6px] border-b border-ds-border last:border-b-0 text-[13px]"
                  >
                    <span className="text-ds-muted">{PILLAR_LABELS[k]}</span>
                    <span className="font-semibold text-ds-ink ds-tabular">{Math.round(w * 100)}%</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/methodology"
                className="block text-center bg-ds-card border border-ds-border rounded-[8px] py-[8px] text-[13px] font-semibold text-ds-ink hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                Read methodology v3.2 →
              </Link>
            </Card>
          </div>
        </TabPanel>

        {/* Tab 4 — Reviews */}
        <TabPanel idPrefix="product" id="reviews" hidden={tab !== 'reviews'} className="mt-5">
          <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-[320px_1fr]">
            <Card padding={22}>
              <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-2">
                Trustpilot
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[44px] font-bold tracking-[-0.02em] ds-tabular text-ds-ink">
                  {p.trustpilotScore}
                </span>
                <span className="text-[14px] text-ds-muted">/ 5.0</span>
              </div>
              <div
                className="flex gap-[2px] mt-2"
                aria-label={`${p.trustpilotScore} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    aria-hidden="true"
                    className={star <= Math.round(p.trustpilotScore) ? 'text-ds-warn' : 'text-ds-faint'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="text-[12px] text-ds-muted mt-2">
                {p.trustpilotCount.toLocaleString()} reviews on Trustpilot
              </div>
            </Card>

            <Card padding={28}>
              <div className="flex flex-col items-center text-center max-w-[480px] mx-auto">
                <div
                  className="w-16 h-16 bg-ds-good-soft text-ds-good-ink rounded-full grid place-items-center text-[28px] font-bold mb-4"
                  aria-hidden="true"
                >
                  ★
                </div>
                <h3 className="text-[20px] font-bold tracking-[-0.01em] m-0 mb-2 text-ds-ink">
                  {p.trustpilotCount.toLocaleString()} verified reviews
                </h3>
                <p className="text-[13.5px] text-ds-ink-soft m-0 mb-5 leading-[1.6]">
                  We don&apos;t embed cherry-picked quotes here. Trustpilot is the canonical source —
                  the score above feeds into our Trust pillar.
                </p>
                <a
                  href={`https://www.trustpilot.com/review/${new URL(p.affiliateUrl).host}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white px-5 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  Read all {p.trustpilotCount.toLocaleString()} reviews on Trustpilot →
                </a>
              </div>
            </Card>
          </div>
        </TabPanel>

        {/* Tab 5 — Pricing */}
        <TabPanel idPrefix="product" id="pricing" hidden={tab !== 'pricing'} className="mt-5">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {(p.pricingModel === 'subscription' || p.pricingModel === 'both') && (
              <Card padding={22} className="border-l-[3px] border-l-ds-accent">
                <Chip tone="accent">Best price</Chip>
                <h3 className="text-[20px] font-bold tracking-[-0.01em] mt-3 mb-1 text-ds-ink">
                  Subscribe &amp; save
                </h3>
                <div className="text-[13px] text-ds-muted mb-3">Auto-ship every 30 days</div>
                {p.priceMonthlyUSD && (
                  <div className="text-right mb-4">
                    <span className="text-[32px] font-bold tracking-[-0.02em] ds-tabular text-ds-accent">
                      ${p.priceMonthlyUSD}
                    </span>
                    <span className="text-ds-muted text-[14px]">/mo</span>
                  </div>
                )}
                <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-2">
                  {['Lowest available price', `${p.moneyBackDays}-day money-back guarantee`, 'Cancel anytime', 'Free shipping'].map((b) => (
                    <li
                      key={b}
                      className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border last:border-b-0"
                    >
                      <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <TrackedAffiliateLink
                  product={p}
                  position={1}
                  surface="review"
                  className="block w-full text-center bg-ds-accent hover:bg-ds-accent-press text-white border-0 py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  Visit {p.brand} →
                </TrackedAffiliateLink>
              </Card>
            )}

            {(p.pricingModel === 'one-time' || p.pricingModel === 'both') && (
              <Card padding={22}>
                <Chip>One-time</Chip>
                <h3 className="text-[20px] font-bold tracking-[-0.01em] mt-3 mb-1 text-ds-ink">
                  Buy a single bottle
                </h3>
                <div className="text-[13px] text-ds-muted mb-3">No auto-renew</div>
                {p.priceMonthlyUSD && (
                  <div className="text-right mb-4">
                    <span className="text-[32px] font-bold tracking-[-0.02em] ds-tabular text-ds-ink">
                      ${Math.round(p.priceMonthlyUSD * 1.15)}
                    </span>
                    <span className="text-ds-muted text-[14px]">/mo equiv.</span>
                  </div>
                )}
                <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-2">
                  <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border">
                    <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                    <span>No subscription commitment</span>
                  </li>
                  <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border">
                    <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                    <span>{p.moneyBackDays}-day money-back still applies</span>
                  </li>
                  <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border">
                    <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                    <span>Faster delivery if in stock</span>
                  </li>
                  <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px]">
                    <span className="text-ds-bad font-bold shrink-0" aria-hidden="true">✕</span>
                    <span>Higher per-bottle price than subscription</span>
                  </li>
                </ul>
                <TrackedAffiliateLink
                  product={p}
                  position={2}
                  surface="review"
                  className="block w-full text-center bg-ds-card hover:bg-ds-card-sub text-ds-ink border border-ds-border py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  Buy single bottle →
                </TrackedAffiliateLink>
              </Card>
            )}

            <Card
              variant="subdued"
              padding={22}
              className="border-l-[3px] border-l-ds-muted"
              style={{ gridColumn: '1 / -1' }}
            >
              <h3 className="text-[16px] font-semibold m-0 mb-4 text-ds-ink">The fine print</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-1">
                    Money-back
                  </div>
                  <div className="text-[16px] font-semibold text-ds-ink mb-1">{p.moneyBackDays} days</div>
                  <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
                    Full refund if you&apos;re not satisfied. Brand-direct guarantee, not Amazon&apos;s.
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-1">
                    Cancellation
                  </div>
                  <div className="text-[16px] font-semibold text-ds-ink mb-1">In-account, no email</div>
                  <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
                    We score every brand on cancellation friction. Auto-deduct from the Trust pillar
                    if you have to email to cancel.
                  </p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-1">
                    Our affiliate cookie
                  </div>
                  <div className="text-[16px] font-semibold text-ds-ink mb-1">
                    {p.cookieDays} days · {p.commissionRate} commission
                  </div>
                  <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
                    We earn a commission on the click. Scores are computed before commission lookup
                    — read the methodology to verify.
                  </p>
                </div>
              </div>
            </Card>
          </div>
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
