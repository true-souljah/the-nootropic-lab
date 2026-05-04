import Link from 'next/link';
import type { Product, Author } from '@nootropic/data';
import { buildPersonAuthorReference } from '@nootropic/data';
import AffiliateDisclosure from './AffiliateDisclosure';
import SchemaOrg from './SchemaOrg';
import { headToHeadPageEnDefaults, tpl } from './templateStrings';
import type { HeadToHeadPageStrings } from './templateStrings';

export interface HeadToHeadFAQ {
  q: string;
  a: string;
}

interface Props {
  productA: Product;
  productB: Product;
  /** e.g. https://thenootropiclab.com — no trailing slash */
  siteUrl: string;
  author: Author;
  /** Optional override; defaults to a computed winner-vs-loser explanation */
  verdictParagraph?: string;
  faqItems: HeadToHeadFAQ[];
  /** Bullet points for "Choose X if you..." for product A */
  whoIsForA: string[];
  /** Bullet points for "Choose X if you..." for product B */
  whoIsForB: string[];
  /** Where the listicle lives, e.g. /best-nootropics. Defaults to /best-nootropics. */
  listicleHref?: string;
  /** Currency formatter — defaults to USD */
  formatPrice?: (product: Product) => string;
  /** Optional locale-specific overrides for chrome strings (English defaults are used otherwise) */
  strings?: Partial<HeadToHeadPageStrings>;
}

function defaultPriceFormat(p: Product) {
  if (p.priceMonthlyUSD) return `$${p.priceMonthlyUSD}`;
  if (p.priceMonthlyEUR) return `€${p.priceMonthlyEUR}`;
  if (p.priceMonthlyCAD) return `C$${p.priceMonthlyCAD}`;
  if (p.priceMonthlyAUD) return `A$${p.priceMonthlyAUD}`;
  if (p.priceMonthlyJPY) return `¥${p.priceMonthlyJPY.toLocaleString()}`;
  return 'Varies';
}

export default function HeadToHeadPage({
  productA,
  productB,
  siteUrl,
  author,
  verdictParagraph,
  faqItems,
  whoIsForA,
  whoIsForB,
  listicleHref = '/best-nootropics',
  formatPrice = defaultPriceFormat,
  strings,
}: Props) {
  const s: HeadToHeadPageStrings = { ...headToHeadPageEnDefaults, ...strings };
  const currentYear = new Date().getFullYear();
  const winner = productA.score >= productB.score ? productA : productB;
  const loser = winner === productA ? productB : productA;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${productA.name} vs ${productB.name} ${currentYear}: Head-to-Head Clinical Dosing Audit`,
    datePublished: `${currentYear}-04-30`,
    dateModified: new Date().toISOString().split('T')[0],
    author: buildPersonAuthorReference(author, siteUrl),
    publisher: { '@type': 'Organization', name: 'The Nootropic Lab', url: siteUrl },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Best Nootropics', item: `${siteUrl}${listicleHref}/` },
      { '@type': 'ListItem', position: 3, name: `${productA.name} vs ${productB.name}` },
    ],
  };

  // Build a unified ingredient table (union of both products' ingredients)
  type Row = {
    name: string;
    aDose: string | null;
    aAdequate: boolean | null;
    bDose: string | null;
    bAdequate: boolean | null;
    clinicalDose: string;
  };
  const allIngredients = new Map<string, Row>();
  for (const ing of productA.ingredientDosages) {
    allIngredients.set(ing.name, {
      name: ing.name,
      aDose: ing.doseInProduct,
      aAdequate: ing.adequatelyDosed,
      bDose: null,
      bAdequate: null,
      clinicalDose: ing.clinicalDose,
    });
  }
  for (const ing of productB.ingredientDosages) {
    const existing = allIngredients.get(ing.name);
    if (existing) {
      existing.bDose = ing.doseInProduct;
      existing.bAdequate = ing.adequatelyDosed;
    } else {
      allIngredients.set(ing.name, {
        name: ing.name,
        aDose: null,
        aAdequate: null,
        bDose: ing.doseInProduct,
        bAdequate: ing.adequatelyDosed,
        clinicalDose: ing.clinicalDose,
      });
    }
  }
  const ingredientRows = Array.from(allIngredients.values());

  const computedVerdict = verdictParagraph ??
    `${winner.name} scores ${winner.score}/10 in our 5-pillar audit; ${loser.name} scores ${loser.score}/10. ` +
    `The biggest delta is at the formula-transparency pillar — see the dosing table below.`;

  return (
    <>
      <SchemaOrg schema={articleSchema} />
      <SchemaOrg schema={faqSchema} />
      <SchemaOrg schema={itemListSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <article className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">{s.home}</a>
          {' / '}
          <a href={`${listicleHref}/`} className="hover:text-green-700">{s.bestNootropics}</a>
          {' / '}
          <span>{productA.name} vs {productB.name}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>
            {s.reviewedBy}{' '}
            <Link href={`/authors/${author.slug}/`} className="text-gray-700 hover:text-green-700 underline">
              <strong>{author.name}</strong>
            </Link>
          </span>
          <span>·</span>
          <span>
            {s.lastUpdated}{' '}
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {productA.name} vs {productB.name} — Independent Head-to-Head
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Below is the side-by-side breakdown using the same clinical-dose methodology applied to every review on
          this site.
        </p>

        <AffiliateDisclosure />

        <section className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 my-8">
          <div className="editor-badge mb-2 inline-block">{s.verdict}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{tpl(s.winnerHeadline, { name: winner.name })}</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{computedVerdict}</p>
          <div className="flex gap-3 flex-wrap">
            <a
              href={productA.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="bg-green-700 hover:bg-green-600 text-white text-sm font-bold px-5 py-2 rounded-lg"
            >
              {tpl(s.checkProductWithPrice, { name: productA.name, price: formatPrice(productA) })}
            </a>
            <a
              href={productB.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold px-5 py-2 rounded-lg border border-gray-300"
            >
              {tpl(s.checkProduct, { name: productB.name })}
            </a>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{s.quickSpecsHeading}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">{s.spec}</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">{productA.name}</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">{productB.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">{s.scoreLabel}</td>
                  <td className="px-3 py-2 font-bold text-green-700">{productA.score}/10</td>
                  <td className="px-3 py-2 font-bold text-green-700">{productB.score}/10</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">{s.pricePerMonth}</td>
                  <td className="px-3 py-2 text-gray-700">{formatPrice(productA)}</td>
                  <td className="px-3 py-2 text-gray-700">{formatPrice(productB)}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">{s.caffeineFreeLabel}</td>
                  <td className="px-3 py-2 text-gray-700">{productA.caffeineFree ? s.yes : s.no}</td>
                  <td className="px-3 py-2 text-gray-700">{productB.caffeineFree ? s.yes : s.no}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">{s.capsulesPerServing}</td>
                  <td className="px-3 py-2 text-gray-700">{productA.capsulesPerServing}</td>
                  <td className="px-3 py-2 text-gray-700">{productB.capsulesPerServing}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-900">{s.moneyBack}</td>
                  <td className="px-3 py-2 text-gray-700">{productA.moneyBackDays} {s.daysSuffix}</td>
                  <td className="px-3 py-2 text-gray-700">{productB.moneyBackDays} {s.daysSuffix}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">{s.trustpilot}</td>
                  <td className="px-3 py-2 text-gray-700">
                    {productA.trustpilotScore
                      ? `${productA.trustpilotScore}/5 (${productA.trustpilotCount?.toLocaleString() ?? 'n/a'})`
                      : s.notTracked}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {productB.trustpilotScore
                      ? `${productB.trustpilotScore}/5 (${productB.trustpilotCount?.toLocaleString() ?? 'n/a'})`
                      : s.notTracked}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{s.clinicalDosingHeading}</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{s.clinicalDosingIntro}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">{s.ingredient}</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">{s.clinicalDose}</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">{productA.name}</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">{productB.name}</th>
                </tr>
              </thead>
              <tbody>
                {ingredientRows.map((row, i) => (
                  <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900 font-medium">{row.name}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{row.clinicalDose}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.aDose
                        ? <>
                            {row.aDose}{' '}
                            {row.aAdequate
                              ? <span className="text-green-600 font-bold">✓</span>
                              : <span className="text-red-500 font-bold">✗</span>}
                          </>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-3 py-2 text-gray-700">
                      {row.bDose
                        ? <>
                            {row.bDose}{' '}
                            {row.bAdequate
                              ? <span className="text-green-600 font-bold">✓</span>
                              : <span className="text-red-500 font-bold">✗</span>}
                          </>
                        : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            {s.citationFooter}{' '}
            <Link href="/methodology/" className="text-green-700 underline">{s.methodologyLink}</Link>.
          </p>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{s.scoreBreakdownHeading}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[productA, productB].map(p => (
              <div key={p.id}>
                <div className="font-bold text-gray-900 mb-3">{p.name} — {p.score}/10</div>
                <div className="space-y-3 text-sm">
                  {(Object.entries(p.scoreBreakdown) as [string, number][]).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between mb-1 text-gray-700">
                        <span className="capitalize">{k}</span>
                        <span className="font-semibold">{v}/10</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-600 rounded-full" style={{ width: `${v * 10}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{s.prosConsHeading}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[productA, productB].map(p => (
              <div key={p.id}>
                <div className="font-bold text-gray-900 mb-3">{p.name}</div>
                <div className="bg-green-50 rounded-xl p-4 mb-3">
                  <h3 className="font-semibold text-green-900 mb-2 text-sm">{s.prosLabel}</h3>
                  <ul className="space-y-2">
                    {p.pros.map(pro => (
                      <li key={pro} className="flex gap-2 text-sm text-green-800">
                        <span className="shrink-0">✓</span><span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <h3 className="font-semibold text-red-900 mb-2 text-sm">{s.consLabel}</h3>
                  <ul className="space-y-2">
                    {p.cons.map(con => (
                      <li key={con} className="flex gap-2 text-sm text-red-800">
                        <span className="shrink-0">✗</span><span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{s.whoIsForHeading}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">{tpl(s.chooseIfYou, { name: productA.name })}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {whoIsForA.map(line => <li key={line}>· {line}</li>)}
              </ul>
            </div>
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-2">{tpl(s.chooseIfYou, { name: productB.name })}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {whoIsForB.map(line => <li key={line}>· {line}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="my-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{s.faqHeading}</h2>
          <div className="space-y-4">
            {faqItems.map(item => (
              <div key={item.q} className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10 bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">{s.readReviewsHeading}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href={`/${productA.slug}/`} className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">{tpl(s.productReviewCard, { name: productA.name })}</div>
              <div className="text-xs text-gray-500">{tpl(s.scoreCardLine, { score: productA.score })}</div>
            </Link>
            <Link href={`/${productB.slug}/`} className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">{tpl(s.productReviewCard, { name: productB.name })}</div>
              <div className="text-xs text-gray-500">{tpl(s.scoreCardLine, { score: productB.score })}</div>
            </Link>
            <Link href={`${listicleHref}/`} className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">{tpl(s.bestNootropicsCard, { year: currentYear })}</div>
              <div className="text-xs text-gray-500">{s.fullRankedComparison}</div>
            </Link>
            <Link href="/methodology/" className="block bg-white rounded-lg p-4 border border-green-100 hover:border-green-300 transition-colors">
              <div className="font-semibold text-gray-900 text-sm mb-1">{s.methodologyCard}</div>
              <div className="text-xs text-gray-500">{s.howWeAuditDoses}</div>
            </Link>
          </div>
        </section>

        <div className="text-sm text-gray-500 mt-10">
          <Link href={`${listicleHref}/`} className="text-green-700 underline">
            {tpl(s.backToBest, { year: currentYear })}
          </Link>
        </div>
      </article>
    </>
  );
}
