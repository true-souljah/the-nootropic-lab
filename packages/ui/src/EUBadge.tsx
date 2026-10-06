// Renders only the verifiable storefront fact from the product record. We do
// not verify regulatory compliance per product, so the legacy self-asserted
// `euCompliance` flag is not rendered.
export default function EUBadge({ euStorefront }: { euStorefront: boolean }) {
  if (!euStorefront) return null;
  return (
    <span
      className="eu-badge-green text-xs font-semibold px-2 py-0.5 rounded cursor-help"
      title="Sold through a dedicated EU storefront priced in EUR. We do not verify regulatory compliance per product."
    >
      EU storefront
    </span>
  );
}
