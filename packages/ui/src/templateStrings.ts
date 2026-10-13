/**
 * Chrome / boilerplate strings used by the HeadToHead template. (The Listicle's
 * strings live in UIStrings.listicle, in every locale.)
 *
 * HeadToHead accepts an optional Partial<HeadToHeadPageStrings> via the
 * `strings` prop and merges it with the English defaults below. Locales only
 * need to translate the strings that should differ from English.
 */

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
  price: string;
  caffeineFreeLabel: string;
  yes: string;
  no: string;
  /** Spec-row label for the daily serving (units of the product's form). */
  servingSize: string;
  moneyBack: string;
  daysSuffix: string;
  trustpilot: string;
  notTracked: string;
  /** Clinical dosing audit heading */
  clinicalDosingHeading: string;
  clinicalDosingIntro: string;
  ingredient: string;
  clinicalDose: string;
  /** Citation footer; {link} is where the `methodologyLink` link goes. */
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
  checkProductWithPrice: 'Check {name} ({price}) →',
  checkProduct: 'Check {name} →',
  quickSpecsHeading: 'Quick specs side-by-side',
  spec: 'Spec',
  scoreLabel: 'Score',
  price: 'Price',
  caffeineFreeLabel: 'Caffeine-free',
  yes: 'Yes',
  no: 'No',
  servingSize: 'Serving size',
  moneyBack: 'Money-back',
  daysSuffix: 'days',
  trustpilot: 'Trustpilot',
  notTracked: 'Not tracked',
  clinicalDosingHeading: 'Clinical dosing audit',
  clinicalDosingIntro:
    'Each disclosed ingredient dose vs. the minimum on our ingredient page for it, from peer-reviewed human clinical trials, where the page gives one; ingredients without a reference dose are listed but not scored. Underdosed ingredients flagged. Ingredients hidden inside proprietary blends cannot be evaluated.',
  ingredient: 'Ingredient',
  clinicalDose: 'Clinical dose',
  citationFooter: 'Clinical-dose anchors sourced from PubMed-indexed human RCTs and Examine.com syntheses. See our {link}.',
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
  checkProductWithPrice: 'Ver {name} ({price}) →',
  checkProduct: 'Ver {name} →',
  quickSpecsHeading: 'Especificaciones lado a lado',
  spec: 'Especificación',
  scoreLabel: 'Puntuación',
  price: 'Precio',
  caffeineFreeLabel: 'Sin cafeína',
  yes: 'Sí',
  no: 'No',
  servingSize: 'Tamaño de la dosis',
  moneyBack: 'Devolución',
  daysSuffix: 'días',
  trustpilot: 'Trustpilot',
  notTracked: 'No registrado',
  clinicalDosingHeading: 'Auditoría de dosificación clínica',
  clinicalDosingIntro:
    'Cada dosis de ingrediente declarada frente al mínimo de nuestra página de ese ingrediente, tomado de ensayos clínicos humanos revisados por expertos, cuando la página lo indica; los ingredientes sin dosis de referencia se listan pero no se puntúan. Los ingredientes subdosificados están marcados. Los ingredientes ocultos en mezclas propietarias no pueden ser evaluados.',
  ingredient: 'Ingrediente',
  clinicalDose: 'Dosis clínica',
  citationFooter:
    'Las anclas de dosis clínicas provienen de ECA humanos indexados en PubMed y síntesis de Examine.com. Vea nuestra {link}.',
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

export function getHeadToHeadStrings(locale: TemplateLocale = 'en'): HeadToHeadPageStrings {
  if (locale === 'es') return { ...headToHeadPageEnDefaults, ...headToHeadPageEsStrings };
  return headToHeadPageEnDefaults;
}

/** Substitutes {placeholder} tokens with named values. */
export function tpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/**
 * Splits a translated sentence at its {link} placeholder (other placeholders
 * filled from `vars`). The template renders `before`, the link, then `after`,
 * so each language places the link and closes the sentence itself: no space
 * or Latin full stop is typed around it (en "See our {link}.", ja
 * "詳しくは当サイトの{link}をご覧ください。").
 */
export function tplLink(template: string, vars: Record<string, string | number> = {}): { before: string; after: string } {
  const [before, after = ''] = template.split('{link}');
  return { before: tpl(before, vars), after: tpl(after, vars) };
}
