'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowUp, ArrowDown, X, ExternalLink, Download, Copy } from 'lucide-react';
import AppShell from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import { LiveRegion } from '../primitives/LiveRegion';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import { useShortlist, useShortlistNote } from './useShortlist';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';

export interface ShortlistProps {
  /** Full product catalog — items in localStorage are looked up by slug. */
  products: Product[];
  siteUrl: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

function parseCommissionPct(raw: string): number | null {
  const m = raw.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Shortlist — saved-stacks surface at /shortlist. localStorage-backed
 * via `useShortlist`. Surfaces an aggregate summary (cheapest, best,
 * caffeine-free, avg commission), per-item editable note textarea,
 * reorder controls, remove/visit actions, and Copy-link / Export-CSV
 * / Compare-side-by-side action bar. Empty state for first visit.
 *
 * On mount, if the URL contains `?items=slug1,slug2,...` AND the
 * local shortlist is empty, the URL items are imported (one-time, for
 * shareable links).
 */
export default function Shortlist({
  products,
  siteUrl,
  searchItems,
  uiStrings,
}: ShortlistProps) {
  const { slugs, hydrated, remove, move, clear, replace } = useShortlist();
  const [notice, setNotice] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  // One-shot URL → localStorage hydration for shareable links
  useEffect(() => {
    if (!hydrated || imported) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('items');
    if (!raw) {
      setImported(true);
      return;
    }
    const incoming = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => products.some((p) => p.slug === s));
    if (incoming.length > 0 && slugs.length === 0) {
      replace(incoming);
      flash(`Imported ${incoming.length} from shared link`);
    }
    setImported(true);
  }, [hydrated, imported, products, replace, slugs.length]);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  }

  const items = useMemo(
    () => slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p)),
    [slugs, products]
  );

  const stats = useMemo(() => {
    if (items.length === 0) return null;
    const priced = items.filter((p): p is Product & { priceMonthlyUSD: number } => typeof p.priceMonthlyUSD === 'number');
    const cheapest = priced.length
      ? priced.reduce((min, p) => (p.priceMonthlyUSD < min.priceMonthlyUSD ? p : min))
      : null;
    const best = items.reduce((max, p) => (p.score > max.score ? p : max));
    const allCaffeineFree = items.every((p) => p.caffeineFree);
    const commissions = items.map((p) => parseCommissionPct(p.commissionRate)).filter((n): n is number => n !== null);
    const avgCommission = commissions.length
      ? Math.round(commissions.reduce((s, n) => s + n, 0) / commissions.length)
      : null;
    return { cheapest, best, allCaffeineFree, avgCommission };
  }, [items]);

  function copyLink() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      flash('Could not access clipboard');
      return;
    }
    const url = items.length === 0
      ? `${siteUrl}/shortlist`
      : `${siteUrl}/shortlist?items=${items.map((p) => p.slug).join(',')}`;
    navigator.clipboard.writeText(url).then(
      () => flash('Link copied to clipboard'),
      () => flash('Could not copy link')
    );
  }

  function exportCsv() {
    if (typeof document === 'undefined' || items.length === 0) return;
    const headers = ['Rank', 'Name', 'Brand', 'Score', 'Price USD/mo', 'Caps/day', 'MBG days', 'Trustpilot', 'Caffeine-free', 'Commission'];
    const rows = items.map((p, i) => [
      i + 1,
      p.name,
      p.brand,
      p.score,
      p.priceMonthlyUSD ?? '',
      p.capsulesPerServing,
      p.moneyBackDays,
      p.trustpilotScore ?? '',
      p.caffeineFree ? 'Yes' : 'No',
      p.commissionRate,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nootropic-shortlist-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const compareHref =
    items.length === 0
      ? '/nootropic-comparison'
      : `/nootropic-comparison?cmp=${items.map((p) => p.slug).join(',')}`;

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={[{ label: 'My shortlist' }]}
      searchItems={searchItems}
      uiStrings={uiStrings}
      hideStackCta
      sidebarMeta={`${products.length} products`}
    >
      <div className="px-7 pt-7 pb-10">
        {!hydrated ? (
          <Card padding={28}>
            <p className="text-[13px] text-ds-muted text-center m-0">Loading your shortlist…</p>
          </Card>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-end mb-5 flex-wrap gap-4">
              <div>
                <h1 className="text-[24px] font-bold tracking-[-0.02em] m-0 text-ds-ink">
                  My shortlist
                </h1>
                <div className="text-[13px] text-ds-muted mt-1">
                  {items.length} saved · stored on this device
                  {items.length >= 10 && (
                    <span className="text-ds-warn-ink ml-2">
                      · consider narrowing to your top 3–5 to compare cleanly
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-[6px] items-center flex-wrap">
                <LiveRegion message={notice ?? ''} />
                {notice && (
                  <span
                    aria-hidden="true"
                    className="text-[12px] text-ds-good-ink bg-ds-good-soft px-3 py-[7px] rounded-[8px] font-medium"
                  >
                    {notice}
                  </span>
                )}
                <button
                  type="button"
                  onClick={copyLink}
                  className="bg-ds-card border border-ds-border px-3 py-[7px] rounded-[8px] text-[12px] text-ds-ink-soft font-medium cursor-pointer flex items-center gap-[6px] hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  <Copy size={12} strokeWidth={2.2} aria-hidden={true} />
                  Copy link
                </button>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="bg-ds-card border border-ds-border px-3 py-[7px] rounded-[8px] text-[12px] text-ds-ink-soft font-medium cursor-pointer flex items-center gap-[6px] hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  <Download size={12} strokeWidth={2.2} aria-hidden={true} />
                  Export CSV
                </button>
                <Link
                  href={compareHref}
                  className="bg-ds-accent hover:bg-ds-accent-press text-white px-3 py-[7px] rounded-[8px] text-[12px] font-semibold no-underline flex items-center gap-[6px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                >
                  Compare side-by-side →
                </Link>
              </div>
            </div>

            {/* Aggregate stats */}
            {stats && (
              <div className="grid gap-4 mb-5 grid-cols-2 md:grid-cols-4">
                <SummaryTile
                  label="Cheapest"
                  value={stats.cheapest ? `$${stats.cheapest.priceMonthlyUSD}/mo` : '—'}
                  sub={stats.cheapest ? stats.cheapest.name : ''}
                />
                <SummaryTile
                  label="Best scored"
                  value={`${stats.best.score}/10`}
                  sub={stats.best.name}
                  tone="good"
                />
                <SummaryTile
                  label="All caffeine-free"
                  value={stats.allCaffeineFree ? 'Yes' : 'No'}
                  sub=""
                  tone={stats.allCaffeineFree ? 'good' : 'warn'}
                />
                <SummaryTile
                  label="Avg commission"
                  value={stats.avgCommission !== null ? `${stats.avgCommission}%` : '—'}
                  sub="Doesn't change scores"
                />
              </div>
            )}

            {/* Saved cards */}
            <div className="flex flex-col gap-3">
              {items.map((p, idx) => (
                <ShortlistRow
                  key={p.slug}
                  product={p}
                  index={idx}
                  total={items.length}
                  onRemove={() => remove(p.slug)}
                  onMoveUp={() => move(p.slug, -1)}
                  onMoveDown={() => move(p.slug, 1)}
                />
              ))}
            </div>

            <div className="text-[12px] text-ds-muted mt-8 leading-[1.6] max-w-[640px]">
              Your shortlist lives in this browser&apos;s storage — no account needed. The
              &ldquo;Copy link&rdquo; button generates a shareable URL that imports the same
              picks on another device or browser.{' '}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all saved picks from this device?')) {
                    clear();
                    flash('Shortlist cleared');
                  }
                }}
                className="bg-transparent text-ds-bad-ink border-0 underline cursor-pointer font-medium p-0 focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
              >
                Clear shortlist
              </button>
              .
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center max-w-[480px] mx-auto pt-12">
      <div
        className="w-16 h-16 bg-ds-accent-soft text-ds-accent rounded-full grid place-items-center mb-5"
        aria-hidden="true"
      >
        <Heart size={28} strokeWidth={2} fill="currentColor" />
      </div>
      <h1 className="text-[28px] font-bold tracking-[-0.02em] text-ds-ink m-0 mb-3 leading-[1.15]">
        Save the stacks you&apos;re considering
      </h1>
      <p className="text-[14px] text-ds-ink-soft m-0 mb-6 leading-[1.6]">
        Tap the ♡ icon on any product card to save it here. Your shortlist lives in this
        browser — no account needed — and you can share it via a copy-link to view the same
        picks on another device.
      </p>
      <Link
        href="/best-nootropics"
        className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white px-6 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
      >
        Browse Best of 2026 →
      </Link>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'good' | 'warn' | 'bad';
}) {
  const color =
    tone === 'good' ? 'text-ds-good' : tone === 'warn' ? 'text-ds-warn-ink' : tone === 'bad' ? 'text-ds-bad' : 'text-ds-ink';
  return (
    <Card variant="subdued" padding={18}>
      <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">
        {label}
      </div>
      <div className={`text-[22px] font-bold tracking-[-0.02em] ds-tabular mt-1 ${color}`}>
        {value}
      </div>
      {sub && <div className="text-[12px] text-ds-muted mt-[2px] truncate">{sub}</div>}
    </Card>
  );
}

function ShortlistRow({
  product,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  product: Product;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [note, setNote] = useShortlistNote(product.slug);
  return (
    <Card padding={20}>
      <div className="grid gap-5 items-start" style={{ gridTemplateColumns: '32px 1fr 200px 1fr auto' }}>
        {/* Reorder controls (replaces drag handle for keyboard a11y) */}
        <div className="flex flex-col gap-1 pt-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label={`Move ${product.name} up`}
            className="w-7 h-7 grid place-items-center text-ds-muted hover:text-ds-ink disabled:opacity-30 disabled:cursor-not-allowed rounded focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            <ArrowUp size={14} strokeWidth={2} aria-hidden={true} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label={`Move ${product.name} down`}
            className="w-7 h-7 grid place-items-center text-ds-muted hover:text-ds-ink disabled:opacity-30 disabled:cursor-not-allowed rounded focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            <ArrowDown size={14} strokeWidth={2} aria-hidden={true} />
          </button>
        </div>

        {/* Identity */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-11 h-11 bg-ds-ink rounded-[10px] grid place-items-center text-white font-extrabold text-[16px] flex-shrink-0"
            aria-hidden="true"
          >
            {product.name[0]}
          </div>
          <div className="min-w-0">
            <Link
              href={`/${product.slug}`}
              className="font-bold text-[15px] text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded block truncate"
            >
              {product.name}
            </Link>
            <div className="text-[12px] text-ds-muted">{product.brand}</div>
            <div className="flex gap-1 mt-[6px] flex-wrap">
              {product.editorChoice && <Chip tone="accent">★ Editor&apos;s pick</Chip>}
              {product.caffeineFree ? (
                <Chip tone="good">Caffeine-free</Chip>
              ) : (
                <Chip tone="warn">Caffeine</Chip>
              )}
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-col gap-[6px] text-[12px]">
          <SpecRow label="Score" value={`${product.score}/10`} />
          <SpecRow
            label="Price"
            value={product.priceMonthlyUSD ? `$${product.priceMonthlyUSD}/mo` : '—'}
          />
          <SpecRow label="MBG" value={`${product.moneyBackDays} days`} />
        </div>

        {/* Note */}
        <div>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.1em] font-semibold text-ds-muted mb-1 block">
              Your note
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. First choice if $69 is doable"
              rows={3}
              className="w-full bg-ds-card-sub border border-ds-border rounded-[8px] p-3 text-[13px] text-ds-ink resize-none focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 placeholder:text-ds-muted placeholder:italic"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 items-stretch">
          <ScorePill score={product.score} />
          <TrackedAffiliateLink
            product={product}
            position={index + 1}
            surface="review"
            className="inline-flex items-center justify-center gap-1 bg-ds-accent hover:bg-ds-accent-press text-white px-3 py-[8px] rounded-[8px] text-[12px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            Visit
            <ExternalLink size={11} strokeWidth={2.4} aria-hidden={true} />
          </TrackedAffiliateLink>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from shortlist`}
            className="inline-flex items-center justify-center gap-1 bg-transparent border border-ds-border text-ds-muted px-3 py-[8px] rounded-[8px] text-[12px] cursor-pointer hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            <X size={11} strokeWidth={2.4} aria-hidden={true} />
            Remove
          </button>
        </div>
      </div>
    </Card>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ds-muted">{label}</span>
      <span className="font-semibold text-ds-ink ds-tabular">{value}</span>
    </div>
  );
}
