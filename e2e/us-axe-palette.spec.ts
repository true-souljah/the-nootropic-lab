import { paletteAxeSuite } from './palette-axe';

// Command palette guard (WCAG 2.5.3 Label in Name, axe-core 4.14
// label-content-name-mismatch) on the US host: an English listicle (public
// shell), an English review page (app shell) and the Spanish /es/ page.
// "memory" returns product, ingredient and guide rows in both bundles (the
// /es/ index lists the same English records under Spanish chrome).
// See e2e/palette-axe.ts.
paletteAxeSuite('US', [
  { path: '/best-nootropics-for-focus/', open: 'shortcut', query: 'memory' },
  { path: '/mind-lab-pro-review/', open: { trigger: 'Search (Command+K)' }, query: 'memory' },
  { path: '/es/mejores-nootropicos/', open: { trigger: 'Buscar (Command+K)' }, query: 'memory' },
]);
