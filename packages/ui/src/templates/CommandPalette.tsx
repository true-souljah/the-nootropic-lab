'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { Search, FlaskConical, Package, Columns, FileText, Clock } from 'lucide-react';
import { ScorePill } from '../primitives/ScorePill';
import { LiveRegion } from '../primitives/LiveRegion';
import type { SearchItem } from '../SearchModal';
import type { UIStrings } from '@nootropic/data';

/** Cap user-supplied strings echoed into the live region. 40 chars is the
 *  conventional ceiling; longer queries get truncated with `…` (U+2026) so a
 *  pasted clipboard isn't read verbatim into the AT speech queue. */
const LIVE_REGION_QUERY_CAP = 40;

/** EN fallback for the aria-live messages — used when no `strings` prop
 *  is passed. Locale-bundle equivalents live in
 *  `packages/data/src/i18n.ts` under `search.liveRegion`. PR-Q29 (#93). */
const DEFAULT_LIVE_REGION_EN = {
  oneResult: '1 result',
  manyResults: '{n} results',
  noResults: 'No results for {query}',
} as const;

export interface CommandPaletteProps {
  items: SearchItem[];
  /** Visible label for the trigger button. Default: "Search" (icon + keycap shown). */
  triggerLabel?: string;
  /** Locale UIStrings bundle. When provided, sources the aria-live status
   *  messages from `strings.search.liveRegion.*`. Falls back to English
   *  defaults otherwise. PR-Q29 (#93). */
  strings?: UIStrings;
}

type Category = 'Ingredients' | 'Products' | 'Comparisons' | 'Guides' | 'Other';

interface CategorizedItem extends SearchItem {
  category: Category;
}

const CATEGORY_ORDER: Category[] = ['Ingredients', 'Products', 'Comparisons', 'Guides', 'Other'];
const RECENT_KEY = 'nootropic-command-recent';
const MAX_RECENT = 5;
const MAX_RESULTS_PER_CATEGORY = 6;

function categorize(item: SearchItem): Category {
  if (item.type === 'ingredient') return 'Ingredients';
  if (item.type === 'product') return 'Products';
  if (item.type === 'guide') return 'Guides';
  // 'page' bucket: detect head-to-head / 3-way URLs as Comparisons
  if (item.href.includes('-vs-')) return 'Comparisons';
  return 'Other';
}

function readRecent(items: SearchItem[]): SearchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const hrefs = JSON.parse(raw);
    if (!Array.isArray(hrefs)) return [];
    return (hrefs as string[])
      .map((h) => items.find((i) => i.href === h))
      .filter((i): i is SearchItem => Boolean(i))
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function pushRecent(href: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const list: string[] = raw ? (JSON.parse(raw) as string[]).filter((h) => h !== href) : [];
    list.unshift(href);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    // ignore
  }
}

/**
 * CommandPalette — ⌘K-triggered modal search with categorized results
 * (Ingredients / Products / Comparisons / Guides / Other), per-category
 * letter-tile icons, full keyboard navigation (↑/↓/Home/End/Enter/Esc),
 * recent items in the empty state. Drop-in replacement for SearchModal
 * — same `items: SearchItem[]` prop, same global ⌘K shortcut.
 */
export default function CommandPalette({
  items,
  triggerLabel = 'Search',
  strings,
}: CommandPaletteProps) {
  const liveStrings = strings?.search.liveRegion ?? DEFAULT_LIVE_REGION_EN;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery('');
    setActiveIndex(0);
    setRecent(readRecent(items));
  }, [items]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  // Global ⌘K / Ctrl+K + Esc
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) handleClose();
        else handleOpen();
      }
      if (e.key === 'Escape' && open) handleClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleOpen, handleClose]);

  // Auto-focus input on open
  useEffect(() => {
    if (open) {
      // Defer so the modal is mounted
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Filter + group items
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return null;
    const matches = items.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    });
    const grouped: Map<Category, CategorizedItem[]> = new Map();
    for (const item of matches) {
      const cat = categorize(item);
      if (!grouped.has(cat)) grouped.set(cat, []);
      const bucket = grouped.get(cat)!;
      if (bucket.length < MAX_RESULTS_PER_CATEGORY) {
        bucket.push({ ...item, category: cat });
      }
    }
    return grouped;
  }, [items, query]);

  // Flat, ordered list for keyboard navigation
  const flat = useMemo<CategorizedItem[]>(() => {
    if (query.trim().length === 0) {
      return recent.map((r) => ({ ...r, category: categorize(r) }));
    }
    if (!filtered) return [];
    const result: CategorizedItem[] = [];
    for (const cat of CATEGORY_ORDER) {
      const bucket = filtered.get(cat);
      if (bucket) result.push(...bucket);
    }
    return result;
  }, [query, recent, filtered]);

  // WCAG 4.1.3 Status Messages — announce filtered-result count changes
  // via a polite live region. Empty query: silent (the dialog open event
  // is the announcement). Non-empty query: "{n} result(s)" or
  // "No results for {capped query}". User-supplied text is capped at
  // LIVE_REGION_QUERY_CAP chars + … (U+2026) so a pasted clipboard isn't
  // read verbatim into the speech queue. PR-Q28 #92.
  //
  // PR-Q29 (#93) — phrasings sourced from `strings.search.liveRegion.*`
  // when `strings` prop is provided; falls back to DEFAULT_LIVE_REGION_EN
  // otherwise. Placeholder syntax: `{n}` for count, `{query}` for the
  // capped query echo.
  const liveMessage = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return '';
    if (flat.length === 0) {
      const echo =
        trimmed.length > LIVE_REGION_QUERY_CAP
          ? `${trimmed.slice(0, LIVE_REGION_QUERY_CAP)}…`
          : trimmed;
      return liveStrings.noResults.replace('{query}', echo);
    }
    if (flat.length === 1) return liveStrings.oneResult;
    return liveStrings.manyResults.replace('{n}', String(flat.length));
  }, [query, flat.length, liveStrings]);

  // Clamp activeIndex when the flat list changes
  useEffect(() => {
    if (activeIndex >= flat.length) setActiveIndex(Math.max(0, flat.length - 1));
  }, [flat.length, activeIndex]);

  // Scroll active row into view
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-result-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  function handleListKey(e: KeyboardEvent) {
    // Tab focus trap (PR-Q51 — WCAG 2.4.3 Focus Order, aria-modal
    // dialog contract). The combobox pattern uses
    // aria-activedescendant on the input — the rows are
    // tabIndex={-1} (see Row component) so the input is the only
    // Tab stop inside the dialog. Without explicit Tab handling
    // here, Tab from the input escapes to background page
    // focusables (Open comparator CTA, primary nav). Loop Tab
    // back to the input to keep focus trapped while the dialog
    // is open. Esc closes; arrows navigate the list.
    if (e.key === 'Tab') {
      e.preventDefault();
      inputRef.current?.focus();
      return;
    }
    if (flat.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(flat.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = flat[activeIndex];
      if (target) {
        pushRecent(target.href);
        window.location.href = target.href;
      }
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-label={`${triggerLabel} (⌘K)`}
        className="hidden md:inline-flex items-center gap-2 bg-ds-card-sub border border-ds-border text-ds-muted text-[13px] px-3 py-[6px] rounded-[8px] hover:text-ds-ink hover:border-ds-border-strong focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
      >
        <Search size={14} strokeWidth={2} aria-hidden={true} />
        <span>{triggerLabel}</span>
        <kbd
          aria-hidden="true"
          className="text-[11px] bg-ds-card border border-ds-border px-[6px] py-[1px] rounded-[4px] font-medium text-ds-muted"
        >
          ⌘K
        </kbd>
      </button>

      {/* Mobile trigger (icon-only) */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Search"
        className="md:hidden inline-flex items-center justify-center w-9 h-9 text-ds-muted hover:text-ds-ink rounded focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
      >
        <Search size={18} strokeWidth={2} aria-hidden={true} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[80px] px-5"
          onClick={handleClose}
          role="presentation"
        >
          {/* Scrim */}
          <div
            className="fixed inset-0"
            style={{ background: 'rgba(11,18,32,0.55)' }}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full bg-ds-card border border-ds-border rounded-[14px] overflow-hidden flex flex-col"
            style={{
              maxWidth: 640,
              maxHeight: 'calc(100vh - 160px)',
              boxShadow: '0 24px 60px rgba(15,22,35,0.32)',
            }}
            onKeyDown={handleListKey}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-[18px] border-b border-ds-border">
              <Search
                size={18}
                strokeWidth={2}
                aria-hidden={true}
                className="text-ds-muted shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Search products, ingredients, comparisons, guides…"
                className="flex-1 bg-transparent border-0 text-ds-ink text-[16px] outline-none placeholder:text-ds-muted"
                aria-label="Search"
                aria-controls="palette-results"
                aria-activedescendant={
                  flat[activeIndex] ? `palette-row-${activeIndex}` : undefined
                }
                autoComplete="off"
                spellCheck={false}
              />
              <kbd
                aria-hidden="true"
                className="text-[11px] bg-ds-card-sub border border-ds-border px-[6px] py-[2px] rounded-[4px] font-medium text-ds-muted"
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div
              id="palette-results"
              ref={listRef}
              role="listbox"
              aria-label={query.trim() ? 'Search results' : 'Recent and trending'}
              className="overflow-y-auto flex-1"
            >
              {query.trim().length === 0 ? (
                <EmptyState recent={recent} activeIndex={activeIndex} setActiveIndex={setActiveIndex} onPick={(href) => { pushRecent(href); }} />
              ) : !filtered || flat.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[13px] text-ds-muted m-0">
                    No results for{' '}
                    <span className="text-ds-ink font-semibold">&ldquo;{query}&rdquo;</span>
                  </p>
                </div>
              ) : (
                CATEGORY_ORDER.map((cat) => {
                  const bucket = filtered.get(cat);
                  if (!bucket || bucket.length === 0) return null;
                  const startIndex = flat.findIndex((it) => it.category === cat);
                  return (
                    <Section
                      key={cat}
                      label={cat}
                      count={bucket.length}
                      items={bucket}
                      flatStartIndex={startIndex}
                      activeIndex={activeIndex}
                      setActiveIndex={setActiveIndex}
                      onPick={(href) => pushRecent(href)}
                    />
                  );
                })
              )}
            </div>

            {/*
              WCAG 4.1.3 Status Messages — persistent live region so AT
              announces filtered-result count changes as the user types.
              Mounted unconditionally while the dialog is open (per the
              a11y review note: live regions must exist BEFORE the
              mutation to be announced; not gated on `liveMessage`
              truthiness). PR-Q28 #92.
            */}
            <LiveRegion message={liveMessage} />

            {/* Footer keycap bar */}
            <div className="flex items-center justify-between gap-3 px-4 py-[10px] bg-ds-card-sub border-t border-ds-border text-[11px] text-ds-muted">
              <div className="flex items-center gap-3 flex-wrap">
                <KeycapHint keys={['↑', '↓']} label="navigate" />
                <KeycapHint keys={['↵']} label="open" />
                <KeycapHint keys={['esc']} label="close" />
              </div>
              <div className="text-[11px] text-ds-muted ds-tabular">
                {items.length.toLocaleString()} indexed
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState({
  recent,
  activeIndex,
  setActiveIndex,
  onPick,
}: {
  recent: SearchItem[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onPick: (href: string) => void;
}) {
  if (recent.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-[13px] text-ds-muted m-0">
          Type to search products, ingredients, comparisons, or guides.
        </p>
      </div>
    );
  }
  return (
    <Section
      label="Recent"
      count={recent.length}
      items={recent.map((r) => ({ ...r, category: categorize(r) }))}
      flatStartIndex={0}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      onPick={onPick}
      eyebrowIcon={<Clock size={11} strokeWidth={2} aria-hidden={true} />}
    />
  );
}

function Section({
  label,
  count,
  items,
  flatStartIndex,
  activeIndex,
  setActiveIndex,
  onPick,
  eyebrowIcon,
}: {
  label: string;
  count: number;
  items: CategorizedItem[];
  flatStartIndex: number;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onPick: (href: string) => void;
  eyebrowIcon?: React.ReactNode;
}) {
  return (
    <div>
      <div
        role="presentation"
        className="px-4 pt-3 pb-1 text-[10.5px] uppercase tracking-[0.12em] font-semibold text-ds-muted flex items-center gap-2"
      >
        {eyebrowIcon}
        <span>
          {label} · {count}
        </span>
      </div>
      {items.map((item, i) => {
        const flatIndex = flatStartIndex + i;
        const active = flatIndex === activeIndex;
        return (
          <ResultRow
            key={item.href}
            item={item}
            active={active}
            id={`palette-row-${flatIndex}`}
            dataIndex={flatIndex}
            onMouseEnter={() => setActiveIndex(flatIndex)}
            onClick={() => onPick(item.href)}
          />
        );
      })}
    </div>
  );
}

function ResultRow({
  item,
  active,
  id,
  dataIndex,
  onMouseEnter,
  onClick,
}: {
  item: CategorizedItem;
  active: boolean;
  id: string;
  dataIndex: number;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  // Build a single aria-label that includes the meta value so screen
  // readers announce score / grade as part of the option name (per the
  // M6 a11y review — listbox options speak their accessible name, not
  // arbitrary visual children).
  const metaSpoken = item.meta?.score !== undefined
    ? `, score ${item.meta.score.toFixed(1)} out of 10`
    : item.meta?.grade
      ? `, evidence grade ${item.meta.grade}`
      : '';
  const ariaLabel = `${item.title}${metaSpoken}${item.description ? ` — ${item.description}` : ''}`;

  return (
    <Link
      href={item.href}
      id={id}
      role="option"
      aria-selected={active}
      aria-label={ariaLabel}
      data-result-index={dataIndex}
      // WCAG combobox pattern (PR-Q51): the input owns the
      // listbox via aria-activedescendant; rows must NOT be Tab
      // stops or Tab can escape the dialog when result count is
      // smaller than the test's Tab count (caught by SEA "nat"
      // → 3 results — Tab 4 escapes to background CTA on AU/GCC/US
      // this is masked because their queries return 5+ results).
      // tabIndex={-1} keeps rows mouse-clickable + arrow-navigable
      // (via aria-activedescendant) but out of the Tab sequence.
      tabIndex={-1}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 border-l-[3px] transition-colors focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-[-2px] ${
        active
          ? 'bg-ds-accent-soft border-l-ds-accent'
          : 'border-l-transparent hover:bg-ds-card-sub'
      }`}
    >
      <CategoryTile category={item.category} title={item.title} grade={item.meta?.grade} />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[14px] text-ds-ink truncate">{item.title}</div>
        {item.description && (
          <div className="text-[12px] text-ds-muted truncate">{item.description}</div>
        )}
      </div>
      {/* Right-aligned meta — aria-hidden because the score/grade is
          already in the option's aria-label above. */}
      <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
        {item.meta?.score !== undefined && <ScorePill score={item.meta.score} />}
        {active && (
          <kbd className="text-[10.5px] bg-ds-card border border-ds-accent-border text-ds-accent px-[6px] py-[1px] rounded-[4px] font-semibold">
            ↵
          </kbd>
        )}
      </div>
    </Link>
  );
}

function CategoryTile({
  category,
  title,
  grade,
}: {
  category: Category;
  title: string;
  grade?: 'A' | 'B' | 'C';
}) {
  if (category === 'Ingredients') {
    // Use the derived evidence grade when available (A green / B amber / C red);
    // fall back to the flask icon otherwise.
    if (grade) {
      const cls =
        grade === 'A'
          ? 'bg-ds-good-soft text-ds-good-ink'
          : grade === 'B'
            ? 'bg-ds-warn-soft text-ds-warn-ink'
            : 'bg-ds-bad-soft text-ds-bad-ink';
      return (
        <div
          className={`w-9 h-9 rounded-[8px] grid place-items-center font-extrabold text-[14px] flex-shrink-0 ${cls}`}
          aria-hidden="true"
        >
          {grade}
        </div>
      );
    }
    return (
      <div
        className="w-9 h-9 rounded-[8px] bg-ds-good-soft text-ds-good-ink grid place-items-center flex-shrink-0"
        aria-hidden="true"
      >
        <FlaskConical size={16} strokeWidth={1.8} />
      </div>
    );
  }
  if (category === 'Products') {
    return (
      <div
        className="w-9 h-9 rounded-[8px] bg-ds-ink text-white grid place-items-center font-extrabold text-[14px] flex-shrink-0"
        aria-hidden="true"
      >
        {title[0]}
      </div>
    );
  }
  if (category === 'Comparisons') {
    return (
      <div
        className="w-9 h-9 rounded-[8px] bg-ds-card-sub border border-ds-border text-ds-ink-soft grid place-items-center flex-shrink-0"
        aria-hidden="true"
      >
        <Columns size={16} strokeWidth={1.8} />
      </div>
    );
  }
  if (category === 'Guides') {
    return (
      <div
        className="w-9 h-9 rounded-[8px] bg-ds-card-sub border border-ds-border text-ds-ink-soft grid place-items-center flex-shrink-0"
        aria-hidden="true"
      >
        <FileText size={16} strokeWidth={1.8} />
      </div>
    );
  }
  return (
    <div
      className="w-9 h-9 rounded-[8px] bg-ds-card-sub border border-ds-border text-ds-ink-soft grid place-items-center flex-shrink-0"
      aria-hidden="true"
    >
      <Package size={16} strokeWidth={1.8} />
    </div>
  );
}

function KeycapHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="inline-flex items-center gap-[6px]">
      <span className="inline-flex items-center gap-[2px]">
        {keys.map((k) => (
          <kbd
            key={k}
            aria-hidden="true"
            className="bg-ds-card border border-ds-border text-ds-ink-soft px-[5px] py-[1px] rounded-[3px] text-[10px] font-medium ds-tabular"
          >
            {k}
          </kbd>
        ))}
      </span>
      <span className="text-ds-muted">{label}</span>
    </span>
  );
}
