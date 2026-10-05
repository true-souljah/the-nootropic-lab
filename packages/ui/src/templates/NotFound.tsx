import Link from 'next/link';
import PublicShell from './PublicShell';
import type { SearchItem } from '../SearchModal';
import type { UIStrings } from '@nootropic/data';

export interface NotFoundProps {
  title: string;
  body: string;
  homeLabel: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
}

/**
 * Region 404 page inside the public chrome, so a visitor who lands on a dead
 * URL still gets the header, the footer and its persistent "Cookie settings"
 * consent control (Next's built-in 404 renders none of them).
 */
export default function NotFound({ title, body, homeLabel, searchItems, uiStrings }: NotFoundProps) {
  return (
    <PublicShell searchItems={searchItems} uiStrings={uiStrings} hideDisclosure>
      <div className="max-w-[640px] mx-auto px-6 pt-16 pb-16 text-center">
        <div
          className="text-[12px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-3"
          aria-hidden="true"
        >
          404
        </div>
        <h1 className="text-[36px] font-bold tracking-[-0.02em] text-ds-ink m-0 mb-3 leading-[1.1]">{title}</h1>
        <p className="text-[15px] text-ds-ink-soft m-0 mb-8 leading-[1.6]">{body}</p>
        <Link
          href="/"
          className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white px-6 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          {homeLabel}
        </Link>
      </div>
    </PublicShell>
  );
}
