import { Card } from '../../primitives/Card';
import { Chip } from '../../primitives/Chip';
import { dosingTally } from '@nootropic/data';
import type { Product } from '@nootropic/data';

export interface DosingTabProps {
  product: Product;
}

export function DosingTab({ product: p }: DosingTabProps) {
  const totalRows = p.ingredientDosages.length;
  // The chip counts dosing units — rows with a reference dose, a combined
  // anchor once — the same units the dosing pillar scores (FORMULA-SPEC §7E).
  const { adequate, total } = dosingTally(p);
  const allAdequate = total > 0 && adequate === total;

  return (
    <Card padding={22}>
      <div className="flex justify-between items-baseline flex-wrap gap-3 mb-[14px]">
        <div>
          <h2 className="text-[18px] font-semibold m-0 tracking-[-0.01em] text-ds-ink">
            Dosing audit
          </h2>
          <div className="text-[12px] text-ds-muted mt-1">
            Label-stated daily amount vs. the minimum on our ingredient pages; ingredients without a
            reference dose are listed but not scored
          </div>
        </div>
        {total > 0 && (
          <Chip tone={allAdequate ? 'good' : 'warn'}>
            {adequate} / {total} adequate
          </Chip>
        )}
      </div>

      {totalRows === 0 ? (
        <p className="text-[13px] text-ds-muted m-0">
          Dosing data unavailable for this product. Many ingredients are hidden inside
          proprietary blends.
        </p>
      ) : (
        <div className="overflow-x-auto overscroll-x-contain">
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
                    <Chip tone={d.adequatelyDosed === null ? 'neutral' : d.adequatelyDosed ? 'good' : 'bad'}>
                      {d.adequatelyDosed === null ? '? Unverified' : d.adequatelyDosed ? '✓ Pass' : '✕ Under'}
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
