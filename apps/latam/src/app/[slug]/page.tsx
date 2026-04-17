import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AffiliateDisclosure, SchemaOrg, StickyCtaBar } from '@nootropic/ui';
import { productsLatam } from '@nootropic/data';

export const dynamicParams = false;

export function generateStaticParams() {
  return productsLatam.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productsLatam.find(p => p.slug === slug);
  if (!product) return {};
  return {
    title: `Reseña de ${product.name} 2026 — Guía de Compra para América Latina`,
    description: `Reseña independiente para América Latina de ${product.name}. Puntuación: ${product.score}/10. Auditoría de dosificación clínica y divulgación completa de afiliados.`,
  };
}

const pillarLabels: Record<string, string> = {
  ingredients: 'Calidad de ingredientes',
  dosing: 'Dosificación vs. evidencia clínica',
  transparency: 'Transparencia de la fórmula',
  value: 'Valor por dinero',
  trust: 'Confianza en la marca',
};

export default async function ProductReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productsLatam.find(p => p.slug === slug);
  if (!product) notFound();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    review: {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: String(product.score), bestRating: '10' },
      author: { '@type': 'Organization', name: 'The Nootropic Lab Editorial Team' },
      reviewBody: product.summary,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.score),
      bestRating: '10',
      ratingCount: '1',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://latam.thenootropiclab.com' },
      { '@type': 'ListItem', position: 2, name: 'Los Mejores Nootrópicos', item: 'https://latam.thenootropiclab.com/best-nootropics' },
      { '@type': 'ListItem', position: 3, name: `Reseña de ${product.name}` },
    ],
  };

  return (
    <>
      <SchemaOrg schema={productSchema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <StickyCtaBar productName={product.name} affiliateUrl={product.affiliateUrl} />

      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-500 mb-6">
          <a href="/" className="hover:text-green-700">Inicio</a>
          {' / '}
          <a href="/best-nootropics" className="hover:text-green-700">Los Mejores Nootrópicos</a>
          {' / '}
          <span>Reseña de {product.name}</span>
        </nav>

        {/* Author + date */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
          <span>Revisado por <strong className="text-gray-700">The Nootropic Lab Editorial Team</strong></span>
          <span>·</span>
          <span>Última actualización: {new Date().toLocaleDateString('es-419', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product.editorChoice && (
              <span className="editor-badge">Elección del Editor — América Latina 2026</span>
            )}
            <span className="text-xs text-gray-500">{product.brand}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Reseña de {product.name} 2026
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-green-700">{product.score}</span>
            <span className="text-gray-400 text-lg">/10</span>
            <div className="flex flex-wrap gap-1">
              {product.bestFor.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.summary}</p>

        <AffiliateDisclosure />

        {/* Table of Contents */}
        <nav className="bg-gray-50 rounded-lg p-4 mb-8 text-sm">
          <div className="font-semibold text-gray-700 mb-2">En esta reseña</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="#what-is-it" className="hover:text-green-700">¿Qué es {product.name}?</a></li>
            <li><a href="#how-it-works" className="hover:text-green-700">¿Cómo funciona?</a></li>
            <li><a href="#what-to-expect" className="hover:text-green-700">Qué esperar</a></li>
            <li><a href="#dosing-audit" className="hover:text-green-700">Auditoría de Dosificación Clínica</a></li>
            <li><a href="#score-breakdown" className="hover:text-green-700">Desglose de Puntuación</a></li>
            <li><a href="#pros-cons" className="hover:text-green-700">Pros y Contras</a></li>
            <li><a href="#alternatives" className="hover:text-green-700">Alternativas Similares</a></li>
          </ul>
        </nav>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-8">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Precio / mes</div>
            <div className="font-bold text-gray-900">${product.priceMonthlyUSD} USD</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Devolución</div>
            <div className="font-bold text-gray-900">{product.moneyBackDays} días</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Cafeína</div>
            <div className="font-bold text-gray-900">{product.caffeineFree ? 'Sin cafeína' : 'Contiene cafeína'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-0.5">Cápsulas / porción</div>
            <div className="font-bold text-gray-900">{product.capsulesPerServing}</div>
          </div>
          {product.trustpilotScore > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-0.5">Trustpilot</div>
              <div className="font-bold text-gray-900">
                {product.trustpilotScore}/5
                <span className="text-xs text-gray-400 font-normal ml-1">
                  ({product.trustpilotCount.toLocaleString()})
                </span>
              </div>
            </div>
          )}
        </div>

        <section className="mb-8 space-y-6">
          <div>
            <h2 id="what-is-it" className="text-xl font-bold text-gray-900 mb-2">¿Qué es {product.name}?</h2>
            <p className="text-gray-700 leading-relaxed">{product.whatItIs}</p>
          </div>
          <div>
            <h2 id="how-it-works" className="text-xl font-bold text-gray-900 mb-2">¿Cómo funciona?</h2>
            <p className="text-gray-700 leading-relaxed">{product.howItWorks}</p>
          </div>
          <div>
            <h2 id="what-to-expect" className="text-xl font-bold text-gray-900 mb-2">Qué esperar</h2>
            <p className="text-gray-700 leading-relaxed">{product.whatToExpect}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 id="dosing-audit" className="text-xl font-bold text-gray-900 mb-4">Auditoría de Dosificación Clínica</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 font-semibold text-gray-700">Ingrediente</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Dosis del producto</th>
                  <th className="px-3 py-2 font-semibold text-gray-700">Dosis clínica</th>
                  <th className="px-3 py-2 font-semibold text-gray-700 text-center">Adecuado</th>
                </tr>
              </thead>
              <tbody>
                {product.ingredientDosages.map((ing, i) => (
                  <tr key={ing.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-900 font-medium">{ing.name}</td>
                    <td className="px-3 py-2 text-gray-700">{ing.doseInProduct}</td>
                    <td className="px-3 py-2 text-gray-700">{ing.clinicalDose}</td>
                    <td className="px-3 py-2 text-center">
                      {ing.adequatelyDosed
                        ? <span className="text-green-600 font-bold">✓</span>
                        : <span className="text-red-500 font-bold">✗</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 id="score-breakdown" className="text-xl font-bold text-gray-900 mb-4">Desglose de Puntuación</h2>
          <div className="space-y-3">
            {(Object.entries(product.scoreBreakdown) as [string, number][]).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{pillarLabels[key]}</span>
                  <span className="font-semibold text-gray-900">{val}/10</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: `${val * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 id="pros-cons" className="text-xl font-bold text-gray-900 mb-4">Pros y Contras</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-3">Ventajas</h3>
              <ul className="space-y-2">
                {product.pros.map(pro => (
                  <li key={pro} className="flex gap-2 text-sm text-green-800">
                    <span className="shrink-0">✓</span><span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-semibold text-red-900 mb-3">Desventajas</h3>
              <ul className="space-y-2">
                {product.cons.map(con => (
                  <li key={con} className="flex gap-2 text-sm text-red-800">
                    <span className="shrink-0">✗</span><span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Similar Alternatives */}
        <section id="alternatives" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alternativas Similares</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {productsLatam
              .filter(p => p.slug !== product.slug)
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
              .map(alt => (
                <a
                  key={alt.slug}
                  href={`/${alt.slug}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-green-700 hover:shadow-sm transition-all"
                >
                  <div className="font-semibold text-gray-900 text-sm mb-1">{alt.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{alt.brand}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-bold text-sm">{alt.score}/10</span>
                    {alt.priceMonthlyUSD && (
                      <span className="text-xs text-gray-500">${alt.priceMonthlyUSD}/mo</span>
                    )}
                  </div>
                </a>
              ))}
          </div>
        </section>

        {/* Explore Ingredients */}
        <section className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold text-green-900 text-sm">¿Quieres entender los ingredientes?</div>
              <div className="text-xs text-green-800">Explora nuestra base de datos de ingredientes con calificación basada en evidencia y guías de dosificación clínica.</div>
            </div>
            <a href="/ingredients" className="text-sm font-semibold text-green-700 hover:text-green-600 shrink-0">
              Ver Ingredientes →
            </a>
          </div>
        </section>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Divulgación de afiliados: ganamos una comisión si realizas una compra a través del enlace a continuación.
            Esto no afecta nuestra puntuación.
          </p>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg text-base transition-colors"
          >
            {product.affiliateNetwork.includes('Amazon')
              ? 'Ver en Amazon →'
              : `Ver Precio Actual ($${product.priceMonthlyUSD}/mes) →`}
          </a>
        </div>

        <div className="text-sm text-gray-500">
          <a href="/best-nootropics" className="text-green-700 underline">
            ← Volver a Los Mejores Nootrópicos América Latina 2026
          </a>
        </div>
      </article>
    </>
  );
}
