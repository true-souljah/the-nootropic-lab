import Link from 'next/link';
import { Card } from '../../primitives/Card';
import { Bar } from '../../primitives/Bar';
import { PILLAR_LABELS, PILLAR_WEIGHTS, PILLAR_RATIONALE } from './constants';
import type { Product } from '@nootropic/data';

export interface PillarsTabProps {
  product: Product;
}

export function PillarsTab({ product: p }: PillarsTabProps) {
  return (
    <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-4">
        {(Object.entries(p.scoreBreakdown) as [string, number][]).map(([k, v]) => {
          const toneClass = v >= 8 ? 'text-ds-good' : v >= 6 ? 'text-ds-warn-ink' : 'text-ds-bad';
          return (
            <Card key={k} padding={20}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-[17px] font-semibold m-0 text-ds-ink">{PILLAR_LABELS[k]}</h3>
                <div>
                  <span className={`text-[26px] font-bold tracking-[-0.02em] ds-tabular ${toneClass}`}>{v}</span>
                  <span className="text-ds-muted text-[14px]">/10</span>
                </div>
              </div>
              <Bar value={v} label={`${p.name} ${k} pillar score`} />
              <p className="text-[13.5px] text-ds-ink-soft mt-3 m-0 leading-[1.6]">{PILLAR_RATIONALE[k]}</p>
            </Card>
          );
        })}
      </div>

      <Card variant="subdued" padding={20} className="sticky top-[90px] self-start">
        <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">How the score is computed</h3>
        <p className="text-[13px] text-ds-ink-soft m-0 mb-3 leading-[1.6]">
          Each pillar is weighted by editorial importance. Weights are constant across every
          brand we audit — they&apos;re not adjusted to favour any particular product.
        </p>
        <ul className="list-none p-0 m-0 mb-4 flex flex-col">
          {Object.entries(PILLAR_WEIGHTS).map(([k, w]) => (
            <li
              key={k}
              className="flex justify-between py-[6px] border-b border-ds-border last:border-b-0 text-[13px]"
            >
              <span className="text-ds-muted">{PILLAR_LABELS[k]}</span>
              <span className="font-semibold text-ds-ink ds-tabular">{Math.round(w * 100)}%</span>
            </li>
          ))}
        </ul>
        <Link
          href="/methodology"
          className="block text-center bg-ds-card border border-ds-border rounded-[8px] py-[8px] text-[13px] font-semibold text-ds-ink hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          Read methodology v3.2 →
        </Link>
      </Card>
    </div>
  );
}
