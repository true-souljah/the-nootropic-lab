'use client';
import { openCookieSettings } from './CookieBanner';

export interface CookieSettingsButtonProps {
  /** Localized label (UIStrings.cookie.settings). */
  label: string;
  className?: string;
}

/**
 * Persistent consent-withdraw control: re-opens the Klaro consent manager so
 * the visitor can change or withdraw their choice on any page. Rendered by
 * every page chrome (FPFooter + AppShell); `data-cookie-settings` is the hook
 * the built-output consent check and the e2e consent specs look for.
 */
export function CookieSettingsButton({ label, className }: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      data-cookie-settings=""
      onClick={() => {
        void openCookieSettings();
      }}
      className={className}
    >
      {label}
    </button>
  );
}

/**
 * Bottom-of-page strip carrying the withdraw control, for surfaces that have
 * no FPFooter (AppShell app pages, the quiz, standalone landing pages).
 */
export function CookieSettingsBar({ label }: { label: string }) {
  return (
    <div className="border-t border-ds-border px-4 sm:px-7 py-4">
      <CookieSettingsButton
        label={label}
        className="inline-flex items-center min-h-[24px] p-0 bg-transparent border-0 cursor-pointer text-[12.5px] text-ds-ink-soft underline underline-offset-2 hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[4px]"
      />
    </div>
  );
}

export default CookieSettingsButton;
