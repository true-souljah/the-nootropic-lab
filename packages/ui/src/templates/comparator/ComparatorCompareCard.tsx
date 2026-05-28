// Side-by-side compare drawer rendered below the product table when ≥1
// rows are selected. Renders 1-3 product cards with quick-spec dl + the
// 3-pillar score bars. State is owned by the parent Comparator.

import Link from 'next/link';
import { X } from 'lucide-react';
import { Card } from '../../primitives/Card';
import { ScorePill } from '../../primitives/ScorePill';
import { Bar } from '../../primitives/Bar';
import type { Product } from '@nootropic/data';

export interface ComparatorCompareCardProps {
  selectedProducts: Product[];
  onClear: () => void;
}

export function ComparatorCompareCard({ selectedProducts, onClear }: ComparatorCompareCardProps) {
  if (selectedProducts.length === 0) return null;
  return (
    <Card
      padding={18}
      className="mt-4 mb-6 border-ds-accent-border"
      style={{
        borderColor: 'var(--color-ds-accent-border)',
        boxShadow: '0 4px 16px rgba(15,22,35,0.06)',
      }}
    >
      <div className="flex justify-between items-center mb-[14px] flex-wrap gap-2">
        <div>
          <div className="text-[11px] text-ds-accent tracking-[0.14em] uppercase font-bold">
            Compare
          </div>
          <div className="font-semibold text-[15px] mt-[2px]">
            {selectedProducts.length} selected · side by side
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 bg-transparent text-ds-muted border border-ds-border px-3 py-[6px] rounded-[6px] text-[12px] cursor-pointer hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          <X size={12} strokeWidth={2.4} aria-hidden={true} />
          Clear
        </button>
      </div>
      <div
        className="grid gap-[14px]"
        style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)` }}
      >
        {selectedProducts.map((p) => (
          <Card key={p.slug} variant="subdued" padding={14}>
            <div className="flex items-center gap-[10px]">
              <div
                className="w-8 h-8 bg-ds-ink rounded-[7px] grid place-items-center text-white font-bold text-[13px] flex-shrink-0"
                aria-hidden="true"
              >
                {p.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/${p.slug}`}
                  className="font-semibold text-[14px] truncate block text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                >
                  {p.name}
                </Link>
                <div className="text-[11px] text-ds-muted">{p.brand}</div>
              </div>
              <ScorePill score={p.score} />
            </div>
            <dl className="mt-3 text-[12px] text-ds-ink-soft m-0">
              {[
                ['Price', p.priceMonthlyUSD ? `$${p.priceMonthlyUSD}/mo` : '—'],
                ['Caps', `${p.capsulesPerServing}/day`],
                ['MBG', `${p.moneyBackDays} days`],
                ['Caffeine', p.caffeineFree ? 'Free' : 'Yes'],
                ['Trustpilot', p.trustpilotScore === null
                  ? 'N/A'
                  : `${p.trustpilotScore} (${p.trustpilotCount?.toLocaleString() ?? 'n/a'})`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-[5px] border-b border-ds-border last:border-b-0"
                >
                  <dt className="text-ds-muted m-0">{k}</dt>
                  <dd className="font-medium text-ds-ink m-0">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-[10px]">
              {(['ingredients', 'dosing', 'transparency'] as const).map((k) => {
                const v = p.scoreBreakdown[k];
                return (
                  <div
                    key={k}
                    className="grid items-center gap-[6px] py-[2px]"
                    style={{ gridTemplateColumns: '70px 1fr 22px' }}
                  >
                    <span className="text-[11px] text-ds-muted capitalize">{k}</span>
                    <Bar value={v} label={`${p.name} ${k} score`} height={5} />
                    <span className="text-[11px] text-ds-ink text-right ds-tabular">{v}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
