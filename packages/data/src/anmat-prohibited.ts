// ANMAT (Administración Nacional de Medicamentos, Alimentos y Tecnología
// Médica — Argentina) Disposición 2105/2022 prohibits the commercialization
// of various nootropic compounds for use as dietary supplements. Compounds
// listed here cannot be legally sold to Argentine consumers as supplements.
//
// Source: ANMAT Disposición 2105/2022 (Boletín Oficial 2022-04-08).
// https://www.argentina.gob.ar/normativa/nacional/disposici%C3%B3n-2105-2022-364076
//
// This module powers the /anmat-disposicion-2105-2022-prohibidos/ landing
// page and the per-product "contains banned compound" check used to warn
// Argentine readers when they view a product whose ingredient list overlaps
// the prohibited list.

import type { Product } from './products-us';

export interface AnmatProhibitedCompound {
  /** Common English name */
  name: string;
  /** Common Spanish name (often identical, but listed for clarity) */
  nameEs: string;
  /** Aliases / chemical names / brand names that may appear in ingredient lists */
  aliases: string[];
  /** Compound class — for grouping on the landing page */
  class: 'racetam' | 'gabapentinoid' | 'modafinil-prodrug' | 'antidepressant-derivative' | 'peptide-nootropic' | 'cholinergic-prescription';
  /** Brief mechanism / why it's regulated */
  mechanismEs: string;
  mechanismEn: string;
}

/**
 * Compounds prohibited from sale as dietary supplements in Argentina under
 * ANMAT Disposición 2105/2022. NOT exhaustive — the disposition references
 * an open list and additional substances may be added by subsequent ANMAT
 * resolutions. Update this file when ANMAT publishes amendments.
 */
export const anmatProhibitedCompounds: AnmatProhibitedCompound[] = [
  {
    name: 'Noopept',
    nameEs: 'Noopept',
    aliases: ['N-phenylacetyl-L-prolylglycine ethyl ester', 'GVS-111', 'Omberacetam'],
    class: 'peptide-nootropic',
    mechanismEs: 'Dipéptido sintético derivado del piracetam, con efectos sobre el receptor NMDA y el factor de crecimiento neuronal. Sin aprobación regulatoria en Argentina como suplemento dietario.',
    mechanismEn: 'Synthetic dipeptide derived from piracetam, with effects on NMDA receptors and nerve growth factor. No regulatory approval in Argentina as a dietary supplement.',
  },
  {
    name: 'Piracetam',
    nameEs: 'Piracetam',
    aliases: ['2-oxo-1-pyrrolidineacetamide', 'Nootropil'],
    class: 'racetam',
    mechanismEs: 'Primer compuesto de la familia racetam, modulador del receptor AMPA. En Argentina sólo se comercializa como medicamento bajo prescripción médica, no como suplemento.',
    mechanismEn: 'First compound in the racetam family; AMPA receptor modulator. In Argentina available only as a prescription medication, not as a dietary supplement.',
  },
  {
    name: 'Aniracetam',
    nameEs: 'Aniracetam',
    aliases: ['Ro 13-5057', 'N-anisoyl-2-pyrrolidinone'],
    class: 'racetam',
    mechanismEs: 'Racetam liposoluble. Modulador positivo del receptor AMPA. Sin aprobación como suplemento en Argentina.',
    mechanismEn: 'Fat-soluble racetam; positive AMPA receptor modulator. Not approved as a dietary supplement in Argentina.',
  },
  {
    name: 'Oxiracetam',
    nameEs: 'Oxiracetam',
    aliases: ['ISF-2522', '4-hydroxy-2-oxo-1-pyrrolidineacetamide'],
    class: 'racetam',
    mechanismEs: 'Racetam con efectos colinérgicos y glutamatérgicos. Sin aprobación regulatoria en Argentina como suplemento.',
    mechanismEn: 'Racetam with cholinergic and glutamatergic effects. No regulatory approval in Argentina as a supplement.',
  },
  {
    name: 'Phenylpiracetam',
    nameEs: 'Fenilpiracetam',
    aliases: ['Carphedon', 'Fonturacetam', '4-phenyl-2-pyrrolidone-1-acetamide'],
    class: 'racetam',
    mechanismEs: 'Racetam con grupo fenilo agregado. Estimulante del SNC; en la lista de prohibidos de la WADA. Sin aprobación regulatoria en Argentina.',
    mechanismEn: 'Phenyl-substituted racetam. CNS stimulant; on the WADA prohibited list. No regulatory approval in Argentina.',
  },
  {
    name: 'Pramiracetam',
    nameEs: 'Pramiracetam',
    aliases: ['CI-879', 'N-[2-(diisopropylamino)ethyl]-2-oxo-1-pyrrolidineacetamide'],
    class: 'racetam',
    mechanismEs: 'Racetam con afinidad por el transportador colinérgico de alta afinidad. Sin aprobación regulatoria en Argentina.',
    mechanismEn: 'Racetam with affinity for the high-affinity choline transporter. No regulatory approval in Argentina.',
  },
  {
    name: 'Phenibut',
    nameEs: 'Fenibut',
    aliases: ['β-phenyl-γ-aminobutyric acid', 'Noofen', 'Anvifen'],
    class: 'gabapentinoid',
    mechanismEs: 'Análogo del GABA con afinidad por receptores GABA-B. Riesgo significativo de tolerancia, dependencia y síndrome de abstinencia. Prohibido como suplemento en Argentina.',
    mechanismEn: 'GABA analogue with GABA-B receptor affinity. Significant risk of tolerance, dependence, and withdrawal syndrome. Prohibited as a supplement in Argentina.',
  },
  {
    name: 'Tianeptine',
    nameEs: 'Tianeptina',
    aliases: ['Stablon', 'Coaxil', 'Tatinol'],
    class: 'antidepressant-derivative',
    mechanismEs: 'Antidepresivo atípico con actividad sobre receptores opioides μ a dosis altas. Riesgo de abuso documentado. En Argentina se comercializa como medicamento bajo prescripción, no como suplemento.',
    mechanismEn: 'Atypical antidepressant with μ-opioid receptor activity at high doses. Documented abuse potential. In Argentina available only as a prescription medication, not as a supplement.',
  },
  {
    name: 'Adrafinil',
    nameEs: 'Adrafinilo',
    aliases: ['CRL-40028', 'Olmifon'],
    class: 'modafinil-prodrug',
    mechanismEs: 'Profármaco hepático del modafinilo. El modafinilo está controlado en Argentina como medicamento bajo prescripción. Sin aprobación como suplemento.',
    mechanismEn: 'Hepatic prodrug of modafinil. Modafinil is a controlled prescription medication in Argentina. No approval as a supplement.',
  },
];

/**
 * Returns the banned compounds present in a product's ingredient list.
 * Match is case-insensitive and substring-aware so common ingredient-list
 * phrasings ("Noopept (N-phenylacetyl-...)" or "300mg Piracetam") are caught.
 */
export function findAnmatBannedIngredients(product: Product): AnmatProhibitedCompound[] {
  const found: AnmatProhibitedCompound[] = [];
  const ingredientText = product.ingredientDosages
    .map(i => i.name)
    .join(' | ')
    .toLowerCase();
  for (const compound of anmatProhibitedCompounds) {
    const candidates = [compound.name, compound.nameEs, ...compound.aliases].map(s => s.toLowerCase());
    if (candidates.some(c => ingredientText.includes(c))) {
      found.push(compound);
    }
  }
  return found;
}

/**
 * Returns true if the product contains at least one ANMAT-prohibited compound.
 * Convenience wrapper for surfacing a warning badge.
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
