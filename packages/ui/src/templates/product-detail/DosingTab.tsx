import { Card } from '../../primitives/Card';
import { Chip } from '../../primitives/Chip';
import { dosingAnchorFor, dosingTally } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';

export interface DosingTabProps {
  product: Product;
  /** Locale product-detail bundle: tab labels, verdict chips and the localized reference doses. */
  strings: UIStrings['productDetail'];
}

export function DosingTab({ product: p, strings }: DosingTabProps) {
  const t = strings.dosing;
  const totalRows = p.ingredientDosages.length;
  // The chip counts dosing units — rows with a reference dose, a combined
  // anchor once — the same units the dosing pillar scores (FORMULA-SPEC §7E).
  const { adequate, total } = dosingTally(p);
  const allAdequate = total > 0 && adequate === total;

  return (
    <Card padding={22}>
      <div className="flex justify-between items-baseline flex-wrap gap-3 mb-[14px]">
        <div>
          <h2 className="text-[18px] font-semibold m-0 tracking-[-0.01em] text-ds-ink">{t.heading}</h2>
          <div className="text-[12px] text-ds-muted mt-1">{t.subtitle}</div>
        </div>
        {total > 0 && (
          <Chip tone={allAdequate ? 'good' : 'warn'}>
            {t.adequateCount.replace('{adequate}', String(adequate)).replace('{total}', String(total))}
          </Chip>
        )}
      </div>

      {totalRows === 0 ? (
        <p className="text-[13px] text-ds-muted m-0">{t.unavailable}</p>
      ) : (
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="text-left border-b border-ds-border">
                <th className="py-2 pr-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted">
                  {t.columns.ingredient}
                </th>
                <th className="py-2 px-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                  {t.columns.label}
                </th>
                <th className="py-2 px-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                  {t.columns.clinical}
                </th>
                <th className="py-2 pl-3 text-[11px] uppercase tracking-[0.08em] font-semibold text-ds-muted text-right">
                  {t.columns.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {p.ingredientDosages.map((d, i) => {
                // The row data stays English (validate-data pins `clinicalDose`
                // to the anchor string or NO_REFERENCE_DOSE); the Clinical cell
                // and the chip render the locale's text for the same anchor.
                // Name and label amount show the record's page-language text
                // (Product.display) when it has one; the anchor and verdict
                // always come from the English row.
                const shown = p.display?.ingredientDosages[i] ?? d;
                const anchor = dosingAnchorFor(d);
                const verdict = !anchor
                  ? { tone: 'neutral' as const, text: t.verdict.notScored }
                  : d.adequatelyDosed === null
                    ? { tone: 'neutral' as const, text: t.verdict.unverified }
                    : d.adequatelyDosed
                      ? { tone: 'good' as const, text: t.verdict.pass }
                      : { tone: 'bad' as const, text: t.verdict.under };
                return (
                  <tr key={d.name} className="border-b border-ds-border last:border-b-0">
                    <td className="py-3 pr-3 font-medium text-ds-ink">{shown.name}</td>
                    <td className="py-3 px-3 text-right ds-tabular text-ds-ink">{shown.doseInProduct}</td>
                    <td className="py-3 px-3 text-right ds-tabular text-ds-muted">
                      {anchor ? t.anchorDose[anchor.ingredientSlug] : t.noReferenceDose}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <Chip tone={verdict.tone}>{verdict.text}</Chip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
