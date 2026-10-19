import { paletteAxeSuite } from './palette-axe';

// Command palette guard (WCAG 2.5.3 Label in Name, axe-core 4.14
// label-content-name-mismatch) on the EU host's German and French pages.
// "with" returns product, ingredient and guide rows (the /de/ and /fr/
// indexes list the English records under localized chrome).
// See e2e/palette-axe.ts.
paletteAxeSuite('EU', [
  { path: '/de/beste-nootropika/', open: { trigger: 'Suchen (Command+K)' }, query: 'with' },
  { path: '/fr/meilleurs-nootropiques/', open: 'shortcut', query: 'with' },
]);
