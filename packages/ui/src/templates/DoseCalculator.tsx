'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, RotateCcw, Copy, X } from 'lucide-react';
import AppShell from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import type { Ingredient, Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';
import { parseClinicalDose, statusFor, defaultDoseFor, type DoseStatus, type ParsedDose } from './doseRange';

export interface DoseCalculatorProps {
  ingredients: Ingredient[];
  products: Product[];
  siteUrl: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

interface StackEntry {
  slug: string;
  dose: number;
}

function encodeStack(entries: StackEntry[]): string {
  if (entries.length === 0) return '';
  return entries.map((e) => `${e.slug}:${e.dose}`).join(',');
}

function decodeStack(raw: string | null): StackEntry[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((pair) => {
      const [slug, doseRaw] = pair.split(':');
      const dose = Number(doseRaw);
      return slug && Number.isFinite(dose) && dose > 0 ? { slug, dose } : null;
    })
    .filter((e): e is StackEntry => e !== null);
}

/**
 * DoseCalculator — interactive ingredient editor with per-ingredient
 * range visualizer, derived stack score, and closest-matching product
 * recommendation. URL state in `?stack=slug:dose,...` so shared links
 * round-trip. Pure data — no backend.
 */
export default function DoseCalculator({
  ingredients,
  products,
  siteUrl,
  searchItems,
  uiStrings,
}: DoseCalculatorProps) {
  const [stack, setStack] = useState<StackEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Hydrate stack from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    setStack(decodeStack(params.get('stack')));
    setHydrated(true);
  }, []);

  // Write to URL whenever stack changes (after hydration)
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    const encoded = encodeStack(stack);
    const params = new URLSearchParams(window.location.search);
    if (encoded) params.set('stack', encoded);
    else params.delete('stack');
    const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', next);
  }, [stack, hydrated]);

  const ingredientBySlug = useMemo(
    () => new Map(ingredients.map((i) => [i.slug, i])),
    [ingredients]
  );

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  }

  const setDose = useCallback((slug: string, dose: number) => {
    setStack((prev) => prev.map((e) => (e.slug === slug ? { ...e, dose } : e)));
  }, []);

  const removeEntry = useCallback((slug: string) => {
    setStack((prev) => prev.filter((e) => e.slug !== slug));
  }, []);

  const reset = useCallback(() => {
    setStack([]);
    flash('Stack reset');
  }, []);

  function copyLink() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      flash('Could not access clipboard');
      return;
    }
    const url = stack.length === 0
      ? `${siteUrl}/dose-calculator`
      : `${siteUrl}/dose-calculator?stack=${encodeStack(stack)}`;
    navigator.clipboard.writeText(url).then(
      () => flash('Link copied to clipboard'),
      () => flash('Could not copy link')
    );
  }

  // Available ingredients = catalog minus what's already in the stack
  const available = useMemo(
    () => ingredients.filter((ing) => !stack.some((e) => e.slug === ing.slug)),
    [ingredients, stack]
  );

  function addIngredient(slug: string) {
    const ing = ingredientBySlug.get(slug);
    if (!ing) return;
    const range = parseClinicalDose(ing.clinicalDose);
    if (!range) return;
    setStack((prev) => [...prev, { slug, dose: defaultDoseFor(range) }]);
  }

  // Per-entry parsed range + status, computed once per render
  const enriched = useMemo(() => {
    return stack
      .map((entry) => {
        const ing = ingredientBySlug.get(entry.slug);
        if (!ing) return null;
        const range = parseClinicalDose(ing.clinicalDose);
        if (!range) return null;
        return {
          entry,
          ing,
          range,
          status: statusFor(entry.dose, range),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [stack, ingredientBySlug]);

  const inRangeCount = enriched.filter((e) => e.status === 'in-range').length;
  const stackScore = enriched.length === 0 ? 0 : Math.round((inRangeCount / enriched.length) * 100) / 10;

  // Find first underdose to suggest a fix
  const firstUnder = enriched.find((e) => e.status === 'under');
  const nudge = firstUnder
    ? `Bring ${firstUnder.ing.name} up to ${firstUnder.range.min}${firstUnder.range.unit} to lift this.`
    : enriched.length === 0
      ? 'Add ingredients to score your stack.'
      : 'All ingredients are dosed in the clinical range.';

  // Closest off-the-shelf product = max overlap of slugs (case-insensitive name match)
  const closest = useMemo(() => {
    if (enriched.length === 0) return null;
    const userIngredientNames = enriched.map(({ ing }) => ing.name.toLowerCase());
    let best: { product: Product; overlap: number } | null = null;
    for (const product of products) {
      let overlap = 0;
      for (const userName of userIngredientNames) {
        if (
          product.ingredientDosages.some(
            (d) => d.name.toLowerCase().includes(userName) || userName.includes(d.name.toLowerCase())
          ) ||
          product.heroIngredients.some(
            (n) => n.toLowerCase().includes(userName) || userName.includes(n.toLowerCase())
          )
        ) {
          overlap += 1;
        }
      }
      if (overlap > 0 && (!best || overlap > best.overlap)) {
        best = { product, overlap };
      }
    }
    return best;
  }, [enriched, products]);

  const toneFor = (s: DoseStatus): 'good' | 'warn' | 'bad' =>
    s === 'in-range' ? 'good' : s === 'over' ? 'warn' : 'bad';

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={[{ label: 'Dose calculator' }]}
      searchItems={searchItems}
      uiStrings={uiStrings}
      hideStackCta
    >
      <div className="px-7 pt-7 pb-10">
        {/* Top action bar */}
        <div className="flex justify-between items-end mb-5 flex-wrap gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.02em] m-0 text-ds-ink">
              Dose calculator
            </h1>
            <p className="text-[13px] text-ds-muted mt-1 max-w-[680px] m-0">
              Build a custom stack ingredient by ingredient. Each dose is checked against the
              clinical-trial range that produced an effect. Save a link to your stack to revisit
              or compare against off-the-shelf products.
            </p>
          </div>
          <div className="flex gap-[6px] items-center flex-wrap">
            {notice && (
              <span className="text-[12px] text-ds-good-ink bg-ds-good-soft px-3 py-[7px] rounded-[8px] font-medium">
                {notice}
              </span>
            )}
            <button
              type="button"
              onClick={reset}
              disabled={stack.length === 0}
              className="bg-ds-card border border-ds-border px-3 py-[7px] rounded-[8px] text-[12px] text-ds-ink-soft font-medium cursor-pointer flex items-center gap-[6px] hover:bg-ds-card-sub disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              <RotateCcw size={12} strokeWidth={2.2} aria-hidden={true} />
              Reset
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="bg-ds-accent hover:bg-ds-accent-press text-white px-3 py-[7px] rounded-[8px] text-[12px] font-semibold cursor-pointer flex items-center gap-[6px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              <Copy size={12} strokeWidth={2.4} aria-hidden={true} />
              Copy link
            </button>
          </div>
        </div>

        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          {/* Editor */}
          <div>
            <Card padding={0}>
              <div className="flex justify-between items-center p-5 border-b border-ds-border">
                <h2 className="text-[16px] font-semibold m-0 tracking-[-0.01em] text-ds-ink">
                  Your stack
                  <span className="text-ds-muted font-normal ml-2 text-[13px] ds-tabular">
                    · {stack.length} ingredient{stack.length === 1 ? '' : 's'}
                  </span>
                </h2>
                <AddIngredientPicker available={available} onPick={addIngredient} />
              </div>

              {enriched.length === 0 ? (
                <div className="p-9 text-center">
                  <p className="text-[13px] text-ds-muted m-0 mb-3">
                    Add an ingredient to start building your stack.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {enriched.map(({ entry, ing, range, status }) => (
                    <StackRow
                      key={ing.slug}
                      ingredient={ing}
                      dose={entry.dose}
                      range={range}
                      status={status}
                      onDoseChange={(v) => setDose(ing.slug, v)}
                      onRemove={() => removeEntry(ing.slug)}
                      tone={toneFor(status)}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Summary sidebar */}
          <div className="flex flex-col gap-4 sticky top-[90px] self-start">
            <Card padding={22}>
              <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted">
                Your stack score
              </div>
              <div
                className={`text-[48px] font-bold tracking-[-0.03em] ds-tabular mt-1 ${
                  stackScore >= 8.5 ? 'text-ds-good' : stackScore >= 6 ? 'text-ds-warn-ink' : 'text-ds-bad'
                }`}
              >
                {stackScore.toFixed(1)}
              </div>
              <div className="text-[12px] text-ds-muted mt-[2px]">
                {inRangeCount} of {enriched.length} in clinical range
              </div>
              <p className="text-[13px] text-ds-ink-soft mt-3 m-0 leading-[1.6]">{nudge}</p>
            </Card>

            {closest && (
              <Card variant="subdued" padding={22}>
                <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-3">
                  Closest off-the-shelf
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 bg-ds-ink rounded-[10px] grid place-items-center text-white font-extrabold text-[16px] flex-shrink-0"
                    aria-hidden="true"
                  >
                    {closest.product.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${closest.product.slug}`}
                      className="font-bold text-[14px] text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded block truncate"
                    >
                      {closest.product.name}
                    </Link>
                    <div className="text-[12px] text-ds-muted">{closest.product.brand}</div>
                  </div>
                  <ScorePill score={closest.product.score} />
                </div>
                <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
                  Overlaps with {closest.overlap} of your {enriched.length} ingredient
                  {enriched.length === 1 ? '' : 's'}
                  {closest.product.priceMonthlyUSD && (
                    <>
                      {' '}
                      · <strong className="text-ds-ink">${closest.product.priceMonthlyUSD}/mo</strong>
                    </>
                  )}
                  .
                </p>
                <Link
                  href={`/${closest.product.slug}`}
                  className="inline-block mt-3 text-[12.5px] font-semibold text-ds-accent underline hover:text-ds-accent-press focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                >
                  See full review →
                </Link>
              </Card>
            )}

            <Card variant="subdued" padding={18} className="border-l-[3px] border-l-ds-warn">
              <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-warn-ink mb-2">
                Not medical advice
              </div>
              <p className="text-[12.5px] text-ds-ink-soft m-0 leading-[1.6]">
                Clinical doses come from peer-reviewed RCTs on healthy adults. Individual
                response varies. Always consult a clinician before starting any supplement,
                especially if you take medication or have a medical condition.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function AddIngredientPicker({
  available,
  onPick,
}: {
  available: Ingredient[];
  onPick: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={available.length === 0}
        className="inline-flex items-center gap-[6px] bg-ds-accent hover:bg-ds-accent-press text-white px-3 py-[8px] rounded-[8px] text-[12.5px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
      >
        <Plus size={14} strokeWidth={2.4} aria-hidden={true} />
        Add ingredient
      </button>
      {open && available.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Ingredients available to add"
            className="absolute right-0 top-full mt-2 z-20 w-[280px] max-h-[360px] overflow-y-auto bg-ds-card border border-ds-border rounded-[10px] shadow-[0_8px_24px_rgba(15,22,35,0.14)] p-1 list-none m-0"
          >
            {available.map((ing) => (
              <li key={ing.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    onPick(ing.slug);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-[8px] rounded-[6px] hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 cursor-pointer"
                >
                  <div className="text-[13px] font-semibold text-ds-ink">{ing.name}</div>
                  <div className="text-[11.5px] text-ds-muted">
                    Clinical: {ing.clinicalDose}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function StackRow({
  ingredient,
  dose,
  range,
  status,
  tone,
  onDoseChange,
  onRemove,
}: {
  ingredient: Ingredient;
  dose: number;
  range: ParsedDose;
  status: DoseStatus;
  tone: 'good' | 'warn' | 'bad';
  onDoseChange: (v: number) => void;
  onRemove: () => void;
}) {
  // Axis max for the visualizer = 1.5× the clinical max so "over" doses fit
  const axisMax = Math.max(range.max * 1.5, dose * 1.1);
  // Position of the in-range band, as percentages of the axis
  const bandLeft = (range.min / axisMax) * 100;
  const bandWidth = ((range.max - range.min) / axisMax) * 100;
  // Position of the current-dose marker, clamped to the track
  const markerPct = Math.max(0, Math.min(100, (dose / axisMax) * 100));

  const statusLabel: Record<DoseStatus, string> = {
    'in-range': '✓ In range',
    under: '✕ Under',
    over: '▸ Over',
  };

  return (
    <article className="p-5 border-b border-ds-border last:border-b-0">
      <div className="flex justify-between items-start gap-3 mb-3 flex-wrap">
        <div className="min-w-0">
          <div className="font-semibold text-[14px] text-ds-ink m-0">{ingredient.name}</div>
          <div className="text-[12px] text-ds-muted mt-[2px]">
            Clinical: {range.min}–{range.max}
            {range.unit}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="flex items-center gap-[6px]">
            <span className="ds-sr-only">Dose for {ingredient.name}</span>
            <input
              type="number"
              value={dose}
              min={0}
              step={1}
              onChange={(e) => onDoseChange(Number(e.target.value) || 0)}
              aria-label={`Dose for ${ingredient.name} in ${range.unit}`}
              className={`w-[70px] text-right ds-tabular font-semibold px-2 py-[5px] rounded-[6px] border bg-ds-card focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 ${
                tone === 'good'
                  ? 'text-ds-good border-ds-good'
                  : tone === 'warn'
                    ? 'text-ds-warn-ink border-ds-warn'
                    : 'text-ds-bad border-ds-bad'
              }`}
            />
            <span className="text-[12px] text-ds-muted">{range.unit}</span>
          </label>
          <Chip tone={tone}>{statusLabel[status]}</Chip>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${ingredient.name}`}
            className="w-7 h-7 grid place-items-center text-ds-muted hover:text-ds-bad rounded focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            <X size={14} strokeWidth={2.2} aria-hidden={true} />
          </button>
        </div>
      </div>

      {/* Visualizer */}
      <div className="relative h-2 bg-ds-border rounded-full overflow-hidden" aria-hidden="true">
        {/* Clinical-range band */}
        <div
          className="absolute top-0 bottom-0 bg-ds-good-soft"
          style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
        />
        {/* Current-dose marker */}
        <div
          className={`absolute top-[-3px] bottom-[-3px] w-[3px] rounded-[2px] ${
            tone === 'good' ? 'bg-ds-good' : tone === 'warn' ? 'bg-ds-warn' : 'bg-ds-bad'
          }`}
          style={{ left: `calc(${markerPct}% - 1.5px)` }}
        />
      </div>
      <div className="flex justify-between text-[10.5px] text-ds-muted mt-[6px] ds-tabular">
        <span>0</span>
        <span>
          Clinical {range.min}–{range.max}
          {range.unit}
        </span>
        <span>
          {Math.round(axisMax)}
          {range.unit}
        </span>
      </div>
    </article>
  );
}
