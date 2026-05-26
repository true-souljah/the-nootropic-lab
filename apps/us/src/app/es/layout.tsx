import type { ReactNode } from 'react';

// Per-locale wrapper. The root layout sets <html lang="en">; for content
// under /es/* we override the language context via an inline lang
// attribute so assistive tech pronounces the localized text correctly
// and search engines see the section as a Spanish language variant.
export default function EsLayout({ children }: { children: ReactNode }) {
  return <div lang="es">{children}</div>;
}
