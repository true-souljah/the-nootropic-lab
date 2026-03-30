import type { EUCompliance } from '@nootropic/data';

const map: Record<EUCompliance, { label: string; cls: string; tooltip: string }> = {
  compliant: {
    label: 'EU Compliant',
    cls: 'eu-badge-green',
    tooltip: 'Fully compliant with EU Directive 2002/46/EC and EFSA-approved ingredients.',
  },
  reformulated: {
    label: 'EU Reformulated',
    cls: 'eu-badge-amber',
    tooltip: 'EU-specific formula differs from US version. Verify current formulation before purchasing.',
  },
  verify: {
    label: 'Verify for EU',
    cls: 'eu-badge-red',
    tooltip: 'May have regulatory restrictions in some EU countries. Verify compliance before ordering.',
  },
};

export default function EUBadge({ status }: { status: EUCompliance }) {
  const { label, cls, tooltip } = map[status];
  return (
    <span
      className={`${cls} text-xs font-semibold px-2 py-0.5 rounded cursor-help`}
      title={tooltip}
    >
      {label}
    </span>
  );
}
