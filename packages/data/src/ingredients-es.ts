// LATAM Spanish (es-419) translations of the prose in ingredients.ts.
//
// Scope: every prose field the ingredient pages render (name, mechanism,
// clinicalDose, timeToEffect, studySummary, benefits, sideEffects,
// humanEffects[].effect/notes, howToTake, stacksWith[].ingredient/reason,
// faqs). Everything else (slug, category, productsContaining, sources and
// their study titles, evidenceReviewedAt, humanEffects[].evidenceStrength/
// magnitude/studies, stacksWith[].slug) always comes from the English record:
// localizeIngredient() merges the two, so a structural change in
// ingredients.ts reaches LATAM without touching this file.
//
// Translation rules: say exactly what the English says (no new claims, no
// stronger or weaker wording); keep every number, unit, range, percentage,
// study-design word, hedge, citation ("Mori 2009"), PMID and brand/extract
// name (KSM-66, Longvida, EGb 761, Cognizin, Zynamite, Dynamine, Lutemax
// 2020). Register: tú, as on the LATAM best-of pages. Decimals use a point
// (es-419); counts are written without a thousands separator. A name gets a
// Spanish common name only where the LATAM pages already use one (Melena de
// León, Citicolina, L-Teanina, L-Tirosina, Cafeína, Fosfatidilserina,
// Alfa-GPC, Huperzina A, corteza de pino marítimo); every other name stays as
// in English.
//
// Guards (packages/ui/src/ingredients-es.test.ts): every English slug has an
// entry with the same list lengths; the numbers in each Spanish field equal
// the English field's; each prose field is Spanish; and each entry's
// `sourceHashes` matches the English it was translated from.
//
// Refreshing after an English edit: the staleness test fails with
// "<slug>: <field> changed in ingredients.ts ... new hash <hash>". Re-translate
// that field from the current English, then set sourceHashes.<field> to the
// printed hash. Never update a hash without re-translating the field.

import { ingredients, type FAQ, type HowToTake, type Ingredient } from './ingredients';

/** The fields of an Ingredient that carry prose and are translated here. */
export const TRANSLATED_INGREDIENT_FIELDS = [
  'name',
  'mechanism',
  'clinicalDose',
  'timeToEffect',
  'studySummary',
  'benefits',
  'sideEffects',
  'humanEffects',
  'howToTake',
  'stacksWith',
  'faqs',
] as const;
export type TranslatedIngredientField = (typeof TRANSLATED_INGREDIENT_FIELDS)[number];

export interface IngredientTranslation {
  slug: string;
  name: string;
  mechanism: string;
  clinicalDose: string;
  timeToEffect: string;
  studySummary: string;
  benefits: string[];
  sideEffects: string[];
  /** Same order and length as the English humanEffects. */
  humanEffects: { effect: string; notes: string }[];
  /** `cycling` is present exactly when the English has it. */
  howToTake: HowToTake;
  /** Same order and length as the English stacksWith. */
  stacksWith: { ingredient: string; reason: string }[];
  faqs: FAQ[];
  /**
   * First 12 hex characters of the SHA-256 of each English source field this
   * entry was translated from (JSON of ingredientSourceFields(english)[field]).
   */
  sourceHashes: Record<TranslatedIngredientField, string>;
}

/**
 * The translatable prose of a record, field by field, in a fixed shape (arrays,
 * not objects, so key order cannot change a hash). Works on an English
 * Ingredient and on an IngredientTranslation alike.
 */
export function ingredientSourceFields(
  ing: Pick<Ingredient | IngredientTranslation, TranslatedIngredientField>,
): Record<TranslatedIngredientField, unknown> {
  const h = ing.howToTake;
  return {
    name: ing.name,
    mechanism: ing.mechanism,
    clinicalDose: ing.clinicalDose,
    timeToEffect: ing.timeToEffect,
    studySummary: ing.studySummary,
    benefits: ing.benefits,
    sideEffects: ing.sideEffects,
    humanEffects: ing.humanEffects.map((e) => [e.effect, e.notes]),
    howToTake: [h.dosage, h.timing, h.withFood, h.cycling ?? null, h.forms],
    stacksWith: ing.stacksWith.map((p) => [p.ingredient, p.reason]),
    faqs: ing.faqs.map((f) => [f.question, f.answer]),
  };
}

/** The languages ingredient prose is translated into (English is the source). */
export type IngredientLocale = 'es';

/**
 * The English record with its prose replaced by the translation. Structure
 * (slug, category, productsContaining, sources, evidenceReviewedAt, effect
 * grades and study counts, stack slugs) stays English-sourced. Throws when the
 * translation is missing or no longer lines up with the English record, so a
 * partial translation fails the build instead of shipping English on LATAM.
 */
export function localizeIngredient(ing: Ingredient, locale: IngredientLocale): Ingredient {
  const t = TRANSLATIONS[locale].find((x) => x.slug === ing.slug);
  if (!t) throw new Error(`ingredient "${ing.slug}" has no ${locale} translation in ingredients-${locale}.ts`);
  if (t.humanEffects.length !== ing.humanEffects.length || t.stacksWith.length !== ing.stacksWith.length) {
    throw new Error(`ingredient "${ing.slug}": the ${locale} humanEffects/stacksWith no longer line up with ingredients.ts`);
  }
  if ((t.howToTake.cycling === undefined) !== (ing.howToTake.cycling === undefined)) {
    throw new Error(`ingredient "${ing.slug}": the ${locale} howToTake.cycling does not match ingredients.ts`);
  }
  return {
    ...ing,
    name: t.name,
    mechanism: t.mechanism,
    clinicalDose: t.clinicalDose,
    timeToEffect: t.timeToEffect,
    studySummary: t.studySummary,
    benefits: t.benefits,
    sideEffects: t.sideEffects,
    humanEffects: ing.humanEffects.map((e, i) => ({ ...e, effect: t.humanEffects[i].effect, notes: t.humanEffects[i].notes })),
    howToTake: t.howToTake,
    stacksWith: ing.stacksWith.map((p, i) => ({ ...p, ingredient: t.stacksWith[i].ingredient, reason: t.stacksWith[i].reason })),
    faqs: t.faqs,
  };
}

/** Every ingredient, in ingredients.ts order, with its prose in `locale`. */
export function localizedIngredients(locale: IngredientLocale): Ingredient[] {
  return ingredients.map((ing) => localizeIngredient(ing, locale));
}

export const ingredientsEs: IngredientTranslation[] = [
  {
    slug: 'lions-mane',
    name: 'Melena de León (Hericium erinaceus)',
    mechanism: 'La Melena de León (Hericium erinaceus) contiene hericenonas y erinacinas que estimulan la síntesis del factor de crecimiento nervioso (NGF) en estudios celulares y en animales. El NGF favorece la supervivencia, la diferenciación y el mantenimiento de las neuronas del hipocampo y la corteza, regiones centrales para el aprendizaje y la memoria. Ningún ensayo en humanos ha medido todavía los niveles de NGF tras la suplementación.',
    clinicalDose: '1–1.8g/día en ensayos con adultos sanos; 3g/día de polvo seco en el ensayo de deterioro cognitivo leve',
    timeToEffect: 'Efectos agudos pequeños en 1–2 horas en ensayos piloto; el beneficio en el DCL se acumuló a lo largo de 8–16 semanas',
    studySummary: 'Un ensayo doble ciego y controlado con placebo de 2009 (Mori et al., n=30) encontró puntuaciones de función cognitiva más altas en adultos con deterioro cognitivo leve tras 16 semanas con 3g/día; las puntuaciones volvieron a bajar en las 4 semanas posteriores a la suspensión. Su autor principal trabaja para Hokuto Corporation, un productor de hongos. Un ECA multicéntrico de 2019 mejoró las puntuaciones del MMSE, pero no las otras dos pruebas de memoria. En adultos sanos, dos pequeños ECA piloto de 2023 encontraron mejoras agudas en las tareas Stroop, N-Back y de tiempo de reacción con 1–1.8g, y solo una tendencia no significativa hacia menos estrés tras 28 días. La evidencia proviene de muestras pequeñas y de corto plazo.',
    benefits: [
      'Puntuaciones cognitivas más altas en el deterioro cognitivo leve (un ECA de 16 semanas)',
      'Pequeñas mejoras agudas de atención y tiempo de reacción en adultos sanos (ECA piloto)',
      'Estimulación del NGF (solo en estudios celulares y en animales)',
    ],
    sideEffects: [
      'Por lo general bien tolerada; el ensayo de 16 semanas en DCL no reportó efectos adversos en las pruebas de laboratorio',
      'Poco frecuente: molestias gastrointestinales leves en dosis altas',
    ],
    humanEffects: [
      { effect: 'Memoria y aprendizaje', notes: 'Cuatro ECA pequeños (n=30–41 cuando se informa). Más claro en el deterioro cognitivo leve (Mori 2009); en adultos sanos los efectos son modestos y parciales (el ensayo de 2019 fue significativo solo en el MMSE).' },
      { effect: 'Estado de ánimo y estrés', notes: 'Docherty 2023 (n=41, 1.8g/día, 28 días) encontró solo una tendencia no significativa hacia un menor estrés subjetivo (p=0.051).' },
    ],
    howToTake: {
      dosage: '1–1.8g/día (ensayos con adultos sanos); el ensayo en DCL usó 3g/día de polvo seco, por lo que dosis más bajas podrían no reproducir su resultado',
      timing: 'Por la mañana, con el desayuno',
      withFood: 'Los compuestos liposolubles se absorben mejor con una comida que contenga algo de grasa. Tomarla en ayunas está bien, pero una comida mejora la consistencia.',
      forms: 'Cápsula o polvo. Elige siempre extracto de cuerpo fructífero (extracción con agua caliente o doble extracción), no micelio cultivado sobre grano: los productos de micelio pueden ser mayormente almidón con un mínimo de compuestos activos.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', reason: 'Stack clásico para la memoria a largo plazo. La Bacopa consolida la memoria a través de la densidad sináptica; la Melena de León favorece el NGF. Juntas cubren tanto la neurogénesis como las vías sinápticas.' },
      { ingredient: 'Citicolina', reason: 'La citicolina aporta un efecto agudo sobre la concentración, mientras que la Melena de León construye neuroprotección a largo plazo: una combinación complementaria a corto y largo plazo.' },
      { ingredient: 'Ashwagandha', reason: 'La Ashwagandha reduce el cortisol (que suprime la expresión del NGF); combinarla con Melena de León puede amplificar los efectos neurogénicos bajo estrés.' },
    ],
    faqs: [
      { question: '¿Cuerpo fructífero o micelio? ¿Cuál debería comprar?', answer: 'Elige siempre extracto de cuerpo fructífero. El micelio se cultiva sobre un sustrato de grano, y la mayoría de los productos comerciales de micelio contienen principalmente almidón, no hericenonas activas. Busca en la etiqueta "cuerpo fructífero" ("fruiting body") o "extracto doble" ("dual extract"). Las etiquetas pueden variar según el mercado: la etiqueta de Mind Lab Pro en Estados Unidos indica 500mg de Melena de León orgánica "mycelium and fruit" (micelio y fruto), mientras que sus etiquetas de la UE, el Reino Unido, Canadá y Australia indican 500mg de "fruiting body" (cuerpo fructífero) (verificado el 2026-10-08).' },
      { question: '¿Cuánto tiempo tarda en notarse?', answer: 'Dos pequeños ensayos piloto de 2023 encontraron efectos agudos modestos en tareas de atención y de tiempo de reacción 1–2 horas después de una sola dosis de 1–1.8g. El resultado más claro, en el deterioro cognitivo leve, se acumuló a lo largo de 8–16 semanas con 3g/día (Mori 2009) y desapareció en las 4 semanas posteriores a la suspensión. No juzgues este suplemento a las 2 semanas.' },
      { question: '¿Puedo tomar Melena de León todos los días?', answer: 'Así se probó, con uso diario, pero solo durante un tiempo limitado: la dosis diaria se usó hasta 16 semanas en el ensayo en DCL (Mori 2009), los demás ensayos revisados duraron 12 semanas o menos y los pilotos en adultos sanos 28 días o menos, por lo que los datos controlados de seguridad a más largo plazo son limitados. A diferencia de algunos adaptógenos, la Melena de León no se toma en ciclos en los ensayos; el ensayo de 16 semanas en DCL usó dosis diarias y las puntuaciones bajaron en las 4 semanas posteriores a la suspensión, por lo que cualquier beneficio parece depender del uso continuado.' },
      { question: '¿La Melena de León interactúa con algún medicamento?', answer: 'Ninguno de los ensayos en humanos revisados reportó interacciones con medicamentos, pero fueron pequeños y breves. Consulta siempre con tu médico si tomas medicamentos con receta.' },
      { question: '¿Qué muestra realmente la investigación en adultos sanos?', answer: 'Los estudios en adultos sanos son pequeños pilotos. Docherty 2023 (n=41, 1.8g/día) encontró un desempeño más rápido en la prueba Stroop 60 minutos después de una dosis y solo una tendencia no significativa hacia menos estrés tras 28 días; La Monica 2023 encontró tiempos de reacción más rápidos en N-Back y Go 2 horas después de 1g. Los efectos son más sutiles en personas sanas que en el deterioro cognitivo leve.' },
    ],
    sourceHashes: { name: '33244fcfb9f8', mechanism: '09e0e2e7e8b7', clinicalDose: 'cca78dfc61bc', timeToEffect: '694621c13b6f', studySummary: 'e6b377125be1', benefits: 'b951ab7efd39', sideEffects: '81bd8bbd94c9', humanEffects: '3d5b091f0869', howToTake: '0ebcd747cd27', stacksWith: 'a50c1c2b10eb', faqs: 'a66fb3f316d7' },
  },
  {
    slug: 'bacopa-monnieri',
    name: 'Bacopa Monnieri',
    mechanism: 'La Bacopa mejora la comunicación sináptica al aumentar la ramificación dendrítica y la densidad sináptica. Sus compuestos activos (bacósidos A y B) facilitan la reparación de neuronas dañadas y aumentan la actividad antioxidante, lo que reduce el estrés oxidativo en el tejido del hipocampo. También modula los sistemas de serotonina y acetilcolina.',
    clinicalDose: '300–450mg/día (estandarizado al menos al 50% de bacósidos)',
    timeToEffect: '8–12 semanas de uso constante (la mayoría de los ensayos positivos duraron 12 semanas)',
    studySummary: 'Un metaanálisis de 9 ECA (Kongkeaw et al., 2014, n=518) encontró que la Bacopa acortó los tiempos del Trail Making B y de reacción de elección frente a placebo, y dos ECA de 12 semanas en adultos mayores sanos (Calabrese 2008; Morgan y Stevens 2010) mejoraron el recuerdo diferido de palabras con 300mg/día. El ECA de 12 semanas más reciente (Lopresti 2025, n=101, 300mg/día) no encontró efecto sobre el aprendizaje verbal, la atención ni la memoria de trabajo, aunque sí redujo el estrés autoinformado. Un metaanálisis en red de 2026 con 29 ECA encontró que ≥600mg/día superó a 300–450mg/día en memoria de trabajo. La mejor evidencia es para el recuerdo diferido, no para efectos agudos.',
    benefits: [
      'Recuerdo diferido en adultos mayores sanos (ECA de 12 semanas)',
      'Reducción de la ansiedad y el estrés',
      'Actividad antioxidante (estudios de laboratorio)',
    ],
    sideEffects: [
      'Efectos gastrointestinales (mayor frecuencia de deposiciones, cólicos abdominales, náuseas) reportados con 300mg/día en un ECA de 12 semanas en adultos mayores: tómala con comida',
      'Más reacciones adversas autoinformadas que con placebo (molestias digestivas, dolores de cabeza) en un ECA de 12 semanas de 2025',
      'Procesamiento de la información más lento al principio',
      'No se recomienda durante el embarazo (por precaución: no hay datos de seguridad en humanos)',
    ],
    humanEffects: [
      { effect: 'Consolidación de la memoria', notes: 'Metaanálisis de Kongkeaw 2014 (9 ECA), dos ECA de 12 semanas sobre el recuerdo diferido y un metaanálisis en red de 2026 (memoria de trabajo, ≥600mg/día). El ECA de Lopresti de 2025 con 300mg/día no replicó el beneficio en la memoria.' },
      { effect: 'Reducción de la ansiedad', notes: 'Calabrese 2008: la ansiedad bajó con Bacopa y subió con placebo a lo largo de 12 semanas; Lopresti 2025: menor reactividad al estrés autoinformada.' },
      { effect: 'Atención', notes: 'Resultado combinado positivo en la velocidad de atención (Kongkeaw 2014), pero ningún efecto sobre la atención en el ECA reciente más grande (Lopresti 2025, p=0.713).' },
      { effect: 'Velocidad de procesamiento', notes: 'Una dosis aguda de 320mg mejoró el desempeño en una tarea sostenida (2012), pero el metaanálisis en red de 2026 no encontró diferencias en la velocidad de procesamiento. Algunos usuarios reportan una lentitud inicial temporal.' },
    ],
    howToTake: {
      dosage: '300–450mg/día (estandarizado al menos al 50% de bacósidos): la dosis clásica de los ensayos; ≥600mg/día es una opción emergente y menos establecida',
      timing: 'Con la comida más abundante del día: funciona tanto por la mañana como por la noche',
      withFood: 'Los bacósidos son liposolubles, así que el consejo habitual es tomarla con una comida que tenga algo de grasa. Tomarla con comida también ayuda con los efectos secundarios gastrointestinales reportados en los ensayos. No la tomes en ayunas.',
      forms: 'La cápsula es lo más práctico. El polvo tiene un sabor amargo y desagradable. Busca en la etiqueta un extracto estandarizado al menos al 50% de bacósidos (el ensayo positivo que citamos usó 300mg de un extracto al 50%, unos 150mg de bacósidos): los productos herbales sin estandarizar pueden contener muy poco compuesto activo.',
    },
    stacksWith: [
      { ingredient: 'Melena de León', reason: 'El stack definitivo para la memoria a largo plazo. La Bacopa mejora la densidad sináptica y la consolidación de la memoria; la Melena de León impulsa la síntesis de NGF y la neuroprotección. Ambas actúan lentamente y se complementan sin superponerse.' },
      { ingredient: 'Citicolina', reason: 'La citicolina aporta la concentración aguda y el impulso de acetilcolina que a la Bacopa le faltan a corto plazo, mientras que la Bacopa se encarga de la consolidación de la memoria a largo plazo. Una combinación equilibrada presente en Mind Lab Pro.' },
      { ingredient: 'L-Teanina', reason: 'Ambas tienen propiedades ansiolíticas. La L-teanina aporta una concentración tranquila inmediata; la Bacopa construye resiliencia al estrés a largo plazo. La combinación es suave y bien tolerada.' },
    ],
    faqs: [
      { question: '¿Por qué algunas personas se sienten "nubladas" al empezar con Bacopa?', answer: 'Una minoría de usuarios experimenta una lentitud inicial temporal del procesamiento mental, a veces llamada la "niebla de la Bacopa". Esto se relaciona con la modulación de la serotonina y suele resolverse después de 3–4 semanas. Refleja que el mecanismo de la hierba está actuando, no un problema. Si persiste más allá de 6 semanas, reduce la dosis.' },
      { question: '¿Realmente necesito tomarla con grasa?', answer: 'Es la opción sensata por defecto. Los bacósidos son compuestos liposolubles, y en los ensayos se reportaron efectos secundarios gastrointestinales (cólicos, náuseas, deposiciones más frecuentes), así que el consejo habitual es tomar la Bacopa con una comida normal que contenga algo de grasa.' },
      { question: '¿Qué porcentaje de bacósidos debo buscar?', answer: 'Apunta al menos al 50%: el ensayo positivo que citamos (Calabrese et al., 2008) usó 300mg al día de un extracto estandarizado a un mínimo del 50% de bacósidos, unos 150mg de bacósidos. Dos extractos comerciales estandarizados son Bacognize y Synapsa. La "Bacopa" genérica sin estandarización declarada no es confiable: el contenido de compuesto activo puede ser insignificante.' },
      { question: '¿Cuánto tarda en hacer efecto?', answer: 'Los ensayos positivos sobre memoria midieron los resultados después de 12 semanas. No es un suplemento para evaluar en el primer mes. Pon un recordatorio en el calendario para evaluarlo alrededor de las 12 semanas, y ten en cuenta que el ensayo de 12 semanas más reciente con 300mg/día no encontró ningún beneficio cognitivo, así que los resultados varían.' },
      { question: '¿Se puede tomar Bacopa a largo plazo?', answer: 'La mayoría de los ensayos duraron 12 semanas o menos, así que los datos controlados más allá de ese plazo son escasos. El uso ayurvédico tradicional es continuo y sin ciclos, y ningún ensayo ha demostrado que los ciclos sean necesarios, pero la seguridad a largo plazo no se ha estudiado directamente.' },
    ],
    sourceHashes: { name: 'e700f14754c2', mechanism: '1a865649ae14', clinicalDose: '1cd8db3d2cfd', timeToEffect: 'b0c9c4baf5ed', studySummary: 'f0ed741861e3', benefits: '455d30c40f53', sideEffects: 'd04e9586c3dc', humanEffects: '2d0efb4a05ec', howToTake: '2902a24dcc02', stacksWith: 'b1fcc97d6741', faqs: '9af37ca2bc90' },
  },
  {
    slug: 'citicoline',
    name: 'Citicolina (CDP-Colina)',
    mechanism: "La citicolina (citidina 5'-difosfocolina) es un precursor tanto de la acetilcolina como de la fosfatidilcolina. Aumenta la síntesis de acetilcolina en el cerebro, el neurotransmisor central para la atención, el aprendizaje y la codificación de la memoria. También favorece la integridad de la membrana neuronal al reponer fosfolípidos.",
    clinicalDose: '250–500mg/día (los ensayos de memoria en adultos mayores usaron 1000–2000mg/día)',
    timeToEffect: 'Efectos sobre la memoria medidos después de 2–3 meses; un inicio agudo en 1–2 horas no está confirmado para la citicolina sola',
    studySummary: 'Un ECA en adultos mayores sanos (Spiers et al., 1996) encontró que 1000mg/día mejoraron el recuerdo verbal diferido en personas con una memoria relativamente ineficiente, y que 2000mg/día mejoraron el recuerdo inmediato y diferido. Un metaanálisis de 2023 encontró un efecto positivo sobre el estado cognitivo en el DCL y la demencia, pero calificó la calidad de los estudios como deficiente, con un alto riesgo de sesgo. La revisión Cochrane de 2005 encontró beneficios en la memoria y el comportamiento en adultos mayores con trastornos cerebrales crónicos, pero ninguna evidencia de beneficio en la atención. En el ictus isquémico agudo, un ECA de dosis-respuesta (Clark 1997) encontró mejores resultados funcionales, con 500mg como dosis óptima.',
    benefits: [
      'Memoria verbal en adultos mayores con una memoria más débil',
      'Estado cognitivo en el DCL y la demencia (evidencia de baja calidad)',
      'Recuperación funcional tras un ictus isquémico (un ECA)',
    ],
    sideEffects: [
      'Muy bien tolerada: ningún evento adverso grave relacionado con el fármaco en el ECA de dosis-respuesta en ictus',
      'Poco frecuente: dolor de cabeza con dosis muy altas',
      'Insomnio si se toma tarde en el día',
    ],
    humanEffects: [
      { effect: 'Atención y concentración', notes: 'La revisión Cochrane no encontró evidencia de un beneficio en la atención en adultos mayores con trastornos cerebrales crónicos; el ensayo de atención aguda en adultos sanos que citamos administró citicolina junto con cafeína, así que el efecto propio de la citicolina no puede aislarse.' },
      { effect: 'Memoria de trabajo', notes: 'Beneficio en la memoria verbal en adultos mayores con memoria ineficiente (Spiers 1996) y un efecto combinado positivo en DCL/demencia (metaanálisis de 2023, estudios de baja calidad). No se ha demostrado en adultos sanos en general.' },
      { effect: 'Neuroprotección', notes: 'Respaldada en el ictus isquémico agudo por un ECA de dosis-respuesta (Clark 1997); no se encontró ningún ensayo en lesión cerebral traumática. Los efectos en adultos sanos no se han probado.' },
    ],
    howToTake: {
      dosage: '250–500mg/día; los ensayos de memoria en adultos mayores usaron 1000–2000mg/día, y 500mg fue la dosis óptima en el ensayo de ictus',
      timing: 'Por la mañana: la citicolina es levemente activadora y puede causar insomnio si se toma después de las 2 de la tarde',
      withFood: 'Se puede tomar con o sin comida. No hay una diferencia significativa en la absorción. Si sientes náuseas leves, tómala con una comida ligera.',
      forms: 'Cápsula. Existen dos formas de marca estandarizadas: Cognizin (usada en Mind Lab Pro) y la citicolina sódica. Ambas son eficaces. Evita la CDP-colina genérica sin etiquetar de fuentes desconocidas.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', reason: 'La citicolina se encarga de la atención aguda y la acetilcolina; la Bacopa cubre la consolidación de la memoria a largo plazo. La combinación aborda tanto la concentración a corto plazo como la memoria a largo plazo en un solo stack.' },
      { ingredient: 'L-Teanina', reason: 'La citicolina aporta activación cognitiva; a menudo se añade L-teanina para la calma, aunque en un ensayo controlado con cafeína (Rogers 2008) no redujo significativamente el nerviosismo, y no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Melena de León', reason: 'Plazos complementarios: la citicolina actúa de forma aguda sobre la acetilcolina; la Melena de León actúa a largo plazo sobre el NGF. Sin superposición de mecanismos: una combinación limpia.' },
    ],
    faqs: [
      { question: 'Citicolina frente a bitartrato de colina: ¿cuál es la diferencia?', answer: 'La citicolina es significativamente superior. Atraviesa la barrera hematoencefálica con más eficiencia y aporta dos componentes activos: colina (para la acetilcolina) y citidina (que se convierte en uridina, un componente básico de las membranas cerebrales). El bitartrato de colina solo aporta colina y atraviesa mal la barrera hematoencefálica.' },
      { question: '¿Debo dividir la dosis?', answer: 'Con 250mg, una sola dosis por la mañana está bien. Con 500mg, algunas personas la dividen en 250mg por la mañana y 250mg a primera hora de la tarde para una cobertura más uniforme. Evita cualquier dosis después de las 2–3 de la tarde, ya que el efecto levemente activador puede retrasar el inicio del sueño.' },
      { question: 'Me dio dolor de cabeza después de tomar citicolina, ¿es normal?', answer: 'Un dolor de cabeza por citicolina en dosis estándar (250–500mg) es inusual y puede indicar que eres sensible a los compuestos colinérgicos o que ya obtienes una cantidad importante de colina de la dieta u otros suplementos. Prueba a reducir a 250mg y no la combines con Alfa-GPC ni con otras fuentes de colina el mismo día.' },
      { question: 'Cognizin frente a CDP-colina genérica: ¿importa la marca?', answer: 'Cognizin es la forma con más validación clínica y se analiza su pureza. La CDP-colina genérica puede estar bien si proviene de proveedores confiables, pero la calidad varía más. Para trabajo cognitivo crítico, la forma de marca premium vale el pequeño aumento de costo.' },
    ],
    sourceHashes: { name: '3d4676af009b', mechanism: '09b80159eeb1', clinicalDose: '2135c280d962', timeToEffect: '95f800c9deab', studySummary: 'c4035e5ded21', benefits: '25b268bae409', sideEffects: 'a1033e3ca8ef', humanEffects: '49bd9ee9891e', howToTake: 'e5eb97cb183f', stacksWith: 'd56517fe5cb8', faqs: '8ea162bc748e' },
  },
  {
    slug: 'l-theanine',
    name: 'L-Teanina',
    mechanism: 'La L-teanina es un aminoácido no proteico presente principalmente en el té verde. Atraviesa la barrera hematoencefálica y se ha relacionado con un aumento de la actividad de las ondas cerebrales alfa. También modula los niveles de GABA, serotonina y dopamina. Combinada con cafeína, mejoró las medidas de atención frente a placebo en varios ensayos, aunque Foxe 2012 no encontró ningún beneficio adicional frente a cada compuesto por separado.',
    clinicalDose: '100–200mg/día (los ensayos que la combinaron con cafeína usaron 50–250mg de teanina con 40–250mg de cafeína)',
    timeToEffect: '30–60 minutos (efecto agudo)',
    studySummary: 'Un metaanálisis de 2026 con 31 ECA (n=1168) encontró que una sola dosis de 200mg tomada 30–60 minutos antes de las pruebas mejoró el tiempo de reacción de elección; su efecto agudo sobre el estrés fue modesto y se debió a estudios con alto riesgo de sesgo, y los efectos sobre la ansiedad fueron inconsistentes. Con cafeína, un metaanálisis de 11 estudios (Camfield 2014) encontró efectos moderados frente a placebo en el estado de alerta y en la precisión al alternar la atención; Kahathuduwa 2016 encontró efectos aditivos sin interacción, y Foxe 2012 no encontró ningún beneficio adicional frente a cada compuesto por separado. El único ensayo sobre ondas alfa (MEG) encontró mayor actividad alfa a las 2 horas, y solo en personas con mayor ansiedad rasgo.',
    benefits: [
      'Tiempo de reacción más rápido tras una sola dosis de 200mg',
      'Mejor atención con cafeína que con placebo en varios ensayos',
      'Pequeñas mejoras en la calidad subjetiva del sueño',
    ],
    sideEffects: [
      'Extremadamente bien tolerada: ningún evento adverso grave en un metaanálisis de 31 ECA',
      'Posible sedación leve en dosis altas',
      'En general se considera muy segura',
    ],
    humanEffects: [
      { effect: 'Concentración tranquila (ondas alfa)', notes: 'White 2016 (n=34) encontró mayor actividad alfa en reposo 2 horas después de la dosis (no a los 45 minutos) y solo en participantes con mayor ansiedad rasgo; no se correspondió con la calma subjetiva ni con el cortisol.' },
      { effect: 'Ansiedad y estrés', notes: 'El metaanálisis de 2026 con 31 ECA encontró efectos sobre la ansiedad inconsistentes y no significativos (salvo un ensayo clínico con 400mg/día) y un efecto agudo modesto sobre el estrés debido a estudios con alto riesgo de sesgo; White 2016 encontró menor estrés subjetivo 1 hora después de la dosis. Rogers 2008 no encontró ningún efecto ansiolítico agudo con 200mg.' },
      { effect: 'Calidad del sueño', notes: 'Un metaanálisis de 2025 (18 estudios, n=897) encontró pequeñas mejoras en la latencia subjetiva del sueño, la disfunción diurna y la calidad del sueño. Ningún ensayo la ha probado combinada con magnesio.' },
      { effect: 'Con cafeína', notes: 'Camfield 2014 (11 estudios controlados con placebo): tamaños del efecto moderados para la combinación frente a placebo en el estado de alerta y la precisión al alternar la atención, con la dosis de cafeína explicando una mayor parte del cambio. Haskell 2007 encontró una interacción cafeína × teanina (velocidad de reconocimiento diferido de palabras); Kahathuduwa 2016 encontró efectos aditivos sin interacción; Foxe 2012 no encontró ningún beneficio adicional frente a cada compuesto por separado.' },
    ],
    howToTake: {
      dosage: '100–200mg por dosis',
      timing: '30 minutos antes de tu sesión de trabajo cognitivo o 30 minutos antes de la cafeína',
      withFood: 'No hay una interacción significativa con los alimentos. Se puede tomar en ayunas. La absorción es fiable independientemente del horario de las comidas.',
      forms: 'Cápsula o polvo. Suntheanine es una L-teanina de marca (obtenida por síntesis enzimática, idéntica a la teanina del té). La L-teanina en polvo a granel se disuelve en agua, pero tiene un sabor sutilmente dulce y es fácil de mezclar.',
    },
    stacksWith: [
      { ingredient: 'Cafeína', reason: 'Los ensayos que citamos usaron 50–250mg de teanina con 40–250mg de cafeína. Frente a placebo, la combinación mejoró las medidas de atención en varios ensayos, aunque Foxe 2012 no encontró ningún beneficio adicional frente a cada compuesto por separado; en un ensayo controlado (Rogers 2008) la teanina no redujo significativamente el nerviosismo causado por la cafeína.' },
      { ingredient: 'Bacopa Monnieri', reason: 'Ambas tienen propiedades ansiolíticas que actúan por mecanismos distintos. La L-teanina aporta calma inmediata; la Bacopa construye una tolerancia sostenida al estrés a lo largo de semanas. Una combinación suave y no sedante para reducir la ansiedad.' },
      { ingredient: 'Ashwagandha', reason: 'Ambas actúan sobre el estrés por vías distintas (modulación del GABA en la teanina; eje HPA en la ashwagandha). Un buen stack diurno para la ansiedad sin sedación.' },
    ],
    faqs: [
      { question: '¿Cuál es la proporción ideal de L-teanina y cafeína?', answer: 'Ningún ensayo ha establecido una proporción ideal. Los ensayos positivos de la combinación usaron 97–250mg de teanina con 40–160mg de cafeína: por ejemplo, 100mg de teanina con 50mg de cafeína (Owen 2008), 250mg con 150mg (Haskell 2007) y 200mg con 160mg (Kahathuduwa 2016). Un metaanálisis encontró que la dosis de cafeína influyó más en el efecto que la dosis de teanina.' },
      { question: '¿La L-teanina funciona sin cafeína?', answer: 'En parte. Por sí sola, una dosis única de 200mg mejoró el tiempo de reacción de elección en un metaanálisis de 2026 con 31 ECA, pero los efectos sobre la ansiedad fueron inconsistentes y el único ensayo sobre ondas alfa encontró un efecto solo en personas con mayor ansiedad rasgo. Por sí sola no es estimulante.' },
      { question: '¿Es seguro tomar L-teanina todos los días?', answer: 'Sí. El té verde contiene teanina y se ha consumido a diario durante milenios sin problemas de toxicidad. No se desarrolla tolerancia. El uso diario crónico es seguro y eficaz. No se requieren ciclos.' },
      { question: '¿Por qué tomar un suplemento si puedo simplemente beber té verde?', answer: 'Una taza estándar de té verde contiene ~25–50mg de L-teanina, muy por debajo de la dosis terapéutica de 100–200mg. Necesitarías 4–8 tazas de té verde para igualar una sola dosis del suplemento, junto con una carga considerable de cafeína. Los suplementos permiten una dosificación precisa sin cafeína no deseada.' },
      { question: '¿La L-teanina puede ayudar a dormir si se toma de noche?', answer: 'De forma modesta. Un metaanálisis de 2025 (18 estudios, n=897) encontró pequeñas mejoras en la latencia subjetiva de inicio del sueño, la disfunción diurna y la calidad general del sueño. No causa sedación. Las combinaciones con magnesio son populares, pero no se han probado en un ensayo.' },
    ],
    sourceHashes: { name: '8667600691ae', mechanism: 'ee0740531bc6', clinicalDose: 'c51d39b0a020', timeToEffect: '32098c8af1b0', studySummary: '43531aff65ab', benefits: '5bfcb95e81e3', sideEffects: 'f90524834c14', humanEffects: 'ac70b456615b', howToTake: 'd28b5d7ed155', stacksWith: 'd197465a4193', faqs: '37c9546e7ac8' },
  },
  {
    slug: 'rhodiola-rosea',
    name: 'Rhodiola Rosea',
    mechanism: 'La Rhodiola es un adaptógeno que modula el eje HPA (hipotálamo-hipófiso-suprarrenal), reduciendo la producción de cortisol bajo estrés. Sus principales compuestos bioactivos (rosavinas y salidrosida) inhiben las enzimas monoaminooxidasa, lo que aumenta la disponibilidad de dopamina, serotonina y norepinefrina, neurotransmisores implicados en la motivación, el estado de ánimo y la resistencia cognitiva.',
    clinicalDose: '200–600mg/día (un extracto estandarizado; los ensayos que citamos usaron SHR-5)',
    timeToEffect: 'Efectos con una sola dosis en un ECA; los ensayos con dosis repetidas duraron 2–4 semanas',
    studySummary: 'Pequeños ensayos con el extracto SHR-5 encontraron menos fatiga mental: un ECA de 2003 en 161 cadetes militares tras una sola dosis, un ensayo cruzado de 2000 en 56 médicos de guardia nocturna a lo largo de dos semanas (Darbinyan et al.) y un piloto de 2000 en estudiantes durante los exámenes. El ECA sueco sobre burnout (Olsson et al., 2008, n=60, 576mg/día) duró 28 días, no 12 semanas, y mejoró las puntuaciones de burnout y de atención frente a placebo, mientras que las puntuaciones de depresión mejoraron por igual en ambos grupos. Una revisión sistemática de 2012 de 11 ensayos calificó todos los estudios incluidos con riesgo de sesgo alto o poco claro y describió la evidencia como contradictoria.',
    benefits: [
      'Reducción de la fatiga mental (ensayos pequeños y de baja calidad)',
      'Puntuaciones de burnout y de atención en la fatiga relacionada con el estrés (un ECA de 28 días)',
    ],
    sideEffects: [
      'En general segura; no se reportaron efectos secundarios en el ensayo con médicos de guardia nocturna',
      'Leve activación o inquietud al principio',
      'Inhibidores de la MAO y antidepresivos: interacción teórica basada en la inhibición de la MAO en laboratorio, sin reportes clínicos encontrados; consulta a tu médico antes de combinarlos',
      'Evita las dosis a última hora de la noche',
    ],
    humanEffects: [
      { effect: 'Reducción de la fatiga mental', notes: 'Ensayos positivos con una sola dosis (cadetes), de dos semanas (médicos de guardia nocturna) y de 20 días (estudiantes), pero la revisión sistemática de 2012 encontró que solo 3 de 5 ensayos sobre fatiga mental fueron positivos, todos con riesgo de sesgo alto o poco claro.' },
      { effect: 'Resiliencia al estrés', notes: 'Olsson 2008 encontró una respuesta del cortisol al despertar diferente frente a placebo a lo largo de 28 días; los ensayos de base son pequeños y metodológicamente limitados.' },
      { effect: 'Resistencia física', notes: 'Solo 2 de 6 ensayos sobre fatiga física de la revisión sistemática de 2012 reportaron un beneficio; un piloto de 20 días en estudiantes mejoró la condición física.' },
      { effect: 'Estado de ánimo', notes: 'En el ECA sueco sobre burnout (Olsson 2008), las puntuaciones de depresión mejoraron tanto en el grupo de Rhodiola como en el de placebo: los autores lo atribuyeron a un efecto placebo, sin diferencias significativas entre grupos.' },
    ],
    howToTake: {
      dosage: '200–600mg/día (un extracto estandarizado; los ensayos que citamos usaron SHR-5). Varios ensayos positivos usaron dosis de 200mg/día o menos, que la revisión sistemática señaló como posiblemente subóptimas; los datos de dosis-respuesta son escasos',
      timing: 'Por la mañana, en ayunas: 30 minutos antes del desayuno. La Rhodiola es levemente estimulante; las dosis por la noche suelen causar insomnio.',
      withFood: 'Tómala en ayunas para una mejor absorción. El margen de 30 minutos antes de comer es constante en la mayoría de los protocolos clínicos. Una pequeña cantidad de comida está bien, pero una comida completa reduce la absorción.',
      cycling: 'Opcional. Los ensayos duraron desde una sola dosis hasta 4 semanas, así que no hay datos sobre meses de uso continuo; algunas personas hacen ciclos de 4–6 semanas de uso y 1–2 semanas de descanso como precaución.',
      forms: 'Cápsula. Busca en la etiqueta una estandarización declarada de rosavinas y salidrosida. Los ensayos de nuestro registro que nombran un extracto usaron SHR-5, y sus resúmenes no indican sus porcentajes de rosavinas ni de salidrosida.',
    },
    stacksWith: [
      { ingredient: 'Ashwagandha', reason: 'El stack clásico de adaptógenos. La Rhodiola es activadora (eleva la norepinefrina, mejor por la mañana); la Ashwagandha es calmante (reduce el cortisol, mejor por la noche). Juntas brindan apoyo al eje HPA durante todo el día sin que una anule a la otra.' },
      { ingredient: 'L-Teanina', reason: 'El efecto activador de la Rhodiola combina bien con el efecto calmante de la L-teanina. Usa la Rhodiola para la resistencia cognitiva y la L-teanina para suavizar la agitación o inquietud que la Rhodiola puede causar al principio.' },
      { ingredient: 'L-Tirosina', reason: 'Ambas apuntan al rendimiento bajo estrés por mecanismos distintos. La Rhodiola modula los niveles de cortisol y monoaminas; la tirosina repone el sustrato de las catecolaminas. Una combinación sólida para días de alta exigencia cognitiva o turnos nocturnos.' },
    ],
    faqs: [
      { question: '¿Hay que tomar la Rhodiola en ciclos?', answer: 'No según la evidencia actual. Los ensayos clínicos duraron desde una sola dosis hasta 4 semanas, así que no probaron ni los ciclos ni meses de uso continuo. Algunas personas hacen una pausa de 1–2 semanas cada 4–6 semanas como precaución ante un posible "efecto techo".' },
      { question: '¿Qué significan las rosavinas y la salidrosida en la etiqueta de la Rhodiola?', answer: 'Las rosavinas y la salidrosida son los principales compuestos bioactivos de la Rhodiola. La Rhodiola rosea contiene de forma natural rosavinas y salidrosidas en una proporción de aproximadamente 3:1, y los preparados se elaboran para reflejarla (Ishaque 2012). Los ensayos que citamos usaron el extracto SHR-5, y sus resúmenes no indican porcentajes de marcadores.' },
      { question: '¿La Rhodiola puede causar ansiedad o nerviosismo?', answer: 'En una minoría de personas, sobre todo con dosis superiores a 400mg, la Rhodiola puede causar una inquietud parecida a la de un estimulante o ansiedad leve, en particular durante la primera semana. Empieza con 200mg y aumenta de forma gradual. Algunas personas la combinan con L-teanina para suavizarlo, aunque esa combinación no se ha probado en un ensayo.' },
      { question: '¿Es seguro tomar Rhodiola con antidepresivos?', answer: 'No sin supervisión médica. Los compuestos de la Rhodiola inhiben la monoaminooxidasa en estudios de laboratorio, así que una interacción con ISRS, IMAO y otros antidepresivos (incluido el síndrome serotoninérgico) es teóricamente posible; no se encontraron reportes clínicos en nuestra revisión de PubMed de 2026. Consulta siempre a tu médico si tomas algún medicamento psiquiátrico.' },
    ],
    sourceHashes: { name: '8ef9c8a44212', mechanism: '7897a2f64ab2', clinicalDose: 'fb8dea0030b2', timeToEffect: '5ab4648e058c', studySummary: '286609ca7e58', benefits: '37918f8c0b1b', sideEffects: 'f1409ae470d6', humanEffects: '72e1fc4286c4', howToTake: '7a02ee1487ac', stacksWith: '9b0b3d94ca13', faqs: '205144fcbd1f' },
  },
  {
    slug: 'phosphatidylserine',
    name: 'Fosfatidilserina',
    mechanism: 'La fosfatidilserina (PS) es un fosfolípido que constituye un componente fundamental de las membranas de las neuronas. Favorece la transducción de señales a través de las sinapsis, facilita la liberación de acetilcolina y dopamina y modula la secreción de cortisol. La suplementación repone los niveles de PS, que disminuyen de forma natural con la edad.',
    clinicalDose: '100–300mg/día (beneficio demostrado principalmente en adultos mayores con quejas de memoria o DCL)',
    timeToEffect: 'Los ensayos sobre memoria duraron de 15 semanas a 12 meses; ningún ensayo estableció un inicio más temprano',
    studySummary: 'Los ECA en adultos mayores con quejas de memoria o deterioro cognitivo leve reportan beneficios en la memoria, aunque a menudo solo en subgrupos: la PS de soya con 100–300mg/día durante 6 meses ayudó solo a los participantes con puntuaciones iniciales bajas (Kato-Kataoka 2010), y la PS-DHA de origen marino con 300mg/día mejoró el recuerdo verbal inmediato en un ensayo exploratorio de 15 semanas (Vakhapova 2010). Un metaanálisis en red de 2026 en DCL/Alzheimer encontró que 100mg de PS mejoraron el MMSE, pero no la subescala cognitiva de la Escala de Evaluación de la Enfermedad de Alzheimer (ADAS-Cog). En niños sanos, un ECA de 12 semanas con 100mg de PS de girasol no encontró efecto en los resultados primarios ni secundarios (Friling 2025; entre los autores hay personal de IFF, el fabricante del producto). Un ensayo positivo de 2024 en DCL (Duan 2024; con coautores de BYHEALTH) administró solo 31.5mg de PS dentro de una fórmula con varios ingredientes. La FDA solo permite declaraciones calificadas de que puede reducir el riesgo de demencia o de disfunción cognitiva en personas mayores, con la advertencia "FDA concludes that there is little scientific evidence supporting this claim", es decir, que la FDA concluye que hay poca evidencia científica que respalde esta declaración (carta de la FDA, 13 de mayo de 2003).',
    benefits: [
      'Recuerdo de memoria en adultos mayores con quejas de memoria (a menudo solo en subgrupos)',
      'Puntuaciones del MMSE en DCL/Alzheimer (metaanálisis en red)',
      'Reducción del cortisol bajo estrés (no se volvió a verificar en nuestra revisión de 2026)',
    ],
    sideEffects: [
      'Bien tolerada: ninguna diferencia de seguridad frente a placebo a lo largo de 15 semanas con 300mg/día',
      'Molestias gastrointestinales leves en algunos usuarios',
      'Extensión abierta con 100mg/día: pequeño descenso de la presión arterial diastólica en reposo y ligero aumento de peso',
    ],
    humanEffects: [
      { effect: 'Recuerdo de memoria', notes: 'Constante en adultos mayores o con deterioro cognitivo, pero a menudo limitado a subgrupos (con desempeño inicial bajo o alto). Un ECA de 12 semanas en niños sanos con 100mg/día no encontró efecto (Friling 2025).' },
      { effect: 'Reducción del cortisol', notes: 'Se ha reportado una atenuación de la respuesta del cortisol al ejercicio y al estrés psicológico; no se volvió a verificar en nuestra revisión de 2026, y ningún ensayo estableció un plazo de inicio.' },
      { effect: 'Velocidad de procesamiento', notes: 'Se han reportado mejoras en el tiempo de reacción, sobre todo en adultos mayores; no se volvió a verificar en nuestra revisión de 2026.' },
      { effect: 'Deterioro cognitivo asociado a la edad', notes: 'Un metaanálisis en red de 2026 (29 ECA, DCL/Alzheimer) encontró que 100mg de PS mejoraron el MMSE, pero no el ADAS-Cog. La FDA solo permite declaraciones calificadas de que puede reducir el riesgo de demencia o de disfunción cognitiva en personas mayores, con la advertencia "FDA concludes that there is little scientific evidence supporting this claim", es decir, que la FDA concluye que hay poca evidencia científica que respalde esta declaración.' },
    ],
    howToTake: {
      dosage: '100–300mg/día: el beneficio es más constante en adultos mayores y en el DCL, y en análisis de subgrupos; un ensayo con 100mg/día en niños sanos fue nulo',
      timing: 'Con las comidas: divide la dosis entre 2–3 comidas para obtener mejores resultados (por ejemplo, 100mg con el desayuno y 100mg con el almuerzo)',
      withFood: 'La PS es un fosfolípido liposoluble y se absorbe mejor con grasa de la dieta. Tómala siempre con comida. Dividir la dosis entre las comidas es mejor que una sola dosis grande.',
      forms: 'Cápsula (preferiblemente blanda). Hay tres tipos de fuente: (1) derivada de soya: la más común y barata, eficaz pero contiene soya; (2) derivada de girasol: sin soya, la opción preferida; (3) derivada de cerebro bovino: usada en los ensayos originales de la década de 1990, ya no se comercializa por la preocupación por la EEB. Sharp-PS de girasol es la forma de referencia.',
    },
    stacksWith: [
      { ingredient: 'Melena de León', reason: 'La PS mantiene la integridad de la membrana celular, mientras que la Melena de León impulsa la síntesis de NGF. Ambas favorecen la salud cerebral a largo plazo a través de vías complementarias: estructurales y de factores de crecimiento.' },
      { ingredient: 'Citicolina', reason: 'Ambas son precursoras de fosfolípidos de membrana, pero actúan por vías distintas. La citicolina forma principalmente fosfatidilcolina; la PS se ocupa de la fosfatidilserina. Juntas brindan un apoyo integral a la membrana neuronal.' },
      { ingredient: 'Omega-3 (DHA)', reason: 'El DHA es un componente estructural de las membranas neuronales. Algunos productos clínicos de PS están conjugados con DHA (PS-DHA): un ensayo de 15 semanas con PS-DHA de origen marino con 300mg/día mejoró el recuerdo verbal inmediato en adultos mayores con quejas de memoria.' },
    ],
    faqs: [
      { question: 'PS de soya frente a PS de girasol: ¿cuál es mejor?', answer: 'Ambas se usan en ensayos: la PS de soya en adultos mayores con quejas de memoria (Kato-Kataoka 2010) y la PS de girasol en niños sanos, en quienes no tuvo efecto (Friling 2025). La PS derivada de girasol no contiene soya y es la opción preferida para cualquier persona con sensibilidad a la soya. Nuestra revisión de 2026 no incluyó ninguna comparación directa entre ambas.' },
      { question: '¿Cuál es la declaración de salud de la FDA para la PS?', answer: 'La FDA solo permite declaraciones calificadas de que la fosfatidilserina puede reducir el riesgo de demencia o de disfunción cognitiva en personas mayores, con la advertencia "FDA concludes that there is little scientific evidence supporting this claim", es decir, que la FDA concluye que hay poca evidencia científica que respalde esta declaración (carta de la FDA, 13 de mayo de 2003). La propia redacción de la declaración dice que "very limited and preliminary scientific research suggests" esto, es decir, que investigaciones científicas muy limitadas y preliminares lo sugieren.' },
      { question: '¿Y la fuente de cerebro bovino que aparece en estudios más antiguos?', answer: 'Los ensayos originales con PS de la década de 1990 usaron PS derivada de corteza cerebral bovina. Esta fuente se abandonó en todo el mundo tras la preocupación por la EEB (enfermedad de las vacas locas). Toda la PS comercial actual es de origen vegetal o marino. Los ensayos posteriores con PS vegetal y marina muestran beneficios en la memoria principalmente en subgrupos de adultos mayores, así que no debe suponerse que los resultados bovinos más antiguos sean trasladables.' },
      { question: '¿La PS interactúa con los anticoagulantes?', answer: 'Nuestra revisión de PubMed de 2026 no encontró ninguna interacción clínica entre la PS y los anticoagulantes, y el principal ensayo de seguridad de la PS no recopiló datos sobre sangrado. Si tomas warfarina, aspirina u otros anticoagulantes, consulta a tu médico antes de añadir cualquier suplemento.' },
    ],
    sourceHashes: { name: '84b783e1a205', mechanism: 'f50169765ad5', clinicalDose: 'b3586df4aeec', timeToEffect: 'fd2897116995', studySummary: 'd96d809304b8', benefits: 'be8718ee4d5a', sideEffects: '74e3d86af15b', humanEffects: 'faaad79b9c26', howToTake: 'ef36cb389a09', stacksWith: 'f533b7871ea2', faqs: '2b7e89608457' },
  },
  {
    slug: 'alpha-gpc',
    name: 'Alfa-GPC',
    mechanism: 'La Alfa-GPC (alfa-glicerilfosforilcolina) es el precursor de colina más biodisponible. Lleva la colina directamente a través de la barrera hematoencefálica, donde se usa para sintetizar acetilcolina. También favorece la síntesis de fosfolípidos de la membrana celular. A menudo se promociona para la liberación de la hormona del crecimiento, pero un ECA de 2024 con 630mg no encontró diferencias en la hormona del crecimiento frente a placebo.',
    clinicalDose: '300–600mg/día (el ensayo positivo en Alzheimer usó 1200mg/día)',
    timeToEffect: 'Efectos agudos a los 60 minutos en un ECA; el ensayo en Alzheimer midió el beneficio a los 90 y 180 días',
    studySummary: 'Un ECA multicéntrico en demencia de Alzheimer leve a moderada (De Jesus Moreno, 2003, n=261) encontró que 1200mg/día mejoraron el ADAS-Cog, el MMSE y las puntuaciones globales frente a placebo a los 90 y 180 días, y un metaanálisis de 2023 respalda un beneficio en el deterioro cognitivo cerebrovascular. En hombres sanos, una sola dosis de 315–630mg mejoró el desempeño en la prueba Stroop, pero no en N-Back ni en Flanker (Kerksick 2024). Los ensayos deportivos son inconsistentes: un aumento de la fuerza del tren inferior tras 6 días con 600mg (Bellar 2015), ningún efecto sobre la fuerza con 250–500mg durante 7 días y ningún efecto sobre la potencia tras una sola dosis de 630mg.',
    benefits: [
      'Cognición en el Alzheimer y la demencia cerebrovascular (1200mg/día)',
      'Desempeño agudo en la prueba Stroop (función ejecutiva) en hombres sanos',
      'Eleva la colina plasmática',
    ],
    sideEffects: [
      'Bien tolerada',
      'Dolor de cabeza si se combina con otros colinérgicos',
      '500mg/día suprimieron significativamente la TSH sérica (hormona estimulante de la tiroides) en un ensayo de 7 días',
    ],
    humanEffects: [
      { effect: 'Síntesis de acetilcolina', notes: 'La colina plasmática subió más rápido y más que con citicolina en un estudio de 1992, pero ese estudio usó inyección intramuscular, así que el inicio por vía oral no se midió directamente. Un ECA de 2024 encontró efectos cognitivos 60 minutos después de una dosis oral.' },
      { effect: 'Memoria y cognición', notes: 'Evidencia sólida solo en pacientes con Alzheimer con 1200mg/día. En hombres sanos con 630mg, mejoró la prueba Stroop, pero no N-Back (memoria de trabajo) ni Flanker.' },
      { effect: 'Potencia deportiva', notes: 'Aumento de la fuerza del tren inferior tras 6 días con 600mg; ningún efecto sobre la fuerza con 250–500mg durante 7 días (solo un efecto en la velocidad de salto con 250mg); ningún efecto sobre la potencia tras una sola dosis de 630mg antes del ejercicio.' },
      { effect: 'Neuroprotección', notes: 'Beneficio cognitivo y funcional en poblaciones con Alzheimer y demencia cerebrovascular; no se ha probado en el envejecimiento cerebral sano.' },
    ],
    howToTake: {
      dosage: '300–600mg/día: coincide con los ensayos en adultos sanos y deportivos; la evidencia más sólida (en Alzheimer) usó 1200mg/día',
      timing: 'Por la mañana o 30–60 minutos antes de una tarea cognitiva exigente o de entrenar',
      withFood: 'Se puede tomar con o sin comida. Se absorbe un poco mejor con una comida ligera. No la tomes tarde en el día: la activación de la acetilcolina puede interferir con el sueño.',
      forms: 'Cápsula (lo común) o polvo. La Alfa-GPC es higroscópica (absorbe la humedad del aire): el polvo puede volverse pegajoso; la cápsula es más práctica. Existen formas con concentración del 50% y del 85%; la forma al 50% (más común) duplica el tamaño de la porción, pero es equivalente en dosis activa.',
    },
    stacksWith: [
      { ingredient: 'Melena de León', reason: 'La Alfa-GPC aporta apoyo inmediato a la acetilcolina; la Melena de León impulsa la síntesis de NGF a largo plazo. Sus mecanismos no se superponen: una combinación limpia de efecto agudo + largo plazo.' },
      { ingredient: 'Bacopa Monnieri', reason: 'La Alfa-GPC se encarga de la codificación aguda de la memoria a través de la acetilcolina; la Bacopa, de la consolidación y el almacenamiento de la memoria. Juntas cubren tanto la etapa de codificación como la de consolidación en la formación de la memoria.' },
      { ingredient: 'Huperzina A', reason: 'La Huperzina A evita la degradación de la acetilcolina, mientras que la Alfa-GPC aumenta su síntesis. Una combinación potente en teoría, pero úsala con precaución y en dosis bajas, ya que la sobrecarga colinérgica (náuseas, dolor de cabeza, calambres musculares) es un riesgo real. No se recomienda sin experiencia.' },
    ],
    faqs: [
      { question: 'Alfa-GPC frente a citicolina: ¿cuál es mejor para la concentración?', answer: 'Ambas son excelentes. La Alfa-GPC tiene una ligera ventaja en los efectos colinérgicos agudos y se prefiere para el rendimiento en el entrenamiento. La citicolina también aporta citidina (precursora de la uridina), lo que le da un perfil neuroprotector más amplio. Para la concentración pura y la acetilcolina, la Alfa-GPC gana ligeramente; para un apoyo integral a la salud cerebral, la citicolina es más completa. No las combines: tendrías demasiada actividad de colina.' },
      { question: '¿Es seguro combinar Alfa-GPC con Huperzina A?', answer: 'Con precaución. Ambas aumentan la acetilcolina (la Alfa-GPC por síntesis y la Huperzina A al inhibir su degradación). La combinación es potente y puede causar sobreestimulación colinérgica, con síntomas como náuseas, dolor de cabeza, salivación excesiva y calambres musculares. Si las combinas, usa dosis más bajas de cada una (por ejemplo, 200mg de Alfa-GPC + 50mcg de Huperzina A) y no las tomes a diario.' },
      { question: '¿Por qué el polvo de Alfa-GPC se vuelve pegajoso?', answer: 'La Alfa-GPC es muy higroscópica: absorbe rápidamente el agua del aire. Es normal y no afecta su potencia. Guárdala en un recipiente hermético en un lugar fresco y seco. La forma en cápsula evita este problema por completo.' },
      { question: '¿Existe un riesgo cardiovascular con la Alfa-GPC?', answer: 'No está resuelto. El estudio de cohorte CARDIA (publicado en 2024) relacionó una colina plasmática más alta (no los suplementos de alfa-GPC) con la aparición de enfermedad cardiovascular, mientras que un metaanálisis sobre la ingesta de colina en la dieta no encontró ninguna asociación. Ningún estudio ha probado directamente la suplementación con alfa-GPC en resultados cardiovasculares. Si tienes una enfermedad cardiovascular, coméntalo con tu médico.' },
    ],
    sourceHashes: { name: 'eb14648f61e2', mechanism: '9ce0e233dea3', clinicalDose: 'a66a252fe340', timeToEffect: '0caa7d003f51', studySummary: '8081ab7f5d34', benefits: '5e3227a7cadd', sideEffects: '3a095bf3481e', humanEffects: '4d9d08735d9e', howToTake: '91b6527617b8', stacksWith: '897dac3bcbf3', faqs: '80578914290e' },
  },
  {
    slug: 'ashwagandha',
    name: 'Ashwagandha (KSM-66)',
    mechanism: 'La Ashwagandha (Withania somnifera) es un adaptógeno ayurvédico. Sus witanólidos modulan el eje HPA para reducir el cortisol y, además, inhiben la acetilcolinesterasa (preservando la acetilcolina) y favorecen la actividad de los receptores GABA para lograr efectos ansiolíticos. KSM-66 es un extracto de raíz de espectro completo.',
    clinicalDose: '300–600mg/día (extracto KSM-66)',
    timeToEffect: 'Efectos sobre el estrés y el cortisol medidos a los 60 días; efectos sobre la memoria a las 8 semanas (ensayo en DCL)',
    studySummary: 'Un ECA de 2012 en adultos con estrés crónico (Chandrasekhar et al., KSM-66 600mg/día, 60 días; extracto suministrado por su fabricante, Ixoreal Biomed) encontró que el cortisol sérico bajó un 27.9% frente a un 7.9% con placebo y que el estrés percibido bajó un 44%. Un metaanálisis de 2024 con 9 ECA confirmó reducciones significativas del estrés percibido, la ansiedad y el cortisol, aunque un ensayo cruzado de 2019 con un extracto en dosis baja en hombres mayores con sobrepeso no encontró efecto sobre el cortisol. Un ECA de 2017 (Choudhary et al., 300mg dos veces al día, 8 semanas) mejoró la memoria y la función ejecutiva, en adultos con deterioro cognitivo leve, no en adultos sanos. Existen reportes de casos de lesión hepática, y Dinamarca prohibió los suplementos de ashwagandha en 2023.',
    benefits: [
      'Reducción del cortisol',
      'Menor estrés percibido y ansiedad',
      'Memoria en el deterioro cognitivo leve (un ECA de 8 semanas)',
      'Calidad del sueño',
      'Fuerza y recuperación muscular',
    ],
    sideEffects: [
      'Por lo general bien tolerada en ensayos de 8–12 semanas',
      'Malestar gastrointestinal en algunos usuarios',
      'Lesión hepática: reportes y series de casos publicados, incluidos casos calificados como "probables" en la escala de causalidad RUCAM que se resolvieron al suspenderla; suspéndela y consulta a un médico si notas ictericia u orina oscura',
      'Dinamarca prohibió los complementos alimenticios de ashwagandha en 2023 porque no se pudo establecer una dosis segura',
      'Contraindicada en afecciones de la tiroides',
      'Evítala durante el embarazo',
    ],
    humanEffects: [
      { effect: 'Reducción del cortisol', notes: 'Descenso del cortisol sérico del 27.9% frente al 7.9% con 600mg/día (Chandrasekhar 2012) y un efecto combinado significativo en un metaanálisis de 9 ECA; un ensayo cruzado en dosis baja en hombres mayores con sobrepeso no encontró cambios en el cortisol, así que el efecto depende de la dosis y de la población.' },
      { effect: 'Ansiedad y estrés', notes: 'El estrés percibido bajó un 44% frente a un 5.5% (Chandrasekhar 2012); el metaanálisis de 2024 con 9 ECA encontró reducciones significativas en las escalas de Estrés Percibido y de Ansiedad de Hamilton.' },
      { effect: 'Calidad del sueño', notes: 'Un ECA de 90 días (Gopukumar 2021) reportó mejores puntuaciones de calidad del sueño (PSQI); el sueño suele ser un criterio de valoración secundario.' },
      { effect: 'Memoria (en el deterioro cognitivo leve)', notes: 'Choudhary 2017 (n=50, 8 semanas) incluyó a adultos con deterioro cognitivo leve; sus mejoras en la memoria y la función ejecutiva no deben interpretarse como un resultado en adultos sanos.' },
    ],
    howToTake: {
      dosage: '300–600mg/día (KSM-66)',
      timing: 'Por la noche (1–2 horas antes de dormir) para los beneficios en el sueño. Por la mañana para el manejo del cortisol y el estrés. La dosis dividida (300mg por la mañana + 300mg por la noche) es el régimen de los ensayos Chandrasekhar 2012 y Choudhary 2017 (300mg dos veces al día).',
      withFood: 'Tómala con comida para minimizar el malestar gastrointestinal (sobre todo con dosis de 600mg). La comida no afecta significativamente la absorción.',
      forms: 'Cápsula. Exige KSM-66 (extracto de raíz de espectro completo, 5% de witanólidos) o Sensoril (hoja + raíz, 8% de witanólidos, se necesita una dosis menor). Evita la ashwagandha sin estandarizar que no declare un porcentaje de witanólidos: el contenido activo puede ser insignificante.',
    },
    stacksWith: [
      { ingredient: 'Rhodiola Rosea', reason: 'El dúo canónico de adaptógenos. La Rhodiola es activadora (por la mañana); la Ashwagandha es calmante (por la noche). Ambas apuntan a la desregulación del eje HPA, pero por mecanismos distintos y en momentos distintos del día: una pareja perfecta de día y de noche.' },
      { ingredient: 'L-Teanina', reason: 'Ambas reducen la ansiedad por mecanismos distintos (modulación del eje HPA frente a modulación del GABA). La L-teanina aporta calma inmediata; la Ashwagandha, una reducción sistémica del estrés a más largo plazo. Juntas actúan en varias escalas de tiempo.' },
      { ingredient: 'Fosfatidilserina', reason: 'Ambas reducen el cortisol de forma independiente por vías distintas (modulación del eje HPA frente a sensibilidad de los receptores de cortisol). La combinación puede aportar una reducción aditiva del cortisol en condiciones de mucho estrés.' },
    ],
    faqs: [
      { question: 'KSM-66, Sensoril o ashwagandha genérica: ¿cuál debería elegir?', answer: 'KSM-66 (5% de witanólidos, solo de raíz) es el extracto usado en los principales ensayos sobre estrés y cognición. Sensoril (8% de witanólidos, de raíz + hoja, se necesita una dosis menor de 125–250mg) tiene buena evidencia específicamente para el estrés y el sueño. La ashwagandha genérica sin un porcentaje de witanólidos declarado no es confiable: podrías estar pagando por polvo de raíz rico en almidón con un contenido activo mínimo. Elige KSM-66 o Sensoril.' },
      { question: '¿La ashwagandha me dará sueño durante el día?', answer: 'No: con dosis matutinas, la mayoría de las personas experimenta una concentración tranquila, no sedación. El efecto de cansancio es más pronunciado cuando se toma por la noche, cuando reduce la latencia del sueño. La ashwagandha no agota la energía; reduce la hiperactivación impulsada por el cortisol que causa fatiga. A algunas personas 600mg por la mañana les resultan ligeramente sedantes; en ese caso, reduce a 300mg o pásala solo a la noche.' },
      { question: '¿Es segura la ashwagandha para el uso a largo plazo?', answer: 'Faltan datos a largo plazo: la mayoría de los ensayos duran 8–12 semanas, y no se encontraron datos controlados de seguridad más allá de unos 90 días. Reportes de casos publicados relacionan la ashwagandha con lesiones hepáticas (algunos calificados como "probables" en la escala de causalidad RUCAM), y Dinamarca prohibió los complementos alimenticios de ashwagandha en 2023 porque no se pudo establecer una dosis segura. Suspéndela y consulta a un médico si presentas ictericia u orina oscura. Evítala si tienes afecciones de la tiroides (enfermedad tiroidea autoinmune), ya que los witanólidos pueden modular los niveles de hormonas tiroideas.' },
      { question: '¿La ashwagandha puede aumentar la testosterona?', answer: 'Dos ECA encontraron aumentos: 600mg/día durante 8 semanas en hombres jóvenes que empezaban un entrenamiento de fuerza elevaron la testosterona junto con mayores ganancias de fuerza (2015), y un ensayo cruzado en hombres con sobrepeso de 40–70 años encontró testosterona +14.7% y DHEA-S +18% frente a placebo, pero ningún cambio en el cortisol, la fatiga ni el vigor (Lopresti 2019). La magnitud varía según la población y el extracto.' },
    ],
    sourceHashes: { name: 'f48263c2c9f9', mechanism: 'cc1bdea1cc19', clinicalDose: '77d574d99676', timeToEffect: '34f7d36bdeeb', studySummary: 'e23483b812a2', benefits: 'd468ea7029e0', sideEffects: '6815c74cfa8a', humanEffects: 'ec057d3d5767', howToTake: '287f02107136', stacksWith: 'f4827923f898', faqs: 'cb52adb8e0c6' },
  },
  {
    slug: 'huperzine-a',
    name: 'Huperzina A',
    mechanism: 'La Huperzina A se extrae de Huperzia serrata (licopodio chino). Es un inhibidor potente y reversible de la acetilcolinesterasa: bloquea la enzima que degrada la acetilcolina, lo que en la práctica aumenta los niveles de acetilcolina en todo el cerebro. Esto la convierte en uno de los compuestos colinérgicos naturales más potentes.',
    clinicalDose: '100–200mcg/día en los ensayos (microgramos, no miligramos; las dosis de consumo de 50mcg no se probaron por separado)',
    timeToEffect: 'Los ensayos midieron los efectos tras 4–16 semanas de dosis diarias; no se encontró ningún ensayo de inicio agudo',
    studySummary: 'ECA chinos muestran que la Huperzina A mejoró la memoria y el aprendizaje en pacientes con Alzheimer (Xu et al., 1995: mejoró el 58% frente al 36% con 200mcg/día durante 8 semanas) y en estudiantes adolescentes (Sun et al., 1999: 100mcg/día durante 4 semanas). Un metaanálisis de 2013 con 20 ECA encontró beneficios significativos en la enfermedad de Alzheimer, pero calificó la mayoría de los ensayos con alto riesgo de sesgo; la revisión Cochrane de 2008 concluyó que la evidencia es insuficiente para recomendarla, y una revisión Cochrane de 2012 no encontró ensayos elegibles en el deterioro cognitivo leve. Un ECA de 2019 tras una lesión cerebral traumática no encontró ningún beneficio en la memoria frente a placebo.',
    benefits: [
      'Preservación de la acetilcolina (mecanismo establecido)',
      'Cognición y funcionamiento diario en la enfermedad de Alzheimer (ensayos de baja calidad)',
      'Memoria y aprendizaje en un ECA con estudiantes',
    ],
    sideEffects: [
      'Los eventos adversos en los ensayos en Alzheimer fueron leves y sin diferencias significativas frente a placebo (revisión Cochrane de 2008)',
      'Riesgo de sobredosis con otros colinérgicos',
      'Molestias gastrointestinales en dosis altas',
      'No es adecuada para personas que toman fármacos inhibidores de la colinesterasa',
    ],
    humanEffects: [
      { effect: 'Recuerdo de memoria', notes: 'Efecto combinado positivo en pacientes con Alzheimer (metaanálisis de 20 ECA) y en un ECA con estudiantes, pero ambos metaanálisis señalan un alto riesgo de sesgo, no hay ensayos elegibles en DCL y un ensayo de 2019 en lesión cerebral traumática no encontró ningún beneficio frente a placebo.' },
      { effect: 'Preservación de la acetilcolina', notes: 'La inhibición reversible de la acetilcolinesterasa es un mecanismo farmacológicamente establecido, descrito de forma constante en las revisiones.' },
      { effect: 'Velocidad de aprendizaje', notes: 'Un pequeño ECA de pares emparejados en 68 estudiantes adolescentes (Sun 1999, 100mcg/día durante 4 semanas) encontró cocientes de memoria y calificaciones escolares más altos.' },
      { effect: 'Reducción de los síntomas del Alzheimer', notes: 'Dirección positiva constante (Xu 1995 y dos metaanálisis), pero los autores de Cochrane consideraron los ensayos demasiado pequeños y de baja calidad para una recomendación firme.' },
    ],
    howToTake: {
      dosage: '100–200mcg/día (microgramos: las dosis son pequeñas); las dosis de consumo de 50mcg no se probaron por separado en los ensayos',
      timing: 'Por la mañana. Evítala por la noche: la activación colinérgica interfiere con el sueño.',
      withFood: 'Se puede tomar con o sin comida. No hay una diferencia significativa en la absorción. En dosis más altas (150–200mcg), tomarla con comida reduce la sensibilidad gastrointestinal.',
      cycling: 'No validados. Ningún ensayo en humanos ha probado un esquema de ciclos: los ensayos usaron dosis diarias continuas durante 4–16 semanas. Algunos usuarios hacen pausas regulares como precaución frente a los efectos secundarios colinérgicos.',
      forms: 'Solo en cápsula: las dosis son de microgramos, lo que hace prácticamente imposible medir el polvo con precisión sin una balanza con precisión de miligramos. Confirma siempre que la etiqueta indique mcg (microgramos) y no mg (miligramos): un error de 100 veces en la dosis es peligroso.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', reason: 'La Bacopa actúa a través de la densidad sináptica (mecanismo no colinérgico); la Huperzina A, preservando la acetilcolina. Sin superposición de mecanismos. Un stack potente para la memoria en el que ambas partes actúan de forma independiente.' },
      { ingredient: 'Melena de León', reason: 'La Melena de León favorece la neurogénesis a largo plazo a través del NGF; la Huperzina A favorece la acetilcolina al frenar su degradación. Mecanismos distintos sin conflicto.' },
    ],
    faqs: [
      { question: '¿Hay que tomar la Huperzina A en ciclos?', answer: 'No hay evidencia de ensayos en ningún sentido. Los ensayos clínicos la administraron a diario durante 4–16 semanas, y la revisión Cochrane de 2008 encontró que los eventos adversos fueron leves y no más frecuentes que con placebo. Ningún ensayo en humanos ha probado un esquema de ciclos. Lo que hay que vigilar son los efectos secundarios colinérgicos (náuseas, sudoración, salivación excesiva, espasmos musculares); suspéndela o reduce la dosis si aparecen.' },
      { question: '¿100mcg es lo mismo que 100mg? La etiqueta resulta confusa.', answer: 'No: mcg (microgramos) y mg (miligramos) se diferencian en un factor de 1000. La Huperzina A se dosifica en microgramos (mcg). Una dosis de 200mcg equivale a 0.2mg. Esto es correcto e intencional: la Huperzina A es extremadamente potente. Si un producto indica una dosis en miligramos (por ejemplo, "100mg"), lee la etiqueta con atención: probablemente se refiere a 100mcg (0.1mg). Una dosis real de 100mg de Huperzina A sería una sobredosis catastrófica.' },
      { question: '¿Puedo tomar Huperzina A con Alfa-GPC?', answer: 'Técnicamente sí, pero con mucha precaución. La Alfa-GPC aumenta la síntesis de acetilcolina; la Huperzina A evita su degradación. La combinación puede causar con facilidad una sobrecarga colinérgica, y ningún ensayo la ha probado. Si las combinas, usa dosis bajas de cada una y empieza con una sola antes de combinarlas. Vigila con atención los primeros síntomas de sobrecarga: náuseas, dolor de cabeza, salivación excesiva.' },
      { question: '¿Es segura la Huperzina A para adultos jóvenes y sanos?', answer: 'La investigación sobre la Huperzina A se basa sobre todo en pacientes con Alzheimer; el único ECA en población sana que se encontró fue un estudio de 4 semanas en 68 estudiantes adolescentes con 100mcg/día. Los principales riesgos en usuarios sanos son los errores de dosificación (confundir mcg y mg) y combinarla con otros colinérgicos. La seguridad a largo plazo en adultos sanos no se ha estudiado.' },
    ],
    sourceHashes: { name: '4fee00338022', mechanism: 'b529b95c62de', clinicalDose: '8550009654e6', timeToEffect: 'fb827af64156', studySummary: '45bc30928f8b', benefits: 'de06381675b0', sideEffects: '8f474fed142a', humanEffects: '5d49be382fee', howToTake: '11831e7ef48d', stacksWith: '7418e9c2a945', faqs: 'a81b0052f14e' },
  },
  {
    slug: 'l-tyrosine',
    name: 'L-Tirosina (NALT)',
    mechanism: 'La L-tirosina es un aminoácido precursor de la dopamina, la norepinefrina y la epinefrina. En condiciones de estrés, privación de sueño o carga cognitiva, el cerebro agota sus reservas de catecolaminas. Suplementar tirosina repone el sustrato para la síntesis de neurotransmisores y mantiene el rendimiento cognitivo cuando de otro modo disminuiría.',
    clinicalDose: '100–150mg/kg en los principales ensayos sobre estrés (unos 7–10g para un adulto de 70kg); los productos de consumo dan dosis fijas de 500–2000mg',
    timeToEffect: 'Alrededor de 1 hora antes de una tarea cognitiva exigente',
    studySummary: 'Ensayos militares y de estrés encontraron que la tirosina redujo la caída del rendimiento durante una noche sin dormir (Neri et al., 1995, 150mg/kg), bajo estrés por ruido (Deijen y Orlebeke, 1994, 100mg/kg) y durante un curso de entrenamiento de combate (Deijen et al., 1999, 2g/día), pero ninguno de los dos ensayos de Deijen encontró efecto alguno sobre el estado de ánimo. Otros ensayos fueron nulos o negativos: la tirosina no protegió la cognición ni el rendimiento bajo estrés térmico durante el ejercicio (Coull 2016, 150mg/kg), y 2g empeoraron la flexibilidad cognitiva bajo una carga cognitiva alta (Robson 2019). Una revisión narrativa de 2015 (Jongkees et al.) concluyó que los beneficios dependen de un estrés de corta duración que agota la dopamina y la norepinefrina.',
    benefits: [
      'Rendimiento cognitivo bajo algunos factores de estrés agudo (falta de sueño, ruido, entrenamiento de combate)',
      'Concentración en condiciones exigentes',
    ],
    sideEffects: [
      'En general segura',
      'Puede empeorar la flexibilidad cognitiva bajo una carga cognitiva alta (un ECA con 2g)',
      'Inhibidores de la MAO: interacción teórica (la tirosina es precursora de catecolaminas), sin reportes clínicos encontrados; consulta a tu médico antes de combinarlos',
      'Posibles efectos hipertiroideos en dosis muy altas',
      'Puede interactuar con medicamentos para la tiroides',
    ],
    humanEffects: [
      { effect: 'Rendimiento cognitivo bajo estrés', notes: 'Beneficios bajo falta de sueño, ruido y estrés de entrenamiento de combate (Neri 1995; Deijen 1994/1999), pero ningún beneficio bajo estrés térmico durante el ejercicio (Coull 2016) y peor flexibilidad cognitiva bajo carga alta (Robson 2019). El efecto depende del tipo de factor de estrés.' },
      { effect: 'Estado de ánimo bajo estrés', notes: 'Ni Deijen 1994 ni Deijen 1999 reportaron efecto alguno sobre el estado de ánimo, pese a encontrar beneficios cognitivos en los mismos ensayos.' },
    ],
    howToTake: {
      dosage: '500–2000mg de L-tirosina (dosis fija). Varios ensayos clásicos sobre estrés usaron dosis según el peso de 100–150mg/kg (7–10g para un adulto de 70kg), así que las dosis de consumo no equivalen a las que resultaron eficaces en esos ensayos',
      timing: '30–60 minutos antes de la tarea exigente, el examen, el entrenamiento o el evento estresante. A diferencia de la mayoría de los nootrópicos, en la tirosina el momento de la toma respecto a la exigencia importa significativamente.',
      withFood: 'Se absorbe mejor en ayunas o con un refrigerio bajo en proteínas. Las comidas ricas en proteínas compiten por los transportadores de aminoácidos y reducen significativamente la captación de tirosina en el cerebro. Evita tomarla con un batido de proteínas o una comida con mucha carne.',
      forms: 'Cápsula o polvo. La L-tirosina (la forma de aminoácido libre) ofrece la mejor relación calidad-precio y es la forma usada en los ensayos sobre estrés. La NALT (N-acetil-L-tirosina) es común en los stacks formulados, pero no se encontró ningún ensayo que comparara la NALT con la L-tirosina simple en cognición.',
    },
    stacksWith: [
      { ingredient: 'L-Teanina', reason: 'La L-tirosina aporta el sustrato de dopamina y norepinefrina para la concentración y el impulso; la L-teanina te mantiene en calma y previene el pico de cortisol por el estrés o la cafeína. Juntas producen un estado de alto rendimiento, concentrado y tranquilo, en condiciones exigentes.' },
      { ingredient: 'Rhodiola Rosea', reason: 'La Rhodiola modula la disponibilidad de monoaminas y el eje HPA; la tirosina repone el sustrato de esas monoaminas. Ambas funcionan mejor en condiciones de estrés: apuntan al mismo problema (el deterioro cognitivo bajo estrés) por mecanismos complementarios.' },
      { ingredient: 'Cafeína', reason: 'A menudo se combina con cafeína; no citamos ningún ensayo de L-tirosina con cafeína.' },
    ],
    faqs: [
      { question: '¿La L-tirosina funciona si no estoy estresado ni privado de sueño?', answer: 'Probablemente no de forma significativa. Este es el matiz clave de la tirosina. La evidencia muestra que previene el deterioro cognitivo bajo estrés: restablece las catecolaminas agotadas. En un estado basal de descanso y sin estrés, los niveles de catecolaminas ya son suficientes, así que añadir el precursor no produce un efecto notable. Piénsala como un seguro para los días exigentes, no como un potenciador cognitivo diario.' },
      { question: 'L-tirosina frente a NALT: ¿qué forma debo comprar?', answer: 'L-tirosina simple. Los ensayos sobre estrés con resultados positivos usaron L-tirosina simple (con 2g/día o con dosis según el peso de 100–150mg/kg), tomada alrededor de una hora antes de la exigencia. La NALT se usa con frecuencia en stacks formulados (es más fácil de encapsular), pero no se encontró ningún ensayo que la comparara con la L-tirosina simple en cognición.' },
      { question: '¿Interactúa con los medicamentos para la tiroides?', answer: 'Sí: la L-tirosina es precursora de las hormonas tiroideas (T3 y T4). En dosis estándar, esto no es clínicamente significativo para la mayoría de las personas. Sin embargo, si tienes hipertiroidismo o tomas levotiroxina u otros medicamentos para la tiroides, la tirosina suplementaria podría, en teoría, afectar los niveles hormonales. Consulta a tu médico antes de usarla si tienes cualquier afección de la tiroides.' },
      { question: '¿La L-tirosina puede ayudar con el TDAH?', answer: 'No está establecido. La tirosina es precursora de la dopamina, pero nuestra revisión de la evidencia de 2026 no evaluó ensayos en TDAH, y una revisión de 2015 consideró mínimo su potencial para tratar trastornos clínicos. La L-tirosina no sustituye el tratamiento del TDAH: habla con tu médico antes de combinarla con cualquier medicamento.' },
    ],
    sourceHashes: { name: 'b6b49148c5ac', mechanism: '082853377a1d', clinicalDose: '6d0a3df772cd', timeToEffect: '405de68dd725', studySummary: '4297e1f0df7a', benefits: '97fe49942c76', sideEffects: '02adfee90f52', humanEffects: '0e7b00103360', howToTake: '1bbc33b31283', stacksWith: '721735f910c9', faqs: 'f6c0886b2e57' },
  },
  {
    slug: 'caffeine',
    name: 'Cafeína',
    mechanism: 'La cafeína es un antagonista de los receptores de adenosina. Al bloquear la adenosina (el neurotransmisor responsable de la somnolencia), la cafeína aumenta la señalización de dopamina, norepinefrina y acetilcolina, lo que produce vigilia, mejor estado de ánimo y mayor concentración. También aumenta los niveles de AMP cíclico, que amplifican los efectos posteriores de las catecolaminas.',
    clinicalDose: '100–200mg para la mejora cognitiva',
    timeToEffect: '15–45 minutos (efecto agudo)',
    studySummary: 'Una revisión de 2016 (McLellan, Caldwell y Lieberman; una revisión narrativa, no un metaanálisis) encontró que las dosis bajas a moderadas (~40–300mg) mejoran de forma constante el estado de alerta, la vigilancia, la atención y el tiempo de reacción, con efectos menos constantes sobre la memoria y la función ejecutiva. Una revisión Cochrane de 2010 en trabajadores por turnos y un metaanálisis de 2026 de 7 ECA militares con falta de sueño confirmaron mejoras en la atención, la vigilancia y el desempeño en tareas complejas. Los efectos secundarios aumentan con la dosis, y la Autoridad Europea de Seguridad Alimentaria (EFSA, 2015) establece como seguros para adultos sanos 200mg por dosis única y 400mg/día, y 200mg/día para mujeres embarazadas.',
    benefits: [
      'Mayor estado de alerta',
      'Tiempo de reacción más rápido',
      'Atención sostenida durante la falta de sueño',
      'Mejor rendimiento físico por encima de ~200mg',
    ],
    sideEffects: [
      'Embarazo: la EFSA aconseja limitar la ingesta habitual a 200mg/día de todas las fuentes',
      'Trastorno de pánico: en un metaanálisis, el 53.9% de las personas con trastorno de pánico tuvo un ataque de pánico tras una dosis alta de cafeína (~400–750mg), frente al 1.7% de los controles sanos; evítala o mantén dosis bajas',
      'El dolor de cabeza, las molestias abdominales, la frecuencia cardíaca acelerada, el insomnio y la ansiedad aumentan con la dosis, sobre todo por encima de ~6mg/kg (~420mg para un adulto de 70kg)',
      'Insomnio: 400mg tomados incluso 6 horas antes de acostarse redujeron el tiempo total de sueño',
      'Desarrollo de tolerancia',
      'Dolores de cabeza por abstinencia',
    ],
    humanEffects: [
      { effect: 'Estado de alerta y vigilia', notes: 'El efecto más sólido de la cafeína: constante tras dosis bajas a moderadas (McLellan 2016); vigilancia y desempeño de respuesta con una DME de 0.73 durante la falta de sueño (metaanálisis militar de 2026).' },
      { effect: 'Tiempo de reacción', notes: 'Mejor orientación y atención en la revisión Cochrane de trabajadores por turnos y mejoras constantes del tiempo de respuesta durante la falta de sueño; uno de los efectos más resistentes a la tolerancia.' },
      { effect: 'Atención sostenida', notes: 'Especialmente eficaz durante la privación de sueño o en sesiones de trabajo prolongadas (desempeño cognitivo complejo con una DME de 0.54 en el metaanálisis militar de 2026).' },
      { effect: 'Consolidación de la memoria', notes: 'La cafeína tomada después del estudio mejoró la consolidación de la memoria a las 24 horas (no la recuperación), con una respuesta dosis-efecto en U invertida (Borota 2014). Efecto modesto en comparación con los beneficios en la atención.' },
    ],
    howToTake: {
      dosage: '100–200mg para efectos cognitivos; no superes los 400mg/día (EFSA: hasta 200mg por dosis única; 200mg/día en el embarazo)',
      timing: 'Por la mañana o a primera hora de la tarde. Evítala en las 8 horas previas a acostarte: una dosis de 400mg alteró el sueño incluso tomada 6 horas antes de dormir.',
      withFood: 'Se puede tomar con o sin comida. La comida ralentiza ligeramente la absorción, lo que reduce la intensidad máxima pero prolonga la duración.',
      cycling: 'Opcional: algunas personas descansan una semana cada 8–12 semanas para reducir la tolerancia; esto no se ha probado en ensayos.',
      forms: 'Café, té, matcha, cápsulas o polvo anhidro. Las cápsulas permiten la dosificación más precisa. El matcha ofrece una curva más suave porque también contiene L-teanina.',
    },
    stacksWith: [
      { ingredient: 'L-Teanina', reason: 'Los ensayos que citamos usaron 50–250mg de teanina con 40–250mg de cafeína. Frente a placebo, la combinación mejoró las medidas de atención en varios ensayos, aunque Foxe 2012 no encontró ningún beneficio adicional frente a cada compuesto por separado; en un ensayo controlado, la teanina no redujo significativamente el nerviosismo. Se encuentra de forma natural en el matcha.' },
      { ingredient: 'L-Tirosina', reason: 'A veces se combina con cafeína; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Rhodiola Rosea', reason: 'La Rhodiola aporta resiliencia al estrés y la cafeína aporta estimulación: se complementan en condiciones de alta exigencia sin sobreestimulación.' },
    ],
    faqs: [
      { question: '¿Cuánta cafeína es demasiada?', answer: 'La EFSA (2015) concluyó que las dosis únicas de hasta 200mg y la ingesta diaria de hasta 400mg no plantean problemas de seguridad para adultos sanos, y que las mujeres embarazadas deben mantenerse en 200mg/día o menos. Las personas con trastorno de pánico tienen muchas más probabilidades de sufrir un ataque de pánico tras dosis altas. Por encima de estos niveles, la ansiedad, las palpitaciones y las alteraciones del sueño se vuelven comunes. Para la mejora cognitiva, 100-200mg es el punto óptimo: las dosis más altas aportan beneficios decrecientes para la cognición y aumentan los efectos secundarios.' },
      { question: '¿La tolerancia a la cafeína reduce sus beneficios cognitivos?', answer: 'En parte. La tolerancia se desarrolla rápidamente para el estado de alerta subjetivo (la sensación de "me siento despierto"), pero más lentamente para los beneficios cognitivos objetivos, como el tiempo de reacción y la vigilancia. Incluso los consumidores habituales muestran tiempos de reacción más rápidos tras la cafeína frente a placebo. Sin embargo, hacer pausas periódicas (1-2 semanas) puede restablecer parcialmente la tolerancia.' },
      { question: '¿La cafeína del café es distinta de la cafeína de los suplementos?', answer: 'Químicamente, la cafeína es cafeína sin importar su fuente. Sin embargo, el café contiene ácidos clorogénicos y otros polifenoles que pueden modular la cinética de absorción y aportar efectos neuroprotectores independientes. La cafeína de los suplementos (anhidra) actúa más rápido y con más fuerza. Ninguna es objetivamente mejor: depende de si quieres una dosificación precisa (cápsula) o una curva más suave (café o té).' },
      { question: '¿Puedo tomar cafeína con stacks nootrópicos que contienen estimulantes?', answer: 'Ten cuidado. Muchos stacks nootrópicos (por ejemplo, Hunter Focus) ya contienen 100mg de cafeína. Añadir café o pastillas de cafeína encima puede llevarte a superar los 400mg/día. Revisa siempre el contenido de cafeína en la etiqueta antes de combinar. Si un producto contiene cafeína, reduce en consecuencia tu consumo de cafeína de otras fuentes.' },
    ],
    sourceHashes: { name: '015b48a9827e', mechanism: '9a9a74e9e02e', clinicalDose: '6cf77863b183', timeToEffect: '3dadd12af507', studySummary: '31e1e284f0d9', benefits: '2f4684a5dc65', sideEffects: '5d285d9063e6', humanEffects: '5dc9f6dd6a6c', howToTake: '75e1cd3cd00d', stacksWith: 'b7cbd67f5112', faqs: '957edbe79871' },
  },
  {
    slug: 'ginkgo-biloba',
    name: 'Ginkgo Biloba',
    mechanism: 'El extracto de Ginkgo Biloba (estandarizado al 24% de glucósidos flavonoides de ginkgo y al 6% de lactonas terpénicas) actúa principalmente mejorando el flujo sanguíneo cerebral mediante vasodilatación e inhibición del factor activador de plaquetas (PAF). Las lactonas terpénicas (ginkgólidos A, B, C y bilobálido) reducen la viscosidad de la sangre y mejoran la microcirculación en los capilares cerebrales. Además, el ginkgo tiene propiedades antioxidantes que protegen las membranas neuronales de la peroxidación lipídica.',
    clinicalDose: '240mg/día del extracto estandarizado EGb 761 en los ensayos positivos (120mg/día parece una dosis insuficiente)',
    timeToEffect: 'Los ensayos positivos en demencia duraron 22–26 semanas; la revisión Cochrane evaluó los resultados a los 6 meses',
    studySummary: 'El ensayo GEM, financiado por los NIH (DeKosky 2008, n=3069, 240mg/día, mediana de 6.1 años), no encontró ninguna reducción de la incidencia de demencia ni de Alzheimer en personas de 75 años o más. Para el deterioro cognitivo y la demencia ya existentes, un metaanálisis de 9 ECA (Tan et al., 2015, 22–26 semanas, principalmente 240mg/día de EGb 761) encontró beneficios en la cognición y en las actividades de la vida diaria, concentrados en pacientes con síntomas neuropsiquiátricos. La revisión Cochrane de 2026 con 82 ECA encontró beneficios pequeños a moderados en la demencia (evidencia de certeza baja), pero poco o ningún efecto en el deterioro cognitivo leve. Una revisión de 2013 calificó la evidencia en demencia como de baja calidad y señaló que la mayoría de los ensayos estaban patrocinados por la industria farmacéutica. El ginkgo aumenta el riesgo de sangrado con la warfarina.',
    benefits: [
      'Cognición y actividades de la vida diaria en la demencia (evidencia de certeza baja)',
      'Mejor flujo sanguíneo cerebral (no se volvió a verificar en nuestra revisión de 2026)',
      'Actividad antioxidante',
    ],
    sideEffects: [
      'Dolor de cabeza',
      'Molestias gastrointestinales',
      'Mayor riesgo de sangrado con anticoagulantes: en una gran cohorte de la Administración de Veteranos, el ginkgo junto con warfarina aumentó el riesgo de sangrado (HR 1.38), y una revisión sistemática relaciona el ginkgo con hemorragias graves, incluida la hemorragia intracraneal; evítalo con anticoagulantes',
      'Poco frecuente: reacciones alérgicas en la piel',
    ],
    humanEffects: [
      { effect: 'Flujo sanguíneo cerebral', notes: 'Efecto vasodilatador reportado en estudios de flujo sanguíneo; no se volvió a verificar en nuestra revisión de 2026.' },
      { effect: 'Memoria (en el deterioro cognitivo)', notes: 'Beneficios en la demencia (Tan 2015; revisión Cochrane de 2026, certeza baja), pero la revisión Cochrane encontró poco o ningún efecto en el deterioro cognitivo leve. Una revisión de 2013 encontró el efecto solo en ensayos con una edad media inferior a 75 años.' },
      { effect: 'Memoria (en adultos sanos)', notes: 'Resultados mixtos. Algunos ensayos muestran mejoras en la memoria de trabajo; otros no muestran efecto. No se volvió a verificar en nuestra revisión de 2026.' },
      { effect: 'Prevención de la demencia', notes: 'El ensayo GEM (n=3069) no encontró ningún efecto preventivo sobre la aparición de demencia en personas de 75 años o más a lo largo de una mediana de 6.1 años.' },
    ],
    howToTake: {
      dosage: '240mg/día de extracto estandarizado (24/6): la dosis usada en los ensayos positivos; las dosis más bajas (120mg/día) parecen insuficientes',
      timing: 'Divídela en 2 dosis (mañana y tarde) para mantener los efectos sobre el flujo sanguíneo.',
      withFood: 'Tómalo con las comidas para reducir las molestias gastrointestinales. La comida no afecta significativamente la absorción.',
      forms: 'Usa siempre extracto estandarizado (24% de glucósidos flavonoides, 6% de lactonas terpénicas). EGb 761 es un extracto de grado farmacéutico; es el extracto usado en los ensayos agrupados por el metaanálisis que citamos (Tan 2015). Evita la hoja cruda o los productos sin estandarizar.',
    },
    stacksWith: [
      { ingredient: 'Fosfatidilserina', reason: 'El ginkgo mejora el aporte sanguíneo, mientras que la PS favorece la función de la membrana: vías complementarias para el apoyo cognitivo asociado a la edad.' },
      { ingredient: 'Melena de León', reason: 'El ginkgo aporta un apoyo agudo al flujo sanguíneo; la Melena de León construye neuroprotección a largo plazo a través del NGF. Aborda la salud cerebral tanto inmediata como estructural.' },
      { ingredient: 'Bacopa Monnieri', reason: 'Ambos tienen beneficios a largo plazo en la memoria por mecanismos distintos: el ginkgo a través del flujo sanguíneo y la Bacopa a través de la densidad sináptica. Se combinan para un apoyo integral de la memoria en adultos mayores.' },
    ],
    faqs: [
      { question: '¿El Ginkgo Biloba funciona realmente en adultos jóvenes y sanos?', answer: 'La evidencia es mixta. Los beneficios más claros se dan en personas con demencia, y la revisión Cochrane de 2026 encontró poco o ningún efecto incluso en el deterioro cognitivo leve. En adultos jóvenes y sanos, los efectos sobre la memoria y la atención son inconsistentes entre ensayos. Si tienes menos de 40 años y estás cognitivamente sano, la L-teanina + cafeína tiene evidencia aguda más sólida.' },
      { question: '¿Qué es EGb 761 y por qué importa?', answer: 'EGb 761 es un extracto específico de Ginkgo biloba de grado farmacéutico fabricado por Dr. Willmar Schwabe Pharmaceuticals. Está estandarizado al 24% de glucósidos flavonoides de ginkgo y al 6% de lactonas terpénicas, con el ácido ginkgólico tóxico eliminado por debajo de 5ppm. Es el extracto usado en los ensayos agrupados por el metaanálisis que citamos (Tan 2015). Los productos de ginkgo genéricos pueden no igualar su potencia ni su pureza.' },
      { question: '¿Puedo tomar Ginkgo con anticoagulantes?', answer: 'Evítalo salvo que tu médico esté de acuerdo. En una gran cohorte de la Administración de Veteranos, tomar ginkgo con warfarina aumentó el riesgo de sangrado en un 38% (HR 1.38), y una revisión sistemática de las interacciones de la warfarina relaciona el ginkgo con eventos hemorrágicos graves, incluida la hemorragia intracraneal. La interacción está documentada clínicamente y es potencialmente grave.' },
      { question: '¿Cuánto tiempo pasa hasta ver resultados?', answer: 'Los ensayos positivos en demencia duraron 22–26 semanas con 240mg/día, y la revisión Cochrane evaluó los resultados a los 6 meses. No juzgues la eficacia a las 1–2 semanas.' },
    ],
    sourceHashes: { name: '7ca33b4078c1', mechanism: '52b072149d87', clinicalDose: 'd3f287672e4f', timeToEffect: 'b63c90143962', studySummary: '4094661772fc', benefits: '2f1a760d44e0', sideEffects: '397bb6bb347b', humanEffects: 'b2c75e5b2b8c', howToTake: 'c74be2fd321e', stacksWith: 'db6c568fef27', faqs: '767cb40c84cd' },
  },
];

const TRANSLATIONS: Record<IngredientLocale, IngredientTranslation[]> = { es: ingredientsEs };
