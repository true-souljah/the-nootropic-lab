'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface SearchItem {
  title: string;
  href: string;
  type: 'product' | 'ingredient' | 'guide' | 'page';
  description?: string;
}

interface Props {
  items: SearchItem[];
}

export default function SearchModal({ items }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filtered = query.length < 2
    ? []
    : items.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
        );
      }).slice(0, 8);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery('');
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery('');
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleOpen, handleClose]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const typeIcons: Record<string, string> = {
    product: '📦',
    ingredient: '🧪',
    guide: '📖',
    page: '📄',
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        aria-label="Search site (Ctrl+K)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>Search</span>
        <kbd className="text-xs bg-white border border-gray-300 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>

      {/* Mobile search button */}
      <button
        onClick={handleOpen}
        className="md:hidden p-2 text-gray-500 hover:text-gray-700"
        aria-label="Search site"
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
        >
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div
            className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                const focusable = e.currentTarget.querySelectorAll<HTMLElement>(
                  'input, button, a[href]'
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-gray-400 shrink-0" aria-hidden="true">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, ingredients, guides..."
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                aria-label="Search"
              />
              <button
                onClick={handleClose}
                className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.length < 2 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  Type at least 2 characters to search
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <ul className="py-2">
                  {filtered.map(item => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={handleClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg shrink-0" aria-hidden="true">
                          {typeIcons[item.type] || '📄'}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 truncate">{item.description}</div>
                          )}
                        </div>
                        <span className="ml-auto text-xs text-gray-400 capitalize shrink-0">{item.type}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
