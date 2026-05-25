import {
  productsUS,
  ingredients,
  guides,
  buildSearchIndex,
  getStrings,
} from '@nootropic/data';

/** Site search index used by the embedded SearchModal in FPHeader. */
export const searchItems = buildSearchIndex(productsUS, ingredients, guides);

/** UI strings (en) used by chrome that exposes translated copy. */
export const uiStrings = getStrings('en');
