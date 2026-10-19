// Side-by-side compare drawer rendered below the product table when ≥1
// rows are selected. Renders 1-3 product cards with quick-spec dl + the
// 3-pillar score bars. State is owned by the parent Comparator.

import type { ReactNode } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Card } from '../../primitives/Card';
import { ScorePill } from '../../primitives/ScorePill';
import { Bar } from '../../primitives/Bar';
import { ProductThumb } from '../../primitives/ProductThumb';
import { servingAmount, pillarText, guaranteeDays } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import { priceText } from '../../price-text';
import { PriceShort } from '../../PriceShort';
import { tpl } from '../../templateStrings';

export interface ComparatorCompareCardProps {
  selectedProducts: Product[];
  uiStrings: UIStrings;
  onClear: () => void;
}

export function ComparatorCompareCard({ selectedProducts, uiStrings, onClear }: ComparatorCompareCardProps) {
  if (selectedProducts.length === 0) return null;
  const cs = uiStrings.comparator;
  const pd = uiStrings.productDetail;
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
            {cs.compare}
          </div>
          <div className="font-semibold text-[15px] mt-[2px]">
            {tpl(cs.selectedSummary, { n: selectedProducts.length })}
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 bg-transparent text-ds-muted border border-ds-border px-3 py-[6px] rounded-[6px] text-[12px] cursor-pointer hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          <X size={12} strokeWidth={2.4} aria-hidden={true} />
          {cs.clear}
        </button>
      </div>
      <div
        className="grid gap-[14px]"
        style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)` }}
      >
        {selectedProducts.map((p) => (
          <Card key={p.slug} variant="subdued" padding={14}>
            <div className="flex items-center gap-[10px]">
              <ProductThumb product={p} size={32} variant="sm" />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/${p.slug}/`}
                  className="font-semibold text-[14px] truncate block text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                >
                  {p.name}
                </Link>
                <div className="text-[11px] text-ds-muted">{p.brand}</div>
              </div>
              <ScorePill score={p.score} label={tpl(pd.score.aria, { score: p.score.toFixed(1), max: (10).toFixed(1) })} />
            </div>
            <dl className="mt-3 text-[12px] text-ds-ink-soft m-0">
              {([
                [pd.stats.price, <PriceShort price={priceText(p, uiStrings)} />],
                [pd.stats.perServingLabel, priceText(p, uiStrings)?.perServing ?? '—'],
                [cs.daily, servingAmount(p, uiStrings)],
                [pd.stats.moneyBack, guaranteeDays(p.moneyBackDays, (d) => tpl(pd.stats.daysCount, { days: d }))],
                [cs.caffeine, p.caffeineFree ? cs.caffeineFree : uiStrings.table.yes],
                [pd.stats.trustpilot, p.trustpilotScore === null
                  ? pd.stats.notAvailable
                  : `${p.trustpilotScore} (${p.trustpilotCount?.toLocaleString(pd.dateLocale) ?? pd.stats.notAvailable})`],
              ] as Array<[string, ReactNode]>).map(([k, v]) => (
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
                    <span className="text-[11px] text-ds-muted capitalize">{pd.pillars.short[k]}</span>
                    <Bar
                      value={v ?? 0}
                      decorative={v === null}
                      label={tpl(pd.pillars.shortScoreAria, { name: p.name, pillar: pd.pillars.short[k] })}
                      height={5}
                    />
                    <span className="text-[11px] text-ds-ink text-right ds-tabular">{pillarText(v)}</span>
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
