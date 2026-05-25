import {
  productsLatam,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

export const searchItems = buildSearchIndex(productsLatam, ingredients, guides);
export const uiStrings = getStrings('es');
