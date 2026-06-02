import Link from 'next/link';
import SchemaOrg from '../SchemaOrg';
import Sources, { type Source } from '../Sources';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import { FPDisclosure } from '../public-chrome/FPDisclosure';
import { FPHeader } from '../public-chrome/FPHeader';
import { FPFooter } from '../public-chrome/FPFooter';
import { FPByline } from '../public-chrome/FPByline';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import { Bar } from '../primitives/Bar';
import { FaqAccordion } from '../primitives/FaqAccordion';
import { buildPersonAuthorReference } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import {
  useCaseListPageEnDefaults,
  tpl,
  type UseCaseListPageStrings,
} from '../templateStrings';
import type { SearchItem } from '../SearchModal';

export interface ListicleFAQ {
  q: string;
  a: string;
}

export interface ListicleIngredientMechanism {
  name: string;
  evidence: string;
  citationUrl?: string;
}

export interface ListiclePick {
  product: Product;
  whyItsHere: string;
  rank?: number;
}

export interface ListicleProps {
  /** Slug fragment used in URL (e.g. "focus", "adhd"). */
  useCase: string;
  /** H1 / page title without site suffix. */
  pageTitle: string;
  /** Meta description (used by Schema.org JSON-LD). */
  pageDescription: string;
  /** Hero paragraph rendered as dek below H1. */
  heroParagraph: string;
  ingredientMechanism: ListicleIngredientMechanism[];
  picks: ListiclePick[];
  faqItems: ListicleFAQ[];
  siteUrl: string;
  healthDisclaimer?: string;
  /** Where the listicle parent lives. Defaults to /best-nootropics. */
  listicleHref?: string;
  /** Locale string overrides. */
  strings?: Partial<UseCaseListPageStrings>;
  /** Optional Sources block rendered before the methodology section. */
  sources?: Source[];
  /** Search index for the ⌘K modal in FPHeader. */
  searchItems?: SearchItem[];
  /** Site UI strings (for the embedded SearchModal). */
  uiStrings?: UIStrings;
  /** Estimated read time displayed in FPByline. */
  readTime?: string;
}

const TODAY = new Date();

/**
 * Listicle — public/SEO template for "Best nootropics for {topic}" pages.
 * Drop-in replacement for the legacy UseCaseListPage with new Phase-2
 * chrome (FPDisclosure + FPHeader + FPFooter), team-only byline (no
 * medical reviewer per Phase 5), and new design tokens applied to all
 * content blocks. Content props are copied verbatim from the legacy
 * shape so existing pages can switch without rewriting copy.
 */
export default function Listicle({
  useCase,
  pageTitle,
  pageDescription,
  heroParagraph,
  ingredientMechanism,
  picks,
  faqItems,
  siteUrl,
  healthDisclaimer,
  listicleHref = '/best-nootropics',
  strings,
  sources,
  searchItems,
  uiStrings,
  readTime = '10 min',
}: ListicleProps) {
  const s: UseCaseListPageStrings = { ...useCaseListPageEnDefaults, ...strings };
  const currentYear = TODAY.getFullYear();
  const slugUrl = `${siteUrl}/best-nootropics-for-${useCase}/`;
  const updatedISO = TODAY.toISOString().split('T')[0];
  const updatedDisplay = TODAY.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const sortedPicks = [...picks].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${pageTitle} ${currentYear}`,
    description: pageDescription,
    datePublished: `${currentYear}-04-30`,
    dateModified: updatedISO,
    author: buildPersonAuthorReference(undefined, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: siteUrl },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#hero-paragraph', '.faq-question'],
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${pageTitle} ${currentYear}`,
    numberOfItems: picks.length,
    itemListElement: sortedPicks.map((p, i) => ({
      '@type': 'ListItem',
      position: p.rank ?? i + 1,
      name: p.product.name,
      url: `${siteUrl}/${p.product.slug}/`,
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: s.home, item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: s.bestNootropics, item: `${siteUrl}${listicleHref}/` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: slugUrl },
    ],
  };

  return (
    <div className="bg-ds-card text-ds-ink ds-font-features" style={{ fontFamily: 'var(--font-ds-sans)' }}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <a href="#main-content" className="ds-skip-link">
        {uiStrings?.nav.skipToContent ?? 'Skip to main content'}
      </a>
      <FPDisclosure methodologyHref="/methodology" />
      <FPHeader searchItems={searchItems} strings={uiStrings} />

      <main id="main-content" className="max-w-[1200px] mx-auto px-6 pt-7">
        <nav aria-label={uiStrings?.breadcrumb.ariaLabel ?? 'Breadcrumb'} className="text-[12.5px] text-ds-muted mb-[18px]">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            <li>
              <Link href="/" className="hover:text-ds-ink">{s.home}</Link>
            </li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li>
              <Link href={`${listicleHref}/`} className="hover:text-ds-ink">{s.bestNootropics}</Link>
            </li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li aria-current="page" className="text-ds-ink font-medium">{pageTitle}</li>
          </ol>
        </nav>

        <div
          className="grid gap-12 items-start"
          style={{ gridTemplateColumns: '1fr 320px' }}
        >
          <article>
            <Chip tone="accent">Audited · {updatedDisplay}</Chip>
            <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-0.025em] mt-3 mb-3 text-ds-ink">
              {pageTitle} {currentYear}
            </h1>
            <p
              id="hero-paragraph"
              className="text-[17px] leading-[1.55] text-ds-ink-soft m-0"
            >
              {heroParagraph}
            </p>

            <FPByline updated={updatedDisplay} read={readTime} />

            <aside
              role="note"
              className="bg-ds-warn-soft border-l-4 border-ds-warn rounded-r-[8px] p-4 mt-5 mb-7 text-[13px] text-ds-warn-ink"
            >
              <strong className="block mb-1">{s.healthDisclaimer}</strong>
              {healthDisclaimer || s.defaultHealthDisclaimer}
            </aside>

            <section className="my-10">
              <h2 className="text-[26px] font-bold text-ds-ink mb-3">{s.whatEvidenceSays}</h2>
              <p className="text-[14px] text-ds-muted mb-5 leading-[1.55]">{s.evidenceIntro}</p>
              <div className="flex flex-col gap-4">
                {ingredientMechanism.map((item) => (
                  <Card key={item.name} padding={20}>
                    <h3 className="font-semibold text-[15px] text-ds-ink m-0 mb-2">{item.name}</h3>
                    <p className="text-[13.5px] text-ds-ink-soft leading-[1.6] m-0">{item.evidence}</p>
                    {item.citationUrl && (
                      <a
                        href={item.citationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-[12.5px] text-ds-accent underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                      >
                        {s.sourceLink}
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            <section className="my-10">
              <h2 className="text-[26px] font-bold text-ds-ink mb-2">
                {s.ourPicksFor} {useCase}
              </h2>
              <p className="text-[14px] text-ds-muted mb-6">{s.picksIntro}</p>

              <div className="flex flex-col gap-5">
                {sortedPicks.map((pick, i) => {
                  const rank = pick.rank ?? i + 1;
                  const isTop = i === 0;
                  return (
                    <Card key={pick.product.slug} padding={0} as="article">
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Chip tone={isTop ? 'accent' : 'neutral'}>
                            #{rank}
                            {isTop ? ` · ${s.topPick}` : ''}
                          </Chip>
                          {pick.product.caffeineFree ? (
                            <Chip tone="good">Caffeine-free</Chip>
                          ) : (
                            <Chip tone="warn">Caffeine</Chip>
                          )}
                          {pick.product.handsOnTested && (
                            <Chip tone="accent">★ Hands-on tested</Chip>
                          )}
                          <span className="text-[12px] text-ds-muted ml-1">{pick.product.brand}</span>
                        </div>

                        <h3
                          id={`pick-${pick.product.slug}`}
                          className="text-[28px] font-bold tracking-[-0.02em] text-ds-ink m-0 mb-1"
                        >
                          {pick.product.name}
                        </h3>
                        <div className="text-[12.5px] text-ds-muted mb-4 ds-tabular">
                          {pick.product.priceMonthlyUSD && (
                            <>
                              ${pick.product.priceMonthlyUSD}/mo · {pick.product.capsulesPerServing} caps/day · {pick.product.moneyBackDays}d MBG
                            </>
                          )}
                        </div>

                        <div
                          className="grid gap-6 items-start"
                          style={{ gridTemplateColumns: '1fr 220px' }}
                        >
                          <div>
                            <p className="text-[14px] leading-[1.6] text-ds-ink-soft m-0">
                              <strong className="text-ds-ink">{s.whyItsHere}</strong> {pick.whyItsHere}
                            </p>
                            <div className="flex gap-3 flex-wrap mt-4">
                              <TrackedAffiliateLink
                                product={pick.product}
                                position={rank}
                                surface="listicle"
                                className="bg-ds-accent hover:bg-ds-accent-press text-white text-[13px] font-semibold px-5 py-[10px] rounded-[8px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                              >
                                {tpl(s.checkProduct, { name: pick.product.name })}
                              </TrackedAffiliateLink>
                              <Link
                                href={`/${pick.product.slug}/`}
                                className="bg-ds-card hover:bg-ds-card-sub text-ds-ink text-[13px] font-semibold px-5 py-[10px] rounded-[8px] border border-ds-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
                              >
                                {s.readFullReview}
                              </Link>
                            </div>
                          </div>

                          <Card variant="subdued" padding={16}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[11px] uppercase tracking-[0.12em] text-ds-muted font-semibold">
                                Our score
                              </span>
                              <ScorePill score={pick.product.score} />
                            </div>
                            <div className="flex flex-col gap-[6px]">
                              {(['ingredients', 'dosing', 'transparency'] as const).map((key) => {
                                const v = pick.product.scoreBreakdown[key];
                                return (
                                  <div
                                    key={key}
                                    className="grid items-center gap-2"
                                    style={{ gridTemplateColumns: '92px 1fr 24px' }}
                                  >
                                    <span className="text-[11px] text-ds-muted capitalize">{key}</span>
                                    <Bar
                                      value={v}
                                      label={`${pick.product.name} ${key} score`}
                                    />
                                    <span className="text-[11px] text-ds-ink text-right ds-tabular">{v}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </Card>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="my-10">
              <h2 className="text-[26px] font-bold text-ds-ink mb-4">{s.faqHeading}</h2>
              <FaqAccordion items={faqItems} />
            </section>

            {sources && sources.length > 0 && <Sources sources={sources} />}

            <Card
              variant="subdued"
              padding={24}
              className="my-10 border-l-[3px] border-l-ds-accent"
              style={{ borderLeftWidth: 3 }}
            >
              <h2 className="text-[18px] font-bold text-ds-ink mb-2">{s.howWeChoose}</h2>
              <p className="text-[14px] leading-[1.6] text-ds-ink-soft mb-3">
                {s.howWeChooseBody}{' '}
                <Link href="/methodology/" className="text-ds-accent underline">
                  {s.fullMethodology}
                </Link>
                .
              </p>
              <Link
                href={`${listicleHref}/`}
                className="text-ds-accent underline text-[13px] font-semibold"
              >
                {tpl(s.backToBest, { year: currentYear })}
              </Link>
            </Card>
          </article>

          <aside className="sticky top-[90px] self-start">
            <Card padding={20}>
              <div className="text-[11px] uppercase tracking-[0.12em] text-ds-muted font-semibold mb-3">
                In this guide
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                {sortedPicks.map((pick, i) => (
                  <li key={pick.product.slug} className="text-[13px]">
                    <a
                      href={`#pick-${pick.product.slug}`}
                      className="text-ds-ink-soft hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded"
                    >
                      <span className="text-ds-muted ds-tabular mr-2">
                        #{pick.rank ?? i + 1}
                      </span>
                      {pick.product.name}
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
