/**
 * Chrome / boilerplate strings used by the shared content templates
 * (HeadToHeadPage, UseCaseListPage, SubscriptionCancellationPage).
 *
 * Templates accept an optional Partial<X> via the `strings` prop and merge
 * with the English defaults below. Locales only need to translate the
 * strings that should differ from English.
 */

export interface UseCaseListPageStrings {
  /** "Home" in breadcrumb */
  home: string;
  /** "Best Nootropics" in breadcrumb */
  bestNootropics: string;
  /** "Reviewed by" label */
  reviewedBy: string;
  /** "Medically reviewed by" label */
  medicallyReviewedBy: string;
  /** "Last updated:" label */
  lastUpdated: string;
  /** "Health disclaimer" heading on the disclaimer aside */
  healthDisclaimer: string;
  /** Default supplement health disclaimer body (fallback when no custom disclaimer is supplied) */
  defaultHealthDisclaimer: string;
  /** Heading: "What the evidence actually says" */
  whatEvidenceSays: string;
  /** Lead paragraph for the evidence section */
  evidenceIntro: string;
  /** "Source →" link label */
  sourceLink: string;
  /** Heading prefix: "Our picks for {useCase}" */
  ourPicksFor: string;
  /** Subhead under picks heading */
  picksIntro: string;
  /** "Top pick" badge text on the #1 pick card */
  topPick: string;
  /** "Why it's here:" inline label on each pick */
  whyItsHere: string;
  /** "Check {name} →" CTA label (uses {name} placeholder) */
  checkProduct: string;
  /** "Read full review" secondary CTA */
  readFullReview: string;
  /** FAQ heading */
  faqHeading: string;
  /** "How we choose" callout heading */
  howWeChoose: string;
  /** "How we choose" body */
  howWeChooseBody: string;
  /** "full methodology" inline link text */
  fullMethodology: string;
  /** "← Back to Best Nootropics {year}" — uses {year} placeholder */
  backToBest: string;
}

export const useCaseListPageEnDefaults: UseCaseListPageStrings = {
  home: 'Home',
  bestNootropics: 'Best Nootropics',
  reviewedBy: 'Reviewed by',
  medicallyReviewedBy: 'Medically reviewed by',
  lastUpdated: 'Last updated:',
  healthDisclaimer: 'Health disclaimer',
  defaultHealthDisclaimer:
    'This page is for educational purposes only and is not medical advice. Nootropic supplements are not approved by the FDA to diagnose, treat, cure, or prevent any disease, including ADHD or other cognitive conditions. They are not equivalent to prescription stimulants. Always consult a qualified healthcare professional before starting any supplement regimen, especially if you take medication or have a medical condition.',
  whatEvidenceSays: 'What the evidence actually says',
  evidenceIntro:
    'For each ingredient below, we link directly to the peer-reviewed source. Ingredient mechanism is not the same as product efficacy — a product can include the right ingredient at the wrong dose.',
  sourceLink: 'Source →',
  ourPicksFor: 'Our picks for',
  picksIntro: 'Ranked by how well each product matches the evidence above + our 5-pillar editorial audit.',
  topPick: 'Top pick',
  whyItsHere: "Why it's here:",
  checkProduct: 'Check {name} →',
  readFullReview: 'Read full review',
  faqHeading: 'Frequently asked questions',
  howWeChoose: 'How we choose',
  howWeChooseBody:
    'Every pick must (a) include at least one ingredient with peer-reviewed evidence for the use case, (b) dose that ingredient at or near the clinical-trial dose, and (c) score ≥ 7.5/10 in our 5-pillar editorial audit. Read our',
  fullMethodology: 'full methodology',
  backToBest: '← Back to Best Nootropics {year}',
};

export const useCaseListPageEsStrings: Partial<UseCaseListPageStrings> = {
  home: 'Inicio',
  bestNootropics: 'Mejores Nootrópicos',
  reviewedBy: 'Revisado por',
  medicallyReviewedBy: 'Revisado médicamente por',
  lastUpdated: 'Actualizado:',
  healthDisclaimer: 'Aviso de salud',
  defaultHealthDisclaimer:
    'Esta página es solo con fines educativos y no constituye consejo médico. Los suplementos nootrópicos no están aprobados por la FDA para diagnosticar, tratar, curar o prevenir ninguna enfermedad, incluido el TDAH u otras condiciones cognitivas. No son equivalentes a los estimulantes recetados. Consulte siempre a un profesional de la salud calificado antes de comenzar cualquier régimen de suplementos.',
  whatEvidenceSays: 'Lo que dice realmente la evidencia',
  evidenceIntro:
    'Para cada ingrediente a continuación, enlazamos directamente a la fuente revisada por expertos. El mecanismo del ingrediente no es lo mismo que la eficacia del producto — un producto puede incluir el ingrediente correcto en la dosis incorrecta.',
  sourceLink: 'Fuente →',
  ourPicksFor: 'Nuestras selecciones para',
  picksIntro:
    'Clasificadas según qué tan bien cada producto coincide con la evidencia anterior + nuestra auditoría editorial de 5 pilares.',
  topPick: 'Mejor opción',
  whyItsHere: '¿Por qué está aquí?:',
  checkProduct: 'Ver {name} →',
  readFullReview: 'Leer reseña completa',
  faqHeading: 'Preguntas frecuentes',
  howWeChoose: 'Cómo elegimos',
  howWeChooseBody:
    'Cada selección debe (a) incluir al menos un ingrediente con evidencia revisada por expertos para el caso de uso, (b) dosificar ese ingrediente en o cerca de la dosis del ensayo clínico, y (c) obtener una puntuación ≥ 7.5/10 en nuestra auditoría editorial de 5 pilares. Lea nuestra',
  fullMethodology: 'metodología completa',
  backToBest: '← Volver a Mejores Nootrópicos {year}',
};

export interface HeadToHeadPageStrings {
  home: string;
  bestNootropics: string;
  reviewedBy: string;
  /** "Medically reviewed by" — only rendered when a Person reviewer is passed */
  medicallyReviewedBy: string;
  lastUpdated: string;
  /** "Verdict" badge */
  verdict: string;
  /** "{name} wins on score" — uses {name} placeholder */
  winnerHeadline: string;
  /** "Check {name} ({price}/mo) →" — uses {name} + {price} */
  checkProductWithPrice: string;
  /** "Check {name} →" */
  checkProduct: string;
  /** Quick specs table heading */
  quickSpecsHeading: string;
  /** Spec / Score / Price column headers */
  spec: string;
  scoreLabel: string;
  pricePerMonth: string;
  caffeineFreeLabel: string;
  yes: string;
  no: string;
  capsulesPerServing: string;
  moneyBack: string;
  daysSuffix: string;
  trustpilot: string;
  notTracked: string;
  /** Clinical dosing audit heading */
  clinicalDosingHeading: string;
  clinicalDosingIntro: string;
  ingredient: string;
  clinicalDose: string;
  /** Citation footer */
  citationFooter: string;
  methodologyLink: string;
  /** Score breakdown heading */
  scoreBreakdownHeading: string;
  /** Pros & cons heading */
  prosConsHeading: string;
  prosLabel: string;
  consLabel: string;
  /** Who is each one for heading */
  whoIsForHeading: string;
  /** "Choose {name} if you..." — uses {name} */
  chooseIfYou: string;
  /** FAQ heading */
  faqHeading: string;
  /** Read individual reviews heading */
  readReviewsHeading: string;
  /** "{name} review" card title — uses {name} */
  productReviewCard: string;
  /** "Score: {score}/10 · Full clinical dosing audit" — uses {score} */
  scoreCardLine: string;
  /** "Best Nootropics {year}" card title — uses {year} */
  bestNootropicsCard: string;
  /** Best Nootropics card subtext */
  fullRankedComparison: string;
  /** Methodology card title */
  methodologyCard: string;
  /** Methodology card subtext */
  howWeAuditDoses: string;
  /** Back link "← Back to Best Nootropics {year}" — uses {year} */
  backToBest: string;
}

export const headToHeadPageEnDefaults: HeadToHeadPageStrings = {
  home: 'Home',
  bestNootropics: 'Best Nootropics',
  reviewedBy: 'Reviewed by',
  medicallyReviewedBy: 'Medically reviewed by',
  lastUpdated: 'Last updated:',
  verdict: 'Verdict',
  winnerHeadline: '{name} wins on score',
  checkProductWithPrice: 'Check {name} ({price}/mo) →',
  checkProduct: 'Check {name} →',
  quickSpecsHeading: 'Quick specs side-by-side',
  spec: 'Spec',
  scoreLabel: 'Score',
  pricePerMonth: 'Price / month',
  caffeineFreeLabel: 'Caffeine-free',
  yes: 'Yes',
  no: 'No',
  capsulesPerServing: 'Capsules / serving',
  moneyBack: 'Money-back',
  daysSuffix: 'days',
  trustpilot: 'Trustpilot',
  notTracked: 'Not tracked',
  clinicalDosingHeading: 'Clinical dosing audit',
  clinicalDosingIntro:
    'Each disclosed ingredient dose vs. minimum effective dose from peer-reviewed human clinical trials. Underdosed ingredients flagged. Ingredients hidden inside proprietary blends cannot be evaluated.',
  ingredient: 'Ingredient',
  clinicalDose: 'Clinical dose',
  citationFooter: 'Clinical-dose anchors sourced from PubMed-indexed human RCTs and Examine.com syntheses. See our',
  methodologyLink: 'methodology',
  scoreBreakdownHeading: 'Score breakdown across 5 pillars',
  prosConsHeading: 'Pros & cons each',
  prosLabel: 'Pros',
  consLabel: 'Cons',
  whoIsForHeading: 'Who is each one for?',
  chooseIfYou: 'Choose {name} if you...',
  faqHeading: 'Frequently asked questions',
  readReviewsHeading: 'Read the individual reviews',
  productReviewCard: '{name} review',
  scoreCardLine: 'Score: {score}/10 · Full clinical dosing audit',
  bestNootropicsCard: 'Best Nootropics {year}',
  fullRankedComparison: 'Full ranked comparison',
  methodologyCard: 'Methodology',
  howWeAuditDoses: 'How we audit clinical doses',
  backToBest: '← Back to Best Nootropics {year}',
};

export const headToHeadPageEsStrings: Partial<HeadToHeadPageStrings> = {
  home: 'Inicio',
  bestNootropics: 'Mejores Nootrópicos',
  reviewedBy: 'Revisado por',
  medicallyReviewedBy: 'Revisado médicamente por',
  lastUpdated: 'Actualizado:',
  verdict: 'Veredicto',
  winnerHeadline: '{name} gana en puntuación',
  checkProductWithPrice: 'Ver {name} ({price}/mes) →',
  checkProduct: 'Ver {name} →',
  quickSpecsHeading: 'Especificaciones lado a lado',
  spec: 'Especificación',
  scoreLabel: 'Puntuación',
  pricePerMonth: 'Precio / mes',
  caffeineFreeLabel: 'Sin cafeína',
  yes: 'Sí',
  no: 'No',
  capsulesPerServing: 'Cápsulas / dosis',
  moneyBack: 'Devolución',
  daysSuffix: 'días',
  trustpilot: 'Trustpilot',
  notTracked: 'No registrado',
  clinicalDosingHeading: 'Auditoría de dosificación clínica',
  clinicalDosingIntro:
    'Cada dosis de ingrediente declarada frente a la dosis mínima efectiva de los ensayos clínicos humanos revisados por expertos. Los ingredientes subdosificados están marcados. Los ingredientes ocultos en mezclas propietarias no pueden ser evaluados.',
  ingredient: 'Ingrediente',
  clinicalDose: 'Dosis clínica',
  citationFooter:
    'Las anclas de dosis clínicas provienen de ECA humanos indexados en PubMed y síntesis de Examine.com. Vea nuestra',
  methodologyLink: 'metodología',
  scoreBreakdownHeading: 'Desglose de puntuación en 5 pilares',
  prosConsHeading: 'Pros y contras de cada uno',
  prosLabel: 'Pros',
  consLabel: 'Contras',
  whoIsForHeading: '¿Para quién es cada uno?',
  chooseIfYou: 'Elija {name} si usted...',
  faqHeading: 'Preguntas frecuentes',
  readReviewsHeading: 'Lea las reseñas individuales',
  productReviewCard: 'Reseña de {name}',
  scoreCardLine: 'Puntuación: {score}/10 · Auditoría de dosificación clínica completa',
  bestNootropicsCard: 'Mejores Nootrópicos {year}',
  fullRankedComparison: 'Comparación clasificada completa',
  methodologyCard: 'Metodología',
  howWeAuditDoses: 'Cómo auditamos las dosis clínicas',
  backToBest: '← Volver a Mejores Nootrópicos {year}',
};

/** Locale codes that have template-string overrides defined */
export type TemplateLocale = 'en' | 'es';

/** Returns merged strings for a UseCaseListPage given a locale (falls back to English for missing keys) */
export function getUseCaseListStrings(locale: TemplateLocale = 'en'): UseCaseListPageStrings {
  if (locale === 'es') return { ...useCaseListPageEnDefaults, ...useCaseListPageEsStrings };
  return useCaseListPageEnDefaults;
}

export function getHeadToHeadStrings(locale: TemplateLocale = 'en'): HeadToHeadPageStrings {
  if (locale === 'es') return { ...headToHeadPageEnDefaults, ...headToHeadPageEsStrings };
  return headToHeadPageEnDefaults;
}

/** Substitutes {placeholder} tokens with named values. */
export function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
