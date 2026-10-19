// LATAM Spanish (es-419) translations of the prose in products-latam.json.
//
// Scope: every prose field a LATAM page renders from a product record:
// summary, whatItIs, howItWorks, whatToExpect, pros, cons, notes,
// importPathway, regulatoryNote, unscoredReason and discontinued.note (each
// translated only where the English record has it), plus the display text of
// bestFor, heroIngredients and ingredientDosages (row name and label amount).
// Everything else always comes from the English record: slug, name, brand,
// scores, prices, dates, URLs, the storePrice pack/directions and vendorTerms
// quotes (the vendor's own words, rendered verbatim and marked lang="en"), and
// the English bestFor / heroIngredients / ingredientDosages themselves, which
// the comparator's goal filter, the dosing anchors, verdicts and tallies and
// the listicle ranking keep reading (the Spanish rides along in
// `Product.display`). localizeProductLatam() merges the two, so
// validate-data, recompute-scores, the claims guards and scoring keep reading
// the English JSON unchanged, and a structural change in products-latam.json
// reaches LATAM without touching this file.
//
// Translation rules: say exactly what the English says (no new claims, no
// stronger or weaker wording); keep every number, unit, price, percentage,
// date, hedge ("may", "in one trial"), attribution and check date; keep URLs,
// brand, product, blend, formula and extract names (Cognizin, NutriGenesis,
// VitaCholine, Nutricog, Lutemax 2020, Onnit Flow Blend, Clarity, Motivation,
// Stress Reset, Neuroprotection, Zembrin, SmartSeed, Sabroxy), Trustpilot,
// study citations ("Mori 2009") and Latin binomials. Register: tú, as on the
// LATAM ingredient and best-of pages. Decimals use a point (es-419). Names:
// (1) an ingredient with a LATAM ingredient page is written exactly as
// ingredients-es.ts writes it (Melena de León, Citicolina, L-Teanina,
// L-Tirosina, Cafeína, Fosfatidilserina, Alfa-GPC, Huperzina A, corteza de
// pino marítimo; Bacopa Monnieri, Rhodiola Rosea, Ginkgo Biloba,
// Ashwagandha, Acetyl-L-Carnitine, Oat Straw Extract and Dynamine stay as
// there); (2) brand, blend, formula and extract names and Latin binomials stay
// as written; (3) any other vitamin, mineral, plant or compound takes its
// standard Spanish name (Vitamina B6, Taurina, Uña de gato, Azafrán,
// Pterostilbeno), and generic words around a name are translated (extract,
// root, seed, mushroom). Regulator names already in Spanish stay; ANVISA
// keeps its Portuguese name.
// English proper names that contain English function words (certification
// names) are kept in double quotes.
//
// Guards (packages/ui/src/products-latam-es.test.ts): every products-latam.json
// record has an entry with the same list lengths and optional fields; the
// numbers in each Spanish field equal the English field's; each prose field
// is Spanish (identical fields only on an explicit kept list); each entry's
// `sourceHashes` matches the English it was translated from; and the LATAM
// review, best-of, country, comparison and methodology pages render the
// Spanish.
//
// Refreshing after an English edit (claims rounds edit these records): the
// staleness test fails with "<slug>: <field> changed in products-latam.json
// since it was translated ... set sourceHashes.<field> to '<hash>'".
// Re-translate that field from the current English record, then set
// sourceHashes.<field> to the printed hash. Never update a hash without
// re-translating the field. A changed list length or a field added to or
// removed from the English record also makes localizeProductLatam() throw,
// which fails the LATAM build until the entry here is updated.

import type { Product } from './products-us';
import { allProductsLatam, productsLatam } from './products-latam';

/** The fields of a LATAM record that carry prose and are translated here. */
export const TRANSLATED_LATAM_PRODUCT_FIELDS = [
  'summary',
  'whatItIs',
  'howItWorks',
  'whatToExpect',
  'pros',
  'cons',
  'notes',
  'bestFor',
  'heroIngredients',
  'ingredientDosages',
  'importPathway',
  'regulatoryNote',
  'unscoredReason',
  'discontinuedNote',
] as const;
export type TranslatedLatamProductField = (typeof TRANSLATED_LATAM_PRODUCT_FIELDS)[number];

export interface LatamProductTranslation {
  slug: string;
  summary: string;
  whatItIs: string;
  howItWorks: string;
  whatToExpect: string;
  pros: string[];
  cons: string[];
  /** Present exactly when the English has `notes`, in the same shape (one string or a list of the same length). */
  notes?: string | string[];
  /** Same order and length as the English bestFor. */
  bestFor: string[];
  /** Same order and length as the English heroIngredients. */
  heroIngredients: string[];
  /** Same order and length as the English ingredientDosages: row name and label amount. */
  ingredientDosages: Array<{ name: string; doseInProduct: string }>;
  /** Each present exactly when the English record has it. */
  importPathway?: string;
  regulatoryNote?: string;
  unscoredReason?: string;
  /** The English `discontinued.note`; present exactly when the record is discontinued. */
  discontinuedNote?: string;
  /**
   * First 12 hex characters of the SHA-256 of each English source field this
   * entry was translated from (JSON of latamProductSourceFields(english)[field]).
   */
  sourceHashes: Record<TranslatedLatamProductField, string>;
}

/**
 * The translatable prose of an English LATAM record, field by field, in a
 * fixed shape (arrays, not objects, so key order cannot change a hash; null
 * for an absent optional field).
 */
export function latamProductSourceFields(p: Product): Record<TranslatedLatamProductField, unknown> {
  return {
    summary: p.summary,
    whatItIs: p.whatItIs,
    howItWorks: p.howItWorks,
    whatToExpect: p.whatToExpect,
    pros: p.pros,
    cons: p.cons,
    notes: p.notes ?? null,
    bestFor: p.bestFor,
    heroIngredients: p.heroIngredients,
    ingredientDosages: p.ingredientDosages.map((d) => [d.name, d.doseInProduct]),
    importPathway: p.importPathway ?? null,
    regulatoryNote: p.regulatoryNote ?? null,
    unscoredReason: p.unscoredReason ?? null,
    discontinuedNote: p.discontinued?.note ?? null,
  };
}

/** The same fields of a translation, in the shape latamProductSourceFields gives the English. */
export function latamTranslationFields(t: LatamProductTranslation): Record<TranslatedLatamProductField, unknown> {
  return {
    summary: t.summary,
    whatItIs: t.whatItIs,
    howItWorks: t.howItWorks,
    whatToExpect: t.whatToExpect,
    pros: t.pros,
    cons: t.cons,
    notes: t.notes ?? null,
    bestFor: t.bestFor,
    heroIngredients: t.heroIngredients,
    ingredientDosages: t.ingredientDosages.map((d) => [d.name, d.doseInProduct]),
    importPathway: t.importPathway ?? null,
    regulatoryNote: t.regulatoryNote ?? null,
    unscoredReason: t.unscoredReason ?? null,
    discontinuedNote: t.discontinuedNote ?? null,
  };
}

/**
 * Why a translation no longer lines up with its English record: a list of a
 * different length, `notes` of another shape, or an optional field present in
 * one language only. Empty when they line up.
 */
export function latamTranslationShapeProblems(en: Product, t: LatamProductTranslation): string[] {
  const problems: string[] = [];
  const lists: Array<[string, unknown[], unknown[]]> = [
    ['pros', en.pros, t.pros],
    ['cons', en.cons, t.cons],
    ['bestFor', en.bestFor, t.bestFor],
    ['heroIngredients', en.heroIngredients, t.heroIngredients],
    ['ingredientDosages', en.ingredientDosages, t.ingredientDosages],
  ];
  for (const [field, a, b] of lists) {
    if (a.length !== b.length) problems.push(`${field}: ${b.length} translated vs ${a.length} English`);
  }
  const shape = (v: unknown) => (v === undefined ? 'absent' : Array.isArray(v) ? `a list of ${v.length}` : 'one string');
  if (shape(en.notes) !== shape(t.notes)) problems.push(`notes: ${shape(t.notes)} translated vs ${shape(en.notes)} English`);
  const optional: Array<[string, unknown, unknown]> = [
    ['importPathway', en.importPathway, t.importPathway],
    ['regulatoryNote', en.regulatoryNote, t.regulatoryNote],
    ['unscoredReason', en.unscoredReason, t.unscoredReason],
    ['discontinuedNote', en.discontinued?.note, t.discontinuedNote],
  ];
  for (const [field, a, b] of optional) {
    if ((a === undefined) !== (b === undefined)) problems.push(`${field}: ${b === undefined ? 'absent' : 'present'} translated vs ${a === undefined ? 'absent' : 'present'} English`);
  }
  return problems;
}

/** The languages LATAM product prose is translated into (English is the source). */
export type LatamProductLocale = 'es';

/**
 * The English LATAM record with its prose replaced by the translation and the
 * translated bestFor / heroIngredients / ingredientDosages text in `display`.
 * Structure and every data key stay English-sourced. Throws when the
 * translation is missing or no longer lines up with the English record, so a
 * partial translation fails the LATAM build instead of shipping English.
 */
export function localizeProductLatam(product: Product, locale: LatamProductLocale): Product {
  const t = TRANSLATIONS[locale].find((x) => x.slug === product.slug);
  if (!t) throw new Error(`LATAM product "${product.slug}" has no ${locale} translation in products-latam-${locale}.ts`);
  const problems = latamTranslationShapeProblems(product, t);
  if (problems.length > 0) {
    throw new Error(
      `LATAM product "${product.slug}": the ${locale} translation in products-latam-${locale}.ts no longer lines up with products-latam.json (${problems.join('; ')}) — re-translate it from the current English record`,
    );
  }
  return {
    ...product,
    summary: t.summary,
    whatItIs: t.whatItIs,
    howItWorks: t.howItWorks,
    whatToExpect: t.whatToExpect,
    pros: t.pros,
    cons: t.cons,
    ...(t.notes !== undefined ? { notes: t.notes } : {}),
    ...(t.importPathway !== undefined ? { importPathway: t.importPathway } : {}),
    ...(t.regulatoryNote !== undefined ? { regulatoryNote: t.regulatoryNote } : {}),
    ...(t.unscoredReason !== undefined ? { unscoredReason: t.unscoredReason } : {}),
    ...(product.discontinued && t.discontinuedNote !== undefined
      ? { discontinued: { ...product.discontinued, note: t.discontinuedNote } }
      : {}),
    display: {
      bestFor: t.bestFor,
      heroIngredients: t.heroIngredients,
      ingredientDosages: t.ingredientDosages,
    },
  };
}

/** Every LATAM record, discontinued included (review pages, search index), in products-latam.json order, with its prose in `locale`. */
export function localizedAllProductsLatam(locale: LatamProductLocale): Product[] {
  return allProductsLatam.map((p) => localizeProductLatam(p, locale));
}

/** The recommendable LATAM records (productsLatam: discontinued excluded), with their prose in `locale`. */
export function localizedProductsLatam(locale: LatamProductLocale): Product[] {
  return productsLatam.map((p) => localizeProductLatam(p, locale));
}

export const latamProductTranslationsEs: LatamProductTranslation[] = [
  {
    slug: 'mind-lab-pro-review',
    summary:
      'Un stack nootrópico de 11 ingredientes y nuestra selección n.º 1 para compradores en Latam que buscan un apoyo cognitivo completo. Se vende solo en USD, sin opción de moneda local. Se envía desde el Reino Unido por correo aéreo con seguimiento (5–20 días hábiles) o por mensajería DHL (2–7 días hábiles) (según mindlabpro.com, consultado 2026-09-29). Los compradores en México deben tener en cuenta que la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) no aprueba previamente los suplementos importados. Los aranceles de importación y el despacho aduanero corren por cuenta del comprador. Los compradores en Argentina enfrentan controles cambiarios que pueden complicar los pagos con tarjeta en USD. Las preguntas frecuentes de Mind Lab Pro dan una lista parcial de los territorios a los que envía, y esa lista no menciona México, Brasil, Argentina, Colombia, Chile ni Perú (consultado 2026-10-05) — confirma tu país en el checkout.',
    whatItIs:
      'Mind Lab Pro es un stack nootrópico de 11 ingredientes que vende Performance Lab Group Ltd (Royal Leamington Spa, Reino Unido) según los términos de mindlabpro.com (las propias publicaciones de la marca dicen que lo formuló Opti-Nutra en el Reino Unido; consultado 2026-10-08), diseñado para cubrir memoria, concentración, energía mental, estado de ánimo y salud cerebral a largo plazo sin cafeína ni mezclas patentadas. Opti-Nutra Ltd es el nombre anterior de Performance Lab Ltd (Companies House 09439153; consultado 2026-10-09). Para compradores en Latam, se vende exclusivamente en USD, sin pago en moneda local. El producto se envía internacionalmente desde el Reino Unido; no hemos verificado un registro local del producto ante la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) en Argentina, el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el Instituto de Salud Pública (ISP) en Chile ni la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) en Perú — entra como suplemento importado para uso personal; confirma en el checkout si envía a tu país.',
    howItWorks:
      'Mind Lab Pro actúa sobre seis vías biológicas a la vez. La Citicolina y la Fosfatidilserina apoyan el sistema colinérgico y la integridad de las membranas neuronales. Los extractos de Melena de León elevaron el factor de crecimiento nervioso (NGF) en estudios celulares y en animales. Los efectos antioxidantes y sobre la acetilcolina y la serotonina que se proponen para la Bacopa Monnieri provienen de estudios en animales y de laboratorio. La Rhodiola Rosea y la L-Tirosina apoyan el equilibrio de dopamina/noradrenalina bajo estrés. La L-Teanina favorece la actividad de ondas cerebrales alfa para una concentración tranquila. Las vitaminas del grupo B (B6, B9, B12) apoyan la regulación de la homocisteína y la síntesis de neurotransmisores.',
    whatToExpect:
      'En 30-60 minutos: una dosis única de 200mg de L-Teanina mejoró el tiempo de reacción de elección en ensayos (este producto tiene 100mg); nuestra página de L-Teanina califica como preliminar su evidencia sobre la concentración tranquila. Los ensayos de memoria de la Citicolina midieron efectos tras 2–3 meses. La L-Tirosina se toma alrededor de 1 hora antes de una tarea exigente, y su ensayo positivo de menor dosis usó 2000mg (este producto tiene 175mg). Los ensayos de memoria de la Bacopa duraron 8–12 semanas con 300–450mg de extracto al día (este producto tiene 150mg), y la dosis de Melena de León aquí, 500mg, está por debajo de los 1–1.8g usados en ensayos con adultos sanos. Mind Lab Pro es un suplemento de largo plazo: los ensayos de Bacopa que citamos midieron la memoria después de 12 semanas. Los mejores resultados requieren 3+ meses de uso diario constante.',
    pros: [
      '11 ingredientes, todas las dosis declaradas',
      'Analizado por terceros, sin alérgenos',
      'Tiendas en línea para la UE y EE. UU.',
      'Sin cafeína',
      'Cookie de afiliado de 365 días',
      'Envía internacionalmente desde el Reino Unido — la lista parcial de territorios de sus preguntas frecuentes no menciona México, Brasil, Argentina, Colombia, Chile ni Perú, así que confirma tu país en el checkout (consultado 2026-10-05)',
    ],
    cons: [
      'Precio premium ($69/mes)',
      '2 cápsulas por porción (se sugieren 2–4 al día)',
      'Garantía de devolución de 30 días',
      'Envío internacional a Latam: 5-20 días hábiles por correo aéreo o 2-7 días hábiles por DHL (según mindlabpro.com, consultado 2026-09-29)',
      'Pueden aplicarse aranceles o impuestos de importación según el país de destino',
    ],
    notes: [
      'Cantidades de ingredientes según la etiqueta de Mind Lab Pro en https://www.mindlabpro.com/products/mind-lab-pro, consultada 2026-10-08.',
    ],
    bestFor: ['Concentración', 'Memoria', 'Salud cerebral a largo plazo'],
    heroIngredients: ['Melena de León', 'Citicolina', 'Bacopa Monnieri', 'Rhodiola Rosea', 'L-Teanina'],
    ingredientDosages: [
      { name: 'Hongo Melena de León', doseInProduct: '500mg' },
      { name: 'Citicolina (Cognizin)', doseInProduct: '250mg' },
      { name: 'Bacopa Monnieri (extracto de espectro completo, 24% de bacósidos)', doseInProduct: '150mg' },
      { name: 'Rhodiola Rosea (3% de rosavinas, 1% de salidrósidos)', doseInProduct: '50mg' },
      { name: 'L-Teanina', doseInProduct: '100mg' },
      { name: 'Fosfatidilserina', doseInProduct: '100mg' },
      { name: 'N-Acetil L-Tirosina (NALT)', doseInProduct: '175mg' },
      { name: 'Extracto de corteza de pino marítimo (95% de proantocianidinas)', doseInProduct: '75mg' },
      { name: 'Vitamina B6 (NutriGenesis)', doseInProduct: '2.5mg' },
      { name: 'Vitamina B9 (NutriGenesis)', doseInProduct: '100mcg' },
      { name: 'Vitamina B12 (NutriGenesis)', doseInProduct: '7.5mcg' },
    ],
    sourceHashes: {
      summary: '950042d32d75',
      whatItIs: '6697bd46e665',
      howItWorks: '45336ca320c6',
      whatToExpect: 'f0b8465d717c',
      pros: '4f3287b6a517',
      cons: 'b3e71326fb3d',
      notes: '45728b509ed4',
      bestFor: '94d2459b035d',
      heroIngredients: '819e5ca1aff7',
      ingredientDosages: 'b17cdf0715c0',
      importPathway: '74234e98afe7',
      regulatoryNote: '74234e98afe7',
      unscoredReason: '74234e98afe7',
      discontinuedNote: '74234e98afe7',
    },
  },
  {
    slug: 'noocube-review',
    summary:
      'Fórmula sólida anclada en Lutemax 2020, a $64.99 USD por un frasco de 30 porciones — los precios están en USD, sin opción de moneda local. La marca no publica un plazo de entrega estimado para este país; consulta el plazo estimado en el checkout. Los aranceles de importación y el despacho aduanero corren por cuenta del comprador; los compradores en Argentina pueden enfrentar restricciones por el control cambiario en las transacciones con tarjeta en USD. Nota: el perfil de Trustpilot de noocube.com todavía no tiene reseñas — verifica de forma independiente antes de comprar.',
    whatItIs:
      'NooCube es un stack nootrópico de 12 ingredientes fabricado por Wolfson Brands, un gran fabricante de suplementos. Su rasgo más destacado para quienes trabajan muchas horas frente a pantallas es Lutemax 2020 — un extracto patentado de luteína y zeaxantina con evidencia mixta sobre la fatiga visual por pantallas: un ensayo de 6 meses financiado por el fabricante de Lutemax encontró menos fatiga visual y cansancio ocular autoevaluados (Stringham 2017), pero un ensayo de 2025 con otro producto de luteína/zeaxantina no encontró cambios en la fatiga visual autoevaluada (Lopresti 2025). Para compradores en Latam, NooCube tiene precio exclusivamente en USD y se envía internacionalmente como suplemento para uso personal, y entra en estos mercados bajo las franquicias de importación personal; no hemos verificado un registro local del producto ante la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) en Argentina, el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el Instituto de Salud Pública (ISP) en Chile ni la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) en Perú. Los aranceles varían según el país y corren por cuenta del comprador.',
    howItWorks:
      'Lutemax 2020 filtra la luz azul de alta energía en la retina; los resultados de los ensayos sobre la fatiga ocular relacionada con pantallas son mixtos (un ensayo financiado por el fabricante, positivo; un ensayo de otro producto de luteína/zeaxantina, nulo en la fatiga visual autoevaluada). La colina (100mg, a partir de 250mg de bitartrato de colina VitaCholine) apoya el sistema colinérgico; la fórmula actual ya no contiene Alfa-GPC ni Huperzina A. La L-Teanina aporta una concentración tranquila. La Bacopa Monnieri actúa sobre la consolidación de la memoria a lo largo de semanas.',
    whatToExpect:
      'Primer día: una dosis única de 200mg de L-Teanina mejoró el tiempo de reacción de elección en ensayos (este producto tiene 100mg); nuestra página de L-Teanina califica como preliminar su evidencia sobre la concentración tranquila. Lutemax: sus ensayos sobre fatiga visual duraron 6 meses y no coinciden, así que no cuentes con un efecto rápido sobre la fatiga ocular. A las 8 semanas: mejoras modestas de memoria (Bacopa, aunque con dosis insuficiente). Ajusta tus expectativas en consecuencia: la Bacopa está por debajo de la referencia clínica de 300mg. El perfil de Trustpilot de noocube.com todavía no tiene reseñas — verifica la política de cancelación antes de comprar.',
    pros: [
      'Lutemax 2020 para quienes trabajan frente a pantallas',
      'Buena relación calidad-precio a $64.99/mes',
      'Garantía de devolución de 60 días',
      'Envía internacionalmente — sus preguntas frecuentes indican Europa, Canadá y Australia en un plazo de 10 días hábiles y dicen que la entrega en otros lugares puede variar; la entrega en Latinoamérica no está confirmada (consultado 2026-10-05)',
    ],
    cons: [
      'Sin reseñas en el perfil de Trustpilot de noocube.com (consultado 2026-09-28)',
      'Algunos ingredientes con dosis insuficiente',
      'Problemas para cancelar la suscripción (BBB)',
      'Envío internacional a Latam: la marca no publica un plazo de entrega estimado para este país; consulta el plazo estimado en el checkout',
      'Pueden aplicarse aranceles o impuestos de importación según el país de destino',
    ],
    notes: [
      'Los precios por compra al por mayor cambiaron en junio de 2026: suministro de 5 meses a $194.99 USD (antes, 6 meses por $180). Los compradores en Latam que importen directamente verán aumentos de precio equivalentes en BRL/MXN.',
      'Cantidades de ingredientes según la etiqueta de NooCube en https://noocube.com/cdn/shop/t/90/assets/noocube-label-usa-v3.jpg?v=141477061997521322691727969792, consultada 2026-10-08.',
    ],
    bestFor: ['Concentración', 'Trabajo frente a pantallas', 'Económico'],
    heroIngredients: ['Lutemax 2020', 'Bacopa Monnieri', 'Panax Ginseng', 'VitaCholine', 'Uña de gato', 'Resveratrol', 'L-Teanina', 'Pterostilbeno'],
    ingredientDosages: [
      { name: 'Vitamina B1 (tiamina HCl)', doseInProduct: '1.1mg' },
      { name: 'Vitamina B12 (cianocobalamina)', doseInProduct: '2.5mcg' },
      { name: 'Biotina (D-biotina)', doseInProduct: '50mcg' },
      { name: 'Colina (VitaCholine)', doseInProduct: '100mg (a partir de 250mg de bitartrato de colina)' },
      { name: 'Extracto de Bacopa Monnieri (planta, 20% de bacósidos)', doseInProduct: '250mg' },
      { name: 'L-Tirosina', doseInProduct: '250mg' },
      { name: 'Extracto concentrado de uña de gato (corteza de Uncaria tomentosa)', doseInProduct: '175mg (extracto 4:1)' },
      { name: 'L-Teanina', doseInProduct: '100mg' },
      { name: 'Extracto concentrado de Panax Ginseng', doseInProduct: '20mg (extracto 8:1, equivalente a 160mg de polvo de Panax Ginseng)' },
      { name: 'Lutemax 2020 (extracto de flor de cempasúchil, Tagetes erecta)', doseInProduct: '20mg' },
      { name: 'Trans-resveratrol (raíz de Polygonum cuspidatum)', doseInProduct: '14.3mg' },
      { name: 'Pterostilbeno', doseInProduct: '140mcg' },
    ],
    sourceHashes: {
      summary: 'fdc02ee43b9e',
      whatItIs: '24fdf4594d0c',
      howItWorks: '92be27581cb1',
      whatToExpect: '7573cae767ea',
      pros: '4095d302d222',
      cons: '3f3db80c0f09',
      notes: '036bc3d31885',
      bestFor: '54181b2ba159',
      heroIngredients: '19f90e91de7e',
      ingredientDosages: 'aa0e9670dc72',
      importPathway: '74234e98afe7',
      regulatoryNote: '74234e98afe7',
      unscoredReason: '74234e98afe7',
      discontinuedNote: '74234e98afe7',
    },
  },
  {
    slug: 'qualia-mind-review',
    summary:
      '31 ingredientes activos — la mayor cantidad de cualquier fórmula individual en esta reseña — y la opción de gama premium para biohackers experimentados en Latam. Precio en dólares estadounidenses, sin opción de moneda local. Qualia no envía directamente a Latinoamérica: sus preguntas frecuentes solo mencionan Canadá, el Reino Unido, Irlanda, Australia y Nueva Zelanda para pedidos internacionales directos y remiten a los demás países a iHerb (consultado 2026-10-05). Los compradores en Argentina deben confirmar que su banco procesará cargos en USD antes de hacer el pedido. Ideal para usuarios experimentados que se manejan bien con la logística de importación.',
    whatItIs:
      'Qualia Mind es un stack nootrópico de 31 ingredientes desarrollado por Neurohacker Collective, una empresa con sede en San Diego enfocada en la biología de sistemas y la suplementación compleja. Es la fórmula con más ingredientes de esta reseña y está dirigida a usuarios experimentados de suplementos que quieren un stack cognitivo integral en un solo producto. Para compradores en Latam, se vende en USD a través de una tienda en línea de EE. UU. que no envía directamente a Latinoamérica (las preguntas frecuentes de Qualia remiten a los demás países a iHerb). Qualia Mind entra en los mercados de Latam bajo las franquicias de importación personal; no hemos verificado un registro local del producto ante la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) en Argentina, el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el Instituto de Salud Pública (ISP) en Chile ni la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) en Perú. La cantidad de cápsulas es alta: 6 por porción, 20 porciones por envase.',
    howItWorks:
      'Qualia Mind cubre más vías cognitivas que cualquier competidor: colinérgicos (Alfa-GPC, Citicolina en forma de Cognizin), adaptógenos (Rhodiola), neuronutrientes (PS), aminoácidos precursores (Tirosina, Taurina, Teanina), complejo de vitaminas B y varios ingredientes novedosos (SmartSeed, Sabroxy, pirroloquinolina quinona). La teoría es una optimización sinérgica de todos los sistemas cognitivos a la vez. Neurohacker publica un programa de investigación propio que respalda la fórmula.',
    whatToExpect:
      'Efectos agudos el primer día: atención sostenida y un aumento moderado de energía por la cafeína (100mg por porción). En 2-4 semanas: mejor resistencia mental y memoria de trabajo. A las 8-12 semanas: beneficios acumulativos de los adaptógenos y de memoria. Importante: 6 cápsulas por porción es una carga diaria de cápsulas considerable. Empieza con el ciclo de carga recomendado de 7 días (2 días de descanso por semana) para evaluar tu tolerancia.',
    pros: [
      '31 ingredientes activos',
      'Garantía de devolución de 100 días',
      'Programa de investigación publicado',
      'Respetado en la comunidad de biohacking',
    ],
    cons: [
      '$159 en compra única, o $139 por envío de suscripción cada 4 semanas',
      '6 cápsulas por porción',
      'Contiene cafeína',
      'No envía directamente a Latinoamérica — las preguntas frecuentes de Qualia solo mencionan Canadá, el Reino Unido, Irlanda, Australia y Nueva Zelanda para pedidos internacionales directos y remiten a los demás países a iHerb (consultado 2026-10-05)',
      'Pueden aplicarse aranceles o impuestos de importación según el país de destino',
    ],
    notes: [
      'Cantidades de ingredientes según la etiqueta de Qualia Mind 2.0 de Qualia Life Sciences en https://www.qualialife.com/shop/qualia-mind, consultada 2026-10-08.',
    ],
    bestFor: ['Usuarios avanzados', 'Neurohackers', 'Stacks complejos'],
    heroIngredients: ['Fosfatidilserina', 'Alfa-GPC', 'Acetyl-L-Carnitine', 'Rhodiola', 'Ginkgo', 'Nutricog'],
    ingredientDosages: [
      { name: 'Vitamina C (ácido ascórbico)', doseInProduct: '45mg' },
      { name: 'Vitamina D (colecalciferol)', doseInProduct: '15mcg (600 UI)' },
      { name: 'Tiamina (tiamina HCl)', doseInProduct: '2.5mg' },
      { name: 'Riboflavina', doseInProduct: '2mg' },
      { name: 'Niacina (niacinamida)', doseInProduct: '16mg' },
      { name: "Vitamina B6 (piridoxal 5'-fosfato)", doseInProduct: '2mg' },
      { name: 'Folato (L-5-metiltetrahidrofolato de calcio)', doseInProduct: '333mcg DFE' },
      { name: 'Vitamina B12 (metilcobalamina)', doseInProduct: '100mcg' },
      { name: 'Biotina', doseInProduct: '30mcg' },
      { name: 'Ácido pantoténico (D-pantotenato de calcio)', doseInProduct: '5mg' },
      { name: 'Magnesio (aspartato de magnesio)', doseInProduct: '84mg' },
      { name: 'Acetyl-L-Carnitine HCl', doseInProduct: '500mg' },
      { name: 'Extracto de raíz de Rhodiola rosea (3% de rosavinas, 1% de salidrósidos)', doseInProduct: '370mg' },
      { name: 'Nutricog (extractos de fruto de Terminalia chebula y de resina de goma de Boswellia serrata)', doseInProduct: '300mg' },
      { name: 'N-Acetil-L-Tirosina', doseInProduct: '250mg' },
      { name: 'Taurina', doseInProduct: '200mg' },
      { name: 'L-Teanina', doseInProduct: '200mg' },
      { name: 'Extracto orgánico de hongo Melena de León (RealLionsMane)', doseInProduct: '125mg (extracto 8:1)' },
      { name: 'Extracto de hoja de Ginkgo biloba (24% de glucósidos)', doseInProduct: '120mg' },
      { name: 'Alfa-GPC (L-alfa-glicerilfosforilcolina)', doseInProduct: '115mg' },
      { name: 'Cafeína (de extracto de fruto de café Coffeeberry, extracto de semilla de guaraná y cafeína anhidra)', doseInProduct: '100mg' },
      { name: 'Fosfatidilserina (de lecitina de girasol)', doseInProduct: '100mg' },
      { name: 'Extracto de raíz de Polygala tenuifolia', doseInProduct: '100mg' },
      { name: 'SmartSeed (extracto de semilla de Celastrus paniculatus)', doseInProduct: '90mg' },
      { name: 'Cognizin (citicolina)', doseInProduct: '50mg' },
      { name: 'Sabroxy (extracto de corteza de Oroxylum indicum)', doseInProduct: '50mg' },
      { name: 'Extracto de estigma de azafrán', doseInProduct: '30mg' },
      { name: 'Luteína (extracto de flor de cempasúchil Lutemax Brain)', doseInProduct: '10mg (12mg de luteína + zeaxantina en conjunto)' },
      { name: 'Sal disódica de pirroloquinolina quinona (PQQ)', doseInProduct: '10mg' },
      { name: 'Boro (glicinato de boro)', doseInProduct: '3mg' },
      { name: 'Zeaxantina (extracto de flor de cempasúchil Lutemax Brain)', doseInProduct: '2mg (12mg de luteína + zeaxantina en conjunto)' },
    ],
    sourceHashes: {
      summary: 'db7c76b68fb4',
      whatItIs: '41e5760309b9',
      howItWorks: '7781d1ffa9be',
      whatToExpect: '21f10a72df63',
      pros: '17da699dc316',
      cons: 'ac038ed65860',
      notes: '45e529bf14b7',
      bestFor: '4a7706b60d66',
      heroIngredients: 'e1f9a35f0f34',
      ingredientDosages: 'b49efe525357',
      importPathway: '74234e98afe7',
      regulatoryNote: '74234e98afe7',
      unscoredReason: '74234e98afe7',
      discontinuedNote: '74234e98afe7',
    },
  },
  {
    slug: 'onnit-alpha-brain-review',
    summary:
      'El stack nootrópico estadounidense de Onnit, respaldado por un ensayo aleatorizado publicado en 2016 — una señal de confianza significativa para los compradores en Latam que compran desde el exterior. Precio en dólares estadounidenses, sin opción de moneda local. Se envía desde EE. UU.; consulta el plazo de entrega estimado en el checkout. Los aranceles de importación y el despacho aduanero corren por cuenta del comprador; los compradores en Argentina deben verificar que el emisor de su tarjeta apruebe transacciones en USD dado el control cambiario. La garantía de devolución de 30 días de Onnit cubre la primera compra de cada producto realizada directamente en Onnit.com.',
    whatItIs:
      'Alpha Brain es el nootrópico insignia de Onnit, lanzado por primera vez en 2011 y popularizado a través del pódcast de Joe Rogan. Alpha Brain tiene un ensayo aleatorizado, doble ciego y controlado con placebo publicado sobre el producto terminado (Solomon 2016, PubMed 26876224): 63 adultos de 18 a 35 años, 6 semanas, mejoró el recuerdo verbal diferido y el funcionamiento ejecutivo; uno de los autores trabajaba para Onnit Labs. Alpha Brain no figura en el directorio "Certified for Sport" de NSF (National Sanitation Foundation), consultado 2026-10-19. Onnit dice que fabrica sus productos en instalaciones con certificación NSF de GMP (Good Manufacturing Practice, buenas prácticas de fabricación), que es una certificación de la fábrica, no una certificación del producto para el deporte con controles antidopaje. Para compradores en Latam, Alpha Brain se vende exclusivamente en USD y se envía desde EE. UU. como suplemento importado para uso personal. No hemos verificado un registro local del producto ante la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) en Argentina, el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el Instituto de Salud Pública (ISP) en Chile ni la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) en Perú. Los aranceles de importación y el despacho aduanero corren por cuenta del comprador — la garantía de devolución de 30 días de Onnit reembolsa solo el costo del producto, no el envío.',
    howItWorks:
      'Alpha Brain usa tres mezclas patentadas — Onnit Flow Blend, Focus Blend y Fuel Blend — que contienen colinérgicos (Alfa-GPC), adaptógenos (Bacopa) y aminoácidos (Tirosina, Teanina). La etiqueta indica el total de cada mezcla y dos cantidades individuales (Bacopa 100mg, Huperzina A 400mcg): la Bacopa, la Alfa-GPC (como máximo 140mg) y la L-Tirosina (como máximo 650mg) no alcanzan sus dosis clínicas, y los demás componentes de las mezclas no pueden verificarse individualmente. El ensayo de 2016 (Solomon 2016; uno de los autores trabajaba para Onnit Labs) probó la fórmula completa y encontró mejoras en el recuerdo verbal diferido y el funcionamiento ejecutivo frente a placebo.',
    whatToExpect:
      'No contiene cafeína. La garantía de devolución de 30 días de Onnit cubre la primera compra de cada producto realizada directamente en Onnit.com.',
    pros: [
      'Un ensayo aleatorizado publicado de la fórmula terminada (2016)',
      'El mayor reconocimiento de marca en EE. UU.',
      'Solo 2 cápsulas',
      'Garantía de devolución de 30 días en la primera compra',
      'La lista de mercados de onnit.com menciona Brasil, Argentina, Colombia, Chile y Perú (consultado 2026-09-29)',
    ],
    cons: [
      'Las mezclas patentadas ocultan las dosis',
      'Problemas para cancelar la suscripción',
      'Envío internacional a Latam: consulta el plazo de entrega estimado en el checkout',
      'Pueden aplicarse aranceles o impuestos de importación según el país de destino',
    ],
    notes: [
      'Fórmula según la tabla Supplement Facts de la página del producto (https://www.onnit.com/products/alpha-brain-90-ct, consultada 2026-10-08): por 2 cápsulas, Vitamina B6 10mg; Onnit Flow Blend 650mg (L-Tirosina, L-Teanina, Oat Straw Extract, Fosfatidilserina); extracto de corteza de uña de gato 350mg; Onnit Focus Blend 240mg (Alfa-GPC, extracto de Bacopa 100mg, extracto de licopodio dentado que aporta Huperzina A 400mcg); Onnit Fuel Blend 60mg (L-Leucina, Pterostilbeno). Las dosis de referencia son las de las páginas de ingredientes de este sitio.',
      'La garantía de devolución de Onnit es de 30 días, para la primera compra de cada producto realizada directamente en Onnit.com, y reembolsa el costo del producto pero no el envío (https://help.onnit.com/en-US/30-day-money-back-guarantee-6327406, consultado 2026-10-08).',
    ],
    bestFor: ['Público general', 'Reconocimiento de marca'],
    heroIngredients: ['L-Teanina', 'Huperzina A', 'Vitamina B6', 'Alfa-GPC', 'Fosfatidilserina'],
    ingredientDosages: [
      { name: 'Bacopa Monnieri (Focus Blend)', doseInProduct: '100mg' },
      { name: 'Alfa-GPC (Focus Blend)', doseInProduct: 'No declarada; como máximo 140mg (mezcla de 240mg, incl. 100mg de Bacopa)' },
      { name: 'Huperzina A (licopodio dentado, Focus Blend)', doseInProduct: '400mcg' },
      { name: 'L-Tirosina (Flow Blend)', doseInProduct: 'No declarada; como máximo 650mg (total de la mezcla)' },
      { name: 'L-Teanina (Flow Blend)', doseInProduct: 'No declarada (parte de una mezcla de 650mg)' },
      { name: 'Fosfatidilserina (Flow Blend)', doseInProduct: 'No declarada (parte de una mezcla de 650mg)' },
      { name: 'Oat Straw Extract (Flow Blend)', doseInProduct: 'No declarada (parte de una mezcla de 650mg)' },
      { name: 'Extracto de corteza de uña de gato', doseInProduct: '350mg' },
      { name: 'Vitamina B6 (piridoxina HCl)', doseInProduct: '10mg' },
      { name: 'L-Leucina + Pterostilbeno (Fuel Blend)', doseInProduct: '60mg (total de la mezcla)' },
    ],
    importPathway:
      'La lista de mercados de onnit.com menciona Brasil, Argentina, Colombia, Chile y Perú (consultado 2026-09-29); el envío a México no pudo confirmarse en el sitio de la marca (su página de ayuda sobre envíos no estaba disponible) — confírmalo en el checkout.',
    sourceHashes: {
      summary: '94ffb13ec516',
      whatItIs: '764478ca7c45',
      howItWorks: '800b71b44f91',
      whatToExpect: '805bde2a4832',
      pros: '567590e06541',
      cons: 'a8531382e7c2',
      notes: 'bdd739a2f30e',
      bestFor: 'dfdf01e5a25a',
      heroIngredients: 'dec48d0006ad',
      ingredientDosages: 'd902de0ef96e',
      importPathway: '2262c719be2d',
      regulatoryNote: '74234e98afe7',
      unscoredReason: '74234e98afe7',
      discontinuedNote: '74234e98afe7',
    },
  },
  {
    slug: 'thesis-nootropics-review',
    summary:
      '4 mezclas de fórmulas personalizadas al mes con un servicio de coaching en nootrópicos — la opción más flexible para compradores en Latam que quieren optimizar su stack antes de comprometerse a largo plazo. Se vende por suscripción o como compra única, con precio en dólares estadounidenses y sin opción de moneda local. Se envía desde EE. UU.; consulta el plazo de entrega estimado en el checkout. Nota: al ser un servicio de suscripción, cada envío mensual es una importación separada, y los aranceles de importación y el despacho aduanero corren por cuenta del comprador cada vez; los compradores en Argentina deben confirmar que el cobro recurrente en USD sea viable con los controles cambiarios actuales.',
    whatItIs:
      'Thesis es una suscripción de nootrópicos personalizada que ofrece cuatro mezclas de fórmulas — Clarity, Motivation, Stress Reset y Neuroprotection — junto con acceso a un servicio de coaching en nootrópicos. En lugar de una fórmula fija, te permite rotar mezclas en distintos días para encontrar lo que mejor funciona para tu perfil cognitivo. Las filas de ingredientes de esta página cubren las cuatro fórmulas cuyas etiquetas publica Thesis; las páginas de producto de Energy, Logic, Creativity y Confidence devolvieron un error 404 cuando las consultamos el 8 de octubre de 2026. Para compradores en Latam, Thesis opera exclusivamente en USD, sin pago en moneda local, y se envía desde EE. UU. como suscripción de suplementos para uso personal. No hemos verificado un registro local de ninguna de las mezclas ante la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, la ANMAT (Argentina), el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el ISP (Chile) ni la DIGEMID (Perú). Como Thesis funciona por suscripción, cada envío mensual es un evento de importación separado, lo que aumenta la exposición acumulada a aranceles y demoras — algo especialmente relevante para compradores en Brasil y Argentina.',
    howItWorks:
      "Cada fórmula de Thesis apunta a un objetivo distinto, y Thesis indica una cantidad para cada ingrediente. Clarity: CDP-colina 250mg, Panax ginseng 200mg, Melena de León 500mg, 7,8-dihidroxiflavona 30mg y vitamina B6 5mg. Motivation: Dynamine (methylliberine) 100mg, teacrina 100mg, N-acetil-L-tirosina 400mg, Rhodiola (salidrósidos fermentados) 60mg, vitamina B6 5mg, vitamina B12 1000mcg, L-teanina 200mg y cafeína 150mg. Stress Reset: ashwagandha 120mg, azafrán 28mg, Zembrin 25mg, Rhodiola (salidrósidos fermentados) 30mg, bisglicinato de magnesio 84mg y dihidrohonokiol-B 10mg. Neuroprotection: Bacopa 300mg, Ginkgo 120mg, semilla de mostaza 50mg, semilla de brócoli 125mg, cúrcuma 200mg, CoQ10 100mg, PQQ 20mg, NADH 20mg, espermidina 10mg y selenio 200mcg. Clarity, Stress Reset y Neuroprotection se venden con o sin cafeína (las cápsulas con cafeína añaden cafeína 100mg, más L-teanina 100mg en Stress Reset y Neuroprotection); Motivation contiene 150mg de cafeína por porción de dos cápsulas. El modelo de personalización te permite ajustar la fórmula adecuada a tu demanda cognitiva del día.",
    whatToExpect:
      'Primer mes: espera un período de experimentación. Rotarás entre 4 mezclas, 7 días cada una, para evaluar cuál tiene el efecto más notable para ti. Los efectos de la mezcla Clarity se desarrollan a lo largo de 2-4 semanas. El servicio de coaching aporta valor a quienes quieren orientación para optimizar su protocolo.',
    pros: [
      '4 fórmulas personalizadas/mes',
      'Coach de nootrópicos incluido',
      'Buena transparencia de fórmula',
      'Envía desde EE. UU. — su política de reembolsos cubre pedidos a países fuera de EE. UU. pero no enumera ningún país; la entrega en Latinoamérica no está confirmada (consultado 2026-10-05)',
    ],
    cons: [
      'Una compra única cuesta más que la misma fórmula por suscripción',
      'Requiere experimentación',
      'Envío internacional a Latam: consulta el plazo de entrega estimado en el checkout',
      'Pueden aplicarse aranceles o impuestos de importación según el país de destino',
    ],
    notes: [
      'Cantidades de ingredientes según las listas de ingredientes de las páginas de producto de Thesis (https://takethesis.com/products/clarity, https://takethesis.com/products/motivation, https://takethesis.com/products/stress-reset y https://takethesis.com/products/neuroprotection), consultadas 2026-10-08.',
      'Thesis no publica una tabla Supplement Facts. Leemos sus cantidades por porción de dos cápsulas (indica tomar dos cápsulas al día, y la página de Motivation dice que sus 150mg de cafeína son por porción); cuando una lectura por cápsula cambiaría el veredicto (la Melena de León de Clarity, el Ginkgo de Neuroprotection), la dosis se marca como no verificable.',
    ],
    bestFor: ['Personalización', 'Quienes optimizan su propio stack'],
    heroIngredients: ['CDP-Colina', 'Melena de León', 'Dynamine', 'L-Teanina', 'Ashwagandha'],
    ingredientDosages: [
      { name: 'CDP-Colina (Clarity)', doseInProduct: '250mg' },
      { name: 'Panax Ginseng (Clarity)', doseInProduct: '200mg' },
      { name: 'Melena de León (Hericium erinaceus) (Clarity)', doseInProduct: '500mg por cápsula o por porción (no se indica)' },
      { name: '7,8-Dihidroxiflavona (Clarity)', doseInProduct: '30mg' },
      { name: "Vitamina B6 (piridoxal-5'-fosfato) (Clarity)", doseInProduct: '5mg' },
      { name: 'Cafeína anhidra (solo en las cápsulas con cafeína) (Clarity)', doseInProduct: '100mg' },
      { name: 'Dynamine (methylliberine) (Motivation)', doseInProduct: '100mg' },
      { name: 'Teacrina (Motivation)', doseInProduct: '100mg' },
      { name: 'N-Acetil-L-Tirosina (NALT) (Motivation)', doseInProduct: '400mg' },
      { name: 'Rhodiola Rosea (salidrósidos fermentados) (Motivation)', doseInProduct: '60mg (base no indicada)' },
      { name: "Vitamina B6 (piridoxal-5'-fosfato) (Motivation)", doseInProduct: '5mg' },
      { name: 'Vitamina B12 (metilcobalamina) (Motivation)', doseInProduct: '1000mcg' },
      { name: 'L-Teanina (Camellia sinensis) (Motivation)', doseInProduct: '200mg' },
      { name: 'Cafeína anhidra (Motivation)', doseInProduct: '150mg' },
      { name: 'Ashwagandha (Withania somnifera) (Stress Reset)', doseInProduct: '120mg' },
      { name: 'Azafrán (Crocus sativus) (Stress Reset)', doseInProduct: '28mg' },
      { name: 'Zembrin (Sceletium tortuosum) (Stress Reset)', doseInProduct: '25mg' },
      { name: 'Rhodiola Rosea (salidrósidos fermentados) (Stress Reset)', doseInProduct: '30mg (base no indicada)' },
      { name: 'Bisglicinato de magnesio (Stress Reset)', doseInProduct: '84mg' },
      { name: 'Dihidrohonokiol-B (extracto de honokiol) (Stress Reset)', doseInProduct: '10mg' },
      { name: 'Cafeína anhidra (solo en las cápsulas con cafeína) (Stress Reset)', doseInProduct: '100mg' },
      { name: 'L-Teanina (Camellia sinensis, solo en las cápsulas con cafeína) (Stress Reset)', doseInProduct: '100mg' },
      { name: 'Bacopa Monnieri (Neuroprotection)', doseInProduct: '300mg' },
      { name: 'Ginkgo Biloba (Neuroprotection)', doseInProduct: '120mg por cápsula o por porción (no se indica)' },
      { name: 'Semilla de mostaza (Sinapis alba) (Neuroprotection)', doseInProduct: '50mg' },
      { name: 'Semilla de brócoli (Brassica oleracea) (Neuroprotection)', doseInProduct: '125mg' },
      { name: 'Cúrcuma (Curcuma longa) (Neuroprotection)', doseInProduct: '200mg' },
      { name: 'CoQ10 (fosfolípido de coenzima Q10) (Neuroprotection)', doseInProduct: '100mg' },
      { name: 'PQQ (sal disódica de pirroloquinolina quinona) (Neuroprotection)', doseInProduct: '20mg' },
      { name: 'NADH (nicotinamida adenina dinucleótido reducido) (Neuroprotection)', doseInProduct: '20mg' },
      { name: 'Triclorhidrato de espermidina (Neuroprotection)', doseInProduct: '10mg' },
      { name: 'Selenio (quelato de aminoácidos) (Neuroprotection)', doseInProduct: '200mcg' },
      { name: 'L-Teanina (Camellia sinensis, solo en las cápsulas con cafeína) (Neuroprotection)', doseInProduct: '100mg' },
      { name: 'Cafeína anhidra (solo en las cápsulas con cafeína) (Neuroprotection)', doseInProduct: '100mg' },
    ],
    sourceHashes: {
      summary: '338a06437f9e',
      whatItIs: '1690f8fba4b1',
      howItWorks: 'ea6d552045a3',
      whatToExpect: '2db60cacb0d2',
      pros: 'a0cf509a5bc0',
      cons: 'a00ddffeab63',
      notes: 'f80dbac304df',
      bestFor: '34164e84d167',
      heroIngredients: '623f49bd43c2',
      ingredientDosages: 'f5465cca7a73',
      importPathway: '74234e98afe7',
      regulatoryNote: '74234e98afe7',
      unscoredReason: '74234e98afe7',
      discontinuedNote: '74234e98afe7',
    },
  },
  {
    slug: 'nootropics-depot-lions-mane',
    summary:
      'Melena de León como ingrediente único (500mg de extracto de cuerpo fructífero por cápsula) — un punto de partida para compradores en Latam que exploran los nootrópicos por primera vez, con precio en dólares estadounidenses y sin opción de moneda local. Su laboratorio interno ISO publica un Certificado de Análisis (CoA) por lote, una señal de confianza útil al comprar suplementos desde el exterior. Se envía desde EE. UU. La marca no publica un plazo de entrega estimado para este país; consulta el plazo estimado en el checkout. Los aranceles de importación y el despacho aduanero corren por cuenta del comprador, y los compradores en Argentina enfrentan controles cambiarios que pueden complicar los pagos con tarjeta en USD.',
    whatItIs:
      "Nootropics Depot Lion's Mane Extract es un suplemento de un solo ingrediente que aporta extracto estandarizado de cuerpo fructífero de Hericium erinaceus a 500mg por cápsula. Nootropics Depot opera un laboratorio de análisis interno con certificación ISO y publica un CoA para cada lote — documentación que los compradores en Latam pueden usar para verificar la identidad del producto si la aduana lo cuestiona. Para compradores en Latam, el producto tiene precio exclusivamente en USD y se envía desde EE. UU. como suplemento para uso personal, y entra en estos mercados bajo las franquicias de importación personal; no hemos verificado un registro local del producto ante la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS) en México, la Agência Nacional de Vigilância Sanitária (ANVISA) en Brasil, la Administración Nacional de Medicamentos, Alimentos y Tecnología Médica (ANMAT) en Argentina, el Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA) en Colombia, el Instituto de Salud Pública (ISP) en Chile ni la Dirección General de Medicamentos, Insumos y Drogas (DIGEMID) en Perú. El menor valor por envío reduce la probabilidad de aranceles significativos en comparación con stacks de precio más alto.",
    howItWorks:
      'Los extractos de Melena de León elevaron el factor de crecimiento nervioso (NGF) en estudios con células y con ratones, pero en un estudio celular las hericenonas del cuerpo fructífero no lo hicieron (Mori 2008); el compuesto que se ha demostrado que llega al cerebro, la erinacina A, proviene del micelio y se probó en ratas (Tsai 2021). No encontramos ningún ensayo en humanos que midiera el NGF. El NGF favorece la supervivencia neuronal, el crecimiento de los axones y el mantenimiento de las neuronas del hipocampo y la corteza — las regiones responsables del aprendizaje y la memoria. Nootropics Depot usa un extracto estandarizado de cuerpo fructífero en lugar de micelio.',
    whatToExpect:
      'La Melena de León es un suplemento de largo plazo. Ensayos piloto informaron pequeños efectos agudos en 1–2 horas. En un ensayo en adultos con deterioro cognitivo leve, las puntuaciones mejoraron tras 16 semanas con 3g al día y volvieron a bajar dentro de las 4 semanas posteriores a suspenderlo (Mori 2009). Con las 1–2 cápsulas al día de la etiqueta (500–1000mg), este producto alcanza como mucho el extremo inferior de las dosis de los ensayos piloto (1–1.8g) y un tercio de los 3g al día usados por Mori 2009. Para obtener mejores resultados, tómalo de forma constante todos los días. Este producto funciona mejor combinado con un stack de varios ingredientes (p. ej., Mind Lab Pro ya contiene Melena de León) que como suplemento principal por sí solo.',
    pros: [
      'Laboratorio ISO: publica un CoA por lote',
      'Cuerpo fructífero estandarizado',
      'La mejor relación calidad-precio entre los de un solo ingrediente',
      'Máxima transparencia',
      'Envío internacional declarado — envío estándar gratuito a todo el mundo en pedidos internacionales de $200 o más; no se enumeran los países, así que confírmalo en el checkout (consultado 2026-10-05)',
    ],
    cons: [
      'Solo un ingrediente',
      'Envío internacional a Latam: la marca no publica un plazo de entrega estimado para este país; consulta el plazo estimado en el checkout',
      'Pueden aplicarse aranceles o impuestos de importación según el país de destino',
    ],
    bestFor: ['Un solo ingrediente', 'Salud cerebral a largo plazo'],
    heroIngredients: ['Melena de León (extracto estandarizado de cuerpo fructífero)'],
    ingredientDosages: [{ name: 'Extracto de cuerpo fructífero de Melena de León (1:1)', doseInProduct: '500mg' }],
    sourceHashes: {
      summary: '9d77ffc2620b',
      whatItIs: 'cec631d4adbf',
      howItWorks: '78a69885ee77',
      whatToExpect: '83a3b9024ad1',
      pros: '76ce7c900343',
      cons: 'f9d420c769e4',
      notes: '74234e98afe7',
      bestFor: 'a17a3bdda3e5',
      heroIngredients: '00cac060efd1',
      ingredientDosages: '5c90a7653103',
      importPathway: '74234e98afe7',
      regulatoryNote: '74234e98afe7',
      unscoredReason: '74234e98afe7',
      discontinuedNote: '74234e98afe7',
    },
  },
];

const TRANSLATIONS: Record<LatamProductLocale, LatamProductTranslation[]> = { es: latamProductTranslationsEs };
