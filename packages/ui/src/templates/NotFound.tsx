import Link from 'next/link';
import { CookieSettingsBar } from '../CookieSettingsButton';

export interface NotFoundProps {
  title: string;
  body: string;
  homeLabel: string;
  /** Localized label of the persistent consent control (UIStrings.cookie.settings). */
  cookieSettingsLabel: string;
}

/**
 * Region 404 page carrying the persistent "Cookie settings" consent control
 * (Next's built-in 404 renders no page chrome at all).
 *
 * Deliberately minimal — no PublicShell/search index: Next.js serializes the
 * root not-found tree into the RSC payload of EVERY page, so anything passed
 * here ships on all routes (the full search index would bloat every page and
 * leak English strings into CA /fr/* payloads — see e2e/ca-fr-chrome.spec.ts).
 */
export default function NotFound({ title, body, homeLabel, cookieSettingsLabel }: NotFoundProps) {
  return (
    <div className="bg-ds-bg text-ds-ink min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-ds-sans)' }}>
      <main className="flex-1 max-w-[640px] mx-auto px-6 pt-16 pb-16 text-center">
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
      </main>
      <CookieSettingsBar label={cookieSettingsLabel} />
    </div>
  );
}
