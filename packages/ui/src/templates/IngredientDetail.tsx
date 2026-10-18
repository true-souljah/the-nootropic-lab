import Link from 'next/link';
import SchemaOrg from '../SchemaOrg';
import { FPDisclosure } from '../public-chrome/FPDisclosure';
import { FPHeader } from '../public-chrome/FPHeader';
import { FPFooter } from '../public-chrome/FPFooter';
import { FPByline } from '../public-chrome/FPByline';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { FaqAccordion } from '../primitives/FaqAccordion';
import RegionalAvailability from '../RegionalAvailability';
import Sources from '../Sources';
import type { RegionalAvailabilityProps } from '../RegionalAvailability';
import { buildPersonAuthorReference } from '@nootropic/data';
import type { Ingredient, Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';
import { SCORE_TIER_TEXT_CLASS, scoreTier } from './listicleRanking';
import { tpl } from '../templateStrings';

export interface IngredientDetailProps {
  ingredient: Ingredient;
  /** Products that contain this ingredient (joined by the caller). */
  containingProducts: Product[];
  /** Other ingredients to surface in the related rail (caller filters). */
  relatedIngredients: Ingredient[];
  siteUrl: string;
  searchItems?: SearchItem[];
  /** Page-locale chrome. Required: the template has no English fallback. */
  uiStrings: UIStrings;
  /** Estimated read time in minutes, displayed in FPByline. */
  readMinutes?: number;
  /** Region-specific block (availability, licence, local price, local guides). */
  regional?: Omit<RegionalAvailabilityProps, 'subjectName' | 'id'>;
}

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

/**
 * IngredientDetail — public/SEO template for /ingredients/[slug] pages.
 * Drop-in replacement for the existing inline ingredient page. Phase-2
 * chrome + sticky TOC + Quick-facts sidebar. Emits Article, Dataset and
 * BreadcrumbList JSON-LD (FAQPage/HowTo retired) and the rich content
 * blocks: mechanism, evidence summary, human effect matrix, benefits + side effects, how-to-take grid,
 * stacking pairs, FAQ accordion, products-containing grid, related rail.
 */
export default function IngredientDetail({
  ingredient: ing,
  containingProducts,
  relatedIngredients,
  siteUrl,
  searchItems,
  uiStrings,
  readMinutes = 8,
  regional,
}: IngredientDetailProps) {
  const t = uiStrings.ingredientDetail;
  const te = uiStrings.ingredientEvidence;
  const space = uiStrings.typography.space;
  const tocSections = [
    { id: 'mechanism', label: t.toc.mechanism },
    { id: 'evidence', label: t.toc.evidence },
    { id: 'effects', label: t.toc.effects },
    { id: 'benefits', label: t.toc.benefits },
    { id: 'how-to', label: t.toc.howTo },
    { id: 'stacking', label: t.toc.stacking },
    { id: 'faq', label: t.toc.faq },
    { id: 'products', label: t.toc.products },
    ...(regional ? [{ id: 'regional', label: regional.region.labels.toc }] : []),
    { id: 'related', label: t.toc.related },
  ];
  const howTo: Array<[label: string, value: string, emphasize: boolean]> = [
    [t.howToLabels.dosage, ing.howToTake.dosage, false],
    [t.howToLabels.timing, ing.howToTake.timing, false],
    [t.howToLabels.withFood, ing.howToTake.withFood, false],
    ...(ing.howToTake.cycling ? [[t.howToLabels.cycling, ing.howToTake.cycling, true] as [string, string, boolean]] : []),
    [t.howToLabels.forms, ing.howToTake.forms, false],
  ];

  const currentYear = new Date().getFullYear();
  const today = new Date();
  const updatedDisplay = today.toLocaleDateString(uiStrings.productDetail.dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  // ISO YYYY-MM-DD formatted in UTC so the rendered day never shifts with the
  // build machine's timezone.
  const evidenceReviewedDisplay = new Date(`${ing.evidenceReviewedAt}T00:00:00Z`).toLocaleDateString(
    uiStrings.productDetail.dateLocale,
    { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' },
  );

  // JSON-LD words in the page's language; the name, summary and effects come
  // from the (localized) ingredient record. The Organization names stay as
  // they are: "The Nootropic Lab Editorial Team" is also the author of every
  // page (buildPersonAuthorReference), one entity on every host.
  const ts = t.schema;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tpl(ts.headline, { name: ing.name }),
    description: ing.studySummary,
    datePublished: `${currentYear}-04-30`,
    dateModified: today.toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: siteUrl },
  };
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: tpl(ts.datasetName, { name: ing.name }),
    description: tpl(ts.datasetDescription, { name: ing.name, date: ing.evidenceReviewedAt }),
    url: `${siteUrl}/ingredients/${ing.slug}/`,
    keywords: [
      ing.name,
      t.relatedCategory[ing.category],
      ts.keywords.nootropic,
      ts.keywords.cognitiveSupplement,
      ts.keywords.clinicalTrial,
    ],
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
      description: tpl(e.studies !== undefined ? ts.effect : ts.effectNoStudies, {
        effect: e.effect,
        strength: t.evidenceStrength[e.evidenceStrength],
        studies: e.studies === 1 ? ts.studiesOne : tpl(ts.studiesMany, { n: e.studies ?? 0 }),
        magnitude: ts.magnitude[e.magnitude],
        notes: e.notes,
      }),
      additionalType: e.evidenceStrength,
    })),
    citation: ing.studySummary,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: uiStrings.breadcrumb.home, item: siteUrl },
      { '@type': 'ListItem', position: 2, name: uiStrings.breadcrumb.ingredients, item: `${siteUrl}/ingredients/` },
      { '@type': 'ListItem', position: 3, name: ing.name },
    ],
  };
  // No FAQPage/HowTo JSON-LD: Google retired both rich results (HowTo 2023,
  // FAQ 2026-05-07). FAQ + how-to-take stay as visible content below.

  return (
    <div className="bg-ds-card text-ds-ink ds-font-features" style={{ fontFamily: 'var(--font-ds-sans)' }}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={datasetSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <a href="#main-content" tabIndex={0} className="ds-skip-link">
        {uiStrings.nav.skipToContent}
      </a>
      {/* Ingredient pages render no buy link (product cards link to review
          pages), so the strip carries the site-level line. */}
      <FPDisclosure methodologyHref="/methodology/" strings={uiStrings.disclosure} scope="site" space={space} />
      <FPHeader searchItems={searchItems} strings={uiStrings} />

      <main id="main-content" className="max-w-[1100px] mx-auto px-6 pt-7">
        <nav aria-label={uiStrings.breadcrumb.ariaLabel} className="text-[12.5px] text-ds-muted mb-[18px]">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            <li><Link href="/" className="hover:text-ds-ink">{uiStrings.breadcrumb.home}</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li><Link href="/ingredients/" className="hover:text-ds-ink">{uiStrings.breadcrumb.ingredients}</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li aria-current="page" className="text-ds-ink font-medium">{ing.name}</li>
          </ol>
        </nav>

        {/* PR-Q25 (#89): single column below `md:` (WCAG 1.4.10 Reflow). */}
        <div className="grid gap-12 items-start grid-cols-1 md:grid-cols-[1fr_280px]">
          <article>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Chip tone="neutral">{t.category[ing.category]}</Chip>
              <Chip tone="accent">{t.chips.clinicalDose} · {ing.clinicalDose}</Chip>
              <Chip tone="warn">{t.chips.onset} · {ing.timeToEffect}</Chip>
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

            <FPByline updated={updatedDisplay} minutes={readMinutes} strings={uiStrings.byline} space={space} />
            <p className="text-[12.5px] text-ds-muted mt-2 mb-0">
              {te.evidenceReviewed}{space}
              <time dateTime={ing.evidenceReviewedAt}>{evidenceReviewedDisplay}</time>
            </p>

            <section id="mechanism" className="mt-9">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-3 text-ds-ink">{t.sections.mechanism}</h2>
              <p className="text-[15.5px] text-ds-ink-soft m-0 leading-[1.65]">{ing.mechanism}</p>
            </section>

            <section id="evidence" className="mt-8">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-3 text-ds-ink">{t.sections.evidence}</h2>
              <Card variant="subdued" padding={18}>
                <p className="text-[15px] text-ds-ink-soft m-0 leading-[1.65]">{ing.studySummary}</p>
              </Card>
            </section>

            <section id="effects" className="mt-8">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-1 text-ds-ink">{t.sections.effects}</h2>
              <p className="text-[13px] text-ds-muted mb-4">{t.humanTrialsOnly}</p>
              <Card padding={0}>
                <div className="overflow-x-auto overscroll-x-contain">
                  <table className="w-full text-[13.5px] border-collapse">
                    <thead>
                      <tr className="bg-ds-card-sub text-left">
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{t.table.effect}</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{t.table.evidence}</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{t.table.magnitude}</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em] text-center">{t.table.studies}</th>
                        <th className="px-4 py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em] hidden md:table-cell">{t.table.notes}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ing.humanEffects.map((effect) => {
                        const ev = EVIDENCE_TONE[effect.evidenceStrength];
                        const magWidth = MAGNITUDE_WIDTH[effect.magnitude] ?? 50;
                        const magLabel = t.magnitude[effect.magnitude] ?? '—';
                        return (
                          <tr key={effect.effect} className="border-t border-ds-border">
                            <td className="px-4 py-3 font-semibold text-ds-ink">{effect.effect}</td>
                            <td className="px-4 py-3">
                              <Chip tone={ev.tone}>
                                <span aria-hidden="true">{ev.dots}</span>{space}
                                {t.evidenceStrength[effect.evidenceStrength]}
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
                            <td className="px-4 py-3 text-center text-ds-ink ds-tabular">{effect.studies ?? '—'}</td>
                            <td className="px-4 py-3 text-[12.5px] text-ds-muted hidden md:table-cell">{effect.notes}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
              <p className="text-[11.5px] text-ds-muted mt-2">
                {t.evidenceKey.label}{space}
                <span aria-hidden="true">●●●</span>{space}{t.evidenceKey.strong} ·{' '}
                <span aria-hidden="true">●●○</span>{space}{t.evidenceKey.moderate} ·{' '}
                <span aria-hidden="true">●○○</span>{space}{t.evidenceKey.preliminary} ·{' '}
                <span aria-hidden="true">◐◐○</span>{space}{t.evidenceKey.mixed}
              </p>
            </section>

            <section id="benefits" className="mt-9">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-[20px] font-bold text-ds-ink mb-3">{t.sections.benefits}</h2>
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
                  <h2 className="text-[20px] font-bold text-ds-ink mb-3">{t.sections.sideEffects}</h2>
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
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">{t.sections.howTo}</h2>
              <Card variant="subdued" padding={0}>
                {howTo.map(([label, value, emphasize]) => (
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
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-1 text-ds-ink">{t.sections.stacking}</h2>
              <p className="text-[13px] text-ds-muted mb-4">{tpl(t.stackingLede, { name: ing.name })}</p>
              <div className="flex flex-col gap-3">
                {ing.stacksWith.map((pair) => (
                  <Card key={pair.ingredient} padding={16}>
                    <div className="flex gap-4">
                      <div className="shrink-0 w-28">
                        <Link
                          href={`/ingredients/${pair.slug}/`}
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
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">{t.sections.faq}</h2>
              <FaqAccordion
                items={ing.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))}
              />
            </section>

            {containingProducts.length > 0 && (
              <section id="products" className="mt-9">
                <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">
                  {tpl(t.topStacks, { name: ing.name })}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {containingProducts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/${p.slug}/`}
                      className="block bg-ds-card border border-ds-border rounded-[10px] p-4 hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                    >
                      <div className="flex justify-between items-start mb-1 gap-3">
                        <h3 className="font-bold text-ds-ink text-[14px] m-0">{p.name}</h3>
                        <span className={`${SCORE_TIER_TEXT_CLASS[scoreTier(p.score)]} font-bold text-[14px] ds-tabular shrink-0`}>{`${p.score}/10`}</span>
                      </div>
                      <p className="text-[12px] text-ds-muted m-0">{p.brand}</p>
                      {p.editorChoice && (
                        <span className="inline-block mt-2 text-[11px] bg-ds-accent-soft text-ds-accent px-2 py-[2px] rounded-full font-semibold">
                          {uiStrings.table.editorChoice}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {regional && (
              <RegionalAvailability {...regional} subjectName={ing.name} id="regional" />
            )}

            <section id="related" className="mt-9">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] mb-4 text-ds-ink">{t.sections.related}</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {relatedIngredients.slice(0, 6).map((other) => (
                  <Link
                    key={other.slug}
                    href={`/ingredients/${other.slug}/`}
                    className="block border border-ds-border rounded-[8px] p-3 hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                  >
                    <div className="font-semibold text-ds-ink text-[13.5px]">{other.name}</div>
                    <div className="text-[11.5px] text-ds-muted capitalize">{t.relatedCategory[other.category]}</div>
                  </Link>
                ))}
              </div>
            </section>

            <Sources
              heading={te.sources}
              expandLabel={uiStrings.guide.expand}
              space={space}
              sources={ing.sources.map((s) => ({
                label: `${s.title} (${s.year})`,
                url: s.url,
                ...(s.pmid ? { type: `PMID ${s.pmid}` } : {}),
              }))}
            />

            <div className="text-[13px] text-ds-muted mt-10 pb-10">
              <Link href="/ingredients/" className="text-ds-accent underline font-semibold">
                {uiStrings.breadcrumb.backToIngredientsGuide}
              </Link>
            </div>
          </article>

          <aside className="sticky top-[90px] self-start flex flex-col gap-[14px]">
            <Card padding={16}>
              <div className="text-[11px] tracking-[0.12em] uppercase font-bold text-ds-muted mb-[10px]">
                {t.sidebar.quickFacts}
              </div>
              <dl className="text-[13px] m-0">
                {[
                  [t.sidebar.category, t.category[ing.category]],
                  [t.sidebar.dose, ing.clinicalDose],
                  [t.sidebar.onset, ing.timeToEffect],
                  [t.sidebar.trials, `${ing.humanEffects.reduce((sum, e) => sum + (e.studies ?? 0), 0)}`],
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
                {t.sidebar.onThisPage}
              </div>
              <ul className="list-none p-0 m-0 flex flex-col">
                {tocSections.map((sec) => (
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

      <FPFooter strings={uiStrings} />
    </div>
  );
}
