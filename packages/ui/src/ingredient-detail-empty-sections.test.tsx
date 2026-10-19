import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { getStrings, ingredients, productsUS } from '@nootropic/data';
import IngredientDetail from './templates/IngredientDetail';

// The ingredient page rendered "Stacking recommendations — Ingredients that
// pair well with {name} and why." with nothing under it when an ingredient has
// no stack pairs (Longvida did), and its contents menu linked to #stacking and
// #products even when those sections were empty or not rendered. A section
// without content is now neither rendered nor listed.

const uiStrings = getStrings('en');

// FPFooter reads the region the app is built for.
beforeAll(() => {
  vi.stubEnv('NEXT_PUBLIC_REGION', 'us');
});
afterAll(() => {
  vi.unstubAllEnvs();
});
const bySlug = (slug: string) => ingredients.find((i) => i.slug === slug)!;

function render(slug: string, withProducts: boolean): string {
  const ingredient = bySlug(slug);
  const containingProducts = withProducts
    ? productsUS.filter((p) => ingredient.productsContaining.includes(p.slug))
    : [];
  return renderToStaticMarkup(
    <IngredientDetail
      ingredient={ingredient}
      containingProducts={containingProducts}
      relatedIngredients={[]}
      siteUrl="https://thenootropiclab.com"
      uiStrings={uiStrings}
      updated={new Date('2026-10-01T00:00:00Z')}
    />,
  );
}

describe('IngredientDetail — empty sections are neither rendered nor listed', () => {
  test('no stack pairs and no products: no stacking or products section, no menu links to them', () => {
    expect(bySlug('lemon-balm').stacksWith).toHaveLength(0);
    const html = render('lemon-balm', false);
    expect(html).not.toContain('id="stacking"');
    expect(html).not.toContain('href="#stacking"');
    expect(html).not.toContain('id="products"');
    expect(html).not.toContain('href="#products"');
    // The rest of the menu is still there.
    expect(html).toContain('href="#faq"');
  });

  test('stack pairs and products: both sections rendered and listed', () => {
    expect(bySlug('l-theanine').stacksWith.length).toBeGreaterThan(0);
    const html = render('l-theanine', true);
    expect(html).toContain('id="stacking"');
    expect(html).toContain('href="#stacking"');
    expect(html).toContain('id="products"');
    expect(html).toContain('href="#products"');
  });
});
