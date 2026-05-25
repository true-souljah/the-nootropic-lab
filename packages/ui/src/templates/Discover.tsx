'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import AppShell, { type AppShellMode } from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import { Bar } from '../primitives/Bar';
import ShortlistButton from './ShortlistButton';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';

export interface DiscoverProps {
  products: Product[];
  /**
   * SEO editorial header rendered ABOVE the welcome card. Carries the
   * page H1 for ranking signal. Omit for in-app callers (set via
   * something other than a top-level route).
   */
  hero?: {
    eyebrow?: string;
    h1: string;
    dek: string;
    ctas?: Array<{ label: string; href: string; variant?: 'primary' | 'secondary' }>;
  };
  /** AppShell mode — `collapsed` for the hybrid SEO homepage. */
  mode?: AppShellMode;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
  /** Override the comparator CTA destination. */
  comparatorHref?: string;
  /** Optional welcome-card override; default is the Phase 1 evergreen copy. */
  welcomeCard?: {
    title: string;
    body: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  /** Optional "extra" block rendered after the product grid (e.g. category cards). */
  afterGrid?: ReactNode;
}

const FILTER_OPTIONS = ['All', 'Focus', 'Memory', 'Energy', 'Caffeine-free', 'Under $50'] as const;
type Filter = (typeof FILTER_OPTIONS)[number];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Discover — the home (and in-app default) surface. Editorial hero (for
 * SEO when used at `/`) + welcome card + top-pick + audit-stats +
 * filterable product grid. Filter state is client-side. The sidebar +
 * top bar come from AppShell.
 */
export default function Discover({
  products,
  hero,
  mode = 'collapsed',
  searchItems,
  uiStrings,
  comparatorHref = '/nootropic-comparison',
  welcomeCard,
  afterGrid,
}: DiscoverProps) {
  const [filter, setFilter] = useState<Filter>('All');

  const visible = useMemo(() => {
    if (filter === 'All') return products;
    if (filter === 'Caffeine-free') return products.filter((p) => p.caffeineFree);
    if (filter === 'Under $50')
      return products.filter((p) => (p.priceMonthlyUSD ?? Infinity) < 50);
    return products.filter((p) => p.bestFor.includes(filter));
  }, [filter, products]);

  const topPick = useMemo(
    () => products.find((p) => p.editorChoice) ?? products[0],
    [products]
  );

  const auditStats = useMemo(() => {
    const audited = products.length;
    const withDoses = products.filter((p) => p.ingredientDosages.length > 0);
    const underdosed = withDoses.filter((p) =>
      p.ingredientDosages.some((ing) => !ing.adequatelyDosed)
    ).length;
    const underdosedPct = withDoses.length
      ? Math.round((underdosed / withDoses.length) * 100)
      : 0;
    const priced = products.filter((p): p is Product & { priceMonthlyUSD: number } =>
      typeof p.priceMonthlyUSD === 'number'
    );
    const avgCost = priced.length
      ? Math.round(priced.reduce((s, p) => s + p.priceMonthlyUSD, 0) / priced.length)
      : 0;
    return { audited, underdosedPct, avgCost };
  }, [products]);

  const now = new Date();
  const month = MONTHS[now.getMonth()];

  const welcomeTitle =
    welcomeCard?.title ??
    'Find the nootropic that fits you, not the one with the biggest ad budget.';
  const welcomeBody =
    welcomeCard?.body ??
    'We audit every product against its clinical-trial doses. Use the comparator to filter by goal, price, and ingredients — then see exactly how we score it.';
  const welcomePrimary = welcomeCard?.primaryCta ?? {
    label: 'Open comparator →',
    href: comparatorHref,
  };
  const welcomeSecondary = welcomeCard?.secondaryCta ?? {
    label: 'See the leaderboard',
    href: '/best-nootropics',
  };

  return (
    <AppShell
      mode={mode}
      breadcrumbs={[{ label: 'Discover' }]}
      searchItems={searchItems}
      uiStrings={uiStrings}
      stackCtaHref={comparatorHref}
      sidebarMeta={`${products.length} products`}
    >
      <div className="px-4 sm:px-7 pt-7 pb-10">
        {hero && (
          <header className="mb-8 max-w-[760px]">
            {hero.eyebrow && (
              <div className="mb-3">
                <Chip tone="accent">{hero.eyebrow}</Chip>
              </div>
            )}
            <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-0.025em] m-0 text-ds-ink">
              {hero.h1}
            </h1>
            <p className="text-[17px] text-ds-ink-soft mt-3 leading-[1.55] m-0">{hero.dek}</p>
            {hero.ctas && hero.ctas.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-5">
                {hero.ctas.map((c) => (
                  <Link
                    key={c.href + c.label}
                    href={c.href}
                    className={
                      c.variant === 'secondary'
                        ? 'bg-ds-card hover:bg-ds-card-sub text-ds-ink border border-ds-border px-5 py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2'
                        : 'bg-ds-accent hover:bg-ds-accent-press text-white px-5 py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2'
                    }
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </header>
        )}

        {/* Welcome strip — stacks on mobile, 1.6fr/1fr on lg+ */}
        <div className="grid gap-4 mb-5 grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
          {/* Dark welcome card */}
          <div className="bg-ds-side text-ds-side-ink rounded-[12px] p-7">
            <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white m-0 mb-[14px] leading-[1.2]">
              {welcomeTitle}
            </h2>
            <p
              className="text-[14px] text-ds-side-muted m-0 mb-[22px] leading-[1.6]"
              style={{ maxWidth: 520 }}
            >
              {welcomeBody}
            </p>
            <div className="flex gap-[10px] flex-wrap">
              <Link
                href={welcomePrimary.href}
                className="bg-ds-accent hover:bg-ds-accent-press text-white border-0 px-4 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring-on-dark focus-visible:outline-offset-2"
              >
                {welcomePrimary.label}
              </Link>
              <Link
                href={welcomeSecondary.href}
                className="bg-transparent text-ds-side-ink border border-white/20 px-4 py-[10px] rounded-[8px] text-[13px] font-medium no-underline hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-ds-focus-ring-on-dark focus-visible:outline-offset-2"
              >
                {welcomeSecondary.label}
              </Link>
            </div>
          </div>

          {/* Right stack: top pick + audit stats */}
          <div className="grid gap-4" style={{ gridTemplateRows: '1fr 1fr' }}>
            <Card padding={20}>
              <div className="text-[11px] uppercase tracking-[0.12em] text-ds-muted font-semibold">
                Top pick · {month}
              </div>
              <div className="flex items-center gap-3 mt-[10px]">
                <div
                  className="w-11 h-11 bg-ds-accent rounded-[10px] grid place-items-center text-white font-extrabold text-[18px] flex-shrink-0"
                  aria-hidden="true"
                >
                  {topPick.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${topPick.slug}`}
                    className="font-semibold text-[15px] text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded block truncate"
                  >
                    {topPick.name}
                  </Link>
                  <div className="text-[12px] text-ds-muted">
                    {topPick.brand}
                    {topPick.priceMonthlyUSD ? ` · $${topPick.priceMonthlyUSD}/mo` : ''}
                  </div>
                </div>
                <ScorePill score={topPick.score} />
              </div>
              <div className="mt-[14px] pt-[14px] border-t border-ds-border">
                <Bar
                  value={topPick.score}
                  tone="good"
                  label={`${topPick.name} composite score`}
                />
                <div className="flex justify-between text-[11px] text-ds-muted mt-[6px]">
                  <span>Ingredients ✓</span>
                  <span>Transparency ✓</span>
                  <span>Trust ✓</span>
                </div>
              </div>
            </Card>

            <Card padding={20}>
              <div className="flex justify-between items-baseline">
                <div className="text-[11px] uppercase tracking-[0.12em] text-ds-muted font-semibold">
                  Audit this cycle
                </div>
                <span className="text-[11px] text-ds-good-ink font-semibold inline-flex items-center gap-[5px]">
                  <span aria-hidden="true" className="w-[6px] h-[6px] bg-ds-good rounded-full inline-block" />
                  Live
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[
                  [`${auditStats.audited}`, 'Audited'],
                  [`${auditStats.underdosedPct}%`, 'Underdosed'],
                  [`$${auditStats.avgCost}`, 'Avg / mo'],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-[22px] font-bold tracking-[-0.02em] ds-tabular">{n}</div>
                    <div className="text-[11px] text-ds-muted mt-[2px]">{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex justify-between items-center mb-[14px] flex-wrap gap-3">
          <div>
            <h2 className="text-[18px] font-semibold m-0 tracking-[-0.01em] text-ds-ink">
              Top stacks
            </h2>
            <div className="text-[12px] text-ds-muted mt-[2px]">
              Sorted by composite score · {visible.length} of {products.length}
            </div>
          </div>
          <div className="flex gap-[6px] items-center flex-wrap">
            {FILTER_OPTIONS.map((f) => (
              <Chip
                key={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </Chip>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {visible.length === 0 ? (
          <Card padding={36}>
            <p className="text-[13px] text-ds-muted text-center m-0">
              No products match.{' '}
              <button
                type="button"
                onClick={() => setFilter('All')}
                className="bg-transparent text-ds-accent border-0 underline cursor-pointer text-[13px] font-semibold p-0"
              >
                Reset filters
              </button>
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <Card key={p.slug} padding={0} as="article">
                <div className="p-[18px] flex items-start gap-3 border-b border-ds-border">
                  <div
                    className="w-10 h-10 bg-ds-ink rounded-[10px] grid place-items-center text-white font-extrabold text-[16px] flex-shrink-0"
                    aria-hidden="true"
                  >
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 items-start">
                      <div className="min-w-0">
                        <Link
                          href={`/${p.slug}`}
                          className="font-semibold text-[15px] text-ds-ink tracking-[-0.005em] truncate block hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                        >
                          {p.name}
                        </Link>
                        <div className="text-[12px] text-ds-muted">{p.brand}</div>
                      </div>
                      <ScorePill score={p.score} />
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {p.editorChoice && <Chip tone="accent">★ Editor&apos;s pick</Chip>}
                      {p.caffeineFree ? (
                        <Chip tone="good">Caffeine-free</Chip>
                      ) : (
                        <Chip tone="warn">Caffeine</Chip>
                      )}
                      {p.bestFor.slice(0, 2).map((b) => (
                        <Chip key={b}>{b}</Chip>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-[18px] pt-[14px]">
                  <p
                    className="text-[13px] text-ds-ink-soft leading-[1.55] m-0 mb-[14px]"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}
                  >
                    {p.summary}
                  </p>

                  <div className="mb-[14px] flex flex-col gap-[2px]">
                    {(['ingredients', 'dosing', 'transparency'] as const).map((k) => {
                      const v = p.scoreBreakdown[k];
                      return (
                        <div
                          key={k}
                          className="grid items-center gap-2"
                          style={{ gridTemplateColumns: '80px 1fr 24px' }}
                        >
                          <span className="text-[11px] text-ds-muted capitalize">{k}</span>
                          <Bar value={v} label={`${p.name} ${k} score`} />
                          <span className="text-[11px] text-ds-ink text-right ds-tabular">{v}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-ds-border">
                    <div className="text-[12px] text-ds-muted">
                      {p.priceMonthlyUSD && (
                        <>
                          <span className="text-ds-ink font-semibold">${p.priceMonthlyUSD}</span>/mo
                          {' · '}
                        </>
                      )}
                      {p.capsulesPerServing} caps · {p.moneyBackDays}d MBG
                    </div>
                    <div className="flex items-center gap-2">
                      <ShortlistButton slug={p.slug} size="sm" />
                      <Link
                        href={`/${p.slug}`}
                        className="text-ds-accent text-[12px] font-semibold no-underline hover:text-ds-accent-press focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {afterGrid && <div className="mt-10">{afterGrid}</div>}
      </div>
    </AppShell>
  );
}
