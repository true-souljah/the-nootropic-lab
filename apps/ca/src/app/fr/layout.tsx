import type { ReactNode } from 'react';

// Per-locale wrapper. CA root layout is lang="en"; /fr/* is Quebec French content.
export default function FrLayout({ children }: { children: ReactNode }) {
  return <div lang="fr-CA">{children}</div>;
}
