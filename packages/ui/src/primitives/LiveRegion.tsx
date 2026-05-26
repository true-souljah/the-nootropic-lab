// Persistent screen-reader announcement region. Always mounted in the DOM so
// assistive tech registers it; the `message` prop changes to trigger an
// announcement. Use this instead of conditionally rendering a toast — toasts
// that mount-then-unmount are never announced because AT only watches changes
// inside an aria-live container that already existed when the change happened.

import type { ReactNode } from 'react';

export interface LiveRegionProps {
  /** Message to announce. Falsy values render an empty region. */
  message?: ReactNode;
  /** `polite` (default) waits for the user to be idle; `assertive` interrupts. */
  politeness?: 'polite' | 'assertive';
}

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  return (
    <div role="status" aria-live={politeness} aria-atomic="true" className="ds-sr-only">
      {message ?? ''}
    </div>
  );
}
