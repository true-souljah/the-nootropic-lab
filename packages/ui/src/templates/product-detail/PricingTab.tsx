import { Card } from '../../primitives/Card';
import { Chip } from '../../primitives/Chip';
import TrackedAffiliateLink from '../../TrackedAffiliateLink';
import type { Product } from '@nootropic/data';

export interface PricingTabProps {
  product: Product;
}

export function PricingTab({ product: p }: PricingTabProps) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {(p.pricingModel === 'subscription' || p.pricingModel === 'both') && (
        <Card padding={22} className="border-l-[3px] border-l-ds-accent">
          <Chip tone="accent">Best price</Chip>
          <h3 className="text-[20px] font-bold tracking-[-0.01em] mt-3 mb-1 text-ds-ink">
            Subscribe &amp; save
          </h3>
          <div className="text-[13px] text-ds-muted mb-3">Auto-ship every 30 days</div>
          {p.priceMonthlyUSD && (
            <div className="text-right mb-4">
              <span className="text-[32px] font-bold tracking-[-0.02em] ds-tabular text-ds-accent">
                ${p.priceMonthlyUSD}
              </span>
              <span className="text-ds-muted text-[14px]">/mo</span>
            </div>
          )}
          <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-2">
            {['Lowest available price', `${p.moneyBackDays}-day money-back guarantee`, 'Cancel anytime', 'Free shipping'].map((b) => (
              <li
                key={b}
                className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border last:border-b-0"
              >
                <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <TrackedAffiliateLink
            product={p}
            position={1}
            surface="review"
            className="block w-full text-center bg-ds-accent hover:bg-ds-accent-press text-white border-0 py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            Visit {p.brand} →
          </TrackedAffiliateLink>
        </Card>
      )}

      {(p.pricingModel === 'one-time' || p.pricingModel === 'both') && (
        <Card padding={22}>
          <Chip>One-time</Chip>
          <h3 className="text-[20px] font-bold tracking-[-0.01em] mt-3 mb-1 text-ds-ink">
            Buy a single bottle
          </h3>
          <div className="text-[13px] text-ds-muted mb-3">No auto-renew</div>
          {p.priceMonthlyUSD && (
            <div className="text-right mb-4">
              <span className="text-[32px] font-bold tracking-[-0.02em] ds-tabular text-ds-ink">
                ${Math.round(p.priceMonthlyUSD * 1.15)}
              </span>
              <span className="text-ds-muted text-[14px]">/mo equiv.</span>
            </div>
          )}
          <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-2">
            <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border">
              <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
              <span>No subscription commitment</span>
            </li>
            <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border">
              <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
              <span>{p.moneyBackDays}-day money-back still applies</span>
            </li>
            <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px] border-b border-ds-border">
              <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
              <span>Faster delivery if in stock</span>
            </li>
            <li className="flex gap-2 text-[13.5px] text-ds-ink-soft py-[6px]">
              <span className="text-ds-bad font-bold shrink-0" aria-hidden="true">✕</span>
              <span>Higher per-bottle price than subscription</span>
            </li>
          </ul>
          <TrackedAffiliateLink
            product={p}
            position={2}
            surface="review"
            className="block w-full text-center bg-ds-card hover:bg-ds-card-sub text-ds-ink border border-ds-border py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
          >
            Buy single bottle →
          </TrackedAffiliateLink>
        </Card>
      )}

      <Card
        variant="subdued"
        padding={22}
        className="border-l-[3px] border-l-ds-muted"
        style={{ gridColumn: '1 / -1' }}
      >
        <h3 className="text-[16px] font-semibold m-0 mb-4 text-ds-ink">The fine print</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-1">
              Money-back
            </div>
            <div className="text-[16px] font-semibold text-ds-ink mb-1">{p.moneyBackDays} days</div>
            <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
              Full refund if you&apos;re not satisfied. Brand-direct guarantee, not Amazon&apos;s.
            </p>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-1">
              Cancellation
            </div>
            <div className="text-[16px] font-semibold text-ds-ink mb-1">In-account, no email</div>
            <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
              We score every brand on cancellation friction. Auto-deduct from the Trust pillar
              if you have to email to cancel.
            </p>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-1">
              Our affiliate cookie
            </div>
            <div className="text-[16px] font-semibold text-ds-ink mb-1">
              {p.cookieDays} days · {p.commissionRate} commission
            </div>
            <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
              We earn a commission on the click. Scores are computed before commission lookup
              — read the methodology to verify.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
