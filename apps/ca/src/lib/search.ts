import {
  productsCA,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

export const searchItems = buildSearchIndex(productsCA, ingredients, guides);
export const uiStrings = getStrings('en');
