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
    mechanism: 'Los extractos de Melena de León (Hericium erinaceus) elevaron el factor de crecimiento nervioso (NGF) en estudios celulares y en animales, pero qué compuestos lo hacen es objeto de debate: en un estudio celular, las hericenonas C, D y E no promovieron la expresión del gen del NGF (Mori 2008, PubMed 18758067), mientras que la erinacina A, un compuesto del micelio, atravesó la barrera hematoencefálica en ratas (Tsai 2021, PubMed 34361662). El NGF favorece la supervivencia, la diferenciación y el mantenimiento de las neuronas del hipocampo y la corteza, regiones centrales para el aprendizaje y la memoria. Ningún ensayo en humanos ha medido todavía los niveles de NGF tras la suplementación.',
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
      { ingredient: 'Bacopa Monnieri', reason: 'Ambos se estudian para la memoria y la función cognitiva; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Citicolina', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Ashwagandha', reason: 'La Ashwagandha se estudia para el estrés y el cortisol, y la Melena de León para la memoria y el aprendizaje; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿Cuerpo fructífero o micelio? ¿Cuál debería comprar?', answer: 'Elige siempre extracto de cuerpo fructífero. El micelio se cultiva sobre un sustrato de grano, y la mayoría de los productos comerciales de micelio contienen principalmente almidón, no hericenonas activas. Busca en la etiqueta "cuerpo fructífero" ("fruiting body") o "extracto doble" ("dual extract"). Las etiquetas pueden variar según el mercado: la etiqueta de Mind Lab Pro en Estados Unidos indica 500mg de Melena de León orgánica "mycelium and fruit" (micelio y fruto), mientras que sus etiquetas de la UE, el Reino Unido, Canadá y Australia indican 500mg de "fruiting body" (cuerpo fructífero) (verificado el 2026-10-08).' },
      { question: '¿Cuánto tiempo tarda en notarse?', answer: 'Dos pequeños ensayos piloto de 2023 encontraron efectos agudos modestos en tareas de atención y de tiempo de reacción 1–2 horas después de una sola dosis de 1–1.8g. El resultado más claro, en el deterioro cognitivo leve, se acumuló a lo largo de 8–16 semanas con 3g/día (Mori 2009) y desapareció en las 4 semanas posteriores a la suspensión. No juzgues este suplemento a las 2 semanas.' },
      { question: '¿Puedo tomar Melena de León todos los días?', answer: 'Así se probó, con uso diario, pero solo durante un tiempo limitado: la dosis diaria se usó hasta 16 semanas en el ensayo en DCL (Mori 2009), los demás ensayos revisados duraron 12 semanas o menos y los pilotos en adultos sanos 28 días o menos, por lo que los datos controlados de seguridad a más largo plazo son limitados. A diferencia de algunos adaptógenos, la Melena de León no se toma en ciclos en los ensayos; el ensayo de 16 semanas en DCL usó dosis diarias y las puntuaciones bajaron en las 4 semanas posteriores a la suspensión, por lo que cualquier beneficio parece depender del uso continuado.' },
      { question: '¿La Melena de León interactúa con algún medicamento?', answer: 'Ninguno de los ensayos en humanos revisados reportó interacciones con medicamentos, pero fueron pequeños y breves. Consulta siempre con tu médico si tomas medicamentos con receta.' },
      { question: '¿Qué muestra realmente la investigación en adultos sanos?', answer: 'Los estudios en adultos sanos son pequeños pilotos. Docherty 2023 (n=41, 1.8g/día) encontró un desempeño más rápido en la prueba Stroop 60 minutos después de una dosis y solo una tendencia no significativa hacia menos estrés tras 28 días; La Monica 2023 encontró tiempos de reacción más rápidos en N-Back y Go 2 horas después de 1g. Los efectos son más sutiles en personas sanas que en el deterioro cognitivo leve.' },
    ],
    sourceHashes: { name: '33244fcfb9f8', mechanism: '1d7d834e8a7b', clinicalDose: 'cca78dfc61bc', timeToEffect: '694621c13b6f', studySummary: 'e6b377125be1', benefits: 'b951ab7efd39', sideEffects: '81bd8bbd94c9', humanEffects: '3d5b091f0869', howToTake: '0ebcd747cd27', stacksWith: '2f2e45b40ec6', faqs: 'a66fb3f316d7' },
  },
  {
    slug: 'bacopa-monnieri',
    name: 'Bacopa Monnieri',
    mechanism: 'Los mecanismos propuestos, como los efectos antioxidantes y los efectos sobre los sistemas de acetilcolina y serotonina, provienen de estudios en animales y de laboratorio (revisión de Aguiar & Borowski 2013, PubMed 23772955). En un ensayo de 12 semanas en humanos, los cambios en el BDNF, el malondialdehído y la actividad de la acetilcolinesterasa en sangre no difirieron de los del placebo (Lopresti 2025, PubMed 41091332).',
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
      { effect: 'Consolidación de la memoria', notes: 'Revisión sistemática de Pase 2012: la Bacopa mejoró 9 de 17 pruebas de recuerdo libre de memoria en seis ensayos de 12 semanas; dos ECA de 12 semanas sobre el recuerdo diferido; un metaanálisis en red de 2026 (memoria de trabajo, ≥600mg/día). El ECA de Lopresti de 2025 con 300mg/día no replicó el beneficio en la memoria, y Kongkeaw 2014 agrupó resultados de velocidad de atención, no de memoria.' },
      { effect: 'Reducción de la ansiedad', notes: 'Calabrese 2008: la ansiedad bajó con Bacopa y subió con placebo a lo largo de 12 semanas; Lopresti 2025: menor reactividad al estrés autoinformada.' },
      { effect: 'Atención', notes: 'Resultado combinado positivo en la velocidad de atención (Kongkeaw 2014), pero ningún efecto sobre la atención en el ECA reciente más grande (Lopresti 2025, p=0.713).' },
      { effect: 'Velocidad de procesamiento', notes: 'Una dosis aguda de 320mg mejoró el desempeño en una tarea sostenida (2012), pero el metaanálisis en red de 2026 no encontró diferencias en la velocidad de procesamiento.' },
    ],
    howToTake: {
      dosage: '300–450mg/día (estandarizado al menos al 50% de bacósidos): la dosis clásica de los ensayos; ≥600mg/día es una opción emergente y menos establecida',
      timing: 'Con la comida más abundante del día: funciona tanto por la mañana como por la noche',
      withFood: 'Los bacósidos son liposolubles, así que el consejo habitual es tomarla con una comida que tenga algo de grasa. Tomarla con comida también ayuda con los efectos secundarios gastrointestinales reportados en los ensayos. No la tomes en ayunas.',
      forms: 'La cápsula es lo más práctico. El polvo tiene un sabor amargo y desagradable. Busca en la etiqueta un extracto estandarizado al menos al 50% de bacósidos (el ensayo positivo que citamos usó 300mg de un extracto al 50%, unos 150mg de bacósidos): los productos herbales sin estandarizar pueden contener muy poco compuesto activo.',
    },
    stacksWith: [
      { ingredient: 'Melena de León', reason: 'Ambos se estudian para la memoria y la función cognitiva; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Citicolina', reason: 'Ambos se estudian para la memoria y ambos están en Mind Lab Pro; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Teanina', reason: 'Ambos se estudian para el estrés y la ansiedad; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿Por qué algunas personas se sienten "nubladas" al empezar con Bacopa?', answer: 'Un procesamiento de la información más lento al principio figura entre los efectos secundarios de la Bacopa. Si persiste más allá de 6 semanas, reduce la dosis.' },
      { question: '¿Realmente necesito tomarla con grasa?', answer: 'Es la opción sensata por defecto. Los bacósidos son compuestos liposolubles, y en los ensayos se reportaron efectos secundarios gastrointestinales (cólicos, náuseas, deposiciones más frecuentes), así que el consejo habitual es tomar la Bacopa con una comida normal que contenga algo de grasa.' },
      { question: '¿Qué porcentaje de bacósidos debo buscar?', answer: 'Apunta al menos al 50%: el ensayo positivo que citamos (Calabrese et al., 2008) usó 300mg al día de un extracto estandarizado a un mínimo del 50% de bacósidos, unos 150mg de bacósidos. Dos extractos comerciales estandarizados son Bacognize y Synapsa. La "Bacopa" genérica sin estandarización declarada no es confiable: el contenido de compuesto activo puede ser insignificante.' },
      { question: '¿Cuánto tarda en hacer efecto?', answer: 'Los ensayos positivos sobre memoria midieron los resultados después de 12 semanas. No es un suplemento para evaluar en el primer mes. Pon un recordatorio en el calendario para evaluarlo alrededor de las 12 semanas, y ten en cuenta que el ensayo de 12 semanas más reciente con 300mg/día no encontró ningún beneficio cognitivo, así que los resultados varían.' },
      { question: '¿Se puede tomar Bacopa a largo plazo?', answer: 'La mayoría de los ensayos duraron 12 semanas o menos, así que los datos controlados más allá de ese plazo son escasos. El uso ayurvédico tradicional es continuo y sin ciclos, y ningún ensayo ha demostrado que los ciclos sean necesarios, pero la seguridad a largo plazo no se ha estudiado directamente.' },
    ],
    sourceHashes: { name: 'e700f14754c2', mechanism: '3802034269f8', clinicalDose: '1cd8db3d2cfd', timeToEffect: 'b0c9c4baf5ed', studySummary: 'f0ed741861e3', benefits: '455d30c40f53', sideEffects: 'd04e9586c3dc', humanEffects: '9cf249cef5ef', howToTake: '2902a24dcc02', stacksWith: '0b6ea378d3f5', faqs: '3f40c959c8a2' },
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
      { effect: 'Memoria verbal', notes: 'Beneficio en la memoria verbal en adultos mayores con memoria ineficiente (Spiers 1996) y un efecto combinado positivo en DCL/demencia (metaanálisis de 2023, estudios de baja calidad). No se ha demostrado en adultos sanos en general.' },
      { effect: 'Neuroprotección', notes: 'Respaldada en el ictus isquémico agudo por un ECA de dosis-respuesta (Clark 1997); no se encontró ningún ensayo en lesión cerebral traumática. Los efectos en adultos sanos no se han probado.' },
    ],
    howToTake: {
      dosage: '250–500mg/día; los ensayos de memoria en adultos mayores usaron 1000–2000mg/día, y 500mg fue la dosis óptima en el ensayo de ictus',
      timing: 'Por la mañana: la citicolina es levemente activadora y puede causar insomnio si se toma después de las 2 de la tarde',
      withFood: 'Se puede tomar con o sin comida. No hay una diferencia significativa en la absorción. Si sientes náuseas leves, tómala con una comida ligera.',
      forms: 'Cápsula. Existen dos formas de marca estandarizadas: Cognizin (usada en Mind Lab Pro) y la citicolina sódica. Ambas son eficaces. Evita la CDP-colina genérica sin etiquetar de fuentes desconocidas.',
    },
    stacksWith: [
      { ingredient: 'Bacopa Monnieri', reason: 'Ambos se estudian para la memoria y ambos están en Mind Lab Pro; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Teanina', reason: 'La citicolina aporta activación cognitiva; a menudo se añade L-teanina para la calma, aunque en un ensayo controlado con cafeína (Rogers 2008) no redujo significativamente el nerviosismo, y no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Melena de León', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: 'Citicolina frente a bitartrato de colina: ¿cuál es la diferencia?', answer: 'La citicolina es significativamente superior. Atraviesa la barrera hematoencefálica con más eficiencia y aporta dos componentes activos: colina (para la acetilcolina) y citidina (que se convierte en uridina, un componente básico de las membranas cerebrales). El bitartrato de colina solo aporta colina y atraviesa mal la barrera hematoencefálica.' },
      { question: '¿Debo dividir la dosis?', answer: 'Con 250mg, una sola dosis por la mañana está bien. Con 500mg, algunas personas la dividen en 250mg por la mañana y 250mg a primera hora de la tarde para una cobertura más uniforme. Evita cualquier dosis después de las 2–3 de la tarde, ya que el efecto levemente activador puede retrasar el inicio del sueño.' },
      { question: 'Me dio dolor de cabeza después de tomar citicolina, ¿es normal?', answer: 'Un dolor de cabeza por citicolina en dosis estándar (250–500mg) es inusual y puede indicar que eres sensible a los compuestos colinérgicos o que ya obtienes una cantidad importante de colina de la dieta u otros suplementos. Prueba a reducir a 250mg y no la combines con Alfa-GPC ni con otras fuentes de colina el mismo día.' },
      { question: 'Cognizin frente a CDP-colina genérica: ¿importa la marca?', answer: 'Cognizin es la forma con más validación clínica y se analiza su pureza. La CDP-colina genérica puede estar bien si proviene de proveedores confiables, pero la calidad varía más. Para trabajo cognitivo crítico, la forma de marca premium vale el pequeño aumento de costo.' },
    ],
    sourceHashes: { name: '3d4676af009b', mechanism: '09b80159eeb1', clinicalDose: '2135c280d962', timeToEffect: '95f800c9deab', studySummary: 'c4035e5ded21', benefits: '25b268bae409', sideEffects: 'a1033e3ca8ef', humanEffects: '1e1b0ac45325', howToTake: 'e5eb97cb183f', stacksWith: '25e39057f26c', faqs: '8ea162bc748e' },
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
      { ingredient: 'Bacopa Monnieri', reason: 'Ambos se estudian para el estrés y la ansiedad; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Ashwagandha', reason: 'Ambos se estudian para la ansiedad y el estrés; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿Cuál es la proporción ideal de L-teanina y cafeína?', answer: 'Ningún ensayo ha establecido una proporción ideal. Los ensayos positivos de la combinación usaron 97–250mg de teanina con 40–160mg de cafeína: por ejemplo, 100mg de teanina con 50mg de cafeína (Owen 2008), 250mg con 150mg (Haskell 2007) y 200mg con 160mg (Kahathuduwa 2016). Un metaanálisis encontró que la dosis de cafeína influyó más en el efecto que la dosis de teanina.' },
      { question: '¿La L-teanina funciona sin cafeína?', answer: 'En parte. Por sí sola, una dosis única de 200mg mejoró el tiempo de reacción de elección en un metaanálisis de 2026 con 31 ECA, pero los efectos sobre la ansiedad fueron inconsistentes y el único ensayo sobre ondas alfa encontró un efecto solo en personas con mayor ansiedad rasgo. Por sí sola no es estimulante.' },
      { question: '¿Es seguro tomar L-teanina todos los días?', answer: 'Sí. El té verde contiene teanina y se ha consumido a diario durante milenios sin problemas de toxicidad. No se desarrolla tolerancia. El uso diario crónico es seguro y eficaz. No se requieren ciclos.' },
      { question: '¿Por qué tomar un suplemento si puedo simplemente beber té verde?', answer: 'Una taza estándar de té verde contiene ~25–50mg de L-teanina, muy por debajo de la dosis terapéutica de 100–200mg. Necesitarías 4–8 tazas de té verde para igualar una sola dosis del suplemento, junto con una carga considerable de cafeína. Los suplementos permiten una dosificación precisa sin cafeína no deseada.' },
      { question: '¿La L-teanina puede ayudar a dormir si se toma de noche?', answer: 'De forma modesta. Un metaanálisis de 2025 (18 estudios, n=897) encontró pequeñas mejoras en la latencia subjetiva de inicio del sueño, la disfunción diurna y la calidad general del sueño. No causa sedación. Las combinaciones con magnesio son populares, pero no se han probado en un ensayo.' },
    ],
    sourceHashes: { name: '8667600691ae', mechanism: 'ee0740531bc6', clinicalDose: 'c51d39b0a020', timeToEffect: '32098c8af1b0', studySummary: '43531aff65ab', benefits: '5bfcb95e81e3', sideEffects: 'f90524834c14', humanEffects: 'ac70b456615b', howToTake: 'd28b5d7ed155', stacksWith: '0dd9a189f0c7', faqs: '37c9546e7ac8' },
  },
  {
    slug: 'rhodiola-rosea',
    name: 'Rhodiola Rosea',
    mechanism: 'La Rhodiola es un adaptógeno que modula el eje HPA (hipotálamo-hipófiso-suprarrenal), reduciendo la producción de cortisol bajo estrés. En estudios de laboratorio, sus principales compuestos bioactivos (rosavinas y salidrosida) inhibieron las enzimas monoaminooxidasa.',
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
      { ingredient: 'Ashwagandha', reason: 'Ambos son adaptógenos; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Teanina', reason: 'La Rhodiola es un adaptógeno; la L-teanina es un aminoácido presente en el té verde. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Tirosina', reason: 'Ambos se estudian para el rendimiento bajo estrés; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿Hay que tomar la Rhodiola en ciclos?', answer: 'No según la evidencia actual. Los ensayos clínicos duraron desde una sola dosis hasta 4 semanas, así que no probaron ni los ciclos ni meses de uso continuo. Algunas personas hacen una pausa de 1–2 semanas cada 4–6 semanas como precaución ante un posible "efecto techo".' },
      { question: '¿Qué significan las rosavinas y la salidrosida en la etiqueta de la Rhodiola?', answer: 'Las rosavinas y la salidrosida son los principales compuestos bioactivos de la Rhodiola. La Rhodiola rosea contiene de forma natural rosavinas y salidrosidas en una proporción de aproximadamente 3:1, y los preparados se elaboran para reflejarla (Ishaque 2012). Los ensayos que citamos usaron el extracto SHR-5, y sus resúmenes no indican porcentajes de marcadores.' },
      { question: '¿La Rhodiola puede causar ansiedad o nerviosismo?', answer: 'En una minoría de personas, sobre todo con dosis superiores a 400mg, la Rhodiola puede causar una inquietud parecida a la de un estimulante o ansiedad leve, en particular durante la primera semana. Empieza con 200mg y aumenta de forma gradual. Algunas personas la combinan con L-teanina para suavizarlo, aunque esa combinación no se ha probado en un ensayo.' },
      { question: '¿Es seguro tomar Rhodiola con antidepresivos?', answer: 'No sin supervisión médica. Los compuestos de la Rhodiola inhiben la monoaminooxidasa en estudios de laboratorio, así que una interacción con ISRS, IMAO y otros antidepresivos (incluido el síndrome serotoninérgico) es teóricamente posible; no se encontraron reportes clínicos en nuestra revisión de PubMed de 2026. Consulta siempre a tu médico si tomas algún medicamento psiquiátrico.' },
    ],
    sourceHashes: { name: '8ef9c8a44212', mechanism: '11f12f412b04', clinicalDose: 'fb8dea0030b2', timeToEffect: '5ab4648e058c', studySummary: '286609ca7e58', benefits: '37918f8c0b1b', sideEffects: 'f1409ae470d6', humanEffects: '72e1fc4286c4', howToTake: '7a02ee1487ac', stacksWith: 'afe1ef661ff8', faqs: '205144fcbd1f' },
  },
  {
    slug: 'phosphatidylserine',
    name: 'Fosfatidilserina',
    mechanism: 'La fosfatidilserina (PS) es un fosfolípido que constituye un componente fundamental de las membranas de las neuronas.',
    clinicalDose: '100–300mg/día (beneficio demostrado principalmente en adultos mayores con quejas de memoria o DCL)',
    timeToEffect: 'Los ensayos sobre memoria duraron de 15 semanas a 12 meses; ningún ensayo estableció un inicio más temprano',
    studySummary: 'Los ECA en adultos mayores con quejas de memoria o deterioro cognitivo leve reportan beneficios en la memoria, aunque a menudo solo en subgrupos: la PS de soya con 100–300mg/día durante 6 meses ayudó solo a los participantes con puntuaciones iniciales bajas (Kato-Kataoka 2010), y la PS-DHA de origen marino con 300mg/día mejoró el recuerdo verbal inmediato en un ensayo exploratorio de 15 semanas (Vakhapova 2010). Un metaanálisis en red de 2026 en DCL/Alzheimer encontró que 100mg de PS mejoraron el MMSE, pero no la subescala cognitiva de la Escala de Evaluación de la Enfermedad de Alzheimer (ADAS-Cog). En niños sanos, un ECA de 12 semanas con 100mg de PS de girasol no encontró efecto en los resultados primarios ni secundarios (Friling 2025; entre los autores hay personal de IFF, el fabricante del producto). Un ensayo positivo de 2024 en DCL (Duan 2024; con coautores de BYHEALTH) administró solo 31.5mg de PS dentro de una fórmula con varios ingredientes. La FDA permite dos declaraciones calificadas, que puede reducir el riesgo de demencia y que puede reducir el riesgo de disfunción cognitiva en personas mayores, cada una con la advertencia "FDA concludes that there is little scientific evidence supporting this claim", es decir, que la FDA concluye que hay poca evidencia científica que respalde esta declaración (carta de la FDA, 13 de mayo de 2003).',
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
      { effect: 'Deterioro cognitivo asociado a la edad', notes: 'Un metaanálisis en red de 2026 (29 ECA, DCL/Alzheimer) encontró que 100mg de PS mejoraron el MMSE, pero no el ADAS-Cog. La FDA permite dos declaraciones calificadas, que puede reducir el riesgo de demencia y que puede reducir el riesgo de disfunción cognitiva en personas mayores, cada una con la advertencia "FDA concludes that there is little scientific evidence supporting this claim", es decir, que la FDA concluye que hay poca evidencia científica que respalde esta declaración.' },
    ],
    howToTake: {
      dosage: '100–300mg/día: el beneficio es más constante en adultos mayores y en el DCL, y en análisis de subgrupos; un ensayo con 100mg/día en niños sanos fue nulo',
      timing: 'Con las comidas: divide la dosis entre 2–3 comidas para obtener mejores resultados (por ejemplo, 100mg con el desayuno y 100mg con el almuerzo)',
      withFood: 'La PS es un fosfolípido liposoluble y se absorbe mejor con grasa de la dieta. Tómala siempre con comida. Dividir la dosis entre las comidas es mejor que una sola dosis grande.',
      forms: 'Cápsula (preferiblemente blanda). Hay tres tipos de fuente: (1) derivada de soya: la más común y barata, eficaz pero contiene soya; (2) derivada de girasol: sin soya, la opción preferida; (3) derivada de cerebro bovino: usada en los ensayos originales de la década de 1990, ya no se comercializa por la preocupación por la EEB. Sharp-PS de girasol es la forma de referencia.',
    },
    stacksWith: [
      { ingredient: 'Melena de León', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Citicolina', reason: 'La citicolina es un precursor de la fosfatidilcolina; la fosfatidilserina es un fosfolípido de las membranas de las neuronas. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Omega-3 (DHA)', reason: 'El DHA es un componente estructural de las membranas neuronales. Algunos productos clínicos de PS están conjugados con DHA (PS-DHA): un ensayo de 15 semanas con PS-DHA de origen marino (Vakhapova 2010) con 300mg/día mejoró el recuerdo verbal inmediato en adultos mayores con quejas de memoria.' },
    ],
    faqs: [
      { question: 'PS de soya frente a PS de girasol: ¿cuál es mejor?', answer: 'Ambas se usan en ensayos: la PS de soya en adultos mayores con quejas de memoria (Kato-Kataoka 2010) y la PS de girasol en niños sanos, en quienes no tuvo efecto (Friling 2025). La PS derivada de girasol no contiene soya y es la opción preferida para cualquier persona con sensibilidad a la soya. Nuestra revisión de 2026 no incluyó ninguna comparación directa entre ambas.' },
      { question: '¿Cuál es la declaración de salud de la FDA para la PS?', answer: 'La FDA permite dos declaraciones calificadas: que la fosfatidilserina puede reducir el riesgo de demencia en personas mayores y que puede reducir el riesgo de disfunción cognitiva en personas mayores, cada una con la advertencia "FDA concludes that there is little scientific evidence supporting this claim", es decir, que la FDA concluye que hay poca evidencia científica que respalde esta declaración (carta de la FDA, 13 de mayo de 2003). La redacción de cada declaración dice que "very limited and preliminary scientific research suggests" esto, es decir, que investigaciones científicas muy limitadas y preliminares lo sugieren.' },
      { question: '¿Y la fuente de cerebro bovino que aparece en estudios más antiguos?', answer: 'Los ensayos originales con PS de la década de 1990 usaron PS derivada de corteza cerebral bovina. Esta fuente se abandonó en todo el mundo tras la preocupación por la EEB (enfermedad de las vacas locas). Toda la PS comercial actual es de origen vegetal o marino. Los ensayos posteriores con PS vegetal y marina muestran beneficios en la memoria principalmente en subgrupos de adultos mayores, así que no debe suponerse que los resultados bovinos más antiguos sean trasladables.' },
      { question: '¿La PS interactúa con los anticoagulantes?', answer: 'Nuestra revisión de PubMed de 2026 no encontró ninguna interacción clínica entre la PS y los anticoagulantes, y el principal ensayo de seguridad de la PS no recopiló datos sobre sangrado. Si tomas warfarina, aspirina u otros anticoagulantes, consulta a tu médico antes de añadir cualquier suplemento.' },
    ],
    sourceHashes: { name: '84b783e1a205', mechanism: 'a5aadf994a2e', clinicalDose: 'b3586df4aeec', timeToEffect: 'fd2897116995', studySummary: '83986e8c854f', benefits: 'be8718ee4d5a', sideEffects: '74e3d86af15b', humanEffects: 'eeb56c14c81a', howToTake: 'ef36cb389a09', stacksWith: '147cfb6ebd97', faqs: '71f4cc7273fe' },
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
      { ingredient: 'Melena de León', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Bacopa Monnieri', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Huperzina A', reason: 'La Huperzina A frena la degradación de la acetilcolina; la Alfa-GPC es un precursor de colina. No citamos ningún ensayo de esta combinación. Úsalas con precaución y en dosis bajas, ya que la sobrecarga colinérgica (náuseas, dolor de cabeza, calambres musculares) es un riesgo real. No se recomienda sin experiencia.' },
    ],
    faqs: [
      { question: 'Alfa-GPC frente a citicolina: ¿cuál es mejor para la concentración?', answer: 'Ambas son excelentes. La Alfa-GPC tiene una ligera ventaja en los efectos colinérgicos agudos y se prefiere para el rendimiento en el entrenamiento. La citicolina también aporta citidina (precursora de la uridina), lo que le da un perfil neuroprotector más amplio. Para la concentración pura y la acetilcolina, la Alfa-GPC gana ligeramente; para un apoyo integral a la salud cerebral, la citicolina es más completa. No las combines: tendrías demasiada actividad de colina.' },
      { question: '¿Es seguro combinar Alfa-GPC con Huperzina A?', answer: 'Con precaución. Ambas aumentan la acetilcolina (la Alfa-GPC por síntesis y la Huperzina A al inhibir su degradación). La combinación es potente y puede causar sobreestimulación colinérgica, con síntomas como náuseas, dolor de cabeza, salivación excesiva y calambres musculares. Si las combinas, usa dosis más bajas de cada una (por ejemplo, 200mg de Alfa-GPC + 50mcg de Huperzina A) y no las tomes a diario.' },
      { question: '¿Por qué el polvo de Alfa-GPC se vuelve pegajoso?', answer: 'La Alfa-GPC es muy higroscópica: absorbe rápidamente el agua del aire. Es normal y no afecta su potencia. Guárdala en un recipiente hermético en un lugar fresco y seco. La forma en cápsula evita este problema por completo.' },
      { question: '¿Existe un riesgo cardiovascular con la Alfa-GPC?', answer: 'No está resuelto. El estudio de cohorte CARDIA (publicado en 2024) relacionó una colina plasmática más alta (no los suplementos de alfa-GPC) con la aparición de enfermedad cardiovascular, mientras que un metaanálisis sobre la ingesta de colina en la dieta no encontró ninguna asociación. Ningún estudio ha probado directamente la suplementación con alfa-GPC en resultados cardiovasculares. Si tienes una enfermedad cardiovascular, coméntalo con tu médico.' },
    ],
    sourceHashes: { name: 'eb14648f61e2', mechanism: '9ce0e233dea3', clinicalDose: 'a66a252fe340', timeToEffect: '0caa7d003f51', studySummary: '8081ab7f5d34', benefits: '5e3227a7cadd', sideEffects: '3a095bf3481e', humanEffects: '4d9d08735d9e', howToTake: '91b6527617b8', stacksWith: '2634b652b2ed', faqs: '80578914290e' },
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
      forms: 'Cápsula. Elige un extracto que declare su contenido de witanólidos. Los ensayos de nuestra página sobre la ashwagandha usaron un extracto de raíz de espectro completo de alta concentración (Chandrasekhar 2012), un extracto de raíz (Choudhary 2017) y el extracto Shoden (Lopresti 2019); no citamos ningún ensayo con Sensoril. Evita la ashwagandha sin estandarizar que no declare un porcentaje de witanólidos: el contenido activo puede ser insignificante.',
    },
    stacksWith: [
      { ingredient: 'Rhodiola Rosea', reason: 'Ambos son adaptógenos; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Teanina', reason: 'Ambos se estudian para la ansiedad y el estrés; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Fosfatidilserina', reason: 'No citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: 'KSM-66, Sensoril o ashwagandha genérica: ¿cuál debería elegir?', answer: 'Elige un extracto que declare su contenido de witanólidos. Los ensayos de nuestra página sobre la ashwagandha usaron un extracto de raíz de espectro completo de alta concentración (Chandrasekhar 2012), un extracto de raíz (Choudhary 2017) y el extracto Shoden (Lopresti 2019); no citamos ningún ensayo con Sensoril. La ashwagandha genérica sin un porcentaje de witanólidos declarado no es confiable: podrías estar pagando por polvo de raíz rico en almidón con un contenido activo mínimo.' },
      { question: '¿La ashwagandha me dará sueño durante el día?', answer: 'El efecto de cansancio es más pronunciado cuando se toma por la noche, cuando reduce la latencia del sueño. La ashwagandha no agota la energía. A algunas personas 600mg por la mañana les resultan ligeramente sedantes; en ese caso, reduce a 300mg o pásala solo a la noche.' },
      { question: '¿Es segura la ashwagandha para el uso a largo plazo?', answer: 'Faltan datos a largo plazo: la mayoría de los ensayos duran 8–12 semanas, y no se encontraron datos controlados de seguridad más allá de unos 90 días. Reportes de casos publicados relacionan la ashwagandha con lesiones hepáticas (algunos calificados como "probables" en la escala de causalidad RUCAM), y Dinamarca prohibió los complementos alimenticios de ashwagandha en 2023 porque no se pudo establecer una dosis segura. Suspéndela y consulta a un médico si presentas ictericia u orina oscura. Evítala si tienes afecciones de la tiroides (enfermedad tiroidea autoinmune), ya que los witanólidos pueden modular los niveles de hormonas tiroideas.' },
      { question: '¿La ashwagandha puede aumentar la testosterona?', answer: 'Dos ECA encontraron aumentos: 600mg/día durante 8 semanas en hombres jóvenes que empezaban un entrenamiento de fuerza elevaron la testosterona junto con mayores ganancias de fuerza (2015), y un ensayo cruzado en hombres con sobrepeso de 40–70 años encontró testosterona +14.7% y DHEA-S +18% frente a placebo, pero ningún cambio en el cortisol, la fatiga ni el vigor (Lopresti 2019). La magnitud varía según la población y el extracto.' },
    ],
    sourceHashes: { name: 'f48263c2c9f9', mechanism: 'cc1bdea1cc19', clinicalDose: '77d574d99676', timeToEffect: '34f7d36bdeeb', studySummary: 'e23483b812a2', benefits: 'd468ea7029e0', sideEffects: '6815c74cfa8a', humanEffects: 'ec057d3d5767', howToTake: '095f62ddcc06', stacksWith: '2aa578037f79', faqs: 'f704807e64ff' },
  },
  {
    slug: 'huperzine-a',
    name: 'Huperzina A',
    mechanism: 'La Huperzina A se extrae de Huperzia serrata (licopodio chino). Es un inhibidor potente y reversible de la acetilcolinesterasa: bloquea la enzima que degrada la acetilcolina, lo que en la práctica aumenta los niveles de acetilcolina en todo el cerebro.',
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
      { ingredient: 'Bacopa Monnieri', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Melena de León', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿Hay que tomar la Huperzina A en ciclos?', answer: 'No hay evidencia de ensayos en ningún sentido. Los ensayos clínicos la administraron a diario durante 4–16 semanas, y la revisión Cochrane de 2008 encontró que los eventos adversos fueron leves y no más frecuentes que con placebo. Ningún ensayo en humanos ha probado un esquema de ciclos. Lo que hay que vigilar son los efectos secundarios colinérgicos (náuseas, sudoración, salivación excesiva, espasmos musculares); suspéndela o reduce la dosis si aparecen.' },
      { question: '¿100mcg es lo mismo que 100mg? La etiqueta resulta confusa.', answer: 'No: mcg (microgramos) y mg (miligramos) se diferencian en un factor de 1000. La Huperzina A se dosifica en microgramos (mcg). Una dosis de 200mcg equivale a 0.2mg. Esto es correcto e intencional: la Huperzina A es extremadamente potente. Si un producto indica una dosis en miligramos (por ejemplo, "100mg"), lee la etiqueta con atención: probablemente se refiere a 100mcg (0.1mg). Una dosis real de 100mg de Huperzina A sería una sobredosis catastrófica.' },
      { question: '¿Puedo tomar Huperzina A con Alfa-GPC?', answer: 'Técnicamente sí, pero con mucha precaución. La Alfa-GPC aumenta la síntesis de acetilcolina; la Huperzina A evita su degradación. La combinación puede causar con facilidad una sobrecarga colinérgica, y ningún ensayo la ha probado. Si las combinas, usa dosis bajas de cada una y empieza con una sola antes de combinarlas. Vigila con atención los primeros síntomas de sobrecarga: náuseas, dolor de cabeza, salivación excesiva.' },
      { question: '¿Es segura la Huperzina A para adultos jóvenes y sanos?', answer: 'La investigación sobre la Huperzina A se basa sobre todo en pacientes con Alzheimer; el único ECA en población sana que se encontró fue un estudio de 4 semanas en 68 estudiantes adolescentes con 100mcg/día. Los principales riesgos en usuarios sanos son los errores de dosificación (confundir mcg y mg) y combinarla con otros colinérgicos. La seguridad a largo plazo en adultos sanos no se ha estudiado.' },
    ],
    sourceHashes: { name: '4fee00338022', mechanism: 'a29c694db740', clinicalDose: '8550009654e6', timeToEffect: 'fb827af64156', studySummary: '45bc30928f8b', benefits: 'de06381675b0', sideEffects: '8f474fed142a', humanEffects: '5d49be382fee', howToTake: '11831e7ef48d', stacksWith: '321082a3ab8f', faqs: 'a81b0052f14e' },
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
      { ingredient: 'L-Teanina', reason: 'La L-tirosina es un aminoácido precursor de la dopamina y la norepinefrina; la L-teanina es un aminoácido presente en el té verde. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Rhodiola Rosea', reason: 'Ambos se estudian para el rendimiento bajo estrés; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Cafeína', reason: 'A menudo se combina con cafeína; no citamos ningún ensayo de L-tirosina con cafeína.' },
    ],
    faqs: [
      { question: '¿La L-tirosina funciona si no estoy estresado ni privado de sueño?', answer: 'Probablemente no de forma significativa. Este es el matiz clave de la tirosina. La evidencia muestra que previene el deterioro cognitivo bajo estrés: restablece las catecolaminas agotadas. En un estado basal de descanso y sin estrés, los niveles de catecolaminas ya son suficientes, así que añadir el precursor no produce un efecto notable. Piénsala como un seguro para los días exigentes, no como un potenciador cognitivo diario.' },
      { question: 'L-tirosina frente a NALT: ¿qué forma debo comprar?', answer: 'L-tirosina simple. Los ensayos sobre estrés con resultados positivos usaron L-tirosina simple (con 2g/día o con dosis según el peso de 100–150mg/kg), tomada alrededor de una hora antes de la exigencia. La NALT se usa con frecuencia en stacks formulados (es más fácil de encapsular), pero no se encontró ningún ensayo que la comparara con la L-tirosina simple en cognición.' },
      { question: '¿Interactúa con los medicamentos para la tiroides?', answer: 'Sí: la L-tirosina es precursora de las hormonas tiroideas (T3 y T4). En dosis estándar, esto no es clínicamente significativo para la mayoría de las personas. Sin embargo, si tienes hipertiroidismo o tomas levotiroxina u otros medicamentos para la tiroides, la tirosina suplementaria podría, en teoría, afectar los niveles hormonales. Consulta a tu médico antes de usarla si tienes cualquier afección de la tiroides.' },
      { question: '¿La L-tirosina puede ayudar con el TDAH?', answer: 'No está establecido. La tirosina es precursora de la dopamina, pero nuestra revisión de la evidencia de 2026 no evaluó ensayos en TDAH, y una revisión de 2015 consideró mínimo su potencial para tratar trastornos clínicos. La L-tirosina no sustituye el tratamiento del TDAH: habla con tu médico antes de combinarla con cualquier medicamento.' },
    ],
    sourceHashes: { name: 'b6b49148c5ac', mechanism: '082853377a1d', clinicalDose: '6d0a3df772cd', timeToEffect: '405de68dd725', studySummary: '4297e1f0df7a', benefits: '97fe49942c76', sideEffects: '02adfee90f52', humanEffects: '0e7b00103360', howToTake: '1bbc33b31283', stacksWith: '690cada98a12', faqs: 'f6c0886b2e57' },
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
      { ingredient: 'Rhodiola Rosea', reason: 'La Rhodiola es un adaptógeno; la cafeína es un antagonista de los receptores de adenosina. No citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿Cuánta cafeína es demasiada?', answer: 'La EFSA (2015) concluyó que las dosis únicas de hasta 200mg y la ingesta diaria de hasta 400mg no plantean problemas de seguridad para adultos sanos, y que las mujeres embarazadas deben mantenerse en 200mg/día o menos. Las personas con trastorno de pánico tienen muchas más probabilidades de sufrir un ataque de pánico tras dosis altas. Por encima de estos niveles, la ansiedad, las palpitaciones y las alteraciones del sueño se vuelven comunes. Para la mejora cognitiva, 100-200mg es el punto óptimo: las dosis más altas aportan beneficios decrecientes para la cognición y aumentan los efectos secundarios.' },
      { question: '¿La tolerancia a la cafeína reduce sus beneficios cognitivos?', answer: 'En parte. La tolerancia se desarrolla rápidamente para el estado de alerta subjetivo (la sensación de "me siento despierto"), pero más lentamente para los beneficios cognitivos objetivos, como el tiempo de reacción y la vigilancia. Incluso los consumidores habituales muestran tiempos de reacción más rápidos tras la cafeína frente a placebo. Sin embargo, hacer pausas periódicas (1-2 semanas) puede restablecer parcialmente la tolerancia.' },
      { question: '¿La cafeína del café es distinta de la cafeína de los suplementos?', answer: 'Químicamente, la cafeína es cafeína sin importar su fuente. Sin embargo, el café contiene ácidos clorogénicos y otros polifenoles que pueden modular la cinética de absorción y aportar efectos neuroprotectores independientes. La cafeína de los suplementos (anhidra) actúa más rápido y con más fuerza. Ninguna es objetivamente mejor: depende de si quieres una dosificación precisa (cápsula) o una curva más suave (café o té).' },
      { question: '¿Puedo tomar cafeína con stacks nootrópicos que contienen estimulantes?', answer: 'Ten cuidado. Muchos stacks nootrópicos (por ejemplo, Hunter Focus) ya contienen 100mg de cafeína. Añadir café o pastillas de cafeína encima puede llevarte a superar los 400mg/día. Revisa siempre el contenido de cafeína en la etiqueta antes de combinar. Si un producto contiene cafeína, reduce en consecuencia tu consumo de cafeína de otras fuentes.' },
    ],
    sourceHashes: { name: '015b48a9827e', mechanism: '9a9a74e9e02e', clinicalDose: '6cf77863b183', timeToEffect: '3dadd12af507', studySummary: '31e1e284f0d9', benefits: '2f4684a5dc65', sideEffects: '5d285d9063e6', humanEffects: '5dc9f6dd6a6c', howToTake: '75e1cd3cd00d', stacksWith: '4c988911987c', faqs: '957edbe79871' },
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
      { ingredient: 'Fosfatidilserina', reason: 'Ambos se estudian para el deterioro cognitivo asociado a la edad; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Melena de León', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Bacopa Monnieri', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿El Ginkgo Biloba funciona realmente en adultos jóvenes y sanos?', answer: 'La evidencia es mixta. Los beneficios más claros se dan en personas con demencia, y la revisión Cochrane de 2026 encontró poco o ningún efecto incluso en el deterioro cognitivo leve. En adultos jóvenes y sanos, los efectos sobre la memoria y la atención son inconsistentes entre ensayos. Si tienes menos de 40 años y estás cognitivamente sano, la L-teanina + cafeína tiene evidencia aguda más sólida.' },
      { question: '¿Qué es EGb 761 y por qué importa?', answer: 'EGb 761 es un extracto específico de Ginkgo biloba de grado farmacéutico fabricado por Dr. Willmar Schwabe Pharmaceuticals. Está estandarizado al 24% de glucósidos flavonoides de ginkgo y al 6% de lactonas terpénicas, con el ácido ginkgólico tóxico eliminado por debajo de 5ppm. Es el extracto usado en los ensayos agrupados por el metaanálisis que citamos (Tan 2015). Los productos de ginkgo genéricos pueden no igualar su potencia ni su pureza.' },
      { question: '¿Puedo tomar Ginkgo con anticoagulantes?', answer: 'Evítalo salvo que tu médico esté de acuerdo. En una gran cohorte de la Administración de Veteranos, tomar ginkgo con warfarina aumentó el riesgo de sangrado en un 38% (HR 1.38), y una revisión sistemática de las interacciones de la warfarina relaciona el ginkgo con eventos hemorrágicos graves, incluida la hemorragia intracraneal. La interacción está documentada clínicamente y es potencialmente grave.' },
      { question: '¿Cuánto tiempo pasa hasta ver resultados?', answer: 'Los ensayos positivos en demencia duraron 22–26 semanas con 240mg/día, y la revisión Cochrane evaluó los resultados a los 6 meses. No juzgues la eficacia a las 1–2 semanas.' },
    ],
    sourceHashes: { name: '7ca33b4078c1', mechanism: '52b072149d87', clinicalDose: 'd3f287672e4f', timeToEffect: 'b63c90143962', studySummary: '4094661772fc', benefits: '2f1a760d44e0', sideEffects: '397bb6bb347b', humanEffects: 'b2c75e5b2b8c', howToTake: 'c74be2fd321e', stacksWith: 'bc034dca1e6b', faqs: '767cb40c84cd' },
  },
  {
    slug: 'dha-omega-3',
    name: 'DHA (Omega-3)',
    mechanism: 'El ácido docosahexaenoico (DHA) es el principal ácido graso omega-3 estructural del cerebro y constituye ~40% de los ácidos grasos poliinsaturados de las membranas neuronales. El DHA mantiene la fluidez de la membrana, lo que permite el funcionamiento adecuado de los receptores, la actividad de los canales iónicos y la dinámica de las vesículas sinápticas. También resuelve la neuroinflamación a través de mediadores especializados prorresolutivos (SPM) y favorece la expresión de BDNF (factor neurotrófico derivado del cerebro) para la neuroplasticidad.',
    clinicalDose: '900mg–1.2g de DHA/día (el rango de dosis de los ensayos positivos)',
    timeToEffect: 'Unas 24 semanas: ambos ECA cognitivos positivos duraron 6 meses',
    studySummary: 'El DHA es esencial para el desarrollo y el mantenimiento del cerebro, pero los resultados de los ECA son mixtos. Una revisión Cochrane de 2012 (n=4080) no encontró ningún beneficio cognitivo de los suplementos de omega-3 en adultos mayores cognitivamente sanos, y un metaanálisis de 2025 no encontró un beneficio relevante en el ADAS-Cog una vez desarrollado el Alzheimer. Dos ECA de 6 meses fueron positivos: 900mg de DHA/día mejoraron el aprendizaje y la memoria de reconocimiento en el deterioro cognitivo asociado a la edad (Yurko-Mauro et al., 2010, patrocinado por Martek, fabricante de DHA de algas, con un empleado de Martek como autor principal), y 1.16g/día mejoraron la memoria y los tiempos de reacción de la memoria de trabajo en adultos sanos de 18–45 años con una baja ingesta de DHA (Stonehouse 2013). Un metaanálisis de 2021 financiado por los NIH (n=81210) encontró que los suplementos de omega-3 aumentan el riesgo de fibrilación auricular, más aún por encima de 1g/día.',
    benefits: [
      'Aprendizaje y memoria de reconocimiento en el deterioro cognitivo asociado a la edad (900mg/día)',
      'Memoria y tiempo de reacción en adultos sanos con una baja ingesta de DHA (1.16g/día)',
      'Integridad de la membrana neuronal',
    ],
    sideEffects: [
      'Fibrilación auricular: un metaanálisis de 2021 de ECA cardiovasculares (PMID 34612056, n=81210) encontró que los suplementos de omega-3 aumentaron el riesgo de fibrilación auricular (HR 1.25), que sube a HR 1.49 con más de 1g/día; habla con tu médico si tienes problemas del ritmo cardíaco',
      'Regusto o eructos con sabor a pescado',
      'Problemas gastrointestinales leves (menos del 15% de los participantes en la revisión Cochrane, similar a placebo)',
      'Posible efecto anticoagulante en dosis muy altas (>3g/día)',
    ],
    humanEffects: [
      { effect: 'Memoria (en el deterioro asociado a la edad)', notes: '900mg de DHA/día durante 24 semanas mejoraron el aprendizaje de pares asociados y la memoria de reconocimiento verbal, pero no la memoria de trabajo ni la función ejecutiva, en adultos de 55 años o más con deterioro asociado a la edad (Yurko-Mauro 2010, patrocinado por la industria).' },
      { effect: 'Memoria (en adultos sanos)', notes: 'Stonehouse 2013 (n=176, 6 meses, 1.16g/día) mejoró los tiempos de reacción de la memoria episódica y de trabajo (−0.18 a −0.36 DE) en adultos de 18–45 años con una baja ingesta de DHA; mujeres y hombres se beneficiaron en medidas distintas.' },
      { effect: 'Estado de ánimo y depresión', notes: 'Se ha reportado que el EPA tiene el efecto antidepresivo más fuerte; no se volvió a verificar en nuestra revisión de 2026.' },
      { effect: 'Preservación de la estructura cerebral', notes: 'Se ha reportado que niveles más altos de DHA en sangre se correlacionan con un mayor volumen del hipocampo en estudios de resonancia magnética; no se volvió a verificar en nuestra revisión de 2026.' },
    ],
    howToTake: {
      dosage: '900mg–1.2g de DHA/día. Si lo combinas con EPA, ten en cuenta que en los ensayos cardiovasculares el riesgo de fibrilación auricular aumentó por encima de 1g/día de omega-3 total',
      timing: 'Con una comida que contenga grasa para una absorción óptima. Se puede tomar a cualquier hora del día.',
      withFood: 'Imprescindible: el DHA es liposoluble, así que tómalo con una comida que contenga grasa.',
      forms: 'Aceite de pescado, aceite de krill o aceite de algas (vegano). El DHA de algas evita la preocupación por los metales pesados; ningún ensayo ha comparado directamente el DHA de algas y el de pescado en resultados cognitivos.',
    },
    stacksWith: [
      { ingredient: 'Fosfatidilserina', reason: 'El DHA es un componente estructural de las membranas neuronales. Algunos productos clínicos de PS están conjugados con DHA (PS-DHA): un ensayo de 15 semanas con PS-DHA de origen marino (Vakhapova 2010) con 300mg/día mejoró el recuerdo verbal inmediato en adultos mayores con quejas de memoria.' },
      { ingredient: 'Melena de León', reason: 'Ambos se estudian para la memoria; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Citicolina', reason: 'La citicolina es un precursor de la fosfatidilcolina; el DHA es el principal ácido graso omega-3 estructural del cerebro. No citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: 'DHA frente a EPA: ¿cuál importa más para la salud cerebral?', answer: 'El DHA es el omega-3 estructural de las membranas cerebrales (~40% de los AGPI del cerebro), lo que lo hace más directamente relevante para la función cognitiva. El EPA es más potente como antiinflamatorio y muestra efectos más fuertes sobre el estado de ánimo y la depresión. Para la salud cerebral, prioriza el DHA: los ensayos cognitivos positivos usaron 900mg–1.16g de DHA al día. Para el estado de ánimo, prioriza el EPA. La mayoría de los suplementos de calidad aportan ambos; ten en cuenta la señal de fibrilación auricular por encima de 1g/día de omega-3 total.' },
      { question: '¿Puedo obtener suficiente DHA solo con la dieta?', answer: 'Si comes pescado graso (salmón, caballa, sardinas) 2-3 veces por semana, probablemente obtienes suficiente DHA. La mayoría de las personas con dietas occidentales consume niveles muy inferiores a los óptimos. Los vegetarianos y veganos tienen un riesgo especial de deficiencia: los suplementos de DHA de algas son la solución. Un análisis de sangre (Omega-3 Index) puede medir tu nivel real.' },
      { question: '¿Es mejor el aceite de pescado o el de algas?', answer: 'El DHA es la misma molécula en ambas fuentes. El aceite de algas evita la preocupación por el mercurio y los metales pesados y es apto para vegetarianos. El aceite de pescado aporta una proporción natural de DHA+EPA. Ningún ensayo los ha comparado directamente en resultados cognitivos: elige según tu preferencia alimentaria y la calidad del producto concreto.' },
      { question: '¿Cuánto tiempo pasa hasta notar efectos cognitivos?', answer: 'El DHA actúa reconstruyendo la composición de las membranas, un proceso lento. Ambos ECA cognitivos positivos duraron 24 semanas (6 meses). No sentirás un efecto agudo como con la cafeína o la L-teanina. Piensa en el DHA como una inversión en infraestructura a largo plazo, no como un suplemento de rendimiento.' },
    ],
    sourceHashes: { name: '158b9ff9ae1d', mechanism: 'f288c32308b5', clinicalDose: '7226276cc513', timeToEffect: '5f9853a9095b', studySummary: '3359b9d9aa80', benefits: '7d8e90ddd8b8', sideEffects: 'd75f8f4c0062', humanEffects: '150a902bcfdd', howToTake: 'be3d4fbbb20e', stacksWith: '5d39b8ae3e9e', faqs: 'ae0eb1adda3c' },
  },
  {
    slug: 'maritime-pine-bark',
    name: 'Extracto de corteza de pino marítimo',
    mechanism: 'El extracto de corteza de pino marítimo (Pinus pinaster) contiene proantocianidinas, potentes antioxidantes polifenólicos que atraviesan la barrera hematoencefálica. Actúa por tres vías: (1) estimula la óxido nítrico sintasa endotelial (eNOS) para aumentar el flujo sanguíneo cerebral mediante vasodilatación; (2) neutraliza las especies reactivas de oxígeno para proteger las membranas neuronales; (3) modula la señalización inflamatoria de NF-κB para reducir la neuroinflamación. Pycnogenol es una forma de marca.',
    clinicalDose: '100–200mg/día (Pycnogenol o un extracto estandarizado equivalente)',
    timeToEffect: 'Los estudios cognitivos duraron 8–12 semanas',
    studySummary: 'Un estudio de 2014 con Pycnogenol (Belcaro et al.) en profesionales sanos de 35–55 años reportó mejoras cognitivas pequeñas pero significativas y un descenso del 30.4% de los radicales libres en plasma tras 12 semanas con 150mg/día, pero fue un estudio de registro de evaluación de producto no aleatorizado, no un ECA. Un estudio controlado (no aleatorizado) de 2011 en estudiantes (Luzzi et al.) reportó mejor atención, memoria y calificaciones de exámenes a lo largo de 8 semanas. Ambos provienen del mismo grupo de autores de Irvine3 Labs / Chieti-Pescara, que ha publicado numerosos estudios sobre Pycnogenol; Pycnogenol es una marca registrada de Horphag Research, y estos ensayos se describen ampliamente como apoyados por la industria, aunque los resúmenes no declaran ningún patrocinador. La revisión Cochrane independiente de 2020 calificó la evidencia de todos los resultados sobre la corteza de pino que evaluó como de certeza muy baja. Un metaanálisis en red de 2025 situó a Pycnogenol en un lugar alto para el deterioro cognitivo leve, pero advirtió sobre la heterogeneidad.',
    benefits: [
      'Menores marcadores de estrés oxidativo',
      'Atención y concentración (estudios preliminares no aleatorizados)',
      'Actividad antioxidante',
    ],
    sideEffects: [
      'En general bien tolerado, aunque el reporte de eventos adversos fue inconsistente entre ensayos (Cochrane 2020)',
      'Poco frecuente: molestias gastrointestinales leves',
      'Dolor de cabeza (poco común)',
      'Inmunosupresores: posible interacción, no confirmada por reportes clínicos; consulta a tu médico',
    ],
    humanEffects: [
      { effect: 'Atención y concentración', notes: 'Dos estudios no aleatorizados de un mismo grupo de autores (Belcaro 2014; Luzzi 2011) reportan mejoras; la revisión Cochrane independiente califica la evidencia sobre la corteza de pino como de certeza muy baja.' },
      { effect: 'Reducción del estrés oxidativo', notes: 'Los radicales libres en plasma bajaron un 30.4% (frente a +0.9% en los controles) a lo largo de 12 semanas en Belcaro 2014; la actividad antioxidante de las proantocianidinas está bien establecida desde el punto de vista mecanístico.' },
      { effect: 'Flujo sanguíneo cerebral', notes: 'Propuesto a través de la estimulación de la eNOS y la producción de óxido nítrico; no se volvió a verificar en nuestra revisión de 2026.' },
      { effect: 'Memoria', notes: 'Un estudio no aleatorizado en estudiantes (Luzzi 2011) reportó mejoras en la memoria, y un metaanálisis en red de 2025 situó a Pycnogenol en un lugar alto en el deterioro cognitivo leve, con una advertencia sobre la heterogeneidad de los ensayos.' },
    ],
    howToTake: {
      dosage: '100–200mg/día de extracto estandarizado (65-75% de proantocianidinas)',
      timing: 'Por la mañana con el desayuno. Se puede dividir en 2 dosis para una cobertura antioxidante sostenida.',
      withFood: 'Tómalo con comida para una mejor absorción y un menor riesgo gastrointestinal. No hace falta grasa, pero se recomienda una comida.',
      forms: 'La cápsula es lo habitual. Pycnogenol es un extracto de marca; es el extracto usado en los estudios que citamos (Belcaro 2014; Luzzi 2011). Los extractos genéricos de corteza de pino varían mucho en su contenido de proantocianidinas: revisa el porcentaje de estandarización.',
    },
    stacksWith: [
      { ingredient: 'Citicolina', reason: 'Ambos se estudian para la atención y ambos están en Performance Lab Mind; no citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Tirosina', reason: 'La corteza de pino se estudia para el flujo sanguíneo cerebral; la L-tirosina es un aminoácido precursor de la dopamina y la norepinefrina. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'DHA (Omega-3)', reason: 'La corteza de pino contiene proantocianidinas, antioxidantes polifenólicos; el DHA es el principal ácido graso omega-3 estructural del cerebro. No citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿Qué es Pycnogenol y vale la pena pagar más por él?', answer: 'Pycnogenol es un extracto patentado de corteza de pino marítimo francés (Pinus pinaster) estandarizado al 65-75% de proantocianidinas con un proceso de fabricación específico. Es el extracto usado en los estudios que citamos (Belcaro 2014; Luzzi 2011); no encontramos ningún ensayo que lo comparara con un extracto genérico de corteza de pino. Los extractos genéricos de corteza de pino pueden variar en su composición. Para coincidir con esa evidencia, elige Pycnogenol.' },
      { question: '¿Cómo se compara la corteza de pino marítimo con el Ginkgo Biloba?', answer: 'Ambos mejoran el flujo sanguíneo cerebral, pero por mecanismos distintos: el ginkgo inhibe el factor activador de plaquetas; la corteza de pino estimula el óxido nítrico. La corteza de pino tiene una actividad antioxidante más fuerte; el ginkgo tiene una base de evidencia más amplia en el deterioro cognitivo. Ningún ensayo ha probado la combinación, y el ginkgo aumenta el riesgo de sangrado con los anticoagulantes.' },
      { question: '¿Puedo tomar extracto de corteza de pino a largo plazo?', answer: 'Los ensayos agrupados duraron de 4 semanas a 6 meses, y la revisión Cochrane señala que los eventos adversos se reportaron de forma inconsistente, así que la ausencia de daños reportados no prueba la seguridad a largo plazo. No se ha probado ningún protocolo de ciclos. Consulta con tu médico si tomas inmunosupresores.' },
      { question: '¿Por qué la dosis de Performance Lab Mind es de solo 75mg?', answer: 'Performance Lab Mind usa 75mg de corteza de pino marítimo, por debajo de la dosis clínica de 100-200mg de esta página (el estudio Belcaro 2014 que citamos usó 150mg/día). Forma parte de una fórmula con varios ingredientes junto con citicolina y tirosina, pero sigue estando por debajo de la dosis respecto a la evidencia del ingrediente solo.' },
    ],
    sourceHashes: { name: 'c2199b3d437b', mechanism: 'e06bc0dd7b50', clinicalDose: '66d28fbbd521', timeToEffect: 'e076d346cfd5', studySummary: 'b45f461aeb9b', benefits: 'c9c04b39f7a9', sideEffects: '1a14f894c162', humanEffects: '03646df40705', howToTake: '0624c7dbaff3', stacksWith: '1a1eaf7af5ac', faqs: '15f318b56fd5' },
  },
  {
    slug: 'acetyl-l-carnitine',
    name: 'Acetyl-L-Carnitine (ALCAR)',
    mechanism: 'La acetil-L-carnitina (ALCAR) es una forma acetilada de la L-carnitina que atraviesa la barrera hematoencefálica con más eficacia que la L-carnitina simple. Actúa por tres mecanismos: (1) dona grupos acetilo para la síntesis de acetilcolina, lo que favorece la neurotransmisión colinérgica; (2) transporta ácidos grasos de cadena larga a las mitocondrias para la betaoxidación, lo que aporta energía celular a las neuronas; (3) favorece la integridad de la membrana mitocondrial y reduce el daño oxidativo en las neuronas que envejecen.',
    clinicalDose: '1500–3000mg/día (todos los ensayos positivos revisados usaron al menos 1.5g/día)',
    timeToEffect: 'Beneficio evidente a los 3 meses en los ensayos en DCL: los ensayos revisados más cortos duraron 3 meses',
    studySummary: 'Un metaanálisis de 2003 de ECA doble ciego (Montgomery et al.) encontró una ventaja modesta pero significativa de la ALCAR frente a placebo en el deterioro cognitivo leve y la enfermedad de Alzheimer leve con 1.5–3g/día, evidente a los 3 meses y creciente con el tiempo. Un metaanálisis de 2018 de 12 ECA (Veronese et al., n=791) encontró una gran reducción de los síntomas depresivos, comparable a la de los antidepresivos y con menos efectos adversos, más clara en adultos mayores. Un ECA de 2022 en adultos mayores prefrágiles (3g/día) mejoró el MMSE y la distancia caminada. Una revisión crítica de 2020 todavía describe su papel en la demencia como "en debate". No se encontró ningún ensayo en adultos jóvenes y sanos.',
    benefits: [
      'Cognición en el deterioro cognitivo leve y el Alzheimer leve (efecto modesto)',
      'Menos síntomas depresivos, sobre todo en adultos mayores',
      'Precursora de la acetilcolina',
    ],
    sideEffects: [
      'Trastorno bipolar: figura entre los agentes asociados con desencadenar episodios maníacos o hipomaníacos (evidencia a nivel de reportes de casos); evítala sin consejo psiquiátrico',
      'TDAH: calificada como "no respaldada" por las guías de nutracéuticos WFSBP/CANMAT de 2022; no la uses como tratamiento del TDAH',
      'Olor corporal a pescado en dosis altas (vía del TMAO)',
      'Molestias gastrointestinales',
      'Insomnio si se toma tarde',
      'Poco frecuente: mayor agitación en algunas personas',
    ],
    humanEffects: [
      { effect: 'Función cognitiva (DCL/envejecimiento)', notes: 'El metaanálisis de Montgomery 2003 (1.5–3g/día, 3–12 meses) encontró un efecto combinado modesto (TE≈0.2) en el DCL y el Alzheimer leve; un ECA de 1990 con 2g/día mejoró la memoria y la atención en personas mayores con deterioro leve.' },
      { effect: 'Energía mental y fatiga', notes: 'Un ECA de 2022 en adultos mayores prefrágiles (3g/día, 3 meses) mejoró el MMSE y la distancia caminada. No se encontró ningún ensayo en adultos jóvenes y sanos.' },
      { effect: 'Estado de ánimo y depresión', notes: 'Veronese 2018 (12 ECA, n=791): gran reducción combinada de los síntomas depresivos (DME −1.10, heterogeneidad alta), comparable a la de los antidepresivos y con menos efectos adversos; los análisis de subgrupos sugirieron que fue más eficaz en adultos mayores.' },
      { effect: 'Neuroprotección', notes: 'Una revisión crítica de 2020 dice que su papel en la demencia "todavía está en debate"; en un ensayo coreano de 2024, los brazos abiertos agrupados de donepezilo + ALCAR y donepezilo + ginkgo empeoraron en el MMSE, mientras que el donepezilo solo y el donepezilo + alfoscerato de colina mejoraron: la contribución propia de la ALCAR no puede aislarse del brazo de ginkgo agrupado.' },
    ],
    howToTake: {
      dosage: '1500–3000mg/día: el rango de dosis de los ensayos positivos; ningún ensayo positivo que revisamos usó menos de 1500mg/día',
      timing: 'Por la mañana o a primera hora de la tarde. La ALCAR tiene propiedades levemente estimulantes: evita tomarla por la noche para no alterar el sueño.',
      withFood: 'Se puede tomar con o sin comida. Las comidas no afectan significativamente la absorción.',
      forms: 'Cápsula o polvo. Se necesita específicamente la ALCAR (forma acetilada): la L-carnitina simple no atraviesa con eficacia la barrera hematoencefálica. Busca en la etiqueta "Acetyl-L-Carnitine" (acetil-L-carnitina) o "ALCAR", no "L-Carnitine" (L-carnitina) ni "L-Carnitine L-Tartrate" (L-tartrato de L-carnitina).',
    },
    stacksWith: [
      { ingredient: 'Alfa-GPC', reason: 'La ALCAR dona grupos acetilo para la síntesis de acetilcolina; la Alfa-GPC es un precursor de colina. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Citicolina', reason: 'La citicolina es un precursor de la acetilcolina y la fosfatidilcolina; la ALCAR dona grupos acetilo para la síntesis de acetilcolina. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Melena de León', reason: 'Ambos se estudian en el deterioro cognitivo leve; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: 'ALCAR frente a L-carnitina simple: ¿cuál es la diferencia?', answer: 'El grupo acetilo de la ALCAR le permite atravesar la barrera hematoencefálica y donar grupos acetilo para la síntesis de acetilcolina. La L-carnitina simple actúa principalmente en los músculos y los tejidos periféricos para el metabolismo de las grasas. Para obtener beneficios cerebrales se necesita la ALCAR: la L-carnitina simple no producirá efectos cognitivos.' },
      { question: '¿La ALCAR eleva los niveles de TMAO?', answer: 'Sí: las bacterias intestinales metabolizan la carnitina (incluida la ALCAR) en trimetilamina, que el hígado convierte en TMAO. Un TMAO elevado se asocia con riesgo cardiovascular en estudios observacionales. La relevancia clínica con las dosis estándar de suplementos de ALCAR (1.5–3g/día) está en debate. Si ya tienes problemas cardiovasculares, coméntalo con tu médico.' },
      { question: '¿La ALCAR es útil para adultos jóvenes y sanos?', answer: 'No está demostrado. La evidencia es en adultos mayores con deterioro cognitivo o síntomas depresivos; nuestra revisión de 2026 no encontró ningún ensayo en adultos jóvenes y sanos. No es un nootrópico de primera línea para personas jóvenes y sanas: la L-teanina + cafeína tiene evidencia aguda más sólida. Tampoco está respaldada para el TDAH.' },
      { question: '¿La ALCAR puede ayudar con la niebla mental?', answer: 'Posiblemente. La ALCAR favorece la producción de energía mitocondrial en las neuronas, lo que podría atender la niebla mental causada por una insuficiencia metabólica. La evidencia controlada específicamente sobre la "niebla mental" en adultos sanos es limitada. Si la niebla mental persiste, investiga las causas de fondo (sueño, tiroides, niveles de hierro) en lugar de depender solo de los suplementos.' },
    ],
    sourceHashes: { name: 'd99068d3b8f8', mechanism: 'e34b94922c67', clinicalDose: '313892b79a45', timeToEffect: 'e63692f4f848', studySummary: 'e35d97a8c14a', benefits: 'dd9e694494a2', sideEffects: 'dffeae0a3643', humanEffects: '05561ce27348', howToTake: '42313cd550a7', stacksWith: '094b7486bad7', faqs: 'e413144edd77' },
  },
  {
    slug: 'lutemax-2020',
    name: 'Lutemax 2020',
    mechanism: 'Lutemax 2020 es un extracto patentado de flor de tagetes (marigold) que aporta luteína y dos isómeros de zeaxantina (RR- y RS-meso-zeaxantina) en una proporción de aproximadamente 5:1. Estos carotenoides se acumulan en la mácula del ojo y en el tejido cerebral, donde filtran la luz azul de alta energía y neutralizan las especies reactivas de oxígeno. La suplementación eleva la densidad óptica del pigmento macular (MPOD), un biomarcador correlacionado con la función visual y la velocidad de procesamiento cognitivo.',
    clinicalDose: '12–27mg/día de luteína + zeaxantina en total en los ensayos (predominio de luteína, aproximadamente 5:1)',
    timeToEffect: 'Los ensayos midieron los cambios en la MPOD y en la cognición después de 6–12 meses',
    studySummary: 'De los ensayos que revisamos, dos nombran Lutemax 2020 como su material, ambos realizados o financiados por su fabricante, OmniActive: un ensayo sobre el tono de la piel y un ensayo sobre el uso de pantallas (más abajo); la evidencia cognitiva proviene de ensayos con luteína y zeaxantina que no nombran Lutemax 2020, uno de los cuales fue financiado y abastecido por OmniActive (Stringham 2019). En adultos jóvenes y sanos, 12mg/día durante 12 meses elevaron la MPOD y mejoraron la memoria visual (Renzi-Hammond 2017, con coautores del personal de Abbott Nutrition y material de DSM, un competidor de Lutemax); 22mg/día durante 12 meses mejoraron la memoria en adultos con pigmento macular bajo (Power 2018, financiado por el Consejo Europeo de Investigación); y 13–27mg/día durante 6 meses mejoraron la memoria, la atención y la velocidad de procesamiento (Stringham 2019, financiado por OmniActive, que suministró los suplementos). Un metaanálisis de 2023 encontró que las xantofilas aceleran la recuperación tras el fotoestrés (deslumbramiento), y dos ensayos financiados por OmniActive también reportaron una mejor recuperación tras el deslumbramiento y el fotoestrés frente a placebo: el ensayo sobre el uso de pantallas descrito más abajo y un ensayo de 12 meses en 59 adultos jóvenes (Stringham 2016). El ensayo del fabricante sobre la piel (Juturu 2016; dos de sus tres autores eran empleados de OmniActive, que fabrica Lutemax) evaluó el tono de la piel, no la cognición. En los síntomas oculares relacionados con las pantallas, los dos ensayos no coinciden: en 48 estudiantes con 6 o más horas diarias frente a pantallas, 24mg/día de la formulación Lutemax 2020 durante 6 meses redujeron la tensión ocular, la fatiga ocular y la frecuencia de dolores de cabeza autoevaluadas y mejoraron la calidad del sueño frente a placebo (Stringham 2017; financiado por OmniActive, y el primer autor es consultor de la empresa), aunque un informe aparte de personal de OmniActive sobre un ensayo del mismo diseño con 48 personas, 24mg/día y 6 meses encontró que la diferencia en el sueño fue significativa a los 3 meses, pero no a los 6 meses (Culver 2018, no indexado en PubMed); en 70 usuarios intensivos de pantallas, un producto distinto de luteína/zeaxantina (Lute-gen, 10mg de luteína + 2mg de isómeros de zeaxantina; financiado por su proveedor, Bio-gen Extracts) mejoró la producción de lágrimas, la estabilidad de la película lagrimal y la recuperación tras el fotoestrés a lo largo de 6 meses, pero la tensión ocular, la fatiga visual, el sueño y la atención autoevaluados no difirieron de placebo (Lopresti y Smith 2025).',
    benefits: [
      'Apoyo al pigmento macular (MPOD)',
      'Recuperación más rápida tras el deslumbramiento (metaanálisis de xantofilas)',
      'Memoria y velocidad de procesamiento en ensayos con luteína/zeaxantina (no específicos de Lutemax)',
    ],
    sideEffects: [
      'En general muy bien tolerado: ningún evento adverso grave en ninguno de los ensayos revisados',
      'La carotenodermia leve (tono amarillento de la piel) es un efecto de clase conocido en dosis muy altas, aunque no se reportó en los ensayos revisados',
    ],
    humanEffects: [
      { effect: 'Memoria y velocidad de procesamiento', notes: 'Tres ECA con luteína/zeaxantina (12–27mg/día, 6–12 meses) mejoraron la memoria visual o compuesta, la atención o la velocidad de procesamiento; ninguno nombra Lutemax 2020 como material, aunque uno (Stringham 2019) fue financiado y abastecido por OmniActive, y la dosis y la mezcla de isómeros difieren de este producto.' },
      { effect: 'Recuperación tras el deslumbramiento', notes: 'Un metaanálisis de 2023 encontró que las xantofilas acortaron la recuperación tras el fotoestrés en 2.35 segundos, y un metaanálisis de 2020 relaciona una MPOD más alta con una mejor recuperación tras el deslumbramiento (correlacional). En dos ensayos financiados por OmniActive, el deslumbramiento incapacitante y la recuperación tras el fotoestrés mejoraron frente a placebo: el ensayo de Lutemax 2020 sobre el uso de pantallas (Stringham 2017; 35 con producto activo frente a 13 con placebo) y un ensayo de 12 meses con 12mg o 24mg/día que figura en el registro de ensayos del estudio de 12 meses de OmniActive con Lutemax 2020 (ISRCTN17604865) (Stringham 2016; 49 con producto activo frente a 10 con placebo); en un ensayo con Lute-gen, la recuperación tras el fotoestrés fue más rápida, pero no de forma significativa en el análisis por protocolo (Lopresti y Smith 2025). Los metaanálisis abarcan las xantofilas en general.' },
      { effect: 'Síntomas oculares relacionados con las pantallas', notes: 'Dos ECA de 6 meses en usuarios intensivos de pantallas no coinciden. El ensayo financiado por OmniActive con la formulación Lutemax 2020 (24mg/día, 48 estudiantes) reportó menos tensión ocular, fatiga ocular y dolor de cabeza autoevaluados que con placebo; un ensayo financiado por Bio-gen Extracts con Lute-gen (12mg/día, 70 adultos) mejoró la producción de lágrimas, la estabilidad de la película lagrimal y la recuperación tras el fotoestrés, pero la tensión ocular y la fatiga visual autoevaluadas no difirieron de placebo.' },
    ],
    howToTake: {
      dosage: '12–27mg/día de luteína + zeaxantina en total (el rango usado en los ensayos)',
      timing: 'Con una comida: los carotenoides son liposolubles y necesitan grasa de la dieta para absorberse.',
      withFood: 'Imprescindible. Tómalo con una comida que contenga grasa.',
      forms: 'Cápsula (preferiblemente blanda, por la matriz lipídica). Lutemax 2020 es un extracto de luteína/zeaxantina de marca; los ensayos cognitivos usaron otros materiales de luteína/zeaxantina. Los suplementos genéricos de luteína/zeaxantina pueden diferir en la proporción de isómeros y en la biodisponibilidad.',
    },
    stacksWith: [
      { ingredient: 'L-Teanina', reason: 'La luteína y la zeaxantina favorecen el pigmento macular; la L-teanina favorece una atención tranquila. Una combinación común para el trabajo prolongado frente a pantallas, aunque no se ha probado.' },
      { ingredient: 'DHA (Omega-3)', reason: 'La luteína y la zeaxantina favorecen el pigmento macular; el DHA es el principal ácido graso omega-3 estructural del cerebro. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Citicolina', reason: 'La citicolina aporta colina para la acetilcolina y las membranas; la luteína y la zeaxantina favorecen el pigmento macular. Vías distintas, no probadas juntas.' },
    ],
    faqs: [
      { question: '¿Lutemax 2020 es un nootrópico?', answer: 'No en el sentido tradicional. No modula directamente los neurotransmisores. La luteína y la zeaxantina se acumulan en el ojo y en el cerebro, y los ensayos con luteína/zeaxantina genérica encontraron pequeñas mejoras en la memoria y la velocidad de procesamiento después de 6–12 meses, pero no encontramos ningún ensayo cognitivo que nombre Lutemax 2020 como su material (el ensayo de 2019 que encontró mejoras en la velocidad de procesamiento fue financiado y abastecido por OmniActive, pero no pudimos confirmar qué producto usó). Los dos ensayos que encontramos que lo nombran, ambos realizados o financiados por su fabricante, OmniActive, midieron el tono de la piel (Juturu 2016) y los síntomas oculares relacionados con las pantallas, el sueño y el rendimiento visual (Stringham 2017), no la cognición.' },
      { question: '¿Puedo obtener suficiente luteína con la dieta?', answer: 'La luteína se encuentra en la yema de huevo, la espinaca, la col rizada y el maíz. La mayoría de las dietas occidentales solo aportan 1-2mg/día, muy por debajo de los 12–27mg/día usados en los ensayos. La suplementación es la vía práctica para alcanzar niveles terapéuticos.' },
      { question: '¿En qué se diferencia Lutemax 2020 de la luteína genérica?', answer: 'Lutemax 2020 aporta ambos isómeros de zeaxantina (RR- y RS-meso-zeaxantina) además de luteína, en una proporción de luteína a zeaxantina de aproximadamente 5:1. Los suplementos genéricos de luteína suelen aportar solo luteína o una sola forma de zeaxantina. Ningún ensayo ha comparado directamente Lutemax 2020 con la luteína genérica.' },
      { question: '¿Reduce la tensión ocular causada por las pantallas?', answer: 'La evidencia es mixta. En un ensayo de 6 meses en 48 estudiantes con 6 o más horas diarias frente a pantallas, 24mg/día de la formulación Lutemax 2020 redujeron la tensión ocular, la fatiga ocular y la frecuencia de dolores de cabeza autoevaluadas frente a placebo (Stringham 2017, financiado por OmniActive, que fabrica Lutemax, y cuyo primer autor es consultor de la empresa). En un ensayo más grande de 6 meses en 70 usuarios intensivos de pantallas, un producto distinto (Lute-gen, 10mg de luteína + 2mg de isómeros de zeaxantina; financiado por su proveedor, Bio-gen Extracts) mejoró las medidas objetivas de ojo seco (producción de lágrimas, estabilidad de la película lagrimal) y la recuperación tras el fotoestrés, pero la tensión ocular, la fatiga visual, el sueño y la atención autoevaluados no difirieron de placebo (Lopresti y Smith 2025). Los otros efectos medidos son un pigmento macular más alto y una recuperación más rápida tras el deslumbramiento, con cambios en la MPOD y en la cognición evaluados después de 6–12 meses.' },
    ],
    sourceHashes: { name: 'c25724f67f30', mechanism: '1779dc7d7629', clinicalDose: '36b74abcac69', timeToEffect: 'a0a8bac5a8a5', studySummary: 'bae1f8026d2a', benefits: 'b5ce163742f4', sideEffects: 'ec02b56ec3df', humanEffects: '6fd99d578040', howToTake: '45ff1ff85055', stacksWith: 'e4fda6ab9775', faqs: '4446e125bde6' },
  },
  {
    slug: 'oat-straw',
    name: 'Oat Straw Extract',
    mechanism: 'Los ensayos en humanos que citamos probaron extractos de marca de hierba de avena verde (Neuravena en todos menos uno), no paja de avena, y los autores del ensayo de cognición de 12 semanas consideran desconocido su mecanismo (Wong 2012). En ensayos de laboratorio, el extracto Neuravena inhibió la monoaminooxidasa B (MAO-B) y la fosfodiesterasa-4 (PDE4); ningún estudio que encontramos midió el AMP cíclico ni la señalización de la dopamina en las neuronas tras tomarlo. Las avenantramidas aumentaron la producción de óxido nítrico en células cultivadas de músculo liso de aorta humana, pero no se sabe cuánta cantidad de ellas contiene el extracto. En un ensayo cruzado de 12 semanas con 37 adultos sanos mayores de 60 años, 1500mg al día aumentaron la reactividad cerebrovascular un 42% frente al placebo (Wong 2013, PubMed 23221935).',
    clinicalDose: '430–1600mg/día en los ensayos; 800mg o menos podría ser lo óptimo: las dosis más altas rindieron menos',
    timeToEffect: 'Efectos agudos en pocas horas en ensayos de dosis única; efectos a las 4 semanas en un ensayo y ninguno en un ensayo de 12 semanas',
    studySummary: 'Cuatro ECA pequeños, todos con participación del fabricante: un ensayo de 2011 (Berry et al.) en personas mayores con una cognición inferior al promedio encontró que una sola dosis de 1600mg redujo los errores en la prueba Stroop, pero 2400mg no fueron mejores que el placebo; un ensayo de 2012 del mismo grupo encontró que 1500mg/día durante 12 semanas no tuvieron efecto sobre ninguna medida cognitiva en adultos mayores sanos (material suministrado por Frutarom); un ensayo de 2015 (Kennedy et al., con dos empleados de Frutarom como coautores) encontró que 800mg mejoraron la velocidad, el recuerdo diferido y la función ejecutiva en adultos de 40–65 años con quejas de memoria, y concluyó que la dosis óptima es de 800mg o menos; y un ensayo de 2020 (Kennedy et al., con dos empleados de Anklam Extrakt como coautores) encontró que 430–1290mg mejoraron la memoria de trabajo y la multitarea a lo largo de 4 semanas, sin efecto sobre el estado de ánimo.',
    benefits: [
      'Mejoras agudas de la atención y la función ejecutiva en ensayos pequeños',
      'Memoria de trabajo y multitarea a lo largo de 4 semanas (un ensayo)',
    ],
    sideEffects: [
      'En general bien tolerado: ningún evento adverso grave ni cambios en la presión arterial en los ensayos revisados',
      'Molestias gastrointestinales leves poco frecuentes',
      'La avena suele contaminarse con gluten durante el procesamiento: elige un producto certificado sin gluten si tienes enfermedad celíaca',
    ],
    humanEffects: [
      { effect: 'Atención y concentración', notes: 'Mejoras agudas con 800–1600mg (Berry 2011 en personas mayores con una cognición inferior al promedio; Kennedy 2015) y mejoras a las 4 semanas con 430–1290mg (Kennedy 2020), pero un ensayo de 12 semanas con 1500mg/día no encontró efecto, y 2400mg fallaron donde 1600mg funcionaron.' },
      { effect: 'Respuesta al estrés', notes: 'Kennedy 2020: la dosis más alta (1290mg) redujo un marcador fisiológico de estrés (actividad electrodérmica) tras 4 semanas, pero no hubo efecto sobre el estado de ánimo ni la ansiedad autoinformados con ninguna dosis.' },
    ],
    howToTake: {
      dosage: '430–1600mg/día de extracto de avena verde; la relación dosis-respuesta no es monótona, y un ensayo situó la dosis óptima en 800mg o menos',
      timing: 'Por la mañana o antes de tareas cognitivas. Los ensayos de dosis única evaluaron los efectos durante las horas siguientes.',
      withFood: 'Se puede tomar con o sin comida. No hay una diferencia significativa en la absorción.',
      forms: 'Cápsula o polvo. Busca un extracto de "avena verde" ("green oat") o de "Avena sativa" estandarizado en avenantramidas. El té de paja de avena sin procesar no es equivalente: la concentración es demasiado baja.',
    },
    stacksWith: [
      { ingredient: 'Alfa-GPC', reason: 'La paja de avena se estudia para la atención; la Alfa-GPC es un precursor de colina. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Tirosina', reason: 'La L-tirosina es un precursor de la dopamina. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'Bacopa Monnieri', reason: 'La paja de avena se estudia para la atención y la Bacopa para la memoria; no citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿La paja de avena es lo mismo que la avena en hojuelas?', answer: 'No. El extracto de paja de avena proviene de las partes aéreas verdes e inmaduras de Avena sativa, cosechadas antes de que madure el grano. Los compuestos activos (avenantramidas, saponinas) se concentran en la paja verde, no en el grano. Comer avena en hojuelas no aporta efectos nootrópicos.' },
      { question: '¿Una dosis más alta es mejor?', answer: 'No en los ensayos. En Berry 2011, 1600mg redujeron los errores en la prueba Stroop, pero 2400mg no fueron mejores que el placebo, y Kennedy 2015 concluyó que la dosis óptima era de 800mg o menos. Las dosis de 430–1290mg funcionaron a lo largo de 4 semanas en Kennedy 2020.' },
      { question: '¿La paja de avena contiene gluten?', answer: 'La avena técnicamente no contiene gluten, pero es común que se contamine con trigo durante el procesamiento. Si tienes enfermedad celíaca o una sensibilidad grave al gluten, verifica que el suplemento esté certificado sin gluten o evítalo por completo.' },
      { question: '¿Cómo se compara con la cafeína para la concentración?', answer: 'No es un estimulante, y ningún ensayo ha comparado ambos. Los ensayos con extracto de avena encontraron pequeñas mejoras en la atención y la memoria de trabajo sin los efectos secundarios típicos de los estimulantes, pero la base de evidencia son cuatro ensayos pequeños vinculados al fabricante, mucho más escasa que la de la cafeína.' },
    ],
    sourceHashes: { name: '6b1648c7567a', mechanism: '2ce6cd7285c6', clinicalDose: '562a815f6c9e', timeToEffect: '7665b28811dc', studySummary: '281243399e72', benefits: '1bf8d10e5ae6', sideEffects: 'e29abc5d1bcf', humanEffects: '7145720d1265', howToTake: '2c1fc1026907', stacksWith: '02ab624a5eb4', faqs: '228b5c6beb9b' },
  },
  {
    slug: 'zynamite',
    name: 'Zynamite (Mangifera indica)',
    mechanism: 'Zynamite es un extracto patentado de Mangifera indica (hoja de mango) estandarizado a >60% de mangiferina. La mangiferina es un polifenol potente que inhibe la catecol-O-metiltransferasa (COMT) y frena la degradación de la dopamina y la norepinefrina en la corteza prefrontal. Esto prolonga la duración activa de las catecolaminas sin aumentar su producción, un mecanismo único y distinto de los enfoques que cargan precursores (L-tirosina) o que impulsan la síntesis (cafeína). Además, la mangiferina tiene propiedades antiinflamatorias y antioxidantes.',
    clinicalDose: '140–300mg/día (estandarizado a >60% de mangiferina); 300mg no mostraron ningún beneficio cognitivo en el ensayo más grande',
    timeToEffect: 'Los ensayos de dosis única evaluaron los efectos de los 30 minutos a las 5 horas; el más grande no encontró ningún beneficio cognitivo',
    studySummary: 'El ensayo más grande y más independiente (Dodd et al., 2024, n=114, Northumbria University con un coautor de PepsiCo) administró una sola dosis de 300mg de extracto de hoja de mango y no encontró ningún beneficio cognitivo: los participantes cometieron más errores de resta que con placebo. Un piloto anterior (López-Ríos et al., 2020, n=16, sus cuatro autores empleados de Nektium) usó 500mg, no 300mg, y encontró solo una señal marginal en el tiempo de reacción. Dos ensayos de sprint (2018, 2019; con autores principales vinculados a Nektium, el fabricante) combinaron 140mg con quercetina o luteolina y mejoraron la potencia en sprints, pero no midieron ningún resultado cognitivo. Tres de los cuatro ensayos son de autores del fabricante.',
    benefits: [
      'Potencia en sprints combinado con quercetina o luteolina (ensayos de autores del fabricante)',
      'Inhibición de la COMT (mecanismo)',
    ],
    sideEffects: [
      'En general bien tolerado: ningún evento adverso grave en los cuatro ensayos revisados',
      'Molestias gastrointestinales leves poco frecuentes',
      'Datos de seguridad a largo plazo limitados',
      'Inhibidores de la MAO: solo una interacción teórica; la mangiferina inhibe la COMT y no la MAO, y no se encontraron reportes clínicos',
    ],
    humanEffects: [
      { effect: 'Tiempo de reacción', notes: 'Con la dosis de 300mg, Dodd 2024 (n=114) no encontró ningún beneficio cognitivo y sí más errores de resta. El piloto positivo (López-Ríos 2020, n=16, de autores del fabricante) usó 500mg y alcanzó significación solo en una medida secundaria de cambio porcentual (p=0.049).' },
      { effect: 'Potencia en sprints', notes: 'La potencia máxima subió un 2.8–7% en dos ensayos de sprint de autores del fabricante cuando se combinaron 140mg con quercetina o luteolina; no se aplicó ninguna prueba cognitiva, así que no demuestran beneficios cognitivos bajo fatiga.' },
    ],
    howToTake: {
      dosage: '140–300mg/día: ten en cuenta que el único ensayo que probó 300mg solos no encontró ningún beneficio cognitivo',
      timing: 'Por la mañana o 1 hora antes de tareas cognitivas o físicas exigentes.',
      withFood: 'Se puede tomar con o sin comida.',
      forms: 'Cápsula. Zynamite es un extracto de hoja de mango de marca estandarizado a >60% de mangiferina; los productos genéricos de hoja de mango pueden contener mucha menos mangiferina.',
    },
    stacksWith: [
      { ingredient: 'Cafeína', reason: 'La cafeína aumenta la liberación de catecolaminas; se propone que Zynamite frene su degradación al inhibir la COMT. La combinación no se ha probado en un ensayo cognitivo.' },
      { ingredient: 'L-Tirosina', reason: 'La L-tirosina es un precursor de la dopamina; se propone que Zynamite frene la degradación de la dopamina al inhibir la COMT. No citamos ningún ensayo de esta combinación.' },
      { ingredient: 'L-Teanina', reason: 'La L-teanina se combina a menudo con estimulantes, aunque en un ensayo controlado con cafeína (Rogers 2008) no redujo significativamente el nerviosismo, y no citamos ningún ensayo de L-teanina con Zynamite.' },
    ],
    faqs: [
      { question: '¿Zynamite es simplemente extracto de hoja de mango?', answer: 'Zynamite es un extracto patentado específico de Mangifera indica estandarizado a >60% de mangiferina. Los suplementos genéricos de hoja de mango pueden contener mucha menos mangiferina y no son equivalentes. Los ensayos de sprint nombran Zynamite; los ensayos cognitivos usaron extracto de hoja de mango estandarizado al menos al 60% de mangiferina.' },
      { question: '¿La evidencia es independiente o financiada por el fabricante?', answer: 'Tres de los cuatro ensayos en humanos fueron escritos por Nektium, el fabricante. El único ensayo dirigido por un grupo académico independiente (Dodd 2024, n=114) probó la dosis de 300mg y no encontró ningún beneficio cognitivo, con más errores de resta que con placebo.' },
      { question: '¿Puedo tomar Zynamite con cafeína?', answer: 'Ningún ensayo ha probado Zynamite con cafeína: los ensayos deportivos lo combinaron con quercetina o luteolina. Si los combinas, vigila tu carga total de estimulantes.' },
    ],
    sourceHashes: { name: 'ef4f90c0bd65', mechanism: '5da192f070fa', clinicalDose: '978e605c0a78', timeToEffect: '62e647b3127b', studySummary: '6c1432f48570', benefits: 'a637a6eb2c24', sideEffects: '923d54ca519b', humanEffects: 'fb6ac77dc2a6', howToTake: '0e3ea4807b59', stacksWith: '0de0fc28f29a', faqs: '1968113d3fc2' },
  },
  {
    slug: 'dynamine',
    name: 'Dynamine (Methylliberine)',
    mechanism: 'Dynamine (metilliberina) es un alcaloide purínico presente en las hojas del té kucha, estructuralmente relacionado con la cafeína y la teacrina. Se describe que bloquea los receptores de adenosina (como la cafeína) e inhibe la fosfodiesterasa. En un ensayo de 4 semanas con 100–150mg/día no produjo cambios clínicamente significativos en la frecuencia cardíaca, la presión arterial ni los biomarcadores sanguíneos. Ningún estudio ha medido la tolerancia.',
    clinicalDose: '100–150mg/día (150mg es la dosis más alta probada en humanos; 200mg nunca se han probado)',
    timeToEffect: 'Efectos subjetivos medidos 1–3 horas después de la dosis; la velocidad de inicio no se ha probado directamente',
    studySummary: 'Solo tres ECA en humanos han probado la metilliberina. El único que midió la cognición con metilliberina sola (La Monica et al., 2023, n=25, 100mg/día) encontró mejor concentración, motivación, estado de ánimo y energía autoevaluados, pero un efecto insignificante en las pruebas cognitivas objetivas (Stroop, Trail Making B). Un ensayo de seguridad de 4 semanas (VanDusseldorp et al., 2020, n=125, 100–150mg/día) no encontró cambios cardiovasculares ni sanguíneos clínicamente significativos; no evaluó la cognición. Un tercer ensayo (Cintineo 2022) la probó solo dentro de una combinación de cafeína + teacrina. Ambos ensayos específicos de metilliberina fueron financiados total o parcialmente por Compound Solutions, que vende Dynamine, y un coautor de La Monica tiene patentes sobre la metilliberina.',
    benefits: [
      'Mejor energía, estado de ánimo y motivación autoevaluados (un ECA pequeño)',
      'Ningún cambio clínicamente significativo en la frecuencia cardíaca ni en la presión arterial a lo largo de 4 semanas con 100–150mg',
    ],
    sideEffects: [
      'Datos de seguridad limitados: tres ECA en humanos, y ambos ensayos específicos de metilliberina financiados por el fabricante',
      'Cognición objetiva: ningún efecto medible en las pruebas Stroop o Trail Making en el único ensayo que la evaluó',
      'Es posible que aparezcan molestias gastrointestinales leves',
      'Posible interacción con la cafeína (estimulación aditiva)',
      'No se recomienda durante el embarazo (por precaución: no hay datos en el embarazo)',
    ],
    humanEffects: [
      { effect: 'Energía subjetiva', notes: 'La Monica 2023 (n=25, 100mg/día durante 3 días): mayor energía y energía sostenida autoevaluadas frente a placebo durante las 3 horas posteriores a la dosis.' },
      { effect: 'Concentración y motivación', notes: 'La concentración y la motivación autoevaluadas mejoraron, pero las pruebas objetivas (Stroop, Trail Making B) del mismo ensayo mostraron un efecto insignificante sobre la función cognitiva.' },
      { effect: 'Seguridad cardiovascular', notes: 'VanDusseldorp 2020 (n=125, 4 semanas): ningún cambio clínicamente significativo en la frecuencia cardíaca, la presión arterial, el QTc ni los biomarcadores sanguíneos con 100–150mg/día, sola o con teacrina.' },
    ],
    howToTake: {
      dosage: '100–150mg/día: ningún ensayo en humanos ha probado más de 150mg',
      timing: 'Según se necesite, antes de las tareas. El ensayo midió los efectos durante las 3 horas posteriores a la dosis; los efectos sobre el sueño no se han estudiado.',
      withFood: 'Se puede tomar con o sin comida.',
      forms: 'Cápsula. Dynamine es un ingrediente de marca registrada de Compound Solutions. No está disponible como producto de consumo independiente: solo se encuentra en stacks preformulados como Thesis.',
    },
    stacksWith: [
      { ingredient: 'Cafeína', reason: 'Una combinación común en stacks preformulados. En personal táctico, 150mg de cafeína + 100mg de metilliberina + 50mg de teacrina igualaron a 300mg de cafeína en el tiempo de reacción de vigilancia, con un menor aumento de la presión arterial diastólica (Cintineo 2022), pero eso prueba la combinación, no Dynamine sola.' },
      { ingredient: 'L-Teanina', reason: 'La L-teanina se combina con frecuencia con estimulantes para lograr una concentración más tranquila, aunque en un ensayo controlado con cafeína no redujo significativamente el nerviosismo, y la combinación con Dynamine no se ha probado.' },
      { ingredient: 'Zynamite', reason: 'Se describe que Dynamine bloquea los receptores de adenosina; se propone que Zynamite frene la degradación de la dopamina al inhibir la COMT. No citamos ningún ensayo de esta combinación.' },
    ],
    faqs: [
      { question: '¿En qué se diferencia Dynamine de la cafeína?', answer: 'Es un alcaloide purínico relacionado, pero su base de evidencia es mucho más escasa: tres pequeños ECA en humanos frente a décadas de investigación sobre la cafeína. En un ensayo de 4 semanas con 100–150mg/día no causó cambios clínicamente significativos en la frecuencia cardíaca ni en la presión arterial, y en el único ensayo cognitivo mejoró la energía y el estado de ánimo autoevaluados, pero no el desempeño en pruebas objetivas. Ningún ensayo ha comparado directamente con la cafeína su inicio, su duración ni sus efectos sobre el sueño.' },
      { question: '¿Dynamine genera tolerancia como la cafeína?', answer: 'Se desconoce. Ningún estudio ha medido la tolerancia a la metilliberina; el ensayo de 4 semanas midió marcadores de seguridad, no si los efectos se desvanecen. Las afirmaciones de "tolerancia mínima" no están respaldadas por ningún ensayo publicado.' },
      { question: '¿Puedo comprar Dynamine por sí sola?', answer: 'No con facilidad. Dynamine (metilliberina) es un ingrediente de marca registrada de Compound Solutions y está disponible principalmente en stacks preformulados (por ejemplo, los nootrópicos Thesis). Las cápsulas de Dynamine sola son poco comunes en el mercado de consumo.' },
      { question: '¿Es seguro combinar Dynamine con cafeína?', answer: 'Sí: es una combinación común en los suplementos de rendimiento. Como ambas bloquean la adenosina, los efectos estimulantes son aditivos. Mantén moderada la ingesta total combinada de cafeína + Dynamine y vigila la sobreestimulación (ansiedad, inquietud). Empieza con dosis bajas de cada una.' },
    ],
    sourceHashes: { name: 'e48fda00ef8d', mechanism: '5e6a311adc71', clinicalDose: '12e219d75b94', timeToEffect: '55b39d40e6d4', studySummary: 'b09e75929146', benefits: 'dbb956a703a4', sideEffects: '5614cf96fe67', humanEffects: '2a62efce0405', howToTake: '04164fd4c7bc', stacksWith: '28675a60ad39', faqs: 'b9da36dadcd2' },
  },
  {
    slug: 'longvida-curcumin',
    name: 'Curcumin (Longvida)',
    mechanism: 'Longvida es la formulación de curcumina en partículas lipídicas sólidas (SLCP), con marca registrada de Verdure Sciences; la curcumina es el principal compuesto activo de la cúrcuma (Curcuma longa). Una dosis de 400mg de Longvida aporta unos 80mg de curcumina, así que las dosis expresadas en mg de Longvida y en mg de curcumina difieren unas cinco veces. En estudios preclínicos, la curcumina tiene propiedades que podrían actuar sobre procesos implicados en el deterioro cognitivo asociado a la edad, pero esos beneficios no se habían establecido en humanos cuando comenzaron los ensayos con Longvida; los ensayos midieron resultados cognitivos y del estado de ánimo, no cómo podrían producirse.',
    clinicalDose: '400mg/día de Longvida (unos 80mg de curcumina) en los dos ensayos positivos; dos ensayos con 2000mg/día no encontraron ningún beneficio cognitivo',
    timeToEffect: 'Mejoras en la atención y la memoria de trabajo 1 hora después de una sola dosis en un ensayo; efectos sobre la memoria de trabajo y la fatiga a las 4 y 12 semanas de uso diario',
    studySummary: 'Cuatro ensayos aleatorizados y controlados con placebo han probado Longvida en la cognición. Dos del mismo grupo de investigación fueron positivos con 400mg/día: en 60 adultos sanos de 60–85 años (Cox et al., 2015), la atención sostenida y la memoria de trabajo mejoraron 1 hora después de una sola dosis, y la memoria de trabajo y el estado de ánimo después de 4 semanas; en 80 adultos de 50–80 años (Cox et al., 2020, financiado por Verdure Sciences, el fabricante de Longvida), la memoria de trabajo fue mejor a las 12 semanas y la fatiga menor a las 4 y 12 semanas. Dos ensayos financiados por los Institutos Nacionales de Salud de EE. UU., con cápsulas suministradas por Verdure Sciences, administraron 2000mg/día y no encontraron ningún beneficio cognitivo: 12 semanas en 39 adultos sanos de 45–74 años (Santos-Parker et al., 2018) y 12 meses en 88 adultos con enfermedad renal crónica (Gimblet et al., 2024). Ningún grupo independiente ha repetido los resultados positivos.',
    benefits: [
      'Mejor memoria de trabajo en adultos mayores sanos con 400mg/día (dos ensayos de un mismo grupo de investigación)',
      'Menor fatiga a las 4 y 12 semanas (un ensayo)',
      'Mejor atención y memoria de trabajo 1 hora después de una sola dosis (un ensayo)',
    ],
    sideEffects: [
      'En un ensayo, la glucosa en sangre en ayunas fue ligeramente más alta que con placebo tras 12 semanas (no en el rango de la diabetes); el efecto en personas con diabetes no se ha probado',
      'En un ensayo de 12 meses con 2000mg/día, el dolor abdominal fue más frecuente que con placebo (13% frente a 5%, sin significación estadística); ningún evento adverso grave se atribuyó a la curcumina',
      'Los suplementos de cúrcuma y curcumina (no Longvida en concreto) se han relacionado con casos poco frecuentes de lesión hepática aguda',
      'En un estudio de laboratorio con células hepáticas de cerdo, la curcumina modificó la actividad de las enzimas que eliminan la warfarina; consulta a un médico antes de combinar curcumina con un anticoagulante',
    ],
    humanEffects: [
      { effect: 'Memoria de trabajo', notes: 'Mejor con 400mg/día después de 4 semanas (Cox 2015) y 12 semanas (Cox 2020); ningún cambio con 2000mg/día a lo largo de 12 semanas en adultos sanos (Santos-Parker 2018) ni de 12 meses en la enfermedad renal crónica (Gimblet 2024).' },
      { effect: 'Fatiga y estado de ánimo', notes: 'Menor fatiga a las 4 semanas (Cox 2015) y a las 4 y 12 semanas (Cox 2020), ambos con 400mg/día; las demás mejoras del estado de ánimo del ensayo de 2020 se observaron solo a las 4 semanas.' },
      { effect: 'Atención aguda', notes: 'La atención sostenida y la memoria de trabajo fueron mejores 1 hora después de una sola dosis de 400mg en 60 adultos de 60–85 años (Cox 2015); ningún otro ensayo evaluó efectos agudos.' },
    ],
    howToTake: {
      dosage: '400mg/día de Longvida (unos 80mg de curcumina): la dosis de ambos ensayos positivos; se probaron 2000mg/día y no se encontró ningún beneficio cognitivo',
      timing: 'Una vez al día. Los ensayos midieron los efectos 1–3 horas después de una dosis y a lo largo de 4–12 semanas de uso diario.',
      withFood: 'Los ensayos no fijan una regla; sigue la etiqueta del producto.',
      forms: 'Cápsula. Longvida es un ingrediente de marca registrada de Verdure Sciences; las etiquetas pueden indicar mg de Longvida o mg de curcumina (400mg de Longvida son unos 80mg de curcumina). Otros productos de curcumina (Theracurmin, BCM-95, Meriva y la curcumina simple) son formulaciones distintas con su propia evidencia.',
    },
    stacksWith: [],
    faqs: [
      { question: '¿Longvida es lo mismo que la cúrcuma o la curcumina simple?', answer: 'No. Longvida es una formulación específica de curcumina en partículas lipídicas sólidas; 400mg aportan unos 80mg de curcumina. Los ensayos con otros productos de curcumina no son evidencia para Longvida, y los ensayos con Longvida no son evidencia para ellos.' },
      { question: '¿Qué dosis se probó?', answer: '400mg de Longvida al día (unos 80mg de curcumina) en los dos ensayos cognitivos positivos. Dos ensayos con 2000mg al día no encontraron ningún beneficio cognitivo, así que no se ha demostrado que una dosis más alta funcione mejor.' },
      { question: '¿Quién financió la investigación?', answer: 'Verdure Sciences, que fabrica Longvida, financió el ensayo positivo de 2020. Los dos ensayos que no encontraron beneficio fueron financiados por los Institutos Nacionales de Salud de EE. UU., con cápsulas suministradas por Verdure Sciences. Ambos ensayos positivos provienen de un mismo grupo de investigación y no se han repetido de forma independiente.' },
      { question: '¿Es seguro?', answer: 'Los ensayos no reportaron ningún evento adverso grave atribuido a la curcumina. Un ensayo encontró una glucosa en sangre en ayunas ligeramente más alta tras 12 semanas, así que las personas con diabetes deberían consultar primero a un médico. Los suplementos de cúrcuma se han relacionado con casos poco frecuentes de lesión hepática, y la curcumina puede interactuar con la warfarina.' },
    ],
    sourceHashes: { name: 'ffdcae2600d7', mechanism: '37474243aa75', clinicalDose: 'da2d2d308789', timeToEffect: '316951902b03', studySummary: 'ddd3c2087b09', benefits: '5725c447e8d4', sideEffects: '977310c6fa35', humanEffects: '1fe4c24f7e6c', howToTake: 'b81458169196', stacksWith: '4f53cda18c2b', faqs: '86abc13d4eaa' },
  },
  {
    slug: 'magnesium',
    name: 'Magnesium',
    mechanism: 'El magnesio es un mineral esencial. Las dosis de los suplementos deben compararse como magnesio elemental, no como el peso de la sal: 414mg de óxido de magnesio aportan 250mg de magnesio elemental, y 1g de Magtein (L-treonato de magnesio), unos 75mg. Los ensayos han usado óxido, citrato, cloruro, bisglicinato y L-treonato de magnesio, y la evidencia de una forma no se traslada a otra; no encontramos ningún ensayo en humanos con taurato de magnesio sobre sueño, estado de ánimo, ansiedad o cognición. Los efectos pueden depender del estado de magnesio: en un ensayo, las personas con menor ingesta de magnesio en la dieta mejoraron más (un hallazgo exploratorio), y los ensayos rara vez miden el estado inicial.',
    clinicalDose: '250–500mg/día de magnesio elemental en los ensayos de sueño positivos con bisglicinato y óxido de magnesio; el citrato a 320mg/día no superó al placebo; los ensayos con L-treonato usaron 1–2g de producto (unos 75–150mg elementales)',
    timeToEffect: 'Los ensayos de sueño duraron de 20 días a 8 semanas; el beneficio del bisglicinato se midió a las 4 semanas',
    studySummary: 'Las revisiones califican la evidencia sobre el sueño como de certeza baja a muy baja. Una revisión sistemática de 2026 de 12 ECA (Lopresti et al.) concluyó que la evidencia no respalda el magnesio como tratamiento habitual del insomnio, aunque puede mejorar modestamente algunos resultados subjetivos en algunos adultos, y un metaanálisis de 2021 de 3 ensayos en 151 adultos mayores (Mah & Pitre) encontró que conciliaban el sueño unos 17 minutos antes que con placebo, sin un cambio significativo en el tiempo total de sueño. Los ensayos individuales se dividen: 250mg/día de magnesio elemental como bisglicinato redujeron las puntuaciones de insomnio algo más que el placebo durante 4 semanas en 155 adultos con mal sueño (Schuster et al., 2025; tamaño del efecto d=0.2), 500mg/día como óxido de magnesio ayudaron a 46 adultos mayores con insomnio (Abbasi et al., 2012), y 320mg/día como citrato no fueron mejores que el placebo en 100 adultos mayores de 51 años (Nielsen et al., 2010). Los dos ensayos con L-treonato citados aquí fueron financiados por empresas que fabrican o suministran el ingrediente. Nuestra revisión calificó como preliminar la evidencia sobre estrés, estado de ánimo y cognición.',
    benefits: [
      'Puntuaciones de insomnio algo mejores con 250mg/día de magnesio elemental como bisglicinato (un ECA de 4 semanas, efecto pequeño)',
      'Inicio del sueño más rápido en adultos mayores con insomnio (un análisis combinado de 3 ensayos pequeños, evidencia de certeza baja)',
    ],
    sideEffects: [
      'La diarrea y otras molestias digestivas son los principales efectos secundarios y la base del límite superior de 350mg/día para el magnesio de suplementos; una revisión de 2023 de 10 estudios (128–1200mg/día) no encontró un exceso significativo de diarrea en 7, y sus autores sostienen que el límite debería revisarse. En un ensayo con 729mg/día, todos los participantes tuvieron heces blandas',
      'La función renal reducida aumenta el riesgo de magnesio alto en sangre (hipermagnesemia): en pacientes mayores a los que se recetó óxido de magnesio, un aclaramiento de creatinina de 28.2mL/min o menos fue un factor de riesgo significativo. Las personas con función renal reducida solo deben tomar suplementos de magnesio por indicación médica',
      'Los ensayos con L-treonato de 3–6 semanas no informaron de reacciones adversas significativas; la seguridad a largo plazo no está establecida',
      'Esta revisión no buscó interacciones con medicamentos ni la seguridad durante el embarazo',
    ],
    humanEffects: [
      { effect: 'Calidad del sueño', notes: 'Una revisión de 2026 de 12 ECA encontró resultados inconsistentes con certeza baja a muy baja, y un metaanálisis de 2021 de 3 ensayos en adultos mayores encontró un inicio del sueño unos 17 minutos más rápido (Mah & Pitre 2021). El bisglicinato a 250mg/día (Schuster 2025) y el óxido de magnesio a 500mg/día (Abbasi 2012) ayudaron; el citrato a 320mg/día no superó al placebo (Nielsen 2010). Ensayos con L-treonato financiados por el patrocinador mejoraron algunas medidas (Hausenblas 2024), pero uno no encontró cambios en el sueño medido con un anillo (Lopresti 2025).' },
      { effect: 'Memoria y cognición', notes: 'En 100 adultos insatisfechos con su sueño, 6 semanas de L-treonato (Magtein, 2g/día) mejoraron una puntuación cognitiva compuesta (p=0.043) y el tiempo de reacción, pero no el razonamiento abstracto (Lopresti 2025, financiado por el proveedor). Los datos cognitivos positivos que encontramos corresponden todos a productos de L-treonato financiados por el patrocinador, sin replicación independiente.' },
    ],
    howToTake: {
      dosage: '250–500mg/día de magnesio elemental en los ensayos de sueño positivos con bisglicinato y óxido; busca en la etiqueta el magnesio elemental, no el peso de la sal. Las dosis superiores a 350mg/día superan el límite superior para el magnesio de suplementos, que se fija por el riesgo de diarrea',
      timing: 'A diario. Los ensayos de sueño en adultos mayores dividieron la dosis en 2–3 tomas al día; un ensayo con L-treonato la dio 2 horas antes de acostarse.',
      withFood: 'Los ensayos revisados aquí no fijan una regla; sigue la etiqueta del producto.',
      forms: 'El bisglicinato (un ECA de sueño controlado con placebo), el óxido, el citrato, el cloruro y el L-treonato (ensayos financiados por el patrocinador) tienen cada uno su propia evidencia, y la evidencia de una forma no se traslada a otra. No encontramos ningún ensayo en humanos con taurato de magnesio sobre sueño, estrés, estado de ánimo o cognición; su evidencia son estudios en animales y un estudio observacional sobre presión arterial.',
    },
    stacksWith: [
      { ingredient: 'L-Tryptophan', reason: 'Ambos formaron parte de un ensayo de 3 días con una mezcla en 16 adultos sanos (con glicina, polvo de cereza ácida y L-teanina) que acortó en 24 minutos el inicio del sueño (Langan-Evans 2023); el resumen no da las dosis, así que se desconoce qué aporta cada uno.' },
      { ingredient: 'Tart Cherry', reason: 'Ambos formaron parte del mismo ensayo de 3 días con una mezcla en 16 personas (Langan-Evans 2023); no citamos ningún ensayo de esta combinación sola.' },
      { ingredient: 'L-Teanina', reason: 'La L-teanina también formó parte de ese ensayo con una mezcla; no citamos ningún ensayo de magnesio y L-teanina solos.' },
    ],
    faqs: [
      { question: '¿Qué forma de magnesio tiene la mejor evidencia para el sueño?', answer: 'El bisglicinato tiene un ECA de sueño controlado con placebo: 250mg/día de magnesio elemental durante 4 semanas dieron un beneficio pequeño en las puntuaciones de insomnio. El óxido de magnesio (500mg/día) ayudó a adultos mayores con insomnio en un ensayo, y el citrato (320mg/día) no superó al placebo en otro. Los ensayos con L-treonato que citamos fueron financiados por empresas que lo fabrican o suministran. No encontramos ningún ensayo en humanos con taurato de magnesio. La evidencia de una forma no se traslada a otra.' },
      { question: '¿Cómo comparo una etiqueta con las dosis de los ensayos?', answer: 'Usa el magnesio elemental, no el peso del compuesto: 414mg de óxido de magnesio aportan 250mg de magnesio elemental, y 1g de Magtein (L-treonato), unos 75mg. Los ensayos de sueño positivos con bisglicinato y óxido usaron 250–500mg/día de magnesio elemental; aparte del L-treonato (unos 75–150mg elementales), los ensayos que citamos usaron 250mg/día o más.' },
      { question: '¿Funcionan las mezclas para dormir que contienen magnesio?', answer: 'Solo se encontró un ensayo de ese tipo: 16 adultos jóvenes sanos tomaron una mezcla de triptófano, glicina, magnesio, polvo de cereza ácida y L-teanina durante 3 días, y conciliaron el sueño 24 minutos antes y durmieron 22 minutos más que con placebo. El resumen no da la dosis de ningún ingrediente, y el diseño no puede mostrar qué aportó el magnesio.' },
      { question: '¿El magnesio es seguro?', answer: 'El principal efecto secundario es la diarrea, en la que se basa el límite superior de 350mg/día para el magnesio de suplementos. Las personas con función renal reducida corren riesgo de tener magnesio alto en sangre y solo deben tomar suplementos de magnesio por indicación médica. Esta revisión no buscó interacciones con medicamentos ni la seguridad durante el embarazo, así que consulta a un farmacéutico o a un médico si alguna de las dos cosas aplica en tu caso.' },
    ],
    sourceHashes: { name: '5406ce61dd4d', mechanism: '39b9b123abbc', clinicalDose: 'e19dcfb216a1', timeToEffect: '5f33d035b456', studySummary: 'fab4ab8e2379', benefits: '88330f673602', sideEffects: '564300e1b9f6', humanEffects: '8d27b5a9a016', howToTake: '25c577eb339e', stacksWith: '56fdf23c3da7', faqs: 'e7a90cbe30bd' },
  },
  {
    slug: 'tart-cherry',
    name: 'Tart Cherry (Montmorency)',
    mechanism: 'Los suplementos de cereza ácida proceden de cerezas ácidas Montmorency (Prunus cerasus) en forma de jugo, concentrado o polvo. Las cerezas contienen melatonina, pero solo en trazas: un análisis estimó unos 0.135 microgramos en una dosis de jugo, frente a las dosis de 0.5–5mg que se usan para dormir, así que no está establecido que algún efecto sobre el sueño se deba a la melatonina de la dieta. Un producto de degradación de la melatonina en la orina aumentó tras el concentrado de cereza ácida en un ensayo, pero un nivel urinario más alto no es en sí un beneficio para el sueño. Una vía alternativa propuesta, a través del metabolismo del triptófano, se basa en 8 participantes que completaron un ensayo y en estudios celulares, no en datos humanos replicados.',
    clinicalDose: 'Los ensayos de sueño positivos usaron jugo o concentrado (240mL de jugo dos veces al día durante 2 semanas en adultos mayores con insomnio); 500mg/día de polvo durante 14 días no mejoraron el sueño, y no se ha demostrado que el polvo equivalga al jugo',
    timeToEffect: 'Los ensayos positivos midieron el sueño tras 7 días a 2 semanas; los ensayos de 14–30 días con polvo, cápsulas o jugo no encontraron ningún beneficio',
    studySummary: 'La evidencia es escasa, breve y mixta, y todos los resultados positivos de sueño con cereza como único ingrediente usaron jugo o concentrado. En dos pilotos cruzados en adultos mayores con insomnio, 240mL de jugo dos veces al día durante 2 semanas redujeron la gravedad del insomnio y los despertares nocturnos, pero no el tiempo para conciliar el sueño (Pigeon et al., 2010, n=15, financiado en su totalidad por el fabricante del jugo, CherryPharm), o añadieron 84 minutos de tiempo total de sueño en la polisomnografía en 8 participantes que completaron el estudio, sin cambios en el inicio del sueño ni en los despertares (Losso et al., 2018, financiado por el Cherry Marketing Institute con becas de los NIH). En 20 adultos sanos, el concentrado aumentó el tiempo en cama, el tiempo total de sueño y la eficiencia del sueño a lo largo de 7 días (Howatson et al., 2012), pero un ensayo de 30 días con jugo y cápsulas en 44 adultos sanos no encontró diferencias en el sueño (Hillman 2026). 500mg/día de polvo de cereza ácida durante 14 días no tuvieron ningún efecto sobre ninguna medida de sueño en 34 adultos con mal sueño y sobrepeso u obesidad (Tucker 2024, financiado por el Cherry Marketing Institute). No se encontró ningún metaanálisis.',
    benefits: [
      'Menor gravedad del insomnio y menos despertares nocturnos en adultos mayores con insomnio (un piloto cruzado de 2 semanas con jugo, financiado por el fabricante)',
      'Más tiempo total de sueño en la polisomnografía en adultos mayores con insomnio (un piloto, 8 participantes que lo completaron, jugo)',
      'Más tiempo de sueño y mayor eficiencia del sueño en adultos sanos a lo largo de 7 días (un ensayo con concentrado)',
    ],
    sideEffects: [
      'Los resúmenes de los ensayos revisados no informaron de ningún evento adverso grave específico de la cereza ácida, pero los resúmenes rara vez detallan la seguridad y ningún ensayo de sueño duró más de 30 días',
      'El jugo y el concentrado aportan azúcar y calorías, que las cápsulas evitan',
      'En un ensayo de insomnio con cribado por polisomnografía, 3 de 11 personas aleatorizadas tenían apnea del sueño y fueron excluidas y derivadas, así que el mal sueño puede reflejar un trastorno del sueño sin tratar',
    ],
    humanEffects: [
      { effect: 'Sueño (adultos sanos)', notes: 'El concentrado aumentó el tiempo en cama, el tiempo total de sueño y la eficiencia a lo largo de 7 días (Howatson 2012, n=20); un ensayo de 30 días con jugo y cápsulas en 44 adultos sanos no encontró diferencias en el sueño (Hillman 2026).' },
      { effect: 'Sueño en adultos mayores con insomnio', notes: 'Dos pilotos cruzados de 2 semanas con jugo: menor gravedad del insomnio y menos despertares nocturnos, pero sin cambios en el inicio del sueño, el tiempo total de sueño ni la eficiencia (Pigeon 2010, n=15, financiado por el fabricante); 84 minutos más de tiempo total de sueño en la polisomnografía, pero sin cambios en el inicio del sueño ni en los despertares (Losso 2018, 8 participantes que lo completaron). Ninguno se ha replicado de forma independiente.' },
      { effect: 'Sueño con polvo o cápsulas', notes: '500mg/día de polvo de cereza Montmorency entera 1 hora antes de acostarse durante 14 días no tuvieron ningún efecto sobre ninguna medida de sueño ni de inflamación en 34 adultos con mal sueño y sobrepeso u obesidad (Tucker 2024); un brazo con cápsulas en un ensayo de 30 días con 44 adultos sanos tampoco encontró diferencias en el sueño (Hillman 2026).' },
    ],
    howToTake: {
      dosage: 'Los ensayos de sueño positivos usaron jugo (240mL dos veces al día) o concentrado. Ningún ensayo ha mostrado un beneficio para el sueño con polvo o cápsulas; se probaron 500mg/día de polvo y no tuvieron ningún efecto',
      timing: 'En un ensayo positivo con jugo, una toma por la mañana y otra 1–2 horas antes de acostarse; el ensayo con polvo dio las cápsulas 1 hora antes de acostarse.',
      withFood: 'Los ensayos no fijan ninguna regla. El jugo y el concentrado añaden azúcar y calorías.',
      forms: 'Jugo, concentrado o cápsulas de polvo, normalmente de cerezas ácidas Montmorency. Todos los ensayos de sueño positivos con cereza como único ingrediente usaron jugo o concentrado; los dos ensayos con un brazo de polvo o cápsulas no encontraron ningún beneficio, y ningún estudio ha demostrado que un polvo equivalga a una cantidad dada de jugo.',
    },
    stacksWith: [
      { ingredient: 'Magnesium', reason: 'Ambos formaron parte de un ensayo de 3 días con una mezcla en 16 adultos (con triptófano, glicina y L-teanina) que acortó el inicio del sueño (Langan-Evans 2023); el ensayo no puede aislar ninguno de los dos ingredientes, y no citamos ningún ensayo de esta combinación sola.' },
      { ingredient: 'L-Tryptophan', reason: 'Ambos formaron parte del mismo ensayo de 3 días con una mezcla en 16 personas (Langan-Evans 2023); no citamos ningún ensayo de esta combinación sola.' },
      { ingredient: 'L-Teanina', reason: 'La L-teanina también formó parte de ese ensayo con una mezcla; no citamos ningún ensayo de esta combinación sola.' },
    ],
    faqs: [
      { question: '¿La cereza ácida funciona porque contiene melatonina?', answer: 'Es poco probable. Un análisis encontró unos 0.135 microgramos de melatonina en una dosis de jugo, frente a las dosis de 0.5–5mg que se usan para dormir. Un producto de degradación de la melatonina en la orina aumentó tras el concentrado de cereza ácida en un ensayo, pero un nivel urinario más alto no es en sí un beneficio para el sueño.' },
      { question: '¿Las cápsulas de cereza ácida son tan buenas como el jugo?', answer: 'No se ha demostrado. Todos los ensayos de sueño positivos con cereza como único ingrediente usaron jugo o concentrado, y los dos ensayos que probaron polvo o cápsulas no encontraron ningún beneficio para el sueño, incluido uno con 500mg/día durante 14 días. Los autores de ese ensayo dijeron que 500mg de polvo equivalen a 2oz de concentrado en contenido de antocianinas y polifenoles, pero es una afirmación suya, no una equivalencia comprobada.' },
      { question: '¿Quién financió la investigación?', answer: 'Organismos de la industria de la cereza financiaron gran parte: el fabricante de jugo CherryPharm financió por completo uno de los dos pilotos de insomnio, y el Cherry Marketing Institute financió el otro (junto con becas de los NIH) y el ensayo con 500mg de polvo que no encontró ningún efecto. No se pudo comprobar la financiación del ensayo positivo de 7 días en adultos sanos porque el artículo es de pago.' },
      { question: '¿La cereza ácida es segura?', answer: 'Los resúmenes de los ensayos revisados no informaron de ningún evento adverso grave específico de la cereza ácida, aunque los resúmenes rara vez detallan la seguridad y ningún ensayo de sueño duró más de 30 días. El jugo y el concentrado añaden azúcar y calorías. En un ensayo de insomnio, 3 de 11 participantes tenían apnea del sueño, así que el mal sueño puede reflejar un trastorno del sueño sin tratar.' },
    ],
    sourceHashes: { name: '7abc926fc7ad', mechanism: '375b62aac32c', clinicalDose: '78d374652c2d', timeToEffect: 'ca21adc39caf', studySummary: '4c53582d6daa', benefits: 'f4bb8eb8e484', sideEffects: 'bee2eb14dc1b', humanEffects: '21d24de14656', howToTake: '5569e571700b', stacksWith: '038452839c6d', faqs: 'bf79f80df4f9' },
  },
  {
    slug: 'nicotinamide-riboside',
    name: 'Nicotinamide Riboside (NR)',
    mechanism: 'El ribósido de nicotinamida (NR) es una forma de vitamina B3 y un precursor del NAD+. Los suplementos suelen contener la sal cloruro de ribósido de nicotinamida, que Niagen Bioscience (antes ChromaDex) vende como NIAGEN. Tomar NR eleva de forma fiable el NAD+ en la sangre humana; los autores de un ensayo de 2026 proponen que actúa en parte porque las bacterias intestinales lo convierten en ácido nicotínico. El NAD+ en sangre es un marcador indirecto: ningún ensayo ha demostrado que elevarlo mejore el pensamiento, la memoria o la energía.',
    clinicalDose: '100–1000mg/día elevaron el NAD+ en sangre (+22% con 100mg, +51% con 300mg, +142% con 1000mg tras 8 semanas); los ensayos de cognición y fatiga usaron 1000–2000mg/día en grupos de pacientes y no encontraron ningún beneficio',
    timeToEffect: 'El NAD+ en sangre subió en 2 semanas y siguió más alto hasta la semana 8; ningún ensayo ha mostrado un efecto sobre la cognición o la energía',
    studySummary: 'El NR eleva el NAD+ en la sangre humana: en un ensayo de 8 semanas con 140 adultos sanos con sobrepeso, el NAD+ en sangre total subió un 22%, un 51% y un 142% con 100, 300 y 1000mg/día (Conze et al., 2019, financiado por ChromaDex), y otros grupos, incluidos investigadores de Nestlé, han reproducido el aumento. Es un biomarcador, no un resultado de salud. No se encontró ningún ensayo aleatorizado de cognición en adultos sanos. Tres ensayos controlados con placebo en deterioro cognitivo leve o deterioro cognitivo subjetivo (1000mg/día durante 8–12 semanas) y un ensayo en COVID persistente (2000mg/día) no encontraron ningún beneficio cognitivo, aunque el NAD+ en sangre se multiplicó por 2 a 3. En el ensayo más grande, NOPARK (410 personas con enfermedad de Parkinson temprana, 1000mg/día durante 52 semanas, publicado en JAMA en 2026), las puntuaciones de síntomas empeoraron más con NR que con placebo. Una revisión de 2023 de 25 estudios en humanos concluyó que el NR oral ha mostrado pocos efectos clínicamente relevantes. La mayoría de los ensayos con NR están financiados, suministrados o coescritos por ChromaDex/Niagen Bioscience o Elysium Health.',
    benefits: [
      'Eleva el NAD+ en sangre, más con dosis más altas (solo un biomarcador; replicado en varios ensayos)',
      'No hubo más eventos adversos que con placebo con 100–1000mg/día durante 8 semanas en adultos sanos con sobrepeso (un ensayo)',
    ],
    sideEffects: [
      'En el ensayo de fase 3 NOPARK (enfermedad de Parkinson temprana, 1000mg/día durante 52 semanas, n=410), las puntuaciones de síntomas de Parkinson empeoraron más con NR que con placebo (+2.72 puntos, p=.02) y los síntomas no motores empeoraron más; los eventos adversos graves fueron menos frecuentes con NR (8.3% frente a 14.1%). Los autores dicen que los resultados no respaldan el NR como tratamiento modificador de la enfermedad',
      'La EFSA consideró seguro el cloruro de ribósido de nicotinamida hasta 300mg/día en adultos sanos, pero solo hasta 230mg/día durante el embarazo y la lactancia',
      'En un dictamen de 2021, la EFSA señaló datos experimentales que indican varias vías por las que ingestas de nicotinamida o de sus precursores muy superiores a las necesidades fisiológicas podrían causar efectos adversos',
      'Los datos de seguridad en adultos sanos llegan solo a 8 semanas: en ese ensayo no hubo rubor, ni aumento del colesterol LDL, ni diferencia en eventos adversos entre NR y placebo',
      'Con 3000mg/día durante 4 semanas en la enfermedad de Parkinson no hubo eventos adversos moderados ni graves, pero la homocisteína sérica subió ligeramente al principio',
      'En un ensayo en COVID persistente con 2000mg/día, el 51% del grupo que tomó NR durante 20 semanas abandonó, frente al 14% del grupo que tomó placebo primero; el resumen no da los motivos',
    ],
    humanEffects: [
      { effect: 'NAD+ en sangre (biomarcador)', notes: 'Dosis únicas de 100–1000mg elevaron los metabolitos del NAD+ en sangre en proporción a la dosis (Trammell 2016). A lo largo de 8 semanas, el NAD+ en sangre total subió un 22%, un 51% y un 142% con 100, 300 y 1000mg/día (Conze 2019); 1000mg/día lo elevaron cerca de un 60% en células sanguíneas (Martens 2018); 250mg de NR con 50mg de pterostilbeno lo elevaron cerca de un 40% (Dellinger 2017, un producto combinado). Un ensayo de Nestlé reprodujo el aumento (Christen 2026). Es un marcador, no un resultado de salud.' },
      { effect: 'Memoria y pensamiento (adultos sanos)', notes: 'No se encontró ningún ensayo aleatorizado con un resultado cognitivo en adultos sanos; los ensayos en adultos sanos midieron metabolitos del NAD+, presión arterial o resultados musculares o vasculares. Falta evidencia de beneficio, lo cual no equivale a evidencia en contra.' },
      { effect: 'Cognición (DCL y deterioro subjetivo)', notes: '1000mg/día durante 8–12 semanas no cambiaron las puntuaciones MoCA (Orr 2024, n=20), el resultado cognitivo principal (Martens 2026, 42 participantes que lo completaron) ni las puntuaciones RBANS (Wu 2025, n=46), aunque el NAD+ en sangre se multiplicó por 2 a 2.6. El descenso del pTau217 plasmático en el ensayo de Wu es un hallazgo de biomarcador, no un beneficio cognitivo.' },
      { effect: 'Fatiga y energía', notes: 'En 58 adultos con COVID persistente, 2000mg/día no cambiaron la fatiga ni la cognición frente a placebo (Wu 2025, otro ensayo). Un metaanálisis no encontró respaldo para el NR ni el NMN en la masa y la función muscular en adultos mayores de 60 años (Prokopidis 2025). No hay ningún ensayo en adultos sanos.' },
      { effect: 'Enfermedad de Parkinson', notes: 'Dos ensayos tempranos pequeños se inclinaron a favor (NADPARK 2022, n=30; NR-SAFE 2023, n=20, donde las puntuaciones de síntomas se confundieron con el horario de la levodopa). El ensayo de fase 3 NOPARK (Brakedal 2026, n=410, 1000mg/día, 52 semanas) encontró puntuaciones de síntomas peores con NR que con placebo. La evidencia va en contra de un beneficio.' },
      { effect: 'Envejecimiento saludable', notes: 'Una revisión crítica de 25 estudios en humanos encontró pocos efectos clínicamente relevantes (Damgaard 2023); una revisión sistemática de 33 estudios en humanos (Gallagher 2026) encontró aumentos constantes del NAD+, pero efectos funcionales y sobre la salud a largo plazo heterogéneos y a menudo nulos.' },
    ],
    howToTake: {
      dosage: 'Para elevar el NAD+ en sangre se probaron 100–1000mg/día de cloruro de ribósido de nicotinamida (300mg/día: +51% tras 8 semanas). La EFSA consideró seguros hasta 300mg/día en adultos sanos (230mg/día durante el embarazo y la lactancia). Ninguna dosis ha demostrado mejorar la cognición o la energía',
      timing: 'Una vez al día, después del desayuno, en el ensayo de rango de dosis; el NAD+ en sangre subió en 2 semanas.',
      withFood: 'El ensayo de rango de dosis lo administró después del desayuno; los ensayos revisados no fijan ninguna otra regla.',
      forms: 'Cápsula. Los suplementos suelen contener cloruro de ribósido de nicotinamida (NIAGEN o TRU NIAGEN), y la mayor parte del producto de los ensayos lo suministró ChromaDex, hoy Niagen Bioscience. Los ensayos que nombran la forma (Trammell 2016, Conze 2019) expresan las dosis en mg de cloruro de ribósido de nicotinamida, así que una etiqueta que indique mg del cloruro se compara directamente. El NMN, la niacina y la nicotinamida son compuestos distintos cuyos ensayos no son evidencia para el NR.',
    },
    stacksWith: [],
    faqs: [
      { question: '¿Elevar el NAD+ mejora la memoria o la concentración?', answer: 'No en los ensayos realizados hasta ahora. No se encontró ningún ensayo aleatorizado de cognición en adultos sanos, y los ensayos en deterioro cognitivo leve, deterioro cognitivo subjetivo y COVID persistente (1000–2000mg/día) no encontraron ningún beneficio cognitivo, aunque el NAD+ en sangre se multiplicó por 2 a 3.' },
      { question: '¿Qué dosis eleva el NAD+?', answer: 'En un ensayo de 8 semanas, el NAD+ en sangre total subió un 22% con 100mg/día, un 51% con 300mg/día y un 142% con 1000mg/día. No se encontró ningún ensayo de 250mg de NR solo con el NAD+ como resultado; una combinación de 250mg de NR con 50mg de pterostilbeno lo elevó cerca de un 40%.' },
      { question: '¿El NR es seguro?', answer: 'Los ensayos de 100–1000mg/día durante hasta 8 semanas no encontraron más eventos adversos que con placebo. La EFSA consideró seguros hasta 300mg/día en adultos sanos, pero solo hasta 230mg/día durante el embarazo y la lactancia. En la enfermedad de Parkinson temprana, un año con 1000mg/día se siguió de puntuaciones de síntomas peores que con placebo. No se ha establecido la seguridad a largo plazo en personas sanas.' },
      { question: '¿Quién financia la investigación sobre el NR?', answer: 'La mayoría de los ensayos fueron financiados, suministrados o coescritos por Niagen Bioscience (antes ChromaDex), que vende NIAGEN, o por Elysium Health. Investigadores de Nestlé han reproducido el aumento del NAD+, y los ensayos que no encontraron ningún beneficio cognitivo provienen de grupos académicos, algunos con producto suministrado por el fabricante.' },
    ],
    sourceHashes: { name: '47658fafd5c2', mechanism: '166b497fbca7', clinicalDose: '95886ce11345', timeToEffect: '5fbf3f31ba12', studySummary: 'b7f82601c728', benefits: 'cf29b7e5ff66', sideEffects: '521914d40622', humanEffects: 'cf9282ba083d', howToTake: '48fc9cc08e23', stacksWith: '4f53cda18c2b', faqs: '215fe9b1e411' },
  },
  {
    slug: 'l-tryptophan',
    name: 'L-Tryptophan',
    mechanism: 'El L-triptófano es un aminoácido esencial. El cuerpo lo usa para fabricar serotonina y, a partir de la serotonina, melatonina; también alimenta la vía de la quinurenina. No es lo mismo que el 5-HTP (5-hidroxitriptófano), los alimentos ricos en triptófano, los hidrolizados de proteínas o la alfa-lactoalbúmina, cuyos ensayos no son evidencia para los suplementos de L-triptófano. En los ensayos, los efectos dependieron a menudo del genotipo o del estado inicial, y una revisión encontró que la carga de triptófano ralentizaba de forma constante el tiempo de reacción, lo que atribuye a una sedación leve.',
    clinicalDose: '1–3g/día en los ensayos de sueño y estado de ánimo que pudieron leerse; un metaanálisis sobre el sueño encontró efectos mayores con 1g/día o más, y no se encontró ningún ensayo controlado con placebo de triptófano solo por debajo de 1g/día',
    timeToEffect: 'Los efectos se midieron tras 3 semanas en el ensayo de insomnio; los ensayos revisados son breves',
    studySummary: 'Los ensayos son pequeños y breves. Un metaanálisis de 2022 que solo pudo combinar 4 ensayos (Sutanto et al.) encontró menos tiempo despierto después de conciliar el sueño, más con 1g/día o más, y ningún efecto sobre otras medidas del sueño. En un ensayo de 3 semanas en 57 adultos con insomnio crónico, el triptófano tomado con carbohidratos mejoró el sueño, mientras que los carbohidratos solos no (Hudson et al., 2005; la dosis no figura en el resumen). En cuanto al estado de ánimo, una revisión de 2021 encontró diferencias frente a placebo en 4 de 11 ECA en adultos sanos (Kikuchi et al.). Ningún ensayo encontró un beneficio cognitivo en adultos sanos, y una revisión de 2010 encontró que la carga de triptófano ralentiza el tiempo de reacción. No se pudo comprobar la financiación de la mayoría de los ensayos. La epidemia de síndrome de eosinofilia-mialgia (EMS) de 1989 se atribuyó al triptófano de un único fabricante.',
    benefits: [
      'Menos tiempo despierto después de conciliar el sueño con 1g/día o más (un metaanálisis de 4 ensayos)',
      'Mejores medidas de insomnio en un ensayo de 3 semanas en adultos con insomnio crónico',
      'Diferencias de estado de ánimo frente a placebo en 4 de 11 ECA en adultos sanos (una revisión de 2021)',
    ],
    sideEffects: [
      'Síndrome de eosinofilia-mialgia (EMS): la epidemia de 1989 se atribuyó al triptófano de un único fabricante (lo había tomado el 98% de los casos de Oregón, frente al 30–48% de los controles), lo que apunta a un contaminante o a un cambio en la producción más que al propio triptófano. En una cohorte expuesta, el 19% de las personas con EMS definido murió durante el seguimiento',
      'Síndrome serotoninérgico: un informe de caso lo describe tras combinar triptófano con un IMAO y clomipramina. El desencadenante habitual es empezar dos o más fármacos serotoninérgicos, y los IMAO combinados con agentes serotoninérgicos pueden ser mortales; consulta a un médico antes de combinar triptófano con ISRS, IRSN, IMAO, linezolid, triptanes o tramadol',
      'Tiempos de reacción más lentos tras la carga de triptófano, atribuidos a una sedación leve',
      'No se revisaron datos de seguridad sobre embarazo, lactancia ni enfermedades hepáticas o renales',
    ],
    humanEffects: [
      { effect: 'Calidad del sueño', notes: 'Un metaanálisis de 2022 (Sutanto 2022, 4 ensayos combinados) encontró menos tiempo despierto tras conciliar el sueño, más con 1g/día o más, y ningún efecto sobre otras medidas del sueño; en 57 adultos con insomnio crónico, el triptófano con carbohidratos mejoró las medidas de insomnio a lo largo de 3 semanas, mientras que los carbohidratos solos no (Hudson 2005; dosis no indicada en el resumen).' },
      { effect: 'Estado de ánimo (adultos sanos)', notes: 'Una revisión de 11 ECA (Kikuchi 2021) encontró diferencias de estado de ánimo frente a placebo en 4 y ningún efecto sobre los sentimientos agresivos; sugiere 0.14–3g/día, pero indica que la mejor dosis, duración y momento siguen sin estar claros.' },
      { effect: 'Cognición y tiempo de reacción', notes: 'Ningún ensayo encontró un beneficio cognitivo en adultos sanos. Una revisión de 2010 (Silber 2010) indica que la carga de triptófano ralentiza de forma constante el rendimiento psicomotor y el tiempo de reacción, lo que atribuye a una sedación leve; las mejoras de memoria se observaron sobre todo en grupos clínicos o subclínicos.' },
    ],
    howToTake: {
      dosage: '1–3g/día en los ensayos de sueño y estado de ánimo; el metaanálisis sobre el sueño encontró efectos mayores con 1g/día o más. No se encontró ningún ensayo controlado con placebo de triptófano solo por debajo de 1g/día',
      timing: 'Los ensayos revisados no establecen un mejor momento del día.',
      withFood: 'El ensayo de insomnio dio el triptófano con carbohidratos (los carbohidratos solos no ayudaron); por lo demás, los ensayos no fijan ninguna regla.',
      forms: 'Cápsula o polvo de L-triptófano. El 5-HTP, los alimentos ricos en triptófano, la alfa-lactoalbúmina y los hidrolizados de proteínas son productos distintos cuyos ensayos no son evidencia para el L-triptófano. Como la epidemia de EMS de 1989 provino del producto de un fabricante, elige un fabricante de confianza.',
    },
    stacksWith: [
      { ingredient: 'Magnesium', reason: 'Ambos formaron parte de un ensayo de 3 días con una mezcla en 16 adultos sanos (con glicina, polvo de cereza ácida y L-teanina) que acortó el inicio del sueño (Langan-Evans 2023); el resumen no da las dosis, así que se desconoce qué aporta el triptófano.' },
      { ingredient: 'Tart Cherry', reason: 'Ambos formaron parte del mismo ensayo de 3 días con una mezcla en 16 personas (Langan-Evans 2023); no citamos ningún ensayo de esta combinación sola.' },
    ],
    faqs: [
      { question: '¿El L-triptófano es lo mismo que el 5-HTP?', answer: 'No. El 5-HTP (5-hidroxitriptófano) es un compuesto distinto, y sus ensayos no son evidencia para el L-triptófano. Los alimentos ricos en triptófano, la alfa-lactoalbúmina y los hidrolizados de proteínas también son distintos.' },
      { question: '¿Ayudan al sueño las dosis inferiores a 1g al día?', answer: 'No se ha demostrado. No se encontró ningún ensayo controlado con placebo de triptófano solo por debajo de 1g/día, y el metaanálisis sobre el sueño encontró su efecto mayor con 1g/día o más. El único ensayo con una mezcla que incluía triptófano (16 personas, 3 días, con glicina, magnesio, cereza ácida y L-teanina) no dio las dosis de los ingredientes y no puede aislar el triptófano.' },
      { question: '¿Qué es el síndrome de eosinofilia-mialgia?', answer: 'El EMS es una enfermedad grave detrás de una epidemia de 1989 que se atribuyó al triptófano de un único fabricante: el 98% de los casos de Oregón había tomado ese producto, frente al 30–48% de los controles, lo que apunta a un contaminante o a un cambio en la producción más que al propio triptófano. En una cohorte expuesta, el 19% de las personas con EMS definido murió durante el seguimiento.' },
      { question: '¿Puedo tomar triptófano con antidepresivos?', answer: 'Consulta antes a un médico. Se ha notificado síndrome serotoninérgico cuando el triptófano se combinó con un IMAO y clomipramina. El desencadenante habitual es empezar dos o más fármacos serotoninérgicos, y los IMAO combinados con agentes serotoninérgicos pueden ser mortales. No encontramos ningún ensayo que midiera el riesgo con dosis bajas de triptófano.' },
      { question: '¿El triptófano me hará más agudo mentalmente?', answer: 'Ningún ensayo encontró un beneficio cognitivo en adultos sanos. Una revisión de 2010 encontró que la carga de triptófano ralentizaba de forma constante el tiempo de reacción, lo que atribuye a una sedación leve.' },
    ],
    sourceHashes: { name: 'da890d2a2456', mechanism: 'c1da15066a18', clinicalDose: 'b4a2068ac44e', timeToEffect: 'f731545589f6', studySummary: 'cc5becdc40be', benefits: 'b0d490424ba6', sideEffects: 'cc1be5890a9a', humanEffects: '118116614c94', howToTake: '13d50116c1dd', stacksWith: '79c1324b83c2', faqs: '399fee7bb8d7' },
  },
  {
    slug: 'lemon-balm',
    name: 'Lemon Balm (Melissa officinalis)',
    mechanism: 'Los ensayos con melisa (Melissa officinalis) usan preparados muy distintos: extractos estandarizados, hoja seca, un extracto acuoso de hoja de marca con un portador de fosfolípidos (Relissa, de Indena) y extractos estandarizados en ácido rosmarínico. Los resultados de un preparado no se trasladan a otro, así que un producto que no indique su tipo de extracto ni su estandarización no puede compararse con ningún ensayo.',
    clinicalDose: '400mg/día de un extracto estandarizado con portador de fosfolípidos (2 × 200mg) en dos ensayos de sueño controlados con placebo; 200mg/día solo se probaron sin grupo placebo',
    timeToEffect: 'Cambios en el sueño medidos tras 2–3 semanas con el extracto con fosfolípidos; cambios en la calma y la alerta medidos hasta 6 horas después de una sola dosis',
    studySummary: 'La mejor evidencia sobre el sueño corresponde a un solo extracto de marca. Dos ensayos controlados con placebo del extracto con portador de fosfolípidos Relissa a 400mg/día encontraron mejor sueño: en un ensayo cruzado de 2 semanas en 30 adultos, las puntuaciones de insomnio fueron 2.9 puntos más bajas que con placebo (Di Pierro 2024, entre cuyos autores están el director científico y consultores de Pharmextracta, fabricante del producto probado), y en un ensayo de 3 semanas en 100 adultos con malestar emocional o mal sueño, la calidad del sueño mejoró, aunque el grupo tratado partía de un sueño peor (Bano 2023). Un estudio abierto sin placebo encontró la mitad del cambio en la puntuación de sueño con 200mg/día que con 400mg/día (−15% frente a −30%). Una fórmula de L-teanina, melisa, valeriana y azafrán no fue mejor que el placebo durante 6 semanas (Gutiérrez-Romero 2024). En pruebas de dosis única en 20 adultos jóvenes sanos, la dosis más baja aumentó la calma al principio, pero la más alta redujo la alerta y algunas dosis empeoraron las puntuaciones de memoria (Kennedy 2002), y el mayor ensayo de cognición (323 adultos mayores, 96 semanas) no encontró ningún efecto en su criterio principal (Noguchi-Shinohara 2023).',
    benefits: [
      'Mejores puntuaciones de sueño con 400mg/día de un extracto con portador de fosfolípidos (dos ensayos controlados con placebo de un solo producto de marca, 2–3 semanas)',
      'Más calma autoevaluada al principio tras una sola dosis baja (un estudio de laboratorio)',
    ],
    sideEffects: [
      'Menor estado de alerta: la alerta autoevaluada bajó en todos los momentos medidos tras una sola dosis de 900mg, y algunas dosis bajaron las puntuaciones de memoria. No se midieron los efectos al día siguiente de una dosis nocturna',
      'Un extracto que aportaba 500mg/día de ácido rosmarínico no mostró diferencias frente a placebo en signos vitales ni en medidas físicas y neurológicas durante 96 semanas en 323 adultos mayores',
      'En un estudio abierto de 3 semanas con 200–400mg/día, los análisis de sangre hepáticos y renales no cambiaron y no se informó de efectos adversos',
      'No revisamos datos en humanos sobre interacciones con sedantes, medicamentos para dormir, alcohol o medicación tiroidea, ni sobre su uso en el embarazo y la lactancia; la ausencia de evidencia no es evidencia de seguridad',
    ],
    humanEffects: [
      { effect: 'Calidad del sueño (extracto con fosfolípidos)', notes: 'Relissa 400mg/día: puntuación de insomnio 2.9 puntos más baja que con placebo en un ensayo cruzado de 2 semanas (Di Pierro 2024, n=30), y mejor calidad del sueño en un ensayo de 3 semanas (Bano 2023, n=100) cuyo grupo tratado partía de un sueño peor; un estudio abierto (Rondanelli 2026, n=32) encontró −15% con 200mg/día frente a −30% con 400mg/día. Dos de los tres tienen autores vinculados al fabricante o declaraciones de marca registrada; no hay replicación independiente.' },
      { effect: 'Sueño (fórmula de varios ingredientes)', notes: 'Una fórmula de L-teanina, melisa, valeriana y azafrán no cambió la eficiencia del sueño por actigrafía, el tiempo total de sueño ni las puntuaciones de calidad del sueño más que el placebo durante 6 semanas en 64 adultos con sueño alterado (Gutiérrez-Romero 2024). No encontramos ningún ensayo que combine la melisa con magnesio, triptófano o cereza ácida.' },
      { effect: 'Calma, alerta y memoria (dosis únicas)', notes: 'En 20 adultos jóvenes sanos que recibieron dosis únicas de 300, 600 y 900mg (Kennedy 2002), la calma aumentó al principio con la dosis más baja y la precisión de la atención mejoró tras 600mg, pero los factores de memoria bajaron en algunos momentos y dosis, y la alerta bajó en todos los momentos medidos tras 900mg.' },
      { effect: 'Cognición (adultos mayores)', notes: 'El ensayo más grande y largo (n=323 con deterioro cognitivo subjetivo o leve, 500mg/día de ácido rosmarínico, 96 semanas) no encontró ningún efecto en su criterio cognitivo principal; solo un análisis de subgrupo a posteriori favoreció al extracto (Noguchi-Shinohara 2023).' },
    ],
    howToTake: {
      dosage: '400mg/día de un extracto estandarizado con portador de fosfolípidos (como 2 × 200mg) en sus dos ensayos de sueño controlados con placebo; 200mg/día solo se probaron en un estudio abierto, con la mitad del cambio en la puntuación de sueño que 400mg/día',
      timing: 'En el ensayo cruzado de sueño, dos comprimidos de 200mg 30 minutos antes de acostarse; en el ensayo de 3 semanas, 200mg dos veces al día después de las comidas.',
      withFood: 'Los ensayos no fijan ninguna regla; un ensayo de sueño dio los comprimidos después de las comidas.',
      forms: 'Comprimidos, cápsulas, hoja seca o bebidas. El extracto de los dos ensayos de sueño controlados con placebo que citamos es Relissa, un extracto acuoso de hoja estandarizado al 17–23% de derivados del ácido hidroxicinámico con un portador de fosfolípidos; otros ensayos usaron hoja seca, otros extractos estandarizados o extractos de ácido rosmarínico. Una etiqueta que no indique el tipo de extracto ni su estandarización no puede compararse con ningún ensayo.',
    },
    stacksWith: [],
    faqs: [
      { question: '¿Cualquier extracto de melisa funciona igual?', answer: 'No. Los dos ensayos de sueño controlados con placebo que citamos usaron un solo extracto de marca con portador de fosfolípidos a 400mg/día. Los ensayos con hoja seca, otros extractos o combinaciones de hierbas no son evidencia para él, y un producto que no indique su tipo de extracto ni su estandarización no puede compararse con ellos.' },
      { question: '¿Qué dosis se probó para el sueño?', answer: '400mg/día del extracto con portador de fosfolípidos, como dos comprimidos de 200mg, en sus dos ensayos controlados con placebo. 200mg/día solo se probaron en un estudio abierto sin placebo, donde las puntuaciones de sueño mejoraron la mitad que con 400mg/día (−15% frente a −30%). 200mg también están por debajo de la dosis única más baja (300mg) del estudio de calma y memoria.' },
      { question: '¿La melisa me dará somnolencia al día siguiente?', answer: 'Se desconoce. Una sola dosis de 900mg redujo la alerta autoevaluada en un estudio de laboratorio, pero ningún ensayo midió los efectos al día siguiente de una dosis nocturna.' },
      { question: '¿Quién financió la investigación?', answer: 'Entre los autores del ensayo cruzado de sueño están el director científico y consultores de Pharmextracta, fabricante del producto probado, y el estudio abierto declaró que Relissa es una marca registrada de Indena. No se encontró ninguna replicación independiente de los resultados sobre el sueño.' },
    ],
    sourceHashes: { name: 'd357d411278a', mechanism: '268b21d86cca', clinicalDose: '52359847168c', timeToEffect: 'a0d850f4806a', studySummary: 'b8ebc041cfc0', benefits: '3404e19eb490', sideEffects: 'fd3adc6ecb39', humanEffects: '921c8167d429', howToTake: '5d9fc417793e', stacksWith: '4f53cda18c2b', faqs: 'caf4dacc2294' },
  },
];

const TRANSLATIONS: Record<IngredientLocale, IngredientTranslation[]> = { es: ingredientsEs };
