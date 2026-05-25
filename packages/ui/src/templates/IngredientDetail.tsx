import Link from 'next/link';
import SchemaOrg from '../SchemaOrg';
import { FPDisclosure } from '../public-chrome/FPDisclosure';
import { FPHeader } from '../public-chrome/FPHeader';
import { FPFooter } from '../public-chrome/FPFooter';
import { FPByline } from '../public-chrome/FPByline';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { FaqAccordion } from '../primitives/FaqAccordion';
import { buildPersonAuthorReference } from '@nootropic/data';
import type { Ingredient, Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';

export interface IngredientDetailProps {
  ingredient: Ingredient;
  /** Products that contain this ingredient (joined by the caller). */
  containingProducts: Product[];
  /** Other ingredients to surface in the related rail (caller filters). */
  relatedIngredients: Ingredient[];
  siteUrl: string;
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
  readTime?: string;
}

const CATEGORY_LABELS: Record<Ingredient['category'], string> = {
  adaptogen: 'Adaptogen',
  cholinergic: 'Cholinergic',
  mushroom: 'Mushroom',
  amino: 'Amino Acid',
  herb: 'Herb',
  vitamin: 'Vitamin',
};

const EVIDENCE_TONE: Record<string, { dots: string; tone: 'good' | 'warn' | 'neutral' | 'bad' }> = {
  strong: { dots: '●●●', tone: 'good' },
  moderate: { dots: '●●○', tone: 'warn' },
  preliminary: { dots: '●○○', tone: 'neutral' },
  mixed: { dots: '◐◐○', tone: 'bad' },
};

const MAGNITUDE_WIDTH: Record<string, number> = {
  large: 100,
  moderate: 75,
  small: 50,
  negligible: 25,
};

const MAGNITUDE_LABEL: Record<string, string> = {
  large: 'Large',
  moderate: 'Moderate',
  small: 'Small',
  negligible: 'Negligible',
};

const TOC_SECTIONS = [
  { id: 'mechanism', label: 'Mechanism' },
  { id: 'evidence', label: 'Clinical evidence' },
  { id: 'effects', label: 'Effect matrix' },
  { id: 'benefits', label: 'Benefits & side effects' },
  { id: 'how-to', label: 'How to take' },
  { id: 'stacking', label: 'Stacking' },
  { id: 'faq', label: 'FAQ' },
  { id: 'products', label: 'Products with it' },
  { id: 'related', label: 'Related ingredients' },
];

/**
 * IngredientDetail — public/SEO template for /ingredients/[slug] pages.
 * Drop-in replacement for the existing inline ingredient page. Phase-2
 * chrome + sticky TOC + Quick-facts sidebar. Preserves all five
 * Schema.org JSON-LD blocks (Article, Dataset, BreadcrumbList, FAQPage,
 * HowTo) and the rich content blocks: mechanism, evidence summary,
 * human effect matrix, benefits + side effects, how-to-take grid,
 * stacking pairs, FAQ accordion, products-containing grid, related rail.
 */
export default function IngredientDetail({
  ingredient: ing,
  containingProducts,
  relatedIngredients,
  siteUrl,
  searchItems,
  uiStrings,
  readTime = '8 min',
}: IngredientDetailProps) {
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const updatedDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${ing.name} — Nootropic Ingredient Guide`,
    description: ing.studySummary,
    datePublished: `${currentYear}-04-30`,
    dateModified: today.toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: siteUrl },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#hero-paragraph', '.faq-question'],
    },
  };
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${ing.name} — Human Clinical Effect Matrix`,
    description: `Structured human-clinical-trial evidence summary for ${ing.name}: per-effect evidence strength, magnitude, and study count. Sourced from PubMed-indexed RCTs and Examine.com syntheses.`,
    url: `${siteUrl}/ingredients/${ing.slug}/`,
    keywords: [ing.name, ing.category, 'nootropic', 'cognitive supplement', 'clinical trial'],
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'text/html',
      contentUrl: `${siteUrl}/ingredients/${ing.slug}/`,
    },
    variableMeasured: ing.humanEffects.map((e) => ({
      '@type': 'PropertyValue',
      name: e.effect,
      description: `${e.effect}: ${e.evidenceStrength} evidence (${e.studies} studies), ${e.magnitude} effect size. ${e.notes}`,
      additionalType: e.evidenceStrength,
    })),
    citation: ing.studySummary,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Ingredients', item: `${siteUrl}/ingredients` },
      { '@type': 'ListItem', position: 3, name: ing.name },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ing.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Take ${ing.name}`,
    description: `Dosing, timing, and form guidance for ${ing.name} based on clinical evidence.`,
    step: [
      { '@type': 'HowToStep', name: 'Dosage', text: ing.howToTake.dosage },
      { '@type': 'HowToStep', name: 'Timing', text: ing.howToTake.timing },
      { '@type': 'HowToStep', name: 'With Food', text: ing.howToTake.withFood },
      { '@type': 'HowToStep', name: 'Best Form', text: ing.howToTake.forms },
      ...(ing.howToTake.cycling
        ? [{ '@type': 'HowToStep', name: 'Cycling', text: ing.howToTake.cycling }]
        : []),
    ],
  };

  return (
    <div className="bg-ds-card text-ds-ink ds-font-features" style={{ fontFamily: 'var(--font-ds-sans)' }}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={datasetSchema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={howToSchema} />

      <FPDisclosure methodologyHref="/methodology" />
      <FPHeader searchItems={searchItems} strings={uiStrings} />

      <main className="max-w-[1100px] mx-auto px-6 pt-7">
        <nav aria-label="Breadcrumb" className="text-[12.5px] text-ds-muted mb-[18px]">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            <li><Link href="/" className="hover:text-ds-ink">Home</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li><Link href="/ingredients" className="hover:text-ds-ink">Ingredients</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li aria-current="page" className="text-ds-ink font-medium">{ing.name}</li>
          </ol>
        </nav>

        <div className="grid gap-12 items-start" style={{ gridTemplateColumns: '1fr 280px' }}>
          <article>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Chip tone="neutral">{CATEGORY_LABELS[ing.category]}</Chip>
              <Chip tone="accent">Clinical dose · {ing.clinicalDose}</Chip>
              <Chip tone="warn">Onset · {ing.timeToEffect}</Chip>
            </div>

            <h1 className="text-[44px] font-bold leading-[1.05] tracking-[-0.025em] mt-2 mb-[10px] text-ds-ink">
              {ing.name}
            </h1>
            <p
              id="hero-paragraph"
              className="text-[17px] text-ds-ink-soft m-0 leading-[1.55]"
            >
              {ing.studySummary}
            </p>

            <FPByline updated={updatedDisplay} read={readTime} />

            <section id="mechanism" className="mt-9">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-3 text-ds-ink">Mechanism of action</h2>
              <p className="text-[15.5px] text-ds-ink-soft m-0 leading-[1.65]">{ing.mechanism}</p>
            </section>

            <section id="evidence" className="mt-8">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-3 text-ds-ink">Clinical evidence summary</h2>
              <Card variant="subdued" padding={18}>
                <p className="text-[15px] text-ds-ink-soft m-0 leading-[1.65]">{ing.studySummary}</p>
              </Card>
            </section>

            <section id="effects" className="mt-8">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-1 text-ds-ink">Human effect matrix</h2>
              <p className="text-[13px] text-ds-muted mb-4">
                Based on human clinical trials only. Animal and in-vitro data excluded.
              </p>
              <Card padding={0}>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13.5px] border-collapse">
                    <thead>
                      <tr className="bg-ds-card-sub text-left">
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">Effect</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">Evidence</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">Magnitude</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em] text-center">Studies</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em] hidden md:table-cell">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ing.humanEffects.map((effect) => {
                        const ev = EVIDENCE_TONE[effect.evidenceStrength];
                        const magWidth = MAGNITUDE_WIDTH[effect.magnitude] ?? 50;
                        const magLabel = MAGNITUDE_LABEL[effect.magnitude] ?? '—';
                        return (
                          <tr key={effect.effect} className="border-t border-ds-border">
                            <td className="px-4 py-3 font-semibold text-ds-ink">{effect.effect}</td>
                            <td className="px-4 py-3">
                              <Chip tone={ev.tone}>
                                <span aria-hidden="true">{ev.dots}</span>{' '}
                                {effect.evidenceStrength}
                              </Chip>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-[6px] bg-ds-border rounded-full overflow-hidden" aria-hidden="true">
                                  <div
                                    className="h-full bg-ds-accent rounded-full"
                                    style={{ width: `${magWidth}%` }}
                                  />
                                </div>
                                <span className="text-[12px] text-ds-muted">{magLabel}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-ds-ink ds-tabular">{effect.studies}</td>
                            <td className="px-4 py-3 text-[12.5px] text-ds-muted hidden md:table-cell">{effect.notes}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
              <p className="text-[11.5px] text-ds-muted mt-2">
                Evidence key:{' '}
                <span aria-hidden="true">●●●</span> Strong = multiple consistent RCTs ·{' '}
                <span aria-hidden="true">●●○</span> Moderate = smaller/fewer RCTs ·{' '}
                <span aria-hidden="true">●○○</span> Preliminary = early trials or small n ·{' '}
                <span aria-hidden="true">◐◐○</span> Mixed = conflicting results
              </p>
            </section>

            <section id="benefits" className="mt-9">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-[20px] font-bold text-ds-ink mb-3">Documented benefits</h2>
                  <ul className="list-none p-0 m-0 flex flex-col gap-2">
                    {ing.benefits.map((b) => (
                      <li key={b} className="flex gap-2 text-[13.5px] text-ds-ink-soft">
                        <span className="text-ds-good font-bold shrink-0 mt-[2px]" aria-hidden="true">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-ds-ink mb-3">Side effects &amp; cautions</h2>
                  <ul className="list-none p-0 m-0 flex flex-col gap-2">
                    {ing.sideEffects.map((s) => (
                      <li key={s} className="flex gap-2 text-[13.5px] text-ds-ink-soft">
                        <span className="text-ds-warn shrink-0 mt-[2px]" aria-hidden="true">!</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section id="how-to" className="mt-9">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">How to take</h2>
              <Card variant="subdued" padding={0}>
                {(
                  [
                    ['Dosage', ing.howToTake.dosage, false],
                    ['Timing', ing.howToTake.timing, false],
                    ['With food', ing.howToTake.withFood, false],
                    ...(ing.howToTake.cycling
                      ? [['Cycling', ing.howToTake.cycling, true] as [string, string, boolean]]
                      : []),
                    ['Forms', ing.howToTake.forms, false],
                  ] as Array<[string, string, boolean]>
                ).map(([label, value, emphasize]) => (
                  <div
                    key={label}
                    className="grid gap-3 px-5 py-4 border-b border-ds-border last:border-b-0"
                    style={{ gridTemplateColumns: '120px 1fr' }}
                  >
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[0.08em] pt-[2px] ${
                        emphasize ? 'text-ds-warn-ink' : 'text-ds-muted'
                      }`}
                    >
                      {label}
                    </span>
                    <span className={`text-[13.5px] text-ds-ink ${emphasize ? 'font-semibold' : ''}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </Card>
            </section>

            <section id="stacking" className="mt-9">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-1 text-ds-ink">Stacking recommendations</h2>
              <p className="text-[13px] text-ds-muted mb-4">Ingredients that pair well with {ing.name} and why.</p>
              <div className="flex flex-col gap-3">
                {ing.stacksWith.map((pair) => (
                  <Card key={pair.ingredient} padding={16}>
                    <div className="flex gap-4">
                      <div className="shrink-0 w-28">
                        <Link
                          href={`/ingredients/${pair.slug}`}
                          className="text-[13.5px] font-semibold text-ds-accent hover:text-ds-accent-press underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded leading-tight block"
                        >
                          {pair.ingredient}
                        </Link>
                      </div>
                      <p className="text-[13.5px] text-ds-ink-soft leading-[1.65] m-0">{pair.reason}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section id="faq" className="mt-9">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">Frequently asked questions</h2>
              <FaqAccordion
                items={ing.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))}
              />
            </section>

            {containingProducts.length > 0 && (
              <section id="products" className="mt-9">
                <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">
                  Top stacks containing {ing.name}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {containingProducts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}`}
                      className="block bg-ds-card border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                    >
                      <div className="flex justify-between items-start mb-1 gap-3">
                        <h3 className="font-bold text-ds-ink text-[14px] m-0">{p.name}</h3>
                        <span className="text-ds-good font-bold text-[14px] ds-tabular shrink-0">{p.score}/10</span>
                      </div>
                      <p className="text-[12px] text-ds-muted m-0">{p.brand}</p>
                      {p.editorChoice && (
                        <span className="inline-block mt-2 text-[11px] bg-ds-accent-soft text-ds-accent px-2 py-[2px] rounded-full font-semibold">
                          Editor&apos;s Choice
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section id="related" className="mt-9">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">Related ingredients</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {relatedIngredients.slice(0, 6).map((other) => (
                  <Link
                    key={other.slug}
                    href={`/ingredients/${other.slug}`}
                    className="block border border-ds-border rounded-[8px] p-3 hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                  >
                    <div className="font-semibold text-ds-ink text-[13.5px]">{other.name}</div>
                    <div className="text-[11.5px] text-ds-muted capitalize">{other.category}</div>
                  </Link>
                ))}
              </div>
            </section>

            <div className="text-[13px] text-ds-muted mt-10 pb-10">
              <Link href="/ingredients" className="text-ds-accent underline font-semibold">
                ← Back to Ingredients Guide
              </Link>
            </div>
          </article>

          <aside className="sticky top-[90px] self-start flex flex-col gap-[14px]">
            <Card padding={16}>
              <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-ds-muted mb-[10px]">
                Quick facts
              </div>
              <dl className="text-[13px] m-0">
                {[
                  ['Category', CATEGORY_LABELS[ing.category]],
                  ['Dose', ing.clinicalDose],
                  ['Onset', ing.timeToEffect],
                  ['Trials', `${ing.humanEffects.reduce((sum, e) => sum + e.studies, 0)}`],
                ].map(([k, v], i, arr) => (
                  <div
                    key={k}
                    className={`flex justify-between gap-3 py-[6px] ${i < arr.length - 1 ? 'border-b border-ds-border' : ''}`}
                  >
                    <dt className="text-ds-muted">{k}</dt>
                    <dd className="font-semibold text-ds-ink text-right m-0">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card padding={16}>
              <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-ds-muted mb-[10px]">
                On this page
              </div>
              <ul className="list-none p-0 m-0 flex flex-col">
                {TOC_SECTIONS.map((sec) => (
                  <li key={sec.id} className="text-[13px]">
                    <a
                      href={`#${sec.id}`}
                      className="block px-[10px] py-[5px] text-ds-ink-soft hover:text-ds-accent border-l-2 border-transparent hover:border-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                    >
                      {sec.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </main>

      <FPFooter />
    </div>
  );
}
