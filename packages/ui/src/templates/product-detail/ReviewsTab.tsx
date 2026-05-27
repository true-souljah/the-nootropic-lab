import { Card } from '../../primitives/Card';
import type { Product } from '@nootropic/data';

export interface ReviewsTabProps {
  product: Product;
}

export function ReviewsTab({ product: p }: ReviewsTabProps) {
  const trustpilotHost = (() => {
    try {
      return new URL(p.affiliateUrl).host;
    } catch {
      return p.affiliateUrl;
    }
  })();

  return (
    <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-[320px_1fr]">
      <Card padding={22}>
        <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-2">
          Trustpilot
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[44px] font-bold tracking-[-0.02em] ds-tabular text-ds-ink">
            {p.trustpilotScore}
          </span>
          <span className="text-[14px] text-ds-muted">/ 5.0</span>
        </div>
        <div
          className="flex gap-[2px] mt-2"
          aria-label={`${p.trustpilotScore} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              aria-hidden="true"
              className={star <= Math.round(p.trustpilotScore) ? 'text-ds-warn' : 'text-ds-faint'}
            >
              ★
            </span>
          ))}
        </div>
        <div className="text-[12px] text-ds-muted mt-2">
          {p.trustpilotCount.toLocaleString()} reviews on Trustpilot
        </div>
      </Card>

      <Card padding={28}>
        <div className="flex flex-col items-center text-center max-w-[480px] mx-auto">
          <div
            className="w-16 h-16 bg-ds-good-soft text-ds-good-ink rounded-full grid place-items-center text-[28px] font-bold mb-4"
            aria-hidden="true"
          >
            ★
          </div>
          <h3 className="text-[20px] font-bold tracking-[-0.01em] m-0 mb-2 text-ds-ink">
            {p.trustpilotCount.toLocaleString()} verified reviews
          </h3>
          <p className="text-[13.5px] text-ds-ink-soft m-0 mb-5 leading-[1.6]">
            We don&apos;t embed cherry-picked quotes here. Trustpilot is the canonical source —
            the score above feeds into our Trust pillar.
          </p>
          <a
            href={`https://www.trustpilot.com/review/${trustpilotHost}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white px-5 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            Read all {p.trustpilotCount.toLocaleString()} reviews on Trustpilot →
          </a>
        </div>
      </Card>
    </div>
  );
}
