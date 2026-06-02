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
  headToHeadPageEnDefaults,
  tpl,
  type HeadToHeadPageStrings,
} from '../templateStrings';
import type { SearchItem } from '../SearchModal';

export interface HeadToHeadFAQ {
  q: string;
  a: string;
}

export interface HeadToHeadProps {
  productA: Product;
  productB: Product;
  siteUrl: string;
  /** Override the computed verdict paragraph. */
  verdictParagraph?: string;
  faqItems: HeadToHeadFAQ[];
  /** Bullet points for "Choose A if you …" */
  whoIsForA: string[];
  /** Bullet points for "Choose B if you …" */
  whoIsForB: string[];
  listicleHref?: string;
  formatPrice?: (product: Product) => string;
  strings?: Partial<HeadToHeadPageStrings>;
  healthDisclaimer?: string;
  sources?: Source[];
  searchItems?: SearchItem[];
  uiStrings?: UIStrings;
  readTime?: string;
}

function defaultPriceFormat(p: Product): string {
  if (p.priceMonthlyUSD) return `$${p.priceMonthlyUSD}`;
  if (p.priceMonthlyEUR) return `€${p.priceMonthlyEUR}`;
  if (p.priceMonthlyCAD) return `C$${p.priceMonthlyCAD}`;
  if (p.priceMonthlyAUD) return `A$${p.priceMonthlyAUD}`;
  if (p.priceMonthlyJPY) return `¥${p.priceMonthlyJPY.toLocaleString()}`;
  return 'Varies';
}

type SpecRow = {
  label: string;
  a: string;
  b: string;
  winner: 'a' | 'b' | 'tie';
};

type IngredientRow = {
  name: string;
  clinicalDose: string;
  aDose: string | null;
  aAdequate: boolean | null;
  bDose: string | null;
  bAdequate: boolean | null;
};

function buildIngredientRows(a: Product, b: Product): IngredientRow[] {
  const map = new Map<string, IngredientRow>();
  for (const ing of a.ingredientDosages) {
    map.set(ing.name, {
      name: ing.name,
      clinicalDose: ing.clinicalDose,
      aDose: ing.doseInProduct,
      aAdequate: ing.adequatelyDosed,
      bDose: null,
      bAdequate: null,
    });
  }
  for (const ing of b.ingredientDosages) {
    const existing = map.get(ing.name);
    if (existing) {
      existing.bDose = ing.doseInProduct;
      existing.bAdequate = ing.adequatelyDosed;
    } else {
      map.set(ing.name, {
        name: ing.name,
        clinicalDose: ing.clinicalDose,
        aDose: null,
        aAdequate: null,
        bDose: ing.doseInProduct,
        bAdequate: ing.adequatelyDosed,
      });
    }
  }
  return Array.from(map.values());
}

/**
 * HeadToHead — public/SEO template for "A vs B" comparison pages.
 * Drop-in replacement for the legacy HeadToHeadPage. Same prop interface
 * (minus author/medical reviewer per Phase 5). Renders Phase-2 chrome
 * (FPDisclosure + FPHeader + FPFooter), Phase-1 design tokens, and the
 * design's centered hero + side-by-side card layout. Existing copy and
 * Schema.org JSON-LD are preserved verbatim.
 */
export default function HeadToHead({
  productA,
  productB,
  siteUrl,
  verdictParagraph,
  faqItems,
  whoIsForA,
  whoIsForB,
  listicleHref = '/best-nootropics',
  formatPrice = defaultPriceFormat,
  strings,
  healthDisclaimer,
  sources,
  searchItems,
  uiStrings,
  readTime = '9 min',
}: HeadToHeadProps) {
  const s: HeadToHeadPageStrings = { ...headToHeadPageEnDefaults, ...strings };
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const updatedDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const winner = productA.score >= productB.score ? productA : productB;
  const loser = winner === productA ? productB : productA;
  const ingredientRows = buildIngredientRows(productA, productB);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${productA.name} vs ${productB.name} ${currentYear}: Head-to-Head Clinical Dosing Audit`,
    datePublished: `${currentYear}-04-30`,
    dateModified: today.toISOString().split('T')[0],
    author: buildPersonAuthorReference(undefined, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
    reviewedBy: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team', url: siteUrl },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hero-paragraph', '.faq-question'] },
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
    name: `${productA.name} vs ${productB.name} comparison`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: productA.name, url: `${siteUrl}/${productA.slug}/` },
      { '@type': 'ListItem', position: 2, name: productB.name, url: `${siteUrl}/${productB.slug}/` },
    ],
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: s.home, item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: s.bestNootropics, item: `${siteUrl}${listicleHref}/` },
      { '@type': 'ListItem', position: 3, name: `${productA.name} vs ${productB.name}` },
    ],
  };

  const computedVerdict =
    verdictParagraph ??
    `${winner.name} scores ${winner.score}/10 in our 5-pillar audit; ${loser.name} scores ${loser.score}/10. The biggest delta is at the formula-transparency pillar — see the dosing table below.`;

  const specRows: SpecRow[] = [
    {
      label: s.pricePerMonth,
      a: formatPrice(productA),
      b: formatPrice(productB),
      winner: (productA.priceMonthlyUSD ?? Infinity) < (productB.priceMonthlyUSD ?? Infinity) ? 'a' : 'b',
    },
    {
      label: s.capsulesPerServing,
      a: `${productA.capsulesPerServing}`,
      b: `${productB.capsulesPerServing}`,
      winner: productA.capsulesPerServing < productB.capsulesPerServing
        ? 'a'
        : productA.capsulesPerServing > productB.capsulesPerServing
          ? 'b'
          : 'tie',
    },
    {
      label: s.moneyBack,
      a: `${productA.moneyBackDays} ${s.daysSuffix}`,
      b: `${productB.moneyBackDays} ${s.daysSuffix}`,
      winner: productA.moneyBackDays > productB.moneyBackDays ? 'a' : productA.moneyBackDays < productB.moneyBackDays ? 'b' : 'tie',
    },
    {
      label: s.caffeineFreeLabel,
      a: productA.caffeineFree ? s.yes : s.no,
      b: productB.caffeineFree ? s.yes : s.no,
      winner: productA.caffeineFree === productB.caffeineFree ? 'tie' : productA.caffeineFree ? 'a' : 'b',
    },
    {
      label: s.trustpilot,
      a: productA.trustpilotScore
        ? `${productA.trustpilotScore}/5 (${productA.trustpilotCount?.toLocaleString() ?? 'n/a'})`
        : s.notTracked,
      b: productB.trustpilotScore
        ? `${productB.trustpilotScore}/5 (${productB.trustpilotCount?.toLocaleString() ?? 'n/a'})`
        : s.notTracked,
      winner: (productA.trustpilotScore ?? 0) > (productB.trustpilotScore ?? 0)
        ? 'a'
        : (productA.trustpilotScore ?? 0) < (productB.trustpilotScore ?? 0)
          ? 'b'
          : 'tie',
    },
    {
      label: 'Ingredients pillar',
      a: `${productA.scoreBreakdown.ingredients}/10`,
      b: `${productB.scoreBreakdown.ingredients}/10`,
      winner: productA.scoreBreakdown.ingredients > productB.scoreBreakdown.ingredients ? 'a' : productA.scoreBreakdown.ingredients < productB.scoreBreakdown.ingredients ? 'b' : 'tie',
    },
    {
      label: 'Dosing pillar',
      a: `${productA.scoreBreakdown.dosing}/10`,
      b: `${productB.scoreBreakdown.dosing}/10`,
      winner: productA.scoreBreakdown.dosing > productB.scoreBreakdown.dosing ? 'a' : productA.scoreBreakdown.dosing < productB.scoreBreakdown.dosing ? 'b' : 'tie',
    },
    {
      label: 'Transparency pillar',
      a: `${productA.scoreBreakdown.transparency}/10`,
      b: `${productB.scoreBreakdown.transparency}/10`,
      winner: productA.scoreBreakdown.transparency > productB.scoreBreakdown.transparency ? 'a' : productA.scoreBreakdown.transparency < productB.scoreBreakdown.transparency ? 'b' : 'tie',
    },
  ];

  return (
    <div className="bg-ds-bg text-ds-ink ds-font-features" style={{ fontFamily: 'var(--font-ds-sans)' }}>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <FPDisclosure methodologyHref="/methodology" />
      <a href="#main-content" className="ds-skip-link">
        {uiStrings?.nav.skipToContent ?? 'Skip to main content'}
      </a>
      <FPHeader searchItems={searchItems} strings={uiStrings} />

      <main id="main-content" className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-7">
        <nav aria-label="Breadcrumb" className="text-[12.5px] text-ds-muted mb-[14px]">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            <li><Link href="/" className="hover:text-ds-ink">{s.home}</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li><Link href={`${listicleHref}/`} className="hover:text-ds-ink">{s.bestNootropics}</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li aria-current="page" className="text-ds-ink font-medium">{productA.name} vs {productB.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="text-center pt-6 pb-4">
          <Chip tone="accent">Head-to-head · {updatedDisplay}</Chip>
          <h1 className="text-[32px] sm:text-[44px] font-bold leading-[1.1] tracking-[-0.025em] mt-4 mb-2 text-ds-ink">
            {productA.name} <span className="text-ds-muted font-medium">vs</span> {productB.name}
          </h1>
          <p
            id="hero-paragraph"
            className="text-[17px] text-ds-ink-soft max-w-[640px] mx-auto leading-[1.55] m-0"
          >
            Two flagship nootropics, audited side by side. Same rubric, same rules. Here&apos;s which one wins on each
            dimension — and which one wins overall.
          </p>
        </header>

        <FPByline updated={updatedDisplay} read={readTime} />

        {healthDisclaimer && (
          <aside
            role="note"
            className="bg-ds-warn-soft border-l-4 border-ds-warn rounded-r-[8px] p-4 mt-5 text-[13px] text-ds-warn-ink"
          >
            <strong className="block mb-1">Health &amp; regulatory note</strong>
            {healthDisclaimer}
          </aside>
        )}

        {/* Two side cards + VS — stacks vertically on mobile */}
        <div className="grid gap-3 mt-8 items-stretch grid-cols-1 lg:grid-cols-[1fr_80px_1fr]">
          {[productA, productB].map((p, idx) => (
            <Card key={p.id} padding={22}>
              <div
                className="w-14 h-14 rounded-[12px] grid place-items-center text-white font-extrabold text-[22px]"
                style={{ background: idx === 0 ? 'var(--color-ds-accent)' : 'var(--color-ds-ink)' }}
                aria-hidden="true"
              >
                {p.name[0]}
              </div>
              <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-4 mb-1">{p.name}</h2>
              <div className="text-ds-muted text-[13px]">{p.brand}</div>
              <div className="flex items-baseline gap-[6px] mt-[18px] pt-4 border-t border-ds-border">
                <span
                  className="text-[44px] font-bold tracking-[-0.03em] ds-tabular"
                  style={{
                    color:
                      p.score >= 8.5
                        ? 'var(--color-ds-good)'
                        : p.score >= 7.5
                          ? 'var(--color-ds-warn-ink)'
                          : 'var(--color-ds-bad)',
                  }}
                >
                  {p.score.toFixed(1)}
                </span>
                <span className="text-[13px] text-ds-muted">/10</span>
              </div>
              <div className="text-[11px] text-ds-muted uppercase tracking-[0.1em] font-semibold mt-[2px]">
                Our score
              </div>
              <p className="text-[13.5px] text-ds-ink-soft mt-4 leading-[1.6]">{p.summary}</p>
              <TrackedAffiliateLink
                product={p}
                position={idx + 1}
                surface="h2h"
                className="block w-full mt-[14px] bg-ds-accent hover:bg-ds-accent-press text-white text-[13px] font-semibold py-[10px] rounded-[8px] text-center focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                {tpl(s.checkProductWithPrice, { name: p.name, price: formatPrice(p) })}
              </TrackedAffiliateLink>
            </Card>
          ))}
          {/* "VS" divider — column 2 on desktop, hidden on mobile (the cards stack
              so a horizontal VS makes no sense). */}
          <div className="hidden lg:grid place-items-center" style={{ gridColumn: 2, gridRow: 1 }}>
            <div className="text-[28px] font-extrabold text-ds-muted tracking-[-0.04em]">VS</div>
          </div>
        </div>

        {/* TLDR verdict */}
        <Card variant="subdued" padding={22} className="mt-6">
          <div className="text-[11.5px] tracking-[0.14em] uppercase font-bold text-ds-muted mb-2">
            {s.verdict}
          </div>
          <h2 className="text-[22px] font-bold tracking-[-0.02em] m-0 mb-2">
            <span className="text-ds-accent">{tpl(s.winnerHeadline, { name: winner.name })}</span>
          </h2>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{computedVerdict}</p>
        </Card>

        {/* Side-by-side specs */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-3">{s.quickSpecsHeading}</h2>
        <Card padding={0}>
          <div
            className="grid bg-ds-card-sub border-b border-ds-border px-[22px] py-3 text-[11px] uppercase tracking-[0.1em] font-bold text-ds-muted"
            style={{ gridTemplateColumns: '120px 1fr 1fr' }}
          >
            <div>{s.spec}</div>
            <div className="text-center">{productA.name}</div>
            <div className="text-center">{productB.name}</div>
          </div>
          {specRows.map((row) => (
            <div
              key={row.label}
              className="grid px-[22px] py-[13px] border-b border-ds-border last:border-b-0 items-center text-[13.5px]"
              style={{ gridTemplateColumns: '120px 1fr 1fr' }}
            >
              <div className="text-ds-muted font-medium">{row.label}</div>
              <div
                className={`text-center px-2 py-1 rounded-[6px] ${
                  row.winner === 'a'
                    ? 'bg-ds-accent-soft text-ds-accent font-bold'
                    : 'text-ds-ink font-medium'
                }`}
              >
                {row.a}
                {row.winner === 'a' && ' ✓'}
              </div>
              <div
                className={`text-center px-2 py-1 rounded-[6px] ${
                  row.winner === 'b'
                    ? 'bg-ds-accent-soft text-ds-accent font-bold'
                    : 'text-ds-ink font-medium'
                }`}
              >
                {row.b}
                {row.winner === 'b' && ' ✓'}
              </div>
            </div>
          ))}
        </Card>

        {/* Clinical dosing table */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-3">{s.clinicalDosingHeading}</h2>
        <p className="text-[14px] text-ds-muted mb-4 leading-[1.55]">{s.clinicalDosingIntro}</p>
        <Card padding={0}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-ds-card-sub text-left">
                  <th className="px-[22px] py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{s.ingredient}</th>
                  <th className="px-[22px] py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{s.clinicalDose}</th>
                  <th className="px-[22px] py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{productA.name}</th>
                  <th className="px-[22px] py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{productB.name}</th>
                </tr>
              </thead>
              <tbody>
                {ingredientRows.map((row) => (
                  <tr key={row.name} className="border-t border-ds-border">
                    <td className="px-[22px] py-3 text-ds-ink font-medium">{row.name}</td>
                    <td className="px-[22px] py-3 text-ds-muted text-[12.5px]">{row.clinicalDose}</td>
                    <td className="px-[22px] py-3 text-ds-ink ds-tabular">
                      {row.aDose ? (
                        <span className="inline-flex items-center gap-1">
                          {row.aDose}
                          {row.aAdequate ? (
                            <span className="text-ds-good font-bold" aria-label="adequately dosed">✓</span>
                          ) : (
                            <span className="text-ds-bad font-bold" aria-label="underdosed">✗</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-ds-faint">—</span>
                      )}
                    </td>
                    <td className="px-[22px] py-3 text-ds-ink ds-tabular">
                      {row.bDose ? (
                        <span className="inline-flex items-center gap-1">
                          {row.bDose}
                          {row.bAdequate ? (
                            <span className="text-ds-good font-bold" aria-label="adequately dosed">✓</span>
                          ) : (
                            <span className="text-ds-bad font-bold" aria-label="underdosed">✗</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-ds-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-[12px] text-ds-muted mt-3 italic">
          {s.citationFooter}{' '}
          <Link href="/methodology/" className="text-ds-accent underline">{s.methodologyLink}</Link>.
        </p>

        {/* Score breakdown bars */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-4">{s.scoreBreakdownHeading}</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[productA, productB].map((p) => (
            <Card key={p.id} padding={20}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-ds-ink text-[15px]">{p.name}</div>
                <ScorePill score={p.score} />
              </div>
              <div className="flex flex-col gap-3">
                {(Object.entries(p.scoreBreakdown) as [string, number][]).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between mb-1 text-ds-ink text-[13px]">
                      <span className="capitalize">{k}</span>
                      <span className="font-semibold ds-tabular">{v}/10</span>
                    </div>
                    <Bar value={v} label={`${p.name} ${k} score`} />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Pros / Cons */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-4">{s.prosConsHeading}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[productA, productB].map((p) => (
            <div key={p.id}>
              <div className="font-bold text-ds-ink mb-3 text-[15px]">{p.name}</div>
              <Card padding={16} className="bg-ds-good-soft border-0 mb-3" style={{ background: 'var(--color-ds-good-soft)', border: 0 }}>
                <h3 className="font-semibold text-ds-good-ink mb-2 text-[13px]">{s.prosLabel}</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {p.pros.map((pro) => (
                    <li key={pro} className="flex gap-2 text-[13px] text-ds-good-ink">
                      <span className="shrink-0" aria-hidden="true">✓</span><span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card padding={16} style={{ background: 'var(--color-ds-bad-soft)', border: 0 }}>
                <h3 className="font-semibold text-ds-bad-ink mb-2 text-[13px]">{s.consLabel}</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-2">
                  {p.cons.map((con) => (
                    <li key={con} className="flex gap-2 text-[13px] text-ds-bad-ink">
                      <span className="shrink-0" aria-hidden="true">✗</span><span>{con}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>

        {/* Choose A / Choose B */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-4">{s.whoIsForHeading}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { p: productA, lines: whoIsForA },
            { p: productB, lines: whoIsForB },
          ].map(({ p, lines }) => (
            <Card key={p.id} padding={20}>
              <h3 className="font-bold text-ds-ink mb-3 text-[15px]">
                {tpl(s.chooseIfYou, { name: p.name })}
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-2 text-[13.5px] text-ds-ink-soft">
                {lines.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span aria-hidden="true" className="text-ds-muted">·</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-4">{s.faqHeading}</h2>
        <FaqAccordion items={faqItems} />

        {sources && sources.length > 0 && <Sources sources={sources} />}

        {/* Read individual reviews */}
        <Card variant="subdued" padding={24} className="mt-11" style={{ borderLeftWidth: 3 }}>
          <h2 className="text-[18px] font-bold text-ds-ink mb-4">{s.readReviewsHeading}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: `/${productA.slug}/`, title: tpl(s.productReviewCard, { name: productA.name }), meta: tpl(s.scoreCardLine, { score: productA.score }) },
              { href: `/${productB.slug}/`, title: tpl(s.productReviewCard, { name: productB.name }), meta: tpl(s.scoreCardLine, { score: productB.score }) },
              { href: `${listicleHref}/`, title: tpl(s.bestNootropicsCard, { year: currentYear }), meta: s.fullRankedComparison },
              { href: '/methodology/', title: s.methodologyCard, meta: s.howWeAuditDoses },
            ].map((c) => (
              <Link
                key={c.href + c.title}
                href={c.href}
                className="block bg-ds-card rounded-[10px] p-4 border border-ds-border hover:border-ds-accent-border focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
              >
                <div className="font-semibold text-ds-ink text-[13.5px] mb-1">{c.title}</div>
                <div className="text-[12px] text-ds-muted">{c.meta}</div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="text-[13px] text-ds-muted mt-10 pb-10">
          <Link href={`${listicleHref}/`} className="text-ds-accent underline font-semibold">
            {tpl(s.backToBest, { year: currentYear })}
          </Link>
        </div>
      </main>

      <FPFooter strings={uiStrings} />
    </div>
  );
}
