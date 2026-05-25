import {
  productsGCC,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

export const searchItems = buildSearchIndex(productsGCC, ingredients, guides);
export const uiStrings = getStrings('en');
