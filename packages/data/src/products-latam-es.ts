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
      'Mind Lab Pro actúa sobre seis vías biológicas a la vez. La Citicolina y la Fosfatidilserina apoyan el sistema colinérgico y la integridad de las membranas neuronales. La Melena de León estimula el factor de crecimiento nervioso (NGF) para la neuroplasticidad. La Bacopa Monnieri mejora la comunicación sináptica para la memoria. La Rhodiola Rosea y la L-Tirosina apoyan el equilibrio de dopamina/noradrenalina bajo estrés. La L-Teanina favorece la actividad de ondas cerebrales alfa para una concentración tranquila. Las vitaminas del grupo B (B6, B9, B12) apoyan la regulación de la homocisteína y la síntesis de neurotransmisores.',
    whatToExpect:
      'En 30-60 minutos: una concentración tranquila leve gracias a la L-Teanina. En 2-4 semanas: más energía mental y menos fatiga cognitiva (Citicolina, Tirosina). A las 8-12 semanas: mejoras medibles en el recuerdo y en la velocidad de aprendizaje (Bacopa, Melena de León). Mind Lab Pro es un suplemento de largo plazo: los ensayos de Bacopa que citamos midieron la memoria después de 12 semanas. Los mejores resultados requieren 3+ meses de uso diario constante.',
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
      howItWorks: 'f42fa69f2e4d',
      whatToExpect: 'ea5270280803',
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
      'Primer día: una concentración tranquila leve gracias a la L-Teanina. Lutemax: sus ensayos sobre fatiga visual duraron 6 meses y no coinciden, así que no cuentes con un efecto rápido sobre la fatiga ocular. A las 8 semanas: mejoras modestas de memoria (Bacopa, aunque con dosis insuficiente). Ajusta tus expectativas en consecuencia: la Bacopa está por debajo de la referencia clínica de 300mg. El perfil de Trustpilot de noocube.com todavía no tiene reseñas — verifica la política de cancelación antes de comprar.',
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
      whatToExpect: '89633329003f',
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
];

const TRANSLATIONS: Record<LatamProductLocale, LatamProductTranslation[]> = { es: latamProductTranslationsEs };
