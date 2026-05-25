import {
  productsAU,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

export const searchItems = buildSearchIndex(productsAU, ingredients, guides);
export const uiStrings = getStrings('en');
