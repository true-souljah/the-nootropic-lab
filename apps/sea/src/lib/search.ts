import {
  productsSEA,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

export const searchItems = buildSearchIndex(productsSEA, ingredients, guides);
export const uiStrings = getStrings('en');
