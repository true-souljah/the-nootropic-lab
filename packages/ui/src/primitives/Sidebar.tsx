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
import type { RegionalRegionCode as RegionCode, UIStrings } from '@nootropic/data';
import { ALL_REGIONS, routeAvailableIn } from '@nootropic/data';

/** Rail labels: `UIStrings.nav.sidebar` of the page's locale bundle. */
export type SidebarLabels = UIStrings['nav']['sidebar'];

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
  /** Optional override of the default groups (their labels are used as given). */
  groups?: SidebarGroup[];
  /** Locale labels of the default groups, the footer link and the landmark (default: English). */
  labels?: SidebarLabels;
  /** Accessible name of the rail's `<nav>` landmark (`UIStrings.nav.primaryLandmark`). */
  landmarkLabel?: string;
  /** Product count rendered next to the version line. */
  productCount?: number;
  /** Wordmark text (e.g. "Nootropic Lab"). */
  wordmark?: string;
  /** Right-side meta (e.g. "v2026.04 · 47 products"). */
  meta?: string;
  /** Footer slot — defaults to a "Submit a tip →" mailto link. */
  footer?: ReactNode;
}

/** English labels for callers without a locale bundle; the en bundle's `nav.sidebar` (pinned by review-page-i18n-rest.test.ts). */
export const SIDEBAR_LABELS_EN: SidebarLabels = {
  browse: 'Browse',
  discover: 'Discover',
  allProducts: 'All products',
  bestOf2026: 'Best of 2026',
  ingredients: 'Ingredients',
  tools: 'Tools',
  comparator: 'Comparator',
  doseCalculator: 'Dose calculator',
  myShortlist: 'My shortlist',
  about: 'About',
  ourMethodology: 'Our methodology',
  disclosures: 'Disclosures',
  submitTip: 'Submit a tip →',
};

/** The rail's groups with labels from `labels`; routes and icons are the same in every locale. */
export function sidebarGroups(labels: SidebarLabels): SidebarGroup[] {
  return [
    {
      label: labels.browse,
      items: [
        { label: labels.discover, href: '/', icon: Compass },
        { label: labels.allProducts, href: '/best-nootropics/', icon: LayoutGrid },
        { label: labels.bestOf2026, href: '/best-nootropics/', icon: Star },
        { label: labels.ingredients, href: '/ingredients/', icon: FlaskConical },
      ],
    },
    {
      label: labels.tools,
      items: [
        { label: labels.comparator, href: '/nootropic-comparison/', icon: Columns },
        { label: labels.doseCalculator, href: '/dose-calculator/', icon: Sigma },
        { label: labels.myShortlist, href: '/shortlist/', icon: Heart },
      ],
    },
    {
      label: labels.about,
      items: [
        { label: labels.ourMethodology, href: '/methodology/', icon: HelpCircle },
        { label: labels.disclosures, href: '/methodology/#disclosures', icon: DollarSign },
      ],
    },
  ];
}

export const DEFAULT_GROUPS: SidebarGroup[] = sidebarGroups(SIDEBAR_LABELS_EN);

// Hrefs carry the trailing slash (trailingSlash: true); compare slash-insensitively
// so "/guides/" is active on "/guides", "/guides/" and "/guides/x/".
export function isActiveHref(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  const base = href.replace(/\/+$/, '');
  const path = pathname.replace(/\/+$/, '');
  return path === base || path.startsWith(`${base}/`);
}

/**
 * Keep only items whose route exists on `region`'s host. /dose-calculator/
 * and /shortlist/ exist only in apps/us; the unfiltered rail linked them on
 * every region (dead links, found once the rail moved into the static HTML).
 */
export function groupsForRegion(groups: SidebarGroup[], region: RegionCode): SidebarGroup[] {
  return groups
    .map((group) => ({ ...group, items: group.items.filter((item) => routeAvailableIn(item.href, region)) }))
    .filter((group) => group.items.length > 0);
}

/** Build-time region (`env.NEXT_PUBLIC_REGION` in each app's next.config.ts); fails closed like FPFooter. */
function buildRegion(): RegionCode {
  const tag = process.env.NEXT_PUBLIC_REGION;
  if (tag === undefined || !(ALL_REGIONS as readonly string[]).includes(tag)) {
    throw new Error(`Sidebar: NEXT_PUBLIC_REGION is "${tag ?? ''}" — set it to one of ${ALL_REGIONS.join('|')}.`);
  }
  return tag as RegionCode;
}

/**
 * Sidebar — dark navigation rail used on app surfaces. Renders the
 * green-flask brand mark + grouped nav items + footer slot. Each link
 * marks `aria-current="page"` when its href matches the active route.
 */
export function Sidebar({
  groups,
  labels = SIDEBAR_LABELS_EN,
  landmarkLabel = 'Primary',
  wordmark = 'Nootropic Lab',
  meta,
  footer,
}: SidebarProps) {
  const pathname = usePathname();
  const regionGroups = groupsForRegion(groups ?? sidebarGroups(labels), buildRegion());

  return (
    <nav
      aria-label={landmarkLabel}
      className="bg-ds-side text-ds-side-ink py-5 sticky top-0 self-start min-h-screen flex flex-col"
    >
      <div className="px-[18px] pb-[22px] flex items-center gap-[10px]">
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect width="28" height="28" rx="6" className="fill-ds-brand" />
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

      {regionGroups.map((group) => (
        <div key={group.label} className="px-3 pt-[10px] pb-[4px]">
          <div className="text-[10px] tracking-[0.14em] uppercase text-ds-side-muted px-[10px] py-[6px]">
            {group.label}
          </div>
          {group.items.map((item) => {
            const active = isActiveHref(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
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
            {labels.submitTip}
          </a>
        )}
      </div>
    </nav>
  );
}

export default Sidebar;
