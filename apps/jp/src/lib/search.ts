import {
  productsJP,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

export const searchItems = buildSearchIndex(productsJP, ingredients, guides);
export const uiStrings = getStrings('ja');
