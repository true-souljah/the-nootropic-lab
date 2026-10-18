import type { UIStrings } from '@nootropic/data';

// Renders only the verifiable storefront fact from the product record. We do
// not verify regulatory compliance per product, so the legacy self-asserted
// `euCompliance` flag is not rendered. Text and tooltip come from the page's
// locale bundle.
export default function EUBadge({ euStorefront, strings }: { euStorefront: boolean; strings: UIStrings }) {
  if (!euStorefront) return null;
  return (
    <span
      className="eu-badge-green text-xs font-semibold px-2 py-0.5 rounded cursor-help"
      title={strings.table.euStorefrontNote}
    >
      {strings.productDetail.regionalBuying.licence.euStorefront}
    </span>
  );
}
