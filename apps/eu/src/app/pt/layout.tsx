import type { ReactNode } from 'react';

// Per-locale wrapper. EU root layout is lang="en"; /pt/* is Portuguese content.
export default function PtLayout({ children }: { children: ReactNode }) {
  return <div lang="pt">{children}</div>;
}
