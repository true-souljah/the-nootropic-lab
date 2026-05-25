import {
  productsEU,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

export const searchItems = buildSearchIndex(productsEU, ingredients, guides);
export const uiStrings = getStrings('en');
