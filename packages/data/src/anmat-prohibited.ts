// ANMAT (Administración Nacional de Medicamentos, Alimentos y Tecnología
// Médica — Argentina) Disposición 2105/2022 (DI-2022-2105-APN-ANMAT#MS,
// signed 21 March 2022, published in the Boletín Oficial on 22 March 2022,
// aviso N° 17097/22) is a PRODUCT-SPECIFIC prohibition. Its Artículo 1
// prohibits the use, distribution and sale nationwide of all lots and
// presentations of seven named products (Newmind and PURENOOTROPICS brands)
// that were offered via the website noopept.com.ar. It is NOT a ban on a
// class of compounds: it names no racetam, phenibut, tianeptine, adrafinil
// or prescription drug as prohibited. "Piracetam" appears in the text only
// inside a quoted marketing claim ("será hasta mil veces más potente que el
// piracetam").
//
// The recitals (considerandos) state that the products declare substances
// not authorised in the Código Alimentario Argentino (CAA) — among them
// "4-Amino-3 (4-fluorophenyl) butyric acid HCL", "Noopept" and "Bacopa
// Monnieri whole herb extract" — and that the products hold no ANMAT
// registration.
//
// Source (Boletín Oficial de la República Argentina, 22/03/2022):
// https://www.boletinoficial.gob.ar/detalleAviso/primera/259661/20220322
//
// This module powers the /anmat-disposicion-2105-2022-prohibidos/ landing
// page and the per-product check that tells Argentine readers whether a
// catalogue product contains a substance the disposition names.

import type { Product } from './products-us';

export const ANMAT_DISPOSICION_2105_2022 = {
  number: '2105/2022',
  gdeReference: 'DI-2022-2105-APN-ANMAT#MS',
  signedDate: '2022-03-21',
  publishedDate: '2022-03-22',
  boletinOficialAviso: 'N° 17097/22',
  sourceUrl: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/259661/20220322',
  /** Website named in the recitals as the place the products were offered. */
  offeringWebsite: 'noopept.com.ar',
} as const;

/** Where in the disposition an entry comes from. */
export type AnmatBasis =
  /** Product prohibited by name in Artículo 1. */
  | 'named-in-articulo-1'
  /** Substance cited in the considerandos as not authorised in the CAA. */
  | 'cited-in-recitals-as-unauthorised-in-caa';

export interface AnmatProhibitedProduct {
  /** Product designation exactly as written in Artículo 1 */
  nameAsWritten: string;
  /** Brand as written in Artículo 1 */
  brand: 'Newmind' | 'PURENOOTROPICS';
  /** Presentation as written in Artículo 1 (null when the text gives none) */
  presentation: 'polvo' | 'cápsulas' | 'sublingual' | null;
  basis: 'named-in-articulo-1';
}

export interface AnmatProhibitedCompound {
  /** Common English name */
  name: string;
  /** Common Spanish name (often identical, but listed for clarity) */
  nameEs: string;
  /** The substance exactly as the recitals quote it */
  declaredAs: string;
  /** Aliases / chemical names that may appear in ingredient lists */
  aliases: string[];
  basis: 'cited-in-recitals-as-unauthorised-in-caa';
  /**
   * Whether findAnmatBannedIngredients flags catalogue products containing
   * this substance. False for Bacopa monnieri: the recital refers to the
   * declared composition of unregistered products offered via one website
   * (Artículo 1 prohibits "PURENOOTROPICS BACOGNIZE Bacopa Monnieri" by
   * name); the disposition does not prohibit Bacopa as an ingredient.
   */
  flagsCatalogueProducts: boolean;
  /** What the disposition says about this substance */
  noteEs: string;
  noteEn: string;
}

/** The seven products prohibited by Artículo 1, in the order the text lists them. */
export const anmatProhibitedProducts: AnmatProhibitedProduct[] = [
  { nameAsWritten: 'Newmind – Noopept – GVS -111 polvo', brand: 'Newmind', presentation: 'polvo', basis: 'named-in-articulo-1' },
  { nameAsWritten: 'Newmind – F-Phenibut polvo', brand: 'Newmind', presentation: 'polvo', basis: 'named-in-articulo-1' },
  { nameAsWritten: 'PURENOOTROPICS Noopept cápsulas', brand: 'PURENOOTROPICS', presentation: 'cápsulas', basis: 'named-in-articulo-1' },
  { nameAsWritten: 'PURENOOTROPICS Noopept polvo', brand: 'PURENOOTROPICS', presentation: 'polvo', basis: 'named-in-articulo-1' },
  { nameAsWritten: 'NOOPEPT sublingual, PURE NOOTROPICS', brand: 'PURENOOTROPICS', presentation: 'sublingual', basis: 'named-in-articulo-1' },
  { nameAsWritten: 'B-12 sublingual PURENOOTROPICS', brand: 'PURENOOTROPICS', presentation: 'sublingual', basis: 'named-in-articulo-1' },
  { nameAsWritten: 'PURENOOTROPICS BACOGNIZE Bacopa Monnieri', brand: 'PURENOOTROPICS', presentation: null, basis: 'named-in-articulo-1' },
];

/**
 * The three substances the recitals cite as declared in the products'
 * composition and not authorised in the Código Alimentario Argentino. The
 * disposition prohibits the seven products above, not these substances as
 * such. Name kept for API compatibility with existing consumers.
 */
export const anmatProhibitedCompounds: AnmatProhibitedCompound[] = [
  {
    name: 'Noopept',
    nameEs: 'Noopept',
    declaredAs: 'Noopept',
    aliases: ['GVS-111', 'GVS -111', 'Omberacetam', 'N-phenylacetyl-L-prolylglycine ethyl ester'],
    basis: 'cited-in-recitals-as-unauthorised-in-caa',
    flagsCatalogueProducts: true,
    noteEs: 'Citado en los considerandos como sustancia no autorizada en el CAA. Cuatro de los siete productos prohibidos por el Artículo 1 llevan "Noopept" en su denominación.',
    noteEn: 'Cited in the recitals as a substance not authorised in the CAA. Four of the seven products prohibited by Artículo 1 carry "Noopept" in their designation.',
  },
  {
    name: 'F-Phenibut (4-fluorophenibut)',
    nameEs: 'F-Phenibut (4-fluorofenibut)',
    declaredAs: '4-Amino-3 (4-fluorophenyl) butyric acid HCL',
    aliases: ['F-Phenibut', 'fluorophenibut', '4-Amino-3 (4-fluorophenyl) butyric acid', '4-amino-3-(4-fluorophenyl)butyric acid'],
    basis: 'cited-in-recitals-as-unauthorised-in-caa',
    flagsCatalogueProducts: true,
    noteEs: 'Citado en los considerandos como "4-Amino-3 (4-fluorophenyl) butyric acid HCL"; el Artículo 1 prohíbe el producto "Newmind – F-Phenibut polvo". La disposición no menciona el fenibut sin flúor.',
    noteEn: 'Cited in the recitals as "4-Amino-3 (4-fluorophenyl) butyric acid HCL"; Artículo 1 prohibits the product "Newmind – F-Phenibut polvo". The disposition does not mention non-fluorinated phenibut.',
  },
  {
    name: 'Bacopa monnieri whole-herb extract (as declared in the products offered via noopept.com.ar)',
    nameEs: 'Extracto de planta entera de Bacopa monnieri (según lo declarado en los productos ofrecidos en noopept.com.ar)',
    declaredAs: 'Bacopa Monnieri whole herb extract',
    aliases: [],
    basis: 'cited-in-recitals-as-unauthorised-in-caa',
    flagsCatalogueProducts: false,
    noteEs: 'Citado en los considerandos como declarado en la composición de los productos ofrecidos en ese sitio web; el Artículo 1 prohíbe el producto "PURENOOTROPICS BACOGNIZE Bacopa Monnieri". La disposición no prohíbe la bacopa como ingrediente en general.',
    noteEn: 'Cited in the recitals as declared in the composition of the products offered on that website; Artículo 1 prohibits the product "PURENOOTROPICS BACOGNIZE Bacopa Monnieri". The disposition does not prohibit Bacopa as an ingredient in general.',
  },
];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Returns the substances named by the disposition that appear in a
 * product's ingredient list. Only Noopept and F-Phenibut are matched
 * (flagsCatalogueProducts): Bacopa monnieri is excluded on purpose because
 * the disposition prohibits one seller's unregistered Bacopa product, not
 * Bacopa as an ingredient — flagging catalogue products for Bacopa would
 * misstate the law. Matching is case-insensitive and anchored at a word
 * start so "F-Phenibut" never matches inside an unrelated longer token.
 */
export function findAnmatBannedIngredients(product: Product): AnmatProhibitedCompound[] {
  const found: AnmatProhibitedCompound[] = [];
  const ingredientText = product.ingredientDosages.map(i => i.name).join(' | ');
  for (const compound of anmatProhibitedCompounds) {
    if (!compound.flagsCatalogueProducts) continue;
    const candidates = [compound.declaredAs, ...compound.aliases];
    if (candidates.some(c => new RegExp(`(?<![a-z0-9])${escapeRegExp(c)}`, 'i').test(ingredientText))) {
      found.push(compound);
    }
  }
  return found;
}

/**
 * Returns true if the product contains Noopept or F-Phenibut, the substances
 * the disposition names that the matcher checks. Convenience wrapper for
 * surfacing a warning badge.
 */
export function productContainsAnmatBanned(product: Product): boolean {
  return findAnmatBannedIngredients(product).length > 0;
}

/** Audits a product list and returns the per-product ban status. */
export function auditProductsForAnmat(
  products: Product[]
): Array<{ product: Product; bannedCompounds: AnmatProhibitedCompound[] }> {
  return products.map(product => ({
    product,
    bannedCompounds: findAnmatBannedIngredients(product),
  }));
}
