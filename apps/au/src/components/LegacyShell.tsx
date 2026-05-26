import type { ReactNode } from 'react';
import { LegacyShell as SharedLegacyShell } from '@nootropic/ui';
import { searchItems, uiStrings } from '@/lib/search';

export default function LegacyShell({ children }: { children: ReactNode }) {
  return (
    <SharedLegacyShell market="au" searchItems={searchItems} strings={uiStrings}>
      {children}
    </SharedLegacyShell>
  );
}
