import Link from 'next/link';
import type { UIStrings } from '@nootropic/data';

export default function AffiliateDisclosure({ strings }: { strings?: UIStrings }) {
  const t = strings?.disclosure;
  return (
    <div className="disclosure-banner mb-6" role="note" aria-label="Affiliate disclosure">
      {t?.text || 'Affiliate disclosure: This page contains affiliate links. If you purchase through our links, we may earn a commission at no extra cost to you. Our editorial opinions are independent — we only recommend products we have independently researched.'}{' '}
      <Link href="/methodology" className="underline">
        {t?.methodology || 'Read our methodology'}
      </Link>
      .
    </div>
  );
}
