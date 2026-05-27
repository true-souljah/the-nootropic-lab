import { Card } from '../../primitives/Card';
import { Chip } from '../../primitives/Chip';
import type { Product } from '@nootropic/data';

export interface DosingTabProps {
  product: Product;
}

export function DosingTab({ product: p }: DosingTabProps) {
  const totalDoses = p.ingredientDosages.length;
  const adequateCount = p.ingredientDosages.filter((d) => d.adequatelyDosed).length;
  const allAdequate = totalDoses > 0 && adequateCount === totalDoses;

  return (
    <Card padding={22}>
      <div className="flex justify-between items-baseline flex-wrap gap-3 mb-[14px]">
        <div>
          <h2 className="text-[18px] font-semibold m-0 tracking-[-0.01em] text-ds-ink">
            Dosing audit
          </h2>
          <div className="text-[12px] text-ds-muted mt-1">
            Label dose vs. dose used in the largest published RCT
          </div>
        </div>
        {totalDoses > 0 && (
          <Chip tone={allAdequate ? 'good' : 'warn'}>
            {adequateCount} / {totalDoses} adequate
          </Chip>
        )}
      </div>

      {totalDoses === 0 ? (
        <p className="text-[13px] text-ds-muted m-0">
          Dosing data unavailable for this product. Many ingredients are hidden inside
          proprietary blends.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="text-left border-b border-ds-border">
                <th className="py-2 pr-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted">
                  Ingredient
                </th>
                <th className="py-2 px-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                  Label
                </th>
                <th className="py-2 px-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                  Clinical
                </th>
                <th className="py-2 pl-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {p.ingredientDosages.map((d) => (
                <tr key={d.name} className="border-b border-ds-border last:border-b-0">
                  <td className="py-3 pr-3 font-medium text-ds-ink">{d.name}</td>
                  <td className="py-3 px-3 text-right ds-tabular text-ds-ink">{d.doseInProduct}</td>
                  <td className="py-3 px-3 text-right ds-tabular text-ds-muted">{d.clinicalDose}</td>
                  <td className="py-3 pl-3 text-right">
                    <Chip tone={d.adequatelyDosed ? 'good' : 'bad'}>
                      {d.adequatelyDosed ? '✓ Pass' : '✕ Under'}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
