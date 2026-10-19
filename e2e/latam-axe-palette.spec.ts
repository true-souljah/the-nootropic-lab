import { paletteAxeSuite } from './palette-axe';

// Command palette guard (WCAG 2.5.3 Label in Name, axe-core 4.14
// label-content-name-mismatch) on the LATAM host, all Spanish (es): the home
// page and a review page (app shell). "para" returns product, ingredient,
// guide and page rows in the LATAM index. See e2e/palette-axe.ts.
paletteAxeSuite('LATAM', [
  { path: '/', open: 'shortcut', query: 'para' },
  { path: '/mind-lab-pro-review/', open: { trigger: 'Buscar (Command+K)' }, query: 'para' },
]);
