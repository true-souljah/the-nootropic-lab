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
import { FaqAccordion } from '../primitives/FaqAccordion';
import { buildPersonAuthorReference } from '@nootropic/data';
import type { Product, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';

export interface ThreeWayFAQ {
  q: string;
  a: string;
}

export interface ThreeWayProps {
  productA: Product;
  productB: Product;
  productC: Product;
  siteUrl: string;
  verdictParagraph?: string;
  faqItems: ThreeWayFAQ[];
  whoIsForA: string[];
  whoIsForB: string[];
  whoIsForC: string[];
  listicleHref?: string;
  formatPrice?: (product: Product) => string;
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

type IngredientRow = {
  name: string;
  clinicalDose: string;
  a: { dose: string | null; adequate: boolean | null };
  b: { dose: string | null; adequate: boolean | null };
  c: { dose: string | null; adequate: boolean | null };
};

function buildIngredientRows(a: Product, b: Product, c: Product): IngredientRow[] {
  const map = new Map<string, IngredientRow>();
  function seed(key: 'a' | 'b' | 'c', product: Product) {
    for (const ing of product.ingredientDosages) {
      let row = map.get(ing.name);
      if (!row) {
        row = {
          name: ing.name,
          clinicalDose: ing.clinicalDose,
          a: { dose: null, adequate: null },
          b: { dose: null, adequate: null },
          c: { dose: null, adequate: null },
        };
        map.set(ing.name, row);
      }
      row[key] = { dose: ing.doseInProduct, adequate: ing.adequatelyDosed };
    }
  }
  seed('a', a);
  seed('b', b);
  seed('c', c);
  return Array.from(map.values());
}

type SpecRow = {
  label: string;
  values: [string, string, string];
  /** Index of the winning column (0/1/2), or null for a three-way tie. */
  winner: 0 | 1 | 2 | null;
};

function bestIndex(scores: number[]): 0 | 1 | 2 | null {
  const max = Math.max(...scores);
  const winners = scores.filter((s) => s === max);
  if (winners.length > 1) return null;
  return scores.indexOf(max) as 0 | 1 | 2;
}

/**
 * ThreeWay — public/SEO template for "A vs B vs C" comparison pages.
 * Drop-in replacement for the legacy ThreeWayComparisonPage. Phase-2
 * podium layout (winner in middle, taller), side-by-side-by-side specs
 * with accent-tinted winner cells, clinical dosing audit, "Choose A/B/C"
 * cards, FAQ, sources. Phase-5 byline (team-only).
 */
export default function ThreeWay({
  productA,
  productB,
  productC,
  siteUrl,
  verdictParagraph,
  faqItems,
  whoIsForA,
  whoIsForB,
  whoIsForC,
  listicleHref = '/best-nootropics',
  formatPrice = defaultPriceFormat,
  healthDisclaimer,
  sources,
  searchItems,
  uiStrings,
  readTime = '14 min',
}: ThreeWayProps) {
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const updatedDisplay = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const products = [productA, productB, productC];

  // Sort by score descending for the podium and verdict winner
  const ranked = [...products].sort((x, y) => y.score - x.score);
  const winner = ranked[0];

  // Podium layout: [2nd, 1st, 3rd] — winner sits in the middle column
  const podiumOrder: Array<{ product: Product; place: 1 | 2 | 3 }> = [
    { product: ranked[1], place: 2 },
    { product: ranked[0], place: 1 },
    { product: ranked[2], place: 3 },
  ];

  const ingredientRows = buildIngredientRows(productA, productB, productC);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${productA.name} vs ${productB.name} vs ${productC.name} ${currentYear}: Three-Way Clinical Dosing Audit`,
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
    name: `${productA.name} vs ${productB.name} vs ${productC.name} comparison`,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${siteUrl}/${p.slug}/`,
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics', item: `${siteUrl}${listicleHref}/` },
      { '@type': 'ListItem', position: 3, name: `${productA.name} vs ${productB.name} vs ${productC.name}` },
    ],
  };

  const computedVerdict =
    verdictParagraph ??
    `${winner.name} earns the highest score (${winner.score}/10) of the three. See the dosing audit + score breakdown below for the full reasoning.`;

  const specRows: SpecRow[] = [
    {
      label: 'Our score',
      values: [productA.score.toFixed(1), productB.score.toFixed(1), productC.score.toFixed(1)],
      winner: bestIndex([productA.score, productB.score, productC.score]),
    },
    {
      label: 'Price / month',
      values: products.map((p) => formatPrice(p)) as [string, string, string],
      winner: bestIndex(products.map((p) => -(p.priceMonthlyUSD ?? Infinity))),
    },
    {
      label: 'Caps / day',
      values: products.map((p) => `${p.capsulesPerServing}`) as [string, string, string],
      winner: bestIndex(products.map((p) => -p.capsulesPerServing)),
    },
    {
      label: 'Money-back',
      values: products.map((p) => `${p.moneyBackDays} days`) as [string, string, string],
      winner: bestIndex(products.map((p) => p.moneyBackDays)),
    },
    {
      label: 'Caffeine-free',
      values: products.map((p) => (p.caffeineFree ? 'Yes' : 'No')) as [string, string, string],
      winner: bestIndex(products.map((p) => (p.caffeineFree ? 1 : 0))),
    },
    {
      label: 'Trustpilot',
      values: products.map((p) =>
        p.trustpilotScore
          ? `${p.trustpilotScore}/5 (${p.trustpilotCount?.toLocaleString() ?? 'n/a'})`
          : 'Not tracked'
      ) as [string, string, string],
      winner: bestIndex(products.map((p) => p.trustpilotScore ?? 0)),
    },
    {
      label: 'Ingredients pillar',
      values: products.map((p) => `${p.scoreBreakdown.ingredients}/10`) as [string, string, string],
      winner: bestIndex(products.map((p) => p.scoreBreakdown.ingredients)),
    },
    {
      label: 'Dosing pillar',
      values: products.map((p) => `${p.scoreBreakdown.dosing}/10`) as [string, string, string],
      winner: bestIndex(products.map((p) => p.scoreBreakdown.dosing)),
    },
    {
      label: 'Transparency pillar',
      values: products.map((p) => `${p.scoreBreakdown.transparency}/10`) as [string, string, string],
      winner: bestIndex(products.map((p) => p.scoreBreakdown.transparency)),
    },
    {
      label: 'Value pillar',
      values: products.map((p) => `${p.scoreBreakdown.value}/10`) as [string, string, string],
      winner: bestIndex(products.map((p) => p.scoreBreakdown.value)),
    },
  ];

  function renderDose(cell: { dose: string | null; adequate: boolean | null }) {
    if (!cell.dose) return <span className="text-ds-faint">—</span>;
    return (
      <span className="inline-flex items-center gap-1">
        {cell.dose}
        {cell.adequate ? (
          <span className="text-ds-good font-bold" aria-label="adequately dosed">✓</span>
        ) : (
          <span className="text-ds-bad font-bold" aria-label="underdosed">✗</span>
        )}
      </span>
    );
  }

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

      <main id="main-content" className="max-w-[1200px] mx-auto px-6 pt-7">
        <nav aria-label={uiStrings?.breadcrumb.ariaLabel ?? 'Breadcrumb'} className="text-[12.5px] text-ds-muted mb-[14px]">
          <ol className="flex items-center gap-2 list-none p-0 m-0">
            <li><Link href="/" className="hover:text-ds-ink">{uiStrings?.breadcrumb.home ?? 'Home'}</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li><Link href={`${listicleHref}/`} className="hover:text-ds-ink">{uiStrings?.nav.bestNootropics ?? 'Best Nootropics'}</Link></li>
            <li aria-hidden="true" className="text-ds-faint">/</li>
            <li aria-current="page" className="text-ds-ink font-medium">
              {productA.name} vs {productB.name} vs {productC.name}
            </li>
          </ol>
        </nav>

        <header className="text-center pt-5 pb-3">
          <Chip tone="accent">Three-way head-to-head · {updatedDisplay}</Chip>
          <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.025em] mt-4 mb-2 text-ds-ink">
            {productA.name} <span className="text-ds-muted font-medium">vs</span>{' '}
            {productB.name} <span className="text-ds-muted font-medium">vs</span>{' '}
            {productC.name}
          </h1>
          <p
            id="hero-paragraph"
            className="text-[16px] text-ds-ink-soft max-w-[680px] mx-auto leading-[1.55] m-0"
          >
            Three flagship nootropics, audited side by side by side. Same rubric, same rules. Here&apos;s which one wins
            overall and which one wins on each dimension.
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

        {/* Podium */}
        <div
          className="grid gap-[14px] mt-8 mb-[14px] items-end"
          style={{ gridTemplateColumns: '1fr 1.1fr 1fr' }}
        >
          {podiumOrder.map(({ product: p, place }) => {
            const heightPx = place === 1 ? 260 : place === 2 ? 220 : 190;
            const badgeBg =
              place === 1 ? 'var(--color-ds-accent)' : place === 2 ? 'var(--color-ds-ink)' : 'var(--color-ds-muted)';
            return (
              <Card
                key={p.slug}
                padding={20}
                className="relative flex flex-col justify-end"
                style={{ minHeight: heightPx }}
              >
                <div
                  className="absolute top-4 right-4 text-white rounded-full px-3 py-1 text-[11.5px] font-bold tracking-[0.04em]"
                  style={{ background: badgeBg }}
                  aria-label={`Rank ${place}`}
                >
                  #{place}
                </div>
                <div
                  className="w-11 h-11 rounded-[10px] grid place-items-center text-white font-extrabold text-[18px] mb-3"
                  style={{ background: badgeBg }}
                  aria-hidden="true"
                >
                  {p.name[0]}
                </div>
                <div className="text-[18px] font-bold tracking-[-0.015em] text-ds-ink">{p.name}</div>
                <div className="text-ds-muted text-[12px] mt-[2px]">{p.brand}</div>
                <div className="flex items-baseline gap-1 mt-[10px]">
                  <span
                    className="text-[32px] font-bold tracking-[-0.03em] ds-tabular"
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
                  <span className="text-[11px] text-ds-muted">/10</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Verdict */}
        <Card variant="subdued" padding={22} className="mt-[18px]">
          <div className="text-[11.5px] tracking-[0.14em] uppercase font-bold text-ds-muted mb-2">
            The verdict
          </div>
          <h3 className="text-[22px] font-bold tracking-[-0.02em] m-0 mb-2">
            <span className="text-ds-accent">{winner.name}</span> wins on overall score.
          </h3>
          <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.65]">{computedVerdict}</p>
          <div className="flex gap-2 flex-wrap mt-4">
            {products.map((p, i) => (
              <TrackedAffiliateLink
                key={p.slug}
                product={p}
                position={i + 1}
                surface="three_way"
                className={`text-[13px] font-semibold px-4 py-[8px] rounded-[8px] focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 ${
                  p === winner
                    ? 'bg-ds-accent hover:bg-ds-accent-press text-white'
                    : 'bg-ds-card hover:bg-ds-card-sub text-ds-ink border border-ds-border'
                }`}
              >
                Check {p.name} ({formatPrice(p)}/mo) →
              </TrackedAffiliateLink>
            ))}
          </div>
        </Card>

        {/* Side-by-side-by-side specs */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-3">Side-by-side-by-side</h2>
        <Card padding={0}>
          <div
            className="grid bg-ds-card-sub border-b border-ds-border px-[22px] py-3 text-[11px] uppercase tracking-[0.1em] font-bold text-ds-muted"
            style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}
          >
            <div></div>
            {products.map((p) => (
              <div key={p.slug} className="text-center">{p.name}</div>
            ))}
          </div>
          {specRows.map((row) => (
            <div
              key={row.label}
              className="grid px-[22px] py-[13px] border-b border-ds-border last:border-b-0 items-center text-[13.5px]"
              style={{ gridTemplateColumns: '200px repeat(3, 1fr)' }}
            >
              <div className="text-ds-muted font-medium">{row.label}</div>
              {row.values.map((v, i) => {
                const isWinner = row.winner === i;
                return (
                  <div
                    key={i}
                    className={`text-center px-2 py-1 rounded-[6px] ${
                      isWinner ? 'bg-ds-accent-soft text-ds-accent font-bold' : 'text-ds-ink font-medium'
                    }`}
                  >
                    {v}
                    {isWinner && ' ✓'}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>

        {/* Clinical dosing audit */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-3">Clinical dosing audit</h2>
        <p className="text-[14px] text-ds-muted mb-4 leading-[1.55]">
          Each disclosed ingredient dose vs. minimum effective dose. Ingredients hidden inside proprietary blends cannot be evaluated.
        </p>
        <Card padding={0}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-ds-card-sub text-left">
                  <th className="px-[22px] py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">Ingredient</th>
                  <th className="px-[22px] py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">Clinical dose</th>
                  {products.map((p) => (
                    <th key={p.slug} className="px-[22px] py-3 font-semibold text-ds-muted text-[11px] uppercase tracking-[0.1em]">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ingredientRows.map((row) => (
                  <tr key={row.name} className="border-t border-ds-border">
                    <td className="px-[22px] py-3 text-ds-ink font-medium">{row.name}</td>
                    <td className="px-[22px] py-3 text-ds-muted text-[12.5px]">{row.clinicalDose}</td>
                    <td className="px-[22px] py-3 text-ds-ink ds-tabular">{renderDose(row.a)}</td>
                    <td className="px-[22px] py-3 text-ds-ink ds-tabular">{renderDose(row.b)}</td>
                    <td className="px-[22px] py-3 text-ds-ink ds-tabular">{renderDose(row.c)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Score breakdown */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-4">Score breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {products.map((p) => (
            <Card key={p.slug} padding={20}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-ds-ink text-[14px]">{p.name}</div>
                <ScorePill score={p.score} />
              </div>
              <div className="flex flex-col gap-2">
                {(Object.entries(p.scoreBreakdown) as [string, number][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[12.5px] text-ds-ink-soft">
                    <span className="capitalize">{k}</span>
                    <span className="ds-tabular font-semibold">{v}/10</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Choose A / B / C */}
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-4">Which one is right for you?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { p: productA, lines: whoIsForA },
            { p: productB, lines: whoIsForB },
            { p: productC, lines: whoIsForC },
          ].map(({ p, lines }) => (
            <Card key={p.slug} padding={20}>
              <h3 className="font-bold text-ds-ink mb-3 text-[15px]">Choose {p.name} if you…</h3>
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
        <h2 className="text-[26px] font-bold tracking-[-0.02em] mt-11 mb-4">Frequently asked questions</h2>
        <FaqAccordion items={faqItems} />

        {sources && sources.length > 0 && <Sources sources={sources} />}

        <div className="text-[13px] text-ds-muted mt-10 pb-10">
          <Link href={`${listicleHref}/`} className="text-ds-accent underline font-semibold">
            {uiStrings?.breadcrumb.backToBestNootropics ?? '← Back to Best Nootropics'} {currentYear}
          </Link>
        </div>
      </main>

      <FPFooter strings={uiStrings} />
    </div>
  );
}
