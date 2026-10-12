import Link from 'next/link';
import type { UIStrings } from '@nootropic/data';

/**
 * In-content "This page contains affiliate links" notice of a page with a
 * commission-earning buy link. `strings` is the page's locale bundle
 * (`uiStrings.disclosure`) and is required — no English fallback, so a
 * translated page never renders the English notice. The link label carries no
 * trailing punctuation, so no Latin full stop follows Japanese text.
 */
export default function AffiliateDisclosure({ strings: t }: { strings: UIStrings['disclosure'] }) {
  return (
    <div className="disclosure-banner mb-6" role="note" aria-label={t.badge}>
      {t.text}{' '}
      <Link href="/methodology/" className="underline">
        {t.methodology}
      </Link>
    </div>
  );
}
