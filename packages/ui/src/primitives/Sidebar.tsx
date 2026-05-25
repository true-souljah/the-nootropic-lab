'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType, ReactNode } from 'react';
import {
  Compass,
  LayoutGrid,
  Star,
  FlaskConical,
  Columns,
  Sigma,
  Heart,
  HelpCircle,
  DollarSign,
} from 'lucide-react';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  /** Optional override of the default groups. */
  groups?: SidebarGroup[];
  /** Product count rendered next to the version line. */
  productCount?: number;
  /** Wordmark text (e.g. "Nootropic Lab"). */
  wordmark?: string;
  /** Right-side meta (e.g. "v2026.04 · 47 products"). */
  meta?: string;
  /** Footer slot — defaults to a "Submit a tip →" mailto link. */
  footer?: ReactNode;
}

const DEFAULT_GROUPS: SidebarGroup[] = [
  {
    label: 'Browse',
    items: [
      { label: 'Discover', href: '/', icon: Compass },
      { label: 'All products', href: '/best-nootropics', icon: LayoutGrid },
      { label: 'Best of 2026', href: '/best-nootropics', icon: Star },
      { label: 'Ingredients', href: '/ingredients', icon: FlaskConical },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Comparator', href: '/nootropic-comparison', icon: Columns },
      { label: 'Dose calculator', href: '/dose-calculator', icon: Sigma },
      { label: 'My shortlist', href: '/shortlist', icon: Heart },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'Our methodology', href: '/methodology', icon: HelpCircle },
      { label: 'Disclosures', href: '/methodology#disclosures', icon: DollarSign },
    ],
  },
];

function isActiveHref(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sidebar — dark navigation rail used on app surfaces. Renders the
 * green-flask brand mark + grouped nav items + footer slot. Each link
 * marks `aria-current="page"` when its href matches the active route.
 */
export function Sidebar({
  groups = DEFAULT_GROUPS,
  wordmark = 'Nootropic Lab',
  meta,
  footer,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="bg-ds-side text-ds-side-ink py-5 sticky top-0 self-start min-h-screen flex flex-col"
    >
      <div className="px-[18px] pb-[22px] flex items-center gap-[10px]">
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
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
        <div className="leading-tight">
          <div className="font-bold text-[14px] tracking-tight">{wordmark}</div>
          {meta && <div className="text-[11px] text-ds-side-muted">{meta}</div>}
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.label} className="px-3 pt-[10px] pb-[4px]">
          <div className="text-[10px] tracking-[0.14em] uppercase text-ds-side-muted px-[10px] py-[6px]">
            {group.label}
          </div>
          {group.items.map((item) => {
            const active = isActiveHref(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-[10px] px-[10px] py-2 rounded-md text-[13px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring-on-dark focus-visible:outline-offset-2 ${
                  active
                    ? 'bg-[rgba(79,70,229,0.18)] text-ds-accent-border font-semibold'
                    : 'text-ds-side-ink font-medium'
                }`}
              >
                {Icon && (
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden={true}
                  />
                )}
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <div className="flex-1" />
      <div className="px-[18px] py-3 border-t border-white/5">
        {footer ?? (
          <a
            href="mailto:tips@thenootropiclab.com?subject=Tip%20for%20the%20Nootropic%20Lab"
            className="text-[12.5px] text-ds-side-ink hover:text-white focus-visible:outline-2 focus-visible:outline-ds-focus-ring-on-dark focus-visible:outline-offset-2 rounded"
          >
            Submit a tip →
          </a>
        )}
      </div>
    </nav>
  );
}

export default Sidebar;
