import { Card } from '../../primitives/Card';
import type { Product, UIStrings } from '@nootropic/data';
import { SCORE_TIER_TEXT_CLASS, scoreTier } from '../listicleRanking';
import { fillNodes } from '../fillNodes';

export interface OverviewTabProps {
  product: Product;
  /** Locale product-detail bundle: verdict headline and section headings around the record's own text. */
  strings: UIStrings['productDetail'];
}

export function OverviewTab({ product: p, strings }: OverviewTabProps) {
  const t = strings.overview;
  const tier = scoreTier(p.score);
  return (
    <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-4">
        <Card variant="subdued" padding={22}>
          <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-ds-muted mb-2">
            {t.verdictEyebrow}
          </div>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] m-0 mb-3 text-ds-ink">
            {fillNodes(t.verdict[tier], { product: <span className={SCORE_TIER_TEXT_CLASS[tier]}>{p.name}</span> })}
          </h2>
          <p className="text-[14.5px] text-ds-ink-soft m-0 leading-[1.65]">{p.summary}</p>
        </Card>

        <Card padding={22}>
          <h3 className="text-[16px] font-semibold m-0 mb-2 text-ds-ink">{t.whatItDoes}</h3>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.whatItIs}</p>
        </Card>

        <Card padding={22}>
          <h3 className="text-[16px] font-semibold m-0 mb-2 text-ds-ink">{t.howItWorks}</h3>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.howItWorks}</p>
        </Card>

        <Card padding={22}>
          <h3 className="text-[16px] font-semibold m-0 mb-3 text-ds-ink">{t.whatToExpect}</h3>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{p.whatToExpect}</p>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card padding={20}>
          <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">{t.heroIngredients}</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {p.heroIngredients.slice(0, 6).map((name, i) => {
              // The lookup matches the English names; the page shows the
              // record's page-language text (Product.display) when it has one.
              const doseIndex = p.ingredientDosages.findIndex(
                (d) => d.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(d.name.toLowerCase())
              );
              const dose = doseIndex === -1 ? undefined : p.display?.ingredientDosages[doseIndex] ?? p.ingredientDosages[doseIndex];
              return (
                <li
                  key={name}
                  className="flex justify-between gap-3 py-[6px] border-b border-ds-border last:border-b-0"
                >
                  <span className="text-[13.5px] font-semibold text-ds-ink">{p.display?.heroIngredients[i] ?? name}</span>
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
          <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">{t.whoItsFor}</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2 mb-4">
            {p.pros.slice(0, 3).map((pro) => (
              <li key={pro} className="flex gap-2 text-[13px] text-ds-ink-soft">
                <span className="text-ds-good font-bold shrink-0" aria-hidden="true">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-[14px] font-semibold m-0 mb-3 text-ds-ink">{t.whoShouldSkip}</h3>
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
