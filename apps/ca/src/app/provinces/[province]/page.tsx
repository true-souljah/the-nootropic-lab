import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg } from '@nootropic/ui';
import { productsCA } from '@nootropic/data';

export const dynamicParams = false;

const provinces = [
  { slug: 'ontario', name: 'Ontario', note: 'Ontario is Canada\'s largest province by population. Health Canada-licensed retailers ship across the province. Mind Lab Pro and NooCube are the most popular stacks among Toronto\'s professional community.' },
  { slug: 'british-columbia', name: 'British Columbia', note: 'BC\'s wellness culture makes it one of Canada\'s strongest nootropic markets. Vancouver has a high concentration of biohackers. Most international brands ship in 5-8 days to BC.' },
  { slug: 'quebec', name: 'Quebec', note: 'Quebec buyers may prefer French-language customer support. Most major brands (Mind Lab Pro, NooCube) offer bilingual support. Products ship in USD — verify exchange rates before ordering.' },
  { slug: 'alberta', name: 'Alberta', note: 'Alberta is a strong market for performance-focused nootropics. Calgary and Edmonton receive most international shipments in 4-7 business days from the US.' },
  { slug: 'manitoba', name: 'Manitoba', note: 'Manitoba receives international supplement shipments typically in 5-9 business days from US-based warehouses.' },
  { slug: 'saskatchewan', name: 'Saskatchewan', note: 'Saskatchewan buyers typically receive international supplement orders in 5-9 business days. Most US brands ship via USPS or FedEx.' },
  { slug: 'nova-scotia', name: 'Nova Scotia', note: 'Nova Scotia receives shipments from the UK in 7-12 business days and from US warehouses in 5-8 days.' },
  { slug: 'new-brunswick', name: 'New Brunswick', note: 'New Brunswick is bilingual English-French. Most international brands ship here in 5-9 business days.' },
  { slug: 'prince-edward-island', name: 'Prince Edward Island', note: 'PEI receives international supplement shipments typically in 6-10 business days.' },
  { slug: 'newfoundland-and-labrador', name: 'Newfoundland and Labrador', note: 'Remote delivery to NL may take 7-12 business days for international orders.' },
];

export function generateStaticParams() {
  return provinces.map(p => ({ province: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ province: string }>;
}): Promise<Metadata> {
  const { province } = await params;
  const p = provinces.find(x => x.slug === province);
  if (!p) return {};
  return {
    title: `Best Nootropics in ${p.name} 2026 — Canadian Buyer's Guide`,
    description: `Buy nootropics in ${p.name}: Health Canada notes, shipping info, and top-rated stacks for ${p.name} residents.`,
  };
}

const topProducts = productsCA.slice().sort((a, b) => b.score - a.score).slice(0, 3);

export default async function ProvincePage({
  params,
}: {
  params: Promise<{ province: string }>;
}) {
  const { province } = await params;
  const p = provinces.find(x => x.slug === province);
  if (!p) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics in ${p.name} 2026`,
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <a href="/best-nootropics" className="hover:text-green-700">Best Nootropics Canada</a>
          {' / '}
          <span>{p.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in {p.name} 2026
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <p className="text-green-900 leading-relaxed text-sm">{p.note}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-gray-900 mb-2">Customs & Duties for {p.name}</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Orders under CAD $150 from the US typically enter duty-free under CUSMA/USMCA.
            UK brands like Mind Lab Pro add shipping but no Canadian duties on personal orders.
            All prices are in USD — check current CAD/USD exchange rate before ordering.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Picks for {p.name} Buyers
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <a
                key={product.slug}
                href={`/${product.slug}`}
                className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all"
              >
                <span className="text-2xl font-black text-gray-300 shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    {product.editorChoice && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Editor&apos;s Choice
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.summary}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Score: <strong className="text-green-700">{product.score}/10</strong></span>
                    <span>${product.priceMonthlyUSD}/mo USD</span>
                    <span>{product.moneyBackDays}-day money back</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            ← Back to Best Nootropics Canada 2026
          </a>
        </div>
      </article>
    </>
  );
}
