import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SchemaOrg } from '@nootropic/ui';
import { latamCountries, productsLatam } from '@nootropic/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return latamCountries.map(c => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const c = latamCountries.find(x => x.slug === country);
  if (!c) return {};
  return {
    title: `Los Mejores Nootrópicos en ${c.name} 2026 — Guía de Compra Latam`,
    description: `Compra nootrópicos en ${c.name}: regulaciones de importación, información de envío, notas de aduana y los mejores stacks para residentes de ${c.name}.`,
  };
}

const topProducts = productsLatam.slice().sort((a, b) => b.score - a.score).slice(0, 3);

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const c = latamCountries.find(x => x.slug === country);
  if (!c) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Los Mejores Nootrópicos en ${c.name} 2026`,
    author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Inicio</a>
          {' / '}
          <a href="/best-nootropics" className="hover:text-green-700">Los Mejores Nootrópicos Latam</a>
          {' / '}
          <span>{c.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Los Mejores Nootrópicos en {c.name} 2026
        </h1>
        <p className="text-sm text-gray-500 mb-8">Moneda: {c.currency} &nbsp;·&nbsp; Idioma: {c.language}</p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-2">Envío a {c.name}</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{c.shippingNote}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-amber-900 mb-2">Aduanas y Derechos de Importación</h2>
          <p className="text-sm text-amber-800 leading-relaxed">{c.customsNote}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mejores Opciones para Compradores en {c.name}</h2>
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
            ← Volver a Los Mejores Nootrópicos Latam 2026
          </a>
        </div>
      </article>
    </>
  );
}
