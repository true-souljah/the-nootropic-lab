import type { ReactNode } from 'react';
import Link from 'next/link';
import AppShell from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import { Bar } from '../primitives/Bar';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import ShortlistButton from './ShortlistButton';
import type { AffiliateClickContext } from '../trackAffiliateClick';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';

export interface BestOfProps {
  products: Product[];
  /** Breadcrumb trail rendered in the AppShell top bar. */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /** Page hero: editorial H1 + dek + optional eyebrow. */
  hero?: {
    eyebrow?: string;
    h1: string;
    dek?: string;
  };
  /** Optional override of stat tiles. By default, derives from `products`. */
  stats?: Array<{ label: string; value: string; tone?: 'good' | 'bad' | 'neutral' }>;
  /** Refresh date displayed in the subtitle (defaults to today). */
  refreshDate?: string;
  /** Methodology version displayed in the subtitle. */
  methodologyVersion?: string;
  /**
   * "Recommended" cutoff for the stat. Products with score ≥ this count.
   * Default 8.5 (matches Phase 1 ScorePill `good` threshold).
   */
  recommendedCutoff?: number;
  searchItems?: SearchItem[];
  /**
   * Locale UIStrings bundle. Required — PR-Q12 (#76) removed the
   * `?? getStrings('en')` defensive fallback because it produced a
   * latent WCAG 3.1.2 leak: a future caller could silently render
   * English content under a non-EN `<html lang>`. Pass the bundle
   * from `buildRegionSearchContext(productsX, locale)` at the page.
   */
  uiStrings: UIStrings;
  /** Rendered above the ranked list (editor's choice, intro paragraph). */
  preList?: ReactNode;
  /** Rendered below the ranked list (browse-by-goal, FAQ, methodology). */
  postList?: ReactNode;
  /** Affiliate-tracking surface tag used on product CTAs. */
  trackingSurface?: AffiliateClickContext['surface'];
  /**
   * YMYL regulatory disclaimer rendered at the bottom of the page.
   * Pass `getRegionalHealthDisclaimer(market)` from @nootropic/data;
   * the text varies by region (Health Canada for CA, FDA for US,
   * EFSA for EU, etc.). Omit on legacy pages — the disclaimer
   * section will simply not render.
   */
  healthDisclaimer?: string;
  /**
   * Optional regional regulatory pillar callout (e.g. /are-nootropics-fda-approved/ on US,
   * /efsa-approved-cognitive-supplements/ on EU). Rendered between postList and the
   * healthDisclaimer. Drives inbound internal links to the regulatory pillars per region
   * — parallels the Listicle.regulatoryPillar prop introduced in PR #164 / extended in
   * PR #165 / now extended to the BestOf surface in PR #168.
   */
  regulatoryPillar?: { label: string; href: string };
}

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * BestOf — in-app ranked leaderboard surface for /best-nootropics and
 * state landing pages. AppShell + stat-tile row + ranked product rows
 * in the Phase 1 5-column grid (rank / identity / pillars / specs /
 * action). Pre/post slots accept page-specific content (editor's choice
 * spotlight, browse-by-goal, FAQ).
 */
export default function BestOf({
  products,
  breadcrumbs = [{ label: 'Best of' }],
  hero,
  stats,
  refreshDate,
  methodologyVersion = 'v3.2',
  recommendedCutoff = 8.5,
  searchItems,
  uiStrings,
  preList,
  postList,
  trackingSurface = 'best_of',
  healthDisclaimer,
  regulatoryPillar,
}: BestOfProps) {
  const pd = uiStrings.productDetail;
  const sorted = [...products].sort((a, b) => b.score - a.score);
  const audited = products.length;
  const recommended = products.filter((p) => p.score >= recommendedCutoff).length;
  const withDoses = products.filter((p) => p.ingredientDosages.length > 0);
  const underdosedPct = withDoses.length
    ? Math.round(
        (withDoses.filter((p) => p.ingredientDosages.some((ing) => !ing.adequatelyDosed)).length /
          withDoses.length) *
          100
      )
    : 0;
  const pricedProducts = products.filter(
    (p): p is Product & { priceMonthlyUSD: number } => typeof p.priceMonthlyUSD === 'number'
  );
  const avgCost = pricedProducts.length
    ? Math.round(pricedProducts.reduce((s, p) => s + p.priceMonthlyUSD, 0) / pricedProducts.length)
    : 0;

  const defaultStats = [
    { label: 'Audited', value: `${audited}`, tone: 'neutral' as const },
    { label: 'Recommended', value: `${recommended}`, tone: 'good' as const },
    { label: 'Underdosed flagship', value: `${underdosedPct}%`, tone: 'bad' as const },
    { label: 'Avg / month', value: `$${avgCost}`, tone: 'neutral' as const },
  ];
  const tiles = stats ?? defaultStats;

  const refresh = refreshDate ?? formatDate(new Date());
  const subtitle = `${audited} audited · ${sorted.length} listed · methodology ${methodologyVersion} · refreshed ${refresh}`;

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={breadcrumbs}
      searchItems={searchItems}
      uiStrings={uiStrings}
      sidebarMeta={`${products.length} products`}
    >
      <div className="px-4 sm:px-7 pt-7 pb-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-[18px] flex-wrap gap-4">
          <div>
            {hero?.eyebrow && (
              <div className="mb-3">
                <Chip tone="accent">{hero.eyebrow}</Chip>
              </div>
            )}
            <h1 className="text-[24px] font-bold tracking-[-0.02em] m-0 text-ds-ink">
              {hero?.h1 ?? 'Best of'}
            </h1>
            {hero?.dek && (
              <p className="text-[14px] text-ds-ink-soft mt-2 m-0 max-w-[680px] leading-[1.55]">
                {hero.dek}
              </p>
            )}
            <div className="text-[13px] text-ds-muted mt-1">{subtitle}</div>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid gap-4 mb-[18px] grid-cols-2 md:grid-cols-4">
          {tiles.map((tile) => {
            const color =
              tile.tone === 'good'
                ? 'text-ds-good'
                : tile.tone === 'bad'
                  ? 'text-ds-bad'
                  : 'text-ds-ink';
            return (
              <Card key={tile.label} padding={20}>
                <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">
                  {tile.label}
                </div>
                <div className={`text-[30px] font-bold tracking-[-0.02em] ds-tabular mt-[6px] ${color}`}>
                  {tile.value}
                </div>
              </Card>
            );
          })}
        </div>

        {preList && <div className="mb-8">{preList}</div>}

        {/* Ranked product rows */}
        <Card padding={0}>
          {sorted.map((p, i) => {
            const rank = i + 1;
            const isWinner = i === 0;
            return (
              <article
                key={p.slug}
                className="flex flex-col gap-4 lg:gap-[18px] lg:grid lg:grid-cols-[60px_1fr_220px_240px_110px] px-4 sm:px-[22px] py-5 border-b border-ds-border last:border-b-0 items-start lg:items-center"
              >
                {/* Rank */}
                <div>
                  <div
                    className={`text-[36px] font-bold tracking-[-0.04em] leading-none ds-tabular ${
                      isWinner ? 'text-ds-accent' : 'text-ds-ink'
                    }`}
                  >
                    {String(rank).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-ds-muted mt-[2px]">
                    Rank
                  </div>
                </div>

                {/* Identity */}
                <div className="min-w-0 w-full">
                  <div className="flex items-center gap-3 mb-2 min-w-0">
                    <div
                      className="w-9 h-9 bg-ds-ink rounded-[8px] grid place-items-center text-white font-extrabold text-[14px] flex-shrink-0"
                      aria-hidden="true"
                    >
                      {p.name[0]}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/${p.slug}`}
                        className="font-semibold text-[16px] text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded tracking-[-0.005em] block truncate"
                      >
                        {p.name}
                      </Link>
                      <div className="text-[12px] text-ds-muted">{p.brand}</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55] max-w-[520px]">
                    {p.summary}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {p.editorChoice && <Chip tone="accent">★ Editor&apos;s pick</Chip>}
                    {p.caffeineFree ? (
                      <Chip tone="good">Caffeine-free</Chip>
                    ) : (
                      <Chip tone="warn">Caffeine</Chip>
                    )}
                    {p.bestFor.slice(0, 3).map((b) => (
                      <Chip key={b}>{b}</Chip>
                    ))}
                  </div>
                </div>

                {/* Pillars */}
                <div>
                  {(Object.entries(p.scoreBreakdown) as [string, number][]).map(([k, v]) => (
                    <div
                      key={k}
                      className="grid items-center gap-[6px] py-[2px]"
                      style={{ gridTemplateColumns: '90px 1fr 22px' }}
                    >
                      <span className="text-[11px] text-ds-muted capitalize">{k}</span>
                      <Bar value={v} label={`${p.name} ${k} score`} />
                      <span className="text-[11px] text-ds-ink text-right ds-tabular">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Specs */}
                <div className="flex flex-col gap-1 text-[12px] text-ds-muted">
                  <div className="flex justify-between">
                    <span>Price</span>
                    <span className="text-ds-ink font-semibold">
                      {p.priceMonthlyUSD ? `$${p.priceMonthlyUSD}/mo` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Caps</span>
                    <span className="text-ds-ink">{p.capsulesPerServing}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MBG</span>
                    <span className="text-ds-ink">{p.moneyBackDays}d</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trustpilot</span>
                    <span
                      className={
                        p.trustpilotScore === null
                          ? 'text-ds-muted'
                          : p.trustpilotScore >= 4
                            ? 'text-ds-good-ink font-semibold'
                            : p.trustpilotScore < 3.5
                              ? 'text-ds-bad-ink font-semibold'
                              : 'text-ds-ink'
                      }
                    >
                      {p.trustpilotScore === null
                        ? 'N/A'
                        : `${p.trustpilotScore} (${p.trustpilotCount?.toLocaleString() ?? 'n/a'})`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission</span>
                    <span className="text-ds-accent font-semibold">{p.commissionRate}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="flex flex-row lg:flex-col items-center gap-[10px] w-full lg:w-auto">
                  <ScorePill score={p.score} />
                  <TrackedAffiliateLink
                    product={p}
                    position={rank}
                    surface={trackingSurface}
                    className="flex-1 lg:w-full text-center bg-ds-accent hover:bg-ds-accent-press text-white border-0 py-2 px-2 rounded-[8px] text-[12px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                  >
                    Visit →
                  </TrackedAffiliateLink>
                  <ShortlistButton slug={p.slug} size="sm" />
                </div>
              </article>
            );
          })}
        </Card>

        {postList && <div className="mt-10">{postList}</div>}

        {/* Related guides — PR #168 internal-linking extension to the BestOf
            surface (paralleling the Listicle.regulatoryPillar wiring from
            PR #164 / #165). Lifts the regional regulatory pillar's inbound
            count by 1 edge per region. */}
        {regulatoryPillar && (
          <section
            aria-labelledby="bestof-related-guides-heading"
            className="mt-10 pt-6 border-t border-ds-border"
          >
            <h2
              id="bestof-related-guides-heading"
              className="text-[13px] uppercase tracking-[0.1em] text-ds-muted font-semibold m-0 mb-2"
            >
              Related guides
            </h2>
            <ul className="grid gap-2 list-disc pl-5 text-[14px] leading-[1.6] text-ds-ink-soft">
              <li>
                <Link href={regulatoryPillar.href} className="text-ds-accent underline">
                  {regulatoryPillar.label}
                </Link>
              </li>
            </ul>
          </section>
        )}

        {/* Regional YMYL disclaimer (Health Canada / FDA / EFSA / etc.).
            Passed via the healthDisclaimer prop; render only when supplied. */}
        {healthDisclaimer && (
          <section
            aria-labelledby="bestof-health-disclaimer-heading"
            className="mt-10 pt-6 border-t border-ds-border"
          >
            <h2
              id="bestof-health-disclaimer-heading"
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
