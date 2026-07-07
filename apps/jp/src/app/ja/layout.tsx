import type { ReactNode } from 'react';

// Per-locale wrapper. The JP root layout is lang="en" (majority content);
// content under /ja/* is Japanese, so we override the language context via
// an inline lang attribute so assistive tech pronounces the localized text
// correctly and search engines see the section as a Japanese variant.
// Mirrors apps/eu/src/app/de/layout.tsx and apps/us/src/app/es/layout.tsx.
export default function JaLayout({ children }: { children: ReactNode }) {
  return <div lang="ja">{children}</div>;
}
