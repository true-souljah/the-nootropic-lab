'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import SearchModal from './SearchModal';
import type { SearchItem } from './SearchModal';

const navLinks = [
  { href: '/best-nootropics', label: 'Best Nootropics' },
  { href: '/nootropic-comparison', label: 'Compare' },
  { href: '/ingredients', label: 'Ingredients' },
  { href: '/guides', label: 'Guides' },
  { href: '/methodology', label: 'Methodology' },
];

type MarketKey = 'us' | 'eu' | 'ca' | 'au' | 'jp' | 'latam' | 'gcc' | 'sea';

const marketLabel: Record<MarketKey, string> = {
  us: '', eu: 'EU', ca: 'Canada', au: 'Australia',
  jp: 'Japan', latam: 'Latam', gcc: 'GCC', sea: 'SEA',
};

export default function SiteHeader({ market, searchItems = [] }: { market: MarketKey; searchItems?: SearchItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="The Nootropic Lab"
          >
            {/* Lab flask mark */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="#15803d" />
              <path
                d="M10 7h8M11 7v6l-4 7a1 1 0 00.9 1.5h12.2A1 1 0 0021 20l-4-7V7"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="13" cy="17" r="1" fill="#86efac" />
              <circle cx="16" cy="19" r="0.7" fill="#86efac" />
            </svg>
            <span className="font-bold text-gray-900 text-base tracking-tight leading-none">
              The Nootropic<br />
              <span className="text-green-700">Lab</span>
              {marketLabel[market] && (
                <span className="text-xs font-normal text-gray-400 ml-1">{marketLabel[market]}</span>
              )}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    active
                      ? 'text-green-700 bg-green-50 font-semibold'
                      : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          {searchItems.length > 0 && <SearchModal items={searchItems} />}

          {/* Desktop CTA */}
          <Link
            href="/best-nootropics"
            className="hidden md:inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            Top Picks
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-green-700 bg-green-50 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/best-nootropics"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Top Picks →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
