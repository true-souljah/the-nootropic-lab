'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nootropic-shortlist';
const NOTES_PREFIX = 'nootropic-shortlist-note:';

interface ShortlistEvent extends CustomEvent {
  detail: { slugs: string[] };
}

function readSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function writeSlugs(slugs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    // Notify other tabs (storage event) AND same-tab listeners (custom event)
    window.dispatchEvent(
      new CustomEvent('nootropic-shortlist-change', { detail: { slugs } })
    );
  } catch {
    // localStorage may be unavailable (Safari private mode, etc.) — fail silent
  }
}

/**
 * useShortlist — localStorage-backed shortlist of product slugs.
 * Syncs across tabs via the `storage` event and within a tab via a
 * custom `nootropic-shortlist-change` event. SSR-safe (empty array
 * on the server, hydrates with real data after mount).
 */
export function useShortlist() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSlugs(readSlugs());
    setHydrated(true);

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setSlugs(readSlugs());
    }
    function onCustom(e: Event) {
      const detail = (e as ShortlistEvent).detail;
      if (detail) setSlugs(detail.slugs);
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('nootropic-shortlist-change', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('nootropic-shortlist-change', onCustom);
    };
  }, []);

  const add = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      writeSlugs(next);
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => {
      if (!prev.includes(slug)) return prev;
      const next = prev.filter((s) => s !== slug);
      writeSlugs(next);
      return next;
    });
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      writeSlugs(next);
      return next;
    });
  }, []);

  const move = useCallback((slug: string, direction: -1 | 1) => {
    setSlugs((prev) => {
      const idx = prev.indexOf(slug);
      const target = idx + direction;
      if (idx === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      writeSlugs(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSlugs([]);
    writeSlugs([]);
  }, []);

  const replace = useCallback((nextSlugs: string[]) => {
    setSlugs(nextSlugs);
    writeSlugs(nextSlugs);
  }, []);

  const isIn = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, hydrated, add, remove, toggle, move, clear, replace, isIn };
}

/**
 * useShortlistNote — per-product note text, persisted to localStorage
 * keyed by `nootropic-shortlist-note:<slug>`. Returns [note, setNote]
 * where setNote auto-saves.
 */
export function useShortlistNote(slug: string) {
  const [note, setNoteState] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(NOTES_PREFIX + slug) ?? '';
      setNoteState(raw);
    } catch {
      setNoteState('');
    }
    setHydrated(true);
  }, [slug]);

  const setNote = useCallback(
    (next: string) => {
      setNoteState(next);
      if (typeof window === 'undefined') return;
      try {
        if (next.trim()) {
          window.localStorage.setItem(NOTES_PREFIX + slug, next);
        } else {
          window.localStorage.removeItem(NOTES_PREFIX + slug);
        }
      } catch {
        // ignore
      }
    },
    [slug]
  );

  return [note, setNote, hydrated] as const;
}
