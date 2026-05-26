import type { ReactNode } from 'react';

// Per-locale wrapper. EU root layout is lang="en"; /de/* is German content.
export default function DeLayout({ children }: { children: ReactNode }) {
  return <div lang="de">{children}</div>;
}
