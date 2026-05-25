import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps {
  /** Title rendered as an H2 inside the error card. */
  title?: string;
  /** Body copy under the title. */
  message?: string;
  /** Optional "Try again" action. When omitted, the button is hidden. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Optional extra content rendered below the retry row (e.g. a help link). */
  children?: ReactNode;
}

/**
 * ErrorState — bad-tinted card for fetch failures, render errors, and
 * unexpected empty states. Uses ds-bad / ds-bad-soft tokens (AA
 * contrast verified in tokens.css comments). Carries role="alert" so
 * screen readers announce it on mount.
 */
export function ErrorState({
  title = 'Something went wrong',
  message = "Couldn't load this list. Try again.",
  onRetry,
  retryLabel = 'Try again',
  children,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="bg-ds-bad-soft border border-ds-bad rounded-[10px] p-5 flex gap-3 items-start"
    >
      <AlertCircle
        size={20}
        strokeWidth={2}
        aria-hidden={true}
        className="text-ds-bad shrink-0 mt-[2px]"
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] font-semibold text-ds-bad-ink m-0">{title}</h2>
        <p className="text-[13px] text-ds-ink-soft m-0 mt-1 leading-[1.55]">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-block bg-ds-card border border-ds-bad text-ds-bad-ink px-4 py-[7px] rounded-[8px] text-[12.5px] font-semibold cursor-pointer hover:bg-ds-bad-soft focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            {retryLabel}
          </button>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}

export default ErrorState;
