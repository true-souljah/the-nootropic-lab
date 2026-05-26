import type { ReactNode } from 'react';

// Per-locale wrapper. EU root layout is lang="en"; /fr/* is French content.
export default function FrLayout({ children }: { children: ReactNode }) {
  return <div lang="fr">{children}</div>;
}
