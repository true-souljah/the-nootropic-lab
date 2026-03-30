import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComparisonTable, AffiliateDisclosure, SchemaOrg } from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

interface StateData {
  slug: string;
  name: string;
  prop65: boolean;
  buyingNote: string;
}

const genericBuyingNote = (name: string) =>
  `All products in our ranking ship to ${name} with standard US delivery times of 3–5 business days. Order directly from the brand's official website for the best pricing and access to money-back guarantees — third-party marketplaces often charge premiums and may not honour the manufacturer's return policy. Subscribe-and-save options from brand sites typically save 10–20% versus one-time purchases.`;

const states: StateData[] = [
  {
    slug: 'alabama', name: 'Alabama', prop65: false,
    buyingNote: genericBuyingNote('Alabama'),
  },
  {
    slug: 'alaska', name: 'Alaska', prop65: false,
    buyingNote: 'Alaska buyers should order directly from brand websites rather than Amazon for the best shipping reliability. Some distributors apply surcharges to AK — brand sites typically offer free standard shipping with no state exceptions above a $50–70 order threshold. Allow 5–8 business days for delivery.',
  },
  {
    slug: 'arizona', name: 'Arizona', prop65: false,
    buyingNote: `${genericBuyingNote('Arizona')} Arizona's warm climate means supplements stored in a hot car or mailbox can degrade — opt for expedited shipping in summer months and store in a cool, dry cabinet.`,
  },
  {
    slug: 'arkansas', name: 'Arkansas', prop65: false,
    buyingNote: genericBuyingNote('Arkansas'),
  },
  {
    slug: 'california', name: 'California', prop65: true,
    buyingNote: 'California is the largest supplement market in the US. Most major brands have California-specific labelling (Prop 65 compliant). Order directly from brand websites for guaranteed up-to-date labelling — third-party resellers may carry older non-compliant stock. California also has one of the fastest delivery networks; next-day or 2-day shipping is available from most brand distribution centres in the Southwest.',
  },
  {
    slug: 'colorado', name: 'Colorado', prop65: false,
    buyingNote: `Colorado buyers benefit from the Denver/Boulder area's large natural health retail presence, but brand website pricing is consistently 10–15% lower than physical retail. ${genericBuyingNote('Colorado')} High-altitude storage has no known effect on capsule supplements.`,
  },
  {
    slug: 'connecticut', name: 'Connecticut', prop65: false,
    buyingNote: `Connecticut is in the Northeast distribution corridor — most brand sites deliver within 2–3 business days. ${genericBuyingNote('Connecticut')}`,
  },
  {
    slug: 'delaware', name: 'Delaware', prop65: false,
    buyingNote: genericBuyingNote('Delaware'),
  },
  {
    slug: 'florida', name: 'Florida', prop65: false,
    buyingNote: 'Florida buyers should be mindful of heat and humidity: do not leave deliveries in a hot mailbox or car. Store supplements in an air-conditioned environment. Most brands ship to Florida in 2–4 business days from East Coast distribution centres. Florida has strong supplement retail presence (GNC, Vitamin Shoppe, Total Nutrition), but brand website pricing and money-back guarantees are superior.',
  },
  {
    slug: 'georgia', name: 'Georgia', prop65: false,
    buyingNote: `Georgia benefits from Atlanta's position as a major logistics hub — most brand sites reach Atlanta and surrounding metro areas in 2–3 business days. ${genericBuyingNote('Georgia')}`,
  },
  {
    slug: 'hawaii', name: 'Hawaii', prop65: false,
    buyingNote: 'Hawaii buyers should order directly from brand websites that offer free standard shipping to Hawaii — not all brands do, so verify before ordering. Allow 5–8 business days for delivery. Heat and humidity during transit are considerations; supplements arrive sealed and should be stored in a cool, dry place. Some brands exclude Hawaii from expedited shipping offers.',
  },
  {
    slug: 'idaho', name: 'Idaho', prop65: false,
    buyingNote: genericBuyingNote('Idaho'),
  },
  {
    slug: 'illinois', name: 'Illinois', prop65: false,
    buyingNote: 'Illinois — and Chicago in particular — is well-served by Midwest distribution centres. Most brands on our list deliver within 2–3 business days to the Chicago metro area and 3–5 business days to downstate Illinois. Direct brand website orders consistently beat Amazon pricing due to subscribe-and-save programmes and first-order discount codes.',
  },
  {
    slug: 'indiana', name: 'Indiana', prop65: false,
    buyingNote: genericBuyingNote('Indiana'),
  },
  {
    slug: 'iowa', name: 'Iowa', prop65: false,
    buyingNote: genericBuyingNote('Iowa'),
  },
  {
    slug: 'kansas', name: 'Kansas', prop65: false,
    buyingNote: genericBuyingNote('Kansas'),
  },
  {
    slug: 'kentucky', name: 'Kentucky', prop65: false,
    buyingNote: genericBuyingNote('Kentucky'),
  },
  {
    slug: 'louisiana', name: 'Louisiana', prop65: false,
    buyingNote: `Louisiana's subtropical climate means summer temperatures can degrade supplements left in hot vehicles or mailboxes. Store in a cool, dry location immediately upon receipt. ${genericBuyingNote('Louisiana')}`,
  },
  {
    slug: 'maine', name: 'Maine', prop65: false,
    buyingNote: genericBuyingNote('Maine'),
  },
  {
    slug: 'maryland', name: 'Maryland', prop65: false,
    buyingNote: `Maryland sits in the mid-Atlantic corridor. Most brands deliver to the Baltimore/DC metro in 2–3 business days. ${genericBuyingNote('Maryland')}`,
  },
  {
    slug: 'massachusetts', name: 'Massachusetts', prop65: false,
    buyingNote: 'Massachusetts — and Boston in particular — has a large health-conscious population and excellent delivery infrastructure. Most brands deliver within 2–3 business days. Massachusetts has no supplement-specific state regulations beyond federal FDA rules. Direct brand site ordering gives access to third-party testing certificates and full money-back guarantees not typically available through Amazon.',
  },
  {
    slug: 'michigan', name: 'Michigan', prop65: false,
    buyingNote: genericBuyingNote('Michigan'),
  },
  {
    slug: 'minnesota', name: 'Minnesota', prop65: false,
    buyingNote: genericBuyingNote('Minnesota'),
  },
  {
    slug: 'mississippi', name: 'Mississippi', prop65: false,
    buyingNote: genericBuyingNote('Mississippi'),
  },
  {
    slug: 'missouri', name: 'Missouri', prop65: false,
    buyingNote: genericBuyingNote('Missouri'),
  },
  {
    slug: 'montana', name: 'Montana', prop65: false,
    buyingNote: `Montana's rural geography means shipping times can be longer for remote addresses — allow 5–7 business days. ${genericBuyingNote('Montana')}`,
  },
  {
    slug: 'nebraska', name: 'Nebraska', prop65: false,
    buyingNote: genericBuyingNote('Nebraska'),
  },
  {
    slug: 'nevada', name: 'Nevada', prop65: false,
    buyingNote: `Nevada's desert climate means supplements should not be left in vehicles or exposed to high heat. Las Vegas and Reno benefit from West Coast distribution — most brands deliver in 2–3 business days. ${genericBuyingNote('Nevada')}`,
  },
  {
    slug: 'new-hampshire', name: 'New Hampshire', prop65: false,
    buyingNote: genericBuyingNote('New Hampshire'),
  },
  {
    slug: 'new-jersey', name: 'New Jersey', prop65: false,
    buyingNote: `New Jersey is one of the best-served states for supplement delivery — multiple distribution centres in the tri-state area mean most brands deliver next-day or in 2 business days. ${genericBuyingNote('New Jersey')}`,
  },
  {
    slug: 'new-mexico', name: 'New Mexico', prop65: false,
    buyingNote: genericBuyingNote('New Mexico'),
  },
  {
    slug: 'new-york', name: 'New York', prop65: false,
    buyingNote: 'New York City and its metro area receive some of the fastest supplement deliveries in the country — next-day or 2-day shipping is available from most brands. Upstate New York should allow 3–5 business days. New York has no supplement-specific state laws beyond federal FDA regulations. Brand website purchases are recommended over third-party marketplaces for access to money-back guarantee programmes and third-party COA documentation.',
  },
  {
    slug: 'north-carolina', name: 'North Carolina', prop65: false,
    buyingNote: genericBuyingNote('North Carolina'),
  },
  {
    slug: 'north-dakota', name: 'North Dakota', prop65: false,
    buyingNote: genericBuyingNote('North Dakota'),
  },
  {
    slug: 'ohio', name: 'Ohio', prop65: false,
    buyingNote: `Ohio's central location and strong logistics infrastructure means most brands deliver in 2–3 business days statewide. ${genericBuyingNote('Ohio')}`,
  },
  {
    slug: 'oklahoma', name: 'Oklahoma', prop65: false,
    buyingNote: genericBuyingNote('Oklahoma'),
  },
  {
    slug: 'oregon', name: 'Oregon', prop65: false,
    buyingNote: 'Oregon has a health-conscious consumer base and strong natural products retail presence. Oregon has no state sales tax — supplement purchases are tax-free for in-state buyers shopping online. Most brands ship from West Coast distribution centres; Portland and Eugene typically receive deliveries in 2–3 business days.',
  },
  {
    slug: 'pennsylvania', name: 'Pennsylvania', prop65: false,
    buyingNote: `Pennsylvania is well within the Northeast distribution corridor. Philadelphia and Pittsburgh receive most brand deliveries in 2–3 business days. ${genericBuyingNote('Pennsylvania')}`,
  },
  {
    slug: 'rhode-island', name: 'Rhode Island', prop65: false,
    buyingNote: genericBuyingNote('Rhode Island'),
  },
  {
    slug: 'south-carolina', name: 'South Carolina', prop65: false,
    buyingNote: genericBuyingNote('South Carolina'),
  },
  {
    slug: 'south-dakota', name: 'South Dakota', prop65: false,
    buyingNote: genericBuyingNote('South Dakota'),
  },
  {
    slug: 'tennessee', name: 'Tennessee', prop65: false,
    buyingNote: genericBuyingNote('Tennessee'),
  },
  {
    slug: 'texas', name: 'Texas', prop65: false,
    buyingNote: 'Texas is the second-largest supplement market in the US. The Dallas-Fort Worth and Houston metro areas have multiple regional distribution centres — most brands deliver in 2–3 business days. Summer temperatures in Texas are extreme: never leave supplements in a hot car or outdoor mailbox. Brand website ordering includes access to the best pricing and money-back guarantees, which third-party marketplace sellers often do not honour.',
  },
  {
    slug: 'utah', name: 'Utah', prop65: false,
    buyingNote: 'Utah is notable as the home of the US dietary supplement industry — numerous major supplement manufacturers are based in the Salt Lake City area. This means Utah buyers often receive the fastest direct brand shipping in the country (1–2 business days for brands with Utah warehouses). Utah also has the highest per-capita supplement consumption in the US, with strong local retail options.',
  },
  {
    slug: 'vermont', name: 'Vermont', prop65: false,
    buyingNote: genericBuyingNote('Vermont'),
  },
  {
    slug: 'virginia', name: 'Virginia', prop65: false,
    buyingNote: genericBuyingNote('Virginia'),
  },
  {
    slug: 'washington', name: 'Washington', prop65: false,
    buyingNote: "Washington State — particularly the Seattle tech corridor — has one of the highest nootropics adoption rates in the country, driven by the biohacking culture in the technology sector. Most brands deliver to the Seattle/Tacoma metro in 2–3 business days from West Coast distribution centres. Washington has no state income tax but does apply sales tax to supplement purchases.",
  },
  {
    slug: 'west-virginia', name: 'West Virginia', prop65: false,
    buyingNote: genericBuyingNote('West Virginia'),
  },
  {
    slug: 'wisconsin', name: 'Wisconsin', prop65: false,
    buyingNote: genericBuyingNote('Wisconsin'),
  },
  {
    slug: 'wyoming', name: 'Wyoming', prop65: false,
    buyingNote: 'Wyoming has no state income tax and no state sales tax on most goods — supplement purchases may be tax-free for in-state buyers. Allow 4–6 business days for delivery to rural areas. Most brands ship to Wyoming without surcharges.',
  },
];

export const dynamicParams = false;

export function generateStaticParams() {
  return states.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const state = states.find(s => s.slug === slug);
  if (!state) return {};
  return {
    title: `Best Nootropics in ${state.name} 2026 — Expert Ranked`,
    description: `Independent comparison of the best nootropic supplements available in ${state.name} in 2026. Every ingredient audited against clinical trials. Transparent scoring and affiliate disclosure.`,
    alternates: {
      languages: {
        'en-US': `/${state.slug}/best-nootropics`,
        'es-US': '/es/mejores-nootropicos',
      },
    },
  };
}

const topProducts = productsUS
  .slice()
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

export default async function StateNootropicsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = states.find(s => s.slug === slug);
  if (!state) notFound();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Nootropic Supplements in ${state.name} 2026`,
    itemListElement: productsUS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://thenootropiclab.com/${p.slug}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Are nootropics legal in ${state.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. All products in our ranking are sold legally in ${state.name} as dietary supplements regulated under the FDA's DSHEA framework. No prescription is required.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where can I buy nootropics in ${state.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The best option is ordering directly from each brand's official website — you get the lowest price, access to money-back guarantees, and current product formulations. Third-party marketplaces like Amazon may carry the products but often at higher prices and without the manufacturer's return policy.`,
        },
      },
    ],
  };

  return (
    <>
      <SchemaOrg schema={itemListSchema} />
      <SchemaOrg schema={faqSchema} />
      <article className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-2 text-xs text-gray-500">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in {state.name} 2026
        </h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          We reviewed {productsUS.length} nootropic supplements for {state.name} buyers, auditing
          every ingredient dose against peer-reviewed clinical trials. Below is our ranked
          comparison with full scoring breakdown.
        </p>

        {state.prop65 && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-6">
            <h2 className="font-bold text-amber-900 mb-2">
              ⚠ California Proposition 65 Notice
            </h2>
            <p className="text-sm text-amber-800 leading-relaxed">
              California&apos;s Proposition 65 requires businesses to provide warnings about
              significant exposures to chemicals that cause cancer, birth defects, or other
              reproductive harm. Some nootropic supplements sold in California may carry Prop 65
              warnings for trace minerals or herbal compounds. Check the product label and
              manufacturer&apos;s website for the most current California-specific labeling before
              purchasing.
            </p>
          </div>
        )}

        <AffiliateDisclosure />

        {/* Top 3 picks */}
        <section className="my-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Top 3 Picks for {state.name} Buyers
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Ranked by our independent score. All ship to {state.name} directly from the brand.
          </p>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <a
                key={p.slug}
                href={`/${p.slug}`}
                className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all"
              >
                <span className="text-3xl font-black text-gray-200 shrink-0 leading-none mt-0.5">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    {p.editorChoice && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Editor&apos;s Choice
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{p.summary}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Score: <strong className="text-green-700">{p.score}/10</strong></span>
                    {p.priceMonthlyUSD && <span>${p.priceMonthlyUSD}/mo</span>}
                    <span>{p.moneyBackDays}-day money-back</span>
                    <span>Trustpilot {p.trustpilotScore}/5</span>
                  </div>
                </div>
                <span className="text-green-700 text-sm font-semibold shrink-0 hidden sm:block">
                  View review →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Buying in this state */}
        <section className="my-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Buying Nootropics in {state.name}
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">{state.buyingNote}</p>
          </div>

          {/* Legality FAQ */}
          <div className="mt-4 space-y-2">
            <details className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                <span className="text-sm">Are nootropics legal in {state.name}?</span>
                <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">▾</span>
              </summary>
              <div className="px-5 pb-4 pt-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Yes. All products in our ranking are sold legally in {state.name} as dietary supplements
                  regulated under the FDA&apos;s DSHEA (Dietary Supplement Health and Education Act) framework.
                  No prescription is required. Manufacturers must follow FDA current Good Manufacturing Practice
                  (cGMP) guidelines. None of the ingredients in our ranked products are controlled substances.
                </p>
              </div>
            </details>
            <details className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                <span className="text-sm">Should I buy from Amazon or the brand&apos;s website?</span>
                <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">▾</span>
              </summary>
              <div className="px-5 pb-4 pt-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Brand website is consistently better: lower price (brand sites offer loyalty discounts and
                  subscribe-and-save), guaranteed authenticity, access to the full money-back guarantee, and
                  direct access to third-party Certificate of Analysis (COA) documentation. Amazon third-party
                  sellers may stock older batches and frequently do not honour the manufacturer&apos;s return policy.
                </p>
              </div>
            </details>
          </div>
        </section>

        <div className="mb-4">
          <a href="#comparison-table" className="text-green-700 underline text-sm font-medium">
            → Jump to full comparison table
          </a>
        </div>

        <section id="comparison-table">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            2026 Nootropic Comparison — {state.name}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Sort by score, price, money-back guarantee, or Trustpilot rating.
          </p>
          <ComparisonTable products={productsUS} market="us" />
        </section>

        <div className="mt-10 text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            → View national comparison: Best Nootropics 2026
          </a>
        </div>
      </article>
    </>
  );
}
