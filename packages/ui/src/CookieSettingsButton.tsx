'use client';
import Link from 'next/link';
import { openCookieSettings } from './CookieBanner';

export interface CookieSettingsButtonProps {
  /** Localized label (UIStrings.cookie.settings). */
  label: string;
  className?: string;
}

/**
 * Persistent consent-withdraw control: re-opens the Klaro consent manager so
 * the visitor can change or withdraw their choice on any page. Rendered by
 * every page chrome (FPFooter, AppShell, the quiz, region 404s, standalone
 * pages); `data-cookie-settings` is the hook scripts/check-consent-built.mjs
 * asserts on every built page.
 */
export function CookieSettingsButton({ label, className }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      data-cookie-settings=""
      onClick={() => {
        openCookieSettings().catch((err: unknown) => {
          // The consent-manager chunk failed to load (offline / blocked). No
          // tracker can have loaded either, since Klaro gates them all.
          console.error('Cookie settings: consent manager failed to load', err);
        });
      }}
      className={className}
    >
      {label}
    </button>
  );
}

export interface CookieSettingsBarProps {
  /** Localized "Cookie settings" label (UIStrings.cookie.settings). */
  label: string;
  /** Localized privacy-policy link text (UIStrings.footer.about.privacy). */
  privacyLabel: string;
  /** Localized cookie-policy link text (UIStrings.footer.about.cookies). */
  cookiePolicyLabel: string;
}

const BAR_ITEM =
  'inline-flex items-center min-h-[24px] text-[12.5px] text-ds-ink-soft underline underline-offset-2 hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[4px]';

/**
 * Bottom-of-page strip for surfaces that have no FPFooter (AppShell app
 * pages incl. the US homepage, the quiz, standalone landing pages, 404s):
 * the withdraw control plus the privacy- and cookie-policy links, so every
 * page links the policy that names the cookies.
 */
export function CookieSettingsBar({ label, privacyLabel, cookiePolicyLabel }: CookieSettingsBarProps) {
  return (
    <div className="border-t border-ds-border px-4 sm:px-7 py-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      <CookieSettingsButton label={label} className={`${BAR_ITEM} p-0 bg-transparent border-0 cursor-pointer`} />
      <Link href="/privacy-policy/" className={BAR_ITEM}>
        {privacyLabel}
      </Link>
      <Link href="/cookie-policy/" className={BAR_ITEM}>
        {cookiePolicyLabel}
      </Link>
    </div>
  );
}

export default CookieSettingsButton;
