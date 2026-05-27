import { Card } from '../../primitives/Card';
import type { Product } from '@nootropic/data';

export interface OverviewTabProps {
  product: Product;
}

export function OverviewTab({ product: p }: OverviewTabProps) {
  return (
    <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-4">
        <Card variant="subdued" padding={22}>
          <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-2">
            Verdict
          </div>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] m-0 mb-3 text-ds-ink">
            {p.score >= 8.5 ? (
              <>
                <span className="text-ds-good">{p.name}</span> is recommended.
              </>
            ) : p.score >= 7.5 ? (
              <>
                <span className="text-ds-warn-ink">{p.name}</span> is worth a look.
              </>
            ) : (
              <>
                <span className="text-ds-bad">{p.name}</span> falls short.
              </>
            )}
          </h2>
          <p className="text-[14.5px] text-ds-ink-soft m-0 leading-[1.65]">{p.summary}</p>
        </Card>

        <Card padding={22}>
          <h3 className="text-[16px] font-semibold m-0 mb-2 text-ds-ink">What it does</h3>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.whatItIs}</p>
        </Card>

        <Card padding={22}>
          <h3 className="text-[16px] font-semibold m-0 mb-2 text-ds-ink">How it works</h3>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.howItWorks}</p>
        </Card>

        <Card padding={22}>
          <h3 className="text-[16px] font-semibold m-0 mb-3 text-ds-ink">What to expect</h3>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.whatToExpect}</p>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card padding={20}>
          <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">Hero ingredients</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {p.heroIngredients.slice(0, 6).map((name) => {
              const dose = p.ingredientDosages.find(
                (d) => d.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(d.name.toLowerCase())
              );
              return (
                <li
                  key={name}
                  className="flex justify-between gap-3 py-[6px] border-b border-ds-border last:border-b-0"
                >
                  <span className="text-[13.5px] font-semibold text-ds-ink">{name}</span>
                  {dose && (
                    <span className="text-[12.5px] font-bold text-ds-accent ds-tabular">
                      {dose.doseInProduct}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <Card variant="subdued" padding={20}>
          <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">Who it&apos;s for</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2 mb-4">
            {p.pros.slice(0, 3).map((pro) => (
              <li key={pro} className="flex gap-2 text-[13px] text-ds-ink-soft">
                <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">Who should skip</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {p.cons.slice(0, 3).map((con) => (
              <li key={con} className="flex gap-2 text-[13px] text-ds-ink-soft">
                <span className="text-ds-bad font-bold shrink-0" aria-hidden="true">✕</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
