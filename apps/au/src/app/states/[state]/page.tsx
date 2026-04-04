import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg } from '@nootropic/ui';
import { productsAU, auStates } from '@nootropic/data';

export const dynamicParams = false;

const states = auStates;

export function generateStaticParams() {
  return states.map(s => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const s = states.find(x => x.slug === state);
  if (!s) return {};
  return {
    title: `Best Nootropics in ${s.name} 2026 — Australian Buyer's Guide`,
    description: `Buy nootropics in ${s.name}: TGA import notes, shipping info, and top-rated stacks for ${s.name} residents.`,
  };
}

const topProducts = productsAU.slice().sort((a, b) => b.score - a.score).slice(0, 3);

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const s = states.find(x => x.slug === state);
  if (!s) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Best Nootropics in ${s.name} 2026`,
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Home</a>
          {' / '}
          <a href="/best-nootropics" className="hover:text-green-700">Best Nootropics AU</a>
          {' / '}
          <span>{s.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Nootropics in {s.name} 2026
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8">
          <p className="text-green-900 leading-relaxed text-sm">{s.note}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-blue-900 mb-2">TGA Personal Import Rules</h2>
          <p className="text-sm text-blue-800 leading-relaxed">
            Residents of {s.name} can personally import up to 3 months&apos; supply of nootropic
            supplements without a TGA permit. Products must be for personal use only.
            GST (10%) may be applied at checkout for orders by Australian residents.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Picks for {s.name} Buyers
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
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            ← Back to Best Nootropics Australia 2026
          </a>
        </div>
      </article>
    </>
  );
}
